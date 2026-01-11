import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';

interface MobileCalendarHeaderProps {
    currentView: 'timeline' | 'calendar';
    onViewChange: (view: 'timeline' | 'calendar') => void;
    onFilterPress: () => void;
    onAddEventPress?: () => void;
    hasActiveFilters?: boolean;
}

export default function MobileCalendarHeader({
    currentView,
    onViewChange,
    onFilterPress,
    onAddEventPress,
    hasActiveFilters = false,
}: MobileCalendarHeaderProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.controls}>
                {/* View Toggle */}
                <View style={styles.viewToggle}>
                    <TouchableOpacity
                        style={[
                            styles.viewButton,
                            styles.viewButtonLeft,
                            currentView === 'timeline' && styles.viewButtonActive
                        ] as any}
                        onPress={() => onViewChange('timeline')}
                    >
                        <IconSymbol
                            ios_icon_name="list.bullet"
                            android_material_icon_name="view-list"
                            size={18}
                            color={currentView === 'timeline' ? designSystem.colors.neutral[0] : designSystem.colors.text.secondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.viewButton,
                            styles.viewButtonRight,
                            currentView === 'calendar' && styles.viewButtonActive
                        ] as any}
                        onPress={() => onViewChange('calendar')}
                    >
                        <IconSymbol
                            ios_icon_name="calendar"
                            android_material_icon_name="calendar-month"
                            size={18}
                            color={currentView === 'calendar' ? designSystem.colors.neutral[0] : designSystem.colors.text.secondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Filter Button */}
                <TouchableOpacity
                    style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive] as any}
                    onPress={onFilterPress}
                >
                    <IconSymbol
                        ios_icon_name="line.3.horizontal.decrease.circle"
                        android_material_icon_name="filter-list"
                        size={20}
                        color={hasActiveFilters ? designSystem.colors.primary[500] : designSystem.colors.text.secondary}
                    />
                    {hasActiveFilters && <View style={styles.filterBadge} />}
                </TouchableOpacity>

                {/* Add Event Button */}
                {onAddEventPress && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddEventPress}
                    >
                        <IconSymbol
                            ios_icon_name="plus"
                            android_material_icon_name="add"
                            size={20}
                            color={designSystem.colors.neutral[0] as any}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: designSystem.colors.neutral[0],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    logo: {
        width: 32,
        height: 32,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 8,
        overflow: 'hidden',
    },
    viewButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewButtonLeft: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    viewButtonRight: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    viewButtonActive: {
        backgroundColor: designSystem.colors.primary[500],
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: designSystem.colors.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    filterButtonActive: {
        backgroundColor: `${designSystem.colors.primary[500]}15`,
    },
    filterBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: designSystem.colors.primary[500],
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: designSystem.colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
});
