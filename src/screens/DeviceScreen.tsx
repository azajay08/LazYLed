import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import useDeviceStore from '../stores/deviceStore';
import DeviceList from '../components/DeviceList';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DeviceStackParamList } from './DeviceStackScreen';
import useDevicePolling from '../hooks/devicePolling';

interface DeviceScreenProps {
  navigation: StackNavigationProp<DeviceStackParamList, 'DevicePage'>;
  route: RouteProp<DeviceStackParamList, 'DevicePage'>;
}

const DeviceScreen: React.FC<DeviceScreenProps> = ({ navigation }) => {
  const { devices, fetchDeviceData, fetchDeviceStatus } = useDeviceStore();
  const [refreshing, setRefreshing] = useState(false);

  useDevicePolling();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('Starting manual refresh at:', new Date().toISOString());
    try {
      const results = await Promise.all(
        Object.keys(devices).map(async (deviceIP) => {
          try {
            await Promise.all([
              fetchDeviceData(deviceIP),
              fetchDeviceStatus(deviceIP),
            ]);
            console.log(`Refreshed ${deviceIP} successfully`);
            return true;
          } catch (error) {
            console.error(`Refresh failed for ${deviceIP}:`, (error as Error).message);
            return false;
          }
        })
      );
      const allSuccess = results.every(result => result);
      console.log('Manual refresh completed at:', new Date().toISOString(), 'All success:', allSuccess);
    } catch (error) {
      console.error('Unexpected refresh error:', (error as Error).message);
    } finally {
      setRefreshing(false);
      console.log('Refresh state reset at:', new Date().toISOString());
    }
  }, [devices, fetchDeviceData, fetchDeviceStatus]);

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="cyan"
          title="Refreshing..."
          titleColor="cyan"
        />
      }
    >
      <DeviceList devices={devices} navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'rgb(10,15,20)',
  },
});

export default DeviceScreen;