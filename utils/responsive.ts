import { Dimensions, Platform, PixelRatio } from 'react-native';

export const responsive = {
  // Screen dimensions
  get screen() {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  },
  
  // Breakpoints
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },
  
  // Platform detection
  get isPhone() {
    return Dimensions.get('window').width < 768;
  },
  get isTablet() {
    const w = Dimensions.get('window').width;
    return w >= 768 && w < 1024;
  },
  get isDesktop() {
    return Dimensions.get('window').width >= 1024;
  },
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  
  // Font scaling
  fontScale: PixelRatio.getFontScale(),
  pixelRatio: PixelRatio.get(),
  
  // Responsive spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    // Dynamic spacing based on screen size
    get dynamic() {
      const { width } = Dimensions.get('window');
      const base = width < 768 ? 0.8 : width < 1024 ? 1 : 1.2;
      return {
        xs: 4 * base,
        sm: 8 * base,
        md: 16 * base,
        lg: 24 * base,
        xl: 32 * base,
        xxl: 48 * base,
      };
    },
  },
  
  // Responsive font sizes
  typography: {
    scale: {
      small: 0.85,
      normal: 1,
      large: 1.15,
    },
    get scaledSize() {
      const { width } = Dimensions.get('window');
      const scale = width < 768 ? this.scale.small : width < 1024 ? this.scale.normal : this.scale.large;
      return {
        h1: 32 * scale,
        h2: 28 * scale,
        h3: 24 * scale,
        h4: 20 * scale,
        h5: 18 * scale,
        h6: 16 * scale,
        body: 16 * scale,
        caption: 14 * scale,
        small: 12 * scale,
      };
    },
  },
  
  // Grid system
  grid: {
    columns: 12,
    gutter: 16,
    margin: 16,
    // Responsive grid
    get responsive() {
      const { width } = Dimensions.get('window');
      if (width < 768) {
        return {
          columns: 4,
          gutter: 12,
          margin: 16,
        };
      } else if (width < 1024) {
        return {
          columns: 8,
          gutter: 16,
          margin: 24,
        };
      } else {
        return {
          columns: 12,
          gutter: 24,
          margin: 32,
        };
      }
    },
  },
  
  // Component-specific responsive values
  components: {
    button: {
      minHeight: 48,
      minWidth: 88,
      paddingHorizontal: 16,
      borderRadius: 8,
      // Responsive button sizing
      get responsive() {
        const { width } = Dimensions.get('window');
        const scale = width < 768 ? 0.9 : width < 1024 ? 1 : 1.1;
        return {
          minHeight: 48 * scale,
          minWidth: 88 * scale,
          paddingHorizontal: 16 * scale,
          borderRadius: 8 * scale,
        };
      },
    },
    
    card: {
      padding: 16,
      borderRadius: 12,
      margin: 8,
      // Responsive card sizing
      get responsive() {
        const { width } = Dimensions.get('window');
        const scale = width < 768 ? 0.9 : width < 1024 ? 1 : 1.1;
        return {
          padding: 16 * scale,
          borderRadius: 12 * scale,
          margin: 8 * scale,
        };
      },
    },
    
    input: {
      minHeight: 48,
      paddingHorizontal: 16,
      borderRadius: 8,
      // Responsive input sizing
      get responsive() {
        const { width } = Dimensions.get('window');
        const scale = width < 768 ? 0.9 : width < 1024 ? 1 : 1.1;
        return {
          minHeight: 48 * scale,
          paddingHorizontal: 16 * scale,
          borderRadius: 8 * scale,
        };
      },
    },
  },
  
  // Orientation detection
  get isPortrait() {
    const { width, height } = Dimensions.get('window');
    return height >= width;
  },
  
  get isLandscape() {
    const { width, height } = Dimensions.get('window');
    return width > height;
  },
  
  // Safe area considerations
  safeArea: {
    top: 44, // iPhone notch
    bottom: 34, // iPhone home indicator
    // Dynamic safe area based on device
    get dynamic() {
      const { height } = Dimensions.get('window');
      return {
        top: height > 800 ? 44 : 20,
        bottom: height > 800 ? 34 : 20,
      };
    },
  },
  
  // Utility functions
  scale(size: number): number {
    const { width } = Dimensions.get('window');
    const scale = width < 768 ? 0.9 : width < 1024 ? 1 : 1.1;
    return size * scale;
  },
  
  scaleFont(size: number): number {
    return size * this.fontScale;
  },
  
  // Media query-like helpers
  get isSmallScreen() {
    return Dimensions.get('window').width < 375;
  },
  
  get isMediumScreen() {
    const w = Dimensions.get('window').width;
    return w >= 375 && w < 768;
  },
  
  get isLargeScreen() {
    return Dimensions.get('window').width >= 768;
  },
  
  // Platform-specific adjustments
  platform: {
    shadow: Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    } : {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
    
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
};

export default responsive;
