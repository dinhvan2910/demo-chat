import React, { useContext, useEffect, useLayoutEffect } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import MessageComponent from '../components/message-component';
import { GlobalContext } from '../context';
import { socket } from '../utils/index';

function MessageScreen({ navigation, route }) {
  const { currentGroupId, currentGroupName } = route.params;
  const {
    allChatMessages,
    setAllChatMessages,
    currentUser,
    currentUserName,
    currentChatMesage,
    setCurrentChatMessage,
  } = useContext(GlobalContext);

  function handleAddNewMessage() {
    const timeData = {
      hour: new Date().getHours() < 10 ? `0${new Date().getHours()}` : new Date().getHours(),
      minutes: new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes(),
    };

    if (currentUser) {
      const data = {
        currentChatMesage,
        groupId: currentGroupId,
        currentUserName,
        timeData,
      };
      console.log('data', data)
      socket.emit('newChatMessage', data);

      setCurrentChatMessage('');
      Keyboard.dismiss();
    }
  }

  useEffect(() => {
    navigation.setOptions({ title: currentGroupName });
    socket.emit("findGroup", currentGroupId);
    socket.on("newMessage", (data) => {
      console.log(`${socket.id} has new message: `, data);
      setAllChatMessages(data);
    });
    socket.on("foundGroup", (newMessage) => {
      console.log(`new Message foundGroup ${socket.id}`, newMessage);
      setAllChatMessages(newMessage);
    });
  }, []);

  return (
    <View style={styles.mainWrapper}>
      <View style={[styles.mainWrapper, { paddingVertical: 15, paddingHorizontal: 10 }]}>
        {
          allChatMessages && allChatMessages[0] ?
            <FlatList
              data={allChatMessages}
              renderItem={({ item }) => <MessageComponent item={item} currentUserName={currentUserName} />}
              keyExtractor={(item) => item.id}
            />
            : ''
        }
      </View>
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={currentChatMesage}
          onChangeText={(value) => setCurrentChatMessage(value)}
          placeholder='Nhập tin nhắn'
        />
        <Pressable onPress={handleAddNewMessage} style={styles.button}>
          <View>
            <Text style={styles.buttonText}>Gửi</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default MessageScreen;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "#eee",
  },
  messageInputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  messageInput: {
    borderWidth: 1,
    padding: 15,
    flex: 1,
    borderRadius: 50,
    marginRight: 10,
  },
  button: {
    width: "30%",
    backgroundColor: "#703efe",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});
