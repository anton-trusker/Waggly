import { useState } from 'react';

/**
 * Hook for managing bottom sheet state
 * 
 * @returns Object with visible state and open/close functions
 * 
 * @example
 * ```typescript
 * const { visible, open, close } = useBottomSheet();
 * 
 * <Button onPress={open}>Open Sheet</Button>
 * <BottomSheet visible={visible} onClose={close}>
 *   ...
 * </BottomSheet>
 * ```
 */
export function useBottomSheet() {
    const [visible, setVisible] = useState(false);

    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const toggle = () => setVisible(prev => !prev);

    return { visible, open, close, toggle };
}
