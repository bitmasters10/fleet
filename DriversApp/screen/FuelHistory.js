import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useFuel } from "../context/FuelContext"; // Ensure the correct import path

export default function FuelHistory() {
  const { fuelData, getFuelRecords, loading, error } = useFuel();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const HOME = "http:// 192.168.10.122:3000";
  const home = HOME;

  useEffect(() => {
    getFuelRecords();
  }, []);

  // Fetch image directly from the backend
  const handleViewImage = (fuelId) => {
    const imageUrl = `${home}/admin/img/fuel-view/${fuelId}`; // Replace with actual backend endpoint
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.F_ID}</Text>
      <Text style={styles.cell}>{item.CAR_ID}</Text>
      <Text style={styles.cell}>{item.DATE}</Text>
      <Text style={styles.cell}>{item.COST}</Text>
      <Text style={styles.cell}>{item.stat}</Text>
      <TouchableOpacity onPress={() => handleViewImage(item.F_ID)}>
        <Text style={styles.viewImageText}>View Image</Text>
      </TouchableOpacity>
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
        <Text style={styles.headerCell}>Photo</Text>
      </View>
      <FlatList
        data={fuelData}
        renderItem={renderItem}
        keyExtractor={(item) => (item.F_ID ? item.F_ID.toString() : Math.random().toString())}
      />

      {/* Modal for displaying image */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            )}
          </View>
        </View>
      </Modal>
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
  viewImageText: {
    color: "#007BFF",
    textAlign: "center",
    textDecorationLine: "underline",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "red",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});
