import { createContext, useContext, useState } from "react";
import axios from "axios";


const ServiceContext = createContext();

// CarHealthContext Provider Component
export const ServiceProvider = ({ children }) => {
  const [carHealthRecords, setCarHealthRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosInstance = axios.create({
    baseURL: "https://fleet-eyad.onrender.com/car-health", // Replace with your backend base URL
    withCredentials: true, // Ensures authentication credentials are included
  });

  // Fetch all car health records
  const fetchCarHealthRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/");
      setCarHealthRecords(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching car health records:", error);
      setError(error.response?.data?.message || "Error fetching records.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new car health record
  const createCarHealthRecord = async (carHealthData) => {
    setError(null);
    try {
      const response = await axiosInstance.post("/", carHealthData);
      setCarHealthRecords((prevRecords) => [...prevRecords, response.data]);
      return { success: true };
    } catch (error) {
      console.error("Error creating car health record:", error);
      setError("Error creating record.");
      return {
        success: false,
        message: error.response?.data?.message || "Error creating record.",
      };
    }
  };

  // Update a car health record
  const updateCarHealthRecord = async (id, updatedData) => {
    setError(null);
    try {
      await axiosInstance.put(`//${id}`, updatedData);
      setCarHealthRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.HEALTH_ID === id ? { ...record, ...updatedData } : record
        )
      );
    } catch (error) {
      console.error("Error updating car health record:", error);
      setError("Error updating record.");
    }
  };

  // Delete a car health record
  const deleteCarHealthRecord = async (id) => {
    setError(null);
    try {
      await axiosInstance.delete(`/${id}`);
      setCarHealthRecords((prevRecords) =>
        prevRecords.filter((record) => record.HEALTH_ID !== id)
      );
    } catch (error) {
      console.error("Error deleting car health record:", error);
      setError("Error deleting record.");
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        carHealthRecords,
        loading,
        error,
        fetchCarHealthRecords,
        createCarHealthRecord,
        updateCarHealthRecord,
        deleteCarHealthRecord,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useService must be used within a CarHealthProvider");
  }
  return context;
};
