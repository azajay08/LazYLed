import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import useDeviceStore from '../stores/deviceStore';
import OnOffButton from './OnOffButton';
import DropdownComponent from './DropdownComponent';
import BrightnessSlider from './BrightnessSlider';
import { StackNavigationProp } from '@react-navigation/stack';
import { DeviceStackParamList } from '../screens/DeviceStackScreen';
import { Device } from '../stores/deviceStore';

interface DeviceItemProps {
  deviceIp: string;
  device: Device;
  navigation: StackNavigationProp<DeviceStackParamList, 'DevicePage'>;
}

const DeviceItem: React.FC<DeviceItemProps> = memo(({ deviceIp, device, navigation }) => {
  const { cycleEffect } = useDeviceStore();
  const isEffectRunning = device.effectName && device.effectName !== "Solid Color" && device.effectName !== "LEDs Off" && device.effectName !== "Unavailable";
  const isDeviceOn = device.effectName && device.effectName !== "LEDs Off" && device.effectName !== "Unavailable";

  const renderCircle = () => {
    if (isEffectRunning) {
      const gradientColors=['#ff8700', '#00fff3', '#f000ff']
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.25, y: 0.25 }}
          end={{ x: 0.75, y: 0.75 }}
          style={styles.circle}
        />
      );
    }
    if (!isDeviceOn) {
      return (
        <View
          style={[styles.circle, { backgroundColor: '#000000' }]}
        />
      );
    }
    return (
      <View
        style={[styles.circle, { backgroundColor: device.color || '#000000' }]}
      />
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{device.deviceName || 'Unnamed Device'}</Text>
      <Text style={styles.sectionContent}>Effect: {device.effectName || 'None'}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('ColorPicker', { deviceIp })}>
        {renderCircle()}
      </TouchableOpacity>

      <View style={styles.effectContainer}>
        <TouchableOpacity
          onPress={() => cycleEffect(deviceIp)}
          style={styles.pressableContainer}
        >
          <MaterialIcons name="loop" size={20} color="cyan" style={styles.icon} />
          <Text style={styles.pressableText}>Cycle Effect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EffectsPage', { deviceIp })}
          style={styles.pressableContainer}
        >
          <Text style={styles.pressableText}>Effects</Text>
        </TouchableOpacity>
      </View>

      <BrightnessSlider  deviceIp={deviceIp} />

      <View style={styles.onOffButtonContainer}>
        <OnOffButton isOnOff={device.effectName || 'LEDs Off'} deviceIp={deviceIp} />
      </View>

      <DropdownComponent deviceIp={deviceIp} />
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.deviceIp === nextProps.deviceIp &&
         prevProps.device === nextProps.device &&
         prevProps.navigation === nextProps.navigation;
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: 'rgb(0, 255, 255)',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  effectContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 5,
    justifyContent: 'space-between' as const,
  },
  pressableContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 8,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 10,
  },
  pressableText: {
    fontSize: 15,
    color: 'cyan',
  },
  icon: {
    marginLeft: -2,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: 'cyan',
  },
  onOffButtonContainer: {
    position: 'absolute' as const,
    top: 15,
    right: 15,
  },
});

export default DeviceItem;