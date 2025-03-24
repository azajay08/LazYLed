// Place holder until real device search can be done

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import useDeviceStore from '../../stores/deviceStore';
import { OFFICE_SHELF_IP, PEG_BOARD_IP } from '@env';

const AddDeviceScreen: React.FC = () => {
  const { addDevice, setDeviceName, devices: storeDevices } = useDeviceStore();
  const [isScanning, setIsScanning] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [devices, setDevices] = useState<{ ip: string; tempName: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);
  const [tempDeviceName, setTempDeviceName] = useState('');


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


  const identifyDevice = async (deviceIP: string) => {
    try {
      const payload = { h: 0, s: 0, v: 255 }; // White color (on)
      for (let i = 0; i < 3; i++) {
        await axios.post(`http://${deviceIP}/setColor`, payload);
        await delay(1000);
        await axios.post(`http://${deviceIP}/onOff`);
        await delay(1000);
      }
    } catch (error) {
      console.error(`Error identifying device ${deviceIP}:`, error);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      const allDevices = [
        { ip: OFFICE_SHELF_IP, tempName: 'Device 1' },
        { ip: PEG_BOARD_IP, tempName: 'Device 2' },
      ];
      const availableDevices = allDevices.filter(
        (device) => !Object.keys(storeDevices).includes(device.ip)
      );
      setDevices(availableDevices);
      setIsScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [storeDevices]);

  const handleDevicePress = (ip: string) => {
    setSelectedIp(ip);
    setTempDeviceName('');
    setModalVisible(true);
  };

  const handleAddDevice = () => {
    if (selectedIp && tempDeviceName.trim()) {
      setModalVisible(false);
      setIsAdding(true);
      addDevice(selectedIp);
      setDeviceName(selectedIp, tempDeviceName.trim());
      setTimeout(() => {
        setIsAdding(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 1000);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      {isScanning ? (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="cyan" />
          <Text style={styles.statusText}>Scanning for devices...</Text>
        </View>
      ) : isAdding ? (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="cyan" />
          <Text style={styles.statusText}>Adding device...</Text>
        </View>
      ) : isSuccess ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Device added successfully</Text>
        </View>
      ) : (
        <>
          <Text style={styles.header}>Found Devices</Text>
          {devices.length === 0 ? (
            <Text style={styles.noDevicesText}>No new devices found</Text>
          ) : (
            devices.map((device, index) => (
              <View key={index} style={styles.deviceRow}>
                <TouchableOpacity
                  style={styles.deviceButton}
                  onPress={() => handleDevicePress(device.ip)}
                >
                  <Text style={styles.buttonText}>{device.tempName}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.identifyButton}
                  onPress={() => identifyDevice(device.ip)}
                >
                  <Text style={styles.buttonText}>Identify</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </>
      )}

      {/* Naming Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Name Your Device</Text>
            <TextInput
              style={styles.input}
              value={tempDeviceName}
              onChangeText={setTempDeviceName}
              placeholder="Enter device name"
              placeholderTextColor="rgba(0, 255, 255, 0.5)"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddDevice}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(10,15,20)',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  statusText: {
    fontSize: 18,
    color: 'cyan',
    marginTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: 'cyan',
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  deviceRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginVertical: 10,
    
  },
  deviceButton: {
    width: '60%',
    padding: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 8,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
  },
  identifyButton: {
    width: '30%',
    padding: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 8,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
  },
  buttonText: {
    fontSize: 18,
    color: 'cyan',
  },
  noDevicesText: {
    fontSize: 18,
    color: 'cyan',
    textAlign: 'center' as const,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgb(10,15,20)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: 'cyan',
    marginBottom: 15,
    textAlign: 'center' as const,
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    color: 'cyan',
    fontSize: 16,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  modalButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    
  },
  modalButton: {
    padding: 10,
    width: '45%',
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 8,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
  },
  modalButtonText: {
    fontSize: 16,
    color: 'cyan',
  },
});

export default AddDeviceScreen;