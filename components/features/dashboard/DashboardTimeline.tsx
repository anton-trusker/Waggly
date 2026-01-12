import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { designSystem } from '@/constants/designSystem';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardTimeline() {
    const { theme } = useAppTheme();
    const { t } = useLocale();
    const { activities, loading } = useActivityFeed(5);

    const getTimeFormatted = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return formatDistanceToNow(date, { addSuffix: true }).replace('about ', '');
        } catch (e) {
            return '';
        }
    };

    const getIconInfo = (type: string) => {
        switch (type) {
            case 'weight':
                return {
                    icon: 'monitor-weight',
                    iosIcon: 'scalemass.fill',
                    color: designSystem.colors.status.warning[600],
                    bg: designSystem.colors.status.warning[50],
                    borderColor: designSystem.colors.background.secondary
                };
            case 'visit':
                return {
                    icon: 'medical-services',
                    iosIcon: 'cross.case.fill',
                    color: designSystem.colors.primary[600],
                    bg: designSystem.colors.primary[50], // Indigo/Blue
                    borderColor: designSystem.colors.background.secondary
                };
            case 'vaccination':
                return {
                    icon: 'vaccines',
                    iosIcon: 'syringe.fill',
                    color: designSystem.colors.status.error[600],
                    bg: designSystem.colors.status.error[50],
                    borderColor: designSystem.colors.background.secondary
                };
            case 'treatment':
                return {
                    icon: 'healing',
                    iosIcon: 'pills.fill',
                    color: designSystem.colors.primary[600], // Mapped to Primary since Info is missing
                    bg: designSystem.colors.primary[50],
                    borderColor: designSystem.colors.background.secondary
                };
            case 'walking':
            case 'activity':
                return {
                    icon: 'directions-walk',
                    iosIcon: 'figure.walk',
                    color: designSystem.colors.status.success[600], // Emerald
                    bg: designSystem.colors.status.success[50],
                    borderColor: designSystem.colors.background.secondary
                };
            case 'document':
                return {
                    icon: 'article',
                    iosIcon: 'doc.text.fill',
                    color: designSystem.colors.secondary[500],
                    bg: designSystem.colors.secondary[50],
                    borderColor: designSystem.colors.background.secondary
                };
            default:
                return {
                    icon: 'pets',
                    iosIcon: 'pawprint.fill',
                    color: designSystem.colors.neutral[500],
                    bg: designSystem.colors.neutral[100],
                    borderColor: designSystem.colors.background.secondary
                };
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Activity Feed</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <IconSymbol
                        android_material_icon_name="tune"
                        ios_icon_name="slider.horizontal.3"
                        size={20}
                        color={designSystem.colors.text.secondary}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.list}>
                {loading ? (
                    <Text style={styles.loadingText}>{t('dashboard.loading_activity')}</Text>
                ) : activities.length === 0 ? (
                    <Text style={styles.emptyText}>{t('dashboard.no_recent_activity')}</Text>
                ) : (
                    activities.map((item, index) => {
                        const styleInfo = getIconInfo(item.type);
                        const isLast = index === activities.length - 1;

                        return (
                            <View key={item.id} style={styles.timelineItem}>
                                {/* Line */}
                                {!isLast && <View style={styles.line} />}

                                {/* Icon Bubble */}
                                <View style={[styles.iconBubble, { backgroundColor: styleInfo.bg, borderColor: styleInfo.borderColor }]}>
                                    <IconSymbol
                                        android_material_icon_name={styleInfo.icon as any}
                                        ios_icon_name={styleInfo.iosIcon as any}
                                        size={14}
                                        color={styleInfo.color}
                                    />
                                </View>

                                {/* Content */}
                                <View style={styles.contentContainer}>
                                    <View style={styles.row}>
                                        <Text style={styles.title}>{item.title}</Text>
                                        <Text style={styles.time}>{getTimeFormatted(item.timestamp)}</Text>
                                    </View>

                                    <View style={styles.descriptionRow}>
                                        <Text style={styles.description}>
                                            {item.description}
                                            {item.petName && <Text style={styles.petName}> • {item.petName}</Text>}
                                        </Text>
                                    </View>

                                    {/* Rich Data Preview (e.g. weight delta) */}
                                    {item.type === 'weight' && item.data && (
                                        <View style={styles.dataCard}>
                                            {item.petPhotoUrl ? (
                                                <Image source={{ uri: item.petPhotoUrl }} style={styles.petAvatar} />
                                            ) : (
                                                <View style={styles.petAvatarPlaceholder}>
                                                    <IconSymbol android_material_icon_name="pets" size={12} color={designSystem.colors.primary[300]} />
                                                </View>
                                            )}
                                            <View>
                                                <Text style={styles.dataValue}>
                                                    {item.data.weight} {item.data.unit}
                                                    {item.data.change !== undefined && (
                                                        <Text style={{
                                                            color: item.data.change > 0 ? designSystem.colors.status.success[600] :
                                                                item.data.change < 0 ? designSystem.colors.status.success[600] : // Weight loss is usually good for pets? Or bad? Let's assume neutral green for change.
                                                                    designSystem.colors.text.secondary
                                                        }}>
                                                            {' '}({item.data.change > 0 ? '+' : ''}{item.data.change})
                                                        </Text>
                                                    )}
                                                </Text>
                                                <Text style={styles.dataLabel}>{item.petName}</Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Document Preview */}
                                    {item.type === 'document' && (
                                        <TouchableOpacity style={styles.documentCard}>
                                            <View style={styles.pdfIcon}>
                                                <IconSymbol android_material_icon_name="description" ios_icon_name="doc.text.fill" size={20} color={designSystem.colors.status.error[500]} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.docName} numberOfLines={1}>{item.title}</Text>
                                                <Text style={styles.docSize}>PDF • 2 MB</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </View>

            <TouchableOpacity style={styles.footerBtn}>
                <Text style={styles.footerBtnText}>View All Activity</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius.xl,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        ...designSystem.shadows.sm as any,
        flex: 1, // Expand to fill column
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: designSystem.spacing[6],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.border.primary,
    },
    headerTitle: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.text.primary,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    list: {
        padding: designSystem.spacing[6],
        flex: 1,
    },
    timelineItem: {
        flexDirection: 'row',
        position: 'relative',
        paddingBottom: designSystem.spacing[6],
    },
    line: {
        position: 'absolute',
        top: 24,
        left: 12, // Center of 24px bubble
        bottom: 0,
        width: 2,
        backgroundColor: designSystem.colors.neutral[100],
        zIndex: 0,
    },
    iconBubble: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: designSystem.spacing[4],
        zIndex: 1,
        borderWidth: 2, // Thicker border like reference
        backgroundColor: '#fff', // Fallback
    },
    contentContainer: {
        flex: 1,
        paddingTop: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    title: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.primary,
        fontWeight: '600',
    },
    time: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
    },
    descriptionRow: {
        marginBottom: designSystem.spacing[2],
    },
    description: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.secondary,
        lineHeight: 18,
    },
    petName: {
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    // Data Card (Weight etc)
    dataCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.background.primary, // Greyish
        padding: designSystem.spacing[3],
        borderRadius: designSystem.borderRadius.lg,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        gap: designSystem.spacing[3],
        marginTop: 4,
    },
    petAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    petAvatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: designSystem.colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataValue: {
        ...designSystem.typography.body.medium,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    dataLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: designSystem.colors.text.tertiary,
        textTransform: 'uppercase',
    },
    // Document Card
    documentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.background.secondary,
        padding: designSystem.spacing[2],
        borderRadius: designSystem.borderRadius.lg,
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        marginTop: 4,
        gap: designSystem.spacing[3],
    },
    pdfIcon: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: designSystem.colors.status.error[50], // Red bg
        alignItems: 'center',
        justifyContent: 'center',
    },
    docName: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.primary,
    },
    docSize: {
        ...designSystem.typography.label.small,
        fontSize: 10,
    },
    footerBtn: {
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.border.primary,
        padding: designSystem.spacing[4],
        alignItems: 'center',
    },
    footerBtnText: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.primary[500],
        fontWeight: '600',
    },
    loadingText: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    emptyText: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
