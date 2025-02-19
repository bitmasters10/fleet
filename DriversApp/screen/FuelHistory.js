import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useFuel } from "../context/FuelContext"; // Adjust the import path as needed

export default function FuelHistory() {
  const { fuelData, getFuelRecords, loading, error } = useFuel();

  useEffect(() => {
    getFuelRecords();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.F_ID}</Text>
      <Text style={styles.cell}>{item.CAR_ID}</Text>
      <Text style={styles.cell}>{item.DATE}</Text>
      <Text style={styles.cell}>{item.COST}</Text>
      <Text style={styles.cell}>{item.stat}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4FA89B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Fuel History</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Car ID</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Cost</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>
      <FlatList
        data={fuelData}
        renderItem={renderItem}
        keyExtractor={(item) => item.F_ID}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4FA89B",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
