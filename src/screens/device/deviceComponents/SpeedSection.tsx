import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface SpeedSectionProps {
  speed: number;
  setSpeed: (value: number) => void;
}

const SpeedSection: React.FC<SpeedSectionProps> = ({ speed, setSpeed }) => {
  return (
    <View style={styles.speedSection}>
      <Text style={styles.label}>Speed: {speed}</Text>
      <Slider
        value={speed}
        onValueChange={setSpeed}
        minimumValue={0}
        maximumValue={50}
        step={1}
        style={styles.slider}
        thumbTintColor="cyan"
        minimumTrackTintColor="cyan"
        maximumTrackTintColor="black"
        tapToSeek={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  speedSection: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    padding: 20,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  label: {
    color: 'cyan',
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 10,
  },
});

export default SpeedSection;