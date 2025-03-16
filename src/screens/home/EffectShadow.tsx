import React from "react";
import { View, StyleSheet} from 'react-native';

const EffectShadow: React.FC = () => {
  return (
    <>
      <View
        style={[
          styles.shadowSquare,
          styles.topLeft,
          { backgroundColor: 'black', shadowColor: '#f000ff' },
        ]}
        />
      <View
        style={[
          styles.shadowSquare,
          styles.topRight,
          { backgroundColor: 'black', shadowColor: '#0000ff' },
        ]}
        />
      <View
        style={[
          styles.shadowSquare,
          styles.bottomLeft,
          { backgroundColor: 'black', shadowColor: '#ff8700' },
        ]}
        />
      <View
        style={[
          styles.shadowSquare,
          styles.bottomRight,
          { backgroundColor: 'black', shadowColor: '#00fff3' },
        ]}
      />
    </>
  )
}

const styles = StyleSheet.create({
  shadowSquare: {
    width: 100,
    height: 100,
    position: 'absolute',
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 5,
    borderRadius: 10,
  },
  topLeft: {
    top: 15,
    left: 15,
    shadowOffset: { width: -15, height: -15 },
  },
  topRight: {
    top: 15,
    right: 15,
    shadowOffset: { width: 15, height: -15 },
  },
  bottomLeft: {
    bottom: 15,
    left: 15,
    shadowOffset: { width: -15, height: 15 },
  },
  bottomRight: {
    bottom: 15,
    right: 15,
    shadowOffset: { width: 15, height: 15 },
  },
});

export default EffectShadow;