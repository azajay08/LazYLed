import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SettingsScreen from './screens/SettingsScreen';
import HomeScreen from './screens/HomeScreen';
import DeviceStackScreen from './screens/DeviceStackScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'rgb(10,15,20)',
            borderTopWidth: 0.5,
          },
          headerStyle: { backgroundColor: 'rgb(10,15,20)' },
          headerTintColor: 'rgb(255, 0, 200)',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            padding: 5,
          },
          tabBarIconStyle: { marginTop: 5 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  focused && {
                    shadowColor: color,
                    shadowOpacity: 0.9,
                    shadowRadius: 12,
                  },
                ]}
              >
                <MaterialIcons name="home-filled" size={size} color={color} />
              </View>
            ),
            tabBarLabel: () => null,
            tabBarActiveTintColor: 'rgb(255, 0, 200)',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: [styles.tabBarBase, focusedStyle('rgb(255, 0, 200)')],
          }}
        />
        <Tab.Screen
          name="Devices"
          component={DeviceStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  focused && {
                    shadowColor: color,
                    shadowOpacity: 0.9,
                    shadowRadius: 12,
                  },
                ]}
              >
                <MaterialIcons name="lightbulb" size={size} color={color} />
              </View>
            ),
            tabBarLabel: () => null,
            tabBarActiveTintColor: 'cyan',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: [styles.tabBarBase, focusedStyle('cyan')],
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerTintColor: 'rgb(255, 165, 0)',
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  focused && {
                    shadowColor: color,
                    shadowOpacity: 0.9,
                    shadowRadius: 12,
                  },
                ]}
              >
                <MaterialIcons name="settings" size={size} color={color} />
              </View>
            ),
            tabBarLabel: () => null,
            tabBarActiveTintColor: 'rgb(255, 165, 0)',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: [styles.tabBarBase, focusedStyle('rgb(255, 165, 0)')],
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarBase: {
    backgroundColor: 'rgb(10,15,20)',
    borderTopWidth: 1.5,
    shadowOpacity: 0.1,
  },
});

const focusedStyle = (color: string): ViewStyle => ({
  borderTopColor: color,
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 18,
  elevation: 8,
});

export default App;