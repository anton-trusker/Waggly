import { TamaguiProvider, TamaguiProviderProps } from 'tamagui';
import config from '../tamagui.config';

export function DesignSystemProvider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
    return (
        <TamaguiProvider config={config} defaultTheme="light" {...rest}>
            {children}
        </TamaguiProvider>
    );
}
