import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Insight } from '@/hooks/useInsights';
import { designSystem } from '@/constants/designSystem';

interface SmartInsightsWidgetProps {
    insights: Insight[];
    onDismiss?: (id: string) => void;
    onInsightPress?: (insight: Insight) => void;
}

export default function SmartInsightsWidget({
    insights,
    onDismiss,
    onInsightPress,
}: SmartInsightsWidgetProps) {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const scrollViewRef = useRef<ScrollView>(null);

    const handleInsightAction = (insight: Insight) => {
        switch (insight.actionType) {
            case 'navigate':
                if (insight.actionData?.route) {
                    router.push(insight.actionData.route);
                }
                break;
            case 'modal':
                // Modal handling would be done by parent component
                onInsightPress?.(insight);
                break;
            case 'external':
                // External link handling
                if (insight.actionData?.url) {
                    // Would open in browser
                    console.log('Open external:', insight.actionData.url);
                }
                break;
        }
    };

    const getSeverityIcon = (severity: Insight['severity']) => {
        switch (severity) {
            case 'critical':
                return 'warning';
            case 'warning':
                return 'alert-circle';
            case 'info':
                return 'information-circle';
        }
    };

    if (insights.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>💡 Smart Insights</Text>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>✨</Text>
                    <Text style={styles.emptyTitle}>All Clear!</Text>
                    <Text style={styles.emptySubtitle}>No insights or recommendations at this time</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>💡 Smart Insights</Text>
                    {insights.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{insights.length}</Text>
                        </View>
                    )}
                </View>
                {insights.length > 3 && (
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All →</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={isMobile ? width - 80 : 340}
                snapToAlignment="start"
                decelerationRate="fast"
            >
                {insights.map((insight, index) => (
                    <TouchableOpacity
                        key={insight.id}
                        style={[
                            styles.insightCard,
                            {
                                backgroundColor: insight.backgroundColor,
                                borderColor: insight.color,
                                width: isMobile ? width - 80 : 320,
                                marginRight: index === insights.length - 1 ? 0 : 16,
                            },
                        ]}
                        onPress={() => handleInsightAction(insight)}
                        activeOpacity={0.8}
                    >
                        {/* Dismiss button */}
                        {insight.dismissible && (
                            <TouchableOpacity
                                style={styles.dismissButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onDismiss?.(insight.id);
                                }}
                            >
                                <Ionicons name="close" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        )}

                        {/* Severity indicator */}
                        <View style={styles.severityRow}>
                            <View style={[styles.severityBadge, { backgroundColor: insight.color }]}>
                                <Ionicons
                                    name={getSeverityIcon(insight.severity) as any}
                                    size={14}
                                    color="#fff"
                                />
                            </View>
                            <Text style={[styles.severityText, { color: insight.color }]}>
                                {insight.severity.toUpperCase()}
                            </Text>
                        </View>

                        {/* Icon */}
                        <View style={[styles.iconContainer, { backgroundColor: `${insight.color}20` }]}>
                            <IconSymbol
                                android_material_icon_name={insight.icon as any}
                                size={32}
                                color={insight.color}
                            />
                        </View>

                        {/* Content */}
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                        <Text style={styles.insightDescription}>{insight.description}</Text>

                        {/* Pet info if applicable */}
                        {insight.petName && (
                            <View style={styles.petInfo}>
                                <Ionicons name="paw" size={12} color="#6B7280" />
                                <Text style={styles.petName}>{insight.petName}</Text>
                            </View>
                        )}

                        {/* Action button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: insight.color }]}
                            onPress={() => handleInsightAction(insight)}
                        >
                            <Text style={styles.actionButtonText}>{insight.actionLabel}</Text>
                            <Ionicons name="arrow-forward" size={14} color="#fff" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Pagination dots */}
            {insights.length > 1 && !isMobile && (
                <View style={styles.pagination}>
                    {insights.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === 0 && styles.paginationDotActive,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    countBadge: {
        backgroundColor: '#8B5CF6',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
    seeAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8B5CF6',
        fontFamily: 'Plus Jakarta Sans',
    },
    scrollContent: {
        paddingBottom: 8,
    },
    insightCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        position: 'relative',
        minHeight: 200,
    },
    dismissButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    severityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    severityBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    severityText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        fontFamily: 'Plus Jakarta Sans',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    insightTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        fontFamily: 'Plus Jakarta Sans',
    },
    insightDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 16,
        fontFamily: 'Plus Jakarta Sans',
    },
    petInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
    },
    petName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginTop: 'auto',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D1D5DB',
    },
    paginationDotActive: {
        width: 20,
        backgroundColor: '#8B5CF6',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
    },
});
