import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePriorityAlerts } from '@/hooks/usePriorityAlerts';

const PriorityAlertsPanel: React.FC = () => {
    const router = useRouter();
    const { alerts, loading } = usePriorityAlerts(30);

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                    <Text style={styles.heading}>Priority Alerts</Text>
                </View>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (alerts.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                    <Text style={styles.heading}>All Clear</Text>
                </View>
                <Text style={styles.emptyText}>No urgent items at this time</Text>
            </View>
        );
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return '#EF4444';
            case 'medium': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                <Text style={styles.heading}>Priority Alerts</Text>
            </View>

            <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
                {alerts.slice(0, 5).map((alert) => (
                    <View key={alert.id} style={styles.alertCard}>
                        <View style={styles.alertHeader}>
                            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(alert.severity) }]} />
                            <View style={styles.alertInfo}>
                                <Text style={styles.alertTitle}>{alert.title}</Text>
                                <Text style={styles.alertDescription}>{alert.description}</Text>
                                <Text style={styles.alertTime}>
                                    {alert.daysRemaining === 0
                                        ? 'Due today'
                                        : `${alert.daysRemaining} ${alert.daysRemaining === 1 ? 'day' : 'days'} remaining`
                                    }
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push(alert.actionUrl as any)}
                        >
                            <Text style={styles.actionButtonText}>{alert.actionLabel}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    loadingText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: 20,
    },
    alertsList: {
        maxHeight: 400,
    },
    alertCard: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    alertHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    severityBadge: {
        width: 4,
        borderRadius: 2,
    },
    alertInfo: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    alertDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    alertTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    actionButton: {
        backgroundColor: '#6366F1',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
});

export default PriorityAlertsPanel;
