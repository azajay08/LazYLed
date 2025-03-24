import React from 'react';
import { View, StyleSheet } from 'react-native';

interface EffectGradientShadowProps {
  colors: string[];
  shadowRadius?: number; // defaults to 14
}

const EffectGradientShadow: React.FC<EffectGradientShadowProps> = ({ colors, shadowRadius = 14 }) => {
  const positionStyles = [
    StyleSheet.create({ pos: { top: 15, left: 15, shadowOffset: { width: -15, height: -15 } } }).pos, // top left
    StyleSheet.create({ pos: { top: 15, left: '33%', shadowOffset: { width: 0, height: -15 } } }).pos, // mid top
    StyleSheet.create({ pos: { top: 15, right: 15, shadowOffset: { width: 15, height: -15 } } }).pos, // top right
    StyleSheet.create({ pos: { top: '35%', right: 15, shadowOffset: { width: 15, height: 0 } } }).pos, // mid right
    StyleSheet.create({ pos: { bottom: 15, right: 15, shadowOffset: { width: 15, height: 15 } } }).pos, // bottom right
    StyleSheet.create({ pos: { bottom: 15, left: '33%', shadowOffset: { width: 0, height: 15 } } }).pos, // mid bottom
    StyleSheet.create({ pos: { bottom: 15, left: 15, shadowOffset: { width: -15, height: 15 } } }).pos, // bottom left
    StyleSheet.create({ pos: { bottom: '35%', left: 15, shadowOffset: { width: -15, height: 0 } } }).pos, // mid left
  ];

  return (
    <>
      {positionStyles.map((style, index) => (
        <View
          key={index}
          style={[
            styles.shadowSquare,
            style,
            {
              shadowColor: colors[index % colors.length],
              shadowRadius,
            },
          ]}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  shadowSquare: {
    width: '38%',
    height: '38%',
    position: 'absolute',
    backgroundColor: 'black',
    shadowOpacity: 1,
    elevation: 5,
    borderRadius: 10,
  },
});

export default EffectGradientShadow;