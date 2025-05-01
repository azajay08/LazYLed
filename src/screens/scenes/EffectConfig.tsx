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
import { hexToHsv } from '../../utils/hexToHsv';
import useDeviceStore,  { HsvColor, CustomEffectPayload } from  '../../stores/deviceStore';
import EffectGradientShadow from '../../components/EffectShadowGradient';
import SectionBox from '../../components/SectionBox'
import IonIcons from 'react-native-vector-icons/Ionicons';
import ColorSection from '../../components/ColorSection';
import SpeedSection from '../../components/SpeedSection';
import ToggleSection from '../../components/ToggleSection';
import BrightnessSection from '../../components/BrightnessSection';


type NavigationProp = StackNavigationProp<ScenesStackParamList, 'EffectConfig'>;
type EffectConfigRouteProp = RouteProp<ScenesStackParamList, 'EffectConfig'>;

const EffectConfig: React.FC = () => {
  const route = useRoute<EffectConfigRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { devices, setEffect, setCustomEffect, setBrightness, scenes, updateScene } = useDeviceStore();
  const { ip, sceneIndex, selectedEffect,} = route.params;
  const scene = scenes[sceneIndex];
  const device = devices[ip];

  const [speed, setSpeed] = useState<number>(20);
  const [colors, setColors] = useState<string[]>(['']);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [blendOn, setBlendOn] = useState<boolean>(false);
  const [sliderBrightness, setSliderBrightness] = useState(50); 

  const toggleMoving = (value: boolean) => setIsMoving(value);
  const toggleReverse = (value: boolean) => setIsReverse(value);
  const toggleBlendOn = (value: boolean) => setBlendOn(value);

  const invertSpeed = (speed: number) => 50 - speed;

  const handleSceneUpdate = () => {
    const validColors = colors.filter((c) => c !== '');
    if (selectedEffect.colorParams > 0 && validColors.length === 0) {
      console.warn('At least one color is required for effects with color parameters');
      return;
    }
    const customEffect: CustomEffectPayload = {
      functionNumber: selectedEffect.functionNumber,
      speed: selectedEffect.speedParams > 0 ? invertSpeed(speed) : undefined,
      colors: selectedEffect.colorParams > 0 ? validColors.map((color) => hexToHsv(color)) : undefined,
      moving: selectedEffect.moving ? isMoving : undefined,
      reverse: selectedEffect.moving ? isReverse : undefined,
      blend: selectedEffect.moving ? blendOn : undefined,
    };
    const config = {
      selectedColor: device?.selectedColor || '#FFFFFF',
      effectNumber: selectedEffect.functionNumber,
      effectName: selectedEffect.name,
      brightness: sliderBrightness,
      custom: true,
      customEffect,
    };
    console.log(`Saving effect config for ${ip}:`, config);
    const deviceConfigs = Object.keys(scene.devices).map((deviceIp) => ({
      ip: deviceIp,
      state: deviceIp === ip ? config : scene.devices[deviceIp],
    }));
    updateScene(sceneIndex, scene.name, deviceConfigs);
    navigation.goBack();
  };



  const activateEffect = () => {
    setBrightness(ip, sliderBrightness);
    if (!selectedEffect) return;
    const validColors = colors.filter((c) => c !== '');
    if (selectedEffect.colorParams > 0 || selectedEffect.speedParams > 0) {
      const colorValues: HsvColor[] = validColors.map((color) => hexToHsv(color));
      if (isMoving && selectedEffect.moving) {
        setCustomEffect(ip, selectedEffect.functionNumber, invertSpeed(speed), colorValues, true, isReverse, blendOn);
      } else {
        setCustomEffect(ip, selectedEffect.functionNumber, invertSpeed(speed), colorValues, false, false, blendOn);
      }
    } else {
      setEffect(ip, selectedEffect.functionNumber);
    }
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
            onPress={activateEffect}
            >
            <Text style={[styles.buttonText, {color: 'rgb(0, 255, 140)'}]}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSceneUpdate}
            style={styles.button}
            >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      
        <ScrollView contentContainerStyle={styles.controlsContent}>
        {/* Color Section */}
        {(selectedEffect.colorParams > 0 || selectedEffect.speedParams > 0 || selectedEffect.moving) && (
          <>
            {selectedEffect.colorParams > 0 && (
              <ColorSection
                colors={colors}
                selectedEffect={selectedEffect}
                setColors={setColors}
                deviceIp={ip}
                styleColor='rgb(0, 255, 140)'
              />
            )}
            {/* Brightness Section */}
            <BrightnessSection
              brightness={sliderBrightness}
              setBrightness={setSliderBrightness}
            />
            {/* Speed Section */}
            {selectedEffect.speedParams > 0 && (
              <SpeedSection speed={speed} setSpeed={setSpeed} styleColor='rgb(0, 255, 140)' />
            )}
            {/* Toggle Section  */}
            {selectedEffect.moving && (
              <ToggleSection
                isMoving={isMoving}
                toggleMoving={toggleMoving}
                isReverse={isReverse}
                toggleReverse={toggleReverse}
                blendOn={blendOn}
                toggleBlendOn={toggleBlendOn}
                styleColor='rgb(0, 255, 140)'
              />
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
  controlsContent: {
    // paddingHorizontal: 20,
  },
});
export default EffectConfig;