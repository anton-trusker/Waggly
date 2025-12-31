import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Modal, Switch } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CoOwner, CoOwnerPermissions, Pet } from '@/types';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import AppHeader from '@/components/layout/AppHeader';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import DesktopShell from '@/components/desktop/layout/DesktopShell';
import MobileHeader from '@/components/layout/MobileHeader';
import NativeDatePicker from '@/components/ui/NativeDatePicker';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';
import { Ionicons } from '@expo/vector-icons';

type ExtendedCoOwner = CoOwner & { inviterName?: string };

const DEFAULT_PERMISSIONS: CoOwnerPermissions = {
    scope: 'all',
    pet_ids: [],
    access_level: 'editor'
};

export default function CoOwnersScreen() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [emailInput, setEmailInput] = useState('');
    const [actionInProgress, setActionInProgress] = useState(false);
    const [activeTab, setActiveTab] = useState<'invite' | 'request'>('invite');

    // Lists
    const [activeCoOwners, setActiveCoOwners] = useState<CoOwner[]>([]);
    const [sharedWithMe, setSharedWithMe] = useState<ExtendedCoOwner[]>([]);
    const [sentInvites, setSentInvites] = useState<CoOwner[]>([]);
    const [receivedInvites, setReceivedInvites] = useState<ExtendedCoOwner[]>([]);
    const [sentRequests, setSentRequests] = useState<ExtendedCoOwner[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<CoOwner[]>([]);
    const [myPets, setMyPets] = useState<Pet[]>([]);
    const [accessiblePets, setAccessiblePets] = useState<Pick<Pet, 'id' | 'name'>[]>([]);

    // Modal State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedShare, setSelectedShare] = useState<ExtendedCoOwner | null>(null);
    const [permissions, setPermissions] = useState<CoOwnerPermissions>(DEFAULT_PERMISSIONS);
    const [expiryType, setExpiryType] = useState<'forever' | 'days' | 'date'>('forever');
    const [expiryDays, setExpiryDays] = useState<number | null>(null);
    const [expiryDate, setExpiryDate] = useState<Date | null>(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [inviteToken, setInviteToken] = useState<string>('');
    const [shareMode, setShareMode] = useState<'private' | 'public'>('private');
    const [publicLink, setPublicLink] = useState<string>('');

    const fetchCoOwners = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Fetch records where I am the MAIN OWNER
            const { data: asMainOwner, error: mainError } = await supabase
                .from('co_owners')
                .select('*')
                .eq('main_owner_id', user.id);

            if (mainError) throw mainError;

            const myData = asMainOwner || [];
            setActiveCoOwners(myData.filter(r => r.status === 'accepted'));
            setSentInvites(myData.filter(r => r.status === 'pending'));
            setReceivedRequests(myData.filter(r => r.status === 'requested'));

            // 2. Fetch records where I am the CO-OWNER
            const { data: asCoOwner, error: coError } = await supabase
                .from('co_owners')
                .select('*')
                .or(`co_owner_id.eq.${user.id},co_owner_email.eq.${user.email}`);

            if (coError) throw coError;

            let othersData: ExtendedCoOwner[] = asCoOwner || [];
            othersData = othersData.filter(item => item.main_owner_id !== user.id);

            // Enrich with Main Owner names
            const ownerIds = [...new Set(othersData.map(i => i.main_owner_id))];
            if (ownerIds.length > 0) {
                const { data: userDetails } = await supabase
                    .rpc('get_user_details', { user_ids: ownerIds });

                if (userDetails) {
                    othersData = othersData.map(item => {
                        const detail = userDetails.find((u: any) => u.id === item.main_owner_id);
                        let displayName = 'Unknown User';
                        if (detail) {
                            const fullName = `${detail.first_name || ''} ${detail.last_name || ''}`.trim();
                            if (fullName) displayName = fullName;
                            else if (detail.email) displayName = detail.email;
                        }
                        return { ...item, inviterName: displayName };
                    });
                }
            }

            setSharedWithMe(othersData.filter(r => r.status === 'accepted'));
            setReceivedInvites(othersData.filter(r => r.status === 'pending'));
            setSentRequests(othersData.filter(r => r.status === 'requested'));

            // 3. Fetch My Pets for selection
            const { data: pets } = await supabase.from('pets').select('*').eq('user_id', user.id);
            setMyPets(pets || []);

            // 4. Fetch All Accessible Pets (for resolving names in Shared With Me)
            const { data: allPets } = await supabase.from('pets').select('id, name');
            setAccessiblePets(allPets || []);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load co-owners');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCoOwners();
    }, [fetchCoOwners]);

    const handleSendInvite = async () => {
        if (shareMode === 'private' && !emailInput.trim() && !showQRCode) return; // Need email OR QR mode
        if (!user) return;

        setActionInProgress(true);
        try {
            let validUntil = null;
            if (expiryType === 'days' && expiryDays) {
                const d = new Date();
                d.setDate(d.getDate() + expiryDays);
                validUntil = d.toISOString();
            } else if (expiryType === 'date' && expiryDate) {
                validUntil = expiryDate.toISOString();
            }

            if (shareMode === 'public') {
                // Create Public Share Link
                // Only support single pet selection or default to first if 'all' (though UI should restrict)
                let petIdToShare = permissions.pet_ids[0];
                if (!petIdToShare && permissions.scope === 'all' && myPets.length > 0) {
                    petIdToShare = myPets[0].id; // Fallback
                }
                if (!petIdToShare) throw new Error('Please select a specific pet for public sharing');

                const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                const { error } = await supabase.from('public_shares').insert({
                    token,
                    pet_id: petIdToShare,
                    created_by: user.id,
                    valid_until: validUntil,
                    settings: { permissions }
                });

                if (error) throw error;

                // Generate link (In dev: localhost/ip, In prod: mypawzly.app)
                // For now, we assume Expo Router structure
                const link = `https://mypawzly.app/share/${token}`;
                setPublicLink(link);
                setInviteToken(token); // Reusing for QR display logic if needed
                setShowQRCode(true); // Force QR view for public link
            } else {
                // Private Co-Owner Invite
                const email = emailInput.trim().toLowerCase();

                const { data, error } = await supabase
                    .from('co_owners')
                    .insert([{
                        main_owner_id: user.id,
                        co_owner_email: email || `qr-${Date.now()}@placeholder.com`, // Placeholder if QR
                        status: 'pending',
                        created_by: user.id,
                        permissions: permissions,
                        valid_until: validUntil,
                        invite_token: showQRCode ? Math.random().toString(36).substring(2, 15) : null
                    }])
                    .select()
                    .single();

                if (error) throw error;

                if (showQRCode && data) {
                    setInviteToken(data.invite_token || '');
                    // Stay on modal to show QR
                } else {
                    Alert.alert('Success', 'Invite sent');
                    setShowInviteModal(false);
                    setEmailInput('');
                    fetchCoOwners();
                }
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send invite');
        } finally {
            setActionInProgress(false);
        }
    };

    const togglePetSelection = (petId: string) => {
        setPermissions(prev => {
            const currentIds = prev.pet_ids || [];
            const newIds = currentIds.includes(petId)
                ? currentIds.filter(id => id !== petId)
                : [...currentIds, petId];

            return {
                ...prev,
                scope: newIds.length === myPets.length ? 'all' : 'selected',
                pet_ids: newIds
            };
        });
    };

    const renderInviteModal = () => (
        <Modal visible={showInviteModal} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Invite Co-Owner</Text>
                    <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.modalContent}>

                    {/* Share Mode Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sharing Type</Text>
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, shareMode === 'private' && styles.activeTab]}
                                onPress={() => { setShareMode('private'); setShowQRCode(false); }}
                            >
                                <Text style={[styles.tabText, shareMode === 'private' && styles.activeTabText]}>Co-Owner</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, shareMode === 'public' && styles.activeTab]}
                                onPress={() => {
                                    setShareMode('public');
                                    setShowQRCode(true);
                                    // Public sharing implies QR/Link, usually for 1 pet
                                    if (permissions.scope === 'all') {
                                        setPermissions(p => ({ ...p, scope: 'selected' }));
                                    }
                                }}
                            >
                                <Text style={[styles.tabText, shareMode === 'public' && styles.activeTabText]}>Public Link</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.hint}>
                            {shareMode === 'private'
                                ? 'Invite someone to manage pets with you. Requires app account.'
                                : 'Create a view-only link for anyone (e.g. pet sitter, vet). No account needed.'}
                        </Text>
                    </View>

                    {/* Email Input (Private Only) */}
                    {shareMode === 'private' && !showQRCode && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="friend@example.com"
                                value={emailInput}
                                onChangeText={setEmailInput}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    )}

                    {/* Permissions Scope */}
                    <View style={styles.inputGroup}>
                        <BottomSheetSelect
                            label="Access Scope"
                            value={permissions.scope}
                            onChange={(val) => setPermissions(p => ({ ...p, scope: val as any, pet_ids: val === 'all' ? [] : p.pet_ids }))}
                            options={[
                                { label: 'All Pets', value: 'all' },
                                { label: 'Select Specific Pets', value: 'selected' }
                            ]}
                        />
                    </View>

                    {/* Pet Selection */}
                    {permissions.scope === 'selected' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Select Pets {shareMode === 'public' && '(Select 1)'}</Text>
                            {myPets.map(pet => (
                                <TouchableOpacity
                                    key={pet.id}
                                    style={[styles.petItem, permissions.pet_ids.includes(pet.id) && styles.selectedPet]}
                                    onPress={() => {
                                        if (shareMode === 'public') {
                                            // Single select for public
                                            setPermissions(p => ({ ...p, pet_ids: [pet.id] }));
                                        } else {
                                            togglePetSelection(pet.id);
                                        }
                                    }}
                                >
                                    <Text style={styles.petName}>{pet.name}</Text>
                                    {permissions.pet_ids.includes(pet.id) && <Text style={styles.checkMark}>✓</Text>}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Access Level (Private Only) */}
                    {shareMode === 'private' && (
                        <View style={styles.inputGroup}>
                            <BottomSheetSelect
                                label="Role / Permission"
                                value={permissions.access_level || 'editor'}
                                onChange={(val) => setPermissions(p => ({ ...p, access_level: val as any }))}
                                options={[
                                    { label: 'Admin (Full Access)', value: 'admin' },
                                    { label: 'Editor (Can Edit)', value: 'editor' },
                                    { label: 'Viewer (Read Only)', value: 'viewer' }
                                ]}
                            />
                        </View>
                    )}

                    {/* Duration using new Date Picker or Options */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Access Duration</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={[styles.chip, expiryType === 'forever' && styles.activeChip]}
                                onPress={() => setExpiryType('forever')}
                            >
                                <Text style={[styles.chipText, expiryType === 'forever' && styles.activeChipText]}>Forever</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.chip, expiryType === 'days' && styles.activeChip]}
                                onPress={() => { setExpiryType('days'); setExpiryDays(7); }}
                            >
                                <Text style={[styles.chipText, expiryType === 'days' && styles.activeChipText]}>7 Days</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.chip, expiryType === 'date' && styles.activeChip]}
                                onPress={() => { setExpiryType('date'); setExpiryDate(new Date()); }}
                            >
                                <Text style={[styles.chipText, expiryType === 'date' && styles.activeChipText]}>Custom Date</Text>
                            </TouchableOpacity>
                        </View>

                        {expiryType === 'date' && (
                            <View style={{ marginTop: 10 }}>
                                <NativeDatePicker
                                    value={expiryDate}
                                    onChange={setExpiryDate}
                                    label="Select Expiration Date"
                                    minimumDate={new Date()}
                                />
                            </View>
                        )}
                    </View>

                    {/* QR Code Toggle */}
                    <View style={styles.inputGroup}>
                        {shareMode === 'private' && (
                            <View style={styles.switchRow}>
                                <Text style={styles.label}>Generate QR Code instead of Email?</Text>
                                <Switch value={showQRCode} onValueChange={setShowQRCode} />
                            </View>
                        )}
                    </View>

                    {/* Generated QR Code */}
                    {inviteToken ? (
                        <View style={styles.qrContainer}>
                            <QRCode value={shareMode === 'public' ? publicLink : `mypawzly://invite/${inviteToken}`} size={200} />
                            {shareMode === 'public' && (
                                <Text style={styles.linkText}>{publicLink}</Text>
                            )}
                            <Text style={styles.qrText}>
                                {shareMode === 'public' ? 'Scan to view pet profile' : 'Scan to accept invite'}
                            </Text>

                            {shareMode === 'public' && (
                                <TouchableOpacity style={styles.copyBtn} onPress={() => {
                                    // Add clipboard copy if needed, for now just share
                                    Sharing.shareAsync(publicLink);
                                }}>
                                    <Text style={styles.copyBtnText}>Share Link</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : null}

                </ScrollView>

                {/* Sticky CTA at Bottom */}
                <View style={styles.stickyFooter}>
                    {!inviteToken && (
                        <TouchableOpacity
                            style={[styles.primaryButton, (shareMode === 'private' && !emailInput && !showQRCode) && styles.disabledButton]}
                            onPress={handleSendInvite}
                            disabled={(shareMode === 'private' && !emailInput && !showQRCode) || actionInProgress}
                        >
                            {actionInProgress ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>
                                {shareMode === 'public' ? 'Generate Public Link' : (showQRCode ? 'Generate QR' : 'Send Invite')}
                            </Text>}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );

    const renderShareDetailsModal = () => (
        <Modal visible={!!selectedShare} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Access Details</Text>

                    {selectedShare && (
                        <View>
                            <Text style={styles.detailLabel}>Shared by:</Text>
                            <Text style={styles.detailValue}>{selectedShare.inviterName || selectedShare.main_owner_id}</Text>

                            <Text style={styles.detailLabel}>Access Level:</Text>
                            <Text style={styles.detailValue}>
                                {selectedShare.permissions?.access_level === 'admin' ? 'Full Control (Admin)' :
                                    selectedShare.permissions?.access_level === 'editor' ? 'Can Edit (Editor)' : 'View Only'}
                            </Text>

                            <Text style={styles.detailLabel}>Shared Pets:</Text>
                            {selectedShare.permissions?.scope === 'all' ? (
                                <Text style={styles.detailValue}>All Current & Future Pets</Text>
                            ) : (
                                <View style={styles.petList}>
                                    {selectedShare.permissions?.pet_ids?.map(petId => {
                                        const pet = accessiblePets.find(p => p.id === petId);
                                        return (
                                            <Text key={petId} style={styles.petListItem}>
                                                • {pet?.name || 'Unknown Pet'}
                                            </Text>
                                        );
                                    })}
                                    {(!selectedShare.permissions?.pet_ids || selectedShare.permissions.pet_ids.length === 0) && (
                                        <Text style={styles.detailValue}>No specific pets selected</Text>
                                    )}
                                </View>
                            )}

                            <Text style={styles.detailLabel}>Valid Until:</Text>
                            <Text style={styles.detailValue}>
                                {selectedShare.valid_until
                                    ? new Date(selectedShare.valid_until).toLocaleDateString()
                                    : 'Forever'}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.closeDetailsButton}
                        onPress={() => setSelectedShare(null)}
                    >
                        <Text style={styles.closeDetailsText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const handleUpdateStatus = async (id: string, newStatus: 'accepted' | 'declined', isAccepting: boolean = true) => {
        if (!user) return;
        try {
            if (newStatus === 'declined') {
                await handleRemove(id);
                return;
            }
            const updates: any = { status: newStatus };
            if (isAccepting) updates.co_owner_id = user.id;
            const { error } = await supabase.from('co_owners').update(updates).eq('id', id);
            if (error) throw error;
            fetchCoOwners();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const { error } = await supabase.from('co_owners').delete().eq('id', id);
            if (error) throw error;
            fetchCoOwners();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const renderCard = (item: ExtendedCoOwner | CoOwner, type: 'active' | 'pending' | 'request', isIncoming: boolean) => {
        const title = (item as ExtendedCoOwner).inviterName || (item as CoOwner).co_owner_email || 'Unknown';
        const isExpired = item.valid_until && new Date(item.valid_until) < new Date();

        return (
            <View key={item.id} style={[styles.card, isExpired && styles.expiredCard]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{isIncoming ? `From: ${title}` : title}</Text>
                    <Text style={styles.cardSubtitle}>
                        {item.status === 'accepted' ? 'Active' : item.status}
                        {item.valid_until ? ` • Expires: ${new Date(item.valid_until).toLocaleDateString()}` : ''}
                    </Text>
                    {isExpired && <Text style={styles.expiredText}>Expired</Text>}
                    {item.permissions?.scope === 'selected' && (
                        <Text style={styles.permissionText}>Limited Access</Text>
                    )}
                </View>
                <View style={styles.actionButtons}>
                    {isIncoming && item.status !== 'accepted' && (
                        <>
                            <TouchableOpacity onPress={() => handleUpdateStatus(item.id, 'accepted')} style={styles.acceptButton}>
                                <Text style={styles.acceptText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.declineButton}>
                                <Text style={styles.declineText}>Decline</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {(!isIncoming || item.status === 'accepted') && (
                        <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
                            <Text style={styles.removeText}>{item.status === 'accepted' ? 'Remove' : 'Cancel'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <DesktopShell>
            <MobileHeader title="Co-Owners" showBack={true} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Co-Owners</Text>
                    <Text style={styles.subtitle}>Manage who has access to your pets</Text>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.content}>

                        <View style={styles.section}>
                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'invite' && styles.activeTab]}
                                    onPress={() => setActiveTab('invite')}
                                >
                                    <Text style={[styles.tabText, activeTab === 'invite' && styles.activeTabText]}>My Co-Owners</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'request' && styles.activeTab]}
                                    onPress={() => setActiveTab('request')}
                                >
                                    <Text style={[styles.tabText, activeTab === 'request' && styles.activeTabText]}>Requests</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Primary Action Button */}
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => {
                                    setShowInviteModal(true);
                                    setInviteToken('');
                                    setShowQRCode(false);
                                    setPermissions(DEFAULT_PERMISSIONS);
                                    setExpiryType('forever');
                                    setExpiryDate(null);
                                    setExpiryDays(null);
                                }}
                            >
                                <Text style={styles.primaryButtonText}>+ Invite New Co-Owner</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Render Lists based on Tab */}
                        {activeTab === 'invite' ? (
                            <>
                                {/* My Active Connections */}
                                {(activeCoOwners.length > 0 || sharedWithMe.length > 0) ? (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Active Access</Text>
                                        {activeCoOwners.length > 0 && (
                                            <>
                                                <Text style={styles.subHeader}>People I Invited</Text>
                                                {activeCoOwners.map(item => renderCard(item, 'active', false))}
                                            </>
                                        )}
                                        {sharedWithMe.length > 0 && (
                                            <>
                                                <Text style={styles.subHeader}>Shared With Me</Text>
                                                {sharedWithMe.map(item => renderCard(item, 'active', false))}
                                            </>
                                        )}
                                    </View>
                                ) : (
                                    <Text style={styles.emptyText}>No active co-owners yet.</Text>
                                )}

                                {/* Pending Outgoing */}
                                {sentInvites.length > 0 && (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Pending Invites</Text>
                                        {sentInvites.map(item => renderCard(item, 'pending', false))}
                                    </View>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Requests */}
                                {(receivedInvites.length > 0 || receivedRequests.length > 0 || sentRequests.length > 0) ? (
                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Pending Requests</Text>
                                        {receivedInvites.map(item => renderCard(item, 'pending', true))}
                                        {receivedRequests.map(item => renderCard(item, 'request', true))}
                                        {sentRequests.map(item => renderCard(item, 'request', false))}
                                    </View>
                                ) : (
                                    <Text style={styles.emptyText}>No pending requests.</Text>
                                )}
                            </>
                        )}

                    </ScrollView>
                </KeyboardAvoidingView>

                {renderInviteModal()}
                {renderShareDetailsModal()}
            </View>
        </DesktopShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    header: {
        padding: getSpacing(6),
        backgroundColor: designSystem.colors.background.primary,
        paddingBottom: getSpacing(2),
    },
    title: {
        ...designSystem.typography.headline.medium,
        color: designSystem.colors.text.primary,
        marginBottom: getSpacing(1),
    },
    subtitle: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
    },
    content: {
        padding: getSpacing(5),
        paddingBottom: 100,
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    section: {
        marginBottom: getSpacing(6),
    },
    sectionTitle: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.text.primary,
        marginBottom: getSpacing(3),
    },
    subHeader: {
        ...designSystem.typography.label.large,
        color: designSystem.colors.text.secondary,
        marginBottom: getSpacing(2),
        marginTop: getSpacing(1),
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: getSpacing(4),
        backgroundColor: getColor('background.secondary'),
        borderRadius: designSystem.borderRadius.lg,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: getSpacing(2),
        alignItems: 'center',
        borderRadius: designSystem.borderRadius.md,
    },
    activeTab: {
        backgroundColor: designSystem.colors.primary[500],
    },
    tabText: {
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        fontSize: 14,
    },
    activeTabText: {
        color: '#fff',
    },
    card: {
        backgroundColor: getColor('background.secondary'),
        padding: getSpacing(4),
        borderRadius: designSystem.borderRadius.md,
        marginBottom: getSpacing(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...designSystem.shadows.sm,
    },
    expiredCard: {
        opacity: 0.6,
    },
    cardTitle: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.primary,
        fontWeight: '600',
    },
    cardSubtitle: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.secondary,
        marginTop: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: designSystem.colors.success[500],
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    acceptText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    declineButton: {
        backgroundColor: designSystem.colors.error[100],
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    declineText: { color: designSystem.colors.error[700], fontSize: 14, fontWeight: '600' },
    removeButton: { padding: 8 },
    removeText: { color: designSystem.colors.error[500], fontSize: 14, fontWeight: '500' },
    emptyText: {
        color: designSystem.colors.text.secondary,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    primaryButton: {
        backgroundColor: designSystem.colors.primary[500],
        paddingVertical: 12,
        borderRadius: designSystem.borderRadius.md,
        alignItems: 'center',
        width: '100%',
    },
    primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    disabledButton: { opacity: 0.5 },

    // Modal Styles
    modalContainer: { flex: 1, backgroundColor: '#fff', marginTop: 50, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    closeText: { color: 'blue', fontSize: 16 },
    modalContent: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: 'transparent' },
    activeChip: { backgroundColor: '#e3f2fd', borderColor: '#2196f3' },
    chipText: { fontSize: 14, color: '#333' },
    activeChipText: { color: '#2196f3', fontWeight: '600' },
    petItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
    selectedPet: { borderColor: '#2196f3', backgroundColor: '#f8fdff' },
    petName: { fontSize: 16 },
    checkMark: { color: '#2196f3', fontWeight: 'bold' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    qrContainer: { alignItems: 'center', marginVertical: 20 },
    qrText: { marginTop: 10, color: '#666' },
    expiredText: { color: 'red', fontSize: 12, marginTop: 2 },
    permissionText: { color: '#666', fontSize: 12, marginTop: 2 },
    linkText: { marginTop: 16, color: '#2196f3', fontSize: 14, textAlign: 'center', marginBottom: 8 },
    copyBtn: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#f0f0f0', borderRadius: 8 },
    copyBtnText: { color: '#333', fontWeight: '600' },
    hint: { fontSize: 12, color: '#666', marginTop: 8, fontStyle: 'italic' },
    stickyFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },

    // Details Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        ...designSystem.shadows.lg,
    },
    detailsTitle: {
        ...designSystem.typography.headline.small,
        marginBottom: 16,
        textAlign: 'center',
    },
    detailLabel: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.secondary,
        marginTop: 12,
    },
    detailValue: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
        fontWeight: '500',
        marginTop: 4,
    },
    petList: {
        marginTop: 4,
        gap: 4,
    },
    petListItem: {
        fontSize: 15,
        color: designSystem.colors.text.primary,
    },
    closeDetailsButton: {
        marginTop: 24,
        backgroundColor: designSystem.colors.neutral[100],
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeDetailsText: {
        color: designSystem.colors.text.primary,
        fontWeight: '600',
    },
});
