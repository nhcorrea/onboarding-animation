import React from 'react';
import {OnboardingData} from '../data/data';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';

type Props = {
  data: OnboardingData[];
  screenWidth: number;
  axieX: SharedValue<number>;
};
export function Circle({data, screenWidth, axieX}: Props) {
  const animatedBackgroundColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      Math.abs(axieX.value),
      [
        0,
        screenWidth / 2 - 0.0001,
        screenWidth / 2,
        screenWidth - 10,
        screenWidth,
        (screenWidth * 3) / 2 - 0.0001,
        (screenWidth * 3) / 2,
        screenWidth * 2 - 10,
        screenWidth * 2,
      ],
      [
        data[1].backgroundColor,
        data[1].backgroundColor,
        data[0].backgroundColor,
        data[0].backgroundColor,
        data[2].backgroundColor,
        data[2].backgroundColor,
        data[1].backgroundColor,
        data[1].backgroundColor,
        data[0].backgroundColor,
      ],
    );
    return {backgroundColor};
  });

  const animatedTransformCircle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      Math.abs(axieX.value % screenWidth),
      [0, screenWidth],
      [0, -180],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      Math.abs(axieX.value % screenWidth),
      [0, screenWidth / 2, screenWidth],
      [1, 8, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{perspective: 300}, {rotateY: `${rotateY}deg`}, {scale}],
    };
  });
  return (
    <Animated.View
      style={[styles.circle, animatedTransformCircle, animatedBackgroundColor]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    zIndex: 1,
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'white',
  },
});
