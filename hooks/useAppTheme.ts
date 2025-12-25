import { useColorScheme } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { darkTheme } from '@/constants/darkTheme';

export function useAppTheme() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return {
        theme: isDark ? darkTheme : designSystem,
        isDark,
        colors: isDark ? darkTheme.colors : designSystem.colors,
    };
}
