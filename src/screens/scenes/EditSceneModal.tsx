import React from "react";
import { View, StyleSheet, Modal, Text, TextInput, TouchableOpacity } from 'react-native';

interface EditSceneModalProps {
  visible: boolean;
  cancelMenu: () => void;
  editScene: () => void;
  deleteScene: () => void;
}

const EditSceneModal: React.FC<EditSceneModalProps> = ({
  visible,
  cancelMenu,
  editScene,
  deleteScene
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={cancelMenu}
    >
      <TouchableOpacity style={styles.menuOverlay} onPress={cancelMenu}>
        <View style={styles.menuContent}>
          <TouchableOpacity style={styles.menuItem} onPress={editScene}>
            <Text style={styles.menuText}>Edit Scene</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={deleteScene}>
            <Text style={[styles.menuText, { color: 'rgb(255, 100, 100)' }]}>Delete Scene</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
};

const styles = StyleSheet.create({
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
    borderBottomColor: 'rgb(1, 1, 1)',
  },
  menuText: {
    fontSize: 16,
    color: 'rgb(0, 255, 140)',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default EditSceneModal;