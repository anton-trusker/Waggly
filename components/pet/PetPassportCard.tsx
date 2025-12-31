import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Pet } from '@/types';
import { formatAge } from '@/lib/age';
import { designSystem } from '@/constants/designSystem';

interface PetPassportCardProps {
    pet: Pet;
    onPress?: () => void;
}

export function PetPassportCard({ pet, onPress }: PetPassportCardProps) {
    // Generate a consistent color theme based on pet id or index? 
    // For now, let's use a nice default passport blue/purple gradient.
    const gradientColors = ['#4F46E5', '#818CF8'] as const;

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientBackground}
            >
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <View style={styles.passportLabelContainer}>
                        <IconSymbol
                            ios_icon_name="globe"
                            android_material_icon_name="public"
                            size={14}
                            color="rgba(255,255,255,0.8)"
                        />
                        <Text style={styles.passportLabel}>PASSPORT</Text>
                    </View>

                    <View style={styles.headerRight}>
                        {pet.microchip_number && (
                            <View style={styles.microchipContainer}>
                                <IconSymbol
                                    ios_icon_name="memorychip"
                                    android_material_icon_name="memory"
                                    size={14}
                                    color="rgba(255,255,255,0.9)"
                                />
                                <Text style={styles.microchipText}>
                                    {pet.microchip_number}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.qrButton}>
                            <IconSymbol
                                ios_icon_name="qrcode"
                                android_material_icon_name="qr_code"
                                size={20}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content - New Layout */}
                <View style={styles.contentContainer}>
                    {/* Top Row: Photo + Name/Breed */}
                    <View style={styles.topRow}>
                        {/* Photo */}
                        <View style={styles.photoContainer}>
                            {pet.photo_url ? (
                                <Image source={{ uri: pet.photo_url }} style={styles.photo} />
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <IconSymbol
                                        ios_icon_name="pawprint.fill"
                                        android_material_icon_name="pets"
                                        size={32}
                                        color="#C7D2FE"
                                    />
                                </View>
                            )}
                            <View style={styles.verifiedBadge}>
                                <IconSymbol
                                    ios_icon_name="checkmark.circle.fill"
                                    android_material_icon_name="verified"
                                    size={16}
                                    color="#10B981"
                                />
                            </View>
                        </View>

                        {/* Name & Breed */}
                        <View style={styles.nameSection}>
                            <View style={styles.nameRow}>
                                <Text style={styles.nameText}>{pet.name}</Text>
                                <View style={styles.genderBadge}>
                                    <IconSymbol
                                        ios_icon_name={pet.gender === 'female' ? "female" : "male"}
                                        android_material_icon_name={pet.gender === 'female' ? "female" : "male"}
                                        size={14}
                                        color={pet.gender === 'female' ? '#EC4899' : '#3B82F6'}
                                    />
                                </View>
                            </View>
                            <Text style={styles.breedText}>{pet.breed || pet.species || 'Unknown Breed'}</Text>
                            {pet.registration_id && (
                                <Text style={styles.regText}>Reg: {pet.registration_id}</Text>
                            )}
                        </View>
                    </View>

                    {/* Details Table */}
                    <View style={styles.detailsTable}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <Text style={styles.tableCellLabel}>DATE OF BIRTH</Text>
                                <Text style={styles.tableCellValue}>
                                    {pet.date_of_birth
                                        ? new Date(pet.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : '--'}
                                </Text>
                            </View>
                            <View style={styles.tableCellDivider} />
                            <View style={styles.tableCell}>
                                <Text style={styles.tableCellLabel}>WEIGHT</Text>
                                <Text style={styles.tableCellValue}>
                                    {pet.weight ? `${pet.weight} kg` : '--'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tableRowDivider} />
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <Text style={styles.tableCellLabel}>COLOR</Text>
                                <Text style={styles.tableCellValue} numberOfLines={1}>
                                    {pet.color || '--'}
                                </Text>
                            </View>
                            <View style={styles.tableCellDivider} />
                            <View style={styles.tableCell}>
                                <Text style={styles.tableCellLabel}>BLOOD TYPE</Text>
                                <Text style={styles.tableCellValue}>
                                    {pet.blood_type || '--'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Decorative Elements */}
                <View style={styles.watermarkContainer}>
                    <IconSymbol
                        ios_icon_name="pawprint.fill"
                        android_material_icon_name="pets"
                        size={120}
                        color="rgba(255,255,255,0.05)"
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
        minWidth: 320,
        marginVertical: 8,
    },
    gradientBackground: {
        padding: 20,
        minHeight: 220,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    passportLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    passportLabel: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 10,
        letterSpacing: 1,
    },
    microchipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    microchipText: {
        color: '#fff',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 14,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    qrButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    contentContainer: {
        zIndex: 10,
    },
    topRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    photoContainer: {
        position: 'relative',
    },
    photo: {
        width: 72,
        height: 72,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    photoPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 2,
    },
    nameSection: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    nameText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    genderBadge: {
        backgroundColor: '#fff',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    breedText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    regText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    detailsTable: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableRowDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    tableCell: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    tableCellDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    tableCellLabel: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    tableCellValue: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '600',
    },
    watermarkContainer: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        opacity: 0.5,
        transform: [{ rotate: '-15deg' }],
        zIndex: 0,
    },
});
