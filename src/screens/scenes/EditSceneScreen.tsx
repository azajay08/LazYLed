import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ScenesStackParamList } from './ScenesStackScreen';
import useDeviceStore, { SceneDeviceState } from '../../stores/deviceStore';
import SceneNameEdit from './SceneNameEdit';
import AddDeviceModal from './AddDeviceModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type NavigationProp = StackNavigationProp<ScenesStackParamList, 'EditScene'>;

const EditSceneScreen: React.FC = () => {
  const route = useRoute<RouteProp<ScenesStackParamList, 'EditScene'>>();
  const navigation = useNavigation<NavigationProp>();
  const { updateScene, scenes, devices } = useDeviceStore();
  const sceneIndex = route.params.index;
  const [sceneName, setSceneName] = useState(route.params.name);
  const [selectedDevices, setSelectedDevices] = useState<string[]>(
    Object.keys(scenes[sceneIndex]?.devices || {})
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [originalScene, setOriginalScene] = useState<{
    name: string;
    devices: Record<string, SceneDeviceState>;
  }>({ name: route.params.name, devices: { ...scenes[sceneIndex]?.devices } });

  // Helper to create device config
  const createDeviceConfig = (ip: string): SceneDeviceState => ({
    selectedColor: devices[ip]?.selectedColor || '#FFFFFF',
    effectNumber: devices[ip]?.effectNumber ?? 0,
    effectName: devices[ip]?.effectName || 'Unknown',
    brightness: devices[ip]?.brightness ?? 100,
    custom: devices[ip]?.effectName === 'Solid Color' ? false : true,
    customEffect: devices[ip]?.lastState?.customEffect,
  });

  const handleAddDevices = (ips: string[]) => {
    const newDevices = [...new Set([...selectedDevices, ...ips])];
    setSelectedDevices(newDevices);
    const deviceConfigs = newDevices.map((ip) => ({
      ip,
      state: scenes[sceneIndex]?.devices[ip] || createDeviceConfig(ip),
    }));
    updateScene(sceneIndex, sceneName, deviceConfigs);
  };

  const handleSave = () => {
    if (!sceneName.trim()) {
      console.warn('Scene name is empty');
      return;
    }
    if (selectedDevices.length === 0) {
      console.warn('At least one device is required');
      return;
    }
    const deviceConfigs = selectedDevices.map((ip) => ({
      ip,
      state: scenes[sceneIndex]?.devices[ip] || createDeviceConfig(ip),
    }));
    updateScene(sceneIndex, sceneName, deviceConfigs);
    navigation.goBack();
  };

  const handleCancel = () => {
    // Restore original scene state
    updateScene(sceneIndex, originalScene.name, Object.entries(originalScene.devices).map(([ip, state]) => ({
      ip,
      state,
    })));
    navigation.goBack();
  };

  const handleDevicePress = (ip: string) => {
    navigation.navigate('DeviceConfig', { ip, sceneIndex });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionSubtitle}>Scene Name</Text>
      <View style={styles.titleContainer}>
        <SceneNameEdit sceneName={sceneName} setSceneName={setSceneName} />
      </View>

      <View style={styles.deviceTitleContainer}>
        <Text style={styles.sectionSubtitle}>Devices</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons
            name="add"
            color="rgb(0, 255, 140)"
            size={30}
            style={{ marginLeft: 10, marginBottom: 10 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        {selectedDevices.length === 0 ? (
          <Text style={styles.sectionText}>No devices in this scene</Text>
        ) : (
          selectedDevices.map((ip) => (
            <TouchableOpacity
              onPress={() => handleDevicePress(ip)}
              style={styles.deviceCard}
              key={ip}
            >
              <Text style={styles.deviceText}>
                {devices[ip]?.deviceName || ip}
              </Text>
              <Text style={styles.effectText}>
                {scenes[sceneIndex]?.devices[ip]?.effectName || 'Unknown'}{' '}
                {scenes[sceneIndex]?.devices[ip]?.effectNumber || ''}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <AddDeviceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddDevices={handleAddDevices}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'rgb(44, 40, 40)' }]}
          onPress={handleCancel}
        >
          <Text style={[styles.buttonText, { color: 'rgb(0, 255, 140)' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
    padding: 20,
  },
  sectionContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  titleContainer: {
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
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(0, 255, 140)',
    marginLeft: 5,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  deviceCard: {
    backgroundColor: 'rgb(10, 15, 20)',
    width: '45%',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
  },
  deviceText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginVertical: 5,
  },
  effectText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 85,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(0, 255, 140)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
  },
  buttonText: {
    color: 'rgb(10, 15, 20)',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default EditSceneScreen;