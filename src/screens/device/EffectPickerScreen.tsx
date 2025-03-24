import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DeviceStackParamList } from './DeviceStackScreen';
import useDeviceStore, { Effect } from '../../stores/deviceStore';
import EffectGradientShadow from '../../components/EffectShadowGradient';

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

  const renderEffect = ({ item }: { item: Effect }) => {
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
          <Text style={styles.effectName} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{device.deviceName} Effects</Text>
      <FlatList
        data={filteredEffectsList}
        renderItem={renderEffect}
        keyExtractor={(item) => item.functionNumber.toString()}
        contentContainerStyle={styles.effectsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
  },
  cardWrapper: {
    marginBottom: 30,
    position: 'relative' as const,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'cyan',
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign:'center',
  },
  effectsList: {
    padding: 30,
    paddingTop: 30,
  },
  effectCard: {
    padding: 10,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  effectName: {
    fontSize: 18,
    color: 'cyan',
    textAlign: 'center',
    marginBottom: 10,
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