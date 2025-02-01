import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Home, Car, Calendar, AlertCircle, User } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import MapScreen from "../screen/MapScreen";

const BottomTabNavigator = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Home color="#4FA89B" size={24} />
        <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Fleet")}
      >
        <Car color="#666" size={24} />
        <Text style={styles.navText}>Fleet</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Map")}
      >
        <Calendar color="#666" size={24} />
        <Text style={styles.navText}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Alerts")}
      >
        <AlertCircle color="#666" size={24} />
        <Text style={styles.navText}>Alerts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <User color="#666" size={24} />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  activeNavText: {
    color: "#4FA89B",
  },
});

export default BottomTabNavigator;
