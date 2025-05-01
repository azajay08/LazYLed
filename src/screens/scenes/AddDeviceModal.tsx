import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Switch } from 'react-native';
import useDeviceStore from '../../stores/deviceStore'; // Adjust path
import DeviceCard from '../device/DeviceCard';

interface AddDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  onAddDevices: (selectedIps: string[]) => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ visible, onClose, onAddDevices }) => {
  const { devices } = useDeviceStore();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // Get device IPs from DeviceStore
  const availableDevices = Object.keys(devices);

  const toggleDevice = (ip: string) => {
    setSelectedDevices((prev) =>
      prev.includes(ip) ? prev.filter((d) => d !== ip) : [...prev, ip]
    );
  };

  const handleAdd = () => {
    console.log('Adding devices:', selectedDevices);
    onAddDevices(selectedDevices);
    setSelectedDevices([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedDevices([]);
    onClose();
  };

  const isSelected = (ip: string) => selectedDevices.includes(ip);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Devices to Scene</Text>
          <ScrollView style={styles.deviceScroll}>
            <View style={styles.deviceList}>
              {availableDevices.length === 0 ? (
                <Text style={styles.sectionText}>No devices available</Text>
              ) : (
                availableDevices.map((ip) => (
                  isSelected(ip) ? (
                    <TouchableOpacity key={ip} style={[styles.deviceCard, {backgroundColor: 'white'}]} onPress={() => toggleDevice(ip)}>
                      <Text style={[{color: 'black'}, {fontSize: 16}]}>
                        {devices[ip].deviceName} 
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity key={ip} style={styles.deviceCard} onPress={() => toggleDevice(ip)}>
                      <Text style={styles.deviceText}>
                        {devices[ip].deviceName} 
                      </Text>
                    </TouchableOpacity>
                )))
              )}
            </View>
          </ScrollView>

          <View style={{paddingHorizontal: 15}}>
            <TouchableOpacity style={styles.button} onPress={handleAdd}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'rgb(22, 24, 29)',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    color: 'rgb(0, 255, 140)',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  deviceScroll: {
    maxHeight: 300,
    minHeight: 150,
    width: '100%',
    marginBottom: 20,
    padding: 15,
  },
  deviceList:{
    flexDirection: 'row',
    // padding: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deviceText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  deviceCard:{
    backgroundColor: 'rgb(30, 35, 40)',
    width: '45%',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginVertical: 20,
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
});

export default AddDeviceModal;