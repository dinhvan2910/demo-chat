import React, { useContext, useEffect, useLayoutEffect } from 'react';
import {
  Alert,
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GlobalContext } from '../context';
import { socket } from '../utils/index';

function HomeScreen({ navigation }) {
  const {
    showLoginView,
    setShowLoginView,
    currentUserName,
    setCurrentUserName,
    currentUser,
    setCurrentUser,
    allUsers,
    setAllUsers,
  } = useContext(GlobalContext);

  const initReactiveProperties = (user) => {
    user.messages = [];
    user.hasNewMessages = false;
  };

  function handleStart() {
    if (currentUserName.trim() !== '') {
        socket.auth = { currentUserName };
        socket.connect();
    } else {
      Alert.alert('Nhập tên kìa bạn ơi!!!');
    }

    Keyboard.dismiss();
  }

  function setUsersData(users) {
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
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`${socket.id} Connected to the Socket.IO server`);
      console.log(socket.id);
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setCurrentUser(null);
      }
    });
    socket.on("users", (users) => {
      console.log("users list home:", users);
      setUsersData(users);
    });

    socket.on('userDisconnected', ({userID, users}) => {
      console.log('All user userDisconnected', users);
      console.log('User disconnected:', userID);
      setUsersData(users);
    });
  }, [socket]);

  useEffect(() => {
    console.log('currentUser home screen', currentUser);
    console.log('All user home screen', allUsers);
    if (currentUser && Object.keys(currentUser).length) {
      navigation.navigate("Tabs");
    }
  }, [currentUser]);

  return (
    <View style={styles.mainWrapper}>
      <ImageBackground
        source={require('../assets/logo-cty.png')}
        style={styles.homeImage}
      />
      <View>
        {showLoginView ? (
          <View style={styles.infoBlock}>
            <View>
              <Text style={styles.heading}>Nhập tên của bạn để bắt đầu</Text>
              <TextInput
                autoCorrect={false}
                placeholder="Nhập tên của bạn"
                style={styles.loginInput}
                onChangeText={value => setCurrentUserName(value)}
                value={currentUserName}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Pressable
                onPress={handleStart}
                style={styles.button}>
                <View>
                  <Text style={styles.buttonText}>Chat thôi</Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.infoBlock}>
            <Text style={styles.heading}>Demo Chat</Text>
            <Pressable
              style={styles.button}
              onPress={() => setShowLoginView(true)}>
              <View>
                <Text style={styles.buttonText}>Bắt đầu nào!!!</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffb8f6',
  },
  homeImage: {
    width: 200,
    height: 200,
    margin: 20,
  },
  loginInput: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 8,
    backgroundColor: '#fcd2f6',
  },
  infoBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0059ff',
    padding: 15,
    marginVertical: 10,
    width: '30%',
    elevation: 1,
    borderRadius: 50,
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
