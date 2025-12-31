import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';
import { BlurView } from 'expo-blur';

interface NotificationSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function NotificationSettingsModal({ visible, onClose }: NotificationSettingsModalProps) {
    const { theme } = useAppTheme();

    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [vaccineReminders, setVaccineReminders] = useState(true);
    const [weightReminders, setWeightReminders] = useState(false);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Notifications</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <IconSymbol android_material_icon_name="close" size={24} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>

                        <Text style={[styles.sectionHeader, { color: theme.colors.text.secondary }]}>General</Text>

                        <View style={[styles.settingItem, { borderColor: theme.colors.border.primary }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Email Notifications</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.text.secondary }]}>Receive summaries and important alerts</Text>
                            </View>
                            <Switch
                                value={emailNotifs}
                                onValueChange={setEmailNotifs}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                            />
                        </View>

                        <View style={[styles.settingItem, { borderColor: theme.colors.border.primary }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Push Notifications</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.text.secondary }]}>Receive instant alerts on this device</Text>
                            </View>
                            <Switch
                                value={pushNotifs}
                                onValueChange={setPushNotifs}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                            />
                        </View>

                        <Text style={[styles.sectionHeader, { color: theme.colors.text.secondary, marginTop: 16 }]}>Reminders</Text>

                        <View style={[styles.settingItem, { borderColor: theme.colors.border.primary }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Vaccinations</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.text.secondary }]}>Alerts when vaccinations are due soon</Text>
                            </View>
                            <Switch
                                value={vaccineReminders}
                                onValueChange={setVaccineReminders}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                            />
                        </View>

                        <View style={[styles.settingItem, { borderColor: theme.colors.border.primary }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Weight Log</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.text.secondary }]}>Monthly reminder to log weight</Text>
                            </View>
                            <Switch
                                value={weightReminders}
                                onValueChange={setWeightReminders}
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
        gap: 12,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
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
