import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { designSystem } from '@/constants/designSystem';

interface ResponsiveWidgetGridProps {
    children: React.ReactNode;
}

/**
 * Responsive Widget Grid Component
 * 
 * Automatically arranges child widgets into responsive columns:
 * - Desktop (>= 1024px): 3 columns
 * - Tablet (768-1023px): 2 columns
 * - Mobile (< 768px): 1 column
 * 
 * Usage:
 * <ResponsiveWidgetGrid>
 *   <MicrochipWidget />
 *   <TattooWidget />
 *   <BloodTypeWidget />
 * </ResponsiveWidgetGrid>
 */
export default function ResponsiveWidgetGrid({ children }: ResponsiveWidgetGridProps) {
    const { width } = useWindowDimensions();

    // Determine column count based on viewport width
    const getColumns = () => {
        if (width >= 1024) return 3; // Desktop
        if (width >= 768) return 2;  // Tablet
        return 1;                     // Mobile
    };

    const columns = getColumns();
    const gap = designSystem.spacing[4]; // 16px

    return (
        <View style={[
            styles.grid,
            {
                gap,
                // Use flexDirection: 'row' with flexWrap for automatic grid behavior
                flexDirection: 'row',
                flexWrap: 'wrap',
            }
        ]}>
            {React.Children.map(children, (child, index) => {
                if (!child) return null;

                // Calculate width for each child based on columns
                // Account for gaps between columns
                const columnWidth = columns === 1
                    ? '100%'
                    : columns === 2
                        ? `calc(50% - ${gap / 2}px)`
                        : `calc(33.333% - ${(gap * 2) / 3}px)`;

                return (
                    <View
                        key={index}
                        style={{
                            width: columnWidth,
                            minWidth: columns === 1 ? '100%' : columns === 2 ? '48%' : '31%',
                        }}
                    >
                        {child}
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        width: '100%',
    },
});
