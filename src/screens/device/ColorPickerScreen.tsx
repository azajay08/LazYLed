import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import useDeviceStore, { HsvColor } from '../../stores/deviceStore';
import { hexToHsv } from '../../utils/hexToHsv';
import { debounce } from '../../utils/debounce';
import LedStrip from './deviceComponents/LedStrip';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DeviceStackParamList } from './DeviceStackScreen';
import  FavoriteColors from '../../components/FavoriteColors';

interface ColorPickerScreenProps {
  route: RouteProp<DeviceStackParamList, 'ColorPicker'>;
  navigation: StackNavigationProp<DeviceStackParamList, 'ColorPicker'>;
}


const ColorPickerScreen: React.FC<ColorPickerScreenProps> = ({ route }) => {
  const { deviceIp } = route.params;
  const {
    setSelectedColor,
    setColor,
  } = useDeviceStore();
  const device = useDeviceStore((state) => state.devices[deviceIp]);
  const selectedColor = device?.selectedColor || '#FFFFFF';

  // const [hsvColor, setHsvColor] = useState<HsvColor>({ h: 0, s: 100, v: 100 });
  const [userInteracted, setUserInteracted] = useState(false);
  const [wheelColor, setWheelColor] = useState<string>(selectedColor);
  const [editing, setEditing] = useState(false);
  
  const handleColorChange = (color: string) => {
    setWheelColor(color);
    if (!editing) { 
      setSelectedColor(deviceIp, color);
      const hsv = hexToHsv(color);
      // setHsvColor(hsv);
  
      if (userInteracted) {
        debouncedSetColor(deviceIp, hsv);
      }
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

  const handleEditing = () => {
    setEditing(!editing);
  };

  return (
    <View style={styles.container}>
      <LedStrip selectedColor={selectedColor} />
      <View style={{ marginBottom: 10, flex: 1 }}>

        <ColorPicker
          color={wheelColor}
          onColorChange={handleColorChange}
          onColorChangeComplete={handleInteractionStart}
          onInteractionStart={handleInteractionStart}
          sliderHidden={true}
          noSnap={true}
          row={false}
          swatches={false}
          useNativeLayout={true}
          gapSize={10}
        />
        <FavoriteColors
          deviceIp={deviceIp}
          wheelColor={wheelColor}
          handleColorChange={handleColorChange}
          handleEdit={handleEditing}
        />
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
  colorSquaresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
    marginHorizontal: "2.5%",
    marginBottom: 15,
  },
  colorSquare: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 10, height: 10 },
  },
  addButton: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 5,
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'cyan',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    // shadowOffset: { width: 10, height: 10 },
  },
  addText: {
    fontSize: 20,
    color: 'cyan',
  },
  selectedColorSquare: {
    borderWidth: 0,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  uniformButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    // width: 120,
    padding: 10,
    // marginHorizontal: 15,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'cyan',
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  favouriteButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'cyan',
  },
  favoriteHeaderText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: 'rgb(0, 255, 255)',
    marginBottom: 10,
  },
  cancelButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(1, 101, 121, 0.79)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
    marginTop: -30,
  },
  cancelText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ColorPickerScreen;