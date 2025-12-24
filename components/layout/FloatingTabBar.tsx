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
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { designSystem, getSpacing } from '@/constants/designSystem';
// Removed reanimated usage for stability across platforms
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth / 2.5,
  borderRadius = 35,
  
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  // Improved active tab detection with better path matching
  const activeTabIndex = React.useMemo(() => {
    // Find the best matching tab based on the current pathname
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

  // No animated value, compute indicator position directly

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  // Remove unnecessary tabBarStyle animation to prevent flickering

  const tabWidthPercent = ((100 / tabs.length) - 1).toFixed(2);
  const tabWidth = (containerWidth - getSpacing(2)) / tabs.length;
  const indicatorStyle = {
    transform: [
      {
        translateX: tabWidth * activeTabIndex,
      },
    ],
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    containerSolid: {
      backgroundColor: theme.dark ? '#1C1C1E' : '#FFFFFF',
      borderRadius,
      borderWidth: 1,
      borderColor: theme.dark ? '#2C2C2E' : '#E5E5EA',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
      overflow: 'hidden',
    },
    indicator: {
      ...styles.indicator,
      backgroundColor: theme.dark ? '#2C2C2E' : '#F2F2F7',
      width: `${tabWidthPercent}%` as `${number}%`,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[
        styles.container,
        {
          width: containerWidth,
        }
      ]}>
        <View style={dynamicStyles.containerSolid}>
          <View style={[dynamicStyles.indicator, indicatorStyle]} />
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = activeTabIndex === index;
              return (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    key={index}
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                    activeOpacity={0.7}
                  >
                    <View key={index} style={styles.tabContent}>
                      <IconSymbol
                        android_material_icon_name={tab.icon}
                        ios_icon_name={tab.icon}
                        size={20}
                        color={isActive ? theme.colors.primary : (theme.dark ? '#98989D' : '#000000')}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: theme.dark ? '#98989D' : '#8E8E93' },
                          isActive && { color: theme.colors.primary, fontWeight: '600' },
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 20,
    alignSelf: 'center',
    // width and marginBottom handled dynamically via props
  },
  blurContainer: {
    overflow: 'hidden',
    // borderRadius and other styling applied dynamically
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    // Dynamic styling applied in component
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 2,
    bottom: 4,
    borderRadius: 27,
    width: `${(100 / 2) - 1}%`, // Default for 2 tabs, will be overridden by dynamic styles
    // Dynamic styling applied in component
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 4,
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
    gap: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    // Dynamic styling applied in component
  },
});
