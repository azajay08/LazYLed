import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import useDeviceStore from '../../../stores/deviceStore';
import { debounce } from '../../../utils/debounce';

interface BrightnessSliderProps {
  deviceIp: string;
}

const BrightnessSlider: React.FC<BrightnessSliderProps> = ({ deviceIp }) => {
  const { toggleOnOff } = useDeviceStore();
  const device = useDeviceStore((state) => state.devices[deviceIp]);
  const brightness = useDeviceStore((state) => state.devices[deviceIp]?.brightness);
  const { setBrightness } = useDeviceStore();

  const displayBrightness = device?.effectName === 'LEDs Off' ? 0 : brightness;
  const isOff =
    device?.effectName === 'LEDs Off'
    || device?.effectName === "Unknown"
    || device?.effectName === "Unavailable"
    || brightness === 0;

  const debouncedSetBrightness = useCallback(
    debounce((value: number) => {
      setBrightness(deviceIp, value);
    }, 50),
    [setBrightness, deviceIp]
  );

  const handleOnOff = (value: number) => {
    if (value === 0 && !isOff) {
      toggleOnOff(deviceIp);
    }
    if (value !== 0 && isOff) {
      toggleOnOff(deviceIp);
      // isOff = false;
    }
  }

  const handleSliderChange = (value: number) => {
    handleOnOff(value);
    debouncedSetBrightness(value);
  };

  useEffect(() => {
    if (brightness !== undefined) {
      // No-op for now—keeps slider in sync if needed
    }
  }, [brightness]);

  return (
    <View style={styles.container}>
      {/* <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={'cyan'} style={{ padding: 5 }} /> */}
      <Slider
        style={styles.slider}
        value={displayBrightness ?? 0} // Default to 0 if undefined
        onValueChange={handleSliderChange}
        tapToSeek={true}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor={'cyan'}
        maximumTrackTintColor="rgb(10,15,20)"
        thumbTintColor={'cyan'}
      />
      {isOff ?
        <MaterialCommunityIcons name="lightbulb-off" size={23} color={'cyan'} style={styles.offBulb} /> :
      
        <MaterialCommunityIcons name="lightbulb-on" size={25} color={'cyan'} style={styles.onBulb} />
      
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 2,
  },
  slider: {
    width: "90%",
    height: 30,
    shadowColor: 'cyan',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  onBulb: {
    padding: 5,
    shadowColor: 'cyan',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  offBulb: {
    padding: 5,
  },
});

export default BrightnessSlider;