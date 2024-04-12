import { StyleSheet, Text, View } from "react-native";

export default function MessageComponent({ currentUserName, item }) {
  const currentUserStatus = item.currentUserName !== currentUserName;

  return (
    <View style={currentUserStatus ? {} : { alignItems: "flex-end" }}>
      <View style={styles.messageItemWrapper}>
        <Text style={styles.messageUserName}>{item.currentUserName}</Text>
        <View style={styles.messageItemInnerWrapper}>
          <View
            style={
              currentUserStatus
                ? styles.messageItem
                : [styles.messageItem, { backgroundColor: "#703efe" }]
            }
          >
            <Text
              style={
                currentUserStatus ? { color: "#000" } : { color: "#e5c1fe" }
              }
            >
              {item.text}
            </Text>
          </View>
        </View>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageItemWrapper: {
    maxWidth: "50%",
    marginBottom: 15,
  },
  messageItemInnerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageItem: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 2,
  },
  messageTime: {
    marginLeft: 10,
    fontSize: 14,
    textAlign: 'right'
  }
});