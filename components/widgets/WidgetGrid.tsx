import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

interface WidgetGridProps {
    children: React.ReactNode;
}

/**
 * 2-column grid layout for widgets on mobile
 * Full width on desktop
 */
export default function WidgetGrid({ children }: WidgetGridProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    if (!isMobile) {
        // Desktop: render children as-is (existing layout)
        return <>{children}</>;
    }

    // Mobile: wrap in 2-column grid
    return (
        <View style={styles.gridContainer}>
            {React.Children.map(children, (child) => (
                <View style={styles.gridItem}>{child}</View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: 16,
    },
    gridItem: {
        width: '48%', // 2 columns with gap
        minWidth: 150,
    },
});
