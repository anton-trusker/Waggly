
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


import CategoryIcon from '@/components/ui/CategoryIcon';
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
            icon: 'medkit-outline',
            materialIcon: 'medical-services', // Valid Material
        },
        {
            id: 'vaccine',
            label: t('widgets.quick_actions.vaccine'),
            icon: 'medical-outline',
            materialIcon: 'vaccines', // Valid Material
        },
        {
            id: 'meds',
            label: t('widgets.quick_actions.meds'),
            icon: 'medical-outline',
            materialIcon: 'medication', // Valid Material
        },
        {
            id: 'weight',
            label: 'Health Record',
            icon: 'heart-outline',
            materialIcon: 'monitor-weight', // Valid Material
        },
        {
            id: 'doc',
            label: t('widgets.quick_actions.doc'),
            icon: 'document-text-outline',
            materialIcon: 'description', // Valid Material
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {actions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={styles.actionCard}
                        onPress={() => onActionPress(action.id)}
                        activeOpacity={0.8}
                    >
                        <CategoryIcon
                            icon={action.icon as any}
                            materialIconName={(action as any).materialIcon}
                            size={56}
                        />
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
    label: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.secondary,
        textAlign: 'center',
    },
});

