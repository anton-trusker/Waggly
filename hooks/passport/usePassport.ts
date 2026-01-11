// Main passport data fetching hook
// Aggregates all passport-related data for a single pet

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
    PetPassport,
    PetIdentification,
    PhysicalCharacteristics,
    UsePassportReturn,
} from '@/types/passport';

import {
    WeightTrend,
    BCSCategory,
    PetStatus,
    Species,
    Gender,
    HealthCategory,
    RiskLevel,
    Priority,
    RecommendationType,
    VaccineCategory,
    AdministrationRoute,
    TreatmentCategory,
    MedicalEventType,
    EventStatus,
} from '@/types/passport';

const getBCSCategory = (score: number): BCSCategory => {
    if (score <= 3) return BCSCategory.UNDERWEIGHT;
    if (score <= 5) return BCSCategory.IDEAL;
    if (score <= 7) return BCSCategory.OVERWEIGHT;
    return BCSCategory.OBESE;
};

export function usePassport(petId: string): UsePassportReturn {
    const [passport, setPassport] = useState<PetPassport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPassport = useCallback(async () => {
        if (!petId) {
            setError(new Error('Pet ID is required'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch pet basic info
            const { data: petData, error: petError } = await supabase
                .from('pets')
                .select('*')
                .eq('id', petId)
                .single();

            if (petError) throw petError;
            if (!petData) throw new Error('Pet not found');

            const pet = petData as any; // Cast to any to handle missing type definitions

            // Fetch vaccinations
            const { data: rawVaccinations, error: vaccinationsError } = await supabase
                .from('vaccinations')
                .select('*')
                .eq('pet_id', petId)
                .order('date_given', { ascending: false });

            if (vaccinationsError) throw vaccinationsError;

            // Fetch treatments
            const { data: rawTreatments, error: treatmentsError } = await supabase
                .from('treatments')
                .select('*')
                .eq('pet_id', petId)
                .order('start_date', { ascending: false });

            if (treatmentsError) throw treatmentsError;

            // Fetch allergies
            const { data: rawAllergies, error: allergiesError } = await supabase
                .from('allergies')
                .select('*')
                .eq('pet_id', petId);

            if (allergiesError) throw allergiesError;

            // Fetch BCS History
            const { data: rawBcsData, error: bcsError } = await supabase
                .from('body_condition_scores')
                .select('*')
                .eq('pet_id', petId)
                .order('assessed_date', { ascending: false })
                .limit(1);

            if (bcsError) throw bcsError;

            // Fetch weight history
            const { data: rawWeightHistory, error: weightError } = await supabase
                .from('weight_entries')
                .select('*')
                .eq('pet_id', petId)
                .order('date', { ascending: false })
                .limit(10);

            if (weightError) throw weightError;

            // Fetch health score (latest)
            const { data: rawHealthScoreData, error: healthScoreError } = await supabase
                .from('health_scores')
                .select('*')
                .eq('pet_id', petId)
                .order('calculated_date', { ascending: false })
                .limit(1);

            if (healthScoreError) throw healthScoreError;

            // Fetch health risks
            const { data: rawHealthRisks, error: risksError } = await supabase
                .from('health_risks')
                .select('*')
                .eq('pet_id', petId)
                .eq('status', 'active')
                .order('risk_score', { ascending: false });

            if (risksError) throw risksError;

            // Fetch recommendations
            const { data: rawRecommendations, error: recommendationsError } = await supabase
                .from('health_recommendations')
                .select('*')
                .eq('pet_id', petId)
                .eq('completed', false)
                .eq('dismissed', false)
                .order('priority', { ascending: true });

            if (recommendationsError) throw recommendationsError;

            // Fetch emergency contacts
            const { data: rawEmergencyContacts, error: contactsError } = await supabase
                .from('emergency_contacts')
                .select('*')
                .eq('pet_id', petId)
                .order('is_primary', { ascending: false });

            if (contactsError) throw contactsError;

            // Fetch medical conditions
            const { data: rawConditions, error: conditionsError } = await supabase
                .from('medical_conditions')
                .select('*')
                .eq('pet_id', petId)
                .order('diagnosed_date', { ascending: false });

            if (conditionsError && conditionsError.code !== '42P01') { // Ignore if not exists yet
                throw conditionsError;
            }

            // Fetch medical visits
            const { data: rawMedicalVisits, error: visitsError } = await supabase
                .from('medical_visits')
                .select('*')
                .eq('pet_id', petId)
                .order('date', { ascending: false });

            if (visitsError && visitsError.code !== '42P01') { // Ignore table missing error just in case
                throw visitsError;
            }

            // Cast raw data to any to handle schema updates
            const vaccinations = rawVaccinations as any[];
            const treatments = rawTreatments as any[];
            const allergies = rawAllergies as any[];
            const bcsData = rawBcsData as any[];
            const weightHistory = rawWeightHistory as any[];
            const healthScoreData = rawHealthScoreData as any[];
            const healthRisks = rawHealthRisks as any[];
            const recommendations = rawRecommendations as any[];
            const emergencyContacts = rawEmergencyContacts as any[];
            const medicalVisits = (rawMedicalVisits || []) as any[];
            const conditions = (rawConditions || []) as any[];

            // Calculate age from date of birth
            const calculateAge = (dob: string | null) => {
                if (!dob) return { years: 0, months: 0 };
                const birthDate = new Date(dob);
                const today = new Date();
                let years = today.getFullYear() - birthDate.getFullYear();
                let months = today.getMonth() - birthDate.getMonth();

                if (months < 0) {
                    years--;
                    months += 12;
                }

                return { years, months };
            };

            const age = calculateAge(pet.date_of_birth);

            // Calculate weight trend
            const calculateWeightTrend = (): WeightTrend => {
                if (!weightHistory || weightHistory.length < 2) return WeightTrend.STABLE;

                const recent = weightHistory[0].weight;
                const previous = weightHistory[1].weight;
                const diff = ((recent - previous) / previous) * 100;

                if (diff > 2) return WeightTrend.INCREASING;
                if (diff < -2) return WeightTrend.DECREASING;
                return WeightTrend.STABLE;
            };

            // Determine BCS category
            const getBCSCategory = (score: number): BCSCategory => {
                if (score <= 3) return BCSCategory.UNDERWEIGHT;
                if (score >= 4 && score <= 5) return BCSCategory.IDEAL;
                if (score >= 6 && score <= 7) return BCSCategory.OVERWEIGHT;
                return BCSCategory.OBESE;
            };

            // Build identification object
            // Build identification object
            const identification: PetIdentification = {
                name: pet.name,
                species: (pet.species as Species) || 'dog',
                breed: pet.breed || 'Unknown',
                gender: (pet.gender as Gender) || 'unknown',
                dateOfBirth: pet.date_of_birth ? new Date(pet.date_of_birth) : new Date(),
                ageYears: age.years,
                ageMonths: age.months,
                isSpayedNeutered: pet.is_spayed_neutered || false,
                spayedNeuteredDate: pet.spayed_neutered_date ? new Date(pet.spayed_neutered_date) : undefined,
                microchipNumber: pet.microchip_number || undefined,
                microchipDate: pet.microchip_date ? new Date(pet.microchip_date) : undefined,
                registrationId: pet.registration_id || undefined,
                tattooId: pet.tattoo_id || undefined,
                petStatus: (pet.pet_status as PetStatus) || 'active',
                photoUrl: pet.avatar_url || undefined,
                ownerId: pet.owner_id,
            };

            // Build physical characteristics
            const currentWeight = weightHistory && weightHistory.length > 0 ? weightHistory[0].weight : pet.weight_current;
            const physical: PhysicalCharacteristics = {
                weight: {
                    currentKg: currentWeight || 0,
                    currentLbs: currentWeight ? parseFloat((currentWeight * 2.20462).toFixed(1)) : 0,
                    lastMeasuredDate: weightHistory && weightHistory.length > 0
                        ? new Date(weightHistory[0].date)
                        : new Date(),
                    trend: calculateWeightTrend(),
                },
                size: pet.size || 'medium',
                bodyConditionScore: bcsData && bcsData.length > 0 ? {
                    score: bcsData[0].score,
                    scaleType: bcsData[0].scale_type || '9-point',
                    assessedDate: new Date(bcsData[0].assessed_date),
                    assessedBy: bcsData[0].assessed_by,
                    category: getBCSCategory(bcsData[0].score),
                    ribsPalpable: bcsData[0].ribs_palpable,
                    waistVisible: bcsData[0].waist_visible,
                    abdominalTuck: bcsData[0].abdominal_tuck,
                    notes: bcsData[0].notes,
                } : undefined,
                color: pet.color || 'Unknown',
                coatType: pet.coat_type || undefined,
                eyeColor: pet.eye_color || undefined,
                tailLength: pet.tail_length || undefined,
                furDescription: pet.fur_description || undefined,
                distinguishingMarks: pet.distinguishing_marks || undefined,
                idealWeightMin: pet.ideal_weight_min || undefined,
                idealWeightMax: pet.ideal_weight_max || undefined,
                weightHistory: (weightHistory || []).map(entry => ({
                    id: entry.id,
                    weight: entry.weight,
                    date: new Date(entry.date),
                    notes: entry.notes,
                })),
            };

            // Build health dashboard (simplified - will use useHealthScore hook for full version)
            const health = {
                overallScore: healthScoreData && healthScoreData.length > 0 ? {
                    score: healthScoreData[0].overall_score || 0,
                    category: (healthScoreData[0].score_category || HealthCategory.FAIR) as HealthCategory,
                } : { score: 0, category: HealthCategory.FAIR },
                preventiveCareScore: {
                    score: healthScoreData?.[0]?.preventive_care_score || 0,
                    category: HealthCategory.FAIR,
                    label: 'Preventive Care',
                },
                vaccinationScore: {
                    score: healthScoreData?.[0]?.vaccination_score || 0,
                    category: HealthCategory.FAIR,
                    label: 'Vaccination Status',
                },
                weightManagementScore: {
                    score: healthScoreData?.[0]?.weight_management_score || 0,
                    category: HealthCategory.FAIR,
                    label: 'Weight Management',
                },
                healthRisks: (healthRisks || []).map(risk => ({
                    id: risk.id,
                    riskType: risk.risk_type as any, // Or specific Enum if available
                    riskLevel: (risk.risk_level || 'low') as RiskLevel,
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
                    recommendationType: rec.recommendation_type as RecommendationType,
                    priority: (rec.priority || 'medium') as Priority,
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
                dataCompleteness: healthScoreData?.[0]?.data_completeness_percentage || 0,
                lastCalculated: healthScoreData?.[0]?.calculated_date
                    ? new Date(healthScoreData[0].calculated_date)
                    : new Date(),
            };

            // Build complete passport
            const passportData: PetPassport = {
                passportId: pet.passport_id || 'Generating...',
                generatedAt: pet.passport_generated_at ? new Date(pet.passport_generated_at) : new Date(),
                lastUpdated: pet.passport_updated_at ? new Date(pet.passport_updated_at) : new Date(),
                identification,
                physical,
                health,
                vaccinations: (vaccinations || []).map(vac => ({
                    id: vac.id,
                    vaccineName: vac.vaccine_name,
                    category: (vac.category || 'core') as VaccineCategory,
                    dateGiven: new Date(vac.date_given),
                    nextDueDate: vac.next_due_date ? new Date(vac.next_due_date) : undefined,
                    doseNumber: vac.dose_number,
                    administeringVet: vac.administering_vet,
                    clinic: vac.clinic,
                    manufacturer: vac.manufacturer,
                    lotNumber: vac.lot_number,
                    route: vac.route as AdministrationRoute,
                    injectionSite: vac.injection_site,
                    certificateNumber: vac.certificate_number,
                    requiredForTravel: vac.required_for_travel || false,
                    notes: vac.notes,
                    status: {
                        isCurrent: vac.next_due_date ? new Date(vac.next_due_date) > new Date() : false,
                        isOverdue: vac.next_due_date ? new Date(vac.next_due_date) < new Date() : false,
                        daysUntilDue: vac.next_due_date
                            ? Math.ceil((new Date(vac.next_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                            : undefined,
                        daysOverdue: vac.next_due_date && new Date(vac.next_due_date) < new Date()
                            ? Math.ceil((new Date().getTime() - new Date(vac.next_due_date).getTime()) / (1000 * 60 * 60 * 24))
                            : undefined,
                    },
                })),
                treatments: (treatments || []).map(treatment => ({
                    id: treatment.id,
                    treatmentName: treatment.treatment_name,
                    category: (treatment.category || 'acute') as TreatmentCategory,
                    startDate: new Date(treatment.start_date),
                    endDate: treatment.end_date ? new Date(treatment.end_date) : undefined,
                    dosage: treatment.dosage || '',
                    frequency: treatment.frequency || '',
                    timeOfDay: treatment.time_of_day,
                    vet: treatment.vet,
                    prescribedBy: treatment.prescribed_by,
                    prescriptionNumber: treatment.prescription_number,
                    pharmacy: treatment.pharmacy,
                    refillsRemaining: treatment.refills_remaining,
                    isActive: treatment.is_active || false,
                    withFood: treatment.with_food,
                    sideEffects: treatment.side_effects,
                    specialInstructions: treatment.special_instructions,
                    notes: treatment.notes,
                })),
                medicalHistory: [
                    ...((medicalVisits || []).map(visit => ({
                        id: visit.id,
                        eventType: (visit.visit_type as MedicalEventType) || MedicalEventType.CHECKUP,
                        eventDate: new Date(visit.date),
                        title: visit.reason || 'Medical Visit',
                        description: visit.notes || '',
                        veterinarian: visit.vet_name,
                        clinic: visit.clinic_name,
                        notes: visit.notes,
                        status: EventStatus.COMPLETED,
                    }))),
                    ...((vaccinations || []).map(vac => ({
                        id: vac.id,
                        eventType: MedicalEventType.VACCINATION,
                        eventDate: new Date(vac.date_given),
                        title: `Vaccination: ${vac.vaccine_name}`,
                        description: `Administered ${vac.vaccine_name} (${vac.category})`,
                        veterinarian: vac.administering_vet,
                        clinic: vac.clinic,
                        notes: vac.notes,
                        status: EventStatus.COMPLETED,
                    })))
                ].sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime()),
                allergies: (allergies || []).map(allergy => ({
                    id: allergy.id,
                    type: allergy.type,
                    allergen: allergy.name || allergy.allergen_name || allergy.allergen || 'Unknown',
                    reactionDescription: allergy.reaction_description || '',
                    severity: allergy.severity_level || allergy.severity,
                    notes: allergy.notes,
                })),
                behavioralNotes: [],
                specialCare: [],
                conditions: (conditions || []).map(cond => ({
                    id: cond.id,
                    petId: cond.pet_id,
                    conditionName: cond.condition_name,
                    diagnosedDate: cond.diagnosed_date ? new Date(cond.diagnosed_date) : undefined,
                    status: cond.status,
                    notes: cond.notes,
                })),
                emergencyContacts: (emergencyContacts || []).map(contact => ({
                    id: contact.id,
                    contactType: contact.contact_type,
                    name: contact.name,
                    relationship: contact.relationship,
                    phone: contact.phone,
                    email: contact.email,
                    address: contact.address,
                    isPrimary: contact.is_primary || false,
                })),
            };

            setPassport(passportData);
        } catch (err) {
            console.error('Error fetching passport:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch passport'));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchPassport();
    }, [fetchPassport]);

    const refetch = useCallback(async () => {
        await fetchPassport();
    }, [fetchPassport]);

    return {
        passport,
        loading,
        error,
        refetch,
    };
}
