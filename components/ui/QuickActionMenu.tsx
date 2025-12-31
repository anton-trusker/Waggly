import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { IconSymbol } from './IconSymbol';
import { usePets } from '@/hooks/usePets';
import { useLocale } from '@/hooks/useLocale';
import { Pet } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

export interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  route: Href<string>;
  description?: string;
}

export interface QuickActionMenuProps {
  visible: boolean;
  onClose: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: 'visit',
    title: 'Visit',
    icon: 'local-hospital',
    color: designSystem.colors.primary[500],
    route: '/(tabs)/pets/add-visit',
    description: 'Record a vet visit',
  },
  {
    id: 'photos',
    title: 'Photos',
    icon: 'photo-camera',
    color: designSystem.colors.secondary.sun,
    route: '/(tabs)/pets/add-photos',
    description: 'Add pet photos',
  },
  {
    id: 'vaccine',
    title: 'Vaccine',
    icon: 'medical-services',
    color: designSystem.colors.secondary.leaf,
    route: '/(tabs)/pets/add-vaccination',
    description: 'Record vaccination',
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: 'description',
    color: designSystem.colors.secondary.paw,
    route: '/(tabs)/pets/add-documents',
    description: 'Upload documents',
  },
  {
    id: 'medication',
    title: 'Medication',
    icon: 'medication',
    color: designSystem.colors.error[500],
    route: '/(tabs)/pets/add-treatment',
    description: 'Add medication',
  },
];

export function QuickActionMenu({ visible, onClose }: QuickActionMenuProps) {
  const { pets } = usePets();
  const { t } = useLocale();
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pendingAction, setPendingAction] = useState<QuickAction | null>(null);
  const [showPetSelection, setShowPetSelection] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const insets = useSafeAreaInsets();

  const closeMenu = React.useCallback(() => {
    setShowPetSelection(false);
    setPendingAction(null);
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: designSystem.animations.duration.normal,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: designSystem.animations.duration.normal,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (shouldRender) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: designSystem.animations.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: designSystem.animations.duration.fast,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
        setShowPetSelection(false);
        setPendingAction(null);
      });
    }
  }, [visible, shouldRender, slideAnim, fadeAnim]);

  const handleActionPress = (action: QuickAction) => {
    if (pets.length === 0) {
      // No pets added yet, redirect to add pet
      router.push('/(tabs)/pets/add-pet-wizard');
      closeMenu();
      return;
    }

    if (pets.length === 1) {
      // Single pet, proceed directly
      router.push({
        pathname: action.route as any,
        params: { petId: pets[0].id },
      });
      closeMenu();
    } else {
      // Multiple pets, show pet selection
      setPendingAction(action);
      setShowPetSelection(true);
    }
  };

  const handlePetSelection = (pet: Pet) => {
    if (pendingAction) {
      router.push({
        pathname: pendingAction.route as any, // Cast to any to avoid complex Href union issues temporarily
        params: { petId: pet.id },
      });
    }
    setPendingAction(null);
    setShowPetSelection(false);
    closeMenu();
  };

  const renderContent = () => {
    if (showPetSelection) {
      return (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('quick_actions_menu.select_pet')}</Text>
            <TouchableOpacity onPress={() => setShowPetSelection(false)}>
              <IconSymbol
                android_material_icon_name="arrow-back"
                ios_icon_name="chevron.left"
                size={24}
                color={designSystem.colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.petSelectionList}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petItem}
                onPress={() => handlePetSelection(pet)}
              >
                <View style={styles.petIcon}>
                  {pet.photo_url ? (
                    <Image source={{ uri: pet.photo_url }} style={styles.petImage} />
                  ) : (
                    <Text style={styles.petEmoji}>
                      {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
                    </Text>
                  )}
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petBreed}>{pet.breed || pet.species}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('quick_actions_menu.title')}</Text>
          <TouchableOpacity onPress={onClose}>
            <IconSymbol
              android_material_icon_name="close"
              ios_icon_name="xmark"
              size={24}
              color={designSystem.colors.text.primary}
            />
          </TouchableOpacity>
        </View>



        <Text style={styles.subtitle}>{t('quick_actions_menu.subtitle')}</Text>

        <ScrollView style={styles.actionsList} showsVerticalScrollIndicator={false}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionItem,
                index === 0 && styles.actionItemFirst,
                index === quickActions.length - 1 && styles.actionItemLast,
              ]}
              onPress={() => handleActionPress(action)}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                <IconSymbol
                  android_material_icon_name={action.icon}
                  ios_icon_name={action.icon}
                  size={24}
                  color={action.color}
                />
              </View>

              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{t(`quick_actions_menu.actions.${action.id}.title`)}</Text>
                <Text style={styles.actionDescription}>{t(`quick_actions_menu.actions.${action.id}.desc`)}</Text>
              </View>

              <IconSymbol
                android_material_icon_name="chevron-right"
                ios_icon_name="chevron.right"
                size={20}
                color={designSystem.colors.neutral[400]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View >
    );
  };

  return (
    <Modal
      visible={visible || shouldRender}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={closeMenu}
    >
      <View style={styles.portalWrapper}>
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: fadeAnim },
          ]}
        >
          <Pressable style={styles.backdropPressable} onPress={closeMenu} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              paddingBottom: Math.max(insets.bottom, getSpacing(6)),
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [screenHeight, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
}

