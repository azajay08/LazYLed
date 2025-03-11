// Settings page - Needs updating
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(10,15,20)',
  },
  text: {
    fontSize: 24,
    color: 'rgb(255, 165, 0)',
  },
});

export default SettingsScreen;