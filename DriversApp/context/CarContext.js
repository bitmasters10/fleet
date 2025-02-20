import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const HOME = "http://192.168.45.12 :3000";
  const home = HOME;

  // Fetch vehicles when the screen is loaded
  const getVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${home}/driver/cars`);
      console.log(response.data);
      setFuelData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching vehicles');
      setLoading(false);
    }
  };

  // Fetch fuel records
 
  return (
    <CarContext.Provider value={{ 
      
      getVehicles, 
     
      loading, 
      error 
    }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCar = () => useContext(CarContext);
