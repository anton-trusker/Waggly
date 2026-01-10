import { useMemo } from 'react';
import { Pet } from '@/types';
import { usePetHealthData } from '@/hooks/usePetHealthData';
import { usePetBehavior } from '@/hooks/usePetBehavior';

export function usePetHealthScore(pet?: Pet) {
    const { healthData, loading: healthLoading } = usePetHealthData(pet?.id);
    const { behaviorTags, loading: behaviorLoading } = usePetBehavior(pet?.id);

    const score = useMemo(() => {
        if (!pet) return 0;

        let calculatedScore = 40; // Base score for added pet

        // Profile Completeness
        if (pet.photo_url) calculatedScore += 10;
        if (pet.microchip_number) calculatedScore += 10;

        // Health Data
        if (healthData?.lastVetVisit) calculatedScore += 10;
        if (healthData?.nextVaccineDue) calculatedScore += 10;
        if (healthData?.currentWeight) calculatedScore += 10;

        // Behavior
        if (behaviorTags.length > 0) calculatedScore += 10;

        return Math.min(calculatedScore, 100);
    }, [pet, healthData, behaviorTags]);

    return {
        score,
        loading: healthLoading || behaviorLoading
    };
}
