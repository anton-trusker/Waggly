// Paw_AI Design System - Central Export
// Import all components from one place

// Export basic layout components from Tamagui
export {
    Card,
    Input,
    XStack,
    YStack,
    ZStack,
    Stack,
    type CardProps,
    type InputProps,
    type XStackProps,
    type YStackProps,
    type ZStackProps,
    type StackProps,
} from 'tamagui';

// Export Button from the design system primitives
export { Button, type ButtonProps } from './design-system/primitives/Button';

// Form Components
export {
    TextInput,
    Checkbox,
    Switch,
    RadioGroup,
    SearchBar,
    type TextInputProps,
    type CheckboxProps,
    type SwitchProps,
    type RadioGroupProps,
    type RadioOption,
    type SearchBarProps,
} from './forms';

// Display Components
export {
    ListItem,
    Stat,
    ProgressBar,
    EmptyState,
    LoadingSpinner,
    type ListItemProps,
    type StatProps,
    type ProgressBarProps,
    type EmptyStateProps,
    type LoadingSpinnerProps,
} from './display';

// Re-export useful Tamagui primitives
export { Text, H1, H2, H3, H4, H5, H6, Paragraph, Separator, ScrollView } from 'tamagui';
export type { TextProps, SeparatorProps, ScrollViewProps } from 'tamagui';
