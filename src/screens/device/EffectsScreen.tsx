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
import useDeviceStore, { HsvColor } from '../../stores/deviceStore';
import { hexToHsv } from '../../utils/hexToHsv';
import SpeedSection from './deviceComponents/SpeedSection';
import ToggleSection from './deviceComponents/ToggleSection';
import ColorSection from './deviceComponents/ColorSection';
import IonIcons from 'react-native-vector-icons/Ionicons';

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

  const selectedEffect = initialEffect || effectsList[0];
  const [speed, setSpeed] = useState<number>(20);
  const [colors, setColors] = useState<string[]>(['']);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isReverse, setIsReverse] = useState<boolean>(false);

  const toggleMoving = (value: boolean) => setIsMoving(value);
  const toggleReverse = (value: boolean) => setIsReverse(value);

  const invertSpeed = (speed: number) => 50 - speed;

  const activateEffect = () => {
    if (!selectedEffect) return;
    const validColors = colors.filter((c) => c !== '');
    if (selectedEffect.colorParams > 0 || selectedEffect.speedParams > 0) {
      const colorValues: HsvColor[] = validColors.map((color) => hexToHsv(color));
      if (isMoving && selectedEffect.moving) {
        setCustomEffect(deviceIp, selectedEffect.functionNumber, invertSpeed(speed), colorValues, true, isReverse);
      } else {
        setCustomEffect(deviceIp, selectedEffect.functionNumber, invertSpeed(speed), colorValues);
      }
    } else {
      setEffect(deviceIp, selectedEffect.functionNumber);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={[styles.uniformButton, {width : '15%'}]}
            onPress={() => navigation.replace('EffectPickerScreen', { deviceIp })}
          >
            <IonIcons style={{alignContent: 'center'} } name={'return-up-back'} color={'cyan'} size={25}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uniformButton, {width : '78%', backgroundColor: 'cyan', borderColor: 'black' }]}
            onPress={activateEffect}
          >
            <Text style={[styles.buttonText, { color: 'black' }]}>Run Effect</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{selectedEffect.name}</Text>
        </View>
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
                deviceIp={deviceIp}
              />
            )}
            {/* Speed Section */}
            {selectedEffect.speedParams > 0 && (
              <SpeedSection speed={speed} setSpeed={setSpeed} />
            )}
            {/* Toggle Section  */}
            {selectedEffect.moving && (
              <ToggleSection
                isMoving={isMoving}
                toggleMoving={toggleMoving}
                isReverse={isReverse}
                toggleReverse={toggleReverse}
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
    padding: 0,
  },
  topContainer: {
    borderRadius: 15,
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  uniformButton: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'cyan',
  },
  controlsContent: {
    paddingHorizontal: 20,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'cyan',
  },
  speedSection: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    padding: 20,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 50,
  },
  toggleContainer: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  toggleLabel: {
    color: 'cyan',
    fontSize: 16,
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 10,
  },
});

export default EffectsScreen;