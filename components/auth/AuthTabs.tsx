import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { designSystem } from '@/constants/designSystem';

interface AuthTabsProps {
    activeTab: 'signin' | 'signup';
}

export function AuthTabs({ activeTab }: AuthTabsProps) {
    const router = useRouter();

    const handlePress = (tab: 'signin' | 'signup') => {
        if (tab === activeTab) return;

        if (tab === 'signin') {
            router.replace('/(auth)/login');
        } else {
            router.replace('/(auth)/signup');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {/* Background Slider Indicator can be added here with LayoutAnimation or Reanimated if detailed animation is needed. 
            For now, simpler conditional styling. */}

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'signin' && styles.activeTab] as any}
                    onPress={() => handlePress('signin')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, activeTab === 'signin' && styles.activeTabText]}>
                        Sign In
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'signup' && styles.activeTab] as any}
                    onPress={() => handlePress('signup')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        alignItems: 'center',
        width: '100%',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: designSystem.borderRadius.lg,
        padding: 4,
        width: '100%',
        maxWidth: 320, // Limit width for better aesthetic
    },
    tab: {
        flex: 1,
        paddingVertical: 12, // Taller touch target
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: designSystem.borderRadius.md,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary, // Darker for better visibility
        fontFamily: 'Plus Jakarta Sans',
    },
    activeTabText: {
        color: designSystem.colors.primary[500], // Active color
        fontWeight: '700',
    },
});
