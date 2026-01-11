import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import type { PetPassport } from '@/types/passport';

interface TravelReadinessProps {
    passport: PetPassport | null;
}

export const TravelReadiness: React.FC<TravelReadinessProps> = ({ passport }) => {
    if (!passport) return null;

    // Check criteria
    const hasMicrochip = !!passport.identification.microchipNumber;

    // Find Rabies vaccine
    const rabiesVaccine = passport.vaccinations.find(v =>
        v.vaccineName.toLowerCase().includes('rabies')
    );
    const isRabiesCurrent = rabiesVaccine?.status.isCurrent || false;

    // Core vaccines compliance
    const coreVaccines = passport.vaccinations.filter(v => v.category === 'core');
    const areCoreVaccinesCurrent = coreVaccines.length > 0 && coreVaccines.every(v => v.status.isCurrent);

    const checklist = [
        {
            id: 'microchip',
            label: 'Microchip Identification',
            isComplete: hasMicrochip,
            details: hasMicrochip ? `Yes (#${passport.identification.microchipNumber})` : 'Missing'
        },
        {
            id: 'rabies',
            label: 'Rabies Vaccination',
            isComplete: isRabiesCurrent,
            details: isRabiesCurrent
                ? `Valid until ${rabiesVaccine?.nextDueDate ? new Date(rabiesVaccine.nextDueDate).toLocaleDateString() : 'Unknown'}`
                : 'Not current or not found'
        },
        {
            id: 'core',
            label: 'Core Vaccinations',
            isComplete: areCoreVaccinesCurrent,
            details: areCoreVaccinesCurrent ? 'All up to date' : 'Some missing or overdue'
        }
    ];

    const readinessScore = checklist.filter(item => item.isComplete).length;
    const isReady = readinessScore === checklist.length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name="airplane-outline" size={24} color={designSystem.colors.primary[500]} />
                    <Text style={styles.title}>Travel Readiness</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: isReady ? designSystem.colors.success[50] : designSystem.colors.warning[50] }]}>
                    <Text style={[styles.badgeText, { color: isReady ? designSystem.colors.success[700] : designSystem.colors.warning[700] }]}>
                        {isReady ? 'Likely Ready' : 'Review Needed'}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                {checklist.map((item, index) => (
                    <View key={item.id} style={[styles.checklistItem, index !== checklist.length - 1 && styles.borderBottom]}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={item.isComplete ? "checkmark-circle" : "alert-circle"}
                                size={24}
                                color={item.isComplete ? designSystem.colors.success[500] : designSystem.colors.warning[500] as any}
                            />
                        </View>
                        <View style={styles.itemContent}>
                            <Text style={styles.itemLabel}>{item.label}</Text>
                            <Text style={styles.itemDetails}>{item.details}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.disclaimer}>
                    * Always check specific requirements for your destination country or airline.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[5],
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: designSystem.spacing[4],
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.md,
        padding: designSystem.spacing[4],
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: designSystem.spacing[3],
        gap: designSystem.spacing[3],
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.border.primary,
    },
    iconContainer: {
        width: 24,
        alignItems: 'center',
    },
    itemContent: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    itemDetails: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        marginTop: 2,
    },
    footer: {
        marginTop: designSystem.spacing[4],
    },
    disclaimer: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
    },
});
