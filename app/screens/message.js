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
  const { data, itemData } = route.params;
  const {
    allChatMessages,
    setAllChatMessages,
    currentUser,
    setCurrentUser,
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
      const dataChat = {
        currentChatMesage,
        currentUserName,
        timeData,
      };
      console.log('dataChat', dataChat)
      if (data === 'groups') {
        dataChat.groupId = itemData.id;
        socket.emit('newChatMessage', dataChat);
      } else {
        socket.emit("privateMessage", {
          content: dataChat,
          to: itemData.userID,
        });
        // const newMessage = {
        //   id: Math.random().toString(20).substring(2, 10),
        //   text: currentChatMesage,
        //   currentUserName: currentUserName,
        //   time: `${timeData.hour}:${timeData.minutes}`,
        // };
        // currentUser.messages.push(newMessage);
        // setCurrentUser(currentUser);
      }

      setCurrentChatMessage('');
      Keyboard.dismiss();
    }
  }

  useEffect(() => {
    console.log('data', data);
    console.log('itemData', itemData);
    if (data === 'groups') {
      navigation.setOptions({ title: itemData.currentGroupName });
      socket.emit("findGroup", itemData.id);
      socket.on("newMessage", (data) => {
        console.log(`${socket.id} has new message: `, data);
        setAllChatMessages(data);
      });
      socket.on("foundGroup", (newMessage) => {
        console.log(`new Message foundGroup ${socket.id}`, newMessage);
        setAllChatMessages(newMessage);
      });
    } else {
      navigation.setOptions({ title: itemData.userName });

      socket.on("newPrivateMessage", ({ newMessage, from }) => {
        console.log('newPrivateMessage newMessage ' + socket.id, newMessage);
        setAllChatMessages(newMessage);
        // const user = {
        //   ...currentUser,
        // };
        // if (user.messages && user.messages.length) {
        //   const findUser = user.messages.find(x => x.id === newMessage.id);
        //   if (!findUser) {
        //     user.messages.push(newMessage);
        //   }
        // } else {
        //   user.messages.push(newMessage);
        // }
        // console.log('user message', user);
        // setCurrentUser(user);
      });
      socket.on("foundUserMessage", (message) => {
        console.log(`new Message foundUserMessage ${socket.id}`, message);
        setAllChatMessages(message);
      });
    }
  }, []);

  return (
    <View style={styles.mainWrapper}>
      <View style={[styles.mainWrapper, { paddingVertical: 15, paddingHorizontal: 10 }]}>
        {
          // data === 'groups' ? (
          allChatMessages && allChatMessages[0] ?
            <FlatList
              data={allChatMessages}
              renderItem={({ item }) => <MessageComponent item={item} currentUserName={currentUserName} />}
              keyExtractor={(item) => item.id}
            />
            : ''
          // ) : (
          //   currentUser && currentUser.messages ?
          //   <FlatList
          //     data={currentUser.messages}
          //     renderItem={({ item }) => <MessageComponent item={item} currentUserName={currentUserName} />}
          //     keyExtractor={(item) => item.id}
          //   />
          //   : ''
          // )
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
    backgroundColor: "#f9e3ff",
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
