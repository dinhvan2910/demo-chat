import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../context';
import { AntDesign } from '@expo/vector-icons';
import ChatComponent from '../components/chat-component';
import NewGroupModal from '../components/modal-component';
import { socket } from '../utils';

function ChatScreen({ navigation }) {
  const {
    currentUserName,
    currentUser,
    allChatRooms,
    setAllChatRooms,
    modalVisible,
    setModalVisible,
    setCurrentUser,
    setShowLoginView,
    allUsers,
  } = useContext(GlobalContext);


  useEffect(() => {
    socket.emit('createJoinChat');
    socket.on("newGroup", (data) => {
      console.log(`${socket.id} has new newGroup: `, data);
      setAllChatRooms(data);
    });
  }, [socket]);

  function handleLogout() {
    setCurrentUser(null);
    setShowLoginView(false);
  }

  useEffect(() => {
    console.log('currentUser chat screen', currentUser);
    if (!currentUser || !Object.keys(currentUser).length) {
      navigation.navigate("HomeScreen");
    }
  }, [currentUser]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>Xin chào <Text style={styles.headingUserName}>{currentUserName}</Text></Text>
          <Pressable onPress={handleLogout}>
            <AntDesign name="logout" size={30} color="black" />
          </Pressable>
        </View>
      </View>
      <View style={styles.listContainer}>
        {
          allChatRooms && allChatRooms.length > 0 ? (
            <FlatList
              data={allChatRooms}
              renderItem={({ item }) => <ChatComponent item={item} />}
              keyExtractor={(item) => item.id}
            />
          ) : null
        }
      </View>
      <View style={styles.bottomContainer}>
        <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
          <View>
            <Text style={styles.buttonText}>Tạo nhóm mới</Text>
          </View>
        </Pressable>
      </View>
      {
        modalVisible && <NewGroupModal />
      }
    </View>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: '#ffb8f6',
    flex: 1,
  },
  topContainer: {
    backgroundColor: '#fff',
    height: 70,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    marginBottom: 15,
    flex: 0.3
  },
  listContainer: {
    flex: 3.4,
    paddingHorizontal: 10,
  },
  bottomContainer: {
    flex: 0.3,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingUserName: {
    fontSize: 30,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#bb007d',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#0059ff',
    padding: 12,
    width: '100%',
    elevation: 1,
    borderRadius: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
