import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { fontFamilies } from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  // Animation values
  const scale = useSharedValue(10);
  const opacity = useSharedValue(0);
  const mirrorScaleX = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 1200 });
    opacity.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }), // Glow bright
          withTiming(0.1, { duration: 800 }), // Dim
          withTiming(1, { duration: 1200 }) // Glow back
        ),
        1,
      )
    );
    mirrorScaleX.value = withTiming(-1, { duration: 0 });
    setTimeout(() => {
      onFinish();
    }, 8000);
  }, []);

  // Animated styles
  const animatedYStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedLightStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedLEDStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: mirrorScaleX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Light Beams */}
      <Animated.View style={[styles.lightBeam, styles.leftBeam, animatedLightStyle]}>
        <LinearGradient
          colors={["#ff008c", "#b700ff", "#00fffb"]}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 0.75 }}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[styles.lightBeam, styles.rightBeam, animatedLightStyle]}>
        <LinearGradient
          colors={["#ff004c", "#ff0000", "#ff6f00", "#00fffb"]}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 0.75 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Masks */}
      <View style={styles.bottomTriangle} />
      <View style={styles.topTriangle} />
      <Animated.View style={[styles.vMask, animatedYStyle]} />

      {/* Block Gradients */}
      <View style={styles.topRightBlockGradient}>
        <LinearGradient
          colors={["rgb(10,15,20)", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      <View style={styles.topLeftBlockGradient}>
        <LinearGradient
          colors={["rgb(10,15,20)", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      <View style={styles.bottomRightBlockGradient}>
        <LinearGradient
          colors={["transparent", "rgb(10,15,20)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      <View style={styles.bottomLeftBlockGradient}>
        <LinearGradient
          colors={["transparent", "rgb(10,15,20)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </View>
      <View style={styles.leftBlockGradient}>
        <LinearGradient
          colors={["rgb(10,15,20)", "transparent"]}
          start={{ x: 0.3, y: 1 }}
          end={{ x: 1, y: 0.98 }}
          style={styles.gradient}
        />
      </View>
      <View style={styles.rightBlockGradient}>
        <LinearGradient
          colors={["rgb(10,15,20)", "transparent"]}
          start={{ x: 0.9, y: 1 }}
          end={{ x: 0, y: 0.98 }}
          style={styles.gradient}
        />
      </View>

      {/* Text Elements */}
      <Animated.Text style={[styles.letterY, styles.yGlowBase, animatedYStyle]}>
        Y
      </Animated.Text>
      <Animated.Text style={[styles.letterY, styles.yGlowMid, animatedYStyle, animatedLightStyle]}>
        Y
      </Animated.Text>
      <Animated.Text style={[styles.letterY, styles.yGlowOuter, animatedYStyle, animatedLightStyle]}>
        Y
      </Animated.Text>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.letterL, animatedLightStyle]}>L</Animated.Text>
        <Animated.Text style={[styles.az, animatedLightStyle]}>AZ</Animated.Text>
        <Animated.Text style={[styles.reverseL, animatedLEDStyle, animatedLightStyle]}>
          L
        </Animated.Text>
        <Animated.Text style={[styles.ed, animatedLEDStyle, animatedLightStyle]}>
          ED
        </Animated.Text>
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
  gradient: {
    flex: 1,
  },

  // Light Beams
  lightBeam: {
    position: "absolute",
    width: width * 1.3,
    height: height * 0.5,
    top: height * 0.25,

  },
  leftBeam: {
    left: -width * 0.83,
  },
  rightBeam: {
    right: -width * 0.83,
  },

  // Masks
  vMask: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 65,
    borderRightWidth: 65,
    borderTopWidth: 120,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgb(10,15,20)",
    top: height * 0.418,
    transform: [{ rotate: "180deg" }],
  },
  bottomTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 280,
    borderRightWidth: 280,
    borderTopWidth: 180,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgb(10,15,20)",
    top: height * 0.59,
    transform: [{ rotate: "180deg" }],
  },
  topTriangle: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 400,
    borderRightWidth: 400,
    borderTopWidth: 180,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgb(10,15,20)",
    top: height * 0.245,
  },

  // Block Gradients
  leftBlockGradient: {
    position: "absolute",
    width: width * 0.6,
    height: height,
    top: 0,
    left: width * -0.1,
  },
  rightBlockGradient: {
    position: "absolute",
    width: width * 0.6,
    height: height,
    top: 0,
    right: width * -0.1,
  },
  bottomLeftBlockGradient: {
    position: "absolute",
    width: width * 0.75,
    height: height * 0.05,
    top: height * 0.634,
    left: width * -0.2,
    transform: [{ rotate: "-32deg" }],
  },
  bottomRightBlockGradient: {
    position: "absolute",
    width: width * 0.75,
    height: height * 0.05,
    top: height * 0.634,
    right: width * -0.2,
    transform: [{ rotate: "32deg" }],
  },
  topLeftBlockGradient: {
    position: "absolute",
    width: width * 0.75,
    height: height * 0.05,
    top: height * 0.388,
    left: width * -0.2,
    transform: [{ rotate: "23deg" }],
  },
  topRightBlockGradient: {
    position: "absolute",
    width: width * 0.75,
    height: height * 0.05,
    top: height * 0.388,
    right: width * -0.2,
    transform: [{ rotate: "-23deg" }],
  },

  // Text Styles
  textContainer: {
    position: "absolute",
  },
  letterY: {
    fontFamily: fontFamilies.TRAINONE.normal,
    fontSize: 200,
    color: "#fff",
    fontWeight: "bold",
    position: "absolute",
    zIndex: 1,
  },
  yGlowBase: {
    shadowColor: "white",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  yGlowMid: {
    shadowColor: "white",
    shadowOpacity: 0.9,
    shadowRadius: 25,
    shadowOffset: { width: 1, height: 1 },
  },
  yGlowOuter: {
    shadowColor: "#ff004c",
    shadowOpacity: 0.8,
    shadowRadius: 30,
    shadowOffset: { width: 2, height: 2 },
  },
  letterL: {
    fontSize: 100,
    fontFamily: fontFamilies.ORBITRON.normal,
    color: "rgb(10,15,20)",
    position: "absolute",
    top: -35,
    right: 100,
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: -5, height: 5 },
  },
  reverseL: {
    fontSize: 100,
    fontFamily: fontFamilies.ORBITRON.normal,
    color: "rgb(10,15,20)",
    position: "absolute",
    top: -35,
    left: 100,
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: -5, height: 5 },
  },
  az: {
    fontSize: 40,
    fontFamily: fontFamilies.ORBITRON.normal,
    color: "rgb(10,15,20)",
    position: "absolute",
    top: 25,
    right: 30,
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: -5, height: 5 },
  },
  ed: {
    fontSize: 40,
    fontFamily: fontFamilies.ORBITRON.normal,
    color: "rgb(10,15,20)",
    position: "absolute",
    top: 25,
    left: 30,
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: -5, height: 5 },
  },
});

export default SplashScreen;