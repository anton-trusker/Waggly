import { designSystem } from '@/constants/designSystem';

// Helper functions for common design system values
export const getSpacing = (index: keyof typeof designSystem.spacing): number => {
  const spacing = designSystem.spacing[index];
  return spacing !== undefined ? spacing : index * 4; // Default 4px grid
};

export const getColor = (path: string, fallback: string = '#000000'): string => {
  try {
    const parts = path.split('.');
    let value: any = designSystem.colors;
    
    for (const part of parts) {
      value = value[part];
      if (value === undefined) return fallback;
    }
    
    return value || fallback;
  } catch (error) {
    console.warn(`Failed to get color: ${path}`, error);
    return fallback;
  }
};

export const getBorderRadius = (key: keyof typeof designSystem.borderRadius): number => {
  const radius = designSystem.borderRadius[key];
  return radius !== undefined ? radius : 0;
};
