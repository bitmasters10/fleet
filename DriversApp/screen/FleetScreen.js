import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useFuel } from "../context/FuelContext"; // Import useFuel

export default function FleetScreen() {
  const navigation = useNavigation();
  const { fuelData, getVehicles, loading, error } = useFuel();

  useEffect(() => {
    getVehicles(); // Fetch vehicles when the screen loads
  }, []);

  const renderVehicle = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("Vehicle", { vehicle: item })}
    >
      <View style={styles.itemLeft}>
        <View style={styles.vehicleIconContainer}>
          <Icon name="truck" size={24} color="#4FA89B" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.CAR_ID}</Text>
          <Text style={styles.itemSubtitle}>{item.type || "Unknown Type"}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Fuel</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Fuel")}>
          <Text>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("FuelHistory")}>
          <Text>fuel history</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate("FeedBackScreen")}>
          <Text>feedback</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4FA89B" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={fuelData}
          renderItem={renderVehicle}
          keyExtractor={(item) => item.CAR_ID.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#4FA89B",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  listContent: {
    padding: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});
