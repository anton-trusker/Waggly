import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, ScrollView } from 'react-native';
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
        icon: 'calendar_today',
        colors: ['#6366F1', '#818CF8'],
        route: '/web/pets/visit/new',
    },
    {
        id: 'vaccine',
        label: 'Add Vaccine',
        icon: 'vaccines',
        colors: ['#0EA5E9', '#38BDF8'],
        route: '/web/pets/vaccination/new',
    },
    {
        id: 'meds',
        label: 'Add Meds',
        icon: 'medication',
        colors: ['#10B981', '#34D399'],
        route: '/web/pets/treatment/new',
    },
    {
        id: 'weight',
        label: 'Add Weight',
        icon: 'monitor_weight',
        colors: ['#F59E0B', '#FBBF24'],
        route: '/web/pets/weight/log',
    },
    {
        id: 'photo',
        label: 'Add Photo',
        icon: 'add_a_photo',
        colors: ['#EC4899', '#F472B6'],
        route: '/web/pets/photos/add',
    },
];

const QuickActionsGrid: React.FC = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const handleAction = (action: QuickAction) => {
        router.push(action.route as any);
    };

    const ActionItem = ({ action }: { action: QuickAction }) => (
        <Pressable
            key={action.id}
            accessibilityRole="button"
            focusable
            onPress={() => handleAction(action)}
            style={({ hovered, focused }: any) => [
                styles.actionCard,
                isMobile && styles.actionCardMobile,
                hovered && styles.actionCardHover,
                focused && styles.actionCardFocus
            ]}
        >
            <LinearGradient
                colors={action.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.iconContainer, isMobile && styles.iconContainerMobile]}
            >
                <IconSymbol
                    android_material_icon_name={action.icon as any}
                    size={isMobile ? 20 : 24}
                    color="#fff"
                />
            </LinearGradient>
            <Text style={[styles.label, isMobile && styles.labelMobile]}>{action.label}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Quick Actions</Text>
            {isMobile ? (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                >
                    {QUICK_ACTIONS.map((action) => (
                        <ActionItem key={action.id} action={action} />
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.grid}>
                    {QUICK_ACTIONS.map((action) => (
                        <ActionItem key={action.id} action={action} />
                    ))}
                </View>
            )}
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
    scrollContent: {
        gap: 12,
        paddingRight: 16,
    },
    actionCard: {
        alignItems: 'center',
        minWidth: 100,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderRadius: 12,
    },
    actionCardMobile: {
        minWidth: 80,
        paddingVertical: 0,
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
    iconContainerMobile: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans',
    },
    labelMobile: {
        fontSize: 12,
    },
});

export default QuickActionsGrid;
