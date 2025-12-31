
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '@/types';
import { format } from 'date-fns';
import { formatAge } from '@/lib/age';

interface PetProfileCardWidgetProps {
    pet: Pet;
}

export default function PetProfileCardWidget({ pet }: PetProfileCardWidgetProps) {
    const formatDate = (date: string | undefined) => {
        if (!date) return 'N/A';
        try {
            return format(new Date(date), 'dd.MM.yyyy');
        } catch {
            return date;
        }
    };

    const getSex = () => {
        if (!pet.gender) return 'Unknown';
        return pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1);
    };

    const formatPetAge = () => {
        if (!pet.date_of_birth) return 'Unknown';
        return formatAge(new Date(pet.date_of_birth));
    };

    return (
        <View style={styles.card}>
            {/* Header: Name Left, Microchip Right */}
            <View style={styles.identityHeader}>
                <View style={styles.identityHeaderLeft}>
                    <Ionicons name="paw" size={20} color="#4F46E5" />
                    <Text style={styles.identityTitle}>{pet.name?.toUpperCase() || ''}</Text>
                </View>
                {pet.microchip_number && (
                    <View style={styles.idBadge}>
                        <Ionicons name="qr-code-outline" size={12} color="#374151" style={{ marginRight: 4 }} />
                        <Text style={styles.idBadgeText}>{pet.microchip_number}</Text>
                    </View>
                )}
            </View>

            <View style={styles.passportPattern}>
                <View style={styles.contentRow}>
                    {/* Left: Details Grid */}
                    <View style={styles.detailsSection}>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>AGE</Text>
                                <Text style={styles.detailValue}>{formatPetAge()}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>SPECIES</Text>
                                <Text style={styles.detailValue}>{pet.species || 'Unknown'}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>SEX</Text>
                                <Text style={styles.detailValue}>{getSex()}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>COLOR</Text>
                                <Text style={styles.detailValue}>{pet.color || '—'}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>BLOOD TYPE</Text>
                                <Text style={styles.detailValue}>{pet.blood_type || '—'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Right: Photo */}
                    <View style={styles.photoSection}>
                        <View style={styles.photoFrame}>
                            {pet.photo_url ? (
                                <Image source={{ uri: pet.photo_url }} style={styles.passportPhoto} />
                            ) : (
                                <View style={[styles.passportPhoto, styles.photoPlaceholder]}>
                                    <Ionicons name="paw" size={40} color="#9CA3AF" />
                                </View>
                            )}
                        </View>
                        {(pet as any).petkey_id && (
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-circle" size={12} color="#059669" />
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
    },
    identityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#EEF2FF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    identityHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    identityTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4F46E5',
        fontFamily: 'Plus Jakarta Sans',
    },
    idBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    idBadgeText: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: '#374151',
    },
    passportPattern: {
        padding: 16,
    },
    contentRow: {
        flexDirection: 'row',
        gap: 16,
    },
    detailsSection: {
        flex: 1,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailItem: {
        width: '45%', // Two cols in the left section
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 10,
        color: '#6B7280',
        letterSpacing: 0.5,
        marginBottom: 2,
        fontFamily: 'Plus Jakarta Sans',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        fontFamily: 'Plus Jakarta Sans',
    },
    photoSection: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    photoFrame: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid', // Changed from dashed for cleaner look on widget
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        marginBottom: 4,
        padding: 2,
        backgroundColor: '#fff',
    },
    passportPhoto: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    photoPlaceholder: {
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#059669',
    },
});
