import React from 'react';
import {OnboardingData} from '../data/data';
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';

type Props = {
  data: OnboardingData[];
  screenWidth: number;
  axieX: SharedValue<number>;
};
export function Background({data, screenWidth, axieX}: Props) {
  const animatedBackgroundColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      Math.abs(axieX.value),
      [
        0,
        screenWidth / 2 - 0.0001,
        screenWidth / 2,
        (screenWidth * 3) / 2 - 0.0001,
        (screenWidth * 3) / 2,
      ],
      [
        data[0].backgroundColor,
        data[0].backgroundColor,
        data[1].backgroundColor,
        data[1].backgroundColor,
        data[2].backgroundColor,
      ],
    );
    return {backgroundColor};
  });
  return <Animated.View style={[styles.bg, animatedBackgroundColor]} />;
}

const styles = StyleSheet.create({
  bg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -999999,
  },
});
