import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import data from './data/data';
import {RenderItem} from './components/RenderItem';
import {Button} from './components/Button';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Background} from './components/Background';
import {Circle} from './components/Circle';

function App(): React.JSX.Element {
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const axieX = useSharedValue(0);
  const context = useSharedValue(0);

  const translateXStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: axieX.value}],
    };
  });

  useAnimatedReaction(
    () => {
      return Math.floor(Math.abs(axieX.value) / SCREEN_WIDTH);
    },
    (current, prev) => {
      if (current !== prev) {
        runOnJS(setCurrentIndex)(current);
      }
    },
  );

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      context.value = Math.abs(axieX.value);
    })
    .onUpdate(event => {
      const clampValue = clamp(
        context.value - event.translationX,
        0,
        2 * SCREEN_WIDTH,
      );
      axieX.value = -clampValue;
    })
    .onEnd(event => {
      const isSwipeLeft = event.translationX < 0;
      const isSwipeRight = event.translationX > 0;
      const isBeyondLeftLmit =
        context.value < 2 * SCREEN_WIDTH && currentIndex <= 1;
      const isBeyondRightLimit = context.value > 0;

      let targetIndex;

      if (isSwipeLeft && isBeyondLeftLmit) {
        targetIndex =
          event.translationX < -SCREEN_WIDTH / 2 || event.velocityX > -500
            ? currentIndex + 1
            : currentIndex;
      } else if (isSwipeRight && isBeyondRightLimit) {
        targetIndex =
          event.translationX > SCREEN_WIDTH / 2 || event.velocityX > 500
            ? currentIndex
            : currentIndex + 1;
      }

      if (targetIndex !== undefined) {
        axieX.value = withTiming(-SCREEN_WIDTH * targetIndex, {duration: 500});
      }
    });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Circle data={data} screenWidth={SCREEN_WIDTH} axieX={axieX} />
        <Background data={data} screenWidth={SCREEN_WIDTH} axieX={axieX} />
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.listContainer,
              {
                width: data.length * SCREEN_WIDTH,
              },
              translateXStyle,
            ]}>
            {data.map((item, index) => {
              return (
                <RenderItem
                  key={index}
                  index={index}
                  item={item}
                  axieX={axieX}
                />
              );
            })}
          </Animated.View>
        </GestureDetector>
        <Button
          data={data}
          screenWidth={SCREEN_WIDTH}
          axieX={axieX}
          currentIndex={currentIndex}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 999999,
  },
});
