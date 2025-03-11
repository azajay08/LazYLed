// Temporary effects page for testing purposes

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useDeviceStore from '../stores/deviceStore';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DeviceStackParamList } from './DeviceStackScreen';
import { Effect } from '../stores/deviceStore';

interface EffectsPageProps {
  route: RouteProp<DeviceStackParamList, 'EffectsPage'>;
  navigation: StackNavigationProp<DeviceStackParamList, 'EffectsPage'>;
}

const EffectsPage: React.FC<EffectsPageProps> = ({ route }) => {
  const { deviceIp } = route.params;
  const device = useDeviceStore(state => state.devices[deviceIp]);
  const [expandedEffect, setExpandedEffect] = useState<number | null>(null);
  const animationValues = useRef<Record<number, Animated.Value>>({}).current;

  const effectsList = device ? device.effectsList : [];

  useEffect(() => {
    if (!device) {
      console.log('Device data not available');
    }
  }, [device]);

  const toggleExpand = (effect: Effect) => {
    const effectId = effect.functionNumber;

    if (!animationValues[effectId]) {
      animationValues[effectId] = new Animated.Value(0);
    }

    const isCurrentlyExpanded = expandedEffect === effectId;
    setExpandedEffect(isCurrentlyExpanded ? null : effectId);

    Animated.timing(animationValues[effectId], {
      toValue: isCurrentlyExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {effectsList.length > 0 ? (
          effectsList.map((effect: Effect) => {
            const effectId = effect.functionNumber;
            const animationValue = animationValues[effectId] || new Animated.Value(0);

            const animatedHeight = animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [60, 120], // Adjusted height—gradients only
            });

            return (
              <Pressable key={effectId} onPress={() => toggleExpand(effect)}>
                <Animated.View
                  style={[styles.pressableContainer, { height: animatedHeight }]}
                >
                  <Text style={styles.pressableText}>{effect.name}</Text>
                  <View style={styles.effectSampleContainer}>
                    <LinearGradient
                      colors={effect.sampleGradient || ['white', 'gray']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.effectSample}
                    />
                  </View>
                </Animated.View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.noEffectsContainer}>
            <Text style={styles.noEffectsText}>No effects available</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'rgb(10,15,20)',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(10,15,20)',
  },
  pressableContainer: {
    alignItems: 'center' as const,
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  },
  pressableText: {
    fontSize: 15,
    color: 'cyan',
  },
  effectSampleContainer: {
    position: 'absolute' as const,
    bottom: 5,
    left: 0,
    right: 0,
  },
  effectSample: {
    height: 3,
    borderRadius: 100,
  },
  noEffectsContainer: {
    padding: 10,
    backgroundColor: 'rgba(10, 15, 20, 0.8)',
    borderRadius: 8,
  },
  noEffectsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center' as const,
  },
});

export default EffectsPage;