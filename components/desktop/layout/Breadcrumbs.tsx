import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Breadcrumbs() {
    const router = useRouter();
    const segments = useSegments();
    const pathname = usePathname();

    // Don't show on dashboard root
    if (pathname === '/web/dashboard' || segments.length <= 2) return null;

    const getBreadcrumbs = () => {
        // Basic mapping logic - in a real app this would look up titles
        // For now we just prettify the segments

        // Filter out 'web', '(auth)', etc.
        const relevantSegments = segments.filter(
            s => !['web', '(auth)', '(app)', 'index'].includes(s)
        );

        let pathAccumulator = '/web';

        return relevantSegments.map((segment, index) => {
            pathAccumulator += `/${segment}`;

            let label = segment.charAt(0).toUpperCase() + segment.slice(1);

            // Handle IDs (simplified detection)
            if (segment.length > 20 || !isNaN(Number(segment))) {
                label = 'Details'; // Or look up pet name in context/store
            }

            // Handle known segments
            if (segment === 'add') label = 'Add New';

            return {
                label,
                path: pathAccumulator,
                isLast: index === relevantSegments.length - 1
            };
        });
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => router.push('/web/dashboard')}
                style={styles.homeButton}
            >
                <Ionicons name="home-outline" size={16} color="#6B7280" />
            </TouchableOpacity>

            {breadcrumbs.map((crumb, index) => (
                <View key={crumb.path} style={styles.crumbContainer}>
                    <Ionicons name="chevron-forward" size={12} color="#D1D5DB" />
                    <TouchableOpacity
                        onPress={() => !crumb.isLast && router.push(crumb.path as any)}
                        disabled={crumb.isLast}
                        style={styles.crumbButton}
                    >
                        <Text style={[styles.crumbText, crumb.isLast && styles.crumbTextActive]}>
                            {crumb.label}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 12,
        gap: 8,
    },
    homeButton: {
        padding: 4,
    },
    crumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    crumbButton: {
        padding: 2,
    },
    crumbText: {
        fontSize: 14,
        color: '#6B7280',
    },
    crumbTextActive: {
        color: '#111827',
        fontWeight: '600',
    },
});
