import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlobalContext } from '../context';
import { AntDesign } from '@expo/vector-icons';
import ChatComponent from '../components/chat-component';
import { socket } from '../utils/index';

function UsersScreen({ navigation }) {
  const {
    currentUserName,
    setCurrentUserName,
    currentUser,
    setCurrentUser,
    setShowLoginView,
    allUsers,
    setAllUsers,
  } = useContext(GlobalContext);

  const initReactiveProperties = (user) => {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  };

  useLayoutEffect(() => {
    function fetchUsers() {
      fetch("http://192.168.88.182:4000/getUsers")
        .then((res) => res.json())
        .then((users) => {
          console.log("users list user:", users);
          users.forEach((user) => {
            user.self = user.userID === socket.id;
            initReactiveProperties(user);
            setCurrentUser(user);
          });
          // put the current user first, and then sort by userName
          users = users.sort((a, b) => {
            if (a.self) return -1;
            if (b.self) return 1;
            if (a.userName < b.userName) return -1;
            return a.userName > b.userName ? 1 : 0;
          });
          setAllUsers(users);
        })
        .catch((err) => console.error(err));
    }
    fetchUsers();
  }, []);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
        <Text style={styles.headingUserName}>{currentUserName}</Text>
          {/* <Pressable onPress={handleLogout}>
            <AntDesign name="logout" size={30} color="black" />
          </Pressable> */}
        </View>
      </View>
      <View style={styles.listContainer}>
        {
          allUsers && allUsers.length > 0 ? (
            <FlatList
              data={allUsers}
              renderItem={({ item }) => <ChatComponent item={item} data="users" />}
              keyExtractor={(item) => item.userID}
            />
          ) : null
        }
      </View>
    </View>
  );
}

export default UsersScreen;

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
    flex: 0.2
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
