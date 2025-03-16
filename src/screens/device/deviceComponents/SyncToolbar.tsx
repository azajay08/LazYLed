import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useDeviceStore from '../../../stores/deviceStore';

const SyncToolbar: React.FC = () => {
  const { syncMode, toggleSyncMode } = useDeviceStore(); // Need to add sync mode sync from other components
  const [selected, setSelected] = useState(false);

  const handleSyncAllPress = () => {
    toggleSyncMode();
    setSelected(!selected);
  };

  const handleDesyncAllPress = () => {
    if (selected) {
      toggleSyncMode();
      setSelected(false);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.toolbarContainer}>
        <TouchableOpacity style={styles.syncToolContainer}>
          <MaterialIcons
            name="sync"
            size={30}
            color="cyan"
            style={styles.icon}
          />
          <Text style={styles.syncTooltext}>Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.syncToolContainer,
            selected && styles.selectedSyncToolContainer,
          ]}
          onPress={handleSyncAllPress}
        >
          <MaterialIcons
            name="sync-lock"
            size={30}
            color={selected ? 'rgb(10,15,20)' : 'cyan'}
            style={styles.icon}
          />
          <Text
            style={[
              styles.syncTooltext,
              selected && styles.selectedSyncTooltext,
            ]}
          >
            Sync All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.syncToolContainer}
          onPress={handleDesyncAllPress}
        >
          <MaterialIcons
            name="sync-disabled"
            size={30}
            color="cyan"
            style={styles.icon}
          />
          <Text style={styles.syncTooltext}>Desync</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
  },
  syncToolContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 0,
    marginBottom: 0,
    padding: 8,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 8,
  },
  selectedSyncToolContainer: {
    backgroundColor: 'cyan',
  },
  syncTooltext: {
    fontSize: 15,
    color: 'cyan',
  },
  selectedSyncTooltext: {
    color: 'rgb(10,15,20)',
  },
  icon: {
    marginLeft: -2,
    marginBottom: 0,
  },
  toolbarContainer: {
    flexDirection: 'row' as const,
    marginLeft: 0,
    justifyContent: 'space-between' as const,
  },
});

export default SyncToolbar;