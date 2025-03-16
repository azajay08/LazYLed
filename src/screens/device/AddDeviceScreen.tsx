import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import useDeviceStore from '../../stores/deviceStore';
import { OFFICE_SHELF_IP, PEG_BOARD_IP } from '@env';

const AddDeviceScreen: React.FC = () => {

  const { addDevice } = useDeviceStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => addDevice(OFFICE_SHELF_IP)}
      >
        <Text style={styles.buttonText}>Office Shelf</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => addDevice(PEG_BOARD_IP)}
      >
        <Text style={styles.buttonText}>Peg Board</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
    backgroundColor: 'rgb(10,15,20)',
  },
  button: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'cyan',
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: 'rgb(10,15,20)',
  },
});

export default AddDeviceScreen;