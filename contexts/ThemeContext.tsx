import React, { createContext, useContext } from 'react';
import { designSystem } from '@/constants/designSystem';

type ThemeMode = 'light'; // Only light theme supported

interface ThemeContextType {
    themeMode: ThemeMode;
    isDark: false; // Always false
    colors: typeof designSystem.colors;
    theme: typeof designSystem;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Always use light theme
    const theme = designSystem;

    return (
        <ThemeContext.Provider
            value={{
                themeMode: 'light',
                isDark: false,
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
