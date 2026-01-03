import React from 'react';
import { PetHealthProfile } from '@/components/health/PetHealthProfile';

interface HealthTabDesktopProps {
    petId: string;
}

export default function HealthTabDesktop({ petId }: HealthTabDesktopProps) {
    return <PetHealthProfile petId={petId} />;
}
