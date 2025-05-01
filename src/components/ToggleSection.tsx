import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

interface ToggleSectionProps {
  isMoving: boolean;
  toggleMoving: (value: boolean) => void;
  isReverse: boolean;
  toggleReverse: (value: boolean) => void;
  blendOn?: boolean;
  toggleBlendOn?: (value: boolean) => void;
  styleColor?: string;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({
  isMoving,
  toggleMoving,
  isReverse,
  toggleReverse,
  blendOn,
  toggleBlendOn,
  styleColor = 'cyan'
}) => {
  return (
    <View style={styles.toggleSection}>
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, {color: styleColor}]}>Moving</Text>
        <Switch
          value={isMoving}
          onValueChange={toggleMoving}
          trackColor={{ false: 'black', true: styleColor }}
          thumbColor={isMoving ? 'black' : 'black'}
        />
      </View>
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, {color: styleColor}]}>Reverse</Text>
        <Switch
          value={isReverse}
          onValueChange={toggleReverse}
          trackColor={{ false: 'black', true: styleColor }}
          thumbColor={isReverse ? 'black' : 'black'}
        />
      </View>
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, {color: styleColor}]}>Blend</Text>
        <Switch
          value={blendOn}
          onValueChange={toggleBlendOn}
          trackColor={{ false: 'black', true: styleColor }}
          thumbColor={isReverse ? 'black' : 'black'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 50,
  },
  toggleContainer: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  toggleLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ToggleSection;