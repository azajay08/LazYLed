import React from 'react';
import { View, StyleSheet, Modal, Text, TextInput, TouchableOpacity } from 'react-native';

interface AddSceneModalProps {
  visible: boolean;
  cancelModal: () => void;
  createScene: (sceneName: string) => void;
}

const AddSceneModal: React.FC<AddSceneModalProps> = ({
  visible,
  cancelModal,
  createScene,
}) => {
  const [sceneName, setSceneName] = React.useState('');

  const handleCancelModal = () => {
    cancelModal();
    setSceneName(''); // Clear the input field
  }

  const handleCreateScene = () => {
    if (sceneName.trim()) {
      createScene(sceneName);
      setSceneName(''); // Clear the input field
    }
  }


  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={handleCancelModal}
      >
        <TouchableOpacity onPress={handleCancelModal} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Scene</Text>
            <TextInput
              style={styles.input}
              placeholder="Scene Name"
              placeholderTextColor="rgb(150, 150, 150)"
              value={sceneName}
              onChangeText={setSceneName}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateScene}>
              <Text style={styles.buttonText}>Create Scene</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'rgb(46, 47, 46)' }]}
              onPress={handleCancelModal}
            >
              <Text style={[styles.buttonText, { color: 'rgb(0, 255, 140)' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal> 
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'rgb(22, 24, 29)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
  },
  modalTitle: {
    fontSize: 24,
    color: 'rgb(0, 255, 140)',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'rgb(0, 255, 140)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
    backgroundColor: 'rgb(30, 35, 40)',
    marginBottom: 20,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(0, 255, 140)',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
  },
  buttonText: {
    color: 'rgb(10, 15, 20)',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddSceneModal;