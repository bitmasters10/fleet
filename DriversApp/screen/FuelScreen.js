import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Import ImageManipulator for compression
import DropDownPicker from 'react-native-dropdown-picker';
import config from "../config";

export default function FuelScreen() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [photo, setPhoto] = useState("");  // Store the photo in a single variable
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [fuelAmount, setFuelAmount] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);  // Track permission denial
  const [fuelData, setFuelData] = useState([]);  // Store vehicle data locally
  const HOME = config.API_URL;
  const home = HOME;

  // Fetch vehicles when the component loads
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      setPermissionDenied(status === 'denied');  // If denied, allow the option to ask again
    })();
    fetchVehicles(); // Fetch vehicles data from the backend
  }, []);

  // Fetch vehicles data from the backend
  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${home}/driver/cars`);  // Replace with actual backend URL
      const data = await response.json();
      setFuelData(data); // Store fetched vehicles data
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      console.log('Result:', result);

      if (!result.canceled && result.assets?.length > 0) {
        const compressedImage = await compressImage(result.assets[0].uri);
        setPhoto(compressedImage.uri);
        console.log('Compressed Photo URI:', compressedImage.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while accessing the camera.');
      console.error('Camera Error:', error);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      console.log('Result:', result);

      if (!result.canceled && result.assets?.length > 0) {
        const compressedImage = await compressImage(result.assets[0].uri);
        setPhoto(compressedImage.uri);
        console.log('Compressed Photo URI:', compressedImage.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while accessing the gallery.');
      console.error('Gallery Error:', error);
    }
  };

  const compressImage = async (uri) => {
    try {
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize to a maximum width of 800px (adjust as needed)
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70% quality
      );
      return compressedImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
    setPermissionDenied(status === 'denied');
  };

  const handleSubmit = async () => {
    if (!selectedVehicle || !fuelAmount || !photo) {
      Alert.alert("Error", "Please complete all fields and capture a photo.");
      return;
    }

    // Convert the image to base64 (required for BLOB storage)
    const response = await fetch(photo);
    const blob = await response.blob();
    const formattedDate = new Date().toISOString().split("T")[0];
    const formData = new FormData();
    formData.append("CAR_ID", selectedVehicle);
    formData.append("DATE", formattedDate);
    formData.append("COST", fuelAmount);
    formData.append("photo", {
      uri: photo,
      type: "image/jpeg", // Adjust type if needed (e.g., "image/png")
      name: "fuel_photo.jpg",
    });

    try {
      const res = await fetch(`${home}/admin/create-fuel`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });

      const textResponse = await res.text(); // Debugging response
      console.log("Raw Response:", textResponse);

      const responseData = JSON.parse(textResponse);

      if (res.ok) {
        Alert.alert("Success", "Fuel record created successfully");
        setSelectedVehicle("");
        setFuelAmount("");
        setPhoto(null);
      } else {
        Alert.alert("Error", responseData.error || "Failed to create fuel record");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while submitting the fuel record.");
      console.error("Submit Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Vehicle:</Text>
      <DropDownPicker
        open={dropdownOpen}
        value={selectedVehicle}
        items={fuelData.map(vehicle => ({ label: `Car ${vehicle.CAR_ID}`, value: vehicle.CAR_ID }))}
        setOpen={setDropdownOpen}
        setValue={setSelectedVehicle}
        placeholder="Select a vehicle"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <Text style={styles.label}>Fuel Amount (in liters):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter fuel amount"
        value={fuelAmount}
        onChangeText={setFuelAmount}
      />

      <Text style={styles.label}>Photos:</Text>
      <Button title="Take Photo" onPress={handleTakePhoto} />
      <Button title="Pick Photo from Gallery" onPress={handlePickFromGallery} />

      {permissionDenied && (
        <Button title="Request Camera Permission" onPress={requestCameraPermission} />
      )}

      {photo && (
        <View style={styles.previewSection}>
          <Text style={styles.subLabel}>Captured Photo:</Text>
          <Image source={{ uri: photo }} style={styles.photoPreview} />
        </View>
      )}

      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  dropdown: {
    borderColor: '#ccc',
    marginBottom: 20,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  previewSection: {
    marginTop: 20,
  },
  subLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 20,
  },
});