import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePets } from '@/hooks/usePets';

export default function Breadcrumbs() {
    const router = useRouter();
    const segments = useSegments();
    const pathname = usePathname();
    const { pets } = usePets();

    // Don't show on dashboard root
    if (pathname === '/web/dashboard' || segments.length <= 2) return null;

    const getBreadcrumbs = () => {
        // Filter out 'web', '(auth)', etc.
        const relevantSegments = segments.filter(
            s => !['web', '(auth)', '(app)', 'index'].includes(s)
        );

        let pathAccumulator = '/web';

        return relevantSegments.map((segment, index) => {
            pathAccumulator += `/${segment}`;

            let label = segment.charAt(0).toUpperCase() + segment.slice(1);

            // Handle IDs
            if (segment.length > 20 || !isNaN(Number(segment))) {
                const pet = pets.find(p => p.id === segment);
                label = pet ? pet.name : '...'; // Show name or loading placeholder
            }

            // Handle known segments
            if (segment === 'add') label = 'Add New';
            
            // Handle "pets" segment specifically if needed, but Title Case "Pets" is fine.

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
                <Text style={styles.crumbText}>Home</Text>
            </TouchableOpacity>

            {breadcrumbs.map((crumb, index) => (
                <View key={crumb.path} style={styles.crumbContainer}>
                    <Text style={styles.separator}>{'>'}</Text>
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
    separator: {
        color: '#9CA3AF',
        fontSize: 14,
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
