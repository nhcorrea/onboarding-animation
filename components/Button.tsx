import React from 'react';
import {OnboardingData} from '../data/data';
import {Pressable, StyleSheet} from 'react-native';

import Arrow from '../assets/icon/Arrow.svg';
import Animated, {
  Extrapolation,
  SharedValue,
  clamp,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  data: OnboardingData[];
  screenWidth: number;
  axieX: SharedValue<number>;
  currentIndex: number;
};

export function Button({data, axieX, screenWidth, currentIndex}: Props) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const animatedOpacityButton = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(axieX.value % screenWidth),
      [0, 40],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
    };
  });
  return (
    <AnimatedPressable
      onPress={() => {
        if (Math.abs(axieX.value) % screenWidth === 0) {
          const clampValue = clamp(
            Math.abs(axieX.value) + screenWidth,
            0,
            2 * screenWidth,
          );

          axieX.value = withTiming(-clampValue, {duration: 1000});
        }
      }}
      style={[styles.button, animatedOpacityButton]}>
      <Arrow
        stroke={data[currentIndex].backgroundColor}
        width={40}
        height={40}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    zIndex: 999999,
  },
});
