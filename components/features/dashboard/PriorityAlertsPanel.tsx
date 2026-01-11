import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePriorityAlerts } from '@/hooks/usePriorityAlerts';
import { useAppTheme } from '@/hooks/useAppTheme';

const PriorityAlertsPanel: React.FC = () => {
    const router = useRouter();
    const { theme } = useAppTheme();
    const { alerts, loading } = usePriorityAlerts(30);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                <View style={styles.header}>
                    <IconSymbol
                        android_material_icon_name="warning"
                        ios_icon_name="exclamationmark.triangle"
                        size={20}
                        color={theme.colors.status.warning[500]}
                    />
                    <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Priority Alerts</Text>
                </View>
                <Text style={[styles.loadingText, { color: theme.colors.text.tertiary }]}>Loading...</Text>
            </View>
        );
    }

    if (alerts.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                <View style={styles.header}>
                    <IconSymbol
                        android_material_icon_name="check-circle"
                        ios_icon_name="checkmark.circle"
                        size={20}
                        color={theme.colors.status.success[500]}
                    />
                    <Text style={[styles.heading, { color: theme.colors.text.primary }]}>All Clear</Text>
                </View>
                <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>No urgent items at this time</Text>
            </View>
        );
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return theme.colors.status.error[500];
            case 'medium': return theme.colors.status.warning[500];
            default: return theme.colors.text.tertiary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
            <View style={styles.header}>
                <IconSymbol
                    android_material_icon_name="warning"
                    ios_icon_name="exclamationmark.triangle"
                    size={20}
                    color={theme.colors.status.warning[500]}
                />
                <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Priority Alerts</Text>
            </View>

            <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
                {alerts.slice(0, 5).map((alert) => (
                    <View
                        key={alert.id}
                        style={[
                            styles.alertCard,
                            {
                                backgroundColor: theme.colors.background.tertiary,
                                borderColor: theme.colors.border.primary
                            }
                        ]}
                    >
                        <View style={styles.alertHeader}>
                            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(alert.severity) }]} />
                            <View style={styles.alertInfo}>
                                <Text style={[styles.alertTitle, { color: theme.colors.text.primary }]}>{alert.title}</Text>
                                <Text style={[styles.alertDescription, { color: theme.colors.text.secondary }]}>{alert.description}</Text>
                                <Text style={[styles.alertTime, { color: theme.colors.text.tertiary }]}>
                                    {alert.daysRemaining === 0
                                        ? 'Due today'
                                        : `${alert.daysRemaining} ${alert.daysRemaining === 1 ? 'day' : 'days'} remaining`
                                    }
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.colors.primary[500] }]}
                            onPress={() => router.push(alert.actionUrl as any)}
                        >
                            <Text style={[styles.actionButtonText, { color: theme.colors.text.inverse }]}>{alert.actionLabel}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
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
        fontFamily: 'Plus Jakarta Sans',
    },
    loadingText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
        fontFamily: 'Plus Jakarta Sans',
    },
    alertsList: {
        maxHeight: 400,
    },
    alertCard: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
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
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    alertDescription: {
        fontSize: 13,
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    alertTime: {
        fontSize: 12,
        fontFamily: 'Plus Jakarta Sans',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
});

export default PriorityAlertsPanel;
