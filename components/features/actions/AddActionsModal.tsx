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
  { id: 'visit', title: 'Add Visit', icon: 'hospital-box', route: '/(tabs)/pets/add-visit', color: '#EF4444' },
  { id: 'vaccine', title: 'Vaccine', icon: 'needle', route: '/(tabs)/pets/add-vaccination', color: '#EC4899' },
  { id: 'treatment', title: 'Add Meds', icon: 'pill', route: '/(tabs)/pets/add-treatment', color: '#8B5CF6' },
  { id: 'record', title: 'Health Record', icon: 'clipboard-pulse', route: '/(tabs)/pets/add-health-record', color: '#10B981' },
  { id: 'document', title: 'Documents', icon: 'file-document-outline', route: '/(tabs)/pets/add-documents', color: '#4F46E5' },
];

const { width, height } = Dimensions.get('window');

export default function AddActionsModal({ visible, onClose }: Props) {
  const { pets } = usePets();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (!selectedPet && pets.length > 0) {
        setSelectedPet(pets[0]);
      }
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 90,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible, pets]);

  const handleActionPress = (action: ActionItem) => {
    onClose();
    setTimeout(() => {
      if (!selectedPet) {
        router.push('/(tabs)/pets/add-pet');
        return;
      }
      router.push({ pathname: action.route as any, params: { petId: selectedPet.id } });
    }, 100);
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
          {Platform.OS === 'ios' && <BlurView intensity={10} style={StyleSheet.absoluteFill} />}
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Quick Actions</Text>
            {selectedPet && (
              <Text style={styles.subtitle}>for {selectedPet.name}</Text>
            )}
          </View>

          {/* Pet Selector - Only show if more than 1 pet */}
          {pets.length > 1 && (
            <View style={styles.petSelectorContainer}>
              <Text style={styles.sectionLabel}>Select Pet</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.petList}
              >
                {pets.map(pet => (
                  <TouchableOpacity
                    key={pet.id}
                    style={[
                      styles.petButton,
                      selectedPet?.id === pet.id && styles.petButtonSelected
                    ]}
                    onPress={() => setSelectedPet(pet)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.petButtonText,
                      selectedPet?.id === pet.id && styles.petButtonTextSelected
                    ]}>
                      {pet.name}
                    </Text>
                    {selectedPet?.id === pet.id && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Actions Grid - Mobile optimized */}
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>Actions</Text>
            <View style={styles.actionsGrid}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionItem}
                  onPress={() => handleActionPress(action)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <MaterialCommunityIcons name={action.icon} size={28} color="#fff" />
                  </View>
                  <Text style={styles.actionLabel} numberOfLines={2}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdropTouch: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    maxHeight: height * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  petSelectorContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  petList: {
    gap: 8,
  },
  petButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
    justifyContent: 'center',
    position: 'relative',
  },
  petButtonSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  petButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  petButtonTextSelected: {
    color: '#6366F1',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: '#6366F1',
    borderRadius: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '31%',
    alignItems: 'center',
    minHeight: 56,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
});
