import React, { useContext } from "react";
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

import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import MapScreen from "./MapScreen";

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const { user} = useContext(AuthContext);
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
            <Text style={styles.userName}>{user?.NAME}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell" size={24} color="#4FA89B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Live GPS Section */}
        
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live GPS</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Map")}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <MapScreen isOpen="true"/>
            </View>
          </View>
        

        {/* Spending Section */}
        <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Requests</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Requests")}>
            <Text style={styles.seeAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsContainer}>
          {/* Electronics Request */}
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.requestType}>
                <Icon name="devices" size={20} color="#4FA89B" />
                <Text style={styles.requestTypeText}>Electronics/Gadgets</Text>
              </View>
              <Text style={styles.recipientText}>Receipient: Paul Pogba</Text>
            </View>

            <View style={styles.locationInfo}>
              <Icon name="bicycle" size={20} color="#4FA89B" />
              <Text style={styles.locationText}>Maryland busstop, Anthony Ikeja</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Food Items Request */}
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.requestType}>
                <Icon name="food" size={20} color="#4FA89B" />
                <Text style={styles.requestTypeText}>Food Items/Groceries</Text>
              </View>
              <Text style={styles.recipientText}>Receipient: Paul Pogba</Text>
            </View>

            <View style={styles.locationInfo}>
              <Icon name="bicycle" size={20} color="#4FA89B" />
              <Text style={styles.locationText}>Maryland busstop, Anthony Ikeja</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
        {/* Upcoming Deadlines Section */}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  requestsContainer: {
    marginTop: 12,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  requestHeader: {
    marginBottom: 12,
  },
  requestType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  recipientText: {
    fontSize: 14,
    color: '#666',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  rejectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rejectButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#006A60',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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

export default HomeScreen;
