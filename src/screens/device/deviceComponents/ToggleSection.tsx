import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

interface ToggleSectionProps {
  isMoving: boolean;
  toggleMoving: (value: boolean) => void;
  isReverse: boolean;
  toggleReverse: (value: boolean) => void;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({
  isMoving,
  toggleMoving,
  isReverse,
  toggleReverse,
}) => {
  return (
    <View style={styles.toggleSection}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Moving</Text>
        <Switch
          value={isMoving}
          onValueChange={toggleMoving}
          trackColor={{ false: 'black', true: 'cyan' }}
          thumbColor={isMoving ? 'black' : 'black'}
        />
      </View>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Reverse</Text>
        <Switch
          value={isReverse}
          onValueChange={toggleReverse}
          trackColor={{ false: 'black', true: 'cyan' }}
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
    color: 'cyan',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ToggleSection;