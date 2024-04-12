import React, { useContext, useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ChatComponent from '../components/chat-component';
import { GlobalContext } from '../context';

function UsersScreen({ navigation }) {
  const {
    allUsers,
  } = useContext(GlobalContext);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.headingUserName}>Danh sách user</Text>
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
