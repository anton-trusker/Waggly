
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { useAppTheme } from '@/hooks/useAppTheme';
import { usePets } from '@/hooks/usePets';
import { Pet, Veterinarian, Condition } from '@/types';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEvents } from '@/hooks/useEvents';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { handleApiError } from '@/utils/errorHandler';
import { supabase } from '@/lib/supabase';

// Feature Components
import PetProfileHeader from '@/components/features/pets/profile/PetProfileHeader';
import OverviewTab from '@/components/features/pets/profile/OverviewTab';
import HealthTab from '@/components/features/pets/profile/HealthTab';
import PetGallery from '@/components/features/pets/PetGalleryComponent';
import PetDocuments from '@/components/features/pets/PetDocuments';

type TabType = 'Overview' | 'Health' | 'Gallery' | 'Docs';

// Reuse UpcomingEvents from previous file (simplified)
interface UpcomingEventsProps {
  petId: string;
  todayISO: string;
}

const UpcomingEvents = React.memo(({ petId, todayISO }: UpcomingEventsProps) => {
  const { theme } = useAppTheme();
  const { events, loading } = useEvents({
    petIds: [petId],
    startDate: todayISO,
  });

  if (loading) return <ActivityIndicator size="small" color={colors.primary} />;
  if (events.length === 0) return null; // Hide if no events

  return (
    <View style={[styles.sectionCard, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
      <View style={styles.sectionHeader}>
        <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={18} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Upcoming Events</Text>
      </View>
      <View>
        {events.slice(0, 3).map((e, index) => (
          <TouchableOpacity
            key={e.id}
            style={[styles.eventItem, { borderBottomColor: theme.colors.border.primary }, index === events.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => router.push(`/(tabs)/pets/record-detail?type=${e.type === 'vet' ? 'visit' : e.type}&id=${e.relatedId}`)}
          >
            <View style={[styles.eventDateBox, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.primary }]}>
              <Text style={[styles.eventDay, { color: colors.primary }]}>{new Date(e.dueDate).getDate()}</Text>
              <Text style={[styles.eventMonth, { color: theme.colors.text.secondary }]}>{new Date(e.dueDate).toLocaleString('default', { month: 'short' })}</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={[styles.eventTitle, { color: theme.colors.text.primary }]}>{e.title}</Text>
              <Text style={{ color: theme.colors.text.secondary, fontSize: 11 }}>{e.type.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

type PetDetailScreenParams = {
  id: string;
}

const PetDetailScreenContent = () => {
  const { id } = useLocalSearchParams<PetDetailScreenParams>();
  const { pets, loading: petsLoading, refreshPets } = usePets();
  const { theme, isDark } = useAppTheme();

  const [pet, setPet] = useState<Pet | null>(null);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const todayISO = new Date().toISOString().slice(0, 10);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setIsRefreshing(true);
      await refreshPets();

      // Fetch Vets
      const { data: vetsData, error: vetsError } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('pet_id', id);
      if (vetsData) setVets(vetsData);

      // Fetch Conditions
      // Note: If table doesn't exist yet (migration fail), this might error.
      // We wrap in try/catch to be safe, though migration "should" be applied.
      try {
        const { data: condData, error: condError } = await supabase
          .from('conditions')
          .select('*')
          .eq('pet_id', id);
        if (condData) setConditions(condData as Condition[]);
      } catch (e) {
        console.log("Conditions table might not exist yet", e);
      }

    } catch (error) {
      console.error("Error loading pet details", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [id, refreshPets]);

  useEffect(() => {
    const foundPet = pets.find((p) => p.id === id);
    if (foundPet) {
      setPet(foundPet);
    }
  }, [pets, id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (petsLoading || !pet) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <View style={{ gap: 24 }}>
            <OverviewTab
              pet={pet}
              vets={vets}
              onAddVet={() => Alert.alert("Coming Soon", "Add Vet feature implementation coming next.")}
              onViewPassport={() => Alert.alert("Coming Soon", "Pet Health Passport feature coming soon.")}
            />
            <View style={{ paddingHorizontal: 20 }}>
              <UpcomingEvents petId={pet.id} todayISO={todayISO} />
            </View>
          </View>
        );
      case 'Health':
        return <HealthTab
          pet={pet}
          conditions={conditions}
          onAddRecord={(type) => {
            const route = type === 'visit' ? 'add-visit' : type === 'vaccination' ? 'add-vaccination' : 'add-treatment';
            router.push(`/(tabs)/pets/${route}?petId=${pet.id}`)
          }}
        />;
      case 'Gallery':
        return <PetGallery petId={pet.id} gallery={pet.photo_gallery || []} />;
      case 'Docs':
        return <PetDocuments petId={pet.id} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary, paddingBottom: 0 }]} edges={['top']}>
      {/* Use edges to control SafeArea, bottom handled by scroll padding */}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadData}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <PetProfileHeader pet={pet} onEdit={() => router.push(`/(tabs)/pets/pet-edit?id=${pet.id}`)} />

        {/* Tabs */}
        <View style={[styles.tabsWrapper, { backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.primary }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {(['Overview', 'Health', 'Gallery', 'Docs'] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  { backgroundColor: activeTab === tab ? colors.primary : theme.colors.background.secondary, borderColor: activeTab === tab ? colors.primary : theme.colors.border.primary }
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, { color: activeTab === tab ? '#fff' : theme.colors.text.primary }]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tabContentContainer}>
          {renderTabContent()}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default function PetDetailScreen() {
  return (
    <ErrorBoundary>
      <PetDetailScreenContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsWrapper: {
    borderBottomWidth: 0,
    paddingVertical: 12,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContentContainer: {
    paddingTop: 0,
  },
  // Upcoming Events Styles
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  eventDateBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  eventDay: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventMonth: {
    fontSize: 9,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
});
