import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import useDeviceStore from '../stores/deviceStore';
import { hexToHsv } from '../utils/hexToHsv';
import { debounce } from '../utils/debounce';
import LedStrip from '../components/LedStrip';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DeviceStackParamList } from './DeviceStackScreen';

interface ColorPickerScreenProps {
  route: RouteProp<DeviceStackParamList, 'ColorPicker'>;
  navigation: StackNavigationProp<DeviceStackParamList, 'ColorPicker'>;
}

interface HsvColor {
  h: number;
  s: number;
  v: number;
}

const ColorPickerScreen: React.FC<ColorPickerScreenProps> = ({ route }) => {
  const { deviceIp } = route.params;
  const { setSelectedColor, setColor } = useDeviceStore();
  const device = useDeviceStore((state) => state.devices[deviceIp]);
  const selectedColor = device?.selectedColor || '#FFFFFF';

  const [hsvColor, setHsvColor] = useState<HsvColor>({ h: 0, s: 100, v: 100 });
  const [userInteracted, setUserInteracted] = useState(false);

  const handleColorChange = (color: string) => {
    setSelectedColor(deviceIp, color);
    const hsv = hexToHsv(color);
    setHsvColor(hsv);

    if (userInteracted) {
      debouncedSetColor(deviceIp, hsv);
    }
  };

  const debouncedSetColor = useCallback(
    debounce((ip: string, hsv: HsvColor) => {
      setColor(ip, hsv);
    }, 50),
    [setColor]
  );

  const handleInteractionStart = () => {
    setUserInteracted(true);
  };

  // const handleColorReset = () => {
  //   setHsvColor(hexToHsv(selectedColor));
  // };

  return (
    <View style={styles.container}>
      <LedStrip selectedColor={selectedColor} />
      <View style={{ marginBottom: 40, flex: 1 }}>

      <ColorPicker
        color={selectedColor}
        onColorChange={handleColorChange}
        onInteractionStart={handleInteractionStart}
        thumbSize={50}
        sliderSize={20}
        sliderHidden={false}
        noSnap={true}
        row={false}
        wheelLoadingIndicator={<ActivityIndicator />}
        sliderLoadingIndicator={<ActivityIndicator />}
        shadeWheelThumb={true}
        shadeSliderThumb={true}
        swatches={true}
        useNativeLayout={true}
        gapSize={30}
        />
      <Text style={[styles.colorText, { color: selectedColor }]}>
        {selectedColor}
        </Text>
        <Text style={styles.hsvText}>
        HSV: {`H: ${hsvColor.h}, S: ${hsvColor.s}, V: ${hsvColor.v}`}
        </Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    padding: 20,
    backgroundColor: 'rgb(10,15,20)',
  },
  colorText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  hsvText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFF',
  },
});

export default ColorPickerScreen;