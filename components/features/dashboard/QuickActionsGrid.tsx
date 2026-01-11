
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocale } from '@/hooks/useLocale';
import { designSystem } from '@/constants/designSystem';

interface QuickActionsGridProps {
    onActionPress: (actionId: string) => void;
}

export default function QuickActionsGrid({ onActionPress }: QuickActionsGridProps) {
    const { t } = useLocale();

    const actions = [
        {
            id: 'visit',
            label: t('widgets.quick_actions.visit'),
            icon: 'medical-services',
            iosIcon: 'cross.case.fill',
            // Indigo
            colors: [designSystem.colors.primary[500], designSystem.colors.primary[400]]
        },
        {
            id: 'vaccine',
            label: t('widgets.quick_actions.vaccine'),
            icon: 'vaccines',
            iosIcon: 'syringe.fill',
            // Emerald (Success)
            colors: [designSystem.colors.success[600], designSystem.colors.success[400]]
        },
        {
            id: 'meds',
            label: t('widgets.quick_actions.meds'),
            icon: 'medication',
            iosIcon: 'pills.fill',
            // Fuchsia/Pink (Secondary)
            colors: [designSystem.colors.secondary.pawDark, designSystem.colors.secondary.paw]
        },
        {
            id: 'weight',
            label: 'Health Record',
            icon: 'favorite',
            iosIcon: 'heart.text.square.fill',
            // Amber (Warning)
            colors: [designSystem.colors.warning[600], designSystem.colors.warning[400]]
        },
        {
            id: 'doc',
            label: t('widgets.quick_actions.doc'),
            icon: 'description',
            iosIcon: 'doc.fill',
            // Violet (using primary 600/700 variant or custom) - using primary darkest for contrast
            colors: [designSystem.colors.primary[700], designSystem.colors.primary[600]]
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {actions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={[styles.actionCard]}
                        onPress={() => onActionPress(action.id)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={action.colors as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconContainer}
                        >
                            <IconSymbol
                                android_material_icon_name={action.icon as any}
                                ios_icon_name={action.iosIcon as any}
                                size={26}
                                color="#fff"
                            />
                        </LinearGradient>
                        <Text style={styles.label}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: designSystem.spacing[6],
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        gap: designSystem.spacing[4],
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    actionCard: {
        alignItems: 'center',
        gap: designSystem.spacing[2],
        minWidth: 70,
        flex: 0,
    },
    iconContainer: {
        width: 56, // Standard touch target
        height: 56,
        borderRadius: designSystem.borderRadius.xl, // Squircle
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: designSystem.colors.neutral[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    label: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
    },
});


