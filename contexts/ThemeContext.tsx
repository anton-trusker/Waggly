import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { designSystem } from '@/constants/designSystem';
import { darkTheme } from '@/constants/darkTheme';

type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => Promise<void>;
    colors: typeof designSystem.colors;
    theme: typeof designSystem;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const STORAGE_THEME_KEY = 'app_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Load persisted theme preference
        AsyncStorage.getItem(STORAGE_THEME_KEY).then((value) => {
            if (value === 'light' || value === 'dark' || value === 'auto') {
                setThemeModeState(value);
            }
            setIsReady(true);
        });
    }, []);

    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        await AsyncStorage.setItem(STORAGE_THEME_KEY, mode);
    };

    const isDark =
        themeMode === 'auto'
            ? systemColorScheme === 'dark'
            : themeMode === 'dark';

    const theme = isDark ? darkTheme : designSystem;

    if (!isReady) {
        return null; // Or a splash screen component
    }

    return (
        <ThemeContext.Provider
            value={{
                themeMode,
                isDark,
                setThemeMode,
                colors: theme.colors,
                theme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
