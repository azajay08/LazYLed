import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useDeviceStore from '../../../stores/deviceStore';

interface OnOffButtonProps {
  isOnOff: string;
  deviceIp: string;
}

const OnOffButton: React.FC<OnOffButtonProps> = ({ isOnOff, deviceIp }) => {
  const { toggleOnOff } = useDeviceStore();
  const brightness = useDeviceStore((state) => state.devices[deviceIp]?.brightness);
  const isOff = isOnOff === 'LEDs Off' || isOnOff === 'Unavailable' || brightness === 0;

  const handlePress = () => {
    toggleOnOff(deviceIp);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.pressableSquare, isOff ? styles.off : styles.on]}
      >
        <MaterialCommunityIcons
          name="power"
          size={30}
          style={[styles.icon, isOff ? styles.iconOff : styles.iconOn]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 5,
  },
  pressableSquare: {
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    width: 50,
    height: 50,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'cyan',
  },
  off: {
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderColor: 'black',
    borderWidth: 3,
  },
  on: {
    borderColor: 'cyan',
    backgroundColor: 'rgba(10, 15, 20, 1)',
  },
  iconOff: {
    color: 'black',
  },
  iconOn: {
    color: 'cyan',
  },
  icon: {
    marginLeft: 0,
    marginBottom: 0,
  },
});

export default OnOffButton;