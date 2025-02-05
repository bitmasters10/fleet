import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Dimensions,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { io } from "socket.io-client";

const { width } = Dimensions.get("window");

// Initialize socket connection
const socket = io("ws://172.16.239.81:3001");
console.log("helo map")
const MapScreen = ({ isOpen }) => {
  const { position } = useAuth();
  console.log("Position Map:", position);

  useEffect(() => {
    console.log("test")
    // Connect to WebSocket
    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket.id);
    });

    // Join room "all"
    let room = "all";
    socket.emit("rom", room);

    // Send location updates when position changes
    if (position && position.latitude && position.longitude) {
      console.log("helo"+position.latitude)
      socket.emit("loc", {
        room: room,
        lat: position.latitude,
        long: position.longitude,
      });
    }

    return () => {
      socket.disconnect(); // Clean up socket connection on unmount
    };
  }, [position]); // Run effect when position updates

  if (!position || !position.latitude || !position.longitude) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: position.latitude,
            longitude: position.longitude,
          }}
          title="Driver"
          description="This is a marker"
        />
      </MapView>
      {isOpen == "true" ? null : (
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>Instant Delivery</Text>

          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <Icon name="map" size={24} color="#FF4444" />
              <View style={styles.locationInput}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
                <Text style={styles.locationText}>32 Samwell Sq, Chevron</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.locationItem}>
              <Icon name="map" size={24} color="#4FA89B" />
              <View style={styles.locationInput}>
                <Text style={styles.locationLabel}>Delivery Location</Text>
                <Text style={styles.locationText}>
                  21b, Karimu Kotun Street, Victoria Island
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>Enter OTP</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter 4-digit OTP"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};




export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
  speedIndicator: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speedText: {
    fontSize: 14,
    fontWeight: "500",
  },
  markerContainer: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4FA89B",
  },
  detailsCard: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  detailsContent: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationName: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  locationContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  locationInput: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  otpContainer: {
    marginBottom: 20,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  otpInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    letterSpacing: 4,
  },
  button: {
    backgroundColor: "#006A60",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  markerContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4FA89B",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 12,
    color: "#4FA89B",
    fontWeight: "500",
    marginLeft: 4,
  },
});

// Custom map style for the light blue theme
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#e9e9e9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];
