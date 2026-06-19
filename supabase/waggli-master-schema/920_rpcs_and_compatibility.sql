-- Waggli RPCs and compatibility views.
-- These preserve current app behavior while the app is gradually moved to canonical names.

create or replace view public.reference_vaccinations
with (security_invoker = true) as
select
  id,
  species_code as species,
  name as vaccine_name,
  category as vaccine_type,
  description,
  default_validity_months,
  default_booster_interval_months,
  minimum_age_weeks,
  travel_relevant,
  aliases
from public.ref_vaccines;

create or replace view public.reference_medications
with (security_invoker = true) as
select
  id,
  name,
  generic_name,
  brand_names,
  species_codes,
  medication_class,
  forms,
  common_dosage_units,
  route_options,
  prescription_required,
  warnings,
  contraindications,
  interactions,
  aliases
from public.ref_medications;

create or replace view public.weight_entries
with (security_invoker = true) as
select
  id,
  pet_id,
  weight,
  coalesce(weight_unit, unit) as unit,
  recorded_date,
  notes,
  created_at
from public.weight_logs;

create or replace view public.weight_history
with (security_invoker = true) as
select
  id,
  pet_id,
  weight,
  coalesce(weight_unit, unit) as weight_unit,
  recorded_date,
  recorded_at,
  body_condition_score,
  notes,
  created_at
from public.weight_logs;

