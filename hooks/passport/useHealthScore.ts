// Health score calculation and fetching hook
// Provides health scoring with recalculation capability

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { HealthDashboard, UseHealthScoreReturn, HealthCategory as HealthCategoryType } from '@/types/passport';

// Local definition to avoid ReferenceError with Enum import
const HealthCategory = {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    FAIR: 'fair',
    POOR: 'poor',
    CRITICAL: 'critical',
} as const;

export function useHealthScore(petId: string): UseHealthScoreReturn {
    const [healthScore, setHealthScore] = useState<HealthDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchHealthScore = useCallback(async () => {
        if (!petId) {
            setError(new Error('Pet ID is required'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Check if we have a recent score (within 24 hours)
            const { data: rawExistingScore, error: fetchError } = await supabase
                .from('health_scores')
                .select('*')
                .eq('pet_id', petId)
                .order('calculated_date', { ascending: false })
                .limit(1);

            if (fetchError) throw fetchError;

            const existingScore = rawExistingScore as any[];

            const now = new Date();
            const hasRecentScore = existingScore && existingScore.length > 0 &&
                (now.getTime() - new Date(existingScore[0].calculated_date).getTime()) < 24 * 60 * 60 * 1000;

            let scoreData = existingScore?.[0];

            // If no recent score, calculate new one
            if (!hasRecentScore) {
                const { data: calculated, error: calcError } = await supabase
                    .rpc('calculate_health_score', { p_pet_id: petId });

                if (calcError) throw calcError;

                if (calculated && calculated.length > 0) {
                    const calc = (calculated as any[])[0];

                    // Insert new score
                    const { data: rawNewScore, error: insertError } = await supabase
                        .from('health_scores')
                        .insert({
                            pet_id: petId,
                            overall_score: calc.overall_score,
                            score_category: calc.score_category,
                            preventive_care_score: calc.preventive_care,
                            vaccination_score: calc.vaccination,
                            weight_management_score: calc.weight_management,
                            data_completeness_percentage: calc.data_completeness,
                        })
                        .select()
                        .single();

                    if (insertError) throw insertError;
                    scoreData = rawNewScore as any;
                }
            }

            if (!scoreData) {
                // No score data available, return default
                setHealthScore({
                    overallScore: { score: 0, category: HealthCategory.FAIR as HealthCategoryType },
                    preventiveCareScore: { score: 0, category: HealthCategory.FAIR as HealthCategoryType, label: 'Preventive Care' },
                    vaccinationScore: { score: 0, category: HealthCategory.FAIR as HealthCategoryType, label: 'Vaccination Status' },
                    weightManagementScore: { score: 0, category: HealthCategory.FAIR as HealthCategoryType, label: 'Weight Management' },
                    healthRisks: [],
                    recommendations: [],
                    dataCompleteness: 0,
                    lastCalculated: new Date(),
                });
                setLoading(false);
                return;
            }

            // Fetch associated risks and recommendations
            const { data: rawRisks } = await supabase
                .from('health_risks')
                .select('*')
                .eq('pet_id', petId)
                .eq('status', 'active')
                .order('risk_score', { ascending: false })
                .limit(5);

            const { data: rawRecommendations } = await supabase
                .from('health_recommendations')
                .select('*')
                .eq('pet_id', petId)
                .eq('completed', false)
                .eq('dismissed', false)
                .order('priority')
                .limit(5);

            const risks = rawRisks as any[];
            const recommendations = rawRecommendations as any[];

            // Helper to determine category from score
            const getCategory = (score: number): HealthCategoryType => {
                if (score >= 90) return HealthCategory.EXCELLENT as HealthCategoryType;
                if (score >= 75) return HealthCategory.GOOD as HealthCategoryType;
                if (score >= 60) return HealthCategory.FAIR as HealthCategoryType;
                if (score >= 40) return HealthCategory.POOR as HealthCategoryType;
                return HealthCategory.CRITICAL as HealthCategoryType;
            };

            const dashboard: HealthDashboard = {
                overallScore: {
                    score: scoreData.overall_score || 0,
                    category: (scoreData.score_category || HealthCategory.FAIR) as HealthCategoryType,
                },
                preventiveCareScore: {
                    score: scoreData.preventive_care_score || 0,
                    category: getCategory(scoreData.preventive_care_score || 0),
                    label: 'Preventive Care',
                },
                vaccinationScore: {
                    score: scoreData.vaccination_score || 0,
                    category: getCategory(scoreData.vaccination_score || 0),
                    label: 'Vaccination Status',
                },
                weightManagementScore: {
                    score: scoreData.weight_management_score || 0,
                    category: getCategory(scoreData.weight_management_score || 0),
                    label: 'Weight Management',
                },
                healthRisks: (risks || []).map(risk => ({
                    id: risk.id,
                    riskType: risk.risk_type,
                    riskLevel: risk.risk_level,
                    riskScore: risk.risk_score || 0,
                    description: risk.description || '',
                    mitigation: risk.mitigation || '',
                    contributingFactors: risk.contributing_factors,
                    status: risk.status,
                    firstIdentified: risk.first_identified ? new Date(risk.first_identified) : undefined,
                    lastAssessed: risk.last_assessed ? new Date(risk.last_assessed) : undefined,
                })),
                recommendations: (recommendations || []).map(rec => ({
                    id: rec.id,
                    recommendationType: rec.recommendation_type,
                    priority: rec.priority,
                    title: rec.title,
                    description: rec.description || '',
                    actionItems: rec.action_items || [],
                    actionButtonText: rec.action_button_text,
                    expectedBenefit: rec.expected_benefit,
                    estimatedCostMin: rec.estimated_cost_min,
                    estimatedCostMax: rec.estimated_cost_max,
                    currency: rec.currency,
                    dueDate: rec.due_date ? new Date(rec.due_date) : undefined,
                    completed: rec.completed,
                    completedDate: rec.completed_date ? new Date(rec.completed_date) : undefined,
                    dismissed: rec.dismissed,
                })),
                dataCompleteness: scoreData.data_completeness_percentage || 0,
                lastCalculated: new Date(scoreData.calculated_date || scoreData.created_at),
            };

            setHealthScore(dashboard);
        } catch (err) {
            console.error('Error fetching health score:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch health score'));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchHealthScore();
    }, [fetchHealthScore]);

    const recalculate = useCallback(async () => {
        await fetchHealthScore();
    }, [fetchHealthScore]);

    return {
        healthScore,
        loading,
        error,
        recalculate,
    };
}
