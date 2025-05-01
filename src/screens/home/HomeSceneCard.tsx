import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import useDeviceStore from "../../stores/deviceStore";

interface HomeSceneCardProps {
  // handleScenePress: () => void;
  handleSceneActivation: (index: number) => void;
}

const HomeSceneCard: React.FC<HomeSceneCardProps> = ({ handleSceneActivation }) => {
  const { scenes } = useDeviceStore();

  return (
    <>
      {scenes.length === 0 ? (
        <Text style={styles.sectionText}>
          No scenes created yet. Add a scene to get started!
        </Text>
      ) : (
        <View style={styles.sceneCardContainer}>
          {scenes.map((scene, index) => (
            <TouchableOpacity
            key={scene.name + index}
            style={styles.sceneCard}
            onPress={() => handleSceneActivation(index)}
            >
              <Text style={styles.sceneText} adjustsFontSizeToFit numberOfLines={1}>{scene.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sceneCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sceneCard: {
    backgroundColor: 'rgb(10,15,20)',
    padding: 15,
    borderRadius: 12,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    width: '45%', // Adjust for two-column layout
    alignItems: 'center',
    shadowColor: 'rgb(0, 255, 140)', 
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  sceneText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    // textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(0, 255, 255)',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default HomeSceneCard;