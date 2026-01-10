-- Health Score Calculation Functions
-- Created: 2026-01-10
-- Purpose: Calculate health scores and recommendations for Pet Passport

BEGIN;

-- ============================================================================
-- FUNCTION: Calculate Health Score
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_health_score(p_pet_id UUID)
RETURNS TABLE(
  overall_score INTEGER,
  score_category VARCHAR(20),
  preventive_care INTEGER,
  vaccination INTEGER,
  weight_management INTEGER,
  data_completeness INTEGER
) AS $$
DECLARE
  v_preventive INTEGER := 0;
  v_vaccination INTEGER := 0;
  v_weight INTEGER := 0;
  v_completeness INTEGER := 0;
  v_overall INTEGER := 0;
  v_category VARCHAR(20);
BEGIN
  -- ========================================================================
  -- Calculate Preventive Care Score (0-100)
  -- Based on: checkups, vaccinations, dental care
  -- ========================================================================
  SELECT 
    CASE 
      WHEN MAX(mv.visit_date) >= CURRENT_DATE - INTERVAL '12 months' THEN 40
      WHEN MAX(mv.visit_date) >= CURRENT_DATE - INTERVAL '18 months' THEN 25
      WHEN MAX(mv.visit_date) >= CURRENT_DATE - INTERVAL '24 months' THEN 15
      ELSE 0
    END
  INTO v_preventive
  FROM medical_visits mv
  WHERE mv.pet_id = p_pet_id
    AND mv.visit_type IN ('checkup', 'wellness');
  
  -- Add points for recent dental care
  v_preventive := v_preventive + CASE
    WHEN EXISTS (
      SELECT 1 FROM medical_visits
      WHERE pet_id = p_pet_id
      AND visit_date >= CURRENT_DATE - INTERVAL '12 months'
      AND (diagnosis ILIKE '%dental%' OR treatment_provided ILIKE '%dental%')
    ) THEN 20
    ELSE 0
  END;
  
  -- ========================================================================
  -- Calculate Vaccination Score (0-100)
  -- Based on: % of vaccines current, core vs non-core
  -- ========================================================================
  WITH required_count AS (
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE category = 'core') as core_total
    FROM vaccinations 
    WHERE pet_id = p_pet_id
  ),
  current_count AS (
    SELECT 
      COUNT(*) as current,
      COUNT(*) FILTER (WHERE category = 'core') as core_current
    FROM vaccinations
    WHERE pet_id = p_pet_id 
    AND (next_due_date >= CURRENT_DATE OR next_due_date IS NULL)
  )
  SELECT 
    CASE 
      WHEN rc.total = 0 THEN 0
      WHEN rc.core_total > 0 AND cc.core_current = rc.core_total THEN 
        -- All core vaccines current = base 70 points
        70 + ROUND(((cc.current - cc.core_current)::DECIMAL / NULLIF(rc.total - rc.core_total, 0)) * 30)
      WHEN rc.core_total > 0 THEN
        -- Some core vaccines missing
        ROUND((cc.core_current::DECIMAL / rc.core_total) * 70)
      ELSE 
        -- Only non-core vaccines
        ROUND((cc.current::DECIMAL / rc.total) * 100)
    END
  INTO v_vaccination
  FROM required_count rc, current_count cc;
  
  -- ========================================================================
  -- Calculate Weight Management Score (0-100)
  -- Based on: BCS ideal, weight in range, tracking consistency
  -- ========================================================================
  WITH latest_bcs AS (
    SELECT score
    FROM body_condition_scores
    WHERE pet_id = p_pet_id
    ORDER BY assessed_date DESC
    LIMIT 1
  ),
  weight_tracking AS (
    SELECT COUNT(*) as entries
    FROM weight_entries
    WHERE pet_id = p_pet_id
    AND date >= CURRENT_DATE - INTERVAL '6 months'
  )
  SELECT
    -- BCS score (up to 50 points)
    CASE
      WHEN bcs.score BETWEEN 4 AND 5 THEN 50  -- Ideal BCS
      WHEN bcs.score IN (3, 6) THEN 35         -- Slightly off
      WHEN bcs.score IN (2, 7) THEN 20         -- Moderately off
      ELSE 10                                   -- Underweight or obese
    END +
    -- Weight tracking consistency (up to 30 points)
    CASE
      WHEN wt.entries >= 6 THEN 30           -- Weekly tracking
      WHEN wt.entries >= 3 THEN 20           -- Monthly tracking
      WHEN wt.entries >= 1 THEN 10           -- Some tracking
      ELSE 0
    END +
    -- Weight within ideal range (up to 20 points)
    CASE
      WHEN p.weight IS NOT NULL 
        AND p.ideal_weight_min IS NOT NULL 
        AND p.ideal_weight_max IS NOT NULL
        AND p.weight BETWEEN p.ideal_weight_min AND p.ideal_weight_max 
      THEN 20
      WHEN p.weight IS NOT NULL THEN 10
      ELSE 0
    END
  INTO v_weight
  FROM pets p
  LEFT JOIN latest_bcs bcs ON TRUE
  LEFT JOIN weight_tracking wt ON TRUE
  WHERE p.id = p_pet_id;
  
  -- Handle NULL case
  v_weight := COALESCE(v_weight, 0);
  
  -- ========================================================================
  -- Calculate Data Completeness (0-100)
  -- Based on: filled passport fields
  -- ========================================================================
  SELECT
    ROUND(
      ((CASE WHEN name IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN species IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN breed IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN date_of_birth IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN gender IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN weight IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN microchip_number IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN photo_url IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN color IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN spayed_neutered IS NOT NULL THEN 1 ELSE 0 END)::DECIMAL / 10) * 100
    )
  INTO v_completeness
  FROM pets
  WHERE id = p_pet_id;
  
  -- ========================================================================
  -- Calculate Overall Score (weighted average)
  -- ========================================================================
  v_overall := ROUND(
    (v_preventive * 0.25) +  -- 25% preventive care
    (v_vaccination * 0.35) +  -- 35% vaccination (most important)
    (v_weight * 0.25) +       -- 25% weight management
    (v_completeness * 0.15)   -- 15% data completeness
  );
  
  -- Determine Category
  v_category := CASE
    WHEN v_overall >= 90 THEN 'excellent'
    WHEN v_overall >= 75 THEN 'good'
    WHEN v_overall >= 60 THEN 'fair'
    WHEN v_overall >= 40 THEN 'poor'
    ELSE 'critical'
  END;
  
  -- ========================================================================
  -- Return results
  -- ========================================================================
  RETURN QUERY SELECT 
    v_overall,
    v_category,
    v_preventive,
    v_vaccination,
    v_weight,
    v_completeness;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Auto-Update Health Score
