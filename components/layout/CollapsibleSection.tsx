import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    initialExpanded?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    rightAction?: React.ReactNode;
}

export default function CollapsibleSection({
    title,
    children,
    initialExpanded = true,
    icon,
    rightAction,
}: CollapsibleSectionProps) {
    const [expanded, setExpanded] = useState(initialExpanded);
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const effectiveColors = isDark
        ? {
            text: designSystem.colors.text.primary,
            icon: designSystem.colors.primary[400],
            border: designSystem.colors.neutral[700],
        }
        : {
            text: designSystem.colors.text.primary,
            icon: designSystem.colors.primary[500],
            border: designSystem.colors.neutral[200],
        };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.header, { borderBottomColor: expanded ? effectiveColors.border : 'transparent' }] as any}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.headerLeft}>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={20}
                            color={effectiveColors.icon}
                            style={styles.icon}
                        />
                    )}
                    <Text style={[styles.title, { color: effectiveColors.text }]}>
                        {title.toUpperCase()}
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={designSystem.colors.text.tertiary}
                    />
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={[
                    styles.content,
                    // Add padding if expanded, helps visually
                    { marginTop: designSystem.spacing[2] }
                ]}>
                    {children}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: designSystem.spacing[4],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: designSystem.spacing[2],
        marginBottom: designSystem.spacing[1],
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: designSystem.spacing[2],
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightAction: {
        marginRight: designSystem.spacing[3],
    },
    content: {
        // Content container
    },
});
