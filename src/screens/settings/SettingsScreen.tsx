// screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  FlatList,
} from 'react-native';
import useDeviceStore, { Device } from '../../stores/deviceStore';

const SettingsScreen: React.FC = () => {
  const { devices, syncMode, toggleSyncMode, setDeviceName, removeDevice } = useDeviceStore();
  const [editingIp, setEditingIp] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

  const startEditing = (ip: string, currentName: string) => {
    setEditingIp(ip);
    setNewName(currentName);
  };

  const saveName = async (ip: string) => {
    if (newName.trim()) {
      await setDeviceName(ip, newName.trim());
    }
    setEditingIp(null);
    setNewName('');
  };

  const renderDevice = ({ item }: { item: [string, Device] }) => {
    const [ip, device] = item;
    const isEditing = editingIp === ip;

    return (
      <View style={styles.deviceItem}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceText}>{device.deviceName || 'Unknown'}</Text>
          <Text style={styles.deviceSubText}>{device.roomName}</Text>
          <Text style={styles.deviceSubText}>{'192.0.2.42 (example)'}</Text>
          {/* <Text style={styles.deviceSubText}>{ip}</Text> */}
          <Text style={styles.deviceSubText}>Status: {device.status}</Text>
        </View>
        <View style={styles.deviceActions}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                autoFocus
                onSubmitEditing={() => saveName(ip)}
              />
              <TouchableOpacity onPress={() => saveName(ip)} style={styles.actionButton}>
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => startEditing(ip, device.deviceName)}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>Rename</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => removeDevice(ip)}
            style={[styles.actionButton, { backgroundColor: '#ff4444' }]}
          >
            <Text style={styles.actionText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Sync Mode</Text>
          <Switch
            value={syncMode}
            onValueChange={toggleSyncMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={syncMode ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Devices</Text>
        {Object.keys(devices).length === 0 ? (
          <Text style={styles.noDevicesText}>No devices added yet.</Text>
        ) : (
          <FlatList
            data={Object.entries(devices)}
            keyExtractor={([ip]) => ip}
            renderItem={renderDevice}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Favorites (Coming Soon)</Text>
        <Text style={styles.placeholderText}>
          Save favorite colors or effects per device here.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
  },
  section: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(0, 255, 255)',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  deviceSubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  deviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgb(255, 165, 0)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    width: 100,
    marginRight: 10,
  },
  noDevicesText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

export default SettingsScreen;