import { useMemo } from 'react';
import { Pet } from '@/types/v2/schema';
import { usePetProfileV2 } from '@/hooks/domain/useHealthV2';

export function usePetHealthScore(pet?: Pet) {
    const { data: healthData, isLoading: healthLoading } = usePetProfileV2(pet?.id || '');

    const score = useMemo(() => {
        if (!pet) return 0;

        let calculatedScore = 40; // Base score for added pet

        // Profile Completeness
        if (pet.avatar_url) calculatedScore += 10;
        if (pet.microchip_number) calculatedScore += 10;

        // Health Data (from V2 Profile Data)
        // Has had a visit?
        if (healthData?.visits && healthData.visits.length > 0) calculatedScore += 10;

        // Has valid vaccinations? (Next due > now)
        const hasValidVaccine = healthData?.vaccinations.some(v => v.next_due_date && new Date(v.next_due_date) > new Date());
        if (hasValidVaccine) calculatedScore += 10;

        // Has weight recorded (current or logs)
        if (pet.weight_current || (healthData?.weightLogs && healthData.weightLogs.length > 0)) calculatedScore += 10;

        // Behavior (Has tags)
        if (healthData?.behaviorTags && healthData.behaviorTags.length > 0) calculatedScore += 10;

        return Math.min(calculatedScore, 100);
    }, [pet, healthData]);

    return {
        score,
        loading: healthLoading
    };
}
