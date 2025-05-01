import React, { useState } from 'react';
import  {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from  'react-native';
import  { useRoute, useNavigation  } from  '@react-navigation/native';
import type  { RouteProp  } from  '@react-navigation/native';
import type  { StackNavigationProp  } from  '@react-navigation/stack';
import type  { ScenesStackParamList  } from  './ScenesStackScreen';
import useDeviceStore from  '../../stores/deviceStore';
import ColorSection from '../../components/ColorSection';
import LedStrip from '../device/deviceComponents/LedStrip';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { hexToHsv } from '../../utils/hexToHsv';
import BrightnessSection from '../../components/BrightnessSection';

type NavigationProp = StackNavigationProp<ScenesStackParamList, 'SolidColorConfig'>;
type SolidColorConfigRouteProp = RouteProp<ScenesStackParamList, 'SolidColorConfig'>;

const SolidColorConfig: React.FC = () => {
  const route = useRoute<SolidColorConfigRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {
    devices,
    scenes, 
    updateScene, 
    setColor,
    setSelectedColor,
    setBrightness,
  } = useDeviceStore();
  const { ip, sceneIndex } = route.params;
  const device = devices[ip];
  const scene = scenes[sceneIndex];

  const [sliderBrightness, setSliderBrightness] = useState(50);
  const [wheelColor, setWheelColor] = useState('#FFFFFF');

  const handleSceneUpdate = () => {
    console.log(`Saving device config for ${ip}:`, { wheelColor, });
    const config = {
      selectedColor: wheelColor,
      effectNumber: device.effectCount,
      effectName: 'Solid Color',
      custom: false,
      brightness: sliderBrightness,
    }
    const deviceConfigs = Object.keys(scene.devices).map((deviceIp) => ({
      ip: deviceIp,
      state: deviceIp === ip
        ? config
        : scene.devices[deviceIp],
      }));
    updateScene(sceneIndex, scene.name, deviceConfigs);
    console.log(scenes)
    navigation.goBack();
  };

  const handleTestColor = () => {
    const hsv = hexToHsv(wheelColor);
    setBrightness(ip, sliderBrightness);
    setColor( ip, hsv );
    setSelectedColor(ip, wheelColor);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>

        <TouchableOpacity
          style={[styles.button, {
            width : '15%',
            backgroundColor: 'rgb(22, 24, 29)'
          }]}
          onPress={() => navigation.replace('DeviceConfig', { ip, sceneIndex })}
          >
          <IonIcons
            style={{alignContent: 'center'}}
            name={'return-up-back'}
            color={'rgb(0, 255, 140)'}
            size={25}/>
        </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: 'rgb(22, 24, 29)'}]}
            onPress={handleTestColor}
            >
            <Text style={[styles.buttonText, {color: 'rgb(0, 255, 140)'}]}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSceneUpdate}
            >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
      </View>
      <View style={{marginBottom: 80 }}>
        <LedStrip selectedColor={wheelColor}/>
      </View>
      <ScrollView >
        <ColorSection
          deviceIp={ip}
          containerNeeded={true}
          setWheelColor={setWheelColor}
          styleColor='rgb(0, 255, 140)'
        />
        <BrightnessSection
          brightness={sliderBrightness}
          setBrightness={setSliderBrightness}
        />
      </ScrollView>
      {/* Buttons */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    width: '37%',
    height: 50,
    backgroundColor: 'rgb(0, 255, 140)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 0,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
  },
  buttonText: {
    color: 'rgb(10, 15, 20)',
    fontSize: 18,
    // fontWeight: 'bold',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
});

export default SolidColorConfig;