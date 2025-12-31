
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function DashboardTimeline() {
    const { theme } = useAppTheme();
    const { activities, loading } = useActivityFeed(5); // Get top 5 recent

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return time.toLocaleDateString();
    };

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'weight': return { icon: 'monitor-weight', color: '#059669', bg: '#D1FAE5' };
            case 'visit': return { icon: 'medical-services', color: '#2563EB', bg: '#DBEAFE' };
            case 'vaccination': return { icon: 'vaccines', color: '#9333EA', bg: '#F3E8FF' };
            case 'treatment': return { icon: 'healing', color: '#DC2626', bg: '#FEE2E2' };
            default: return { icon: 'pets', color: '#6B7280', bg: '#F3F4F6' };
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#fff', borderColor: theme.colors.border.primary }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>History & Activity</Text>

            <View style={styles.list}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading activity...</Text>
                ) : activities.length === 0 ? (
                    <Text style={styles.emptyText}>No recent activity recorded.</Text>
                ) : (
                    activities.map((item, index) => {
                        const styleInfo = getIconInfo(item.type);
                        const isLast = index === activities.length - 1;

                        return (
                            <View key={item.id} style={styles.item}>
                                {/* Timeline Line */}
                                {!isLast && <View style={styles.timelineLine} />}

                                {/* Icon Dot */}
                                <View style={[styles.dot, { backgroundColor: styleInfo.bg }]}>
                                    <IconSymbol
                                        android_material_icon_name={styleInfo.icon as any}
                                        size={14}
                                        color={styleInfo.color}
                                    />
                                </View>

                                {/* Content */}
                                <View style={styles.content}>
                                    <View style={styles.row}>
                                        <View style={styles.titleGroup}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            {item.petPhotoUrl && (
                                                <Image source={{ uri: item.petPhotoUrl }} style={styles.petAvatar} />
                                            )}
                                        </View>
                                        <Text style={styles.time}>{getTimeAgo(item.timestamp)}</Text>
                                    </View>

                                    <Text style={styles.description}>{item.description}</Text>

                                    {/* Data Preview (e.g. weight) */}
                                    {item.type === 'weight' && item.data && (
                                        <View style={styles.dataBadge}>
                                            <Text style={styles.dataText}>
                                                {item.data.weight} {item.data.unit}
                                                {item.data.change && (
                                                    <Text style={{ color: item.data.change > 0 ? '#10B981' : '#EF4444' }}>
                                                        {' '}({item.data.change > 0 ? '+' : ''}{item.data.change})
                                                    </Text>
                                                )}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </View>

            <TouchableOpacity style={styles.footerBtn}>
                <Text style={[styles.footerBtnText, { color: theme.colors.primary[500] }]}>View Full Timeline</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        marginBottom: 24,
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 24,
        fontFamily: 'Plus Jakarta Sans',
    },
    list: {

    },
    item: {
        flexDirection: 'row',
        paddingBottom: 24, // Spacing for line
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        top: 24,
        left: 12, // Center of dot (24/2)
        bottom: 0,
        width: 2,
        backgroundColor: '#F3F4F6',
    },
    dot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        zIndex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 2, // Align with dot
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    titleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        fontFamily: 'Plus Jakarta Sans',
    },
    petAvatar: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    time: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Plus Jakarta Sans',
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
        fontFamily: 'Plus Jakarta Sans',
    },
    dataBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dataText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        fontFamily: 'monspace', // Fallback
    },
    loadingText: {
        fontStyle: 'italic',
        color: '#9CA3AF',
        padding: 12,
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#9CA3AF',
        padding: 12,
    },
    footerBtn: {
        marginTop: 8,
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerBtnText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
});
