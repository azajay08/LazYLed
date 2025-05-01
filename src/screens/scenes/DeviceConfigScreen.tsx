import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ScenesStackParamList } from './ScenesStackScreen';
import useDeviceStore, { Effect } from '../../stores/deviceStore'; // Adjust path

import EffectGradientShadow from '../../components/EffectShadowGradient';
import SectionBox from '../../components/SectionBox';

type NavigationProp = StackNavigationProp<ScenesStackParamList, 'DeviceConfig'>;
type DeviceConfigRouteProp = RouteProp<ScenesStackParamList, 'DeviceConfig'>;

const DeviceConfigScreen: React.FC = () => {
  const route = useRoute<DeviceConfigRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { devices, scenes, updateScene } = useDeviceStore();
  const { ip, sceneIndex } = route.params;
  const device = devices[ip];
  const scene = scenes[sceneIndex];
  const effectsList = device?.effectsList || [];
  const filteredEffectsList = effectsList.filter((effect) => effect.functionNumber !== 0);


  const renderEffect = (item: Effect) => {
    const gradientColors = item.sampleGradient && item.sampleGradient.length > 0
      ? item.sampleGradient
      : ['#00FFFF', '#FF00FF']; // Default cyan-to-magenta

    return (
      <View style={styles.cardWrapper}>
        <EffectGradientShadow colors={gradientColors} shadowRadius={8} />
        <TouchableOpacity
          style={styles.effectCard}
          onPress={() => {
            navigation.replace('EffectConfig', { ip, sceneIndex, selectedEffect: item });
          }}
          activeOpacity={1}
        >
          <Text style={styles.effectName} numberOfLines={1} adjustsFontSizeToFit ellipsizeMode="tail">
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (

    <View style={styles.container}>
    <SectionBox scrollOn={true} paddingBuffer={0}>
      <View style={{padding: 20}}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.replace('SolidColorConfig', { ip, sceneIndex });
        }}
        >
        <Text style={styles.buttonText}>Solid Color</Text>
      </TouchableOpacity>
        <View style={styles.effectsList}>  

        {filteredEffectsList.length === 0 ? (
          <Text >No effects available</Text>
        ) : (
          filteredEffectsList.map((item, idx) => (
            <React.Fragment key={item.functionNumber || idx}>
              {renderEffect(item)}
            </React.Fragment>
          ))
        )}
        </View>
      </View>
      </SectionBox>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
    padding: 20,
  },
  innerContainer: {
    padding: 20,
  },
  cardWrapper: {
    marginBottom: 30,
    width: 140,
    height: 60,
    position: 'relative',
    alignSelf: 'center',
  },
  effectCard: {
    padding: 15,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgb(10,15,20)',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',

  },
  effectName: {
    fontSize: 16,
    color: 'rgb(0, 255, 140)',
    textAlign: 'center',
  },
  button: {
    width: '95%',
    height: 60,
    backgroundColor: 'rgb(10,15,20)',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 0,
    shadowColor: 'rgb(0, 255, 140)',
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
  buttonText: {
    color: 'rgb(0, 255, 140)',
    fontSize: 18,
  },
  effectsList: {
    marginTop: 10,
    padding:10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});

export default DeviceConfigScreen;