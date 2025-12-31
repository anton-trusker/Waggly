import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { usePets } from '@/hooks/usePets';

interface SettingsTabProps {
    petId: string;
    onEdit: () => void;
}

export default function SettingsTabDesktop({ petId, onEdit }: SettingsTabProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { deletePet } = usePets();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleDelete = () => {
        Alert.alert(
            "Delete Pet",
            "Are you sure you want to delete this pet? This action cannot be undone and all data will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const { error } = await deletePet(petId);
                        if (error) {
                            Alert.alert("Error", "Failed to delete pet");
                        } else {
                            router.replace('/(tabs)/pets' as any);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General Settings</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Edit Profile</Text>
                        <Text style={styles.settingDescription}>Update name, breed, birthday and other details</Text>
                    </View>
                    <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                        <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Notifications</Text>
                        <Text style={styles.settingDescription}>Receive alerts for upcoming vaccinations and appointments</Text>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                    />
                </View>
            </View>

            <View style={[styles.section, styles.dangerZone]}>
                <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Delete Pet</Text>
                        <Text style={styles.settingDescription}>Permanently remove this pet and all associated data</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.deleteButtonText}>Delete Pet</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 32,
        maxWidth: 800,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    dangerZone: {
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    dangerTitle: {
        color: '#991B1B',
    },
    deleteButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
    },
});
