import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView, Animated, Dimensions, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ActionItem = {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
  color: string;
};

const actions: ActionItem[] = [
  { id: 'photos', title: 'Add Photos', icon: 'camera', route: '/(tabs)/pets/add-photos', color: '#4F46E5' },
  { id: 'weight', title: 'Log Weight', icon: 'scale-bathroom', route: '/(tabs)/pets/log-weight', color: '#10B981' },
  { id: 'event', title: 'Add Event', icon: 'calendar-plus', route: '/(tabs)/calendar/add-event', color: '#F59E0B' },
  { id: 'visit', title: 'Add Visit', icon: 'hospital-box', route: '/(tabs)/pets/add-visit', color: '#EF4444' },
  { id: 'treatment', title: 'Add Meds', icon: 'pill', route: '/(tabs)/pets/add-treatment', color: '#8B5CF6' },
  { id: 'vaccine', title: 'Vaccine', icon: 'needle', route: '/(tabs)/pets/add-vaccination', color: '#EC4899' },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export default function AddActionsModal({ visible, onClose }: Props) {
  const { pets } = usePets();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      if (!selectedPet && pets.length > 0) {
        setSelectedPet(pets[0]);
      }
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, pets]);

  const handleActionPress = (action: ActionItem) => {
    onClose();
    // Small delay to allow modal to close smoothly
    setTimeout(() => {
        if (!selectedPet) {
          router.push('/(tabs)/pets/add-pet-wizard');
          return;
        }
        router.push({ pathname: action.route as any, params: { petId: selectedPet.id } });
    }, 100);
  };

  const PetCard = ({ pet, isSelected }: { pet: Pet; isSelected: boolean }) => (
    <TouchableOpacity 
      style={[styles.petCard, isSelected && styles.petCardSelected]} 
      onPress={() => setSelectedPet(pet)}
      activeOpacity={0.9}
    >
      <View style={styles.petImageContainer}>
        {pet.photo_url ? (
          <Image source={{ uri: pet.photo_url }} style={styles.petImage} />
        ) : (
          <View style={[styles.petImagePlaceholder, { backgroundColor: isSelected ? colors.primary : colors.card }]}>
            <Text style={styles.petEmoji}>
              {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
            </Text>
          </View>
        )}
        {isSelected && (
          <View style={styles.checkmark}>
            <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={12} color="#fff" />
          </View>
        )}
      </View>
      <Text style={[styles.petName, isSelected && styles.petNameSelected]} numberOfLines={1}>
        {pet.name}
      </Text>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
          {Platform.OS === 'ios' && <BlurView intensity={20} style={StyleSheet.absoluteFill} />}
        </Animated.View>

        <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Quick Actions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
               <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="close" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Pet Selector */}
          {pets.length > 0 ? (
             <View style={styles.petSelectorContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.petList}
                >
                  {pets.map(pet => (
                    <PetCard 
                      key={pet.id} 
                      pet={pet} 
                      isSelected={selectedPet?.id === pet.id} 
                    />
                  ))}
                  <TouchableOpacity style={styles.addPetCard} onPress={() => { onClose(); router.push('/(tabs)/pets/add-pet-wizard'); }}>
                    <View style={styles.addPetIcon}>
                        <IconSymbol ios_icon_name="plus" android_material_icon_name="add" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.addPetText}>New Pet</Text>
                  </TouchableOpacity>
                </ScrollView>
             </View>
          ) : (
             <View style={styles.emptyState}>
                 <Text style={styles.emptyText}>No pets found. Add a pet first!</Text>
                 <TouchableOpacity style={styles.addFirstPetButton} onPress={() => { onClose(); router.push('/(tabs)/pets/add-pet-wizard'); }}>
                     <Text style={styles.addFirstPetText}>Add Pet</Text>
                 </TouchableOpacity>
             </View>
          )}

          {/* Current Pet Display (Large) */}
          {selectedPet && (
             <View style={styles.currentPetDisplay}>
                <View style={styles.largeAvatar}>
                    {selectedPet.photo_url ? (
                        <Image source={{ uri: selectedPet.photo_url }} style={styles.largeAvatarImage} />
                    ) : (
                        <Text style={styles.largeEmoji}>
                             {selectedPet.species === 'dog' ? '🐕' : selectedPet.species === 'cat' ? '🐈' : '🐾'}
                        </Text>
                    )}
                </View>
                <Text style={styles.largePetName}>{selectedPet.name}</Text>
             </View>
          )}

          {/* Actions Grid */}
          <View style={styles.actionsGrid}>
            {actions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.actionItem} 
                onPress={() => handleActionPress(action)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                   <MaterialCommunityIcons name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  backdropTouch: {
    flex: 1,
  },
  modalContent: {
    width: CARD_WIDTH,
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  petSelectorContainer: {
    marginBottom: 20,
  },
  petList: {
    gap: 12,
    paddingHorizontal: 4,
  },
  petCard: {
    alignItems: 'center',
    width: 64,
    opacity: 0.6,
  },
  petCardSelected: {
    opacity: 1,
  },
  petImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  petImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  petEmoji: {
    fontSize: 24,
  },
  checkmark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  petName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  petNameSelected: {
    fontWeight: '700',
    color: colors.primary,
  },
  addPetCard: {
    alignItems: 'center',
    width: 64,
    opacity: 0.8,
  },
  addPetIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addPetText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  currentPetDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  largeEmoji: {
    fontSize: 48,
  },
  largePetName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionItem: {
    width: '30%', // 3 columns
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  emptyText: {
    marginBottom: 12,
    color: colors.textSecondary,
  },
  addFirstPetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addFirstPetText: {
    color: '#fff',
    fontWeight: '600',
  },
});
