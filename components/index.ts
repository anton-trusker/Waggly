// Paw_AI Design System - Central Export
// Import all components from one place

// Export basic layout components from Tamagui
export {
    Card,
    XStack,
    YStack,
    ZStack,
    Stack,
    type CardProps,
    type XStackProps,
    type YStackProps,
    type ZStackProps,
    type StackProps,
} from 'tamagui';

// Export primitives from our design system
export { Button, type ButtonProps } from './design-system/primitives/Button';
export { Input, type InputProps } from './design-system/primitives/Input';

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
    LoadingSpinner,
    Badge,
    type ListItemProps,
    type StatProps,
    type ProgressBarProps,
    type EmptyStateProps,
    type LoadingSpinnerProps,
    type BadgeProps,
} from './display';

// Re-export useful Tamagui primitives
export { Text, H1, H2, H3, H4, H5, H6, Paragraph, Separator, Separator as Divider, ScrollView } from 'tamagui';
export type { TextProps, SeparatorProps, ScrollViewProps } from 'tamagui';
