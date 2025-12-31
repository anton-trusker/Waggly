import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { BlurView } from 'expo-blur';

interface PrivacySettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PrivacySettingsModal({ visible, onClose }: PrivacySettingsModalProps) {
    const { theme } = useAppTheme();
    // const { t } = useLocale(); // Use localization if available for internal content

    const [isPublic, setIsPublic] = useState(false);
    const [allowVetAccess, setAllowVetAccess] = useState(true);
    const [showAge, setShowAge] = useState(true);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Privacy Settings</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <IconSymbol android_material_icon_name="close" size={24} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>

                        <View style={[styles.settingItem, { borderColor: theme.colors.border.primary }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Public Profile</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.text.secondary }]}>Allow others to find this pet by search</Text>
                            </View>
                            <Switch
                                value={isPublic}
                                onValueChange={setIsPublic}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                            />
                        </View>

                        <View style={[styles.settingItem, { borderColor: theme.colors.border.primary }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Vet Access</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.text.secondary }]}>Allow verified veterinarians to view medical records</Text>
                            </View>
                            <Switch
                                value={allowVetAccess}
                                onValueChange={setAllowVetAccess}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                            />
                        </View>

                        <View style={[styles.settingItem, { borderColor: theme.colors.border.primary }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Show Age</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.text.secondary }]}>Display pet's age on public profile</Text>
                            </View>
                            <Switch
                                value={showAge}
                                onValueChange={setShowAge}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                            />
                        </View>

                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 24,
    },
    container: {
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        gap: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 13,
        paddingRight: 16,
    },
});
