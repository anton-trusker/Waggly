import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { usePets } from '@/hooks/usePets';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { uploadPetPhoto } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useBreeds } from '@/hooks/useBreeds';
import DropdownSearchList from '@/components/ui/DropdownSearchList';
import WizardHeader from '@/components/features/onboarding/WizardHeader';
import BottomCTA from '@/components/ui/BottomCTA';
import AvatarUpload from '@/components/ui/AvatarUpload';
import SegmentedControl from '@/components/ui/SegmentedControl';
import WeightSlider from '@/components/ui/WeightSlider';
import Radio from '@/components/ui/Radio';
import { formatAge } from '@/utils/dateUtils';
import NativeDatePicker from '@/components/ui/NativeDatePicker';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { useTranslation } from 'react-i18next';

export default function AddPetWizardScreen() {
  const [step, setStep] = useState<number>(1);
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [otherSpecies, setOtherSpecies] = useState('');
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [weightUnitIndex, setWeightUnitIndex] = useState(0);
  const [weightValue, setWeightValue] = useState(10);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [ageApproximate, setAgeApproximate] = useState('');
  const [showBirthPicker, setShowBirthPicker] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; breed?: string; birth?: string; type?: string }>({});

  const navigation = useNavigation();
  const { t } = useTranslation();

  const { user } = useAuth();
  const { addPet, updatePet } = usePets();
  const [breedQuery, setBreedQuery] = useState('');
  const { breeds, loading: breedsLoading, hasMore: breedsHasMore, loadMore: breedsLoadMore } = useBreeds(species, breedQuery);

  const speciesLabel = useMemo(() => species === 'other' ? (otherSpecies || t('add_pet.select_species')) : species, [species, otherSpecies, t]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      // Basic validation: type + (approx) size via fetch blob
      const uri = asset.uri;
      const isValidType = (asset.type === 'image' || uri.endsWith('.jpg') || uri.endsWith('.jpeg') || uri.endsWith('.png'));
      if (!isValidType) {
        Alert.alert('Invalid file', 'Please select a JPG or PNG image.');
        return;
      }
      try {
        const res = await fetch(uri);
        const blob = await res.blob();
        if (blob.size && blob.size > 5 * 1024 * 1024) {
          Alert.alert('File too large', 'Please select an image under 5MB.');
          return;
        }
      } catch (_e) {
        // If blob fails (platform limitations), continue without hard fail
      }
      setPhotoUri(uri);
    }
  };

  const validateStep = (nextStep?: number) => {
    const nextErrors: typeof errors = {};
    const targetStep = nextStep ?? step;
    if (targetStep === 1) {
      if (!species) nextErrors.type = t('add_pet.error_type');
      if (species === 'other' && !otherSpecies.trim()) nextErrors.type = t('add_pet.error_type');
    }
    if (targetStep === 2) {
      if ((species === 'dog' || species === 'cat') && !breed.trim()) nextErrors.breed = t('add_pet.error_breed');
    }
    if (targetStep === 3) {
      if (!name.trim()) nextErrors.name = t('add_pet.error_name');
      if (!birthDate && !ageApproximate.trim()) nextErrors.birth = t('add_pet.error_birth');
      if (birthDate && birthDate.getTime() > Date.now()) nextErrors.birth = 'Birth date cannot be in the future.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddPet = async () => {
    if (!validateStep(4)) return;
    if (weightValue && isNaN(Number(weightValue))) {
      setErrors((e) => ({ ...e, weight: t('add_pet.error_weight') }));
      return;
    }
    setIsSubmitting(true);
    const finalWeightKg = weightUnitIndex === 0 ? weightValue : Number((weightValue * 0.453592).toFixed(2));
    const { data, error } = await addPet({
      name: name.trim(),
      species: (species === 'other' ? (otherSpecies || 'other') : species) as any,
      breed: breed || undefined,
      gender: gender || undefined,
      date_of_birth: birthDate ? birthDate.toISOString().split('T')[0] : undefined,
      age_approximate: !birthDate && ageApproximate ? ageApproximate : undefined,
      weight: weightValue ? finalWeightKg : undefined,
    });
    let uploadedUrl: string | null = null;
    if (!error && data && photoUri && user) {
      try {
        uploadedUrl = await uploadPetPhoto(user.id, (data as any).id, photoUri);
        await updatePet((data as any).id, { photo_url: uploadedUrl });
      } catch (_e) {
        // non-blocking: pet created even if photo fails
      }
    }
    setIsSubmitting(false);

    if (error) {
      Alert.alert(t('common.error'), 'Failed to add pet. Please try again.');
      console.error('Add pet error:', error);
    } else {
      Alert.alert(t('common.save'), t('add_pet.success'), [
        { text: t('add_pet.go_dashboard'), onPress: () => router.replace('/(tabs)/(home)') }
      ]);
    }
  };

  const handleBack = () => {
    if (step === 1) router.back();
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(species === 'other' ? 1 : 2);
    else if (step === 4) setStep(3);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep(1)) return;
      setStep(species === 'other' ? 3 : 2);
    } else if (step === 2) {
      if (!validateStep(2)) return;
      setStep(3);
    } else if (step === 3) {
      if (!validateStep(3)) return;
      setStep(4);
    } else if (step === 4) {
      handleAddPet();
    }
  };

  const renderHeader = (subtitle: string) => (
    <WizardHeader subtitle={subtitle} step={step} totalSteps={4} onBack={handleBack} />
  );

  const speciesOptions: { key: typeof species; label: string; icon: string }[] = [
    { key: 'dog', label: 'Dog', icon: '🐕' },
    { key: 'cat', label: 'Cat', icon: '🐈' },
    { key: 'other', label: 'Other', icon: '🐾' },
  ];

  const renderTypeStep = () => (
    <>
      {renderHeader(t('add_pet.type_title'))}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchRow}>
          <TextInput style={styles.searchInput} placeholder={t('add_pet.search_species')} placeholderTextColor={colors.textSecondary} />
        </View>
        {speciesOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={styles.listItem}
            onPress={() => { setSpecies(opt.key); setErrors((e)=>({ ...e, type: undefined })); }}
            accessibilityRole="button"
            accessibilityLabel={`Select species ${opt.label}`}
          >
            <Text style={styles.listIcon}>{opt.icon}</Text>
            <Text style={styles.listLabel}>{opt.label}</Text>
            <Radio selected={species === opt.key} />
          </TouchableOpacity>
        ))}
        {species === 'other' && (
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>{t('add_pet.enter_species')}</Text>
            <TextInput style={commonStyles.input} placeholder="e.g., Lizard" placeholderTextColor={colors.textSecondary} value={otherSpecies} onChangeText={setOtherSpecies} />
          </View>
        )}
        {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
      </ScrollView>
    </>
  );

  const renderDetailsStep = () => (
    <>
      {renderHeader(t('add_pet.details_title'))}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AvatarUpload uri={photoUri} onChange={setPhotoUri} />
        <Text style={styles.prompt}>{t('add_pet.pet_name')}</Text>
        <TextInput style={styles.roundedInput} placeholder={t('add_pet.pet_name_placeholder') + " *"} placeholderTextColor={colors.textSecondary} value={name} onChangeText={(t) => { setName(t); if (t) setErrors((e)=>({ ...e, name: undefined })); }} />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        <View style={styles.inputContainer}>
          <NativeDatePicker
            label={t('add_pet.birth_date_label') + " *"}
            value={birthDate}
            onChange={(d) => {
               setBirthDate(d);
               setErrors((e)=>({ ...e, birth: undefined }));
            }}
            maximumDate={new Date()}
          />
          {birthDate && (
            <Text style={styles.hint}>{t('add_pet.calculated_age', { age: formatAge(birthDate) })}</Text>
          )}
        </View>
        {!birthDate && (
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>{t('add_pet.approx_age_label')}</Text>
            <TextInput style={commonStyles.input} placeholder={t('add_pet.approx_age_placeholder')} placeholderTextColor={colors.textSecondary} value={ageApproximate} onChangeText={(t)=>{ setAgeApproximate(t); if (t) setErrors((e)=>({ ...e, birth: undefined })); }} />
          </View>
        )}
        {errors.birth && <Text style={styles.errorText}>{errors.birth}</Text>}
      </ScrollView>
    </>
  );

  const renderBreedStep = () => (
    <>
      {renderHeader(t('add_pet.breed_title'))}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {species !== 'other' && (
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>{t('add_pet.search_breed')}</Text>
            <DropdownSearchList
              items={breeds.map(b => b.name)}
              placeholder={t('add_pet.search_breed')}
              loading={breedsLoading}
              selected={breed || null}
              onSelect={(i) => { setBreed(i); setErrors((e)=>({ ...e, breed: undefined })); }}
              onQueryChange={setBreedQuery}
              onLoadMore={breedsLoadMore}
              hasMore={breedsHasMore}
              loadingMore={false}
            />
            {errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}
          </View>
        )}
        {species === 'other' && (
            <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>{t('add_pet.enter_breed')}</Text>
            <TextInput style={styles.roundedInput} placeholder="Breed" placeholderTextColor={colors.textSecondary} value={breed} onChangeText={(t)=>{ setBreed(t); if (t) setErrors((e)=>({ ...e, breed: undefined })); }} />
            </View>
        )}
      </ScrollView>
    </>
  );

  const renderAdditionalStep = () => (
    <>
      {renderHeader(t('add_pet.additional_title'))}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={commonStyles.inputLabel}>{t('add_pet.gender')}</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity style={[styles.genderBullet, gender === 'male' && styles.genderSelected]} onPress={() => setGender('male')}>
              <Text style={styles.genderIcon}>♂</Text>
              <Text style={styles.genderLabel}>{t('add_pet.male')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.genderBullet, gender === 'female' && styles.genderSelected]} onPress={() => setGender('female')}>
              <Text style={styles.genderIcon}>♀</Text>
              <Text style={styles.genderLabel}>{t('add_pet.female')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>{t('add_pet.weight_hint')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={commonStyles.inputLabel}>{t('add_pet.weight')} ({weightUnitIndex === 0 ? 'kg' : 'lb'})</Text>
          <Text style={styles.hint}>{t('add_pet.weight_hint')}</Text>
          <WeightSlider value={weightValue} min={0.1} max={120} step={0.1} onChange={setWeightValue} />
          <SegmentedControl options={["kg", "lb"]} valueIndex={weightUnitIndex} onChange={setWeightUnitIndex} />
        </View>
      </ScrollView>
    </>
  );

  const ageText = birthDate ? formatAge(birthDate) : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {step === 1 && renderTypeStep()}
      {step === 2 && renderBreedStep()}
      {step === 3 && renderDetailsStep()}
      {step === 4 && renderAdditionalStep()}
      <BottomCTA 
        onBack={handleBack} 
        onPrimary={handleNext} 
        primaryLabel={step === 4 ? t('common.save') : t('common.continue')} 
        disabled={isSubmitting}
        bottomOffset={80}
      />
      <LoadingOverlay visible={isSubmitting} message={t('add_pet.saving')} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120, // Reduced from 200, still safe for BottomCTA
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subtitleLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  searchRow: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: colors.text,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  listLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  photoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  prompt: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  roundedInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 17,
    color: colors.text,
    marginBottom: 12,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  segmentActive: {
    borderColor: colors.primary,
  },
  segmentText: {
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  genderBullet: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  genderSelected: {
    borderColor: colors.primary,
  },
  genderIcon: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  genderLabel: {
    color: colors.text,
    fontSize: 13,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
  },
  listBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginTop: 8,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
});
