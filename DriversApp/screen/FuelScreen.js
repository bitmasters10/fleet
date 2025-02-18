import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFuel } from '../context/FuelContext';

export default function FuelScreen() {
  const { getVehicles, createFuelRecord, fuelData, loading, error } = useFuel();
  const [cameraPermission, setCameraPermission] = useState(null);
  const [photoList, setPhotoList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [fuelAmount, setFuelAmount] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);  // Track permission denial

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      setPermissionDenied(status === 'denied');  // If denied, allow the option to ask again
    })();
    getVehicles(); // Fetch vehicles when screen loads
  }, []);

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

      if (result.cancelled) {
        Alert.alert('Cancelled', 'Photo capture was cancelled.');
        return;
      }

      if (result.uri) {
        setPhotoList((prevPhotos) => [...prevPhotos, result.uri]); // Save photo URI
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

      if (result.cancelled) {
        Alert.alert('Cancelled', 'Photo selection was cancelled.');
        return;
      }

      if (result.uri) {
        setPhotoList((prevPhotos) => [...prevPhotos, result.uri]); // Save photo URI
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while accessing the gallery.');
      console.error('Gallery Error:', error);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
    setPermissionDenied(status === 'denied');
  };

  const handleSubmit = () => {
    if (!selectedVehicle || !fuelAmount || photoList.length === 0) {
      Alert.alert('Error', 'Please complete all fields and capture at least one photo.');
      return;
    }

    const fuelRecordData = {
      CAR_ID: selectedVehicle,
      DATE: new Date().toISOString(),
      COST: fuelAmount,
      PHOTO: photoList.map(uri => ({ uri })), // Send multiple photos if necessary
    };

    createFuelRecord(fuelRecordData); // Call the context API to create the fuel record
    setSelectedVehicle('');
    setFuelAmount('');
    setPhotoList([]);
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

      {photoList.length > 0 && (
        <View style={styles.previewSection}>
          <Text style={styles.subLabel}>Captured Photos:</Text>
          <FlatList
            data={photoList}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.photoPreview} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal
          />
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
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
});
