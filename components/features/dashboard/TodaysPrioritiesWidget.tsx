import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { Priority } from '@/hooks/usePriorities';
import { designSystem } from '@/constants/designSystem';

interface TodaysPrioritiesWidgetProps {
    priorities: Priority[];
    onComplete?: (id: string) => void;
    onItemPress?: (priority: Priority) => void;
}

export default function TodaysPrioritiesWidget({
    priorities,
    onComplete,
    onItemPress,
}: TodaysPrioritiesWidgetProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < designSystem.breakpoints.tablet;

    const getUrgencyGradient = (urgency: Priority['urgency']) => {
        switch (urgency) {
            case 'critical':
                return [designSystem.colors.status.error[50], designSystem.colors.status.error[100]];
            case 'high':
                return [designSystem.colors.status.warning[50], designSystem.colors.status.warning[100]];
            case 'medium':
                return [designSystem.colors.primary[50], designSystem.colors.primary[100]];
            default:
                return [designSystem.colors.neutral[50], designSystem.colors.neutral[100]];
        }
    };

    const getUrgencyColor = (urgency: Priority['urgency']) => {
        switch (urgency) {
            case 'critical':
                return designSystem.colors.status.error[600];
            case 'high':
                return designSystem.colors.status.warning[700]; // 700 for better contrast on yellow
            case 'medium':
                return designSystem.colors.primary[600];
            default:
                return designSystem.colors.neutral[600];
        }
    };

    const getUrgencyIconColor = (urgency: Priority['urgency']) => {
        switch (urgency) {
            case 'critical':
                return designSystem.colors.status.error[500];
            case 'high':
                return designSystem.colors.status.warning[500];
            case 'medium':
                return designSystem.colors.primary[500];
            default:
                return designSystem.colors.neutral[500];
        }
    };

    if (priorities.length === 0) {
        return (
            <LinearGradient
                colors={[designSystem.colors.neutral[0], designSystem.colors.neutral[50]] as any}
                style={styles.container}
            >
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <Text style={styles.emptyIcon}>✨</Text>
                    </View>
                    <Text style={styles.emptyTitle}>All caught up!</Text>
                    <Text style={styles.emptySubtitle}>No priorities for today</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <View style={styles.containerWrapper}>
            <LinearGradient
                colors={[designSystem.colors.neutral[0], '#F8FAFF']} // Subtle blue tint from design
                style={styles.container}
            >
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <LinearGradient
                            colors={[designSystem.colors.primary[400], designSystem.colors.primary[600]] as any}
                            style={styles.iconBadge}
                        >
                            <Text style={styles.headerIcon}>🎯</Text>
                        </LinearGradient>
                        <View>
                            <Text style={styles.title}>Today's Priorities</Text>
                            <Text style={styles.subtitle}>{priorities.length} task{priorities.length > 1 ? 's' : ''} pending</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        {priorities.length > 0 && (
                            <LinearGradient
                                colors={[designSystem.colors.status.error[400], designSystem.colors.status.error[600]] as any}
                                style={styles.badge}
                            >
                                <Text style={styles.badgeText}>{priorities.length}</Text>
                            </LinearGradient>
                        )}
                        {isMobile && (
                            <TouchableOpacity
                                onPress={() => setCollapsed(!collapsed)}
                                style={styles.collapseButton}
                            >
                                <Ionicons
                                    name={collapsed ? 'chevron-down' : 'chevron-up'}
                                    size={20}
                                    color={designSystem.colors.neutral[500] as any}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {!collapsed && (
                    <ScrollView
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                    >
                        {priorities.slice(0, 5).map((priority, index) => (
                            <TouchableOpacity
                                key={priority.id}
                                style={styles.priorityItemWrapper}
                                onPress={() => onItemPress?.(priority)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={getUrgencyGradient(priority.urgency) as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.priorityItem}
                                >
                                    <TouchableOpacity
                                        style={styles.checkbox}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            onComplete?.(priority.id);
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.checkboxInner,
                                                priority.completed && styles.checkboxChecked,
                                            ] as any}
                                        >
                                            {priority.completed && (
                                                <Ionicons name="checkmark" size={16} color="#fff" />
                                            )}
                                        </View>
                                    </TouchableOpacity>

                                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                                        <IconSymbol
                                            android_material_icon_name={priority.icon as any}
                                            size={20}
                                            color={priority.color || getUrgencyIconColor(priority.urgency)}
                                        />
                                    </View>

                                    <View style={styles.content}>
                                        <Text style={[styles.priorityTitle, { color: getUrgencyColor(priority.urgency) }]}>
                                            {priority.title}
                                        </Text>
                                        <Text style={styles.priorityDescription}>
                                            {priority.description}
                                        </Text>
                                    </View>

                                    {priority.urgency === 'critical' && (
                                        <View style={styles.urgentBadge}>
                                            <Ionicons name="warning" size={16} color={designSystem.colors.status.error[600]} />
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    containerWrapper: {
        borderRadius: designSystem.borderRadius.xl,
        overflow: 'hidden',
        // Using shadow from designSystem.shadows.md, converted for this style object
        ...designSystem.shadows.md as any,
        backgroundColor: designSystem.colors.neutral[0], // Ensure bg for shadow
        elevation: 4, // Android shadow
    },
    container: {
        padding: designSystem.spacing[6],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: designSystem.spacing[5],
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[3.5],
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: designSystem.spacing[3],
    },
    iconBadge: {
        width: 52,
        height: 52,
        borderRadius: designSystem.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: designSystem.colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    headerIcon: {
        fontSize: 24,
    },
    title: {
        ...designSystem.typography.headline.small,
        fontSize: 20, // Override to match design spec
        color: designSystem.colors.text.primary,
    },
    subtitle: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
        marginTop: 2,
    },
    badge: {
        borderRadius: designSystem.borderRadius.full,
        paddingHorizontal: designSystem.spacing[3],
        paddingVertical: designSystem.spacing[1.5],
        minWidth: 32,
        alignItems: 'center',
        shadowColor: designSystem.colors.status.error[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeText: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.neutral[0],
        fontSize: 12,
    },
    collapseButton: {
        padding: designSystem.spacing[1.5],
    },
    list: {
        maxHeight: 340,
    },
    priorityItemWrapper: {
        marginBottom: designSystem.spacing[3.5],
    },
    priorityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: designSystem.spacing[4.5],
        borderRadius: designSystem.borderRadius.lg,
        gap: designSystem.spacing[3.5],
        // Subtle item shadow
        shadowColor: designSystem.colors.neutral[900],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    checkbox: {
        padding: 4,
    },
    checkboxInner: {
        width: 24,
        height: 24,
        borderRadius: designSystem.borderRadius.sm,
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[400],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: designSystem.colors.neutral[0],
    },
    checkboxChecked: {
        backgroundColor: designSystem.colors.success[500],
        borderColor: designSystem.colors.success[500],
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: designSystem.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: designSystem.colors.neutral[900],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    content: {
        flex: 1,
    },
    priorityTitle: {
        ...designSystem.typography.title.small,
        marginBottom: 2,
    },
    priorityDescription: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.secondary,
        lineHeight: 16,
    },
    urgentBadge: {
        padding: designSystem.spacing[2],
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: designSystem.borderRadius.md,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: designSystem.spacing[12],
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: designSystem.colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: designSystem.spacing[4],
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        ...designSystem.typography.headline.small,
        fontSize: 20,
        color: designSystem.colors.text.primary,
        marginBottom: designSystem.spacing[2],
    },
    emptySubtitle: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
    },
});
