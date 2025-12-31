import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAppTheme } from '@/hooks/useAppTheme';

interface QuickAction {
    id: string;
    label: string;
    icon: string;
    iosIcon: string;
    color: string;
    bgColor: string;
    route?: string;
}

const getQuickActions = (): QuickAction[] => [
    {
        id: 'visit',
        label: 'Visit',
        icon: 'calendar-today',
        iosIcon: 'calendar',
        color: '#2563EB',
        bgColor: '#DBEAFE',
    },
    {
        id: 'vaccine',
        label: 'Vaccine',
        icon: 'vaccines',
        iosIcon: 'syringe',
        color: '#DB2777',
        bgColor: '#FCE7F3',
    },
    {
        id: 'meds',
        label: 'Meds',
        icon: 'medication',
        iosIcon: 'pills',
        color: '#9333EA',
        bgColor: '#F3E8FF',
    },
    {
        id: 'weight',
        label: 'Weight',
        icon: 'monitor-weight',
        iosIcon: 'scalemass',
        color: '#059669',
        bgColor: '#D1FAE5',
    },
    {
        id: 'doc',
        label: 'Doc',
        icon: 'note-add',
        iosIcon: 'doc.text',
        color: '#EA580C',
        bgColor: '#FFEDD5',
        route: '/(tabs)/pets/documents/add',
    },
];

interface QuickActionsGridProps {
    onActionPress?: (id: string) => void;
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onActionPress }) => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { theme } = useAppTheme();
    const isMobile = width < 768;

    const actions = getQuickActions();

    const handleAction = (action: QuickAction) => {
        if (onActionPress) {
            onActionPress(action.id);
        } else if (action.route) {
            router.push(action.route as any);
        }
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
            <View
                style={[styles.iconContainer, { backgroundColor: action.bgColor }]}
            >
                <IconSymbol
                    android_material_icon_name={action.icon as any}
                    ios_icon_name={action.iosIcon as any}
                    size={24}
                    color={action.color}
                />
            </View>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
                {action.label}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {/* Heading removed to be more compact or integrated if needed? 
                User didn't strictly say remove heading, but on Profile it just shows the buttons.
                Dashboard has "Quick Actions" heading usually.
                I will keep heading for Dashboard but maybe make it optional? 
                Actually, I'll keep it for now as it structures the section.
            */}
            {/* <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Quick Actions</Text> */}

            {isMobile ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {actions.map((action) => (
                        <ActionItem key={action.id} action={action} />
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.grid}>
                    {actions.map((action) => (
                        <ActionItem key={action.id} action={action} />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginTop: 10, // User request: add +10px padding top
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
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
        minWidth: 80,
        gap: 8,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    actionCardMobile: {
        minWidth: 70,
    },
    actionCardHover: {
        opacity: 0.8,
        transform: [{ scale: 1.02 }],
    },
    actionCardFocus: {
    },
    iconContainer: {
        width: 48, // Compact size
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans',
    },
});

export default QuickActionsGrid;
