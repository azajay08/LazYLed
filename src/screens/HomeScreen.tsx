import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import IconWithGradient from './../components/IconWithGradient';
import useDeviceStore, { Device } from '../stores/deviceStore';

const HomeScreen: React.FC = () => {
  const { devices } = useDeviceStore();
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Select</Text>
          <Text style={styles.sectionText}>
            This is a section to quickly select effects
          </Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Devices</Text>
          {Object.keys(devices).length === 0 ? (
            <Text style={styles.sectionText}>
              No devices found. Please add devices.
            </Text>
          ) : (
            <View style={styles.sectionContentContainer}>
              {Object.entries(devices).map(([deviceIP, device]) => (
                <View key={deviceIP} style={styles.deviceContainer}>
                  <Text style={styles.deviceTitle}>
                    {device.deviceName || 'Unknown'}
                  </Text>
                  <IconWithGradient
                    iconName="led-strip-variant"
                    size={70}
                    gradientColors={['#ff8700', '#00fff3', '#f000ff']}
                    effect={device.effectName || 'LEDs Off'}
                  />
                  <Text style={styles.sectionText}>
                    {device.effectName || 'Off'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Favorites</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as 'bold',
    color: 'rgb(0, 255, 255)',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center' as 'center',
  },
  sectionContentContainer: {
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
  },
  deviceContainer: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignItems: 'center' as 'center',
    padding: 20,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 8,
    // overflow: 'hidden' as 'hidden',
    justifyContent: 'center' as 'center',
    shadowColor: 'pink', // NEED TO LOOK AT THIS
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  deviceTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as 'bold',
  },
});

export default HomeScreen;