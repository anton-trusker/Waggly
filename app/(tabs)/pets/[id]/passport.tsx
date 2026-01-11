// Pet Passport Main Page
// Displays comprehensive passport with all widgets

import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, useWindowDimensions, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePassport } from '@/hooks/passport/usePassport';
import { useHealthScore } from '@/hooks/passport/useHealthScore';
import { useVaccinations } from '@/hooks/passport/useVaccinations';
import { useTreatments } from '@/hooks/passport/useTreatments';
import { useAllergies } from '@/hooks/passport/useAllergies';
import { useEmergencyContacts } from '@/hooks/passport/useEmergencyContacts';
import { useBodyCondition } from '@/hooks/passport/useBodyCondition';
import { useHealthMetrics } from '@/hooks/passport/useHealthMetrics';
import { useConditions } from '@/hooks/passport/useConditions';
import { useToast } from '@/contexts/ToastContext';

import PassportHeader from '@/components/passport/PassportHeader';
import PetIdentification from '@/components/passport/PetIdentification';
import HealthDashboard from '@/components/passport/HealthDashboard';
import VaccinationTable from '@/components/passport/VaccinationTable';
import TreatmentTable from '@/components/passport/TreatmentTable';
import AllergyList from '@/components/passport/AllergyList';
import EmergencyContactList from '@/components/passport/EmergencyContactList';
import { MedicalHistoryTimeline } from '@/components/passport/MedicalHistoryTimeline';
import { TravelReadiness } from '@/components/passport/TravelReadiness';
import { GeneralNotesWidget } from '@/components/passport/GeneralNotesWidget';
import { OwnerInfo } from '@/components/passport/OwnerInfo';
import ConditionList from '@/components/passport/ConditionList';
import CollapsibleSection from '@/components/layout/CollapsibleSection';

// NEW: Compact Widgets & Responsive Grid
// (Imports removed as they are integrated into Identification and Dashboard)

import VaccinationForm from '@/components/passport/forms/VaccinationForm';
import MedicationForm from '@/components/passport/forms/MedicationForm';
import HealthRecordForm from '@/components/passport/forms/HealthRecordForm';
import AllergyForm from '@/components/passport/forms/AllergyForm';
import AddNoteForm from '@/components/passport/forms/AddNoteForm';
import EmergencyContactForm from '@/components/passport/forms/EmergencyContactForm';
import BCSForm from '@/components/passport/forms/BCSForm';
import ConditionForm from '@/components/passport/forms/ConditionForm';
import WeightTrackingModal from '@/components/passport/modals/WeightTrackingModal';
import {
    MedicalCondition, ConditionFormData,
    Vaccination, VaccinationFormData,
    Treatment, TreatmentFormData,
    Allergy, AllergyFormData,
    EmergencyContact, EmergencyContactFormData
} from '@/types/passport';

interface PassportPageProps {
    onEditPet?: () => void;
}

