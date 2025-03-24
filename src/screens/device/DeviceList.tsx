import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DeviceStackParamList } from './DeviceStackScreen';
import { Device } from '../../stores/deviceStore';
import DeviceCard from './DeviceCard';
import SyncToolbar from './deviceComponents/SyncToolbar';

interface DeviceListProps {
  devices: Record<string, Device>;
  navigation: StackNavigationProp<DeviceStackParamList, 'DeviceScreen'>;
}

const DeviceList: React.FC<DeviceListProps> = memo(({ devices, navigation }) => {
  return (
    <View style={styles.container}>
      {Object.keys(devices).length > 0 && <SyncToolbar />}
      {Object.keys(devices).length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No devices here, please add devices</Text>
        </View>
      ) : (
        Object.entries(devices).map(([deviceIp, device]) => (
          <DeviceCard key={deviceIp} deviceIp={deviceIp} device={device} navigation={navigation} />
        ))
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.devices === nextProps.devices && prevProps.navigation === nextProps.navigation;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(10,15,20)',
  },
  emptyContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center' as const,
  },
});

export default DeviceList;