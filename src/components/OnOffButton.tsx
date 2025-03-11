import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useDeviceStore from '../stores/deviceStore';

interface OnOffButtonProps {
  isOnOff: string;
  deviceIp: string;
}

const OnOffButton: React.FC<OnOffButtonProps> = ({ isOnOff, deviceIp }) => {
  const { toggleOnOff } = useDeviceStore();
  const isOff = isOnOff === 'LEDs Off' || isOnOff === 'Unavailable';

  const handlePress = () => {
    toggleOnOff(deviceIp);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.pressableCircle, isOff ? styles.off : styles.on]}
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
  pressableCircle: {
    width: 50,
    height: 50,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'cyan',
  },
  off: {
    borderColor: 'black',
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