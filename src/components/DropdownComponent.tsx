import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View, Text } from 'react-native';
import useDeviceStore from '../stores/deviceStore';

interface DropdownComponentProps {
  deviceIp: string;
}

interface DropdownItem {
  label: string;
  value: number;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ deviceIp }) => {
  const { devices, setEffect } = useDeviceStore();
  const [selectedEffect, setSelectedEffect] = useState<number | null>(null);
  const device = devices[deviceIp];

  useEffect(() => {
    if (device && device.effectsList.length > 0) {
      const currentEffect = device.effectsList.find(effect => effect.functionNumber === device.effectNumber);
      if (currentEffect) {
        setSelectedEffect(currentEffect.functionNumber);
      }
    }
  }, [device]);

  const handleSelection = (item: DropdownItem) => {
    setSelectedEffect(item.value);
    setEffect(deviceIp, item.value);
  };

  return (
    <View style={styles.dropdownWrapper}>
      {device && device.effectsList && device.effectsList.length > 0 ? (
        <Dropdown
          data={device.effectsList.map(effect => ({
            label: effect.name,
            value: effect.functionNumber,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Select an effect"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          itemTextStyle={styles.itemTextStyle}
          itemContainerStyle={{ borderRadius: 14, }}
          activeColor="rgba(0, 213, 255, 0.64)"
          style={styles.dropdown}
          value={selectedEffect}
          onChange={handleSelection}
        />
      ) : (
        <View style={styles.noEffectsContainer}>
          <Text style={styles.noEffectsText}>No effects available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownWrapper: {
    marginVertical: 10,
  },
  dropdown: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderWidth: 0.6,
    borderColor: 'cyan',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
  },
  dropdownContainer: {
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 20,
    borderWidth: 0.6,
    borderColor: 'cyan',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  itemTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  noEffectsContainer: {
    padding: 10,
    backgroundColor: 'rgba(10, 15, 20, 0.8)',
    borderRadius: 20,
  },
  noEffectsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center' as const,
  },
});

export default DropdownComponent;