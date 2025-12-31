/**
 * Shared form styles for consistent form layouts across the app
 */
import { StyleSheet } from 'react-native';

// Light theme form colors
export const formColors = {
    inputBackground: '#FFFFFF',
    inputBorder: '#E5E7EB',
    inputBorderFocus: '#607AFB',
    inputText: '#1F2937',
    inputPlaceholder: '#9CA3AF',
    labelText: '#374151',
    errorText: '#EF4444',
    errorBorder: '#EF4444',
    errorBackground: '#FEF2F2',
    sectionBackground: '#F9FAFB',
    cardBackground: '#FFFFFF',
    inactiveIcon: '#F3F4F6',
    inactiveIconBorder: '#E5E7EB',
    inactiveText: '#6B7280',
};

export const formStyles = StyleSheet.create({
    // Container styles
    formContent: {
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 8,
    },

    // Card styles
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        gap: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    // Input styles - Light theme
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    labelRequired: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputFocused: {
        borderColor: '#607AFB',
        shadowColor: '#607AFB',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        color: '#9CA3AF',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 4,
    },
    helpText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },

    // Textarea / Multiline
    textarea: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minHeight: 100,
        textAlignVertical: 'top',
    },

    // Row layouts
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    thirdWidth: {
        flex: 1,
    },

    // Button rows
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },

    // Chips and Tags
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    chipActive: {
        backgroundColor: '#607AFB',
        borderColor: '#607AFB',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },
    chipTextActive: {
        color: '#FFFFFF',
    },

    // Selector buttons (provider type, urgency, etc.)
    selectorRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    selectorButton: {
        flex: 1,
        minWidth: 80,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    selectorButtonActive: {
        borderWidth: 2,
    },
    selectorText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    selectorTextActive: {
        fontWeight: '700',
    },

    // Icon selector (for provider types)
    iconSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    iconSelectorItem: {
        alignItems: 'center',
        minWidth: 72,
    },
    iconSelectorIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        borderWidth: 2,
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
    },
    iconSelectorIconActive: {
        borderWidth: 2,
    },
    iconSelectorLabel: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        color: '#6B7280',
    },
    iconSelectorLabelActive: {
        fontWeight: '600',
    },

    // Repeat/Action buttons
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#607AFB',
    },

    // Date picker row
    datePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 10,
    },
    datePickerText: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
    },
    datePickerPlaceholder: {
        color: '#9CA3AF',
    },
});

export default formStyles;
