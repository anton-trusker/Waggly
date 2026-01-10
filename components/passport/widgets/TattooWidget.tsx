import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface TattooWidgetProps {
    tattooId?: string;
    onEdit?: () => void;
}

/**
 * Compact Tattoo Widget
 * Displays tattoo ID for pet identification
 */
export default function TattooWidget({
    tattooId,
    onEdit,
}: TattooWidgetProps) {
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
                    <Ionicons name="finger-print" size={18} color={effectiveColors.icon} />
                    <Text style={[styles.title, { color: effectiveColors.text }]}>
                        Tattoo ID
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
                {tattooId ? (
                    <>
                        <Text style={[styles.tattooId, { color: effectiveColors.text }]}>
                            {tattooId}
                        </Text>
                        <Text style={[styles.helper, { color: effectiveColors.textSecondary }]}>
                            Usually in ear or inner thigh
                        </Text>
                    </>
                ) : (
                    <Text style={[styles.empty, { color: effectiveColors.textSecondary }]}>
                        No tattoo recordedNo tattoo recorded
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
    tattooId: {
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'monospace',
        letterSpacing: 0.5,
    },
    helper: {
        fontSize: 11,
    },
    empty: {
        fontSize: 13,
        fontStyle: 'italic',
    },
});
