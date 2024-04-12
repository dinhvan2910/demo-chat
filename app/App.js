import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/home";
import GroupsScreen from "./screens/groups";
import MessageScreen from "./screens/message";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GlobalState from "./context";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UsersScreen from "./screens/users";
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => (
  <Tab.Navigator initialRouteName="GroupsScreen">
    <Tab.Screen
      name="GroupsScreen"
      component={GroupsScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Room',
        tabBarIcon: () => (
          <FontAwesome6 name="people-group" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="UsersScreen"
      component={UsersScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'User',tabBarIcon: () => (
          <AntDesign name="message1" size={24} color="black" />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <GlobalState>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
          <Stack.Screen name="MessageScreen" component={MessageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar hidden={true} />
    </GlobalState>
  );
}