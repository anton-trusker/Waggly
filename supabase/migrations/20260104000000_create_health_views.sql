-- Migration: Create Health Dashboard Views
-- Description: Creates 4 optimized views for the Health Tab to offload logic from client to DB.
-- Date: 2026-01-04

-- 1. view_health_dashboard_summary
-- Aggregates summary scores and status for the Health Tab hero and headers.
CREATE OR REPLACE VIEW view_health_dashboard_summary WITH (security_invoker = true) AS
SELECT
  p.id as pet_id,
  -- Health Score Calculation (0-100)
  (
    -- 20 pts: At least one vaccination in last year (Active protection)
    (CASE WHEN (SELECT count(*) FROM vaccinations v WHERE v.pet_id = p.id AND v.date_given > (now() - interval '1 year')) > 0 THEN 20 ELSE 0 END) +
    -- 20 pts: Weight is recorded (Monitoring base)
    (CASE WHEN p.weight IS NOT NULL THEN 20 ELSE 0 END) +
    -- 30 pts: Vet visit in last year (Professional care)
    (CASE WHEN (SELECT count(*) FROM medical_visits mv WHERE mv.pet_id = p.id AND mv.date > (now() - interval '1 year')) > 0 THEN 30 ELSE 0 END) +
    -- 30 pts: Active preventive treatment (Flea/Tick/Heartworm)
    (CASE WHEN (SELECT count(*) FROM treatments t WHERE t.pet_id = p.id AND t.category = 'preventive' AND t.is_active = true) > 0 THEN 30 ELSE 0 END)
  ) as health_score,

  -- Weight Widget Summary
  json_build_object(
    'current', p.weight,
    'trend', (SELECT weight_trend FROM health_metrics hm WHERE hm.pet_id = p.id ORDER BY measured_at DESC LIMIT 1),
    'last_measured', (SELECT measured_at FROM health_metrics hm WHERE hm.pet_id = p.id ORDER BY measured_at DESC LIMIT 1)
  ) as weight_summary,

  -- Preventive Care Summary
  json_build_object(
    'vaccines_active', (SELECT count(*) FROM vaccinations v WHERE v.pet_id = p.id AND (v.next_due_date > now() OR v.next_due_date IS NULL)),
    'vaccines_overdue', (SELECT count(*) FROM vaccinations v WHERE v.pet_id = p.id AND v.next_due_date < now()),
    'meds_active', (SELECT count(*) FROM medications m WHERE m.pet_id = p.id AND (m.end_date IS NULL OR m.end_date > now()))
  ) as preventive_status

FROM pets p;

COMMENT ON VIEW view_health_dashboard_summary IS 'Aggregates high-level health metrics for the Pet Profile Health Tab.';

-- 2. view_vaccination_status
-- Returns vaccination list with pre-calculated status codes for UI rendering.
CREATE OR REPLACE VIEW view_vaccination_status WITH (security_invoker = true) AS
SELECT
  v.id,
  v.pet_id,
  v.vaccine_name,
  v.date_given,
  v.next_due_date,
  CASE
    WHEN v.next_due_date < now() THEN 'overdue'
    WHEN v.next_due_date < (now() + interval '30 days') THEN 'due_soon'
    ELSE 'valid'
  END as status_code,
  v.category, -- 'core' vs 'non-core'
  v.reminder_enabled
FROM vaccinations v;

COMMENT ON VIEW view_vaccination_status IS 'Vaccination list with derived status_code based on due date.';

-- 3. view_medication_tracker
-- Returns active medications with refill status.
-- Uses 'medications' table which tracks inventory (quantity, Refills).
CREATE OR REPLACE VIEW view_medication_tracker WITH (security_invoker = true) AS
SELECT
  m.id,
  m.pet_id,
  m.name as medication_name,
  m.frequency,
  m.start_date,
  m.end_date,
  m.dosage_value,
  m.dosage_unit,
  -- Calculate days remaining if end_date exists
  (m.end_date - CURRENT_DATE) as days_remaining,
  -- Check refill status via quantity
  CASE
    WHEN m.quantity < 10 AND m.auto_refill = false THEN 'refill_needed'
    ELSE 'ok'
  END as refill_status,
    -- Next due logical calculation (simplified alias for now, ideally needs a function)
  m.start_date as next_due_date -- Placeholder, logic usually requires advanced recurrence expansion
FROM medications m
WHERE (m.end_date IS NULL OR m.end_date > now());

COMMENT ON VIEW view_medication_tracker IS 'Active medications with refill alerts.';

-- 4. view_preventive_care_status
-- Returns preventive treatments (e.g., Flea/Tick) status.
-- Uses 'treatments' table which tracks broad categories.
CREATE OR REPLACE VIEW view_preventive_care_status WITH (security_invoker = true) AS
SELECT
  t.id,
  t.pet_id,
  t.treatment_name,
  t.category,
  t.is_active,
  t.next_due_date,
  t.frequency
FROM treatments t
WHERE t.category = 'preventive' AND t.is_active = true;

COMMENT ON VIEW view_preventive_care_status IS 'Active preventive treatments for the checklist widget.';
