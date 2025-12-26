import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
import FormModal from '@/components/ui/FormModal';
import Button from '@/components/ui/Button';
import Radio from '@/components/ui/Radio';
import { designSystem } from '@/constants/designSystem';
import { usePublicShare, SharePreset, PublicShare } from '@/hooks/usePublicShare';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  petId: string;
  onLinkGenerated?: () => void;
}

export default function ShareModal({ visible, onClose, petId, onLinkGenerated }: ShareModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<SharePreset>('BASIC');
  const [generatedShare, setGeneratedShare] = useState<PublicShare | null>(null);
  const { generateLink, loading } = usePublicShare();
  const qrRef = useRef<ViewShot>(null);

  const handleGenerate = async () => {
    try {
      const share = await generateLink(petId, selectedPreset);
      setGeneratedShare(share);
      if (onLinkGenerated) onLinkGenerated();
    } catch (error) {
      console.error('Failed to generate link:', error);
      Alert.alert('Error', 'Failed to generate share link. Please try again.');
    }
  };

  const handleCopyLink = async () => {
    if (!generatedShare) return;
    const url = `https://mypawzly.app/share/${generatedShare.token}`;
    await Clipboard.setStringAsync(url);
    Alert.alert('Success', 'Link copied to clipboard!');
  };

  const handleDownloadQR = async () => {
    if (!qrRef.current) return;

    try {
      const uri = await qrRef.current.capture?.();
      if (!uri) return;

      const fileName = `PetProfile-QR-${generatedShare?.token?.slice(0, 8)}.png`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: 'Save QR Code',
        });
      } else {
        Alert.alert('Success', 'QR code saved!');
      }
    } catch (error) {
      console.error('Failed to download QR:', error);
      Alert.alert('Error', 'Failed to download QR code. Please try again.');
    }
  };

  const handleClose = () => {
    setGeneratedShare(null);
    setSelectedPreset('BASIC');
    onClose();
  };

  const renderPresetOption = (preset: SharePreset, title: string, description: string) => (
    <Pressable
      style={[
        styles.presetCard,
        selectedPreset === preset && styles.presetCardSelected
      ]}
      onPress={() => setSelectedPreset(preset)}
    >
      <View style={styles.radioContainer}>
        <Radio selected={selectedPreset === preset} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.presetTitle}>{title}</Text>
        <Text style={styles.presetDescription}>{description}</Text>
      </View>
    </Pressable>
  );

  return (
    <FormModal
      visible={visible}
      onClose={handleClose}
      title={generatedShare ? "Share Profile" : "Create Share Link"}
      submitLabel={generatedShare ? "Done" : "Generate Link"}
      onSubmit={async () => generatedShare ? handleClose() : handleGenerate()}
    >
      {() => generatedShare ? (
        <View style={styles.resultContainer}>
          <ViewShot ref={qrRef} options={{ format: 'png', quality: 1.0 }}>
            <View style={styles.qrContainer}>
              <QRCode
                value={`https://mypawzly.app/share/${generatedShare.token}`}
                size={200}
              />
            </View>
          </ViewShot>
          <Text style={styles.helperText}>
            Scan this code or use the buttons below to share the pet profile.
          </Text>
          <View style={styles.buttonsRow}>
            <Button
              variant="outline"
              onPress={handleCopyLink}
              style={styles.actionButton}
            >
              <IconSymbol android_material_icon_name="content-copy" size={20} color={designSystem.colors.primary[500]} />
              <Text style={styles.actionButtonText}> Copy Link</Text>
            </Button>
            <Button
              variant="outline"
              onPress={handleDownloadQR}
              style={styles.actionButton}
            >
              <IconSymbol android_material_icon_name="download" size={20} color={designSystem.colors.primary[500]} />
              <Text style={styles.actionButtonText}> Download QR</Text>
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.selectionContainer}>
          {renderPresetOption(
            'BASIC',
            'Basic Info',
            'Share name, breed, age, weight, and chip ID only.'
          )}
          {renderPresetOption(
            'FULL',
            'Full Profile',
            'Includes health records, vaccinations, medications, and documents.'
          )}
        </View>
      )}
    </FormModal>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    gap: 16,
    paddingVertical: 8,
  },
  presetCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    alignItems: 'center',
  },
  presetCardSelected: {
    borderColor: designSystem.colors.primary[500],
    backgroundColor: designSystem.colors.primary[50],
  },
  radioContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: designSystem.colors.text.primary,
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
    color: designSystem.colors.text.secondary,
    lineHeight: 20,
  },
  resultContainer: {
    alignItems: 'center',
    gap: 24,
    paddingVertical: 16,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  helperText: {
    fontSize: 14,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
  actionButtonText: {
    color: designSystem.colors.primary[500],
    fontWeight: '600',
    marginLeft: 8,
  },
});
