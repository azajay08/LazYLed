import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface IconWithGradientProps {
  iconName: string;
  size: number;
  gradientColors: string[];
  effect: string;
}

const IconWithGradient: React.FC<IconWithGradientProps> = ({ iconName, size, gradientColors, effect }) => {
  if (!effect || effect === "LEDs Off" || effect === "Unavailable") {
    return <MaterialCommunityIcons name={iconName} size={size} color="white" />;
  }
  return (
    <MaskedView
      style={styles.iconContainer}
      maskElement={
        <MaterialCommunityIcons
          name={iconName}
          size={size}
          color="white"
        />
      }
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.1, y: 0.25 }}
        end={{ x: 0, y: 0.75 }}
        style={styles.gradient}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: 70,
    height: 70,
  },
});

export default IconWithGradient;