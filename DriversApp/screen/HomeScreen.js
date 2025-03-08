import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl, // Import RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import MapScreen from "./MapScreen";
import { useTrip } from "../context/TripContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { trips = [], loading, error, fetchTrips } = useTrip() || {};
  const { createTrip } = useTrip();

  // State for refreshing
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true
    await fetchTrips(); // Fetch trips again
    setRefreshing(false); // Set refreshing to false
  };

  const handleClick = async (item) => {
    try {
      const tripData = {
        BOOK_NO: item.BOOK_NO,
        BOOK_ID: item.BOOK_ID,
        ROUTE: `${item.PICKUP_LOC} to ${item.DROP_LOC}`,
        date: new Date().toISOString().split("T")[0],
      };

      const newTrip = await createTrip(tripData);

      if (newTrip) {
        navigation.navigate("Map", { bookingData: item });
      }
    } catch (error) {
      console.error("Error starting trip:", error);
    }
  };

  const TripCard = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestType}>
          <Icon name="car" size={20} color="#4FA89B" />
          <Text style={styles.requestTypeText}>
            {item.PICKUP_LOC} to {item.DROP_LOC}
          </Text>
        </View>
        <Text style={styles.recipientText}>Recipient: User {item.USER_ID}</Text>
      </View>

      <View style={styles.locationInfo}>
        <Icon name="map-marker" size={20} color="#4FA89B" />
        <Text style={styles.locationText}>{item.PICKUP_LOC}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.rejectButton}>
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleClick(item)}
        >
          <Text style={styles.acceptButtonText}>Start Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity
          onPress={() => navigation.navigate("Booking")}
          style={styles.notificationButton}
        >
          <Icon name="bell" size={24} color="#4FA89B" />
        </TouchableOpacity>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Bind refreshing state
            onRefresh={onRefresh} // Bind onRefresh function
            colors={["#4FA89B"]} // Customize the loading spinner color
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Live GPS</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Map")}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mapContainer}>
                <MapScreen isOpen="true" />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Requests</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Requests")}
                >
                  <Text style={styles.seeAllText}>View all</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        data={trips}
        keyExtractor={(item) => item.BOOK_ID}
        ListEmptyComponent={
          loading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.emptyText}>No trips available</Text>
          )
        }
        renderItem={({ item }) => <TripCard item={item} />}
      />
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  requestTypeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  recipientText: {
    fontSize: 14,
    color: "#666",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  rejectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rejectButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  acceptButton: {
    backgroundColor: "#006A60",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default HomeScreen;
