import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconWithGradient from '../../components/IconWithGradient';
import { Device } from '../../stores/deviceStore';
import EffectShadow from './EffectShadow';

interface HomeDeviceCardProps {
  device: Device & { ip: string };
  onPress: () => void;
}

const HomeDeviceCard: React.FC<HomeDeviceCardProps> = ({ device, onPress }) => {
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
    if (effectName === 'LEDs Off' || effectName === 'Unknown') {
      return {
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 10, height: 10 },
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
        <IconWithGradient
          iconName="led-strip-variant"
          size={40}
          selectedColor={device.selectedColor}
          effect={device.effectName || 'LEDs Off'}
        />
        <View style={styles.textWrapper}>

        <Text
          style={[
            styles.deviceTitle,
            device.effectName && device.effectName !== 'LEDs Off' && { color: 'white' },
          ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          
          // minimumFontScale={0.1}
          >
            {device.deviceName || 'Unknown'}
        </Text>
          <Text style={
            styles.sectionText
          }
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.}
          >{
            device.effectName || 'Off'}
          </Text>
        {device.effectName !== 'LEDs Off' && (
          <Text style={styles.sectionText}>{device.brightness || 0}%</Text>
        )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deviceWrapper: {
    width: 150,
    height: 75,
    marginBottom: 20,
    position: 'relative',
  },
  deviceContainer: {
    width: "100%",
    height: "100%",
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgb(10, 15, 20)',
    borderRadius: 20,
    borderWidth: 0.5,
    flexDirection: 'row',
    zIndex: 1,
  },
  textWrapper: {
    marginLeft: 5
  },
  deviceTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 85,
    marginBottom: 2
  },
  sectionText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 85
  },
});

export default HomeDeviceCard;