export default function PassportPage({ onEditPet }: PassportPageProps) {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { passport, loading: passportLoading, error: passportError, refetch: refetchPassport } = usePassport(id);
    const { healthScore, recalculate } = useHealthScore(id);
    const { vaccinations, compliance, addVaccination, updateVaccination, deleteVaccination } = useVaccinations(id);
    const { treatments, addTreatment, updateTreatment, deleteTreatment } = useTreatments(id);
    const { allergies, addAllergy, updateAllergy, deleteAllergy } = useAllergies(id);
    const { contacts, addContact, updateContact, deleteContact } = useEmergencyContacts(id);
    const { conditions, addCondition, updateCondition, deleteCondition } = useConditions(id);

    const { addScore } = useBodyCondition(id);
    const { addHealthRecord, loading: recordLoading } = useHealthMetrics(id);
    const { success, error: toastError } = useToast();

    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Form Visibility States
    const [isVaccinationFormVisible, setIsVaccinationFormVisible] = useState(false);
    const [editingVaccination, setEditingVaccination] = useState<Vaccination | undefined>(undefined);

    const [isTreatmentFormVisible, setIsTreatmentFormVisible] = useState(false);
    const [editingTreatment, setEditingTreatment] = useState<Treatment | undefined>(undefined);

    const [isAllergyFormVisible, setIsAllergyFormVisible] = useState(false);
    const [editingAllergy, setEditingAllergy] = useState<Allergy | undefined>(undefined);

    const [isEmergencyFormVisible, setIsEmergencyFormVisible] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | undefined>(undefined);


    const [isBCSFormVisible, setIsBCSFormVisible] = useState(false);
    const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);

    const [isConditionFormVisible, setIsConditionFormVisible] = useState(false);
    const [editingCondition, setEditingCondition] = useState<MedicalCondition | undefined>(undefined);

    const [isHealthRecordFormVisible, setIsHealthRecordFormVisible] = useState(false);
    const [isNoteFormVisible, setIsNoteFormVisible] = useState(false);

    const loading = passportLoading;
    const error = passportError;

    // --- Handlers ---

    // Vaccination
    const handleAddVaccination = () => { setEditingVaccination(undefined); setIsVaccinationFormVisible(true); };
    const handleEditVaccination = (v: Vaccination) => { setEditingVaccination(v); setIsVaccinationFormVisible(true); };
    const handleDeleteVaccination = async (id: string) => {
        try {
            await deleteVaccination(id);
            success('Vaccination record deleted');
        } catch (err: any) {
            toastError(err.message || 'Failed to delete record');
        }
    };
    const handleSubmitVaccination = async (data: VaccinationFormData) => {
        try {
            if (editingVaccination) {
                await updateVaccination(editingVaccination.id, data);
                success('Vaccination updated');
            } else {
                await addVaccination(data);
                success('Vaccination added');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to save vaccination');
        }
    };

    // Treatment
    const handleAddTreatment = () => { setEditingTreatment(undefined); setIsTreatmentFormVisible(true); };
    const handleEditTreatment = (t: Treatment) => { setEditingTreatment(t); setIsTreatmentFormVisible(true); };
    const handleDeleteTreatment = async (id: string) => {
        try {
            await deleteTreatment(id);
            success('Treatment record deleted');
        } catch (err: any) {
            toastError(err.message || 'Failed to delete record');
        }
    };
    const handleSubmitTreatment = async (data: TreatmentFormData) => {
        try {
            if (editingTreatment) {
                await updateTreatment(editingTreatment.id, data);
                success('Treatment updated');
            } else {
                await addTreatment(data);
                success('Treatment added');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to save treatment');
        }
    };

    // Allergy
    const handleAddAllergy = () => { setEditingAllergy(undefined); setIsAllergyFormVisible(true); };
    const handleEditAllergy = (a: Allergy) => { setEditingAllergy(a); setIsAllergyFormVisible(true); };
    const handleDeleteAllergy = async (id: string) => {
        const allergy = allergies.find(a => a.id === id);
        Alert.alert(
            "Delete Allergy",
            `Are you sure you want to delete ${allergy?.allergen || 'this allergy'}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAllergy(id);
                            success('Allergy deleted');
                        } catch (err: any) {
                            toastError(err.message || 'Failed to delete record');
                        }
                    }
                }
            ]
        );
    };
    const handleSubmitAllergy = async (data: AllergyFormData) => {
        try {
            if (editingAllergy) {
                await updateAllergy(editingAllergy.id, data);
                success('Allergy updated');
            } else {
                await addAllergy(data);
                success('Allergy added');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to save allergy');
        }
    };

    // Emergency Contact
    const handleAddContact = () => { setEditingContact(undefined); setIsEmergencyFormVisible(true); };
    const handleEditContact = (c: EmergencyContact) => { setEditingContact(c); setIsEmergencyFormVisible(true); };
    const handleDeleteContact = async (id: string) => {
        try {
            await deleteContact(id);
            success('Contact deleted');
        } catch (err: any) {
            toastError(err.message || 'Failed to delete record');
        }
    };
    const handleSubmitContact = async (data: EmergencyContactFormData) => {
        try {
            if (editingContact) {
                await updateContact(editingContact.id, data);
                success('Contact updated');
            } else {
                await addContact(data);
                success('Contact added');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to save contact');
        }
    };

    // Conditions
    const handleAddCondition = () => { setEditingCondition(undefined); setIsConditionFormVisible(true); };
    const handleEditCondition = (c: MedicalCondition) => { setEditingCondition(c); setIsConditionFormVisible(true); };
    const handleDeleteCondition = async (id: string) => {
        try {
            await deleteCondition(id);
            success('Condition deleted');
        } catch (err: any) {
            toastError(err.message || 'Failed to delete condition');
        }
    };
    const handleSubmitCondition = async (data: ConditionFormData) => {
        try {
            if (editingCondition) {
                await updateCondition(editingCondition.id, data);
                success('Condition updated');
            } else {
                await addCondition(data);
                success('Condition added');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to save condition');
        }
    };

    // Health Records
    const handleSubmitHealthRecord = async (data: any) => {
        try {
            await addHealthRecord(data);
            success('Health record saved');
            await refetchPassport();
            await recalculate();
        } catch (err: any) {
            toastError(err.message || 'Failed to save health record');
        }
    };

    // BCS
    const handleAddBCS = () => setIsBCSFormVisible(true);
    const handleSubmitBCS = async (score: number, notes?: string, date?: Date) => {
        try {
            await addScore(score, notes, date);
            await refetchPassport();
            await recalculate();
            success('Body Condition Score updated');
        } catch (err: any) {
            toastError(err.message || 'Failed to update BCS');
        }
    };

    const handleAddNote = () => setIsNoteFormVisible(true);
    const handleSubmitNote = async (data: any) => {
        try {
            // Note submission logic - using a generic success for now
            success(`Added ${data.type} note`);
            await refetchPassport();
        } catch (err: any) {
            toastError(err.message || 'Failed to add note');
        }
    };

    if (loading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#10b981" /><Text style={styles.loadingText}>Loading passport...</Text></View>;
    if (error) return <View style={styles.centerContainer}><Text style={styles.errorTitle}>Error Loading Passport</Text><Text style={styles.errorText}>{error.message}</Text></View>;
    if (!passport) return <View style={styles.centerContainer}><Text style={styles.emptyTitle}>No Passport Data</Text></View>;

    const layoutProps = {
        passport,
        healthScore,
        vaccinations,
        treatments,
        compliance,
        allergies,
        contacts,
        onRecalculate: recalculate,
        petId: id,
        // Handlers
        vaccinationActions: { onAdd: handleAddVaccination, onEdit: handleEditVaccination, onDelete: handleDeleteVaccination },
        treatmentActions: { onAdd: handleAddTreatment, onEdit: handleEditTreatment, onDelete: handleDeleteTreatment },
        allergyActions: { onAdd: handleAddAllergy, onEdit: handleEditAllergy, onDelete: handleDeleteAllergy },
        contactActions: { onAdd: handleAddContact, onEdit: handleEditContact, onDelete: handleDeleteContact },
        onAddBCS: handleAddBCS,
        onEditWeight: () => setIsWeightModalVisible(true),
        onAddHealthRecord: () => setIsHealthRecordFormVisible(true),
        onAddNote: handleAddNote,
        conditionActions: { onAdd: handleAddCondition, onEdit: handleEditCondition, onDelete: handleDeleteCondition },
        conditions,
    };

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {isMobile ? <MobilePassportLayout {...layoutProps} onEditPet={onEditPet} /> : <DesktopPassportLayout {...layoutProps} onEditPet={onEditPet} />}
            </ScrollView>

            <VaccinationForm visible={isVaccinationFormVisible} onClose={() => setIsVaccinationFormVisible(false)} onSubmit={handleSubmitVaccination} initialData={editingVaccination} />
            <MedicationForm visible={isTreatmentFormVisible} onClose={() => setIsTreatmentFormVisible(false)} onSubmit={handleSubmitTreatment} initialData={editingTreatment} />
            <AllergyForm visible={isAllergyFormVisible} onClose={() => setIsAllergyFormVisible(false)} onSubmit={handleSubmitAllergy} initialData={editingAllergy} />
            <EmergencyContactForm visible={isEmergencyFormVisible} onClose={() => setIsEmergencyFormVisible(false)} onSubmit={handleSubmitContact} initialData={editingContact} />
            <ConditionForm visible={isConditionFormVisible} onClose={() => setIsConditionFormVisible(false)} onSubmit={handleSubmitCondition} initialData={editingCondition} />
            <HealthRecordForm visible={isHealthRecordFormVisible} onClose={() => setIsHealthRecordFormVisible(false)} onSubmit={handleSubmitHealthRecord} />
            <AddNoteForm visible={isNoteFormVisible} onClose={() => setIsNoteFormVisible(false)} onSubmit={handleSubmitNote} />
            <BCSForm visible={isBCSFormVisible} onClose={() => setIsBCSFormVisible(false)} onSubmit={handleSubmitBCS} />
            <WeightTrackingModal
                visible={isWeightModalVisible}
                onClose={() => {
                    setIsWeightModalVisible(false);
                    refetchPassport(); // Refresh main passport data on close to update current weight
                }}
                petId={id}
                currentWeight={passport.physical?.weight?.currentKg}
            />
        </>
    );
}

// Mobile Layout
function MobilePassportLayout({
    passport, healthScore, vaccinations, treatments, compliance, allergies, contacts,
    onRecalculate, vaccinationActions, treatmentActions, allergyActions, contactActions, onAddBCS,
    onEditWeight, onEditPet, conditions, conditionActions, onAddNote, onAddHealthRecord, petId
}: any) {
    return (
        <View style={styles.mobileLayout}>
            <PassportHeader
                petId={petId}
                petName={passport.identification.name}
                passportId={passport.passportId}
                generatedAt={passport.generatedAt}
                lastUpdated={passport.lastUpdated}
            />

            <PetIdentification
                identification={passport.identification}
                physical={passport.physical}
                healthScoreCategory={passport.health.overallScore.category}
                onEdit={onEditPet}
            />


            {healthScore && (
                <CollapsibleSection title="Health Score" icon="heart-circle-outline">
                    <HealthDashboard
                        health={healthScore}
                        physical={passport.physical}
                        onRecalculate={onRecalculate}
                        onAddMetric={onAddHealthRecord}
                        onAddBCS={onAddBCS}
                    />
                </CollapsibleSection>
            )}


            <CollapsibleSection title="Care Requirements" icon="alert-circle-outline">
                <AllergyList
                    allergies={allergies}
                    onAdd={allergyActions.onAdd}
                    onEdit={allergyActions.onEdit}
                    onDelete={allergyActions.onDelete}
                />
                <View style={{ height: 16 }} />
                <GeneralNotesWidget
                    behavioralNotes={passport.behavioralNotes}
                    specialCare={passport.specialCare}
                    onAddNote={onAddNote}
                />
            </CollapsibleSection>

            <CollapsibleSection title="Vaccination History" icon="shield-checkmark-outline">
                <VaccinationTable vaccinations={vaccinations} compliance={compliance} {...vaccinationActions} />
            </CollapsibleSection>

            <CollapsibleSection title="Medical Records" icon="medkit-outline">
                <ConditionList conditions={conditions} {...conditionActions} />
                <View style={{ height: 16 }} />
                <TreatmentTable treatments={treatments} {...treatmentActions} />
                <View style={{ height: 16 }} />
                <MedicalHistoryTimeline events={passport.medicalHistory} />
            </CollapsibleSection>

            <CollapsibleSection title="Emergency Contacts" icon="warning-outline" initialExpanded={false}>
                <EmergencyContactList contacts={contacts} {...contactActions} />
            </CollapsibleSection>


            <CollapsibleSection title="Travel" icon="airplane-outline" initialExpanded={false}>
                <TravelReadiness passport={passport} />
            </CollapsibleSection>
        </View>
    );
}

// Desktop Layout
function DesktopPassportLayout({
    passport, healthScore, vaccinations, treatments, compliance, allergies, contacts,
    onRecalculate, vaccinationActions, treatmentActions, allergyActions, contactActions, onAddBCS,
    onEditWeight, onEditPet, conditions, conditionActions, onAddNote, onAddHealthRecord, petId
}: any) {
    return (
        <View style={styles.desktopLayout}>
            <View style={styles.twoColumnLayout}>
                {/* Left Column */}
                <View style={styles.leftColumn}>
                    <PassportHeader
                        petId={petId}
                        petName={passport.identification.name}
                        passportId={passport.passportId}
                        generatedAt={passport.generatedAt}
                        lastUpdated={passport.lastUpdated}
                    />

                    <PetIdentification
                        identification={passport.identification}
                        physical={passport.physical}
                        healthScoreCategory={passport.health.overallScore.category}
                        onEdit={onEditPet}
                    />


                    {healthScore && (
                        <CollapsibleSection title="Health Score" icon="heart-circle-outline">
                            <HealthDashboard
                                health={healthScore}
                                physical={passport.physical}
                                onRecalculate={onRecalculate}
                                onAddMetric={onAddHealthRecord}
                                onAddBCS={onAddBCS}
                            />
                        </CollapsibleSection>
                    )}


                    <CollapsibleSection title="Important Notes" icon="alert-circle-outline">
                        <AllergyList
                            allergies={allergies}
                            onAdd={allergyActions.onAdd}
                            onEdit={allergyActions.onEdit}
                            onDelete={allergyActions.onDelete}
                        />
                        <View style={{ height: 16 }} />
                        <GeneralNotesWidget
                            behavioralNotes={passport.behavioralNotes}
                            specialCare={passport.specialCare}
                            onAddNote={onAddNote}
                        />
                    </CollapsibleSection>

                    {/* Owner Info */}
                    <OwnerInfo ownerId={passport.identification.ownerId} />

                    <CollapsibleSection title="Emergency Contacts" icon="warning-outline">
                        <EmergencyContactList contacts={contacts} {...contactActions} />
                    </CollapsibleSection>
                </View>

                {/* Right Column */}
                <View style={styles.rightColumn}>
                    <CollapsibleSection title="Vaccination History" icon="shield-checkmark-outline">
                        <VaccinationTable vaccinations={vaccinations} compliance={compliance} {...vaccinationActions} />
                    </CollapsibleSection>

                    <CollapsibleSection title="Medical Records" icon="medkit-outline">
                        <ConditionList conditions={conditions} {...conditionActions} />
                        <View style={{ height: 24 }} />
                        <TreatmentTable treatments={treatments} {...treatmentActions} />
                        <View style={{ height: 24 }} />
                        <MedicalHistoryTimeline events={passport.medicalHistory} />
                    </CollapsibleSection>


                    <CollapsibleSection title="Travel Readiness" icon="airplane-outline">
                        <TravelReadiness passport={passport} />
                    </CollapsibleSection>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    contentContainer: { padding: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 12, fontSize: 16, color: '#64748b' },
    errorTitle: { fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginBottom: 8 },
    errorText: { fontSize: 14, color: '#64748b', textAlign: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
    mobileLayout: { gap: 16 },
    desktopLayout: { gap: 16 },
    twoColumnLayout: { flexDirection: 'row', gap: 16 },
    leftColumn: { flex: 1, gap: 16 },
    rightColumn: { flex: 1, gap: 16 },
    column: { flex: 1, gap: 16 },
});
