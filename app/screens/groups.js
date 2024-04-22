import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../context';
import { AntDesign } from '@expo/vector-icons';
import ChatComponent from '../components/chat-component';
import NewGroupModal from '../components/modal-component';
import { socket } from '../utils';

function GroupsScreen({ navigation }) {
  const {
    currentUser,
    allChatRooms,
    setAllChatRooms,
    modalVisible,
    setModalVisible,
  } = useContext(GlobalContext);

  useEffect(() => {
    socket.emit('createJoinChat');
    socket.on("groupList", (groups) => {
      setAllChatRooms(groups);
    });
    socket.on("newGroup", (data) => {
      console.log(`${socket.id} has new newGroup: `, data);
      setAllChatRooms(data);
    });
  }, [socket]);

  useEffect(() => {
    if (!currentUser || !Object.keys(currentUser).length) {
      navigation.navigate("HomeScreen");
    }
  }, [currentUser]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.headingUserName}>Danh sách Group chat</Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <AntDesign name="addusergroup" size={30} color="blue" />
          </Pressable>
        </View>
      </View>
      <View style={styles.listContainer}>
        {
          allChatRooms && allChatRooms.length > 0 ? (
            <FlatList
              data={allChatRooms}
              renderItem={({ item }) => <ChatComponent item={item} data="groups" />}
              keyExtractor={(item) => item.id}
            />
          ) : null
        }
      </View>
      {
        modalVisible && <NewGroupModal />
      }
    </View>
  );
}

export default GroupsScreen;

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: '#cebacb',
    flex: 1,
  },
  topContainer: {
    backgroundColor: '#fff',
    height: 70,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    marginBottom: 15,
    flex: 0.2,
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
    justifyContent: 'space-between',
  },
  headingUserName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#bb007d',
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
