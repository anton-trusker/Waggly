import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { usePets } from '@/hooks/usePets';
import { useBreeds } from '@/hooks/useBreeds';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { IconSymbol } from '@/components/ui/IconSymbol';
import WeightSlider from '@/components/ui/WeightSlider';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
import EnhancedSelection from '@/components/ui/EnhancedSelection';
import BottomCTA from '@/components/ui/BottomCTA';
import { parseDDMMYYYY, isFutureDate } from '@/utils/dateUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/components/layout/AppHeader';

export default function AddPetScreen() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [size, setSize] = useState<'small' | 'medium' | 'large' | ''>('');
  const [weight, setWeight] = useState<number>(0);
  const [color, setColor] = useState('');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(true); // Expanded by default
  const [showVet, setShowVet] = useState(false); // Collapsed by default
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [vetClinic, setVetClinic] = useState('');
  const [vetName, setVetName] = useState('');
  const [vetPhone, setVetPhone] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    dateOfBirth?: string;
    weight?: string;
  }>({});

  const { addPet } = usePets();
  const { breeds: breedList } = useBreeds(species);

  const validate = useCallback(() => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) {
      nextErrors.name = 'Please enter a name';
    }
    if (dateOfBirth && !/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      nextErrors.dateOfBirth = 'Date must be DD-MM-YYYY';
    }
    if (dateOfBirth) {
      const parsed = parseDDMMYYYY(dateOfBirth);
      if (!parsed || isFutureDate(dateOfBirth)) {
        nextErrors.dateOfBirth = 'Date cannot be in future';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [name, dateOfBirth]);

  const handleAddPet = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await addPet({
        name: name.trim(),
        species,
        breed: breed || undefined,
        gender: gender || undefined,
        date_of_birth: dateOfBirth || undefined,
        size: size || undefined,
        weight: weight > 0 ? weight : undefined,
        color: color || undefined,
        microchip_number: microchipNumber || undefined,
      });

      if (error) {
        Alert.alert('Error', 'Failed to add pet. Please try again.');
        console.error('Add pet error:', error);
      } else {
        // Navigate directly to dashboard instead of going back
        router.replace('/(tabs)/(home)');
        // Show success message after navigation
        setTimeout(() => {
          Alert.alert('Success', `${name} has been added successfully!`);
        }, 300);
      }
    } finally {
      setLoading(false);
    }
  };

  const breedOptions = useMemo(() => {
    if (species === 'other') return [];
    return breedList.map(b => ({
      id: b.name,
      label: b.name,
      category: 'Breed'
    }));
  }, [breedList, species]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <AppHeader title="Add New Pet" showBack backPosition="left" hideAvatar />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Pet Info Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol ios_icon_name="pawprint" android_material_icon_name="pets" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Pet Information</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError] as any}
                    placeholder="Pet's name"
                    placeholderTextColor={colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                </View>
              </View>
              {/* Pet Type Selection - Enhanced Cards */}
              <View>
                <Text style={styles.label}>Species</Text>
                <View style={styles.petTypeRow}>
                  {[
                    { id: 'dog', label: 'Dog', icon: '🐕' },
                    { id: 'cat', label: 'Cat', icon: '🐈' },
                    { id: 'other', label: 'Other', icon: '🐾' }
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.petTypeCard,
                        species === type.id && styles.petTypeCardSelected
                      ] as any}
                      onPress={() => {
                        setSpecies(type.id as any);
                        setBreed(''); // Reset breed when species changes
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.petTypeIcon}>{type.icon}</Text>
                      <Text style={[
                        styles.petTypeLabel,
                        species === type.id && styles.petTypeLabelSelected
                      ]}>{type.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  {species === 'other' ? (
                    <View>
                      <Text style={styles.label}>Breed / Type</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Rabbit"
                        value={breed}
                        onChangeText={setBreed}
                      />
                    </View>
                  ) : (
                    <EnhancedSelection
                      label="Breed"
                      value={breed}
                      options={breedOptions}
                      onSelect={(opt) => setBreed(opt.id)}
                      placeholder="Select breed"
                      icon="tag"
                      searchable
                    />
                  )}
                </View>
                <View style={styles.col}>
                  <EnhancedSelection
                    label="Gender"
                    value={gender}
                    options={[
                      { id: 'male', label: 'Male', icon: 'mars' },
                      { id: 'female', label: 'Female', icon: 'venus' }
                    ] as any}
                    onSelect={(opt) => setGender(opt.id as any)}
                    placeholder="Gender"
                    icon="person.fill"
                    searchable={false}
                  />
                </View>
              </View>

              <EnhancedDatePicker
                label="Date of Birth"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                placeholder="Select date"
                error={errors.dateOfBirth}
                icon="calendar"
              />
            </View>

            {/* Physical Characteristics Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol ios_icon_name="scalemass" android_material_icon_name="scale" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Physical Characteristics</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <EnhancedSelection
                    label="Size"
                    value={size}
                    options={[
                      { id: 'small', label: 'Small' },
                      { id: 'medium', label: 'Medium' },
                      { id: 'large', label: 'Large' }
                    ] as any}
                    onSelect={(opt) => setSize(opt.id as any)}
                    placeholder="Size"
                    icon="scalemass"
                    searchable={false}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Color</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Brown"
                    value={color}
                    onChangeText={setColor}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight (kg)</Text>
                <WeightSlider value={weight} min={0.1} max={60} step={0.1} onChange={setWeight} />
              </View>
            </View>

            {/* Identification Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol ios_icon_name="qrcode" android_material_icon_name="qr-code" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Identification</Text>
              </View>

              <View>
                <Text style={styles.label}>Microchip Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter microchip number"
                  value={microchipNumber}
                  onChangeText={setMicrochipNumber}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Emergency Contact Section */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowEmergencyContact(!showEmergencyContact)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionHeaderContent}>
                  <IconSymbol ios_icon_name="phone.fill" android_material_icon_name="phone" size={18} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Emergency Contact</Text>
                </View>
                <IconSymbol
                  ios_icon_name={showEmergencyContact ? "chevron.up" : "chevron.down"}
                  android_material_icon_name={showEmergencyContact ? "expand-less" : "expand-more"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {showEmergencyContact && (
                <View style={styles.collapsibleContent}>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Text style={styles.label}>Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Contact name"
                        placeholderTextColor={colors.textTertiary}
                        value={emergencyContactName}
                        onChangeText={setEmergencyContactName}
                      />
                    </View>
                    <View style={styles.col}>
                      <Text style={styles.label}>Phone</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        placeholderTextColor={colors.textTertiary}
                        value={emergencyContactPhone}
                        onChangeText={setEmergencyContactPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Veterinarian Section */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowVet(!showVet)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionHeaderContent}>
                  <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="medical-services" size={18} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Veterinarian</Text>
                </View>
                <IconSymbol
                  ios_icon_name={showVet ? "chevron.up" : "chevron.down"}
                  android_material_icon_name={showVet ? "expand-less" : "expand-more"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {showVet && (
                <View style={styles.collapsibleContent}>
                  <View>
                    <Text style={styles.label}>Vet Clinic / Hospital</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Vet clinic name"
                      placeholderTextColor={colors.textTertiary}
                      value={vetClinic}
                      onChangeText={setVetClinic}
                    />
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Text style={styles.label}>Vet Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Veterinarian name"
                        placeholderTextColor={colors.textTertiary}
                        value={vetName}
                        onChangeText={setVetName}
                      />
                    </View>
                    <View style={styles.col}>
                      <Text style={styles.label}>Phone</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        placeholderTextColor={colors.textTertiary}
                        value={vetPhone}
                        onChangeText={setVetPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Spacer for bottom button - increased to account for tab bar */}
            <View style={{ height: 120 }} />
          </ScrollView>
        </TouchableWithoutFeedback>

        <BottomCTA
          onBack={() => router.back()}
          onPrimary={handleAddPet}
          primaryLabel="Add Pet"
          disabled={loading}
          bottomOffset={Platform.OS === 'ios' ? 80 : Platform.OS === 'web' ? 80 : 70}
        />

        <LoadingOverlay visible={loading} message="Saving pet..." />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    minHeight: 44,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  petTypeRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  petTypeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 80,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  petTypeCardSelected: {
    backgroundColor: colors.primaryBackground,
    borderColor: colors.primary,
    borderWidth: 2.5,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  petTypeIcon: {
    fontSize: 32,
    lineHeight: 32,
    marginBottom: 8,
  },
  petTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  petTypeLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginBottom: 8,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  collapsibleContent: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
