import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  PanResponder,
  Animated,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { getColor } from '@/utils/designSystem';
import { designSystem, getSpacing } from '@/constants/designSystem';


interface WeightSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  style?: StyleProp<ViewStyle>;
  inputProps?: TextInputProps;
}

const WeightSlider: React.FC<WeightSliderProps> = ({
  value,
  min,
  max,
  step = 0.1,
  onChange,
  style,
  inputProps,
}) => {
  const width = 280;
  // Use RN Animated Value
  const pan = useRef(new Animated.Value(0)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const sliderWidth = useRef(0);
  const knobSize = 24;
  const trackHeight = 4;
  const isGestureActive = useRef(false);

  // Sync internal progress with external value changes
  useEffect(() => {
    setInputValue(value.toFixed(1));
  }, [value]);

  // Handle slider pan gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsEditing(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.min(
          max,
          Math.max(min, value + (gestureState.dx / sliderWidth.current) * (max - min))
        );
        const steppedValue = Math.round(newValue / step) * step;
        onChange(steppedValue);
      },
      onPanResponderRelease: () => {
        setIsEditing(false);
      },
    })
  ).current;

  // Handle manual input changes
  const handleInputChange = (text: string) => {
    setInputValue(text);
    const numValue = parseFloat(text);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  // Calculate slider position
  const sliderPosition = ((value - min) / (max - min)) * 100;

  return (
    <View style={[styles.container, style]}>
      <View
        style={styles.sliderContainer}
        onLayout={(event) => {
          sliderWidth.current = event.nativeEvent.layout.width;
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.trackActive,
              {
                width: `${sliderPosition}%`,
                backgroundColor: getColor('primary.500'),
              },
            ] as any}
          />
        </View>
        <Animated.View
          style={[
            styles.knob,
            {
              left: `${sliderPosition}%`,
              backgroundColor: getColor('primary.500'),
              transform: [
                { translateX: -knobSize / 2 },
                { translateY: -knobSize / 2 + trackHeight / 2 },
                { scale: isEditing ? 1.2 : 1 },
              ],
            },
          ] as any}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: getColor('text.primary'),
              borderColor: getColor('border.default'),
              backgroundColor: getColor('background.primary'),
            },
          ] as any}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={handleInputChange}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          {...inputProps}
        />
        <Text style={[styles.unit, { color: getColor('text.secondary') }]}>kg</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: getSpacing(2),
  },
  sliderContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginRight: getSpacing(3),
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: getColor('border.default'),
    overflow: 'hidden',
  },
  trackActive: {
    height: '100%',
    borderRadius: 2,
  },
  knob: {
  },
  tickLarge: {
    height: 16,
    backgroundColor: getColor('border.default'),
  },
  thumb: {
    position: 'absolute',
    left: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: getColor('primary.500'),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputContainer: {
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: getColor('text.primary'),
    padding: 0,
  },
  unit: {
    marginLeft: 4,
    color: getColor('text.secondary'),
    fontSize: 14,
  },
});

export default WeightSlider;
