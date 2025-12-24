import { AccessibilityInfo, Platform } from 'react-native';

export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 
    | 'none'
    | 'button'
    | 'link'
    | 'search'
    | 'image'
    | 'keyboardkey'
    | 'text'
    | 'adjustable'
    | 'imagebutton'
    | 'header'
    | 'summary'
    | 'alert'
    | 'checkbox'
    | 'combobox'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'spinbutton'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'timer'
    | 'toolbar';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityActions?: {
    name: string;
    label?: string;
  }[];
  onAccessibilityAction?: (event: any) => void;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityElementsHidden?: boolean;
  accessibilityViewIsModal?: boolean;
  accessibilityIgnoresInvertColors?: boolean;
}

export class AccessibilityManager {
  private static instance: AccessibilityManager;
  private screenReaderEnabled: boolean = false;
  private reduceMotionEnabled: boolean = false;
  private highContrastEnabled: boolean = false;
  
  private constructor() {
    this.initializeAccessibilitySettings();
  }

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  private initializeAccessibilitySettings() {
    // Check screen reader status
    AccessibilityInfo.isScreenReaderEnabled().then(enabled => {
      this.screenReaderEnabled = enabled;
    });

    // Listen for screen reader changes
    AccessibilityInfo.addEventListener('screenReaderChanged', this.handleScreenReaderChanged);

    // Check reduce motion preference
    if (Platform.OS === 'ios') {
      AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
        this.reduceMotionEnabled = enabled;
      });
      
      AccessibilityInfo.addEventListener('reduceMotionChanged', this.handleReduceMotionChanged);
    }

    // Check high contrast preference (iOS only)
    if (Platform.OS === 'ios') {
      AccessibilityInfo.isHighTextContrastEnabled().then(enabled => {
        this.highContrastEnabled = enabled;
      });
      
      // AccessibilityInfo.addEventListener('highContrastChanged', this.handleHighContrastChanged);
    }
  }

  private handleScreenReaderChanged = (enabled: boolean) => {
    this.screenReaderEnabled = enabled;
  };

  private handleReduceMotionChanged = (enabled: boolean) => {
    this.reduceMotionEnabled = enabled;
  };

  private handleHighContrastChanged = (enabled: boolean) => {
    this.highContrastEnabled = enabled;
  };

  get isScreenReaderEnabled(): boolean {
    return this.screenReaderEnabled;
  }

  get isReduceMotionEnabled(): boolean {
    return this.reduceMotionEnabled;
  }

  get isHighContrastEnabled(): boolean {
    return this.highContrastEnabled;
  }

  // Announce important changes to screen readers
  announceForAccessibility(message: string): void {
    if (this.screenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }

  // Set focus to a specific element
  setFocus(elementId: number): void {
    if (this.screenReaderEnabled && Platform.OS === 'ios') {
      AccessibilityInfo.setAccessibilityFocus(elementId);
    }
  }
}

// Convenience functions for common accessibility patterns
export const accessibility = {
  // Button accessibility props
  button: (label: string, hint?: string, disabled?: boolean): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button',
    accessibilityState: {
      disabled: disabled || false,
    },
  }),

  // Text input accessibility props
  input: (label: string, hint?: string, required?: boolean): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'search',
    accessibilityState: {
      disabled: false,
    },
  }),

  // Image accessibility props
  image: (label: string, decorative?: boolean): AccessibilityProps => ({
    accessible: !decorative,
    accessibilityLabel: decorative ? undefined : label,
    accessibilityRole: 'image',
  }),

  // Link accessibility props
  link: (label: string, hint?: string): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'link',
  }),

  // Checkbox accessibility props
  checkbox: (label: string, checked: boolean, hint?: string): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'checkbox',
    accessibilityState: {
      checked: checked,
    },
  }),

  // Radio button accessibility props
  radio: (label: string, selected: boolean, hint?: string): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'radio',
    accessibilityState: {
      selected: selected,
    },
  }),

  // Header accessibility props
  header: (level: 1 | 2 | 3 | 4 | 5 | 6): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'header',
    accessibilityValue: {
      text: `Heading level ${level}`,
    },
  }),

  // Loading state accessibility props
  loading: (label: string = 'Loading'): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityState: {
      busy: true,
    },
  }),

  // Error state accessibility props
  error: (message: string): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: `Error: ${message}`,
    accessibilityRole: 'alert',
    accessibilityLiveRegion: 'assertive',
  }),

  // Success state accessibility props
  success: (message: string): AccessibilityProps => ({
    accessible: true,
    accessibilityLabel: `Success: ${message}`,
    accessibilityLiveRegion: 'polite',
  }),

  // Live region for dynamic content updates
  liveRegion: (type: 'polite' | 'assertive' = 'polite'): AccessibilityProps => ({
    accessibilityLiveRegion: type,
  }),
};

// Screen reader announcements
export const announcements = {
  // Form submissions
  formSubmitted: (formName: string): void => {
    AccessibilityManager.getInstance().announceForAccessibility(`${formName} form submitted successfully`);
  },

  // Validation errors
  validationError: (fieldName: string, error: string): void => {
    AccessibilityManager.getInstance().announceForAccessibility(`Error in ${fieldName}: ${error}`);
  },

  // Navigation
  screenChanged: (screenName: string): void => {
    AccessibilityManager.getInstance().announceForAccessibility(`Navigated to ${screenName}`);
  },

  // Content updates
  contentUpdated: (description: string): void => {
    AccessibilityManager.getInstance().announceForAccessibility(`Content updated: ${description}`);
  },

  // Loading states
  loadingStarted: (action: string): void => {
    AccessibilityManager.getInstance().announceForAccessibility(`Loading ${action}`);
  },

  loadingCompleted: (action: string): void => {
    AccessibilityManager.getInstance().announceForAccessibility(`${action} completed`);
  },

  loadingFailed: (action: string, error?: string): void => {
    const message = error ? `${action} failed: ${error}` : `${action} failed`;
    AccessibilityManager.getInstance().announceForAccessibility(message);
  },
};

// Color contrast utilities
export const contrast = {
  // Calculate relative luminance
  getLuminance: (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const toLinear = (c: number) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  },

  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    const lum1 = contrast.getLuminance(color1);
    const lum2 = contrast.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = contrast.getContrastRatio(color1, color2);
    const requiredRatio = level === 'AA' ? 4.5 : 7;
    return ratio >= requiredRatio;
  },

  // Get text color based on background
  getTextColor: (backgroundColor: string): string => {
    const luminance = contrast.getLuminance(backgroundColor);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  },
};

// Focus management
export const focusManagement = {
  // Set focus to an element by ID
  setFocus: (elementId: number): void => {
    AccessibilityManager.getInstance().setFocus(elementId);
  },

  // Announce focus change
  announceFocus: (elementLabel: string): void => {
    AccessibilityManager.getInstance().announceForAccessibility(`Focus moved to ${elementLabel}`);
  },

  // Trap focus within a container
  trapFocus: (containerId: string): void => {
    // Implementation would depend on specific requirements
    console.log(`Focus trapped within container: ${containerId}`);
  },

  // Release focus trap
  releaseFocusTrap: (): void => {
    console.log('Focus trap released');
  },
};

export default AccessibilityManager;