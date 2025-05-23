import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import useDeviceStore, { Effect } from '../../stores/deviceStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ColorPickerScreen from './ColorPickerScreen';
import DeviceScreen from './DeviceScreen';
import AddDeviceScreen from './AddDeviceScreen';
import EffectsScreen from './EffectsScreen';
import EffectPickerScreen from './EffectPickerScreen';

export type DeviceStackParamList = {
  DeviceScreen: undefined;
  AddDevice: undefined;
  ColorPicker: { deviceIp: string };
  EffectPickerScreen: { deviceIp: string };
  EffectsPage: { deviceIp: string; selectedEffect: Effect };
};

const Stack = createStackNavigator<DeviceStackParamList>();

const DeviceStackScreen: React.FC = () => {
  const { devices } = useDeviceStore();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeviceScreen"
        component={DeviceScreen}
        options={({ navigation }) => ({
          title: 'Devices',
          headerRight: () => (
            <MaterialCommunityIcons
              name="plus"
              size={30}
              style={styles.icon}
              onPress={() => navigation.navigate('AddDevice')}
            />
          ),
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'cyan',
          headerTitleAlign: 'left' as const,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold' as const,
            padding: 5,
          },
        })}
      />
      <Stack.Screen
        name="AddDevice"
        component={AddDeviceScreen}
        options={{
          title: 'Add Device',
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'cyan',
        }}
      />
      <Stack.Screen
        name="ColorPicker"
        component={ColorPickerScreen}
        options={({ route }) => ({
          title: devices[route.params.deviceIp]?.deviceName || 'Unnamed Device',
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'cyan',
        })}
      />
      <Stack.Screen
        name="EffectPickerScreen"
        component={EffectPickerScreen}
        options={{
          title: '',
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'cyan',
        }}
      />
      <Stack.Screen
        name="EffectsPage"
        component={EffectsScreen}
        options={{
          title: '',
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'cyan',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 15,
    color: 'cyan',
  },
});

export default DeviceStackScreen;