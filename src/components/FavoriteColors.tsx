import React, {useState} from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import useDeviceStore from "../stores/deviceStore";
import Animated from 'react-native-reanimated';
import useGlow from "../animations/useGlow";


interface FavoriteColorsProps {
  deviceIp: string;
  wheelColor: string;
  handleColorChange?: (color: string) => void;
  handleEdit?: () => void;
}

const FavoriteColors: React.FC<FavoriteColorsProps> = ({
  deviceIp,
  wheelColor,
  handleColorChange,
  handleEdit
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>();
  const [editPalette, setEditPalette] = useState(false);
  const device = useDeviceStore((state) => state.devices[deviceIp]);
  const favoriteColors = device?.favoriteColors
  const {
    addFavoriteColor,
    removeFavoriteColor,
    replaceFavoriteColor
  } = useDeviceStore();

  const glowStyle = useGlow(editPalette, 0.5, 0.9, 1200);

  const handlePaletteEditing = () => {
    setEditPalette(!editPalette);
    if (handleEdit) 
      handleEdit();
  };

  const handleFavoriteColorChange = (color: string, index: number) => {
    setSelectedColorIndex(index);
    if (handleColorChange)
      handleColorChange(color);
  };

  const handleAddToFavorites = () => {
    addFavoriteColor(deviceIp, wheelColor);
  };

  const removeColor = (index: number) => {
    removeFavoriteColor(deviceIp, index);
    if (favoriteColors.length === 0) {
      setSelectedColorIndex(0);
    } else if (selectedColorIndex !== undefined && index <= selectedColorIndex) {
      setSelectedColorIndex(Math.max(0, selectedColorIndex - 1));
    }
  };

  const renderFavoriteColors = (color: string, index: number) => (
    <View key={index.toString()} style={styles.colorItem}>
      <TouchableOpacity
        style={[
          styles.colorSquare,
          { backgroundColor: color || 'transparent' },
          index === selectedColorIndex && [styles.selectedColorSquare, { shadowColor: color }],
        ]}
        onPress={() => handleFavoriteColorChange(color, index)}
      />
      {editPalette && 
        <TouchableOpacity style={styles.cancelButton} onPress={() => removeColor(index)}>
          <Text style={styles.cancelText}>×</Text>
        </TouchableOpacity>
      }
      {editPalette && index === selectedColorIndex && (
        <TouchableOpacity style={styles.swapButton} onPress={() => handleReplacFavoriteColor()}>
          <AntDesignIcons name={'swap'} color='cyan' size={15} />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleReplacFavoriteColor = () => {
    if (selectedColorIndex !== undefined) {
      replaceFavoriteColor(deviceIp, selectedColorIndex, wheelColor);
    }
  }

  return (
    <Animated.View style={[styles.container, glowStyle]}>

      <View style={styles.titleContainer}>
        <Text style={styles.favoriteHeaderText}>
          Favorite Colors
        </Text>
        {editPalette ? (
          <TouchableOpacity
            style={[styles.uniformButton, { backgroundColor: 'cyan' }]}
            onPress={handlePaletteEditing}
          >
            <MaterialIcons name={'done'} color='black' size={20} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.uniformButton} onPress={handlePaletteEditing}>
              <MaterialIcons name={'edit'} color='cyan' size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.colorSquaresContainer}>
        {favoriteColors.map((color, index) => renderFavoriteColors(color, index))}
        {favoriteColors.length < 10 && (
          <View style={styles.colorItem}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddToFavorites}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    shadowColor: 'cyan',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 10,
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
    width: '15%',
    marginHorizontal: "2.5%",
    marginBottom: 15,
    position: 'relative',
  },
  colorSquare: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 10 },
  },
  addButton: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'cyan',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  addText: {
    fontSize: 20,
    color: 'cyan',
  },
  selectedColorSquare: {
    borderWidth: 0,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  uniformButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'rgba(10, 15, 20, 1)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'cyan',
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  favouriteButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  favoriteHeaderText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: 'rgb(0, 255, 255)',
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
  swapButton: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(1, 101, 121, 0.79)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FavoriteColors;
