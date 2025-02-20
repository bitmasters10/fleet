import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useTrip } from "../context/TripContext";
import axios from "axios";

const FullScreenTrips = () => {
  const {
    trips = [],
    fetchTrips,
    fetchHistory,
    fetchTripsByDate,
  } = useTrip() || {};

  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    handleTabChange("upcoming"); // Load upcoming trips by default
  }, []);

  useEffect(() => {
    console.log("History state changed:", history);
  }, [history]);
  const HOME="http://192.168.1.243:3000"
  const home = HOME;
  const handleTabChange = async (tab) => {
    setSelectedTab(tab);
    const todayDate = new Date().toISOString().split("T")[0];
  
    if (tab === "today") {
      await fetchTripsByDate(todayDate);
    } else if (tab === "upcoming") {
      await fetchTrips();
    } else if (tab === "history") {
      const response = await axios.get(`${home}/driver/history`);
      console.log("frontend fullscreen .js")
      console.log("Fetched history response:", response); // Log response
      if (response && response.data) {
        setHistory([...response.data]); // Ensure the correct data format
      } else {
        setHistory([]); // Prevent undefined errors
      }
    }
  };
  
  

  // Expand/Collapse Trip Details
  const toggleExpand = (tripId) => {
    setExpandedTripId(expandedTripId === tripId ? null : tripId);
  };

  // Updated Upcoming Trip Card
  const UpcomingTripCard = ({ item }) => {
    const isExpanded = expandedTripId === item.BOOK_ID;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{item.DATE}</Text>
          <Text style={styles.mobileText}>Mobile: {item.mobile_no}</Text>
        </View>
        <Text style={styles.basicInfo}>Time: {item.TIMING}</Text>
        <Text style={styles.basicInfo}>Pickup: {item.PICKUP_LOC}</Text>
        <Text style={styles.basicInfo}>Drop: {item.DROP_LOC}</Text>

        {/* Expandable Details */}
        {isExpanded && (
          <View style={styles.detailsContainer}>
            <Text>Passengers: {item.NO_OF_PASSENGER}</Text>
            <Text>Car ID: {item.CAR_ID}</Text>
            <Text>Booking No: {item.BOOK_NO}</Text>
            <Text>Package ID: {item.PACKAGE_ID}</Text>
            <Text>AC/Non-AC: {item.AC_NONAC}</Text>
            <Text>Status: {item.stat}</Text>
            <Text>End Time: {item.END_TIME}</Text>
            <Text>Driver ID: {item.DRIVER_ID}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => toggleExpand(item.BOOK_ID)}
        >
          <Text style={styles.buttonText}>{isExpanded ? "Show Less" : "Show More"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Fixed History Trip Card (Now Shows Data)
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "today" && styles.activeTab]}
          onPress={() => handleTabChange("today")}
        >
          <Text style={styles.tabText}>Today's Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "upcoming" && styles.activeTab]}
          onPress={() => handleTabChange("upcoming")}
        >
          <Text style={styles.tabText}>Upcoming Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "history" && styles.activeTab]}
          onPress={() => handleTabChange("history")}
        >
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Trip List */}
      {selectedTab === "history" ? (
  history.length > 0 ? (
    <FlatList
      data={history}
      keyExtractor={(item) => item.BOOK_ID || item.TRIP_ID}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.basicInfo}>Route: {item.ROUTE}</Text>
          <Text style={styles.basicInfo}>Status: {item.STAT}</Text>
          <Text style={styles.basicInfo}>Start Time: {item.START_TIME}</Text>
        </View>
      )}
      ListEmptyComponent={<Text>No history found</Text>}
    />
  ) : (
    <Text>No history found</Text>
  )
) : (
  <FlatList
    data={trips}
    keyExtractor={(item) => item.BOOK_ID || item.TRIP_ID}
    renderItem={({ item }) => <UpcomingTripCard item={item} />}
    ListEmptyComponent={<Text style={styles.emptyText}>No trips available</Text>}
  />
)}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },

  tabContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },

  tabButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },

  activeTab: { backgroundColor: "#4FA89B" },

  tabText: { fontSize: 14, fontWeight: "bold", color: "#000" },

  card: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },

  dateText: { fontSize: 16, fontWeight: "bold" },

  basicInfo: { fontSize: 15, marginTop: 5 },

  expandButton: {
    backgroundColor: "#7E57C2",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },

  buttonText: { color: "white", fontWeight: "bold" },

  emptyText: { textAlign: "center", marginTop: 20 },
});

export default FullScreenTrips;
