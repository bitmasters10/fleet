import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { io } from "socket.io-client";
import { useRoute } from "@react-navigation/native";
import { useTrip } from "../context/TripContext";
import axios from "axios";

const { width } = Dimensions.get("window");

const socket = io("ws://192.168.1.243:3001");
const HOME = "http://192.168.1.243:3000";
const home = HOME;

const MapScreen = ({ isOpen }) => {
  const route = useRoute();
  const { bookingData } = route.params || {};
  const { position } = useAuth();
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState([]); // Array to store multiple drop coordinates
  const [otpVerify, setOtpVerify] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]); // State to store route coordinates
  const { verifyOtp, loading } = useTrip();

  // Fetch route using OSRM API
  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.lng},${end.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        // Convert GeoJSON coordinates to latitude/longitude format
        const coords = data.routes[0].geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRouteCoords((prev) => [...prev, coords]); // Append new route coordinates
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      Alert.alert("Error", "Failed to fetch route. Please try again.");
    }
  };

  // Geocode location using OpenCageData API
  const geocodeLocation = async (address, type) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          `${address}, Mumbai`
        )}&key=23a9db4a9b29400daf8144a710df5d75`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const coords = data.results[0].geometry;

        if (type === "pickup") {
          setPickupCoords(coords);
          console.log(`Pickup Location: ${address} -> Lat: ${coords.lat}, Lng: ${coords.lng}`);
          if (position && position.latitude && position.longitude) {
            fetchRoute(
              { latitude: position.latitude, longitude: position.longitude },
              coords
            );
          }
        } else if (type === "drop") {
          setDropCoords((prev) => [...prev, coords]);
          console.log(`Drop Location: ${address} -> Lat: ${coords.lat}, Lng: ${coords.lng}`);

          if (position) {
            fetchRoute(
              { latitude: position.latitude, longitude: position.longitude },
              coords
            );
          }
        }
      } else {
        Alert.alert("Error", `Unable to geocode: ${address}. Please try again.`);
        console.log("No results for geocoding:", address);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      Alert.alert("Error", "Geocoding failed. Please check your internet connection.");
    }
  };

  // Handle OTP verification
 // Handle OTP verification
const handleOTPClick = async () => {
  const BOOK_ID = bookingData.BOOK_ID;
  try {
    const response = await axios.post(`${home}/driver/otp`, {
      otp: otpInput,
      BOOK_ID,
    });

    console.log("OTP Verification Response:", response.data);

    if (response.status === 200) {
      setOtpVerify(true);
      Alert.alert("Success", "OTP verified successfully!");

      // Ensure bookingData.DROP_LOC is defined and is a string
      let dropLocations = bookingData.DROP_LOC || "";

      // Convert the string into an array of drop locations
      dropLocations = dropLocations.split(",").map((loc) => loc.trim());

      console.log("Drop Locations:", dropLocations); // Log all locations before geocoding

      // Reset dropCoords before adding new locations
      setDropCoords([]);

      // Geocode each drop location
      dropLocations.forEach((location) => {
        if (location) { // Only geocode if the location is not an empty string
          geocodeLocation(location, "drop");
        }
      });
    } else {
      Alert.alert("Error", response.data.message || "Incorrect OTP. Please try again.");
      console.log("Incorrect OTP");
    }
  } catch (error) {
    console.error("OTP Verification failed:", error);
    Alert.alert("Error", "OTP verification failed. Please try again.");
  }
};
  useEffect(() => {
    if (bookingData?.BOOK_ID) {
      socket.emit("room", bookingData.BOOK_ID);
    }
    socket.emit("room", "all"); // Join 'all' room for testing
  }, [bookingData]);

  useEffect(() => {
    if (position && position.latitude && position.longitude) {
      socket.emit("loc", {
        room: bookingData?.BOOK_ID || "all",
        lat: position.latitude,
        long: position.longitude,
      });
    }
  }, [position, bookingData]);

  useEffect(() => {
    if (bookingData) {
      // Geocode Pickup and Drop locations when bookingData is available
      geocodeLocation(bookingData.PICKUP_LOC, "pickup");
      if (otpVerify) {
        const dropLocations = bookingData.DROP_LOC.split(",").map((loc) => loc.trim());
        dropLocations.forEach((location) => {
          geocodeLocation(location, "drop");
        });
      }
    }
  }, [bookingData, otpVerify]);

  if (!position || !position.latitude || !position.longitude) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading map...</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };

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
          description="Current Location"
        />

        {/* Show Pickup Location Marker */}
        {!otpVerify && pickupCoords && (
          <Marker
            coordinate={{
              latitude: pickupCoords.lat,
              longitude: pickupCoords.lng,
            }}
            title="Pickup Location"
            description={bookingData.PICKUP_LOC}
          />
        )}

        {/* Show Multiple Drop Location Markers */}
        {otpVerify &&
          dropCoords.map((coord, index) => (
            <Marker
            key={index}
            coordinate={{ latitude: coord.lat, longitude: coord.lng }}
            title={`Drop Location ${index + 1}`}
            description={
              bookingData?.DROP_LOC?.split(",")?.[index]?.trim() || "Unknown Location"
            }
          />
          ))}

        {/* Show Polylines for the routes */}
        {routeCoords.map((coords, index) => (
          <Polyline
            key={index}
            coordinates={coords}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        ))}
      </MapView>

      {/* Bottom sheet for details */}
      {isOpen == "true" ? null : (
        <TouchableOpacity onPress={toggleModal} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {showModal ? "Hide Details" : "Show Details"}
          </Text>
        </TouchableOpacity>
      )}

      {showModal && bookingData && (
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>Tour Details</Text>

          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <Icon name="map" size={24} color="#FF4444" />
              <View style={styles.locationInput}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
                <Text style={styles.locationText}>
                  {bookingData.PICKUP_LOC}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.locationItem}>
              <Icon name="map" size={24} color="#4FA89B" />
              <View style={styles.locationInput}>
                <Text style={styles.locationLabel}>Delivery Location</Text>
                <Text style={styles.locationText}>{bookingData.DROP_LOC}</Text>
              </View>
            </View>
          </View>

          {/* Display mobile phone number */}
          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <Icon name="phone" size={24} color="#4CAF50" />
              <View style={styles.locationInput}>
                <Text style={styles.locationLabel}>Mobile Phone</Text>
                <Text style={styles.locationText}>{bookingData.mobile_no}</Text>
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
              returnKeyType="done"
              value={otpInput}
              onChangeText={setOtpInput}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOTPClick}>
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
  toggleButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#006A60",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
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
});