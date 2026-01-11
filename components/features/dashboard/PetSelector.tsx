import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { designSystem, getSpacing } from '@/constants/designSystem';
import { usePets } from '@/hooks/usePets';
import { usePersistentState } from '@/utils/persistentState';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocale } from '@/hooks/useLocale';

export function PetSelector() {
  const { t } = useLocale();
  const { pets } = usePets();
  const { state: lastSelectedPetId, setState: setLastSelectedPetId } = usePersistentState<string | null>('lastSelectedPetId', null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const selectedPet = pets.find(pet => pet.id === lastSelectedPetId) || pets[0];

  const handlePetSelect = (petId: string) => {
    setLastSelectedPetId(petId);
    setDropdownVisible(false);
  };

  if (!pets.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPetsText}>{t('pets.no_pets', { defaultValue: 'No pets added yet.' })}</Text>
      </View>
    );
  }

  const dropdownItems = pets.map(pet => ({
    label: pet.name,
    value: pet.id,
  }));

  return (
    <View style={styles.container}>
      {pets.length === 1 ? (
        <View style={styles.singlePetContainer}>
          {selectedPet?.imageUri && (
            <Image source={{ uri: selectedPet.imageUri }} style={styles.petImage} />
          )}
          <Text style={styles.petName}>{selectedPet?.name}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setDropdownVisible(true)} accessibilityLabel={t('pets.select_a_pet', { defaultValue: 'Select a pet' })}>
          {selectedPet?.imageUri && (
            <Image source={{ uri: selectedPet.imageUri }} style={styles.petImage} />
          )}
          <Text style={styles.petName}>{selectedPet?.name}</Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={getSpacing(6)}
            color={designSystem.colors.text.primary}
          />
        </TouchableOpacity>
      )}

      {/* Simple Modal Dropdown */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>{t('pets.select_pet', { defaultValue: 'Select Pet' })}</Text>
            <FlashList
              data={dropdownItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handlePetSelect(item.value)}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.dropdownSeparator} />}
              estimatedItemSize={60}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getSpacing(4),
    marginBottom: getSpacing(4),
  },
  singlePetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getSpacing(3),
    paddingVertical: getSpacing(2),
    borderRadius: designSystem.borderRadius.md,
    backgroundColor: designSystem.colors.background.secondary,
    ...designSystem.shadows.sm,
  },
  petImage: {
    width: getSpacing(10),
    height: getSpacing(10),
    borderRadius: designSystem.borderRadius.full,
    marginRight: getSpacing(2),
    backgroundColor: designSystem.colors.neutral[200],
  },
  petName: {
    ...designSystem.typography.headline.small,
    color: designSystem.colors.text.primary,
    marginRight: getSpacing(2),
  },
  noPetsText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: designSystem.colors.background.primary,
    borderRadius: designSystem.borderRadius.lg,
    padding: designSystem.spacing[4],
    width: '80%',
    maxHeight: '50%',
    ...designSystem.shadows.lg,
  },
  dropdownTitle: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing[4],
    textAlign: 'center',
  },
  dropdownItem: {
    paddingVertical: designSystem.spacing[3],
    paddingHorizontal: designSystem.spacing[4],
  },
  dropdownItemText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
  },
  dropdownSeparator: {
    height: 1,
    backgroundColor: designSystem.colors.border.primary,
  },
});
