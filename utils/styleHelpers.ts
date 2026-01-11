import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

/**
 * Helper type for style props that can be View, Text, or Image styles
 */
export type MixedStyleProp = StyleProp<ViewStyle | TextStyle | ImageStyle>;

/**
 * Helper to cast style arrays that mix different style types
 */
export function mixedStyles(...styles: MixedStyleProp[]): any {
    return styles.flat().filter(Boolean);
}

/**
 * Type-safe way to combine conditional styles
 */
export function conditionalStyle<T extends ViewStyle | TextStyle>(
    condition: boolean,
    style: StyleProp<T>
): StyleProp<T> | false {
    return condition ? style : false;
}
