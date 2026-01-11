import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { usePetSharing, PetShareToken } from '@/hooks/usePetSharing';
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
  const { tokens, loading, fetchTokens, revokeToken, getShareUrl } = usePetSharing(petId);
  const [selectedShare, setSelectedShare] = useState<PetShareToken | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    fetchTokens();
  }, [petId, refreshTrigger]);

  const handleCopy = async (token: string) => {
    await Clipboard.setStringAsync(getShareUrl(token));
    Alert.alert('Success', 'Link copied to clipboard!');
  };

  const handleViewDetails = (share: PetShareToken) => {
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
            await revokeToken(id);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: PetShareToken }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <IconSymbol android_material_icon_name="link" size={24} color={designSystem.colors.primary[500]} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.presetName}>
          {item.permission_level === 'advanced' ? 'Full Profile' : 'Basic Info'}
        </Text>
        <Text style={styles.date}>
          Created {formatDateFriendly(new Date(item.created_at))} {item.accessed_count > 0 ? `• ${item.accessed_count} views` : ''}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed] as any}
          onPress={() => handleViewDetails(item)}
        >
          <IconSymbol android_material_icon_name="visibility" size={20} color={designSystem.colors.primary[500]} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed] as any}
          onPress={() => handleCopy(item.token)}
        >
          <IconSymbol android_material_icon_name="content-copy" size={20} color={designSystem.colors.text.secondary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed] as any}
          onPress={() => handleRevoke(item.id)}
        >
          <IconSymbol android_material_icon_name="delete-outline" size={20} color={designSystem.colors.status.error[500]} />
        </Pressable>
      </View>
    </View>
  );

  if (loading && tokens.length === 0) {
    return <ActivityIndicator style={{ padding: 20 }} />;
  }

  if (tokens.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active shared links.</Text>
      </View>
    );
  }

  return (
    <>
      <FlashList
        data={tokens}
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
