import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator"; // Import BottomTabNavigator
import LoginScreen from "./screen/auth/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import MapScreen from "./screen/MapScreen"; // Import MapScreen
import ProfileScreen from "./screen/ProfileScreen";
import FleetScreen from "./screen/FleetScreen";
import VehicleScreen from "./screen/VehicleScreen";
import { StyleSheet } from "react-native";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide the header for Login
        />
         <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Hide the header for ProfileScreen
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }} // Hide the header for BottomTabNavigator
        />
       
        <Stack.Screen
          name="Fleet"
          component={FleetScreen}
          options={{ headerShown: false }} // Hide the header for FleetScreen
        />
        <Stack.Screen
          name="Vehicle"
          component={VehicleScreen}
          options={{ headerShown: false }} // Hide the header for VehicleScreen
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerShown: false }} // Hide the header for MapScreen
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }} // Hide the header for ProfileScreen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
