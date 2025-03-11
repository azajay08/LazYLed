import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import useDeviceStore, { Effect, HsvColor } from '../stores/deviceStore';
import { hexToHsv } from '../utils/hexToHsv';
import { hsvToHex } from '../utils/hsvToHex';
import ColorPicker from 'react-native-wheel-color-picker';
import Slider from '@react-native-community/slider';
interface EffectsPageProps {
  route: { params: { deviceIp: string } };
}

const EffectsPage: React.FC<EffectsPageProps> = ({ route }) => {
  const { deviceIp } = route.params;
  const { devices, setEffect, setCustomEffect } = useDeviceStore();
  const device = devices[deviceIp] || {};
  const effectsList = device.effectsList || [];

  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [speed, setSpeed] = useState<number>(20); // Default speed 20 for now
  const [colors, setColors] = useState<string[]>([device.selectedColor || '#FF0000']); // Start with one color

  const handleColorChange = (color : string) => {
    // const hex = hsvToHex(color.h * 255 / 360, color.s * 255 / 100, color.v * 255 / 100); // Scale to 0-255
    const newColors = [...colors];
    newColors[newColors.length - 1] = color; // Update last color being picked
    setColors(newColors);
  };

  const addColor = () => {
    if (selectedEffect && colors.length < selectedEffect.colorParams) {
      setColors([...colors, '#FFFFFF']); // Add white as placeholder
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const activateEffect = () => {
    if (!selectedEffect) return;
    if (selectedEffect.colorParams > 0 || selectedEffect.speedParams > 0) {
      const colorValues: HsvColor[] = colors.map(color => hexToHsv(color));
      setCustomEffect(deviceIp, selectedEffect.functionNumber, speed, colorValues);
    } else {
      setEffect(deviceIp, selectedEffect.functionNumber);
    }
  };

  const renderEffect = ({ item }: { item: Effect }) => (
    <TouchableOpacity
      style={styles.effectItem}
      onPress={() => setSelectedEffect(item)}
    >
      <Text style={styles.effectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollContainer}>

    <View style={styles.container}>
      <Text style={styles.title}>Effects for {device.deviceName}</Text>
      <FlatList
        data={effectsList}
        renderItem={renderEffect}
        keyExtractor={(item) => item.functionNumber.toString()}
        style={styles.effectList}
      />
      {selectedEffect && (
        <View style={styles.controls}>
          <Text style={styles.subtitle}>{selectedEffect.name} Settings</Text>
          {(selectedEffect.colorParams > 0 || selectedEffect.speedParams > 0) && (
            <>
              {selectedEffect.colorParams > 0 && (
                <View style={styles.colorSection}>
                  <Text>Pick Colors ({colors.length}/{selectedEffect.colorParams})</Text>
                  <View style={styles.colorCircles}>
                    {colors.map((color, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.colorCircle, { backgroundColor: color }]}
                        onPress={() => removeColor(index)}
                      />
                    ))}
                    {colors.length < selectedEffect.colorParams && (
                      <TouchableOpacity style={styles.addButton} onPress={addColor}>
                        <Text style={styles.addText}>+</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <ColorPicker
                    color='#FF0000'
                    onColorChange={handleColorChange}
                      thumbSize={30}
                      swatches={false}
                      sliderSize={30}
                  />
                </View>
              )}
              {selectedEffect.speedParams > 0 && (
                <View style={styles.speedSection}>
                  <Text>Speed: {speed}</Text>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    style={styles.slider}
                  />
                </View>
              )}
              <Button title="Activate" onPress={activateEffect} />
            </>
          )}
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
    padding: 10,
    backgroundColor: 'rgb(10,15,20)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'cyan',
  },
  effectList: {
    flex: 0.5,
  },
  effectItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  effectName: {
    fontSize: 16,
    color: 'cyan',
  },
  controls: {
    flex: 0.5,
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'cyan',
  },
  colorSection: {
    marginBottom: 15,
  },
  colorCircles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'cyan',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 20,
    color: 'cyan',
  },
  colorWheel: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  speedSection: {
    marginBottom: 15,
  },
  slider: {
    alignSelf: 'center',
    width: '95%',
    height: 40,
  },
});

export default EffectsPage;