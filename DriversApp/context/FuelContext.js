import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const FuelContext = createContext();

export const FuelProvider = ({ children }) => {
  const [fuelData, setFuelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const home = "http://192.168.1.243:3000"; // Make sure this is the correct IP address of your backend

  // Fetch vehicles when the screen is loaded
  const getVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${home}/driver/cars`);
      console.log(response.data)
      setFuelData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching vehicles');
      setLoading(false);
    }
  };

  // Create a fuel record by sending the data to the backend
  const createFuelRecord = async (fuelRecordData) => {
    try {
      const { CAR_ID, DATE, COST, PHOTO } = fuelRecordData;
      const formData = new FormData();
      formData.append('CAR_ID', CAR_ID);
      formData.append('DATE', DATE);
      formData.append('COST', COST);
      formData.append('PHOTO', {
        uri: PHOTO.uri, 
        type: 'image/jpeg', 
        name: 'photo.jpg'
      }); // Ensure proper file handling in the form data
      

      await axios.post(`${home}/admin/create-fuel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Fuel entry submitted successfully!');
    } catch (err) {
      console.error('Error submitting fuel record:', err);
      alert('Error submitting fuel entry');
    }
  };

  return (
    <FuelContext.Provider value={{ fuelData, getVehicles, createFuelRecord, loading, error }}>
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => useContext(FuelContext);
