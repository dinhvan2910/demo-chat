import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from 'react-native';

function ChatComponent({ item }) {
  const navigation = useNavigation();

  function handleNavigateToMessage() {
    navigation.navigate('MessageScreen', {
      currentGroupName: item.currentGroupName,
      currentGroupId: item.id,
    });
  }

  return (
    <Pressable onPress={handleNavigateToMessage} style={styles.chat}>
      <View style={styles.circle}>
        <FontAwesome name='group' size={24} color={"black"} />
      </View>
      <View style={styles.rightContainer}>
        <View>
          <Text style={styles.groupName}>{item.currentGroupName}</Text>
          <Text style={styles.messages}>
            {item && item.messages && item.messages.length ? item.messages[item.messages.length - 1].text : 'Bắt đầu nhắn nào !!!'}
          </Text>
        </View>
        <View>
          <Text style={styles.time}>
            {item && item.messages && item.messages.length ? item.messages[item.messages.length - 1].time : 'Now'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default ChatComponent;

const styles = StyleSheet.create({
  chat: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    height: 80,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    opacity: 0.8,
  },
  rightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  time: {
    opacity: 0.6,
  },
  circle: {
    width: 50,
    borderRadius: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginRight: 10,
  },
});