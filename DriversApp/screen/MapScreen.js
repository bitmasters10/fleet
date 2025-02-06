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

const { width } = Dimensions.get("window");

const socket = io("ws://172.16.239.81:3001");

const MapScreen = ({ isOpen }) => {
  const route = useRoute();
  const { bookingData } = route.params || {};
  const { position } = useAuth();
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [otpVerify, setOtpVerify] = useState(false);
  const [otpInput, setOtpInput] = useState("")
  const [showModal, setShowModal] = useState(false);
  const { verifyOtp } = useTrip();
  console.log(bookingData);
console.log(otpInput)
  const geocodeLocation = async (address, type) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          `${address} , mumbai`
        )}&key=23a9db4a9b29400daf8144a710df5d75`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const coords = data.results[0].geometry;
        if (type === "pickup") {
          setPickupCoords(coords);
        } else if (type === "drop") {
          setDropCoords(coords);
        }
      } else {
        console.log("No results for geocoding");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };
  const handleOTPClick = async () => {
   // assuming otpInput is the state variable for OTP input
  const BOOK_ID = bookingData.BOOK_ID; // Assuming bookingData has BOOK_ID
  
  // Call the verifyOtp function with otp and BOOK_ID
  try {
    const response = await verifyOtp(otpInput, BOOK_ID); // Call the function from TripContext
    if(!response.ok){
       console.long("Incorrect OTP");   
    }else{
    setOtpVerify(true)
        Alert.alert("OTP received");   

    }

  } catch (error) {
    console.error("OTP Verification failed:", error);
  }
};

  useEffect(() => {
    if (position && position.latitude && position.longitude) {
      socket.emit("loc", {
        room: "all",
        lat: position.latitude,
        long: position.longitude,
      });
    }
  }, [position]);

  if (!position || !position.latitude || !position.longitude) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading map...</Text>
      </SafeAreaView>
    );
  }

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };
  useEffect(() => {
    if (bookingData) {
      // Geocode Pickup and Drop locations when bookingData is available
      geocodeLocation(bookingData.PICKUP_LOC, "pickup");
      if (otpVerify) {
        geocodeLocation(bookingData.DROP_LOC, "drop");
      }
    }
  }, [bookingData]);
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

        {/* Show Pickup Location Marker when otpVerify is false */}
        {!otpVerify && pickupCoords && (
          <Marker
            coordinate={{
              latitude: pickupCoords.lat,
              longitude: pickupCoords.lng,
            }}
            title="Pickup Location"
            description={bookingData.pickupLocation}
          />
        )}

        {/* Show Drop Location Marker when otpVerify is true */}
        {otpVerify && dropCoords && (
          <Marker
            coordinate={{
              latitude: dropCoords.lat,
              longitude: dropCoords.lng,
            }}
            title="Drop Location"
            description={bookingData.dropLocation}
          />
        )}

        {/* Show Polyline only when otpVerify is false */}
        {!otpVerify && pickupCoords && (
          <Polyline
            coordinates={[
              { latitude: position.latitude, longitude: position.longitude },
              { latitude: pickupCoords.lat, longitude: pickupCoords.lng },
              ...(otpVerify === false && dropCoords
                ? [{ latitude: dropCoords.lat, longitude: dropCoords.lng }]
                : []),
            ]}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
      </MapView>

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
  value={otpInput} // Set value from state
  onChangeText={setOtpInput} // Update state on input change
/>

          </View>

          <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText} onPress={handleOTPClick} >Next</Text>
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
