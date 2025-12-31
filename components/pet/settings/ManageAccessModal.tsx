import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, FlatList, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useCoOwners } from '@/hooks/useCoOwners';
import { BlurView } from 'expo-blur';

interface ManageAccessModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    petName?: string;
}

export default function ManageAccessModal({ visible, onClose, petId, petName }: ManageAccessModalProps) {
    const { theme } = useAppTheme();
    const { t } = useLocale();
    const { coOwners, fetchCoOwners, inviteCoOwner, removeCoOwner, loading } = useCoOwners();

    const [email, setEmail] = useState('');
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchCoOwners();
        }
    }, [visible]);

    const handleInvite = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        setInviting(true);
        const { error } = await inviteCoOwner(email, 'viewer', {}, petName);
        setInviting(false);

        if (error) {
            Alert.alert('Error', 'Failed to send invite.');
        } else {
            setEmail('');
            Alert.alert('Success', 'Invitation sent successfully!');
        }
    };

    const handleRemove = (id: string) => {
        Alert.alert(
            'Remove Access',
            'Are you sure you want to remove this person?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        await removeCoOwner(id);
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.userItem, { borderColor: theme.colors.border.primary }]}>
            <View style={styles.userInfo}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary[100] }]}>
                    <Text style={[styles.avatarText, { color: theme.colors.primary[700] }]}>
                        {item.co_owner_email.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View>
                    <Text style={[styles.userEmail, { color: theme.colors.text.primary }]}>{item.co_owner_email}</Text>
                    <Text style={[styles.userRole, { color: theme.colors.text.secondary }]}>
                        {item.status === 'pending' ? 'Pending Invite' : item.role}
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
                <IconSymbol android_material_icon_name="close" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Manage Access</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <IconSymbol android_material_icon_name="close" size={24} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
                            Invite people to help manage {petName || 'your pet'}.
                        </Text>

                        <View style={styles.inviteRow}>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: theme.colors.background.card,
                                    color: theme.colors.text.primary,
                                    borderColor: theme.colors.border.primary
                                }]}
                                placeholder="Enter email address"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <TouchableOpacity
                                style={[styles.inviteBtn, { backgroundColor: theme.colors.primary[500], opacity: inviting ? 0.7 : 1 }]}
                                onPress={handleInvite}
                                disabled={inviting}
                            >
                                {inviting ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.inviteBtnText}>Invite</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>People with access</Text>
                        {loading && coOwners.length === 0 ? (
                            <ActivityIndicator style={{ marginTop: 20 }} color={theme.colors.primary[500]} />
                        ) : (
                            <FlatList
                                data={coOwners}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                ListEmptyComponent={
                                    <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>
                                        No one else has access yet.
                                    </Text>
                                }
                                contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
                            />
                        )}

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
        maxHeight: '80%',
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
        marginBottom: 8,
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
        marginTop: 16,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
        fontFamily: 'Plus Jakarta Sans',
    },
    inviteRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    input: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        fontSize: 15,
    },
    inviteBtn: {
        height: 48,
        paddingHorizontal: 20,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
    },
    userEmail: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    userRole: {
        fontSize: 12,
    },
    removeButton: {
        padding: 8,
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 12,
    },
});
