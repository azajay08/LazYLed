import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface BrightnessSectionProps {
  brightness: number;
  setBrightness: (brightness: number) => void;
  styleColor?: string;
} 

const BrightnessSection: React.FC<BrightnessSectionProps> = ({
  brightness,
  setBrightness,
  styleColor = 'rgb(0, 255, 140)'
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: styleColor}]}>Brightness: {brightness}%</Text>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent:'space-between', }}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={23} color={'rgb(0, 255, 140)'} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={brightness}
          onValueChange={setBrightness}
          thumbTintColor={styleColor}
          minimumTrackTintColor={styleColor}
          maximumTrackTintColor="black"
          tapToSeek={true}
          step={5}
          />
        <MaterialCommunityIcons name="lightbulb-on" size={30} color={'rgb(0, 255, 140)'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    padding: 20,
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '75%',
    height: 10,
  },
});

export default BrightnessSection;
