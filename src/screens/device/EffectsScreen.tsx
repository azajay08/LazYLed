import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DeviceStackParamList } from './DeviceStackScreen';
import useDeviceStore, { Effect, HsvColor } from '../../stores/deviceStore';
import { hexToHsv } from '../../utils/hexToHsv';
import ColorPicker from 'react-native-wheel-color-picker';
import Slider from '@react-native-community/slider';

type EffectsNavigationProp = StackNavigationProp<DeviceStackParamList, 'EffectsPage'>;
type EffectsRouteProp = RouteProp<DeviceStackParamList, 'EffectsPage'>;

interface EffectsScreenProps {
  navigation: EffectsNavigationProp;
  route: EffectsRouteProp;
}

const EffectsScreen: React.FC<EffectsScreenProps> = ({ navigation, route }) => {
  const { deviceIp, selectedEffect: initialEffect } = route.params;
  const { devices, setEffect, setCustomEffect } = useDeviceStore();
  const device = devices[deviceIp] || {};
  const effectsList = (device.effectsList || []).filter((effect) => effect.functionNumber !== 0);

  const selectedEffect = initialEffect || effectsList[0]; // No useState
  const [speed, setSpeed] = useState<number>(20);
  const [colors, setColors] = useState<string[]>(['']);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  const handleColorChange = (color: string) => {
    const newColors = [...colors];
    newColors[selectedColorIndex] = color;
    setColors(newColors);
  };

  const addColor = () => {
    if (selectedEffect && colors.length < selectedEffect.colorParams) {
      const newColors = [...colors, ''];
      setColors(newColors);
      setSelectedColorIndex(newColors.length - 1);
    }
  };

  const removeColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    if (newColors.length === 0) {
      setColors(['']);
      setSelectedColorIndex(0);
    } else if (index <= selectedColorIndex) {
      setSelectedColorIndex(Math.max(0, selectedColorIndex - 1));
    }
  };

  const selectColor = (index: number) => {
    setSelectedColorIndex(index);
  };

  const invertSpeed = (speed: number) => 50 - speed;

  const activateEffect = () => {
    if (!selectedEffect) return;
    const validColors = colors.filter((c) => c !== '');
    if (selectedEffect.colorParams > 0 || selectedEffect.speedParams > 0) {
      const colorValues: HsvColor[] = validColors.map((color) => hexToHsv(color));
      setCustomEffect(deviceIp, selectedEffect.functionNumber, invertSpeed(speed), colorValues);
    } else {
      setEffect(deviceIp, selectedEffect.functionNumber);
    }
  };

  const renderColorSquare = (color: string, index: number) => (
    <View key={index.toString()} style={styles.colorItem}>
      <TouchableOpacity
        style={[
          styles.colorSquare,
          { backgroundColor: color || 'transparent' },
          index === selectedColorIndex && [styles.selectedColorSquare, { shadowColor: color }],
        ]}
        onPress={() => selectColor(index)}
      />
      <TouchableOpacity style={styles.cancelButton} onPress={() => removeColor(index)}>
        <Text style={styles.cancelText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.uniformButton}
            onPress={() => navigation.replace('EffectPickerScreen', { deviceIp })}
          >
            <Text style={styles.buttonText}>Other Effects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.uniformButton, { backgroundColor: 'cyan', borderColor: 'black' }]} onPress={activateEffect}>
            <Text style={[styles.buttonText, {color: 'black'}]}>Run Effect</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.controls} contentContainerStyle={styles.controlsContent}>
        <Text style={styles.subtitle}>{selectedEffect.name}</Text>
        {(selectedEffect.colorParams > 0 || selectedEffect.speedParams > 0) && (
          <>
            {selectedEffect.colorParams > 0 && (
              <View style={styles.colorSection}>
                <Text style={styles.label}>
                  Colors ({colors.filter((c) => c !== '').length}/{selectedEffect.colorParams})
                </Text>
                <View style={styles.colorSquaresContainer}>
                  {colors.map((color, index) => renderColorSquare(color, index))}
                  {colors.length < selectedEffect.colorParams && (
                    <TouchableOpacity style={styles.addButton} onPress={addColor}>
                      <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.colorPickerContainer}>
                  <ColorPicker
                    color={colors[selectedColorIndex] || '#FFFFFF'}
                    onColorChange={handleColorChange}
                    thumbSize={30}
                    swatches={false}
                    sliderSize={20}
                  />
                </View>
              </View>
            )}
            {selectedEffect.speedParams > 0 && (
              <View style={styles.speedSection}>
                <Text style={styles.label}>Speed: {speed}</Text>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  minimumValue={0}
                  maximumValue={50}
                  step={1}
                  style={styles.slider}
                  thumbTintColor="cyan"
                  minimumTrackTintColor="cyan"
                  maximumTrackTintColor="black"
                  tapToSeek={true}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
    padding: 20,
  },
  topContainer: {
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uniformButton: {
    flex: 1,
    width: 120,
    paddingVertical: 10,
    marginHorizontal: 15,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'cyan',
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'cyan',
  },
  controls: {
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  controlsContent: {
    padding: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'cyan',
    marginBottom: 15,
  },
  colorSection: {
    marginBottom: 20,
  },
  label: {
    color: 'cyan',
    fontSize: 16,
    marginBottom: 10,
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
    marginRight: 10,
    marginBottom: 5,
  },
  colorSquare: {
    width: 60,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 10, height: 10 },
  },
  selectedColorSquare: {
    borderWidth: 0,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
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
  addButton: {
    width: 60,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 10, height: 10 },
  },
  addText: {
    fontSize: 20,
    color: 'cyan',
  },
  colorPickerContainer: {
    height: 280,
    marginBottom: 10,
  },
  speedSection: {
    marginBottom: 1,
  },
  slider: {
    width: '100%',
    height: 10,
  },
});

export default EffectsScreen;