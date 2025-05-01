import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScenesScreen from './ScenesScreen';
import EditSceneScreen from './EditSceneScreen';
import DeviceConfigScreen from './DeviceConfigScreen';
import SolidColorConfig from './SolidColorConfig';
import EffectConfig from './EffectConfig';
import useDeviceStore, { Effect } from '../../stores/deviceStore';

export type ScenesStackParamList = {
  ScenesScreen: { showModal?: boolean };
  EditScene: { index: number; name: string };
  DeviceConfig: { ip: string; sceneIndex: number; };
  SolidColorConfig: { ip: string; sceneIndex: number; };
  EffectConfig: { ip: string; sceneIndex: number; selectedEffect: Effect; };
};

const Stack = createStackNavigator<ScenesStackParamList>();

const ScenesStackScreen: React.FC = () => {
  const { devices, scenes } = useDeviceStore();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScenesScreen"
        component={ScenesScreen}
        options={({ navigation }) => ({
          title: 'Scenes',
          headerRight: () => (
            <MaterialCommunityIcons
              name="plus"
              size={30}
              style={styles.headerIcon}
              color="rgb(0, 255, 140)"
              onPress={() => {
                console.log('Add scene pressed');
                navigation.setParams({ showModal: true });
              }}
            />
          ),
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'rgb(0, 255, 140)',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            padding: 5,
          },
        })}
      />
      <Stack.Screen
        name="EditScene"
        component={EditSceneScreen}
        options={() => ({
          title: '',
          headerStyle: { backgroundColor: 'rgb(10,15,20)', },
          headerTintColor: 'rgb(0, 255, 140)',
        })}
      />
      <Stack.Screen
        name="DeviceConfig"
        component={DeviceConfigScreen}
        options={({route}) => ({
          title: devices[route.params.ip]?.deviceName,
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'rgb(0, 255, 140)',
        })}
        
      />
      <Stack.Screen
        name= 'SolidColorConfig'
        component={SolidColorConfig}
        options={() => ({
          title: 'Solid Color',
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'rgb(0, 255, 140)',
        })}
      />
      <Stack.Screen
        name='EffectConfig'
        component={EffectConfig}
        options={({route}) => ({
          title: scenes[route.params.sceneIndex].name,
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'rgb(0, 255, 140)',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            padding: 0,
            marginLeft: -10,
          },
          headerRight: () => (
            <Text style={styles.effectTitle}>{route.params.selectedEffect.name}</Text>
          ),
          // headerRightContainerStyle: {paddingRight: 20},
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerIcon: {
    marginRight: 15,
  },
  effectTitle: {
    color: 'rgb(0, 255, 140)',
    fontSize: 18,
    marginRight: 20,
    fontWeight: 'bold',
  },
});

export default ScenesStackScreen;