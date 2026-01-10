import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastContextType, ToastType } from '@/types/toast';
import Toast from '@/components/ui/Toast';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const hide = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const show = useCallback((message: string, options: { type?: ToastType; title?: string; duration?: number } = {}) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: ToastMessage = {
            id,
            message,
            type: options.type || 'info',
            title: options.title,
            duration: options.duration || 3000,
        };

        // For mobile, maybe only show one at a time? Or stack them?
        // Let's stack max 3 for now, or just replace if we want simple behavior.
        // Stacking is nicer.
        setToasts((prev) => [...prev, newToast]);

        // Auto hide logic handled in Toast component or here?
        // Better handled here or in component. Component usually handles its own timer to pause on hover etc.
        // But for React Native, pause on hover is rare.
        // Let's handle generic timeout here if we want centralized control, OR let component handle it.
        // Letting component handle it allows for entry animations to finish before unmounting.
    }, []);

    const success = useCallback((message: string, title?: string) => show(message, { type: 'success', title }), [show]);
    const error = useCallback((message: string, title?: string) => show(message, { type: 'error', title }), [show]);
    const info = useCallback((message: string, title?: string) => show(message, { type: 'info', title }), [show]);
    const warning = useCallback((message: string, title?: string) => show(message, { type: 'warning', title }), [show]);

    return (
        <ToastContext.Provider value={{ show, success, error, info, warning, hide }}>
            {children}
            {toasts.length > 0 && (
                <Toast toasts={toasts} onDismiss={hide} />
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
