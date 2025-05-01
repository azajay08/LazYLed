import React from "react";
import { View, StyleSheet, Modal, Text, TextInput, TouchableOpacity } from "react-native";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useDeviceStore from "../../stores/deviceStore";


interface SceneNameEditProps {
  sceneName: string;
  setSceneName: (name: string) => void;
}

const SceneNameEdit: React.FC<SceneNameEditProps> = ({
  sceneName,
  setSceneName,
}) => {
  const [editMode, setEditMode] = React.useState(false);
  
  return (
    <>
    {!editMode ? (
      <View style={styles.titleContainer}>
        <View >

        <Text style={styles.sceneTitle}>{sceneName}</Text>
        </View>
      <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
        <AntDesignIcons name={'edit'} color='rgb(0, 255, 140)' size={25} />
      </TouchableOpacity>
    </View>
    ): (
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.input}
          value={sceneName}
          onChangeText={setSceneName}
          placeholder="Scene Name"
          placeholderTextColor="rgb(150, 150, 150)"
          />
        <TouchableOpacity style={[styles.editButton, {backgroundColor: 'rgb(0, 255, 140)'}]} onPress={() => setEditMode(!editMode)}>
          <MaterialIcons name={'done'} color='rgb(22, 24, 29)' size={25} />
        </TouchableOpacity>
      </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10,15,20)',
  },
  innerContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingBottom: 10,
  },
  editButton: {
    height: 50,
    backgroundColor: 'rgb(22, 24, 29)',
    borderRadius: 10,
    borderColor: 'rgb(0, 255, 140)',
    borderWidth: 1,
    padding: 10,
    marginLeft: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    elevation: 10,
  },
  sceneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(0, 255, 140)',
    marginLeft: 10,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'rgb(0, 255, 140)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
    backgroundColor: 'rgb(30, 35, 40)',
    marginBottom: 0,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
  },
});

export default SceneNameEdit;
