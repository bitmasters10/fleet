import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const HOME = "http://192.168.10.122:3000";
  
  const getVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${HOME}/driver/cars`);
      setLoading(false);
      return response.data; // Return the fetched data
    } catch (err) {
      setError('Error fetching vehicles');
      setLoading(false);
      return []; // Return empty array on error
    }
  };

  return (
    <CarContext.Provider value={{ getVehicles, loading, error }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCar = () => useContext(CarContext);
