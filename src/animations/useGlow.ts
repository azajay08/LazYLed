import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

export default function useGlow(
  active: boolean,
  minOpacity = 0.3,
  maxOpacity = 0.9,
  duration = 1200
) {
  const glow = useSharedValue(minOpacity);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value,
  }));

  useEffect(() => {
    if (active) {
      glow.value = withRepeat(
        withTiming(maxOpacity, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      cancelAnimation(glow);
      glow.value = withTiming(minOpacity, { duration: 300 }); // Fade back down
    }
  }, [active]);

  return glowStyle;
}
