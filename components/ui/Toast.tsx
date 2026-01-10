import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import { ToastMessage } from '@/types/toast';

interface ToastProps {
    toasts: ToastMessage[];
    onDismiss: (id: string) => void;
}

const TOAST_WIDTH_WEB = 380;

export default function Toast({ toasts, onDismiss }: ToastProps) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View
            style={[
                styles.container,
                {
                    top: insets.top + (Platform.OS === 'ios' ? 0 : 20),
                    left: isMobile ? 20 : undefined,
                    right: isMobile ? 20 : 20,
                    width: isMobile ? undefined : TOAST_WIDTH_WEB,
                    pointerEvents: 'box-none' as any,
                },
                !isMobile && styles.desktopPosition
            ]}
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </View>
    );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        // Enter animation
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start();

        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.id, toast.duration]);

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(translateY, {
                toValue: -20,
                duration: 200,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start(() => onDismiss(toast.id));
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'warning';
            case 'info': return 'information-circle';
            default: return 'information-circle';
        }
    };

    const getColor = () => {
        switch (toast.type) {
            case 'success': return designSystem.colors.status.success[500];
            case 'error': return designSystem.colors.status.error[500];
            case 'warning': return designSystem.colors.status.warning[500];
            case 'info': return designSystem.colors.primary[500];
            default: return designSystem.colors.primary[500];
        }
    };

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    borderLeftColor: getColor(),
                    opacity,
                    transform: [{ translateY }]
                }
            ]}
        >
            <View style={styles.content}>
                <Ionicons name={getIcon()} size={24} color={getColor()} style={styles.icon} />
                <View style={styles.textContainer}>
                    {toast.title && <Text style={styles.title}>{toast.title}</Text>}
                    <Text style={styles.message}>{toast.message}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={designSystem.colors.text.tertiary} />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 9999,
        gap: 10,
    },
    desktopPosition: {
        right: 30,
        left: undefined,
    },
    toast: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        ...designSystem.shadows.md,
        borderLeftWidth: 4,
        minHeight: 60,
        marginBottom: 10,
    },
    content: {
        flexDirection: 'row',
        flex: 1,
        gap: 12,
    },
    icon: {
        marginTop: 2,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
        marginBottom: 2,
    },
    message: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
        marginTop: -4,
    },
});
