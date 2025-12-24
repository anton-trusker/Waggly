import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';
import { designSystem } from '@/constants/designSystem';
import { useLocale } from '@/hooks/useLocale';

const { width: screenWidth } = Dimensions.get('window');

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface FloatingTabBarWithPlusProps {
  tabs: TabBarItem[];
  onPlusPress: () => void;
  // Deprecated props kept for compatibility but ignored for full-width style
  containerWidth?: number;
  borderRadius?: number;
  onTabPressOverride?: (route: string) => boolean;
}

export default function FloatingTabBarWithPlus({
  tabs,
  onPlusPress,
  onTabPressOverride,
}: FloatingTabBarWithPlusProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { t } = useLocale();

  // Improved active tab detection with better path matching
  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;
      const tabRouteStr = typeof tab.route === 'string' ? tab.route : '';

      // Exact route match gets highest score
      if (typeof tab.route === 'string' && pathname === tab.route) {
        score = 100;
      }
      // Check if pathname starts with tab route (for nested routes)
      else if (typeof tab.route === 'string' && pathname.startsWith(tab.route as string)) {
        score = 80;
      }
      // Check if pathname contains the tab name
      else if (pathname.includes(tab.name)) {
        score = 60;
      }
      // Check for partial matches in the route
      else if (tabRouteStr && tabRouteStr.includes('/(tabs)/')) {
        const partial = tabRouteStr.split('/(tabs)/')[1];
        if (partial && pathname.includes(partial)) {
          score = 40;
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    // Default to first tab if no match found
    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  const handleTabPress = (route: Href) => {
    if (onTabPressOverride && typeof route === 'string') {
        const handled = onTabPressOverride(route);
        if (handled) return;
    }
    router.push(route);
  };

  const dynamicStyles = {
    containerSolid: {
      backgroundColor: theme.dark ? '#1C1C1E' : '#FFFFFF',
      borderTopWidth: 1,
      borderColor: theme.dark ? '#2C2C2E' : '#E5E5EA',
    },
  };

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <View style={styles.wrapper}>
        <View style={[styles.container, dynamicStyles.containerSolid]}>
            <SafeAreaView edges={['bottom']}>
                <View style={styles.tabsContainer}>
                    {/* Left tabs */}
                    <View style={styles.tabsSection}>
                    {leftTabs.map((tab, index) => {
                        const isActive = activeTabIndex === index;
                        return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tab}
                            onPress={() => handleTabPress(tab.route)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.tabContent}>
                            <IconSymbol
                                android_material_icon_name={tab.icon}
                                ios_icon_name={tab.icon}
                                size={24}
                                color={isActive ? theme.colors.primary : (theme.dark ? '#98989D' : '#8E8E93')}
                            />
                            <Text
                                style={[
                                styles.tabLabel,
                                { color: theme.dark ? '#98989D' : '#8E8E93' },
                                isActive && { color: theme.colors.primary, fontWeight: '600' },
                                ]}
                            >
                                {t(tab.label, { defaultValue: tab.label })}
                            </Text>
                            </View>
                        </TouchableOpacity>
                        );
                    })}
                    </View>

                    {/* Plus Button - Raised slightly */}
                    <View style={styles.plusButtonContainer}>
                        <TouchableOpacity
                            style={styles.plusButton}
                            onPress={onPlusPress}
                            activeOpacity={0.9}
                        >
                            <IconSymbol
                                android_material_icon_name="add"
                                ios_icon_name="plus"
                                size={32}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Right tabs */}
                    <View style={styles.tabsSection}>
                    {rightTabs.map((tab, index) => {
                        const actualIndex = index + 2;
                        const isActive = activeTabIndex === actualIndex;
                        return (
                        <TouchableOpacity
                            key={tab.name}
                            style={styles.tab}
                            onPress={() => handleTabPress(tab.route)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.tabContent}>
                            <IconSymbol
                                android_material_icon_name={tab.icon}
                                ios_icon_name={tab.icon}
                                size={24}
                                color={isActive ? theme.colors.primary : (theme.dark ? '#98989D' : '#8E8E93')}
                            />
                            <Text
                                style={[
                                styles.tabLabel,
                                { color: theme.dark ? '#98989D' : '#8E8E93' },
                                isActive && { color: theme.colors.primary, fontWeight: '600' },
                                ]}
                            >
                                {t(tab.label, { defaultValue: tab.label })}
                            </Text>
                            </View>
                        </TouchableOpacity>
                        );
                    })}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60, // Standard tab bar height
    paddingHorizontal: 0,
  },
  tabsSection: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  plusButtonContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    top: -15, // Raised effect
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: designSystem.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: designSystem.colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF', // Creates "cutout" effect against background
  },
});
