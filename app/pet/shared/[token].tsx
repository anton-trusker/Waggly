import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePetSharing, SharedPetData } from '@/hooks/usePetSharing';
import { designSystem } from '@/constants/designSystem';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function SharedPetProfile() {
    const { token } = useLocalSearchParams<{ token: string }>();
    const { validateToken } = usePetSharing();

    const [petData, setPetData] = useState<SharedPetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [permissionLevel, setPermissionLevel] = useState<'basic' | 'advanced'>('basic');

    useEffect(() => {
        const loadPetData = async () => {
            if (!token) {
                setError('Invalid share link');
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data, error: fetchError } = await validateToken(token as string);

            if (fetchError || !data) {
                setError('This share link is invalid or has expired');
                setLoading(false);
                return;
            }

            setPetData(data);
            setPermissionLevel(data.vaccinations || data.allergies || data.treatments ? 'advanced' : 'basic');
            setLoading(false);
        };

        loadPetData();
    }, [token]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={designSystem.colors.primary[500]} />
                <Text style={styles.loadingText}>Loading pet profile...</Text>
            </View>
        );
    }

    if (error || !petData) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={64} color={designSystem.colors.error[500]} />
                <Text style={styles.errorTitle}>Oops!</Text>
                <Text style={styles.errorText}>{error || 'Pet not found'}</Text>
            </View>
        );
    }

    // Calculate age from date of birth
    const getAge = (dob?: string) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = getAge(petData.date_of_birth);

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            {/* Branded Header */}
            <View style={styles.brandedHeader}>
                <View style={styles.brandRow}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.brandName}>Pawzly</Text>
                </View>
                <View style={styles.badge}>
                    <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
                    <Text style={styles.badgeText}>Verified Profile</Text>
                </View>
            </View>

            <View style={styles.mainContent}>
                {/* Pet Card */}
                <View style={styles.card}>
                    {/* Photo */}
                    <View style={styles.photoContainer}>
                        {petData.photo_url ? (
                            <Image source={{ uri: petData.photo_url }} style={styles.photo} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Ionicons name="paw" size={64} color="#D1D5DB" />
                            </View>
                        )}
                        <View style={styles.speciesIconContainer}>
                            <Ionicons
                                name={petData.species.toLowerCase() === 'dog' ? 'paw' : 'logo-octocat'}
                                size={20}
                                color="#FFFFFF"
                            />
                        </View>
                    </View>

                    {/* Name and Basic Info */}
                    <Text style={styles.petName}>{petData.name}</Text>
                    <View style={styles.badgeRow}>
                        <View style={styles.infoBadge}>
                            <Text style={styles.infoBadgeText}>{petData.breed || petData.species}</Text>
                        </View>
                        {petData.gender && (
                            <View style={[styles.infoBadge, { backgroundColor: '#F3F4F6' }]}>
                                <Text style={[styles.infoBadgeText, { color: '#6B7280' }]}>
                                    {petData.gender.charAt(0).toUpperCase() + petData.gender.slice(1)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                        {age !== null && (
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconBox}>
                                    <Ionicons name="calendar" size={20} color={designSystem.colors.primary[500]} />
                                </View>
                                <Text style={styles.detailLabel}>Age</Text>
                                <Text style={styles.detailValue}>{age} {age === 1 ? 'Year' : 'Years'}</Text>
                            </View>
                        )}

                        {petData.microchip_number && (
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconBox}>
                                    <Ionicons name="barcode" size={20} color={designSystem.colors.primary[500]} />
                                </View>
                                <Text style={styles.detailLabel}>Microchip</Text>
                                <Text style={styles.detailValue} numberOfLines={1}>{petData.microchip_number}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Advanced Information (Medical) */}
                {permissionLevel === 'advanced' && (
                    <View style={styles.medicalSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="medical" size={22} color={designSystem.colors.primary[600]} />
                            <Text style={styles.sectionTitle}>Medical History</Text>
                        </View>

                        {/* Vaccinations */}
                        {petData.vaccinations && petData.vaccinations.length > 0 && (
                            <View style={styles.subSection}>
                                <Text style={styles.subSectionTitle}>Vaccinations</Text>
                                {petData.vaccinations.slice(0, 5).map((vac: any, idx: number) => (
                                    <View key={idx} style={styles.listItem}>
                                        <View style={[styles.listIcon, { backgroundColor: '#ECFDF5' }]}>
                                            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                        </View>
                                        <View style={styles.listItemContent}>
                                            <Text style={styles.listItemTitle}>{vac.vaccine_name}</Text>
                                            <Text style={styles.listItemDate}>
                                                {vac.date_given ? new Date(vac.date_given).toLocaleDateString() : 'Date N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Allergies */}
                        {petData.allergies && petData.allergies.length > 0 && (
                            <View style={styles.subSection}>
                                <Text style={styles.subSectionTitle}>Allergies</Text>
                                {petData.allergies.map((allergy: any, idx: number) => (
                                    <View key={idx} style={styles.listItem}>
                                        <View style={[styles.listIcon, { backgroundColor: '#FFFBEB' }]}>
                                            <Ionicons name="warning" size={18} color="#F59E0B" />
                                        </View>
                                        <View style={styles.listItemContent}>
                                            <Text style={styles.listItemTitle}>
                                                {allergy.allergen_name || allergy.allergen}
                                            </Text>
                                            <View style={styles.severityBadge}>
                                                <Text style={styles.severityText}>
                                                    {allergy.severity_level || allergy.severity || 'Moderate'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Footer Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Shared securely by Pawzly</Text>
                    <View style={styles.footerDivider} />
                    <Text style={styles.footerSecondaryText}>
                        This profile is for informational purposes only.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginTop: 16,
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
    },
    brandedHeader: {
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        width: '100%',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 32,
        height: 32,
    },
    brandName: {
        fontSize: 22,
        fontWeight: '900',
        color: designSystem.colors.primary[500],
        letterSpacing: -0.5,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.primary[500],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    mainContent: {
        padding: 16,
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        ...designSystem.shadows.lg,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    photo: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#F3F4F6',
    },
    photoPlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    speciesIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: designSystem.colors.primary[500],
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    petName: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111827',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        marginBottom: 24,
    },
    infoBadge: {
        backgroundColor: designSystem.colors.primary[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    infoBadgeText: {
        color: designSystem.colors.primary[600],
        fontSize: 14,
        fontWeight: '700',
    },
    detailsGrid: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    detailItem: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    detailIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        ...designSystem.shadows.sm,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '800',
        marginTop: 4,
    },
    medicalSection: {
        width: '100%',
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        ...designSystem.shadows.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    subSection: {
        marginBottom: 24,
    },
    subSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 12,
        paddingLeft: 4,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    listIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    listItemDate: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    severityBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 4,
    },
    severityText: {
        fontSize: 11,
        color: '#D97706',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        width: '100%',
    },
    footerDivider: {
        width: 40,
        height: 2,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    footerSecondaryText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
