// App.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import SettingsScreen from './screens/SettingsScreen';
import HomeScreen from './screens/HomeScreen';
import DeviceStackScreen from './screens/DeviceStackScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarBase,
          tabBarBackground: () => (
            <LinearGradient
              colors={['rgb(255, 0, 200)', 'cyan', 'rgb(255, 165, 0)']}
              style={styles.gradientBackground}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 0 }} // Horizontal left to right
            />
          ),
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
                    shadowOpacity: 1,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: -5 },
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
                    shadowOpacity: 1,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: -5 },
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
                    shadowOpacity: 1,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: -5 },
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
    borderTopWidth: 0, // Gradient replaces border
    shadowOpacity: 0.1,
    elevation: 8,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2, // Thin gradient strip
  },
});

const focusedStyle = (color: string): ViewStyle => ({
  borderTopColor: color,
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 18,
  elevation: 8,
});

export default App;