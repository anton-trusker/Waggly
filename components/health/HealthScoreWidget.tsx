import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

interface HealthScoreWidgetProps {
    score: number; // 0-100
    isLoading?: boolean;
}

export function HealthScoreWidget({ score, isLoading = false }: HealthScoreWidgetProps) {
    // Simple color mapping based on score
    const getScoreColor = (s: number) => {
        if (s >= 80) return ['#22c55e', '#16a34a']; // Green
        if (s >= 50) return ['#eab308', '#ca8a04']; // Yellow
        if (s > 0) return ['#ef4444', '#dc2626']; // Red
        return ['#9ca3af', '#6b7280']; // Gray
    };

    const colors = getScoreColor(score);
    const label = score >= 80 ? 'Excellent' : score >= 50 ? 'Good' : score > 0 ? 'Needs Attention' : 'No Data';

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loading]}>
                <Text>Loading Health Score...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.scoreCircle}>
                    <LinearGradient
                        colors={colors}
                        style={styles.gradientBorder}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.innerCircle}>
                            <Text style={[styles.scoreText, { color: colors[1] }]}>{score}</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.infoCol}>
                    <Text style={styles.label}>Health Score</Text>
                    <Text style={[styles.statusText, { color: colors[1] }]}>{label}</Text>
                    <Text style={[styles.statusText, { color: colors[1] }]}>{label}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    loading: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    scoreCircle: {
        width: 100,
        height: 100,
    },
    gradientBorder: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        padding: 8, // Thicker border
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 36,
        fontWeight: '800',
    },
    infoCol: {
        flex: 1,
        gap: 4,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusText: {
        fontSize: 24,
        fontWeight: '700',
    },
    detailsBtn: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailsBtnText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
});
