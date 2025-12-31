import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface QuickAction {
    id: string;
    label: string;
    icon: string;
    iosIcon: string;
    colors: string[];
    route?: string;
}

// Using designSystem constants directly for the static definition, 
// but we could also memoize this inside the component if we needed dynamic theme switching for these colors 
// (though gradients are usually distinct).
const getQuickActions = (theme: typeof designSystem): QuickAction[] => [
    {
        id: 'visit',
        label: 'Book Visit',
        icon: 'calendar_today',
        iosIcon: 'calendar',
        colors: [theme.colors.primary[500], theme.colors.primary[400]],
    },
    {
        id: 'vaccine',
        label: 'Add Vaccine',
        icon: 'vaccines',
        iosIcon: 'syringe', // or cross.vial
        colors: [theme.colors.secondary.leaf, theme.colors.secondary.leafLight], // Cyan/Teal-ish
    },
    {
        id: 'meds',
        label: 'Add Meds',
        icon: 'medication',
        iosIcon: 'pills',
        colors: [theme.colors.status.success[500], theme.colors.status.success[400]],
    },
    {
        id: 'weight',
        label: 'Add Weight',
        icon: 'monitor_weight',
        iosIcon: 'scalemass',
        colors: [theme.colors.status.warning[500], theme.colors.status.warning[400]],
    },
    {
        id: 'photo',
        label: 'Add Photo',
        icon: 'add_a_photo',
        iosIcon: 'camera',
        colors: [theme.colors.secondary.paw, theme.colors.secondary.pawLight], // Pink/Red-ish
    },
];

interface QuickActionsGridProps {
    onActionPress?: (id: string) => void;
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onActionPress }) => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { theme } = useAppTheme();
    const isMobile = width < 768; // Tablet breakdown

    const actions = getQuickActions(theme);

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
            <LinearGradient
                colors={action.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.iconContainer, isMobile && styles.iconContainerMobile]}
            >
                <IconSymbol
                    android_material_icon_name={action.icon as any}
                    ios_icon_name={action.iosIcon as any}
                    size={isMobile ? 22 : 28}
                    color="#fff"
                />
            </LinearGradient>
            <Text style={[styles.label, { color: theme.colors.text.primary }, isMobile && styles.labelMobile]}>
                {action.label}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Quick Actions</Text>
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
        marginBottom: 32,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        fontFamily: 'Plus Jakarta Sans',
    },
    grid: {
        flexDirection: 'row',
        gap: 24, // Increased gap for desktop
        flexWrap: 'wrap',
    },
    scrollContent: {
        gap: 12,
        paddingRight: 16,
    },
    actionCard: {
        alignItems: 'center',
        minWidth: 100,
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 16,
    },
    actionCardMobile: {
        minWidth: 80,
        paddingVertical: 0,
    },
    actionCardHover: {
        transform: [{ scale: 1.05 }],
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    actionCardFocus: {
        // focus styles
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#6366F1', // Indigo shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainerMobile: {
        width: 64,
        height: 64,
        borderRadius: 20,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Plus Jakarta Sans',
    },
    labelMobile: {
        fontSize: 12,
    },
});

export default QuickActionsGrid;
