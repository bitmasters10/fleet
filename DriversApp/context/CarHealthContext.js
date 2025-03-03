import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const CarHealthContext = createContext();

export const CarHealthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const HOME = "http:// 192.168.10.122:3000"; // Replace with your backend URL

  const addCarHealth = async (carHealthData) => {
    console.log("Sending request to:", `${HOME}/car-health`);
    console.log("Payload:", carHealthData);

    try {
      setLoading(true);
      const response = await axios.post(`${HOME}/car-health`, carHealthData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response Data:", response.data);
      setLoading(false);
      return response.data; // Success response
    } catch (err) {
      console.error("Error submitting car health:", err);
      setError("Failed to add car health record");
      setLoading(false);
      return null; // Return null on error
    }
  };

  return (
    <CarHealthContext.Provider value={{ addCarHealth, loading, error }}>
      {children}
    </CarHealthContext.Provider>
  );
};

export const useCarHealth = () => useContext(CarHealthContext);
