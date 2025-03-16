import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import useDeviceStore from '../../stores/deviceStore';
import DeviceList from './DeviceList';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DeviceStackParamList } from './DeviceStackScreen';
import useDevicePolling from '../../hooks/devicePolling';

interface DeviceScreenProps {
  navigation: StackNavigationProp<DeviceStackParamList, 'DeviceScreen'>;
  route: RouteProp<DeviceStackParamList, 'DeviceScreen'>;
}

const DeviceScreen: React.FC<DeviceScreenProps> = ({ navigation }) => {
  const { devices, fetchDeviceData, fetchDeviceStatus } = useDeviceStore();
  const [refreshing, setRefreshing] = useState(false);

  useDevicePolling();

  const withTimeout = (promise: Promise<any>, ms: number, deviceIP: string) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => {
        const error = new Error(`Timeout after ${ms}ms for ${deviceIP}`);
        // console.error(error.message); // Avoid the timeout error message
        reject(error);
      }, ms)
    );
    return Promise.race([promise, timeout]);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('Starting manual refresh at:', new Date().toISOString());
    try {
      const deviceIPs = Object.keys(devices);
      if (deviceIPs.length === 0) {
        console.log('No devices to refresh');
        return;
      }

      const results = await Promise.all(
        deviceIPs.map(async (deviceIP) => {
          try {
            await Promise.all([
              withTimeout(fetchDeviceData(deviceIP), 5000, deviceIP),
              withTimeout(fetchDeviceStatus(deviceIP), 5000, deviceIP),
            ]);
            console.log(`Refreshed manually ${deviceIP} successfully`);
            return true;
          } catch (error) {
            console.error(`Manual Refresh failed for ${deviceIP}:`, (error as Error).message);
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
          // title="Refreshing..."
          // titleColor="cyan"
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