export function QuickActionButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.quickActionButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.quickActionIcon}>
        <IconSymbol
          android_material_icon_name="add"
          ios_icon_name="plus"
          size={28}
          color="#FFFFFF"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  portalWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    elevation: 2000,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: designSystem.colors.neutral[0],
    borderTopLeftRadius: designSystem.borderRadius['2xl'],
    borderTopRightRadius: designSystem.borderRadius['2xl'],
    paddingTop: getSpacing(6),
    maxHeight: screenHeight * 0.8,
    width: '100%',
    ...designSystem.shadows.xl,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getSpacing(5),
    paddingBottom: getSpacing(4),
  },
  title: {
    ...designSystem.typography.headline.small,
    color: designSystem.colors.text.primary,
  },
  subtitle: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.secondary,
    fontSize: designSystem.typography.body.small.fontSize,
    textAlign: 'center',
    marginBottom: getSpacing(6),
    paddingHorizontal: getSpacing(6),
  },
  actionsList: {
    flex: 1,
    paddingHorizontal: getSpacing(4),
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designSystem.colors.neutral[0],
    paddingHorizontal: getSpacing(4),
    paddingVertical: getSpacing(3),
    marginHorizontal: getSpacing(2),
    borderRadius: designSystem.borderRadius.full,
    ...designSystem.shadows.sm,
    marginBottom: getSpacing(3),
  },
  actionItemFirst: {
    marginTop: 0,
  },
  actionItemLast: {
    marginBottom: getSpacing(8),
  },
  actionIcon: {
    width: getSpacing(12),
    height: getSpacing(12),
    borderRadius: designSystem.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getSpacing(4),
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: getSpacing(3),
  },
  actionDescription: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.text.secondary,
  },
  petSelectionList: {
    flex: 1,
    paddingHorizontal: designSystem.spacing[4],
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designSystem.colors.neutral[0],
    paddingHorizontal: designSystem.spacing[4],
    paddingVertical: designSystem.spacing[4],
    marginHorizontal: designSystem.spacing[2],
    borderRadius: designSystem.borderRadius.lg,
    ...designSystem.shadows.sm,
    marginBottom: designSystem.spacing[3],
  },
  petIcon: {
    width: designSystem.spacing[12],
    height: designSystem.spacing[12],
    borderRadius: designSystem.borderRadius.full,
    backgroundColor: designSystem.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: designSystem.spacing[4],
  },
  petImage: {
    width: '100%',
    height: '100%',
    borderRadius: designSystem.borderRadius.full,
  },
  petEmoji: {
    fontSize: designSystem.typography.headline.small.fontSize,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    ...designSystem.typography.title.medium,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing[1],
  },
  petBreed: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.text.secondary,
  },
  quickActionButton: {
    position: 'absolute',
    bottom: designSystem.spacing[8],
    right: designSystem.spacing[6],
    width: designSystem.spacing[14],
    height: designSystem.spacing[14],
    borderRadius: designSystem.borderRadius.full,
    backgroundColor: designSystem.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...designSystem.shadows.lg,
    zIndex: 1000,
  },
  quickActionIcon: {
    width: designSystem.spacing[14],
    height: designSystem.spacing[14],
    borderRadius: designSystem.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
