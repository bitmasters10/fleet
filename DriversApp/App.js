import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; 
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import BottomTabNavigator from "./navigation/BottomTabNavigator"; 
import LoginScreen from "./screen/auth/LoginScreen"; 
import HomeScreen from "./screen/HomeScreen"; 
import MapScreen from "./screen/MapScreen"; 
import ProfileScreen from "./screen/ProfileScreen"; 
import FleetScreen from "./screen/FleetScreen"; 
import VehicleScreen from "./screen/VehicleScreen";
import FuelHistory from "./screen/FuelHistory";
import BookingScreen from "./screen/BookingScreen";
import Fuel from "./screen/FuelScreen"; 
import { StyleSheet } from "react-native";
import ErrorBoundary from "./ErrorBoundary"; 
import { AuthProvider } from "./context/AuthContext"; 
import { TripProvider } from "./context/TripContext";
import { FuelProvider } from './context/FuelContext'; 
import { BookProvider } from './context/BookingContext'; 
import { CarProvider } from './context/CarContext'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Wrap the entire app */}
      <ErrorBoundary>
        <AuthProvider>
          <TripProvider>
            <BookProvider>
              <CarProvider>
            <FuelProvider>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                  <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
                  <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Fleet" component={FleetScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Vehicle" component={VehicleScreen} options={{ headerShown: true }} />
                  <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Fuel" component={Fuel} options={{ headerShown: false }} />
                  <Stack.Screen name="FuelHistory" component={FuelHistory} options={{ headerShown: false }} />
                  <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
              </NavigationContainer>
            </FuelProvider>
            </CarProvider>
            </BookProvider>
          </TripProvider>
        </AuthProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
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
