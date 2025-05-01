import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import useDeviceStore from '../../stores/deviceStore'; // Adjust path if needed
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import HomeDeviceCard from './HomeDeviceCard';
import HomeSceneCard from './HomeSceneCard';
import SectionBox from '../../components/SectionBox';

type RootTabParamList = {
  Home: undefined;
  Devices: undefined;
  Settings: undefined;
  Scenes: undefined;
};

const HomeScreen: React.FC = () => {
  const { devices, scenes, applyScene } = useDeviceStore(); // Added scenes, applyScene
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const lightsOnCount = Object.values(devices).filter(
    (device) =>
      device.effectName &&
      device.effectName !== 'LEDs Off' &&
      device.effectName !== 'Unavailable' &&
      device.effectName !== 'Unknown'
  ).length;

  const handleDevicePress = () => {
    navigation.navigate('Devices');
  };

  const handleScenePress = () => {
    navigation.navigate('Scenes');
  };

  const handleSceneActivation = (index: number) => {
    applyScene(index); // Apply the scene when tapped
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Summary Section */}
        <SectionBox
          title={'Summary'}
          paddingBuffer={20}
          scrollOn={false}
          titleColor='rgb(255, 0, 200)'
          >
          {Object.keys(devices).length === 0 ? (
            <Text style={styles.sectionText}>
              No devices found. Please add devices.
            </Text>
          ) : (
            <Text style={styles.summaryText}>
              {lightsOnCount === 0
                ? 'All devices off'
                : lightsOnCount === 1
                ? '1 device on'
                : `${lightsOnCount} devices on`}
            </Text>
          )}
        </SectionBox>

        {/* Devices Section */}
        <SectionBox
          paddingBuffer={20}
          scrollOn={false}
          title={'Devices'}
          navigateTo={handleDevicePress}
        >
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
                  goToDeviceScreen={handleDevicePress}
                />
              ))}
            </View>
          )}
        </SectionBox>

        {/* Scenes Section */}
        <SectionBox 
          title={'Scenes'}
          paddingBuffer={20}
          scrollOn={false}
          navigateTo={handleScenePress}
          titleColor='rgb(0, 255, 140)'
          >
          <HomeSceneCard handleSceneActivation={handleSceneActivation}/>
        </SectionBox>

        {/* Favorites Section */}
        <SectionBox
          title={'Favorites (Coming Soon)'}
          paddingBuffer={20}
          scrollOn={false}
          navigateTo={handleScenePress}
          titleColor='rgb(255, 165, 0)'
          >

        </SectionBox>
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
  summaryText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    // textAlign: 'center',
    marginBottom: 10,
  },
});

export default HomeScreen;