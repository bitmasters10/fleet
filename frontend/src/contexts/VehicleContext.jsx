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
  const [vehicleCount, setVehicleCount] = useState(0);
  const [carTripStats, setCarTripStats] = useState([]); // Store car trip stats

  const axiosInstance = axios.create({
    baseURL: "https://fleet-eyad.onrender.com/", // Replace with your backend base URL
    withCredentials: true, // Important: This ensures that cookies (session) are included in requests
  });
  // Fetch all cars from the API
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/cars");
      setVehicles(response.data);
      setVehicleCount(response.data.length)
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
  const sendToRepair = async (carId) => {
    try {
      const response = await axiosInstance.patch(`/admin/repair/${carId}`);

      if (response.status === 200) {
        setVehicles((prevCars) =>
          prevCars.map((car) =>
            car.CAR_ID === carId ? { ...car, STATUS: "REPAIR" } : car
          )
        );
        return response.data.message;
      }
    } catch (error) {
      console.error("Error updating car status:", error);
      return null;
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


  const fetchCarTripStats = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/car-trip-stats"); // Fetch data from the backend
      setCarTripStats(response.data); // Store in state
    } catch (error) {
      console.error("Error fetching car trip stats:", error);
      setError("Error fetching car trip stats.");
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
        vehicleCount,
        loading,
        error,
        carTripStats,
        fetchCarTripStats, 
        availableVehicles,
        fetchVehicles,
        fetchVehicleById,
        fetchAvailableVehicles,
        sendToRepair,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};
