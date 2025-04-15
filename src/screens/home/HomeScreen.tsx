import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useDeviceStore from '../../stores/deviceStore';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import HomeDeviceCard from './HomeDeviceCard';

type RootTabParamList = {
  Home: undefined;
  Devices: undefined;
  Settings: undefined;
};

const HomeScreen: React.FC = () => {
  const { devices } = useDeviceStore();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const handleDevicePress = () => {
    navigation.navigate('Devices');
  };

  return (
    <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {Object.keys(devices).length === 0 ? (
            <Text style={styles.sectionText}>
              No devices found. Please add devices.
            </Text>
          ) : (
            <Text style={styles.sectionText}>
              Placeholder (Lights on, room)
            </Text>)}
        </View>
        <TouchableOpacity style={styles.sectionContainer} onPress={handleDevicePress}>
          <Text style={styles.sectionTitle}>Devices</Text>
          {Object.keys(devices).length === 0 ? (
            <Text style={styles.sectionText}>
              No devices found. Please add devices.
            </Text>
          ) : (
            <View style={styles.sectionContentContainer}>
              {Object.entries(devices).map(([deviceIP, device]) => (
                <HomeDeviceCard
                  key={deviceIP}
                  device={{ ip: deviceIP, ...device }}
                  onPress={handleDevicePress}
                />
              ))}
              {Object.entries(devices).map(([deviceIP, device]) => (
                <HomeDeviceCard
                  key={deviceIP}
                  device={{ ip: deviceIP, ...device }}
                  onPress={handleDevicePress}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Scenes (Coming Soon)</Text>
          <Text style={styles.sectionText}>
            This is a section to quickly select effects
          </Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Favorites (Coming Soon)</Text>
          <Text style={styles.sectionText}>
            A favorite section that shows favorite colors or effects. You have
            no favorites yet.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'rgb(10,15,20)',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(10,15,20)',
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
    elevation: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(0, 255, 255)',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  sectionContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HomeScreen;