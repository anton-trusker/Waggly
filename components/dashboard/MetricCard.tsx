
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: string; // Material icon name
    iconColor?: string;
    trend?: {
        value: string;
        direction: 'up' | 'down' | 'neutral';
    };
    onPress?: () => void;
}

export default function MetricCard({ title, value, icon, iconColor, trend, onPress }: MetricCardProps) {
    const { theme } = useAppTheme();

    return (
        <View style={[styles.container, { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.secondary }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: (iconColor || theme.colors.primary[500]) + '15' }]}>
                    <IconSymbol
                        android_material_icon_name={icon as any}
                        size={20}
                        color={iconColor || theme.colors.primary[500]}
                    />
                </View>
                {trend && (
                    <View style={[
                        styles.trendBadge,
                        { backgroundColor: trend.direction === 'up' ? '#DCFCE7' : trend.direction === 'down' ? '#FEE2E2' : '#F3F4F6' }
                    ]}>
                        <IconSymbol
                            android_material_icon_name={trend.direction === 'up' ? 'trending-up' : trend.direction === 'down' ? 'trending-down' : 'remove'}
                            size={14}
                            color={trend.direction === 'up' ? '#16A34A' : trend.direction === 'down' ? '#DC2626' : '#6B7280'}
                        />
                        <Text style={[
                            styles.trendText,
                            { color: trend.direction === 'up' ? '#16A34A' : trend.direction === 'down' ? '#DC2626' : '#6B7280' }
                        ]}>
                            {trend.value}
                        </Text>
                    </View>
                )}
            </View>

            <Text style={[styles.value, { color: theme.colors.text.primary }]}>{value}</Text>
            <Text style={[styles.title, { color: theme.colors.text.secondary }]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        minWidth: 140,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        fontFamily: 'Plus Jakarta Sans',
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    }
});
