import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { fontFamilies } from "../constants/fonts";

const neonPalette = {
  cyan: "#34e5eb",
  pink: "#eb34c0",
  orange: "#eb8334",
};

const ANIMATION_DURATIONS = {
  scale: 1200,
  opacityDelay: 3000,
  fadeOut: 8000,
};

const SplashScreen = ({ onFinish = () => {} }: { onFinish?: () => void }) => {
  // Animation values
  const scale = useSharedValue(10);
  const opacity = useSharedValue(0);
  const mirrorScaleX = useSharedValue(1);
  const lPos = useSharedValue(0);
  const letterOpacity = useSharedValue(0);
  const lOpacity = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1, { duration: ANIMATION_DURATIONS.scale })
    );
    opacity.value = withDelay(
      ANIMATION_DURATIONS.opacityDelay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1800 }), // Glow bright
          withDelay(100, withTiming(0, { duration: 800 })), // Dim
          withTiming(1, { duration: 1200 }) // Glow back
        ),
        1
      )
    );
    mirrorScaleX.value = withTiming(-1, { duration: 0 });
    lPos.value = withDelay(2800, withTiming(-70, { duration: 2000 }));
    letterOpacity.value = withDelay(3200, withTiming(1, { duration: 2800 }));
    lOpacity.value = withDelay(2000, withTiming(1, { duration: 1800 }));
    fadeOut.value = withDelay(ANIMATION_DURATIONS.fadeOut, withTiming(0, { duration: 2000 }));

    const timeout = setTimeout(() => {
      onFinish();
    }, 9000);

    return () => clearTimeout(timeout);
  }, []);

  // Animated styles
  const animatedYStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedLightStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedLStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lPos.value }],
  }));

  const animatedReverseLStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: mirrorScaleX.value }, { translateX: lPos.value }],
  }));

  const animatedEDStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: mirrorScaleX.value }],
    opacity: letterOpacity.value,
  }));

  const animatedAZStyle = useAnimatedStyle(() => ({
    opacity: letterOpacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: lOpacity.value,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: opacity.value,
  }));

  const renderText = (text: string, style: any, count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Animated.Text key={index} style={style}>
        {text}
      </Animated.Text>
    ));
  };

  return (
    <View style={styles.container} accessible accessibilityLabel="Splash Screen">
      {/* Text Elements */}
      {renderText("Y", [styles.letterY, styles.yGlowBase, animatedYStyle], 1)}
      {renderText("Y", [styles.letterY, styles.yGlowMid, animatedYStyle, animatedLightStyle], 1)}
      {renderText("Y", [styles.letterY, styles.yGlowOuter, animatedYStyle, animatedLightStyle], 1)}

      <View style={styles.textContainer}>
        {renderText("L", [styles.letterL, animatedTextStyle, animatedLStyle, animatedGlowStyle], 3)}
        {renderText("AZ", [styles.az, animatedAZStyle, animatedGlowStyle], 3)}
        {renderText("L", [styles.reverseL, animatedTextStyle, animatedReverseLStyle, animatedGlowStyle], 3)}
        {renderText("ED", [styles.ed, animatedEDStyle, animatedGlowStyle], 3)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base Styles
  container: {
    flex: 1,
    backgroundColor: "rgb(10,15,20)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Text Styles
  textContainer: {
    position: "absolute",
  },
  letterY: {
    fontFamily: fontFamilies.TRAINONE.normal,
    fontSize: 200,
    color: "#fff",
    // fontWeight: "bold",
    position: "absolute",
    zIndex: 1,
  },
  yGlowBase: {
    shadowColor: neonPalette.cyan,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  yGlowMid: {
    shadowColor: neonPalette.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 25,
    shadowOffset: { width: 1, height: 1 },
  },
  yGlowOuter: {
    shadowColor: neonPalette.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width: 2, height: 2 },
  },
  letterL: {
    fontSize: 100,
    fontFamily: fontFamilies.ORBITRON.normal,
    color: "white",
    position: "absolute",
    top: -35,
    right: 30,
    shadowColor: neonPalette.pink,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  reverseL: {
    fontSize: 100,
    fontFamily: fontFamilies.ORBITRON.normal,
    color: "white",
    position: "absolute",
    top: -35,
    left: 30,
    shadowColor: neonPalette.orange,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  az: {
    fontSize: 40,
    fontFamily: fontFamilies.ORBITRON.bold,
    color: "white",
    position: "absolute",
    top: 25,
    right: 30,
    shadowColor: neonPalette.pink,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  ed: {
    fontSize: 40,
    fontFamily: fontFamilies.ORBITRON.bold,
    color: "white",
    position: "absolute",
    top: 25,
    left: 30,
    shadowColor: neonPalette.orange,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});

export default SplashScreen;