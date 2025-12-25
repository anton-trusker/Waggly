import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface QuickAction {
    id: string;
    label: string;
    icon: string;
    colors: string[];
    route: string;
}

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'visit',
        label: 'Book Visit',
        icon: 'calendar',
        colors: ['#6366F1', '#818CF8'],
        route: '/web/pets/visit/new',
    },
    {
        id: 'vaccine',
        label: 'Add Vaccine',
        icon: 'fitness',
        colors: ['#0EA5E9', '#38BDF8'],
        route: '/web/pets/vaccination/new',
    },
    {
        id: 'meds',
        label: 'Add Meds',
        icon: 'medical',
        colors: ['#10B981', '#34D399'],
        route: '/web/pets/treatment/new',
    },
    {
        id: 'weight',
        label: 'Add Weight',
        icon: 'scale',
        colors: ['#F59E0B', '#FBBF24'],
        route: '/web/pets/weight/log',
    },
    {
        id: 'photo',
        label: 'Add Photo',
        icon: 'camera',
        colors: ['#EC4899', '#F472B6'],
        route: '/web/pets/photos/add',
    },
];

const QuickActionsGrid: React.FC = () => {
    const router = useRouter();

    const handleAction = (action: QuickAction) => {
        router.push(action.route as any);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Quick Actions</Text>
            <View style={styles.grid}>
                {QUICK_ACTIONS.map((action) => (
                    <Pressable
                        key={action.id}
                        accessibilityRole="button"
                        focusable
                        onPress={() => handleAction(action)}
                        style={({ hovered, focused }) => [
                            styles.actionCard,
                            hovered && styles.actionCardHover,
                            focused && styles.actionCardFocus
                        ]}
                    >
                        <LinearGradient
                            colors={action.colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconContainer}
                        >
                            <IconSymbol
                                android_material_icon_name={
                                    action.id === 'visit' ? 'event' :
                                    action.id === 'vaccine' ? 'vaccines' :
                                    action.id === 'meds' ? 'medication' :
                                    action.id === 'weight' ? 'monitor_weight' :
                                    'add-a-photo'
                                }
                                size={24}
                                color="#fff"
                            />
                        </LinearGradient>
                        <Text style={styles.label}>{action.label}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
        fontFamily: 'Plus Jakarta Sans',
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    actionCard: {
        alignItems: 'center',
        minWidth: 100,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderRadius: 12,
    },
    actionCardHover: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    actionCardFocus: {
        borderWidth: 2,
        borderColor: '#6366F1',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans',
    },
});

export default QuickActionsGrid;
