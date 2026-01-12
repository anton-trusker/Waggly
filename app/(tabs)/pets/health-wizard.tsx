import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { useVaccinations } from '@/hooks/useVaccinations';
import { useTreatments } from '@/hooks/useTreatments';
import { useMedicalVisits } from '@/hooks/useMedicalVisits';
import { useDocuments } from '@/hooks/useDocuments';
import { useReferenceData } from '@/hooks/useReferenceData';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import DropdownSearchList from '@/components/ui/DropdownSearchList';
import DateInputField from '@/components/ui/DateInputField';
import { IconSymbol } from '@/components/ui/IconSymbol';
import DocumentUpload from '@/components/ui/DocumentUpload';

type WizardType = 'vaccination' | 'treatment' | 'visit';

export default function HealthWizardScreen() {
  const { petId } = useLocalSearchParams();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<WizardType>('vaccination');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ vaccineName?: string; treatmentName?: string; visitReason?: string }>({});

  // Reference Data
  const { vaccinations: refVaccines, treatments: refTreatments } = useReferenceData();

  // Hooks
  const { addVaccination } = useVaccinations(petId as string);
  const { addTreatment } = useTreatments(petId as string);
  const { addVisit } = useMedicalVisits(petId as string);
  const { uploadDocument } = useDocuments(petId as string);

  // Form State
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineCategory, setVaccineCategory] = useState<'core' | 'non-core'>('core');
  const [doseNumber, setDoseNumber] = useState('');
  const [vaccineRefId, setVaccineRefId] = useState<string | null>(null);

  const [treatmentName, setTreatmentName] = useState('');
  const [treatmentCategory, setTreatmentCategory] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [treatmentRefId, setTreatmentRefId] = useState<string | null>(null);

  const [visitReason, setVisitReason] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [vetName, setVetName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDate, setNextDate] = useState('');
  const [notes, setNotes] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Prefill logic
  const handleSelectVaccine = (name: string) => {
    setVaccineName(name);
    const ref = refVaccines.find(v => v.name === name);
    if (ref) {
      if (ref.category) setVaccineCategory(ref.category as 'core' | 'non-core');
      if (ref.validity_months && date) {
        const d = new Date(date);
        d.setMonth(d.getMonth() + ref.validity_months);
        setNextDate(d.toISOString().split('T')[0]);
      }
      setVaccineRefId(ref.id as string);
    }
  };

  const handleSelectTreatment = (name: string) => {
    setTreatmentName(name);
    const ref = refTreatments.find(t => t.name === name);
    if (ref) {
      if (ref.category) setTreatmentCategory(ref.category);
      if (ref.default_frequency) setFrequency(ref.default_frequency);
      if (ref.validity_days && date) {
        const d = new Date(date);
        d.setDate(d.getDate() + ref.validity_days);
        setNextDate(d.toISOString().split('T')[0]);
      }
      setTreatmentRefId(ref.id as string);
    }
  };

  const handleSubmit = async () => {
    // simple inline validation before submit
    if (type === 'vaccination' && !vaccineName.trim()) {
      setErrors((e) => ({ ...e, vaccineName: 'Please select a vaccine' }));
      setStep(2);
      return;
    }
    if (type === 'treatment' && !treatmentName.trim()) {
      setErrors((e) => ({ ...e, treatmentName: 'Please select a treatment' }));
      setStep(2);
      return;
    }
    if (type === 'visit' && !visitReason.trim()) {
      setErrors((e) => ({ ...e, visitReason: 'Please enter reason for visit' }));
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      let result;

      if (type === 'vaccination') {
        result = await addVaccination({
          vaccine_name: vaccineName,
          category: vaccineCategory,
          date_given: date,
          next_due_date: nextDate || undefined,
          dose_number: doseNumber ? parseInt(doseNumber) : undefined,
          notes: notes || undefined,
          administering_vet: vetName || undefined,
        });
      } else if (type === 'treatment') {
        result = await addTreatment({
          treatment_name: treatmentName,
          category: treatmentCategory || 'General',
          dosage: dosage || undefined,
          frequency: frequency || undefined,
          start_date: date,
          end_date: nextDate || undefined,
          notes: notes || undefined,
          vet: vetName || undefined,
          is_active: true,
        });
      } else {
        result = await addVisit({
          date: date,
          clinic_name: clinicName || undefined,
          vet_name: vetName || undefined,
          reason: visitReason,
          diagnosis: diagnosis || undefined,
          notes: notes || undefined,
        });
      }

      if (result.error) throw result.error;

      // Upload document if attached
      if (attachedFile) {
        const docType = type === 'vaccination' ? 'certificate' : type === 'treatment' ? 'prescription' : 'other';
        const fileName = `${type}_${date}_${new Date().getTime()}.jpg`;
        await uploadDocument(attachedFile, docType, fileName, { source: 'wizard' });
      }

      Alert.alert('Success', 'Record added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save record.');
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What would you like to add?</Text>

      <TouchableOpacity
        style={[styles.typeCard, type === 'vaccination' && styles.typeCardActive] as any}
        onPress={() => setType('vaccination')}
        accessibilityRole="button"
        accessibilityLabel="Select vaccination"
      >
        <View style={styles.typeIcon}>
          <IconSymbol
            ios_icon_name="cross.case.fill"
            android_material_icon_name="medical-services"
            size={28}
            color={type === 'vaccination' ? colors.primary : colors.textSecondary}
          />
        </View>
        <View style={styles.typeContent}>
          <Text style={[styles.typeTitle, type === 'vaccination' && styles.activeText]}>Vaccination</Text>
          <Text style={styles.typeDesc}>Log a new vaccine dose</Text>
        </View>
        {type === 'vaccination' && <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color={colors.primary} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.typeCard, type === 'treatment' && styles.typeCardActive] as any}
        onPress={() => setType('treatment')}
        accessibilityRole="button"
        accessibilityLabel="Select treatment"
      >
        <View style={styles.typeIcon}>
          <IconSymbol
            ios_icon_name="pills.fill"
            android_material_icon_name="medication"
            size={28}
            color={type === 'treatment' ? colors.primary : colors.textSecondary}
          />
        </View>
        <View style={styles.typeContent}>
          <Text style={[styles.typeTitle, type === 'treatment' && styles.activeText]}>Treatment</Text>
          <Text style={styles.typeDesc}>Medications, flea/tick, deworming</Text>
        </View>
        {type === 'treatment' && <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color={colors.primary} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.typeCard, type === 'visit' && styles.typeCardActive] as any}
        onPress={() => setType('visit')}
        accessibilityRole="button"
        accessibilityLabel="Select medical visit"
      >
        <View style={styles.typeIcon}>
          <IconSymbol
            ios_icon_name="stethoscope"
            android_material_icon_name="local-hospital"
            size={28}
            color={type === 'visit' ? colors.primary : colors.textSecondary}
          />
        </View>
        <View style={styles.typeContent}>
          <Text style={[styles.typeTitle, type === 'visit' && styles.activeText]}>Medical Visit</Text>
          <Text style={styles.typeDesc}>Check-ups, consultations, surgeries</Text>
        </View>
        {type === 'visit' && <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color={colors.primary} />}
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter Details</Text>

      {type === 'vaccination' && (
        <>
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Vaccine Name *</Text>
            <DropdownSearchList
              items={refVaccines.map(v => v.name)}
              selected={vaccineName}
              onSelect={handleSelectVaccine}
              onQueryChange={setVaccineName}
              placeholder="e.g. Rabies"
            />
            {errors.vaccineName ? <Text style={styles.errorText}>{errors.vaccineName}</Text> : null}
          </View>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={commonStyles.inputLabel}>Dose #</Text>
              <TextInput
                style={commonStyles.input}
                value={doseNumber}
                onChangeText={setDoseNumber}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 2 }]}>
              <Text style={commonStyles.inputLabel}>Category</Text>
              <TextInput
                style={commonStyles.input}
                value={vaccineCategory}
                editable={false}
              />
            </View>
          </View>
        </>
      )}

      {type === 'treatment' && (
        <>
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Treatment Name *</Text>
            <DropdownSearchList
              items={refTreatments.map(t => t.name)}
              selected={treatmentName}
              onSelect={handleSelectTreatment}
              onQueryChange={setTreatmentName}
              placeholder="e.g. Deworming"
            />
            {errors.treatmentName ? <Text style={styles.errorText}>{errors.treatmentName}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Medication (Optional)</Text>
            <TextInput
              style={commonStyles.input}
              value={medication}
              onChangeText={setMedication}
              placeholder="Brand or drug name"
            />
          </View>
        </>
      )}

      {type === 'visit' && (
        <View style={styles.inputContainer}>
          <Text style={commonStyles.inputLabel}>Reason for Visit *</Text>
          <TextInput
            style={commonStyles.input}
            value={visitReason}
            onChangeText={setVisitReason}
            placeholder="e.g. Annual Checkup, Limping"
          />
          {errors.visitReason ? <Text style={styles.errorText}>{errors.visitReason}</Text> : null}
        </View>
      )}

      <DateInputField
        label="Date *"
        value={date}
        onChange={setDate}
        maxDate={type === 'vaccination' ? new Date() : undefined}
      />

      <View style={styles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Veterinarian / Clinic</Text>
        <TextInput
          style={commonStyles.input}
          value={vetName}
          onChangeText={setVetName}
          placeholder="Dr. Smith"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Notes</Text>
        <TextInput
          style={[commonStyles.input, styles.textArea] as any}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholder="Any additional details..."
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Attachments & Reminders</Text>

      <DocumentUpload
        label="Upload Certificate / Prescription"
        onSelect={(uri, mime, name, size) => {
          setAttachedFile(uri);
        }}
      />

      {(type === 'vaccination' || type === 'treatment') && (
        <View style={styles.reminderSection}>
          <Text style={styles.sectionHeader}>Next Due Date</Text>
          <Text style={styles.sectionDesc}>We'll send you a reminder when it's time.</Text>
          <DateInputField
            label="Due Date"
            value={nextDate}
            onChange={setNextDate}
          />
          {nextDate ? <Text style={styles.hintText}>Calculated from reference, you can adjust.</Text> : null}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={[styles.dot, step >= 1 && styles.activeDot]} />
          <View style={[styles.line, step >= 2 && styles.activeLine]} />
          <View style={[styles.dot, step >= 2 && styles.activeDot]} />
          <View style={[styles.line, step >= 3 && styles.activeLine]} />
          <View style={[styles.dot, step >= 3 && styles.activeDot]} />
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[buttonStyles.primary, loading && styles.disabledBtn] as any}
          onPress={() => {
            if (step < 3) setStep(step + 1);
            else handleSubmit();
          }}
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={buttonStyles.textWhite}>{step === 3 ? 'Save Record' : 'Next'}</Text>
          )}
        </TouchableOpacity>
      </View>
      <LoadingOverlay visible={isSubmitting} message="Saving record..." />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSpacing(5),
    paddingTop: getSpacing(15),
    paddingBottom: getSpacing(4),
    backgroundColor: colors.background,
  },
  backButton: {
    fontSize: 17,
    color: colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: getSpacing(2),
    height: getSpacing(2),
    borderRadius: designSystem.borderRadius.xs,
    backgroundColor: colors.border,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  line: {
    width: getSpacing(7),
    height: getSpacing(0.5),
    backgroundColor: colors.border,
  },
  activeLine: {
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: getSpacing(5),
    paddingBottom: getSpacing(16),
  },
  stepContainer: {
    gap: getSpacing(4),
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: getSpacing(2),
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(4),
    backgroundColor: colors.card,
    borderRadius: designSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: getSpacing(3),
  },
  typeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  typeIcon: {
    width: getSpacing(12),
    height: getSpacing(12),
    borderRadius: designSystem.borderRadius['2xl'],
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing(4),
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: getSpacing(1),
  },
  activeText: {
    color: colors.primary,
  },
  typeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  inputContainer: {
    marginBottom: getSpacing(4),
  },
  row: {
    flexDirection: 'row',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: getSpacing(1),
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: getSpacing(1),
  },
  reminderSection: {
    marginTop: getSpacing(6),
    paddingTop: getSpacing(6),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: getSpacing(1),
  },
  sectionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: getSpacing(4),
  },
  footer: {
    padding: getSpacing(5),
    paddingBottom: getSpacing(10),
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  disabledBtn: {
    opacity: 0.7,
  },
});
