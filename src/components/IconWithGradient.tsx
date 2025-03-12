import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface IconWithGradientProps {
  iconName: string;
  size: number;
  selectedColor: string;
  effect: string;
}

const IconWithGradient: React.FC<IconWithGradientProps> = ({ iconName, size, selectedColor, effect }) => {
  const gradientColors = ['#ff8700', '#00fff3', '#f000ff'];
  const solidColorGradient = [selectedColor, '#ffffff', selectedColor];

  if (!effect || effect === "LEDs Off" || effect === "Unavailable") {
    return <MaterialCommunityIcons name={iconName} size={size} color="rgba(255, 255, 255, 0.7)" />;
  }
  if (effect === "Solid Color") {
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
        colors={solidColorGradient}
        start={{ x: 0.1, y: 0.25 }}
        end={{ x: 0.03, y: 0.5 }}
        style={styles.gradient}
      />
    </MaskedView>
    );
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
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  gradient: {
    width: 70,
    height: 70,
  },
});

export default IconWithGradient;