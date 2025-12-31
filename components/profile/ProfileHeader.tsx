import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

interface ProfileHeaderProps {
    firstName: string;
    lastName: string;
    email: string | undefined;
    photoUrl: string | null;
    address: string | null;
    onEdit: () => void;
    isEditing: boolean;
    onPhotoUpload?: () => void;
}

export function ProfileHeader({
    firstName,
    lastName,
    email,
    photoUrl,
    address,
    onEdit,
    isEditing,
    onPhotoUpload
}: ProfileHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.content}>
                    <View style={styles.avatarContainer}>
                        {photoUrl ? (
                            <Image source={{ uri: photoUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {(firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')}
                                </Text>
                            </View>
                        )}
                        {isEditing && onPhotoUpload && (
                            <TouchableOpacity style={styles.uploadButton} onPress={onPhotoUpload}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.info}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{firstName} {lastName}</Text>
                            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                                <Ionicons
                                    name={isEditing ? "close" : "pencil"}
                                    size={16}
                                    color={designSystem.colors.primary}
                                />
                                <Text style={styles.editButtonText}>
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.email}>{email}</Text>

                        {address && (
                            <View style={styles.addressRow}>
                                <Ionicons name="location-outline" size={14} color="#6B7280" />
                                <Text style={styles.address}>{address}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3F4F6',
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E0E7FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#4F46E5',
        textTransform: 'uppercase',
    },
    uploadButton: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#4F46E5',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    editButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4F46E5',
    },
    email: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 4,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    address: {
        fontSize: 14,
        color: '#6B7280',
    },
});
