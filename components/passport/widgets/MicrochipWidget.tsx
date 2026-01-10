import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface MicrochipWidgetProps {
    microchipNumber?: string;
    microchipDate?: Date | null;
    onEdit?: () => void;
}

/**
 * Compact Microchip Widget
 * Displays microchip number and implantation date in a compact card format
 */
export default function MicrochipWidget({
    microchipNumber,
    microchipDate,
    onEdit,
}: MicrochipWidgetProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    const effectiveColors = isDark
        ? {
            background: designSystem.colors.background.tertiary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            icon: designSystem.colors.primary[400],
        }
        : {
            background: designSystem.colors.background.secondary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[200],
            icon: designSystem.colors.primary[500],
        };

    return (
        <View style={[styles.container, {
            backgroundColor: effectiveColors.background,
            borderColor: effectiveColors.border,
        }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="radio-outline" size={18} color={effectiveColors.icon} />
                    <Text style={[styles.title, { color: effectiveColors.text }]}>
                        Microchip
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
                {microchipNumber ? (
                    <>
                        <Text style={[styles.number, { color: effectiveColors.text }]}>
                            {microchipNumber}
                        </Text>
                        {microchipDate && (
                            <Text style={[styles.date, { color: effectiveColors.textSecondary }]}>
                                Implanted: {new Date(microchipDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Text>
                        )}
                    </>
                ) : (
                    <Text style={[styles.empty, { color: effectiveColors.textSecondary }]}>
                        No microchip recorded
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
    number: {
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'monospace',
        letterSpacing: 0.5,
    },
    date: {
        fontSize: 12,
    },
    empty: {
        fontSize: 13,
        fontStyle: 'italic',
    },
});
