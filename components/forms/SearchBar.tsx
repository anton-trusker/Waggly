import { Input } from '../base/Input';
import { XStack } from 'tamagui';
import { ComponentProps } from 'react';

export interface SearchBarProps extends ComponentProps<typeof Input> {
    onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch, ...inputProps }: SearchBarProps) {
    return (
        <XStack width="100%" position="relative">
            <Input
                placeholder="Search..."
                {...inputProps}
                onChangeText={(text) => {
                    inputProps.onChangeText?.(text);
                    onSearch?.(text);
                }}
            />
        </XStack>
    );
}
