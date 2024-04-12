import React, { useContext } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Keyboard } from 'react-native';
import { GlobalContext } from '../context';
import { socket } from '../utils';

const NewGroupModal = () => {
  const {
    modalVisible,
    setModalVisible,
    currentGroupName,
    setCurrentGroupName
  } = useContext(GlobalContext);

  function handlerCreateNewRoom() {
    socket.emit('createNewGroup', currentGroupName);
    setModalVisible(false);
    setCurrentGroupName('');
    Keyboard.dismiss();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            autoCorrect={false}
            placeholder="Nhập tên nhóm"
            style={styles.loginInput}
            onChangeText={value => setCurrentGroupName(value)}
            value={currentGroupName}
          />
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={handlerCreateNewRoom}
              style={styles.button}>
              <View>
                <Text style={styles.buttonText}>OK</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.button}>
              <View>
                <Text style={styles.buttonText}>Thôi</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    height: 200,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loginInput: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 8,
    backgroundColor: '#fff0fd',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0059ff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginVertical: 10,
    elevation: 1,
    borderRadius: 50,
    width: 'auto',
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'space-between'
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default NewGroupModal;