import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GorhomBottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    snapPoints?: (string | number)[];
    title?: string;
    children: React.ReactNode;
    enablePanDownToClose?: boolean;
    index?: number;
}

/**
 * Bottom Sheet wrapper component using @gorhom/bottom-sheet
 * Provides native iOS/Android modal experience with smooth animations
 * 
 * @example
 * ```typescript
 * const { visible, open, close } = useBottomSheet();
 * 
 * <BottomSheet 
 *   visible={visible} 
 *   onClose={close}
 *   title="Add Medication"
 * >
 *   <YourFormContent />
 * </BottomSheet>
 * ```
 */
export default function BottomSheet({
    visible,
    onClose,
    snapPoints = ['50%', '90%'],
    title,
    children,
    enablePanDownToClose = true,
    index = 0,
}: BottomSheetProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const bottomSheetRef = useRef<GorhomBottomSheet>(null);

    // Memoize snap points
    const snapPointsArray = useMemo(() => snapPoints, [snapPoints]);

    // Handle sheet changes
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    // Render backdrop
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
            />
        ),
        []
    );

    // Don't render if not visible
    if (!visible) return null;

    return (
        <GorhomBottomSheet
            ref={bottomSheetRef}
            index={index}
            snapPoints={snapPointsArray}
            onChange={handleSheetChanges}
            enablePanDownToClose={enablePanDownToClose}
            backdropComponent={renderBackdrop}
            backgroundStyle={[
                styles.background,
                { backgroundColor: isDark ? designSystem.colors.background.secondary : designSystem.colors.neutral[0] },
            ] as any}
            handleIndicatorStyle={[
                styles.indicator,
                { backgroundColor: isDark ? designSystem.colors.neutral[600] : designSystem.colors.neutral[300] },
            ] as any}
        >
            <BottomSheetView style={styles.content}>
                {/* Header */}
                {title && (
                    <View style={styles.header}>
                        <Text style={[styles.title, isDark && styles.titleDark]}>
                            {title}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <IconSymbol
                                ios_icon_name="xmark"
                                android_material_icon_name="close"
                                size={24}
                                color={designSystem.colors.text.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Content */}
                <View style={styles.body}>
                    {children}
                </View>
            </BottomSheetView>
        </GorhomBottomSheet>
    );
}

const styles = StyleSheet.create({
    background: {
        borderTopLeftRadius: designSystem.borderRadius.xl,
        borderTopRightRadius: designSystem.borderRadius.xl,
    },
    indicator: {
        width: 40,
        height: 4,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: designSystem.spacing[6],
        paddingVertical: designSystem.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    title: {
        ...designSystem.typography.title.large,
        color: designSystem.colors.text.primary,
        flex: 1,
    },
    titleDark: {
        color: designSystem.colors.text.primary,
    },
    closeButton: {
        padding: designSystem.spacing[2],
    },
    body: {
        flex: 1,
        paddingHorizontal: designSystem.spacing[6],
        paddingTop: designSystem.spacing[4],
    },
});
