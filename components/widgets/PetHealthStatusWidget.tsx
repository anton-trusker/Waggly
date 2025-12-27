import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Vaccination } from '@/types';

interface PetHealthStatusWidgetProps {
    nextVaccineDue?: Vaccination;
}

export default function PetHealthStatusWidget({ nextVaccineDue }: PetHealthStatusWidgetProps) {
    return (
        <LinearGradient
            colors={['#6366F1', '#9333EA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientCard}
        >
            <View style={styles.gradientCardContent}>
                <View>
                    <Text style={styles.gradientCardLabel}>HEALTH STATUS</Text>
                    <Text style={styles.gradientCardTitle}>Vaccines Up to Date</Text>
                    {nextVaccineDue && (
                        <View style={styles.gradientCardSubtitleRow}>
                            <IconSymbol android_material_icon_name="event" size={16} color="#E0E7FF" />
                            <Text style={styles.gradientCardSubtitle}>
                                Next Due: {new Date(nextVaccineDue.next_due_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.verifiedIconBox}>
                    <IconSymbol android_material_icon_name="verified-user" size={24} color="#6366F1" />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    gradientCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    gradientCardLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#E0E7FF',
        letterSpacing: 1,
        marginBottom: 8,
    },
    gradientCardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    gradientCardSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    gradientCardSubtitle: {
        fontSize: 13,
        color: '#E0E7FF',
        fontWeight: '500',
    },
    verifiedIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
