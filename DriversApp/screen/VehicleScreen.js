import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker, Polyline } from "react-native-maps";


const { width } = Dimensions.get("window");

// Mock route coordinates
const routeCoordinates = [
  { latitude: 30.2672, longitude: -97.7431 },
  { latitude: 30.2749, longitude: -97.7404 },
];

const VehicleScreen = ({ route }) => {
  const { vehicle } = route.params; // Get the vehicle data passed from FleetScreen
  const [activeTab, setActiveTab] = useState("driver");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Image source={{ uri: vehicle.image }} style={styles.headerImage} />
          <View style={styles.headerOverlay}>

            <Text style={styles.vehicleId}>{vehicle.id}</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "driver" && styles.activeTab]}
            onPress={() => setActiveTab("driver")}
          >
            <Text style={styles.tabLabel}>Driver Name</Text>
            <Text style={styles.tabValue}>{vehicle.driverName}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "status" && styles.activeTab]}
            onPress={() => setActiveTab("status")}
          >
            <Text style={styles.tabLabel}>Vehicle Status</Text>
            <Text style={styles.tabValue}>{vehicle.status}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "check" && styles.activeTab]}
            onPress={() => setActiveTab("check")}
          >
            <Text style={styles.tabLabel}>Vehicle Check</Text>
            <Text style={styles.tabValue}>{vehicle.checkDate}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="speedometer" size={24} color="#4FA89B" />
            <Text style={styles.statValue}>{vehicle.km}</Text>
            <Text style={styles.statLabel}>KM</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="gas-station" size={24} color="#4FA89B" />
            <Text style={styles.statValue}>{vehicle.fuel}</Text>
            <Text style={styles.statLabel}>Fuel</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="chart-line" size={24} color="#4FA89B" />
            <Text style={styles.statValue}>{vehicle.lPer100km}</Text>
            <Text style={styles.statLabel}>l/100 km</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="currency-usd" size={24} color="#4FA89B" />
            <Text style={styles.statValue}>{vehicle.revenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live GPS</Text>
            <View style={styles.speedIndicator}>
              <Icon name="speedometer" size={16} color="#4FA89B" />
              <Text style={styles.speedText}>Speed {vehicle.speed}km/hr</Text>
            </View>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: vehicle.latitude,
                longitude: vehicle.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#4FA89B"
                strokeWidth={3}
              />
              <Marker
                coordinate={{
                  latitude: vehicle.latitude,
                  longitude: vehicle.longitude,
                }}
                title="Current Location"
              >
                <View style={styles.markerContainer}>
                  <Icon name="truck" size={20} color="#4FA89B" />
                </View>
              </Marker>
            </MapView>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleId: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4FA89B",
  },
  tabLabel: {
    fontSize: 12,
    color: "#666",
  },
  tabValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  speedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  speedText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4FA89B",
  },
});

export default VehicleScreen;
