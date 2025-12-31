
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface QuickActionsGridProps {
    onActionPress: (actionId: string) => void;
}

export default function QuickActionsGrid({ onActionPress }: QuickActionsGridProps) {
    const actions = [
        {
            id: 'visit',
            label: 'Visit',
            icon: 'medical-services',
            iosIcon: 'cross.case.fill',
            colors: ['#4F46E5', '#818CF8'] // Indigo
        },
        {
            id: 'vaccine',
            label: 'Vaccine',
            icon: 'vaccines',
            iosIcon: 'syringe.fill',
            colors: ['#059669', '#34D399'] // Emerald
        },
        {
            id: 'meds',
            label: 'Meds',
            icon: 'medication',
            iosIcon: 'pills.fill',
            colors: ['#D946EF', '#F472B6'] // Fuchsia
        },
        {
            id: 'weight',
            label: 'Weight',
            icon: 'monitor-weight',
            iosIcon: 'scalemass.fill',
            colors: ['#F59E0B', '#FBBF24'] // Amber
        },
        {
            id: 'doc',
            label: 'Doc',
            icon: 'description',
            iosIcon: 'doc.fill',
            colors: ['#8B5CF6', '#A78BFA'] // Violet
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
                                size={28}
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
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    actionCard: {
        alignItems: 'center',
        gap: 8,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans',
    },
});
