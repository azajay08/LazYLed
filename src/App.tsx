import React, {useState} from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './screens/SplashScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import SettingsScreen from './screens/settings/SettingsScreen';
import HomeScreen from './screens/home/HomeScreen';
import DeviceStackScreen from './screens/device/DeviceStackScreen';
import ScenesStackScreen from './screens/scenes/ScenesStackScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  return (isReady ? 
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarBase,
          tabBarBackground: () => (
            <LinearGradient
              colors={['rgb(255, 0, 200)', 'cyan', 'rgb(0, 255, 140)', 'rgb(255, 165, 0)']}
              style={styles.gradientBackground}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 0 }}
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
      {/* Home Screen */}
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
        {/* Devices Screen */}
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
        {/* Scenes Screen */}
        <Tab.Screen
          name="Scenes"
          component={ScenesStackScreen}
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
                <MaterialCommunityIcons name="movie-open" size={size} color={color} />
              </View>
            ),
            tabBarLabel: () => null,
            tabBarActiveTintColor: 'rgb(0, 255, 140)',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: [styles.tabBarBase, focusedStyle('rgb(0, 255, 140)')],
          }}
        />
        {/* Settings Screen */}
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
    : <SplashScreen onFinish={() => setIsReady(true)} />);
};

const styles = StyleSheet.create({
  tabBarBase: {
    backgroundColor: 'rgb(10,15,20)',
    borderTopWidth: 0,
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