create or replace function public.calculate_health_score(p_pet_id uuid)
returns table (
  overall_score int,
  score_category text,
  preventive_care int,
  vaccination int,
  weight_management int,
  data_completeness int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_preventive int := 0;
  v_vaccination int := 0;
  v_weight int := 0;
  v_completeness int := 0;
  v_overall int := 0;
  v_category text := 'unknown';
  v_last_visit date;
  v_overdue_vaccines int := 0;
  v_latest_weight numeric;
  v_ideal_min numeric;
  v_ideal_max numeric;
begin
  if not public.can_read_pet(p_pet_id) and not public.is_admin() then
    raise exception 'Not allowed' using errcode = '42501';
  end if;

  select max(coalesce(visit_date, visited_at::date)) into v_last_visit
  from public.medical_visits
  where pet_id = p_pet_id;

  v_preventive := case
    when v_last_visit is null then 20
    when v_last_visit >= current_date - interval '12 months' then 100
    when v_last_visit >= current_date - interval '18 months' then 70
    else 35
  end;

  select count(*) into v_overdue_vaccines
  from public.vaccinations
  where pet_id = p_pet_id
    and coalesce(next_due_date, next_due_at) is not null
    and coalesce(next_due_date, next_due_at) < current_date;

  v_vaccination := case
    when v_overdue_vaccines = 0 then 100
    when v_overdue_vaccines = 1 then 70
    else 40
  end;

  select wl.weight into v_latest_weight
  from public.weight_logs wl
  where wl.pet_id = p_pet_id
  order by wl.recorded_at desc nulls last, wl.recorded_date desc nulls last
  limit 1;

  select ideal_weight_min, ideal_weight_max into v_ideal_min, v_ideal_max
  from public.pets
  where id = p_pet_id;

  v_weight := case
    when v_latest_weight is null then 50
    when v_ideal_min is not null and v_ideal_max is not null and v_latest_weight between v_ideal_min and v_ideal_max then 100
    when v_ideal_min is not null and v_latest_weight < v_ideal_min then 70
    when v_ideal_max is not null and v_latest_weight > v_ideal_max then 70
    else 80
  end;

  select (
    (case when p.name is not null then 10 else 0 end) +
    (case when p.species is not null then 10 else 0 end) +
    (case when p.date_of_birth is not null then 10 else 0 end) +
    (case when p.microchip_number is not null then 10 else 0 end) +
    (case when exists(select 1 from public.vaccinations v where v.pet_id = p.id) then 20 else 0 end) +
    (case when exists(select 1 from public.medical_visits mv where mv.pet_id = p.id) then 20 else 0 end) +
    (case when exists(select 1 from public.weight_logs wl where wl.pet_id = p.id) then 20 else 0 end)
  ) into v_completeness
  from public.pets p
  where p.id = p_pet_id;

  v_overall := round((v_preventive * 0.30) + (v_vaccination * 0.30) + (v_weight * 0.20) + (coalesce(v_completeness, 0) * 0.20));
  v_category := case
    when v_overall >= 85 then 'excellent'
    when v_overall >= 70 then 'good'
    when v_overall >= 50 then 'fair'
    else 'needs_attention'
  end;

  insert into public.health_scores (
    pet_id,
    overall_score,
    score_category,
    preventive_care_score,
    vaccination_score,
    weight_score,
    weight_management_score,
    data_completeness_score,
    data_completeness_percentage,
    component_details
  )
  values (
    p_pet_id,
    v_overall,
    v_category,
    v_preventive,
    v_vaccination,
    v_weight,
    v_weight,
    v_completeness,
    v_completeness,
    jsonb_build_object(
      'last_visit_date', v_last_visit,
      'overdue_vaccines', v_overdue_vaccines,
      'latest_weight', v_latest_weight
    )
  );

  return query select v_overall, v_category, v_preventive, v_vaccination, v_weight, coalesce(v_completeness, 0);
end;
$$;

create or replace function public.get_public_pet_details(share_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pet_record record;
  v_share_id uuid;
  v_pet_id uuid;
  permission_level text := 'basic';
begin
  select pst.id, pst.pet_id, pst.permission_level into v_share_id, v_pet_id, permission_level
  from public.pet_share_tokens pst
  where pst.token = share_token
    and pst.is_active = true
    and (pst.expires_at is null or pst.expires_at > now())
  limit 1;

  if not found then
    select sl.id, sl.pet_id, coalesce(sl.permissions->>'preset', 'passport') into v_share_id, v_pet_id, permission_level
    from public.share_links sl
    where sl.token = share_token
      and sl.active = true
      and (sl.expires_at is null or sl.expires_at > now())
    limit 1;
  end if;

  if not found then
    select ps.id, ps.pet_id, ps.share_type into v_share_id, v_pet_id, permission_level
    from public.public_shares ps
    where ps.token = share_token
      and ps.active = true
      and ps.revoked_at is null
      and (ps.expires_at is null or ps.expires_at > now())
      and (ps.max_views is null or ps.view_count < ps.max_views)
    limit 1;
  end if;

  if not found then
    return jsonb_build_object('error', 'Invalid or expired token');
  end if;

  select * into pet_record
  from public.pets
  where id = v_pet_id;

  if not found then
    return jsonb_build_object('error', 'Pet not found');
  end if;

  permission_level := coalesce(permission_level, 'basic');

  update public.pet_share_tokens
  set accessed_count = accessed_count + 1,
      last_accessed_at = now()
  where id = v_share_id;

  update public.public_shares
  set view_count = view_count + 1
  where id = v_share_id;

  return jsonb_build_object(
    'pet', jsonb_build_object(
      'id', pet_record.id,
      'name', pet_record.name,
      'species', pet_record.species,
      'breed', pet_record.breed,
      'date_of_birth', pet_record.date_of_birth,
      'gender', pet_record.gender,
      'weight', pet_record.weight,
      'weight_current', pet_record.weight,
      'photo_url', pet_record.photo_url,
      'avatar_url', pet_record.photo_url,
      'microchip_number', case when permission_level in ('advanced', 'full', 'passport') then pet_record.microchip_number else null end,
      'passport_id', case when permission_level in ('advanced', 'full', 'passport') then pet_record.passport_id else null end
    ),
    'settings', jsonb_build_object(
      'preset', case when permission_level in ('advanced', 'full', 'passport') then 'FULL' else 'BASIC' end
    ),
    'details', jsonb_build_object(
      'vaccinations', coalesce((select jsonb_agg(to_jsonb(v) order by coalesce(v.date_given, v.administered_date, v.administered_at) desc nulls last) from public.vaccinations v where v.pet_id = pet_record.id), '[]'::jsonb),
      'medications', coalesce((select jsonb_agg(to_jsonb(m) order by coalesce(m.start_date, m.start_at) desc nulls last) from public.medications m where m.pet_id = pet_record.id), '[]'::jsonb),
      'conditions', case when permission_level in ('advanced', 'full', 'passport') then coalesce((select jsonb_agg(to_jsonb(c)) from public.conditions c where c.pet_id = pet_record.id), '[]'::jsonb) else '[]'::jsonb end,
      'allergies', case when permission_level in ('advanced', 'full', 'passport') then coalesce((select jsonb_agg(to_jsonb(a)) from public.allergies a where a.pet_id = pet_record.id), '[]'::jsonb) else '[]'::jsonb end,
      'visits', case when permission_level in ('advanced', 'full', 'passport') then coalesce((select jsonb_agg(to_jsonb(mv) order by coalesce(mv.visit_date, mv.visited_at::date) desc nulls last) from public.medical_visits mv where mv.pet_id = pet_record.id), '[]'::jsonb) else '[]'::jsonb end
    )
  );
end;
$$;
