import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/commonStyles';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { PetImage } from '@/components/ui/PetImage';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatAge } from '@/utils/dateUtils';
import { LinearGradient } from 'expo-linear-gradient';

export default function PublicShareScreen() {
  const { token } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchDetails();
    }
  }, [token]);

  const fetchDetails = async () => {
    try {
      const { data: result, error } = await supabase.rpc('get_public_pet_details', { share_token: token });
      if (error) throw error;
      if (result && result.error) throw new Error(result.error);
      
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Pet not found or link expired'}</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/')}>
            <Text style={styles.homeBtnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { pet, owner } = data;

  const resolveImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (/^https?:\/\//.test(url)) return url;
    if (url.startsWith('pet-photos/')) {
      const { data } = supabase.storage.from('pet-photos').getPublicUrl(url);
      return data.publicUrl;
    }
    return url;
  };

  const imageUrl = resolveImageUrl(pet.photo_url);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
       <View style={styles.card}>
          <LinearGradient
             colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
             style={styles.headerGradient}
          >
             <View style={styles.imageContainer}>
                <PetImage
                    source={imageUrl ? { uri: imageUrl } : undefined}
                    size={120}
                    borderRadius={60}
                    fallbackEmoji={pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
                />
             </View>
          </LinearGradient>
          
          <View style={styles.infoContainer}>
             <Text style={styles.petName}>{pet.name}</Text>
             <Text style={styles.petSubtitle}>{pet.breed || pet.species} • {pet.age ? formatAge(new Date(pet.age)) : 'Age unknown'}</Text>
             
             <View style={styles.divider} />
             
             <View style={styles.row}>
                 <View style={styles.stat}>
                     <Text style={styles.statLabel}>Gender</Text>
                     <Text style={styles.statValue}>{pet.gender || '—'}</Text>
                 </View>
                 <View style={styles.stat}>
                     <Text style={styles.statLabel}>Weight</Text>
                     <Text style={styles.statValue}>{pet.weight ? `${pet.weight} kg` : '—'}</Text>
                 </View>
             </View>

             <View style={styles.ownerSection}>
                 <Text style={styles.ownerLabel}>Shared by Owner</Text>
                 <Text style={styles.ownerName}>{owner.name}</Text>
             </View>

             <TouchableOpacity 
                style={styles.installBtn}
                onPress={() => Linking.openURL('https://mypawzly.app')} // Replace with store link later
             >
                <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={20} color="#fff" />
                <Text style={styles.installBtnText}>Get Pawzly App</Text>
             </TouchableOpacity>
          </View>
       </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  errorText: { color: colors.error, fontSize: 16, marginBottom: 20 },
  homeBtn: { padding: 10, backgroundColor: colors.primary, borderRadius: 8 },
  homeBtnText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerGradient: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 60, // Space for overlapping avatar
  },
  imageContainer: {
    position: 'absolute',
    bottom: -60,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 64,
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  petName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  petSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  ownerSection: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  ownerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  installBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  installBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
