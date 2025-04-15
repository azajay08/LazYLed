import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import useDeviceStore from '../../stores/deviceStore';
import OnOffButton from './deviceComponents/OnOffButton';
import DropdownComponent from './deviceComponents/DropdownComponent';
import BrightnessSlider from './deviceComponents/BrightnessSlider';
import { StackNavigationProp } from '@react-navigation/stack';
import { DeviceStackParamList } from './DeviceStackScreen';
import { Device } from '../../stores/deviceStore';
import EffectGradientShadow from '../../components/EffectShadowGradient';

interface DeviceCardProps {
  deviceIp: string;
  device: Device;
  navigation: StackNavigationProp<DeviceStackParamList, 'DeviceScreen'>;
}

const DeviceCard: React.FC<DeviceCardProps> = memo(({ deviceIp, device, navigation }) => {
  const { cycleEffect } = useDeviceStore();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isEffectRunning = device.effectName &&
    device.effectName !== "Solid Color" &&
    device.effectName !== "LEDs Off" &&
    device.effectName !== "Unavailable" &&
    device.effectName !== "Unknown";
  const isDeviceOn = device.effectName &&
    device.effectName !== "LEDs Off" &&
    device.effectName !== "Unavailable" &&
    device.effectName !== "Unknown";
  const effectsList = device.effectsList || [];

  const getPreset = () => { 
    if (isEffectRunning) {
      const effect = effectsList.find((effect) => effect.functionNumber === device.effectNumber);
      return effect?.sampleGradient || [];
    }
    return [];
  }

  const gradientPresetColors = getPreset();

  const rendersquare = () => {
    if (isEffectRunning) {
      const gradientColors = ['#ff8700', '#f000ff', '#00fff3'];
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={styles.square}
        />
      );
    }
    if (!isDeviceOn) {
      return <View style={[styles.square, { backgroundColor: '#000000' }]} />;
    }
    return <View style={[styles.square, { backgroundColor: device.color || '#000000' }]} />;
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <View style={styles.cardWrapper}>
      {isEffectRunning && <EffectGradientShadow colors={gradientPresetColors} />}

      <View
        style={[
          styles.sectionContainer,
          isEffectRunning && { shadowOpacity: 0 },
          isCollapsed && styles.collapsedContainer,
          device.effectName === 'Solid Color' && { shadowColor: device.color || 'cyan' },
        ]}
      >
        <View style={styles.rowView}>
          <View style={styles.headerTextContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.sectionTitle}>{device.deviceName || 'Unnamed Device'}</Text>
              <MaterialIcons
                name={isCollapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                size={24}
                color="cyan"
                onPress={toggleCollapse}
              />
            </View>
            <BrightnessSlider deviceIp={deviceIp} />
          </View>
          
          <View style={styles.onOffButtonContainer}>
            <OnOffButton isOnOff={device.effectName || 'LEDs Off'} deviceIp={deviceIp} />
          </View>
        </View>

        {!isCollapsed && (
          <>
            <View style={styles.rowView}>

            <TouchableOpacity onPress={() => navigation.navigate('ColorPicker', { deviceIp })}>
              {rendersquare()}
            </TouchableOpacity>
            <Text style={styles.sectionContent}>Effect: {device.effectName || 'None'}</Text>
            </View>

            <View style={styles.effectContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EffectPickerScreen', { deviceIp })}
                style={styles.pressableContainer}
              >
                <Text style={styles.pressableText}>Effects</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => cycleEffect(deviceIp)}
                style={styles.pressableContainer}
              >
                <MaterialIcons name="loop" size={20} color="cyan" style={styles.icon} />
                <Text style={styles.pressableText}>Cycle Effect</Text>
              </TouchableOpacity>
            </View>

            
            {/* <DropdownComponent deviceIp={deviceIp} /> */}

            <View style={styles.rowView}>
            <Text style={styles.favouritesTitle}>Favourites:</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.deviceIp === nextProps.deviceIp &&
         prevProps.device === nextProps.device &&
         prevProps.navigation === nextProps.navigation;
});

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 30,
    position: 'relative' as const,
  },
  sectionContainer: {
    padding: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
  collapsedContainer: {
    paddingVertical: 10,
  },
  rowView: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: 'rgb(0, 255, 255)',
    marginRight: 5, // Slight space between title and chevron
  },
  sectionContent: {
    fontSize: 14,
    color: 'white',
  },
  effectContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 5,
    justifyContent: 'space-between' as const,
  },
  pressableContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 8,
    backgroundColor: 'rgb(10, 15, 20)',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    borderColor: 'cyan',
    borderWidth: 0.5,
  },
  pressableText: {
    fontSize: 15,
    color: 'cyan',
  },
  icon: {
    marginLeft: -2,
  },
  square: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  onOffButtonContainer: {
    marginLeft: 10,
  },
  chevron: {
    // Removed absolute positioning
  },
  favouritesTitle: {
    fontSize: 18,
    // fontWeight: 'bold' as const,
    color: 'rgb(0, 255, 255)',
    marginRight: 5, // Slight space between title and chevron
  },
});

export default DeviceCard;