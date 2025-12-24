import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import PetQuickViewModal from '@/components/features/pets/PetQuickViewModal';
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel';
import { PetImage } from '@/components/ui/PetImage';
import { Pet } from '@/types';
import { homeStyles as styles } from '@/components/styles/homeStyles';
import { useEvents } from '@/hooks/useEvents';
import UpcomingEventsPanel from '@/components/features/events/UpcomingEventsPanel';
import AppHeader from '@/components/layout/AppHeader';
import { supabase } from '@/lib/supabase';
import PWAInstallPrompt from '@/components/features/pwa/PWAInstallPrompt';

export default function HomeScreen() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { pets } = usePets();
  const { events } = useEvents();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const nextEvent = events.length > 0 ? events[0] : null;
  const nextVaccination = events.find(e => e.type === 'vaccination');

  // Debug logging for images - disabled for production
  // useEffect(() => {
  //   console.log('=== HOME SCREEN IMAGE DEBUG ===');
  //   console.log('User profile avatar_url:', profile?.avatar_url);
  //   console.log('Pets data:', pets.map(pet => ({
  //     id: pet.id,
  //     name: pet.name,
  //     avatar_url: pet.avatar_url,
  //     species: pet.species
  //   })));
  //   console.log('================================');
  // }, [profile, pets]);

  const getUserFirstName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };
  
  const resolveImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (/^https?:\/\//.test(url)) return url;
    if (url.startsWith('user-photos/')) {
      const { data } = supabase.storage.from('user-photos').getPublicUrl(url);
      return data.publicUrl;
    }
    if (url.startsWith('pet-photos/')) {
      const { data } = supabase.storage.from('pet-photos').getPublicUrl(url);
      return data.publicUrl;
    }
    return url;
  };

  const getPetImageUri = (pet: any): string | undefined => {
    return resolveImageUrl(pet?.photo_url || pet?.avatar_url || undefined);
  };

  const getProfileImageUri = (): string | undefined => {
    return resolveImageUrl(profile?.photo_url || profile?.avatar_url || undefined);
  };

  if (pets.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
          style={styles.emptyGradient}
        >
          <View style={styles.emptyHeader}>
            <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <PetImage
                source={getProfileImageUri() ? { uri: getProfileImageUri()! } : undefined}
                size={48}
                borderRadius={24}
                fallbackEmoji={getUserFirstName().charAt(0).toUpperCase()}
                style={styles.avatarImage}
              />
            </View>
            <View>
              <Text style={styles.userName}>Hello, {getUserFirstName()}</Text>
            </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={24}
                color={colors.text}
              />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          <View style={styles.emptyContent}>
            <Image
              source={require('@/assets/images/image 8276.png')}
              style={styles.emptyIllustration}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Create your pet's{'\n'}digital passport</Text>
            <Text style={styles.emptySubtitle}>
              Add your pet to unlock health tracking, reminders, and a complete record of their wellbeing
            </Text>
            <TouchableOpacity
              style={styles.addPetButton}
              onPress={() => router.push('/(tabs)/pets/add-pet-wizard')}
            >
              <Text style={styles.addPetButtonText}>Add Pet</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader showGreeting />
      <PWAInstallPrompt />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.petsSection}>
          <Text style={styles.sectionTitle}>Your Pets</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petsScroll}
          >
            {pets.map((pet, index) => (
              <TouchableOpacity
                key={index}
                style={styles.petAvatar}
                onPress={() => setSelectedPet(pet)}
              >
                <View style={[styles.petAvatarCircle, index === 0 && styles.petAvatarActive]}>
                  <PetImage
                    source={getPetImageUri(pet) ? { uri: getPetImageUri(pet)! } : undefined}
                    size={60}
                    borderRadius={30}
                    fallbackEmoji={pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
                    style={styles.petAvatarImage}
                  />
                  {pet.user_id !== user?.id && (
                    <View style={styles.sharedBadge}>
                      <IconSymbol
                        ios_icon_name="person.2.fill"
                        android_material_icon_name="group"
                        size={12}
                        color="#fff"
                      />
                    </View>
                  )}
                </View>
                <Text style={[styles.petAvatarName, index === 0 && styles.petAvatarNameActive]}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.petAvatar}
              onPress={() => router.push('/(tabs)/pets/add-pet')}
            >
              <View style={styles.addPetCircle}>
                <Text style={styles.addPetIcon}>+</Text>
              </View>
              <Text style={styles.petAvatarName}>Add new</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Quick Actions Panel */}
        <QuickActionsPanel />

        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.smallCard}
            onPress={() => router.push('/(tabs)/pets')}
          >
            <Text style={styles.smallCardTitle}>Health Card</Text>
            <Text style={styles.smallCardSubtitle}>
              {nextVaccination 
                ? `Next vac: ${new Date(nextVaccination.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}` 
                : 'No vaccines due'}
            </Text>
            <View style={styles.smallCardIcon}>
              <IconSymbol
                ios_icon_name="heart.fill"
                android_material_icon_name="favorite"
                size={32}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallCard}>
            <Text style={styles.smallCardTitle}>ID Passport</Text>
            <Text style={styles.smallCardSubtitle}>Documents</Text>
            <View style={styles.smallCardIcon}>
              <IconSymbol
                ios_icon_name="doc.fill"
                android_material_icon_name="description"
                size={32}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
        </View>

        <UpcomingEventsPanel />

      </ScrollView>
      {selectedPet && (
        <PetQuickViewModal
          pet={selectedPet}
          visible={!!selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </View>
  );
}
