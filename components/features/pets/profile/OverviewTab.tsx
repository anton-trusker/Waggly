
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking, Platform } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Pet, Veterinarian } from '@/types';
import { formatAge } from '@/lib/age';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';

interface OverviewTabProps {
    pet: Pet;
    vets: Veterinarian[];
    onAddVet: () => void;
    onViewPassport: () => void;
}

export default function OverviewTab({ pet, vets, onAddVet, onViewPassport }: OverviewTabProps) {
    const { theme, isDark } = useAppTheme();

    const handleCopy = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied', `${label} copied to clipboard`);
    };

    const openMap = (lat?: number, lng?: number, query?: string) => {
        if (lat && lng) {
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${lat},${lng}`;
            const label = query || 'Vet Location';
            const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });
            if (url) Linking.openURL(url);
        } else if (query) {
            const url = Platform.select({
                ios: `maps:0,0?q=${query}`,
                android: `geo:0,0?q=${query}`
            });
            if (url) Linking.openURL(url);
        }
    };

    return (
        <View style={styles.container}>
            {/* Digital Passport Banner */}
            <TouchableOpacity
                style={styles.passportCard}
                activeOpacity={0.9}
                onPress={onViewPassport}
            >
                <LinearGradient
                    colors={[colors.primary[500] || '#4B62D6', '#60A5FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.passportContent}>
                    <View style={styles.passportIconStart}>
                        <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="fingerprint" size={24} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.passportTitle}>Digital Passport</Text>
                        <Text style={styles.passportId}>ID: {pet.microchip_number ? pet.microchip_number.slice(-4) : 'XXXX'}-{pet.name.toUpperCase()}</Text>
                    </View>
                </View>
                <IconSymbol ios_icon_name="arrow.right" android_material_icon_name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>

            {/* Vitals Grid */}
            <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Vitals</Text>
                <TouchableOpacity><Text style={{ color: colors.primary[500], fontWeight: '600' }}>History</Text></TouchableOpacity>
            </View>

            <View style={styles.gridContainer}>
                {/* Gender */}
                <View style={[styles.gridItem, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                    <View style={[styles.iconBox, { backgroundColor: pet.gender === 'female' ? '#FCE7F3' : '#EFF6FF' }]}>
                        <IconSymbol
                            ios_icon_name="person.2.fill"
                            android_material_icon_name={pet.gender === 'female' ? "female" : "male"}
                            size={24}
                            color={pet.gender === 'female' ? "#DB2777" : "#2563EB"}
                        />
                    </View>
                    <Text style={[styles.gridValue, { color: theme.colors.text.primary }]}>{pet.gender ? (pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)) : '--'}</Text>
                    <Text style={[styles.gridLabel, { color: theme.colors.text.secondary }]}>GENDER</Text>
                </View>

                {/* Weight */}
                <View style={[styles.gridItem, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
                        <IconSymbol ios_icon_name="scalemass" android_material_icon_name="monitor-weight" size={24} color="#EA580C" />
                    </View>
                    <Text style={[styles.gridValue, { color: theme.colors.text.primary }]}>{pet.weight ? `${pet.weight}kg` : '--'}</Text>
                    <Text style={[styles.gridLabel, { color: theme.colors.text.secondary }]}>WEIGHT</Text>
                </View>

                {/* Birthday */}
                <View style={[styles.gridItem, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                    <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                        <IconSymbol ios_icon_name="birthday.cake.fill" android_material_icon_name="cake" size={24} color="#9333EA" />
                    </View>
                    <Text style={[styles.gridValue, { color: theme.colors.text.primary }]}>
                        {pet.date_of_birth ? new Date(pet.date_of_birth).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: '2-digit' }) : '--'}
                    </Text>
                    <Text style={[styles.gridLabel, { color: theme.colors.text.secondary }]}>BIRTHDAY</Text>
                </View>

                {/* Breed */}
                <View style={[styles.gridItem, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                    <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                        <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={24} color="#16A34A" />
                    </View>
                    <Text style={[styles.gridValue, { color: theme.colors.text.primary }]} numberOfLines={1}>{pet.breed || 'Mixed'}</Text>
                    <Text style={[styles.gridLabel, { color: theme.colors.text.secondary }]}>BREED</Text>
                </View>
            </View>

            {/* Identity */}
            <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Identity</Text>
            </View>

            <View style={styles.identityList}>
                {pet.microchip_number && (
                    <View style={[styles.identityCard, { backgroundColor: theme.colors.background.secondary }]}>
                        <View style={styles.identityContent}>
                            <View style={[styles.identityIcon, { backgroundColor: '#EFF6FF' }]}>
                                <IconSymbol ios_icon_name="memorychip" android_material_icon_name="memory" size={24} color="#2563EB" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.identityLabel, { color: theme.colors.text.secondary }]}>MICROCHIP ID</Text>
                                <Text style={[styles.identityValue, { color: theme.colors.text.primary }]}>{pet.microchip_number}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleCopy(pet.microchip_number!, 'Microchip ID')} style={styles.copyBtn}>
                            <IconSymbol ios_icon_name="doc.on.doc" android_material_icon_name="content-copy" size={20} color={theme.colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                )}

                {pet.registration_id && (
                    <View style={[styles.identityCard, { backgroundColor: theme.colors.background.secondary }]}>
                        <View style={styles.identityContent}>
                            <View style={[styles.identityIcon, { backgroundColor: '#E0E7FF' }]}>
                                <IconSymbol ios_icon_name="person.text.rectangle" android_material_icon_name="badge" size={24} color="#4F46E5" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.identityLabel, { color: theme.colors.text.secondary }]}>REGISTRATION</Text>
                                <Text style={[styles.identityValue, { color: theme.colors.text.primary }]}>{pet.registration_id}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleCopy(pet.registration_id!, 'Registration ID')} style={styles.copyBtn}>
                            <IconSymbol ios_icon_name="doc.on.doc" android_material_icon_name="content-copy" size={20} color={theme.colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Care Team */}
            <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Care Team</Text>
                <TouchableOpacity onPress={onAddVet}><IconSymbol ios_icon_name="plus.circle.fill" android_material_icon_name="add-circle" size={24} color={colors.primary[500]} /></TouchableOpacity>
            </View>

            <View style={styles.careTeamList}>
                {vets.length === 0 ? (
                    <Text style={{ color: theme.colors.text.secondary, fontStyle: 'italic' }}>No veterinarians added yet.</Text>
                ) : (
                    vets.map(vet => (
                        <View key={vet.id} style={[styles.vetCard, { backgroundColor: theme.colors.background.secondary }]}>
                            <View style={styles.vetHeader}>
                                <View style={styles.vetAvatar}>
                                    <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="medical-services" size={24} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={[styles.vetName, { color: theme.colors.text.primary }]}>{vet.clinic_name}</Text>
                                        {vet.is_primary && <View style={styles.primaryBadge}><Text style={styles.primaryBadgeText}>Primary</Text></View>}
                                    </View>
                                    <Text style={{ color: theme.colors.text.secondary, fontSize: 13 }}>
                                        {vet.vet_name || 'General Clinic'} • {vet.type ? vet.type.charAt(0).toUpperCase() + vet.type.slice(1) : 'Clinic'}
                                    </Text>
                                    {(vet.location_lat || vet.city) && (
                                        <TouchableOpacity onPress={() => openMap(vet.location_lat, vet.location_lng, vet.address || vet.clinic_name)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                            <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={12} color={theme.colors.text.secondary} />
                                            <Text style={{ color: theme.colors.text.secondary, fontSize: 12, marginLeft: 2 }}>{vet.city || vet.address}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <View style={styles.vetActions}>
                                <TouchableOpacity
                                    style={[styles.vetActionBtn, { backgroundColor: colors.primary[500] }]}
                                    onPress={() => vet.phone && Linking.openURL(`tel:${vet.phone}`)}
                                >
                                    <IconSymbol ios_icon_name="phone.fill" android_material_icon_name="call" size={18} color="#fff" />
                                    <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 6 }}>Call</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.vetActionBtn, { backgroundColor: theme.colors.background.primary, borderWidth: 1, borderColor: theme.colors.border.primary }]}
                                    onPress={() => openMap(vet.location_lat, vet.location_lng, vet.address || vet.clinic_name)}
                                >
                                    <IconSymbol ios_icon_name="map.fill" android_material_icon_name="map" size={18} color={theme.colors.text.primary} />
                                    <Text style={{ color: theme.colors.text.primary, fontWeight: '600', marginLeft: 6 }}>Map</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 24,
    },
    passportCard: {
        height: 80,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    passportContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    passportIconStart: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
    },
    passportTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    passportId: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        width: '48%',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        minHeight: 110,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    gridValue: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    gridLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    identityList: {
        gap: 12,
    },
    identityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1, // Optional: if desired
        borderColor: 'transparent', // Or theme border
    },
    identityContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    identityIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    identityLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    identityValue: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    copyBtn: {
        padding: 8,
    },
    careTeamList: {
        gap: 16,
    },
    vetCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1, // Optional
        borderColor: 'transparent',
    },
    vetHeader: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    vetAvatar: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#E2E8F0', // Placeholder
        alignItems: 'center',
        justifyContent: 'center',
        // If we had an image, we'd use it, otherwise icon
        // Using a gradient or solid color
        overflow: 'hidden',
    },
    vetName: {
        fontSize: 16,
        fontWeight: '700',
    },
    primaryBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    primaryBadgeText: {
        color: '#166534',
        fontSize: 10,
        fontWeight: '700',
    },
    vetActions: {
        flexDirection: 'row',
        gap: 12,
    },
    vetActionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
    },
});
