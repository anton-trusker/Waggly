import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

interface CalendarHeaderProps {
    viewMode: 'timeline' | 'month';
    onChangeMode: (mode: 'timeline' | 'month') => void;
    onFilterPress: () => void;
}

export default function CalendarHeader({ viewMode, onChangeMode, onFilterPress }: CalendarHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Text style={styles.title}>Calendar</Text>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={onFilterPress}>
                        <Ionicons name="filter" size={24} color="#1E293B" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.toggleContainer}>
                <TouchableOpacity 
                    style={[styles.toggleButton, viewMode === 'timeline' && styles.activeToggle]}
                    onPress={() => onChangeMode('timeline')}
                >
                    <Text style={[styles.toggleText, viewMode === 'timeline' && styles.activeToggleText]}>Timeline</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.toggleButton, viewMode === 'month' && styles.activeToggle]}
                    onPress={() => onChangeMode('month')}
                >
                    <Text style={[styles.toggleText, viewMode === 'month' && styles.activeToggleText]}>Month</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        fontFamily: Platform.select({ ios: 'Plus Jakarta Sans', android: 'PlusJakartaSans-Bold', default: 'System' }),
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeToggle: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        fontFamily: Platform.select({ ios: 'Plus Jakarta Sans', android: 'PlusJakartaSans-SemiBold', default: 'System' }),
    },
    activeToggleText: {
        color: '#3B82F6',
    },
});
