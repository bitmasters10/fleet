import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Use native stack navigator
import BottomTabNavigator from "./navigation/BottomTabNavigator"; // Import BottomTabNavigator
import LoginScreen from "./screen/auth/LoginScreen"; // Import LoginScreen
import HomeScreen from "./screen/HomeScreen"; // Import HomeScreen
import MapScreen from "./screen/MapScreen"; // Import MapScreen
import ProfileScreen from "./screen/ProfileScreen"; // Import ProfileScreen
import FleetScreen from "./screen/FleetScreen"; // Import FleetScreen
import VehicleScreen from "./screen/VehicleScreen";
import Fuel from "./screen/FuelScreen"; 
import { StyleSheet } from "react-native";
import ErrorBoundary from "./ErrorBoundary"; // Import ErrorBoundary
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { TripProvider } from "./context/TripContext";
import { FuelProvider } from './context/FuelContext'; // Import FuelProvider

const Stack = createNativeStackNavigator(); // Create native stack navigator

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TripProvider>
          <FuelProvider> {/* Wrap the FuelProvider around the app components */}
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }} // Hide the header for Login
                />
                <Stack.Screen
                  name="Main"
                  component={BottomTabNavigator}
                  options={{ headerShown: false }} // Hide the header for BottomTabNavigator
                />
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }} // Hide the header for HomeScreen
                />
                <Stack.Screen
                  name="Fleet"
                  component={FleetScreen}
                  options={{ headerShown: false }} // Hide the header for FleetScreen
                />
                <Stack.Screen
                  name="Vehicle"
                  component={VehicleScreen}
                  options={{ headerShown: true }} // Show header for VehicleScreen
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
                <Stack.Screen
                  name="Fuel"
                  component={Fuel}
                  options={{ headerShown: false }} // Hide the header for ProfileScreen
                />
              </Stack.Navigator>
            </NavigationContainer>
          </FuelProvider>
        </TripProvider>
      </AuthProvider>
    </ErrorBoundary>
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
