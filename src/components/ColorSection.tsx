import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import FavoriteColors from './FavoriteColors';
import { Effect } from '../stores/deviceStore';

interface ColorSectionProps {
  containerNeeded?: boolean;
  selectedEffect?: Effect;
  deviceIp: string;
  colors?: string[];
  setWheelColor?: (color: string) => void;
  setColors?: (colors: string[]) => void;
  styleColor?: string;
}

const ColorSection: React.FC<ColorSectionProps> = ({
  containerNeeded = true,
  selectedEffect,
  deviceIp,
  colors,
  setWheelColor,
  setColors,
  styleColor = 'cyan'
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [solidColor, setSolidColor] = useState<string>('#FFFFFF');
  
  const handleColorChange = (color: string) => {
    if (setColors && colors) {
      const newColors = [...colors];
      newColors[selectedColorIndex] = color;
      setColors(newColors);
    } else if (setWheelColor){
      setSolidColor(color);
      setWheelColor(color);
    }
  };
  
  const addColor = () => {
    if (setColors && colors) {
      if (selectedEffect && colors.length < selectedEffect.colorParams) {
        const newColors = [...colors, ''];
        setColors(newColors);
        setSelectedColorIndex(newColors.length - 1);
      }
    }
  };
  
  const removeColor = (index: number) => {
    if (setColors && colors) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      if (newColors.length === 0) {
        setColors(['']);
        setSelectedColorIndex(0);
      } else if (index <= selectedColorIndex) {
        setSelectedColorIndex(Math.max(0, selectedColorIndex - 1));
      }
    }
  };
  
  const selectColor = (index: number) => {
    setSelectedColorIndex(index);
  };

  const renderColorSquare = (color: string, index: number) => (
    <View key={index.toString()} style={styles.colorItem}>
      <TouchableOpacity
        style={[
          styles.colorSquare,
          { backgroundColor: color || 'white' },
          index === selectedColorIndex && [styles.selectedColorSquare, { shadowColor: color }],
        ]}
        onPress={() => selectColor(index)}
      />
      <TouchableOpacity style={styles.cancelButton} onPress={() => removeColor(index)}>
        <Text style={styles.cancelText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={containerNeeded && [styles.colorSection]}>
      {(selectedEffect && colors) &&
      <Text style={[styles.label, {color: styleColor}]}>
        Colors ({colors.filter((c) => c !== '').length}/{selectedEffect.colorParams})
      </Text>
      }
      {(selectedEffect && colors) &&
      <View style={styles.colorSquaresContainer}>
        {colors.map((color, index) => renderColorSquare(color, index))}
        {colors.length < selectedEffect.colorParams && (
          <View style={styles.colorItem}>
            <TouchableOpacity style={[styles.addButton, {shadowColor: styleColor}]} onPress={addColor}>
              <Text style={[styles.addText, {color: styleColor}]}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      }
      <View style={styles.colorPickerContainer}>
        <ColorPicker
          color={(colors && colors.length > 0 && colors[selectedColorIndex]) || solidColor}
          onColorChange={handleColorChange}
          swatches={false}
          sliderSize={20}
          sliderHidden={true}
        />
      </View>
      <FavoriteColors
        wheelColor={(colors && colors.length > 0 && colors[selectedColorIndex]) || solidColor}
        deviceIp={deviceIp}
        handleColorChange={handleColorChange}
        styleColor={styleColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  colorSection: {
    flex: 1,
    marginBottom: 20,
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgb(22, 24, 29)',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorSquaresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    width: '19%',
    position: 'relative',
    marginHorizontal: '2.5%',
    marginBottom: 15,
  },
  colorSquare: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 10, height: 10 },
  },
  selectedColorSquare: {
    borderWidth: 0,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  cancelButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(1, 101, 121, 0.79)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
    marginTop: -30,
  },
  cancelText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 2,
    borderColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  addText: {
    fontSize: 20,
  },
  colorPickerContainer: {
    height: 280,
    marginBottom: 10,
  },
});

export default ColorSection;