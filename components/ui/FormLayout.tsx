import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import { colors } from '@/styles/commonStyles';

/**
 * FormSection: Groups related fields with an optional title
 */
interface FormSectionProps {
    title?: string;
    children: ReactNode;
    style?: ViewStyle;
}

export function FormSection({ title, children, style }: FormSectionProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View style={[styles.section, { marginBottom: isMobile ? 24 : 32 }, style]}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            {children}
        </View>
    );
}

/**
 * FormRow: Responsive row that stacks on mobile, side-by-side on desktop
 */
interface FormRowProps {
    children: ReactNode;
    columns?: 2 | 3;
    gap?: number;
    style?: ViewStyle;
}

export function FormRow({ children, columns = 2, gap, style }: FormRowProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const defaultGap = isMobile ? 16 : 20;
    const actualGap = gap ?? defaultGap;

    return (
        <View
            style={[
                styles.row,
                {
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: actualGap,
                },
                style,
            ] as any}
        >
            {children}
        </View>
    );
}

/**
 * FormGrid: 2 or 3 column grid that adapts to screen size
 */
interface FormGridProps {
    children: ReactNode;
    columns?: 2 | 3;
    gap?: number;
    style?: ViewStyle;
}

export function FormGrid({ children, columns = 2, gap, style }: FormGridProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const defaultGap = isMobile ? 16 : 20;
    const actualGap = gap ?? defaultGap;

    return (
        <View
            style={[
                styles.grid,
                {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: actualGap,
                },
                style,
            ] as any}
        >
            {React.Children.map(children, (child) => (
                <View
                    style={{
                        width: isMobile
                            ? '100%'
                            : columns === 3
                                ? `calc(33.333% - ${(actualGap * 2) / 3}px)`
                                : `calc(50% - ${actualGap / 2}px)`,
                    }}
                >
                    {child}
                </View>
            ))}
        </View>
    );
}

/**
 * FormField: Wrapper for individual form fields with consistent spacing
 */
interface FormFieldProps {
    label?: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
    style?: ViewStyle;
}

export function FormField({ label, required, error, children, style }: FormFieldProps) {
    return (
        <View style={[styles.field, style]}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}
            {children}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        // marginBottom set dynamically
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    row: {
        // flexDirection and gap set dynamically
    },
    grid: {
        // flexDirection, flexWrap, and gap set dynamically
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
    },
    error: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
});
