import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';

export default function SettingsTab() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { pets, deletePet } = usePets();
    const pet = pets.find(p => p.id === petId);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeletePet = () => {
        Alert.alert(
            'Delete Pet',
            `Are you sure you want to delete ${pet?.name}? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await deletePet(petId);
                            router.replace('/(tabs)/pets');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete pet. Please try again.');
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const handleTransferOwnership = () => {
        Alert.alert('Coming Soon', 'Transfer ownership feature will be available soon.');
    };

    const handlePrivacySettings = () => {
        Alert.alert('Coming Soon', 'Privacy settings will be available soon.');
    };

    const handleNotifications = () => {
        Alert.alert('Coming Soon', 'Notification preferences will be available soon.');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pet Management</Text>

                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={handleTransferOwnership}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="swap-horizontal" size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Transfer Ownership</Text>
                        <Text style={styles.settingDescription}>
                            Transfer this pet to another user
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingItem, styles.dangerItem]}
                    onPress={handleDeletePet}
                    disabled={isDeleting}
                >
                    <View style={[styles.settingIcon, styles.dangerIcon]}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, styles.dangerText]}>
                            {isDeleting ? 'Deleting...' : 'Delete Pet'}
                        </Text>
                        <Text style={styles.settingDescription}>
                            Permanently remove this pet from your account
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy</Text>

                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={handlePrivacySettings}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="shield-checkmark" size={20} color="#8B5CF6" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Privacy Settings</Text>
                        <Text style={styles.settingDescription}>
                            Control who can view this pet's profile
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>

                <TouchableOpacity
                    style={styles.settingItem}
                    onPress={handleNotifications}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons name="notifications" size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={styles.settingTitle}>Notification Preferences</Text>
                        <Text style={styles.settingDescription}>
                            Manage reminders and alerts for this pet
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                    Pet ID: {petId}
                </Text>
                <Text style={styles.infoText}>
                    Created: {pet?.created_at ? new Date(pet.created_at).toLocaleDateString() : 'Unknown'}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    dangerItem: {
        borderColor: '#FEE2E2',
    },
    dangerIcon: {
        backgroundColor: '#FEE2E2',
    },
    dangerText: {
        color: '#EF4444',
    },
    infoSection: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
});
