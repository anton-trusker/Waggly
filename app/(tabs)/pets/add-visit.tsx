import React, { useState, useCallback, useEffect } from 'react';
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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { supabase } from '@/lib/supabase';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { IconSymbol } from '@/components/ui/IconSymbol';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
import { parseDDMMYYYY } from '@/utils/dateUtils';
import AppHeader from '@/components/layout/AppHeader';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';
import BottomCTA from '@/components/ui/BottomCTA';

export default function AddVisitScreen() {
  const { petId: initialPetId } = useLocalSearchParams<{ petId: string }>();
  const { user } = useAuth();
  const { pets } = usePets();

  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState<{ lat: number, lng: number, placeId: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
  }>({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Keyboard handling
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Update selected pet if initialPetId changes
  useEffect(() => {
    if (initialPetId) setSelectedPetId(initialPetId);
  }, [initialPetId]);

  const validate = useCallback(() => {
    const nextErrors: typeof errors = {};
    if (!title.trim()) {
      nextErrors.title = 'Please enter a title for the visit';
    }
    if (!date) {
      nextErrors.date = 'Please select a date';
    }
    if (date && !/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      nextErrors.date = 'Date must be in DD-MM-YYYY format';
    }
    if (date) {
      const parsed = parseDDMMYYYY(date);
      if (!parsed) {
        nextErrors.date = 'Invalid date format';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [title, date]);

  const handleAddVisit = async () => {
    if (!validate()) return;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a visit');
      return;
    }
    if (!selectedPetId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    setLoading(true);

    try {
      let startTime = date;
      if (time) {
        startTime = `${date}T${time}:00`;
      } else {
        startTime = `${date}T09:00:00`;
      }

      const { error } = await supabase
        .from('events')
        .insert([{
          user_id: user.id,
          pet_id: selectedPetId,
          type: 'vet',
          title: title,
          start_time: startTime,
          location: location || null,
          location_lat: locationDetails?.lat || null,
          location_lng: locationDetails?.lng || null,
          place_id: locationDetails?.placeId || null,
          description: notes || null,
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Visit added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding visit:', error);
      Alert.alert('Error', 'Failed to add visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType?: 'default' | 'decimal-pad' | 'numeric',
    error?: string,
    icon?: string,
    required?: boolean,
    multiline?: boolean
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelContainer}>
        {icon && <IconSymbol ios_icon_name={icon} android_material_icon_name={icon} size={16} color={colors.textSecondary} />}
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, multiline && styles.textArea] as any}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={!loading}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
        {icon && (
          <View style={styles.inputIcon}>
            <IconSymbol ios_icon_name={icon} android_material_icon_name={icon} size={20} color={colors.textSecondary} />
          </View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >


      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        setShowPlaceDropdown(false);
      }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          {/* Pet Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>For Pet</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petRow}>
              {pets.map(pet => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.petChip, selectedPetId === pet.id && styles.petChipSelected] as any}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text style={[styles.petChipText, selectedPetId === pet.id && styles.petChipTextSelected]}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Visit Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol ios_icon_name="stethoscope" android_material_icon_name="medical-services" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Visit Details</Text>
            </View>

            {renderInputField(
              'Visit Title',
              title,
              setTitle,
              'Enter visit title (e.g., Annual Checkup)',
              'default',
              errors.title,
              'text.badge.plus',
              true
            )}

            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <EnhancedDatePicker
                  label="Date"
                  value={date}
                  onChange={setDate}
                  placeholder="Select visit date"
                  error={errors.date}
                  required={true}
                  icon="calendar"
                />
              </View>
              <View style={styles.inputColumn}>
                {renderInputField(
                  'Time',
                  time,
                  setTime,
                  'HH:MM (optional)',
                  'default',
                  undefined,
                  'clock',
                  false
                )}
              </View>
            </View>

            {/* Location with Google Places Search */}
            <LocationAutocomplete
              label="Location"
              value={location}
              onChangeText={setLocation}
              onPlaceSelected={(details) => {
                setLocation(details.address);
                setLocationDetails({
                  lat: details.lat,
                  lng: details.lng,
                  placeId: details.placeId,
                });
              }}
              placeholder="Search for a location..."
            />

            {renderInputField(
              'Notes',
              notes,
              setNotes,
              'Additional notes about the visit (optional)',
              'default',
              undefined,
              'note.text',
              false,
              true
            )}
          </View>



          {/* Add extra space for fixed button */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </TouchableWithoutFeedback>

      <BottomCTA
        onBack={() => router.back()}
        onPrimary={handleAddVisit}
        primaryLabel="Add Visit"
        disabled={loading}
      />

      <LoadingOverlay visible={loading} message="Saving visit..." />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Reduced from 40 for fixed button
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  petRow: {
    gap: 10,
  },
  petChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  petChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  petChipText: {
    color: colors.text,
    fontWeight: '500',
  },
  petChipTextSelected: {
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputColumn: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  required: {
    color: colors.error,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 2,
  },
  dropdownContainer: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  dropdownLoadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dropdownEmpty: {
    padding: 16,
    alignItems: 'center',
  },
  dropdownEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownItemText: {
    flex: 1,
  },
  dropdownItemMainText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  dropdownItemSecondaryText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Extra padding for iOS home indicator
  },
});
