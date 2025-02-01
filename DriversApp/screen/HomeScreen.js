import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker } from "react-native-maps";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import BottomTabNavigator from "../navigation/BottomTabNavigator";

// Mock data for the spending graph
const spendingData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    {
      data: [800, 950, 875, 925, 1250, 1100, 1000, 900],
    },
  ],
};

// Mock location data
const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomePage() {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XMfqCGbKprTws58VRP3h88w04AUotH.png",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.userName}>Alfredo Curtis</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color="#4FA89B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Live GPS Section */}
        <TouchableOpacity onPress={() => navigation.navigate("Map")}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live GPS</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <MapView style={styles.map} initialRegion={initialRegion}>
                <Marker
                  coordinate={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                  }}
                  title="Vehicle Location"
                  description="Current location of the vehicle"
                />
              </MapView>
            </View>
          </View>
        </TouchableOpacity>

        {/* Spending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.graphContainer}>
            <LineChart
              data={spendingData}
              width={screenWidth - 70}
              height={180}
              chartConfig={{
                backgroundColor: "#F5F5F5",
                backgroundGradientFrom: "#F5F5F5",
                backgroundGradientTo: "#F5F5F5",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(79, 168, 155, ${opacity})`,
                style: {
                  borderRadius: 12,
                },
              }}
              bezier
              style={{
                borderRadius: 12,
              }}
            />
          </View>
        </View>

        {/* Upcoming Deadlines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.deadlineItem}>
            <View style={styles.deadlineIcon}>
              <Icon name="filter" size={24} color="#4FA89B" />
            </View>
            <View style={styles.deadlineInfo}>
              <Text style={styles.deadlineTitle}>Filter Change</Text>
              <Text style={styles.deadlineDate}>Due On: Jan 12, 2022</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.arrowRight}>→</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deadlineItem, styles.activeDeadline]}
          >
            <View style={styles.deadlineIcon}>
              <Icon name="oil" size={24} color="#fff" />
            </View>
            <View style={styles.deadlineInfo}>
              <Text style={styles.activeDeadlineTitle}>Oil Change</Text>
              <Text style={styles.activeDeadlineDate}>
                Due On: Aug 18, 2022
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.activeArrowRight}>→</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomTabNavigator navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4FA89B",
  },
  mapContainer: {
    height: 200,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  graphContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
  },
  deadlineItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 10,
  },
  activeDeadline: {
    backgroundColor: "#4FA89B",
  },
  deadlineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  deadlineDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  activeDeadlineTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  activeDeadlineDate: {
    fontSize: 14,
    color: "#E0E0E0",
    marginTop: 4,
  },
  arrowRight: {
    fontSize: 20,
    color: "#666",
  },
  activeArrowRight: {
    fontSize: 20,
    color: "#fff",
  },
});