-- ============================================================================

CREATE OR REPLACE FUNCTION update_health_score_for_pet(p_pet_id UUID)
RETURNS VOID AS $$
DECLARE
  score_data RECORD;
BEGIN
  -- Calculate the health score
  SELECT * INTO score_data
  FROM calculate_health_score(p_pet_id);
  
  -- Insert or update the health_scores table
  INSERT INTO health_scores (
    pet_id,
    overall_score,
    score_category,
    preventive_care_score,
    vaccination_score,
    weight_management_score,
    data_completeness_percentage
  ) VALUES (
    p_pet_id,
    score_data.overall_score,
    score_data.score_category,
    score_data.preventive_care,
    score_data.vaccination,
    score_data.weight_management,
    score_data.data_completeness
  )
  ON CONFLICT (pet_id, calculated_date::DATE)
  DO UPDATE SET
    overall_score = EXCLUDED.overall_score,
    score_category = EXCLUDED.score_category,
    preventive_care_score = EXCLUDED.preventive_care_score,
    vaccination_score = EXCLUDED.vaccination_score,
    weight_management_score = EXCLUDED.weight_management_score,
    data_completeness_percentage = EXCLUDED.data_completeness_percentage,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Check Vaccination Compliance
-- ============================================================================

CREATE OR REPLACE FUNCTION check_vaccination_compliance(p_pet_id UUID)
RETURNS TABLE(
  total_vaccines INTEGER,
  current_vaccines INTEGER,
  overdue_vaccines INTEGER,
  due_soon_vaccines INTEGER,
  compliance_percentage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH vaccine_stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (
        WHERE next_due_date >= CURRENT_DATE OR next_due_date IS NULL
      ) as current,
      COUNT(*) FILTER (
        WHERE next_due_date < CURRENT_DATE
      ) as overdue,
      COUNT(*) FILTER (
        WHERE next_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      ) as due_soon
    FROM vaccinations
    WHERE pet_id = p_pet_id
  )
  SELECT
    total::INTEGER,
    current::INTEGER,
    overdue::INTEGER,
    due_soon::INTEGER,
    CASE 
      WHEN total = 0 THEN 0
      ELSE ROUND((current::DECIMAL / total) * 100)::INTEGER
    END as compliance
  FROM vaccine_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Generate Health Recommendations
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_health_recommendations(p_pet_id UUID)
RETURNS VOID AS $$
DECLARE
  vaccine_rec RECORD;
  weight_rec RECORD;
  checkup_rec RECORD;
