
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePriorityAlerts } from '@/hooks/usePriorityAlerts';
import { usePets } from '@/hooks/usePets';

export default function DashboardHealthStatus() {
    const router = useRouter();
    const { alerts, loading } = usePriorityAlerts();
    const { pets } = usePets();

    const criticalCount = alerts.filter(a => a.severity === 'high').length;
    const warningCount = alerts.filter(a => a.severity === 'medium').length;

    // Find next upcoming due date from alerts
    const nextDue = alerts
        .filter(a => new Date(a.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    const allGood = criticalCount === 0 && warningCount === 0;

    return (
        <LinearGradient
            colors={['#0EA5E9', '#10B981'] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientCard}
        >
            <View style={styles.gradientCardContent}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.gradientCardLabel}>FAMILY HEALTH STATUS</Text>
                    <Text style={styles.gradientCardTitle}>
                        {allGood ? 'All Systems Go' : `${criticalCount + warningCount} Items Need Attention`}
                    </Text>

                    {nextDue ? (
                        <View style={styles.gradientCardSubtitleRow}>
                            <IconSymbol android_material_icon_name="event" ios_icon_name="calendar" size={16} color="#E0F2FE" />
                            <Text style={styles.gradientCardSubtitle}>
                                Next: {nextDue.title} • {new Date(nextDue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.gradientCardSubtitle}>No upcoming tasks</Text>
                    )}

                    <TouchableOpacity
                        style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                        onPress={() => router.push('/(tabs)/calendar' as any)}
                    >
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', fontFamily: 'Plus Jakarta Sans' }}>View Calendar</Text>
                        <IconSymbol android_material_icon_name="arrow-forward" ios_icon_name="arrow.right" size={14} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.verifiedIconBox, !allGood && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <IconSymbol
                        android_material_icon_name={allGood ? "verified-user" : "warning"}
                        ios_icon_name={allGood ? "checkmark.shield.fill" : "exclamationmark.triangle.fill"}
                        size={32}
                        color={allGood ? "#0EA5E9" : "#F87171"}
                    />
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
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    gradientCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    gradientCardLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#E0F2FE',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: 'Plus Jakarta Sans',
    },
    gradientCardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        fontFamily: 'Plus Jakarta Sans',
        lineHeight: 32,
    },
    gradientCardSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    gradientCardSubtitle: {
        fontSize: 14,
        color: '#E0F2FE',
        fontFamily: 'Plus Jakarta Sans',
    },
    verifiedIconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
});
