import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { handleApiError } from '@/utils/errorHandler';
import { useLocale } from '@/hooks/useLocale';

export default function PetHealthPassport({ petId }: { petId: string }) {
  const { pets, loading, refreshPets } = usePets();
  const [pet, setPet] = useState<Pet | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    const foundPet = pets.find((p) => p.id === petId);
    if (foundPet) {
      setPet(foundPet);
    }
  }, [pets, petId]);

  const handleAddVisit = () => {
    router.push(`/(tabs)/pets/add-visit?petId=${petId}`);
  };

  const handleAddVaccination = () => {
    router.push(`/(tabs)/pets/add-vaccination?petId=${petId}`);
  };

  const handleAddTreatment = () => {
    router.push(`/(tabs)/pets/add-treatment?petId=${petId}`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('pets.not_found', { defaultValue: 'Pet not found' })}</Text>
        <TouchableOpacity onPress={refreshPets} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('common.retry', { defaultValue: 'Retry' })}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Quick Actions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol ios_icon_name="plus.circle.fill" android_material_icon_name="add" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>{t('common.quick_actions', { defaultValue: 'Quick Actions' })}</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddVisit}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
              <IconSymbol ios_icon_name="stethoscope" android_material_icon_name="medical-services" size={24} color="#0284C7" />
            </View>
            <Text style={styles.actionLabel}>{t('pets.add_visit', { defaultValue: 'Add Visit' })}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleAddVaccination}>
            <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="vaccines" size={24} color="#16A34A" />
            </View>
            <Text style={styles.actionLabel}>{t('pets.add_vaccine', { defaultValue: 'Add Vaccine' })}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleAddTreatment}>
            <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
              <IconSymbol ios_icon_name="pills.fill" android_material_icon_name="medication" size={24} color="#9333EA" />
            </View>
            <Text style={styles.actionLabel}>{t('pets.add_meds', { defaultValue: 'Add Meds' })}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Records Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol ios_icon_name="heart.text.square" android_material_icon_name="medical-information" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>{t('pets.health_records', { defaultValue: 'Health Records' })}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{t('pets.health_records_info', { defaultValue: 'Health records will be displayed here' })}</Text>
          <Text style={styles.infoSubtext}>{t('pets.health_records_subinfo', { defaultValue: "Add visits, vaccinations, and treatments to build your pet's health history" })}</Text>
        </View>
      </View>

      {/* Medical Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol ios_icon_name="cross.case" android_material_icon_name="medical-services" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>{t('pets.medical_information', { defaultValue: 'Medical Information' })}</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <IconSymbol ios_icon_name="qrcode" android_material_icon_name="qr_code" size={16} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>{t('pets.microchip', { defaultValue: 'Microchip' })}</Text>
            <Text style={styles.infoValue}>{pet.microchip_number || t('common.not_provided', { defaultValue: 'Not provided' })}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <IconSymbol ios_icon_name="tag" android_material_icon_name="label" size={16} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>{t('pets.registration_id', { defaultValue: 'Registration ID' })}</Text>
            <Text style={styles.infoValue}>{pet.registration_id || t('common.not_provided', { defaultValue: 'Not provided' })}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <IconSymbol ios_icon_name="scalemass" android_material_icon_name="scale" size={16} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>{t('pets.weight', { defaultValue: 'Weight' })}</Text>
            <Text style={styles.infoValue}>{pet.weight ? `${pet.weight} kg` : t('common.not_provided', { defaultValue: 'Not provided' })}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <IconSymbol ios_icon_name="checkmark.circle" android_material_icon_name="check-circle" size={16} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>{t('pets.spayed_neutered', { defaultValue: 'Spayed/Neutered' })}</Text>
            <Text style={styles.infoValue}>{pet.is_spayed_neutered === true ? t('common.yes', { defaultValue: 'Yes' }) : pet.is_spayed_neutered === false ? t('common.no', { defaultValue: 'No' }) : t('common.not_specified', { defaultValue: 'Not specified' })}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: '48%',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});
