
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePets } from '@/hooks/usePets';
import { usePriorityAlerts } from '@/hooks/usePriorityAlerts';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function HealthSnapshotWidget() {
    const { theme } = useAppTheme();
    const { pets, loading: petsLoading } = usePets();
    const { alerts, loading: alertsLoading } = usePriorityAlerts(7); // Next 7 days focus

    const criticalAlerts = alerts.filter(a => a.severity === 'high').length;
    const warningAlerts = alerts.filter(a => a.severity === 'medium').length;
    const totalAlerts = criticalAlerts + warningAlerts;

    const isLoading = petsLoading || alertsLoading;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#4F46E5', '#7C3AED'] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Family Health Snapshot</Text>
                        <Text style={styles.subtitle}>
                            {isLoading ? 'Updating...' : `Overview for ${pets.length} ${pets.length === 1 ? 'pet' : 'pets'}`}
                        </Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <IconSymbol android_material_icon_name="health-and-safety" ios_icon_name="heart.fill" size={24} color="#fff" />
                    </View>
                </View>

                <View style={styles.statsRow}>
                    {/* Status Card */}
                    <View style={styles.statItem}>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            {totalAlerts === 0 ? (
                                <IconSymbol android_material_icon_name="check-circle" ios_icon_name="checkmark.circle.fill" size={20} color="#4ADE80" />
                            ) : (
                                <IconSymbol android_material_icon_name="warning" ios_icon_name="exclamationmark.triangle.fill" size={20} color="#F87171" />
                            )}
                        </View>
                        <View>
                            <Text style={styles.statValue}>
                                {isLoading ? '-' : totalAlerts === 0 ? 'All Good' : `${totalAlerts} Action${totalAlerts !== 1 ? 's' : ''}`}
                            </Text>
                            <Text style={styles.statLabel}>Current Status</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Upcoming Card */}
                    <TouchableOpacity
                        style={styles.statItem}
                        onPress={() => router.push('/(tabs)/calendar' as any)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <IconSymbol android_material_icon_name="calendar-today" ios_icon_name="calendar" size={20} color="#60A5FA" />
                        </View>
                        <View>
                            <Text style={styles.statValue}>
                                {isLoading ? '-' : alerts.length}
                            </Text>
                            <Text style={styles.statLabel}>Upcoming (7d)</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    gradient: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Plus Jakarta Sans',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 16,
        padding: 16,
        backdropFilter: 'blur(10px)', // Web only support, safe to leave
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statIconBadge: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
        fontFamily: 'Plus Jakarta Sans',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginHorizontal: 16,
    },
});
