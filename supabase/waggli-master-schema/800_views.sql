create or replace view public.v_pet_health_timeline
with (security_invoker = true) as
select pet_id, coalesce(visited_at, visit_date::timestamptz) as event_at, 'medical_visit' as event_type, coalesce(reason, 'Medical visit') as title, diagnosis as description, 'medical_visits' as source_table, id as source_id, '{}'::jsonb as metadata from public.medical_visits
union all
select pet_id, coalesce(administered_at, administered_date, date_given)::timestamptz as event_at, 'vaccination', vaccine_name, status, 'vaccinations', id, '{}'::jsonb from public.vaccinations where coalesce(administered_at, administered_date, date_given) is not null
union all
select pet_id, recorded_at as event_at, 'weight', 'Weight recorded', (weight || ' ' || unit), 'weight_logs', id, jsonb_build_object('weight', weight, 'unit', unit) from public.weight_logs;

create or replace view public.v_pet_dashboard_summary
with (security_invoker = true) as
select
  p.id as pet_id,
  p.user_id,
  p.name,
  p.species,
  p.breed as breed_name,
  p.photo_url,
  hs.overall_score as latest_health_score,
  hs.score_category,
  hs.calculated_at as health_score_calculated_at,
  (select count(*) from public.vaccinations v where v.pet_id = p.id and coalesce(v.next_due_at, v.next_due_date) < current_date) as overdue_vaccines_count,
  (select count(*) from public.medications m where m.pet_id = p.id and m.is_ongoing = true) as active_medications_count
from public.pets p
left join lateral (
  select * from public.health_scores hs
  where hs.pet_id = p.id
  order by coalesce(hs.calculated_at, hs.calculated_date) desc
  limit 1
) hs on true;

create or replace view public.v_upcoming_care
with (security_invoker = true) as
select pet_id, coalesce(next_due_at, next_due_date)::timestamptz as due_at, 'vaccination' as care_type, vaccine_name as title, id as source_id from public.vaccinations where coalesce(next_due_at, next_due_date) is not null
union all
select pet_id, starts_at as due_at, event_type, title, id from public.events where status = 'scheduled';

create or replace view public.view_vaccination_status
with (security_invoker = true) as
select
  v.id,
  v.pet_id,
  p.name as pet_name,
  v.vaccine_name,
  coalesce(v.date_given, v.administered_date, v.administered_at) as date_given,
  coalesce(v.next_due_date, v.next_due_at) as next_due_date,
  case
    when coalesce(v.next_due_date, v.next_due_at) is null then coalesce(v.status, 'valid')
    when coalesce(v.next_due_date, v.next_due_at) < current_date then 'overdue'
    when coalesce(v.next_due_date, v.next_due_at) <= current_date + interval '30 days' then 'upcoming'
    else coalesce(v.status, 'valid')
  end as status,
  v.category,
  v.notes
from public.vaccinations v
join public.pets p on p.id = v.pet_id;

create or replace view public.view_medication_tracker
with (security_invoker = true) as
select
  m.id,
  m.pet_id,
  p.name as pet_name,
  m.name,
  coalesce(m.dosage, trim(coalesce(m.dosage_value::text, '') || ' ' || coalesce(m.dosage_unit, ''))) as dosage,
  m.frequency,
  coalesce(m.start_date, m.start_at) as start_date,
  coalesce(m.end_date, m.end_at) as end_date,
  m.is_ongoing,
  m.reminders_enabled,
  m.notes
from public.medications m
join public.pets p on p.id = m.pet_id;