BEGIN
  -- Clear existing active recommendations
  DELETE FROM health_recommendations 
  WHERE pet_id = p_pet_id 
  AND completed = FALSE 
  AND dismissed = FALSE;
  
  -- ========================================================================
  -- Recommendation: Overdue Vaccinations
  -- ========================================================================
  FOR vaccine_rec IN
    SELECT 
      vaccine_name,
      next_due_date,
      CURRENT_DATE - next_due_date as days_overdue
    FROM vaccinations
    WHERE pet_id = p_pet_id
    AND next_due_date < CURRENT_DATE
    ORDER BY next_due_date ASC
  LOOP
    INSERT INTO health_recommendations (
      pet_id,
      recommendation_type,
      priority,
      title,
      description,
      action_items,
      action_button_text
    ) VALUES (
      p_pet_id,
      'vaccination_overdue',
      CASE 
        WHEN vaccine_rec.days_overdue > 90 THEN 'urgent'
        WHEN vaccine_rec.days_overdue > 30 THEN 'high'
        ELSE 'medium'
      END,
      vaccine_rec.vaccine_name || ' vaccine overdue',
      'This vaccine is ' || vaccine_rec.days_overdue || ' days overdue. Schedule an appointment with your veterinarian.',
      ARRAY['Schedule veterinary appointment', 'Confirm vaccination date'],
      'Schedule Vaccination'
    );
  END LOOP;
  
  -- ========================================================================
  -- Recommendation: Annual Checkup
  -- ========================================================================
  SELECT visit_date INTO checkup_rec
  FROM medical_visits
  WHERE pet_id = p_pet_id
  AND visit_type IN ('checkup', 'wellness')
  ORDER BY visit_date DESC
  LIMIT 1;
  
  IF checkup_rec.visit_date IS NULL OR checkup_rec.visit_date < CURRENT_DATE - INTERVAL '12 months' THEN
    INSERT INTO health_recommendations (
      pet_id,
      recommendation_type,
      priority,
      title,
      description,
      action_items,
      action_button_text
    ) VALUES (
      p_pet_id,
      'annual_checkup',
      CASE 
        WHEN checkup_rec.visit_date < CURRENT_DATE - INTERVAL '18 months' THEN 'high'
        ELSE 'medium'
      END,
      'Annual checkup due',
      'Regular checkups help catch health issues early.',
      ARRAY['Schedule annual wellness exam', 'Review vaccination status'],
      'Schedule Checkup'
    );
  END IF;
  
  -- ========================================================================
  -- Recommendation: Weight Management
  -- ========================================================================
  SELECT bcs.score INTO weight_rec
  FROM body_condition_scores bcs
  WHERE bcs.pet_id = p_pet_id
  ORDER BY bcs.assessed_date DESC
  LIMIT 1;
  
  IF weight_rec.score IS NOT NULL AND (weight_rec.score <= 3 OR weight_rec.score >= 7) THEN
    INSERT INTO health_recommendations (
      pet_id,
      recommendation_type,
      priority,
      title,
      description,
      action_items,
      action_button_text
    ) VALUES (
      p_pet_id,
      'weight_management',
      CASE 
        WHEN weight_rec.score <= 2 OR weight_rec.score >= 8 THEN 'high'
        ELSE 'medium'
      END,
      CASE 
        WHEN weight_rec.score <= 3 THEN 'Pet is underweight'
        ELSE 'Pet is overweight'
      END,
      CASE 
        WHEN weight_rec.score <= 3 THEN 'Consider increasing food portions or veterinary consultation.'
        ELSE 'Consider diet adjustment and increased exercise.'
      END,
      ARRAY['Consult with veterinarian', 'Adjust diet plan', 'Increase exercise'],
      'Get Diet Plan'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION calculate_health_score IS 'Calculates overall pet health score based on preventive care, vaccinations, and weight management';
COMMENT ON FUNCTION update_health_score_for_pet IS 'Updates or inserts health score record for a specific pet';
COMMENT ON FUNCTION check_vaccination_compliance IS 'Returns vaccination compliance statistics for a pet';
COMMENT ON FUNCTION generate_health_recommendations IS 'Generates personalized health recommendations based on pet data';
