import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { fontFamilies } from "../constants/fonts";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const scale = useSharedValue(10); // Start HUGE
  const opacity = useSharedValue(0); // Light beams hidden initially
  const mirrorScaleX = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 1200 }); // Shrink Y and I
    opacity.value = withDelay(1300, withTiming(1, { duration: 800 })); // Fade beams
    mirrorScaleX.value = withTiming(-1, { duration: 0 }); // Apply mirroring instantly
    setTimeout(() => {
      onFinish();
    }, 5000);
  }, []);

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
      {/* Enlarged Light Beams */}
      <Animated.View style={[styles.lightBeam, styles.leftBeam, animatedLightStyle]}>
        <LinearGradient
          colors={["#ff66cc", "transparent", "transparent"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      <Animated.View style={[styles.lightBeam, styles.rightBeam, animatedLightStyle]}>
        <LinearGradient
          colors={["#66ffff", "transparent", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      

      {/* Big Letter Y and I */}
      <Animated.Text style={[styles.letterY, animatedYStyle ]}>Y</Animated.Text>
      <Animated.View style={[styles.vMask, animatedYStyle]} />
      {/* <Animated.Text style={[styles.letterI, animatedYStyle]}>I</Animated.Text> */}

      {/* Static Text: LAZ and LED */}
      <View>
        <Text style={styles.letterL}>L</Text>
        <Text style={styles.az}>AZ</Text>
        <Animated.Text style={[styles.reverseL, animatedLEDStyle]}>L</Animated.Text>
        <Animated.Text style={[styles.ed, animatedLEDStyle]}>ED</Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(10,15,20)",
    justifyContent: "center",
    alignItems: "center",
  },
  letterL: {
    fontSize: 100,
    fontFamily: fontFamilies.ORBITRON.black,
    color: "rgb(10,15,20)",
    fontWeight: "bold",
    position: "absolute",
    top: -35,
    right: 100,
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: -10, height: 10 },
  },
  reverseL: {
    fontSize: 100,
    color: "rgb(10,15,20)",
    fontFamily: fontFamilies.ORBITRON.black,
    fontWeight: "bold",
    position: "absolute",
    top: -35,
    left: 100, // Position before mirroring
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: -10, height: 10 },
  },
  az: {
    fontSize: 40,
    fontFamily: fontFamilies.ORBITRON.black,
    color: "rgb(10,15,20)",
    position: "absolute",
    top: 25,
    right: 30,
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: -10, height: 10 },
  },
  ed: {
    fontSize: 40,
    fontFamily: fontFamilies.ORBITRON.black,
    color: "rgb(10,15,20)",
    position: "absolute",
    top: 25,
    left: 30, // Position before mirroring
    shadowColor: "rgb(10,15,20)",
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: -10, height: 10 },
  },
  letterY: {
    fontFamily: fontFamilies.TRAINONE.normal,
    fontSize: 200,
    color: "#fff",
    fontWeight: "bold",
    position: "absolute",
    zIndex: 1,
    shadowColor: "white",
    shadowOpacity: 0.9,
    shadowRadius: 15,
  },
  letterI: {
    fontSize: 150,
    color: "rgb(10,15,20)",
    position: "absolute",
    bottom: 318,
    zIndex: 1,
  },
  lightBeam: {
    position: "absolute",
    width: width * 1.3,
    height: height * 0.183,
    borderRadius: 0,
    overflow: "hidden",
    top: height * 0.419,
    
  },
  leftBeam: {
    left: -width * 0.83,
    transform: [{ rotate: "-0deg" }],
    shadowColor: "#ff66cc",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  rightBeam: {
    right: -width * 0.83,
    transform: [{ rotate: "0deg" }],
  },
  gradient: {
    flex: 1,
  },
  vMask: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 65,
    borderRightWidth: 65,
    borderTopWidth: 120,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    // borderBottomColor: "rgb(10,15,20)",
    borderTopColor: "rgb(10,15,20)",
    top: height * 0.418,
    // zIndex: 1,
    transform: [{ rotate: "180deg" }],
    // borderTopColor: 'black',
    // borderBottomWidth: 1,
  },
});

export default SplashScreen;