import React from 'react';
import { View, StyleSheet } from 'react-native';

// implement different strips of LED lights

interface LedStripProps {
  selectedColor: string;
}

const LedStrip: React.FC<LedStripProps> = ({ selectedColor }) => {
  const ledStripLayers = [1, 2, 3];

  return (
    <>
      {ledStripLayers.map((_, index) => (
        <View
          key={index}
          style={[
            styles.ledStrip,
            {
              shadowColor: selectedColor,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 12 },
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.ledStrip,
          {
            shadowColor: selectedColor,
            shadowRadius: 8,
            shadowOffset: { width: -20, height: 12 },
          },
        ]}
      />
      <View
        style={[
          styles.ledStrip,
          {
            shadowColor: selectedColor,
            shadowRadius: 8,
            shadowOffset: { width: 20, height: 12 },
          },
        ]}
      />
      {ledStripLayers.map((_, index) => (
        <View
          key={index}
          style={[
            styles.ledStrip,
            {
              backgroundColor: selectedColor,
              shadowColor: selectedColor,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 18 },
            },
          ]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  ledStrip: {
    position: 'absolute' as const,
    top: 25,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    shadowOpacity: 1,
  },
});

export default LedStrip;