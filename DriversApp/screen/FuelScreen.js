import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation } from "@react-navigation/native";
import { useTrip } from "../context/TripContext";

export default function FleetScreen() {
  const navigation = useNavigation();
  const { fetchFuelData, fuelData } = useTrip();
  useEffect(() => {
    fetchFuelData();
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
          <Text style={styles.itemTitle}>{item.id}</Text>
          <Text style={styles.itemSubtitle}>{item.type}</Text>
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
      </View>
      {!fuelData ? (
        <Text style={styles.nodata}>NO Data FOUND</Text>
      ) : (
        <FlatList
          data={fuelData}
          renderItem={renderVehicle}
          keyExtractor={(item) => item.id}
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
  nodata:{
flex:2,
    color: 'red',
    zIndex: 1000,
    fontSize: '1em'
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
  headerRight: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 20,
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
});
