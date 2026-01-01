import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBox, SkeletonCircle } from '../ui/SkeletonLoader';

export const PetProfileSkeleton: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Passport Card Skeleton */}
            <View style={styles.passportCard}>
                <View style={styles.topRow}>
                    <SkeletonCircle size={80} />
                    <View style={styles.nameSection}>
                        <SkeletonBox width={150} height={24} style={{ marginBottom: 8 }} />
                        <SkeletonBox width={100} height={16} />
                    </View>
                </View>

                <View style={styles.infoGrid}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.infoBox}>
                            <SkeletonBox width={60} height={12} style={{ marginBottom: 8 }} />
                            <SkeletonBox width="100%" height={16} />
                        </View>
                    ))}
                </View>
            </View>

            {/* Quick Actions Skeleton */}
            <View style={styles.actionsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={styles.actionItem}>
                        <SkeletonCircle size={64} style={{ marginBottom: 8 }} />
                        <SkeletonBox width={60} height={12} />
                    </View>
                ))}
            </View>

            {/* Content Cards Skeleton */}
            <View style={styles.contentGrid}>
                <View style={styles.leftColumn}>
                    <View style={styles.card}>
                        <SkeletonBox width={120} height={20} style={{ marginBottom: 16 }} />
                        <SkeletonBox width="100%" height={16} style={{ marginBottom: 8 }} />
                        <SkeletonBox width="80%" height={16} style={{ marginBottom: 8 }} />
                        <SkeletonBox width="60%" height={16} />
                    </View>
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.card}>
                        <SkeletonBox width={140} height={20} style={{ marginBottom: 16 }} />
                        {[1, 2, 3].map((i) => (
                            <View key={i} style={styles.listItem}>
                                <SkeletonBox width="100%" height={14} style={{ marginBottom: 4 }} />
                                <SkeletonBox width="70%" height={12} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        gap: 16,
    },
    passportCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    nameSection: {
        flex: 1,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    infoBox: {
        flex: 1,
        minWidth: 100,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 8,
    },
    actionItem: {
        alignItems: 'center',
    },
    contentGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    leftColumn: {
        flex: 1,
    },
    rightColumn: {
        flex: 2,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    listItem: {
        marginBottom: 12,
    },
});
