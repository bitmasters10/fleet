/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Create the Car Context
const VehicleContext = createContext();

// Custom hook to use the CarContext
// eslint-disable-next-line react-refresh/only-export-components
export const useVehicle = () => {
  return useContext(VehicleContext);
};

// CarContext Provider Component
// eslint-disable-next-line react/prop-types
export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all cars from the API
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/admin/cars");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single car by ID
  const fetchVehicleById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/admin/car/${id}`);
      setVehicleDetails(response.data);
    } catch (error) {
      console.error("Error fetching car:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new car
  const addVehicle = async (carData) => {
    try {
      const response = await axios.post("http://localhost:3000/admin/create-car", carData);
      setVehicles((prevVehicle) => [...prevVehicle, response.data.results]);
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  // Update car details
  const updateVehicle = async (updatedVehicle) => {
    try {
      // Use updatedVehicle for the request body
      const response = await axios.patch(
        `http://localhost:3000/admin/car/${updatedVehicle.CAR_ID}`, // Use the CAR_ID from updatedVehicle
        updatedVehicle // Pass the updated vehicle data as the body of the request
      );
  
      // Update local state after the vehicle has been updated successfully
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.CAR_ID === updatedVehicle.CAR_ID ? updatedVehicle : vehicle
        )
      );
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };
  

  // Delete a car
  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/car/${id}`);
      setVehicles((prevVehicles) => prevVehicles.filter((car) => car.CAR_ID !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        vehicleDetails,
        loading,
        fetchVehicles,
        fetchVehicleById,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};
