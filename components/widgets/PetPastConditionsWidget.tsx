import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PetPastConditionsWidget() {
    // Mock data for now - can be prop-driven later
    const conditions = [
        { id: '1', title: 'Otitis Externa', date: 'Oct 2023', description: 'Resolved with drops.' },
        { id: '2', title: 'Mild Gastroenteritis', date: 'Feb 2023', description: 'Dietary indiscretion.' },
    ];

    return (
        <View style={styles.card}>
            <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Past Conditions</Text>
            <View style={styles.timelineList}>
                {conditions.map((condition, index) => (
                    <View key={condition.id} style={styles.timelineItem}>
                        {index < conditions.length - 1 && <View style={styles.timelineLine} />}
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContentBox}>
                            <View style={styles.timelineHeaderRow}>
                                <Text style={styles.timelineItemTitle}>{condition.title}</Text>
                                <View style={styles.timelineDateBadge}>
                                    <Text style={styles.timelineDateBadgeText}>{condition.date}</Text>
                                </View>
                            </View>
                            <Text style={styles.timelineItemDesc}>{condition.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    timelineList: {
        gap: 16,
    },
    timelineItem: {
        position: 'relative',
        paddingLeft: 32,
    },
    timelineLine: {
        position: 'absolute',
        left: 7,
        top: 20,
        bottom: -16,
        width: 2,
        backgroundColor: '#E5E7EB',
    },
    timelineDot: {
        position: 'absolute',
        left: 0,
        top: 8,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#9CA3AF',
        borderWidth: 3,
        borderColor: '#fff',
    },
    timelineContentBox: {
        flex: 1,
    },
    timelineHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    timelineItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    timelineDateBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    timelineDateBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
    },
    timelineItemDesc: {
        fontSize: 13,
        color: '#6B7280',
    },
});
