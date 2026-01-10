import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface WeightWidgetProps {
    weight?: number;
    weightUnit?: 'kg' | 'lbs';
    idealWeightMin?: number;
    idealWeightMax?: number;
    onEdit?: () => void;
}

/**
 * Compact Weight Widget
 * Displays current weight with ideal weight range indicator
 */
export default function WeightWidget({
    weight,
    weightUnit = 'kg',
    idealWeightMin,
    idealWeightMax,
    onEdit,
}: WeightWidgetProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    const effectiveColors = isDark
        ? {
            background: designSystem.colors.background.tertiary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            icon: designSystem.colors.primary[400],
            success: designSystem.colors.success[400],
            warning: designSystem.colors.warning[400],
        }
        : {
            background: designSystem.colors.background.secondary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[200],
            icon: designSystem.colors.primary[500],
            success: designSystem.colors.success[500],
            warning: designSystem.colors.warning[500],
        };

    // Determine if weight is in ideal range
    const isInRange = weight && idealWeightMin && idealWeightMax
        ? weight >= idealWeightMin && weight <= idealWeightMax
        : undefined;

    return (
        <View style={[styles.container, {
            backgroundColor: effectiveColors.background,
            borderColor: effectiveColors.border,
        }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="scale-outline" size={18} color={effectiveColors.icon} />
                    <Text style={[styles.title, { color: effectiveColors.text }]}>
                        Weight
                    </Text>
                </View>
                {onEdit && (
                    <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="create-outline" size={18} color={effectiveColors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                {weight ? (
                    <>
                        <View style={styles.weightRow}>
                            <Text style={[styles.weight, { color: effectiveColors.text }]}>
                                {weight} {weightUnit}
                            </Text>
                            {isInRange !== undefined && (
                                <Ionicons
                                    name={isInRange ? "checkmark-circle" : "alert-circle"}
                                    size={20}
                                    color={isInRange ? effectiveColors.success : effectiveColors.warning}
                                />
                            )}
                        </View>
                        {idealWeightMin && idealWeightMax && (
                            <Text style={[styles.range, { color: effectiveColors.textSecondary }]}>
                                Ideal: {idealWeightMin}-{idealWeightMax} {weightUnit}
                            </Text>
                        )}
                    </>
                ) : (
                    <Text style={[styles.empty, { color: effectiveColors.textSecondary }]}>
                        Weight not recorded
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: designSystem.borderRadius.lg,
        padding: designSystem.spacing[4],
        borderWidth: 1,
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: designSystem.spacing[3],
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        gap: designSystem.spacing[1],
    },
    weightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[2],
    },
    weight: {
        fontSize: 20,
        fontWeight: '700',
    },
    range: {
        fontSize: 12,
    },
    empty: {
        fontSize: 13,
        fontStyle: 'italic',
    },
});
