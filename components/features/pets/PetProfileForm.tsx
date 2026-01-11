import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Pet } from '@/types';
import AvatarUpload from '@/components/ui/AvatarUpload';
import { Picker } from '@react-native-picker/picker';
import { uploadPetPhoto } from '@/lib/storage';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useBreeds } from '@/hooks/useBreeds';
import DropdownSearchList from '@/components/ui/DropdownSearchList';
import { IconSymbol } from '@/components/ui/IconSymbol';

type Props = {
  pet: Pet;
  onSaved?: (p: Pet) => void;
  onCancel?: () => void;
};

export default function PetProfileForm({ pet, onSaved, onCancel }: Props) {
  const [name, setName] = useState(pet.name || '');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>(pet.species || 'dog');
  const [breed, setBreed] = useState(pet.breed || '');
  const [gender, setGender] = useState<'male' | 'female' | ''>(pet.gender || '');
  const [dateOfBirth, setDateOfBirth] = useState(pet.date_of_birth || '');
  const [size, setSize] = useState<'small' | 'medium' | 'large' | ''>(pet.size || '');
  const [weight, setWeight] = useState(pet.weight ? String(pet.weight) : '');
  const [colorText, setColorText] = useState(pet.color || '');
  const [microchipNumber, setMicrochipNumber] = useState(pet.microchip_number || '');
  const [photoUri, setPhotoUri] = useState<string | null>(pet.photo_url || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    dateOfBirth?: string;
    weight?: string;
  }>({});

  const { updatePet } = usePets();
  const { user } = useAuth();
  const { breeds: breedList } = useBreeds(species);

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) {
      nextErrors.name = 'Please enter a name for your pet';
    }
    if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      nextErrors.dateOfBirth = 'Date must be in YYYY-MM-DD format';
    }
    if (dateOfBirth) {
      const parsed = new Date(dateOfBirth);
      if (Number.isNaN(parsed.getTime()) || parsed.getTime() > Date.now()) {
        nextErrors.dateOfBirth = 'Date cannot be in the future';
      }
    }
    if (weight) {
      const weightNumber = Number(weight);
      if (Number.isNaN(weightNumber) || weightNumber <= 0) {
        nextErrors.weight = 'Weight must be a positive number';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to edit pet');
      return;
    }

    setLoading(true);
    try {
      let photo_url: string | undefined = pet.photo_url;
      if (photoUri && photoUri !== pet.photo_url) {
        const uploadedUrl = await uploadPetPhoto(user.id, pet.id, photoUri, pet.photo_url || null);
        photo_url = uploadedUrl;
      }

      const payload: Partial<Pet> = {
        name: name.trim(),
        species,
        breed: breed || undefined,
        gender: gender || undefined,
        date_of_birth: dateOfBirth || undefined,
        size: size || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        color: colorText || undefined,
        microchip_number: microchipNumber || undefined,
        photo_url,
      };

      const { data, error } = await updatePet(pet.id, payload);
      if (error) {
        Alert.alert('Error', 'Failed to save changes');
        console.error('Update pet error:', error);
      } else {
        if (onSaved && data) onSaved(data as Pet);
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (e) {
      Alert.alert('Error', 'Photo upload failed');
      console.error('Photo upload error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Discard Changes', 'Are you sure you want to discard changes?', [
      { text: 'Keep Editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => onCancel && onCancel() },
    ]);
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

  const renderPickerField = (
    label: string,
    selectedValue: string,
    onValueChange: (value: string) => void,
    items: { label: string; value: string }[],
    icon?: string,
    placeholder?: string
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputLabelContainer}>
        {icon && <IconSymbol ios_icon_name={icon} android_material_icon_name={icon} size={16} color={colors.textSecondary} />}
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          enabled={!loading}
          style={styles.picker}
        >
          {placeholder && <Picker.Item label={placeholder} value="" />}
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
        {icon && (
          <View style={styles.pickerIcon}>
            <IconSymbol ios_icon_name={icon} android_material_icon_name={icon} size={20} color={colors.textSecondary} />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          {/* Avatar Upload */}
          <View style={styles.avatarSection}>
            <AvatarUpload uri={photoUri} onChange={setPhotoUri} />
          </View>

          {/* Pet Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol ios_icon_name="pawprint" android_material_icon_name="pets" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Pet Information</Text>
            </View>

            {renderInputField(
              'Pet Name',
              name,
              setName,
              'Enter your pet\'s name',
              'default',
              errors.name,
              'person.fill',
              true
            )}

            {renderPickerField(
              'Species',
              species,
              (value) => setSpecies(value as 'dog' | 'cat' | 'other'),
              [
                { label: '🐕 Dog', value: 'dog' },
                { label: '🐈 Cat', value: 'cat' },
                { label: '🐾 Other', value: 'other' }
              ],
              'pawprint'
            )}

            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <IconSymbol ios_icon_name="tag" android_material_icon_name="label" size={16} color={colors.textSecondary} />
                <Text style={styles.inputLabel}>Breed</Text>
              </View>
              {species === 'dog' || species === 'cat' ? (
                <DropdownSearchList
                  items={breedList.map(b => b.name)}
                  selected={breed}
                  onSelect={setBreed}
                  onQueryChange={setBreed}
                  placeholder={`Search ${species} breeds`}
                  loading={false}
                />
              ) : (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter breed"
                    placeholderTextColor={colors.textSecondary}
                    value={breed}
                    onChangeText={setBreed}
                    editable={!loading}
                  />
                  <View style={styles.inputIcon}>
                    <IconSymbol ios_icon_name="tag" android_material_icon_name="label" size={20} color={colors.textSecondary} />
                  </View>
                </View>
              )}
            </View>

            {renderPickerField(
              'Gender',
              gender,
              (value) => setGender(value as 'male' | 'female' | ''),
              [
                { label: 'Select gender', value: '' },
                { label: '♂️ Male', value: 'male' },
                { label: '♀️ Female', value: 'female' }
              ],
              'person.fill'
            )}

            {renderInputField(
              'Date of Birth',
              dateOfBirth,
              (text) => setDateOfBirth(text),
              'YYYY-MM-DD',
              'default',
              errors.dateOfBirth,
              'calendar'
            )}
          </View>

          {/* Physical Characteristics Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol ios_icon_name="scalemass" android_material_icon_name="scale" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Physical Characteristics</Text>
            </View>

            {renderPickerField(
              'Size',
              size,
              (value) => setSize(value as 'small' | 'medium' | 'large' | ''),
              [
                { label: 'Select size', value: '' },
                { label: '🐕 Small', value: 'small' },
                { label: '🐕 Medium', value: 'medium' },
                { label: '🐕 Large', value: 'large' }
              ],
              'scalemass'
            )}

            {renderInputField(
              'Weight (kg)',
              weight,
              (text) => setWeight(text),
              'Enter weight in kilograms',
              'decimal-pad',
              errors.weight,
              'scalemass'
            )}

            {renderInputField(
              'Color',
              colorText,
              setColorText,
              'Enter color (e.g., Black, Brown, White)',
              'default',
              undefined,
              'paintbrush.fill'
            )}
          </View>

          {/* Identification Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol ios_icon_name="qrcode" android_material_icon_name="qr-code" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Identification</Text>
            </View>

            {renderInputField(
              'Microchip Number',
              microchipNumber,
              setMicrochipNumber,
              'Enter microchip number (optional)',
              'default',
              undefined,
              'qrcode'
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton] as any}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton] as any}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Pressable>

      {/* Add extra padding when keyboard is visible */}
      <View style={{ height: 40 }} />
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
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
  pickerWrapper: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  pickerIcon: {
    position: 'absolute',
    right: 16,
    top: 13,
    pointerEvents: 'none',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});