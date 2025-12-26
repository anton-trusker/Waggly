import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, useWindowDimensions } from 'react-native';
import DesktopSidebar from '@/components/layout/DesktopSidebar';

interface ResponsivePageWrapperProps {
    children: React.ReactNode;
    showSidebar?: boolean;
    scrollable?: boolean;
    style?: ViewStyle;
}

/**
 * Responsive page wrapper that:
 * - Shows sidebar on desktop (>= 1024px)
 * - Hides sidebar on mobile/tablet
 * - Applies consistent padding and spacing
 */
export default function ResponsivePageWrapper({
    children,
    showSidebar = true,
    scrollable = true,
    style,
}: ResponsivePageWrapperProps) {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const containerPadding = width < 768 ? 16 : width < 1024 ? 24 : 40;

    const content = scrollable ? (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.content, { padding: containerPadding }, style]}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.content, { padding: containerPadding }, style]}>
            {children}
        </View>
    );

    // Desktop: Show sidebar + content
    if (isDesktop && showSidebar) {
        return (
            <View style={styles.desktopContainer}>
                <DesktopSidebar />
                <View style={styles.desktopContent}>
                    {content}
                </View>
            </View>
        );
    }

    // Mobile/Tablet or no sidebar: Just content
    return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    desktopContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
    },
    desktopContent: {
        flex: 1,
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
    },
});
