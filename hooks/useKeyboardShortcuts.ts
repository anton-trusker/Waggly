import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Custom hook for keyboard shortcuts
 * Desktop-specific shortcuts for common actions
 */
export const useKeyboardShortcuts = (shortcuts: {
    [key: string]: () => void;
}) => {
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Command/Ctrl key combinations
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modKey = isMac ? event.metaKey : event.ctrlKey;

            // Build shortcut key (e.g., "cmd+n", "cmd+shift+p")
            let key = '';
            if (modKey) key += 'cmd+';
            if (event.shiftKey) key += 'shift+';
            if (event.altKey) key += 'alt+';
            key += event.key.toLowerCase();

            // Execute shortcut if it exists
            if (shortcuts[key]) {
                event.preventDefault();
                shortcuts[key]();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

/**
 * Common keyboard shortcuts for the app
 */
export const KEYBOARD_SHORTCUTS = {
    // Navigation
    DASHBOARD: 'cmd+d',
    CALENDAR: 'cmd+l',
    PETS: 'cmd+p',
    NOTIFICATIONS: 'cmd+n',
    SETTINGS: 'cmd+,',

    // Actions
    ADD_PET: 'cmd+shift+n',
    SEARCH: 'cmd+k',
    SAVE: 'cmd+s',
    CLOSE: 'escape',

    // Editing
    UNDO: 'cmd+z',
    REDO: 'cmd+shift+z',

    // Help
    HELP: 'cmd+/',
};

/**
 * Format shortcut for display (e.g., "⌘N" or "Ctrl+N")
 */
export const formatShortcut = (shortcut: string): string => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    return shortcut
        .replace('cmd+', isMac ? '⌘' : 'Ctrl+')
        .replace('shift+', isMac ? '⇧' : 'Shift+')
        .replace('alt+', isMac ? '⌥' : 'Alt+')
        .toUpperCase();
};
