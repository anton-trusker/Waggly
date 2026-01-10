-- Fix health score calculation function
-- 1. Fix column name: visit_date -> date
-- 2. Fix column name: visit_type -> provider_type

BEGIN;

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
    -- Calculate Preventive Care Score (0-100)
    -- Based on: checkups, vaccinations, dental care
    -- FIX: Changed visit_date to date (which exists in medical_visits)
    -- FIX: Changed visit_type to provider_type check
    SELECT 
        CASE 
            WHEN MAX(mv.date) >= CURRENT_DATE - INTERVAL '12 months' THEN 30
            WHEN MAX(mv.date) >= CURRENT_DATE - INTERVAL '18 months' THEN 15
            ELSE 0
        END
    INTO v_preventive
    FROM medical_visits mv
    WHERE mv.pet_id = p_pet_id
        AND (
            mv.provider_type = 'veterinary' 
            OR mv.reason ILIKE '%checkup%' 
            OR mv.reason ILIKE '%wellness%'
            OR mv.reason ILIKE '%vaccin%'
        );
    
    -- If no medical_visits table or no matches, default to 0
    IF v_preventive IS NULL THEN
        v_preventive := 0;
    END IF;
    
    -- Calculate Vaccination Score (0-100)
    -- Based on: % of required vaccines current
    WITH required_count AS (
        SELECT COUNT(*) as total FROM vaccinations 
        WHERE pet_id = p_pet_id
    ),
    current_count AS (
        SELECT COUNT(*) as current FROM vaccinations
        WHERE pet_id = p_pet_id AND next_due_date >= CURRENT_DATE
    )
    SELECT 
        CASE 
            WHEN rc.total = 0 THEN 0
            ELSE ROUND((cc.current::DECIMAL / rc.total) * 100)
        END
    INTO v_vaccination
    FROM required_count rc, current_count cc;
    
    -- Calculate Weight Management Score (0-100)
    -- Based on: BCS ideal, weight in range, tracking consistency
    SELECT
        CASE
            WHEN bcs.score BETWEEN 4 AND 5 THEN 40  -- Ideal BCS
            WHEN bcs.score IN (3, 6) THEN 25         -- Slightly off
            ELSE 10                                   -- Underweight or obese
        END +
        CASE
            WHEN COUNT(we.id) >= 2 THEN 20           -- Regular tracking
            ELSE 5
        END
    INTO v_weight
    FROM pets p
    LEFT JOIN body_condition_scores bcs ON bcs.pet_id = p.id
        AND bcs.assessed_date = (
            SELECT MAX(assessed_date) FROM body_condition_scores WHERE pet_id = p.id
        )
    LEFT JOIN weight_entries we ON we.pet_id = p.id
        AND we.date >= CURRENT_DATE - INTERVAL '6 months'
    WHERE p.id = p_pet_id
    GROUP BY bcs.score;
    
    -- Default if no data
    IF v_weight IS NULL THEN
        v_weight := 0;
    END IF;
    
    -- Calculate Data Completeness (0-100)
    -- Based on: filled passport fields
    SELECT
        ROUND(
            ((CASE WHEN name IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN species IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN breed IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN date_of_birth IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN gender IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN weight IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN microchip_number IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN photo_url IS NOT NULL THEN 1 ELSE 0 END)::DECIMAL / 8) * 100
        )
    INTO v_completeness
    FROM pets
    WHERE id = p_pet_id;
    
    -- Calculate Overall Score (weighted average)
    v_overall := ROUND(
        (v_preventive * 0.3) + 
        (v_vaccination * 0.3) + 
        (v_weight * 0.3) + 
        (v_completeness * 0.1)
    );
    
    -- Determine Category
    v_category := CASE
        WHEN v_overall >= 90 THEN 'excellent'
        WHEN v_overall >= 75 THEN 'good'
        WHEN v_overall >= 60 THEN 'fair'
        WHEN v_overall >= 40 THEN 'poor'
        ELSE 'critical'
    END;
    
    -- Return results
    RETURN QUERY SELECT 
        v_overall,
        v_category,
        v_preventive,
        v_vaccination,
        v_weight,
        v_completeness;
END;
$$ LANGUAGE plpgsql;

COMMIT;
