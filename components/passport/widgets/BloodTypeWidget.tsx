import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface BloodTypeWidgetProps {
    bloodType?: string;
    onEdit?: () => void;
}

/**
 * Compact Blood Type Widget
 * Displays pet's blood type - critical for emergencies
 */
export default function BloodTypeWidget({
    bloodType,
    onEdit,
}: BloodTypeWidgetProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    const effectiveColors = isDark
        ? {
            background: designSystem.colors.background.tertiary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            icon: designSystem.colors.error[400],
            badge: designSystem.colors.error[900],
            badgeText: designSystem.colors.error[300],
        }
        : {
            background: designSystem.colors.background.secondary,
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[200],
            icon: designSystem.colors.error[500],
            badge: designSystem.colors.error[50],
            badgeText: designSystem.colors.error[700],
        };

    return (
        <View style={[styles.container, {
            backgroundColor: effectiveColors.background,
            borderColor: effectiveColors.border,
        }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Ionicons name="water" size={18} color={effectiveColors.icon} />
                    <Text style={[styles.title, { color: effectiveColors.text }]}>
                        Blood Type
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
                {bloodType ? (
                    <View style={styles.bloodTypeContainer}>
                        <View style={[styles.badge, { backgroundColor: effectiveColors.badge }]}>
                            <Text style={[styles.bloodType, { color: effectiveColors.badgeText }]}>
                                {bloodType}
                            </Text>
                        </View>
                        <Text style={[styles.helper, { color: effectiveColors.textSecondary }]}>
                            Important for emergencies
                        </Text>
                    </View>
                ) : (
                    <Text style={[styles.empty, { color: effectiveColors.textSecondary }]}>
                        Blood type not recorded
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
    bloodTypeContainer: {
        gap: designSystem.spacing[2],
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: designSystem.spacing[3],
        paddingVertical: designSystem.spacing[2],
        borderRadius: designSystem.borderRadius.md,
    },
    bloodType: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    helper: {
        fontSize: 11,
    },
    empty: {
        fontSize: 13,
        fontStyle: 'italic',
    },
});
