import axios from "axios";
import { createContext, useContext, useState } from "react";

const DriverContext = createContext();

// eslint-disable-next-line react/prop-types
export const DriverProvider = ({ children }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [driverCount, setDriverCount] = useState(0);
  const axiosInstance = axios.create({
    baseURL: "https://fleet-eyad.onrender.com/", // Replace with your backend base URL
    withCredentials: true, // Important: This ensures that cookies (session) are included in requests
  });
  // Fetch all drivers
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/drivers");
      setDrivers(response.data);
      setDriverCount(response.data.length);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError("Error fetching drivers."); // Set error state
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (driver) => {
    try {
      const response = await axiosInstance.post(
        "/driver-auth/register",
        driver,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      setDrivers((prev) => [...prev, response.data.user]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error adding admin:",
      };
    }
  };

  // Delete a driver
  const deleteDriver = async (id) => {
    try {
      await axiosInstance.delete(`/admin/driver/${id}`);
      setDrivers((prevDrivers) =>
        prevDrivers.filter((driver) => driver.DRIVER_ID !== id)
      );
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  // Update a driver
  const updateDriver = async (updatedDriver) => {
    console.log("Updated Driver:", updatedDriver);
    try {
      // Send the PATCH request with the updated driver data
      // eslint-disable-next-line no-unused-vars
      const response = await axiosInstance.patch(
        `/admin/driver/${updatedDriver.DRIVER_ID}`, // Use DRIVER_ID for the URL
        updatedDriver // Pass the updated driver data as the body
      );

      // Update the local state after a successful response
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.DRIVER_ID === updatedDriver.DRIVER_ID ? updatedDriver : driver
        )
      );
    } catch (error) {
      console.error("Error updating driver:", error); // Update error message for clarity
    }
  };

  // Fetch a single driver by ID
  const fetchDriverById = async (id) => {
    try {
      const response = await fetch(`https://fleet-eyad.onrender.com/admin/driver/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching driver by ID:", err.message);
      setError(err.message);
    }
  };
  const fetchAvailableDrivers = async (date, start_time, end_time) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/admin/avail-drivers", {
        date,
        start_time,
        end_time,
      });
      
      return response.data;
    } catch (error) {
      console.error("Error fetching available drivers:", error);
      setError("Error fetching available drivers."); // Set error state
    } finally {
      setLoading(false);
    }
  };
  // Context value
  const value = {
    drivers,
    driverCount,
    loading,
    error,
    addDriver,
    fetchDrivers,
    deleteDriver,
    fetchAvailableDrivers,
    updateDriver,
    fetchDriverById,
  };

  return (
    <DriverContext.Provider value={value}>{children}</DriverContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDrivers = () => useContext(DriverContext);
