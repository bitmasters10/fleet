import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const FuelContext = createContext();

export const FuelProvider = ({ children }) => {
  const [fuelData, setFuelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const HOME = "http:// 192.168.10.122:3000";
  const home = HOME;

  // Fetch vehicles when the screen is loaded
  const getVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${home}/driver/cars`);
      setFuelData(response.data);
    } catch (err) {
      setError('Error fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Fetch fuel records
  const getFuelRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${home}/driver/fuels`);
      setFuelData(response.data);
    } catch (err) {
      setError("Failed to fetch fuel records");
    } finally {
      setLoading(false);
    }
  };

  // Create a fuel record
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
      });

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

  // Fetch fuel bill image
  const getFuelImage = (fuelId) => {
    if (!fuelId) return null;
    return `${home}/fuel-view/${fuelId}`;
  };

  return (
    <FuelContext.Provider value={{ 
      fuelData, 
      getVehicles, 
      createFuelRecord, 
      getFuelRecords, 
      getFuelImage,
      loading, 
      error 
    }}>
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => useContext(FuelContext);
