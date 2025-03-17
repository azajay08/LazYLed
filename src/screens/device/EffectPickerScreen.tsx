import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DeviceStackParamList } from './DeviceStackScreen';
import useDeviceStore, { Effect } from '../../stores/deviceStore';
import LinearGradient from 'react-native-linear-gradient';

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
      <TouchableOpacity
        style={styles.effectCard}
        onPress={() => {
          navigation.replace('EffectsPage', { deviceIp, selectedEffect: item });
        }}
      >
        <Text style={styles.effectName} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientPreview}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </TouchableOpacity>
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
    paddingHorizontal: 10,
  },
  effectCard: {
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    alignItems: 'center',
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