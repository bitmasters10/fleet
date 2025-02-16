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
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Replace with your backend base URL
    withCredentials: true, // Important: This ensures that cookies (session) are included in requests
  });
  // Fetch all cars from the API
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/cars");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Error fetching vehicles."); // Set error state
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single car by ID
  const fetchVehicleById = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/car/${id}`);
      setVehicleDetails(response.data);
    } catch (error) {
      console.error("Error fetching car:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableVehicles = async (date, start_time, end_time) => {
    setLoading(true);
    console.log({date, start_time, end_time})
    try {
      const response = await axiosInstance.post("/admin/avail-cars", {
        date,
        start_time,
        end_time,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      setError("Error fetching available vehicles."); // Set error state
    } finally {
      setLoading(false);
    }
  };

  // Add a new car
  const addVehicle = async (carData) => {
    try {
      const response = await axiosInstance.post("/admin/create-car", carData);
      setVehicles((prevVehicle) => [...prevVehicle, response.data.results]);
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  // Update car details
  const updateVehicle = async (updatedVehicle) => {
    try {
      // Use updatedVehicle for the request body
      const response = await axiosInstance.patch(
        `/admin/car/${updatedVehicle.CAR_ID}`, // Use the CAR_ID from updatedVehicle
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
      await axiosInstance.delete(`/admin/car/${id}`);
      setVehicles((prevVehicles) =>
        prevVehicles.filter((car) => car.CAR_ID !== id)
      );
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
        error,
        availableVehicles,
        fetchVehicles,
        fetchVehicleById,
        fetchAvailableVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};
