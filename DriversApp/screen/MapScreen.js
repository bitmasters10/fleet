import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import MapView, { Marker} from "react-native-maps";
import BottomNav from "../navigation/BottomTabNavigator";

const { width } = Dimensions.get("window");

// Mock route coordinates
const routeCoordinates = [
  { latitude: 30.2672, longitude: -97.7431 }, // Austin coordinates
  { latitude: 30.2749, longitude: -97.7404 },
  { latitude: 30.2798, longitude: -97.7368 },
];

// Mock vehicle locations
const vehicles = [
  { id: 1, latitude: 30.2672, longitude: -97.7431, speed: 60 },
  { id: 2, latitude: 30.2749, longitude: -97.7404, speed: 45 },
  { id: 3, latitude: 30.2798, longitude: -97.7368, speed: 30 },
];

const MapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <Marker
        coordinate={{ latitude: 30.2672, longitude: -97.7431 }}
        title="Marker"
        description="This is a marker"
      />
      <BottomNav />
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
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
