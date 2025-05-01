import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import useDeviceStore from '../../stores/deviceStore'; // Adjust path
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ScenesStackParamList } from './ScenesStackScreen';
import AddSceneModal from './AddSceneModal';
// import EditSceneScreen from './EditSceneScreen';
import EditSceneModal from './EditSceneModal';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import SectionBox from '../../components/SectionBox';
import { colors } from '../../styles/index';

type NavigationProp = StackNavigationProp<ScenesStackParamList, 'ScenesScreen'>;
type ScenesScreenRouteProps = RouteProp<ScenesStackParamList, 'ScenesScreen'>;

const ScenesScreen: React.FC = () => {
  const { scenes, applyScene, addScene, removeScene } = useDeviceStore();
  const route = useRoute<ScenesScreenRouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedScene, setSelectedScene] = useState<{ index: number; name: string } | null>(null);

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  // Handle scene application
  const handleApplyScene = (index: number) => {
    console.log(`Applying scene: ${scenes[index].name}`);
    applyScene(index);
  };

  // Handle long press to show menu
  const handleLongPress = (index: number, name: string) => {
    ReactNativeHapticFeedback.trigger('impactLight', options);
    console.log(`Long press on scene: ${name}`);
    setSelectedScene({ index, name });
    setMenuVisible(true);
  };

  // Handle edit scene
  const handleEditScene = () => {
    if (selectedScene) {
      console.log(`Editing scene: ${selectedScene.name}`);
      navigation.navigate('EditScene', { index: selectedScene.index, name: selectedScene.name });
      setMenuVisible(false);
      setSelectedScene(null);
    }
  };

  // Handle delete scene
  const handleDeleteScene = () => {
    if (selectedScene) {
      console.log(`Deleting scene: ${selectedScene.name}`);
      removeScene(selectedScene.index);
      setMenuVisible(false);
      setSelectedScene(null);
    }
  };

  // Handle modal actions for adding scene
  const handleCreateScene = (sceneName: string) => {
    if (sceneName.trim()) {
      console.log(`Creating scene: ${sceneName}`);
      console.log(`Scene Count: ${scenes.length}`);
      addScene(sceneName, []);
      console.log(`Scene Count: ${scenes.length}`)
      setModalVisible(false);
      // setSelectedScene({ index: scenes.length - 1, name: sceneName });
      if (scenes.length === 0) {
        navigation.navigate('EditScene', { index: 0, name: sceneName });
      } else if (scenes.length > 0) {
        navigation.navigate('EditScene', { index: scenes.length, name: sceneName });
      }
    }
  };

  const handleCancelModal = () => {
    setModalVisible(false);
  };

  // Handle menu cancel
  const handleCancelMenu = () => {
    setMenuVisible(false);
    setSelectedScene(null);
  };

  // Watch for showModal param
  useEffect(() => {
    if (route.params?.showModal) {
      setModalVisible(true);
      navigation.setParams({ showModal: false });
    }
  }, [route.params, navigation]);

  return (
    
  // <ScrollView style={styles.container}>
    <View style={styles.container}>
      {/* Add Scene Modal */}
      <AddSceneModal
        visible={modalVisible}
        cancelModal={handleCancelModal}
        createScene={handleCreateScene}
        />
      <EditSceneModal
        visible={menuVisible}
        cancelMenu={handleCancelMenu}
        editScene={handleEditScene}
        deleteScene={handleDeleteScene}
        />

        {/* Scenes List */}
      <SectionBox
        title={'Favorite Scenes'}
        paddingBuffer={20}
        scrollOn={false}
        titleColor={colors.scenesColor}
        >
        {scenes.length === 0 ? (
          <Text style={styles.sectionText}>
            No scenes created yet. Add some!
          </Text>
        ) : (
          <View style={styles.sectionContentContainer}>
            {scenes.map((scene, index) => (
              <TouchableOpacity
              key={scene.name + index}
              style={styles.sceneCard}
              onPress={() => handleApplyScene(index)}
              onLongPress={() => handleLongPress(index, scene.name)}
              >
                <Text style={styles.sceneTitle}>{scene.name}</Text>
                <Text style={styles.sceneText}>DEVICES:{Object.keys(scene.devices).length}</Text>

              </TouchableOpacity>
            ))}
          </View>
        )}
      </SectionBox>
      <SectionBox
        title={'All Scenes'}
        paddingBuffer={20}
        scrollOn={true}
        titleColor={colors.scenesColor}
        >
        {scenes.length === 0 ? (
          <Text style={styles.sectionText}>
            No scenes created yet. Add some!
          </Text>
        ) : (
          <View style={styles.sectionContentContainer}>
            {scenes.map((scene, index) => (
              <TouchableOpacity
              key={scene.name + index}
              style={styles.sceneCard}
              onPress={() => handleApplyScene(index)}
              onLongPress={() => handleLongPress(index, scene.name)}
              >
                <Text style={styles.sceneTitle}>{scene.name}</Text>
                <Text style={styles.sceneText}>DEVICES:{Object.keys(scene.devices).length}</Text>

              </TouchableOpacity>
            ))}
          </View>
        )}
      </SectionBox>
    </View>

    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(0, 255, 140)',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  sectionContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sceneCard: {
    backgroundColor: 'rgb(10,15,20)',
    padding: 10,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 15,
    width: '45%',
    alignItems: 'center',
    shadowColor: 'rgb(0, 255, 140)',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  sceneTitle:{
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  sceneText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  menuContent: {
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 10,
    marginHorizontal: 40,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(44, 40, 40)',
  },
  menuText: {
    fontSize: 16,
    color: 'rgb(0, 255, 140)',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ScenesScreen;