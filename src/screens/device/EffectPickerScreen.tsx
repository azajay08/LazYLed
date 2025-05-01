import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DeviceStackParamList } from './DeviceStackScreen';
import useDeviceStore, { Effect } from '../../stores/deviceStore';
import EffectGradientShadow from '../../components/EffectShadowGradient';
import SectionBox from '../../components/SectionBox';

type EffectPickerNavigationProp = StackNavigationProp<DeviceStackParamList, 'EffectPickerScreen'>;
type EffectPickerRouteProp = RouteProp<DeviceStackParamList, 'EffectPickerScreen'>;

interface Props {
  navigation: EffectPickerNavigationProp;
  route: EffectPickerRouteProp;
}

const EffectPickerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { deviceIp } = route.params;
  const { devices } = useDeviceStore();
  const device = devices[deviceIp] || {};
  const effectsList = device.effectsList || [];

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
            navigation.replace('EffectsPage', { deviceIp, selectedEffect: item });
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
        <Text style={styles.title}>{device.deviceName} Effects</Text>
        
      <SectionBox scrollOn={true} >
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
      </SectionBox>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
  },
  cardWrapper: {
    marginBottom: 30,
    width: 140,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'cyan',
    paddingLeft: 10,
    // paddingTop: 10,
    paddingBottom: 20,
    // numColumns: 2,
    textAlign:'center',
  },
  effectsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  effectCard: {
    padding: 15,
    height: 60,
    backgroundColor: 'rgb(10,15,20)',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  effectName: {
    fontSize: 16,
    color: 'cyan',
    textAlign: 'center',
  },
  gradientPreview: {
    width: '109%',
    height: 20,
    borderRadius: 6,
    alignSelf: 'auto',
    bottom: -15,
    shadowColor: 'white',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

});

export default EffectPickerScreen;