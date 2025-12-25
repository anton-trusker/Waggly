import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Breadcrumbs from './Breadcrumbs';

const Topbar: React.FC = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.topbar}>
                {/* Left: Breadcrumbs */}
                <View style={styles.leftSection}>
                    <Breadcrumbs />
                </View>

                {/* Right: Actions */}
                <View style={styles.actions}>
                    {/* Theme Toggle (Mock) */}
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="moon-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Notifications */}
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={20} color="#6B7280" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#f8fafc',
        zIndex: 10,
    },
    topbar: {
        height: 64,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    leftSection: {
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#F3F4F6',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 10,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#fff',
    },
});

export default Topbar;
