import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PersistentStateConfig {
  key: string;
  defaultValue?: any;
  encryption?: boolean;
  expiration?: number; // milliseconds
}

export class PersistentStateManager {
  private static instance: PersistentStateManager;
  private cache: Map<string, any> = new Map();
  private expirationTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  static getInstance(): PersistentStateManager {
    if (!PersistentStateManager.instance) {
      PersistentStateManager.instance = new PersistentStateManager();
    }
    return PersistentStateManager.instance;
  }

  async get<T>(config: PersistentStateConfig): Promise<T> {
    const { key, defaultValue } = config;
    
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const storedValue = await AsyncStorage.getItem(key);
      
      if (storedValue !== null) {
        const parsedValue = JSON.parse(storedValue);
        
        // Check expiration
        if (config.expiration && parsedValue._timestamp) {
          const now = Date.now();
          if (now - parsedValue._timestamp > config.expiration) {
            await this.remove(config);
            return defaultValue as T;
          }
          
          // Return the actual value without metadata
          const value = parsedValue.value;
          this.cache.set(key, value);
          return value;
        }
        
        this.cache.set(key, parsedValue);
        return parsedValue;
      }
    } catch (error) {
      console.error(`Error reading persistent state for key ${key}:`, error);
    }

    return defaultValue as T;
  }

  async set<T>(config: PersistentStateConfig, value: T): Promise<void> {
    const { key, expiration } = config;
    
    try {
      let valueToStore = value;
      
      // Add timestamp for expiration tracking
      if (expiration) {
        valueToStore = {
          value: value,
          _timestamp: Date.now(),
        } as any;
      }
      
      const serializedValue = JSON.stringify(valueToStore);
      await AsyncStorage.setItem(key, serializedValue);
      
      // Update cache
      this.cache.set(key, value);
      
      // Set expiration timer
      if (expiration) {
        this.setExpirationTimer(config);
      }
    } catch (error) {
      console.error(`Error writing persistent state for key ${key}:`, error);
      throw error;
    }
  }

  async remove(config: PersistentStateConfig): Promise<void> {
    const { key } = config;
    
    try {
      await AsyncStorage.removeItem(key);
      this.cache.delete(key);
      this.clearExpirationTimer(key);
    } catch (error) {
      console.error(`Error removing persistent state for key ${key}:`, error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
      this.cache.clear();
      this.clearAllExpirationTimers();
    } catch (error) {
      console.error('Error clearing all persistent state:', error);
      throw error;
    }
  }

  async clearByPrefix(prefix: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => key.startsWith(prefix));
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        
        // Clear from cache and timers
        keysToRemove.forEach(key => {
          this.cache.delete(key);
          this.clearExpirationTimer(key);
        });
      }
    } catch (error) {
      console.error(`Error clearing persistent state by prefix ${prefix}:`, error);
      throw error;
    }
  }

  private setExpirationTimer(config: PersistentStateConfig): void {
    if (!config.expiration) return;

    this.clearExpirationTimer(config.key);
    
    const timer: ReturnType<typeof setTimeout> = setTimeout(async () => {
      try {
        await this.remove(config);
        console.log(`Expired persistent state removed for key: ${config.key}`);
      } catch (error) {
        console.error(`Error removing expired state for key ${config.key}:`, error);
      }
    }, config.expiration);

    this.expirationTimers.set(config.key, timer);
  }

  private clearExpirationTimer(key: string): void {
    const timer = this.expirationTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.expirationTimers.delete(key);
    }
  }

  private clearAllExpirationTimers(): void {
    this.expirationTimers.forEach(timer => clearTimeout(timer));
    this.expirationTimers.clear();
  }
}

// Convenience hooks for common use cases
export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  config?: Partial<PersistentStateConfig>
) {
  const manager = PersistentStateManager.getInstance();
  const [state, setState] = React.useState<T>(defaultValue);
  const [loading, setLoading] = React.useState(true);

  const fullConfig: PersistentStateConfig = {
    key,
    defaultValue,
    ...config,
  };

  React.useEffect(() => {
    loadState();
  }, [key]);

  const loadState = async () => {
    try {
      setLoading(true);
      const value = await manager.get<T>(fullConfig);
      setState(value);
    } catch (error) {
      console.error(`Error loading persistent state for key ${key}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const saveState = async (value: T) => {
    try {
      setState(value);
      await manager.set(fullConfig, value);
    } catch (error) {
      console.error(`Error saving persistent state for key ${key}:`, error);
    }
  };

  const clearState = async () => {
    try {
      await manager.remove(fullConfig);
      setState(defaultValue);
    } catch (error) {
      console.error(`Error clearing persistent state for key ${key}:`, error);
    }
  };

  return {
    state,
    setState: saveState,
    clearState,
    loading,
    reload: loadState,
  };
}

// Predefined configurations for common use cases
export const persistentConfigs = {
  // UI preferences
  theme: {
    key: 'app:theme',
    defaultValue: 'light',
    expiration: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
  
  // Calendar filters
  calendarFilters: {
    key: 'calendar:filters',
    defaultValue: {
      selectedPetIds: [] as string[],
      selectedTypes: undefined as string[] | undefined,
      dateRange: null,
    },
    expiration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  // Dashboard preferences
  dashboardPreferences: {
    key: 'dashboard:preferences',
    defaultValue: {
      selectedPetId: null as string | null,
      showCompletedTasks: true,
      sortBy: 'date' as 'date' | 'priority',
    },
    expiration: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  
  // Pet selection
  petSelection: {
    key: 'pets:lastSelected',
    defaultValue: null as string | null,
    expiration: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  
  // User preferences
  userPreferences: {
    key: 'user:preferences',
    defaultValue: {
      language: 'en',
      notifications: true,
      reminders: true,
    },
    expiration: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
};

export default PersistentStateManager;