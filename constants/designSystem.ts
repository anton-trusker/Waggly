import { Platform } from 'react-native';

// Ensure designSystem is not redefined
if (typeof window !== 'undefined' && (window as any).__DESIGN_SYSTEM__) {
  console.warn('designSystem is being redefined. This may cause issues.');
}

// Define the design system with all required properties
export const designSystem = Object.freeze({
  colors: {
    // Primary Colors - Enhanced Blue Palette
    primary: {
      50: '#F0F6FF',
      100: '#E0EDFF',
      200: '#C2DBFF',
      300: '#94C0FF',
      400: '#607AFB', // New Brand Primary (used as main in design)
      500: '#607AFB', // Main primary mapped to design
      600: '#4B62D6',
      700: '#384CB0',
      800: '#28388A',
      900: '#1A2666',
    },

    // Secondary Colors - Pet-themed palette
    secondary: {
      paw: '#FF6B6B',
      pawLight: '#FF8E8E',
      pawDark: '#E55555',
      leaf: '#4ECDC4',
      leafLight: '#7ED9D1',
      leafDark: '#3BA99F',
      sun: '#FFE66D',
      sunLight: '#FFF2A1',
      sunDark: '#E6CD62',
    },

    // Neutral Colors - Enhanced grayscale
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E8E8E8',
      300: '#D1D1D1',
      400: '#B4B4B4',
      500: '#8E8E93',
      600: '#6B7280',
      700: '#4B5563',
      800: '#374151',
      900: '#1F2937',
      1000: '#000000',
    },

    // Semantic Colors
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
    },

    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
    },

    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
    },

    // Background Colors
    background: {
      primary: '#f5f6f8', // Updated from design
      secondary: '#FFFFFF',
      tertiary: '#F5F5F5',
      gradient: {
        start: '#E3F2FF',
        end: '#FFFFFF',
      },
    },

    // Text Colors
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#8E8E93',
      quaternary: '#B4B4B4',
      inverse: '#FFFFFF',
    },

    // Border Colors
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      focus: '#0A84FF',
    },
    status: {
      error: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
        800: '#991B1B',
        900: '#7F1D1D',
      },
      warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
      },
      success: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
      },
    },

    // Overlay colors
    overlay: {
      default: 'rgba(17, 24, 39, 0.4)',
      strong: 'rgba(17, 24, 39, 0.6)',
    },
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 10,
    overlay: 20,
    modal: 30,
    toast: 40,
  },

  // Enhanced Typography System
  typography: {
    // Display Styles
    display: {
      large: {
        fontSize: 57,
        fontWeight: '400',
        lineHeight: 64,
        letterSpacing: -0.25,
      },
      medium: {
        fontSize: 45,
        fontWeight: '400',
        lineHeight: 52,
      },
      small: {
        fontSize: 36,
        fontWeight: '400',
        lineHeight: 44,
      },
    },

    // Headline Styles
    headline: {
      large: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
      },
      medium: {
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 36,
      },
      small: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 32,
      },
    },

    // Title Styles
    title: {
      large: {
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 28,
      },
      medium: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        letterSpacing: 0.15,
      },
      small: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: 0.1,
      },
    },

    // Body Styles
    body: {
      large: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0.5,
      },
      medium: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: 0.25,
      },
      small: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0.4,
      },
    },

    // Label Styles
    label: {
      large: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
      },
      medium: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 16,
        letterSpacing: 0.5,
      },
      small: {
        fontSize: 11,
        fontWeight: '600',
        lineHeight: 16,
        letterSpacing: 0.5,
      },
    },
  },

  // Icon Sizes
  iconSizes: {
    sm: 16,
    md: 20,
    lg: 24,
  },

  // Enhanced Spacing System (4px multiples with fractional steps)
  spacing: {
    0: 0,
    0.5: 2,  // 0.25x
    1: 4,    // 0.5x
    1.5: 6,  // 0.75x
    2: 8,    // 1x (base)
    2.5: 10, // 1.25x
    3: 12,   // 1.5x
    3.5: 14, // 1.75x
    4: 16,   // 2x
    4.5: 18, // 2.25x
    5: 20,   // 2.5x
    5.5: 22, // 2.75x
    6: 24,   // 3x
    7: 28,   // 3.5x
    8: 32,   // 4x
    9: 36,   // 4.5x
    10: 40,  // 5x
    11: 44,  // 5.5x
    12: 48,  // 6x
    13: 52,  // 6.5x
    14: 56,  // 7x
    15: 60,  // 7.5x
    16: 64,  // 8x
    17: 68,
    18: 72,
    19: 76,
    20: 80,
    21: 84,
    22: 88,
    23: 92,
    24: 96,
    25: 100,
    26: 104,
    27: 108,
    28: 112,
    29: 116,
    30: 120,
    31: 124,
    32: 128,
    33: 132,
    34: 136,
    35: 140,
    36: 144,
    37: 148,
    38: 152,
    39: 156,
    40: 160,
  },

  // Enhanced Border Radius System
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },

  // Shadow System
  shadows: {
    sm: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }
    }),
    md: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }
    }),
    lg: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }
    }),
    xl: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
      }
    }),
  },

  // Animation System
  animations: {
    duration: {
      instant: 100,
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },


  // Responsive Breakpoints
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },

  // Component-specific tokens
  components: {
    button: {
      minHeight: {
        sm: 36,
        md: 48,
        lg: 56,
      },
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    input: {
      height: 48,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    card: {
      padding: 16,
      borderRadius: 16,
    },
    chip: {
      minHeight: 32,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
  },
});

// Helper function to get spacing values
export const getSpacing = (index: number): number => {
  // If the index is a whole number, return the value directly
  if (Number.isInteger(index) && index in designSystem.spacing) {
    return designSystem.spacing[index as keyof typeof designSystem.spacing] as number;
  }

  // For fractional values, try to find the closest match
  const spacingKey = Object.keys(designSystem.spacing)
    .map(Number)
    .sort((a, b) => a - b)
    .find(key => key >= index);

  return spacingKey !== undefined
    ? designSystem.spacing[spacingKey as keyof typeof designSystem.spacing] as number
    : 0; // Fallback to 0 if no match found
};

// Make designSystem available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).__DESIGN_SYSTEM__ = designSystem;
}

// Legacy theme compatibility
export const enhancedTheme = {
  colors: designSystem.colors,
  spacing: designSystem.spacing,
  typography: designSystem.typography,
  borderRadius: designSystem.borderRadius,
  shadows: designSystem.shadows,
  animations: designSystem.animations,
  iconSizes: designSystem.iconSizes,
  components: designSystem.components,
  getSpacing, // Include getSpacing in the theme as well
};

export default designSystem;