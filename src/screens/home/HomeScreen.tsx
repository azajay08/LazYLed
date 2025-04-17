import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import useDeviceStore from '../../stores/deviceStore'; // Adjust path if needed
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import HomeDeviceCard from './HomeDeviceCard';

type RootTabParamList = {
  Home: undefined;
  Devices: undefined;
  Settings: undefined;
};

const HomeScreen: React.FC = () => {
  const { devices, scenes, applyScene } = useDeviceStore(); // Added scenes, applyScene
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const handleDevicePress = () => {
    navigation.navigate('Devices');
  };

  const handleScenePress = (index: number) => {
    applyScene(index); // Apply the scene when tapped
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Summary Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {Object.keys(devices).length === 0 ? (
            <Text style={styles.sectionText}>
              No devices found. Please add devices.
            </Text>
          ) : (
            <Text style={styles.sectionText}>
              Placeholder (Lights on, room)
            </Text>
          )}
        </View>

        {/* Devices Section */}
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
                  key={deviceIP} // Removed duplicate map
                  device={{ ip: deviceIP, ...device }}
                  onPress={handleDevicePress}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Scenes Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Scenes</Text>
          {scenes.length === 0 ? (
            <Text style={styles.sectionText}>
              No scenes created yet. Add a scene to get started!
            </Text>
          ) : (
            <View style={styles.sectionContentContainer}>
              {scenes.map((scene, index) => (
                <TouchableOpacity
                  key={scene.name + index}
                  style={styles.sceneCard}
                  onPress={() => handleScenePress(index)}
                >
                  <Text style={styles.sceneText}>{scene.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Favorites Section */}
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
  sceneCard: {
    backgroundColor: 'rgb(30, 35, 40)',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    width: '45%', // Adjust for two-column layout
    alignItems: 'center',
  },
  sceneText: {
    fontSize: 14,
    color: 'rgb(0, 255, 255)',
    fontWeight: '600',
  },
});

export default HomeScreen;