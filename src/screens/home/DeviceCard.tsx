import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconWithGradient from '../../components/IconWithGradient';
import { Device } from '../../stores/deviceStore';
import EffectShadow from './EffectShadow';

interface DeviceCardProps {
  device: Device & { ip: string };
  onPress: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress }) => {
  const getDeviceShadow = (device: Device) => {
    const effectName = device.effectName || 'Unknown';
    if (effectName === 'Solid Color' && device.selectedColor) {
      return {
        shadowColor: device.selectedColor,
        shadowOpacity: 1,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
        elevation: 5,
      };
    }
    return {};
  };

  const isEffect =
    device.effectName &&
    device.effectName !== 'LEDs Off' &&
    device.effectName !== 'Unknown' &&
    device.effectName !== 'Solid Color';

  return (
    <TouchableOpacity onPress={onPress} style={styles.deviceWrapper}>
      {isEffect && <EffectShadow />}
      <View style={[styles.deviceContainer, getDeviceShadow(device)]}>
        <Text
          style={[
            styles.deviceTitle,
            device.effectName && device.effectName !== 'LEDs Off' && { color: 'white' },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {device.deviceName || 'Unknown'}
        </Text>
        <IconWithGradient
          iconName="led-strip-variant"
          size={70}
          selectedColor={device.selectedColor}
          effect={device.effectName || 'LEDs Off'}
        />
        <Text style={styles.sectionText}>{device.effectName || 'Off'}</Text>
        {device.effectName !== 'LEDs Off' && (
          <Text style={styles.sectionText}>{device.brightness || 0}%</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deviceWrapper: {
    width: 150,
    height: 150,
    marginBottom: 20,
    position: 'relative',
  },
  deviceContainer: {
    width: 150,
    height: 150,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 20,
    justifyContent: 'center',
    zIndex: 1,
  },
  deviceTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 130, // Slightly less than container width
  },
  sectionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  shadowSquare: { // Included for reference, not used directly here
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

export default DeviceCard;