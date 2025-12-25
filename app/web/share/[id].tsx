import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { useCoOwners } from '@/hooks/useCoOwners';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const ROLES = [
    { id: 'owner', label: 'Owner', description: 'Full access to all features' },
    { id: 'co-owner', label: 'Co-Owner', description: 'Can view and edit pet information' },
    { id: 'viewer', label: 'Viewer', description: 'Can only view pet information' },
];

export default function SharePetPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { user } = useAuth();
    const { pets } = usePets();
    const [activeTab, setActiveTab] = useState<'coowners' | 'public'>('coowners');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('co-owner');
    const [loading, setLoading] = useState(false);
    const [sharedLink, setSharedLink] = useState<string | null>(null);

    const pet = pets.find(p => p.id === petId);

    const { inviteCoOwner } = useCoOwners();

    const handleInviteCoOwner = async () => {
        if (!inviteEmail) {
            Alert.alert('Error', 'Please enter an email address');
            return;
        }

        setLoading(true);
        try {
            const { error } = await inviteCoOwner(
                inviteEmail,
                selectedRole,
                {
                    scope: 'all', // Simplified for demo, really should be 'selected' with petId if just one pet
                    pet_ids: [petId],
                    access_level: selectedRole === 'viewer' ? 'viewer' : 'editor',
                },
                pet?.name
            );

            if (error) throw error;

            Alert.alert('Success', `Invitation sent to ${inviteEmail}`);
            setShowInviteModal(false);
            setInviteEmail('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send invite');
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePublicLink = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const token = Math.random().toString(36).substring(7); // Changed token generation
            const { data, error } = await (supabase
                .from('shared_links') as any)
                .insert({
                    pet_id: petId,
                    token,
                    profile_id: user.id, // Assuming                    profile_id: user.id,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Changed expiry to 7 days
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;

            const link = `${window.location.origin}/passport/${token}`;
            setSharedLink(link);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (sharedLink) {
            navigator.clipboard.writeText(sharedLink);
            Alert.alert('Copied', 'Link copied to clipboard');
        }
    };

    if (!pet) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>Share {pet.name}</Text>
                        <Text style={styles.subtitle}>Manage co-owners and public access</Text>
                    </View>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'coowners' && styles.tabActive]}
                    onPress={() => setActiveTab('coowners')}
                >
                    <Ionicons name="people-outline" size={20} color={activeTab === 'coowners' ? '#6366F1' : '#6B7280'} />
                    <Text style={[styles.tabText, activeTab === 'coowners' && styles.tabTextActive]}>
                        Co-Owners
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'public' && styles.tabActive]}
                    onPress={() => setActiveTab('public')}
                >
                    <Ionicons name="link-outline" size={20} color={activeTab === 'public' ? '#6366F1' : '#6B7280'} />
                    <Text style={[styles.tabText, activeTab === 'public' && styles.tabTextActive]}>
                        Public Link
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView style={styles.content}>
                {activeTab === 'coowners' && (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Co-Owners</Text>
                                <TouchableOpacity
                                    style={styles.inviteButton}
                                    onPress={() => setShowInviteModal(true)}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color="#6366F1" />
                                    <Text style={styles.inviteButtonText}>Invite Co-Owner</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.emptyState}>
                                <Ionicons name="people-outline" size={48} color="#D1D5DB" />
                                <Text style={styles.emptyStateText}>No co-owners yet</Text>
                                <Text style={styles.emptyStateSubtext}>
                                    Invite others to help manage {pet.name}
                                </Text>
                            </View>
                        </View>

                        {/* Invite Modal */}
                        {showInviteModal && (
                            <View style={styles.modal}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Invite Co-Owner</Text>
                                        <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                                            <Ionicons name="close" size={24} color="#6B7280" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.modalBody}>
                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Email Address</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="friend@example.com"
                                                keyboardType="email-address"
                                                value={inviteEmail}
                                                onChangeText={setInviteEmail}
                                            />
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Role</Text>
                                            {ROLES.map((role) => (
                                                <TouchableOpacity
                                                    key={role.id}
                                                    style={[
                                                        styles.roleOption,
                                                        selectedRole === role.id && styles.roleOptionSelected,
                                                    ]}
                                                    onPress={() => setSelectedRole(role.id)}
                                                >
                                                    <View style={styles.radio}>
                                                        {selectedRole === role.id && <View style={styles.radioSelected} />}
                                                    </View>
                                                    <View style={styles.roleInfo}>
                                                        <Text style={styles.roleLabel}>{role.label}</Text>
                                                        <Text style={styles.roleDescription}>{role.description}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => setShowInviteModal(false)}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                                            onPress={handleInviteCoOwner}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#fff" size="small" />
                                            ) : (
                                                <Text style={styles.sendButtonText}>Send Invite</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'public' && (
                    <View style={styles.tabContent}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Public Passport Link</Text>
                            <Text style={styles.sectionDescription}>
                                Generate a shareable link that anyone can view. Perfect for vets, groomers, or pet sitters.
                            </Text>

                            {!sharedLink ? (
                                <TouchableOpacity
                                    style={[styles.generateButton, loading && styles.generateButtonDisabled]}
                                    onPress={handleGeneratePublicLink}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="link-outline" size={20} color="#fff" />
                                            <Text style={styles.generateButtonText}>Generate Public Link</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.linkCard}>
                                    <View style={styles.linkHeader}>
                                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                                        <Text style={styles.linkTitle}>Link Generated!</Text>
                                    </View>
                                    <View style={styles.linkBox}>
                                        <Text style={styles.linkText} numberOfLines={1}>{sharedLink}</Text>
                                        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                                            <Ionicons name="copy-outline" size={20} color="#6366F1" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.linkExpiry}>Expires in 30 days</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 32,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#6366F1',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#6366F1',
    },
    content: {
        flex: 1,
        padding: 32,
    },
    tabContent: {
        gap: 24,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
        lineHeight: 20,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6366F1',
    },
    inviteButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366F1',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 4,
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    modalBody: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    roleOptionSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#F0F6FF',
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#6366F1',
    },
    roleInfo: {
        flex: 1,
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    roleDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    sendButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#6366F1',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    generateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#6366F1',
    },
    generateButtonDisabled: {
        opacity: 0.5,
    },
    generateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    linkCard: {
        padding: 24,
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#86EFAC',
    },
    linkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#166534',
    },
    linkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    linkText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
    },
    copyButton: {
        padding: 4,
    },
    linkExpiry: {
        fontSize: 12,
        color: '#059669',
        marginTop: 8,
    },
});
