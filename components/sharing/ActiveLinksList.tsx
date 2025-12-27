import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { usePublicShare, PublicShare } from '@/hooks/usePublicShare';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import * as Clipboard from 'expo-clipboard';
import { formatDateFriendly } from '@/utils/dateUtils';
import ShareDetailsModal from './ShareDetailsModal';

interface ActiveLinksListProps {
  petId: string;
  refreshTrigger?: number; // Prop to trigger refresh from parent
}

export default function ActiveLinksList({ petId, refreshTrigger }: ActiveLinksListProps) {
  const { getActiveLinks, revokeLink, loading } = usePublicShare();
  const [links, setLinks] = useState<PublicShare[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedShare, setSelectedShare] = useState<PublicShare | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const fetchLinks = async () => {
    setRefreshing(true);
    const data = await getActiveLinks(petId);
    setLinks(data || []);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLinks();
  }, [petId, refreshTrigger]);

  const handleCopy = async (token: string) => {
    await Clipboard.setStringAsync(`https://mypawzly.app/share/${token}`);
    Alert.alert('Success', 'Link copied to clipboard!');
  };

  const handleViewDetails = (share: PublicShare) => {
    setSelectedShare(share);
    setDetailsModalVisible(true);
  };

  const handleRevoke = async (id: string) => {
    Alert.alert(
      "Revoke Link",
      "Are you sure you want to revoke this link? It will no longer be accessible.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke",
          style: "destructive",
          onPress: async () => {
            await revokeLink(id);
            fetchLinks();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: PublicShare }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <IconSymbol android_material_icon_name="link" size={24} color={designSystem.colors.primary[500]} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.presetName}>
          {item.settings.preset === 'FULL' ? 'Full Profile' : 'Basic Info'}
        </Text>
        <Text style={styles.date}>
          Created {formatDateFriendly(new Date(item.created_at))}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          onPress={() => handleViewDetails(item)}
        >
          <IconSymbol android_material_icon_name="visibility" size={20} color={designSystem.colors.primary[500]} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          onPress={() => handleCopy(item.token)}
        >
          <IconSymbol android_material_icon_name="content-copy" size={20} color={designSystem.colors.text.secondary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          onPress={() => handleRevoke(item.id)}
        >
          <IconSymbol android_material_icon_name="delete-outline" size={20} color={designSystem.colors.status.error[500]} />
        </Pressable>
      </View>
    </View>
  );

  if (loading && links.length === 0) {
    return <ActivityIndicator style={{ padding: 20 }} />;
  }

  if (links.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active shared links.</Text>
      </View>
    );
  }

  return (
    <>
      <FlashList
        data={links}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Assuming it's nested in a ScrollView
        estimatedItemSize={72}
      />
      <ShareDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        share={selectedShare}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designSystem.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: designSystem.colors.text.primary,
  },
  date: {
    fontSize: 12,
    color: designSystem.colors.text.tertiary,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  pressed: {
    backgroundColor: designSystem.colors.background.tertiary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: designSystem.colors.text.tertiary,
  },
});
