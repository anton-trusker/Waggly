import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBox, SkeletonCircle } from '../ui/SkeletonLoader';

export const PetCardSkeleton: React.FC = () => {
    return (
        <View style={styles.card}>
            {/* Pet Image */}
            <View style={styles.imageRow}>
                <SkeletonCircle size={64} />
                <View style={styles.nameSection}>
                    <SkeletonBox width={120} height={20} style={{ marginBottom: 8 }} />
                    <SkeletonBox width={80} height={16} />
                </View>
            </View>

            {/* Info Grid */}
            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <SkeletonBox width={60} height={12} style={{ marginBottom: 6 }} />
                    <SkeletonBox width={80} height={16} />
                </View>
                <View style={styles.infoItem}>
                    <SkeletonBox width={60} height={12} style={{ marginBottom: 6 }} />
                    <SkeletonBox width={80} height={16} />
                </View>
            </View>

            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <SkeletonBox width={60} height={12} style={{ marginBottom: 6 }} />
                    <SkeletonBox width={80} height={16} />
                </View>
                <View style={styles.infoItem}>
                    <SkeletonBox width={60} height={12} style={{ marginBottom: 6 }} />
                    <SkeletonBox width={80} height={16} />
                </View>
            </View>

            {/* Action Button */}
            <View style={styles.actionRow}>
                <SkeletonBox width="100%" height={40} borderRadius={8} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    imageRow: {
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
        gap: 16,
        marginBottom: 12,
    },
    infoItem: {
        flex: 1,
    },
    actionRow: {
        marginTop: 16,
    },
});
