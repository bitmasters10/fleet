import { createContext, useContext, useState } from "react";
import axios from "axios";

const FuelContext = createContext();

// FuelContext Provider Component
// eslint-disable-next-line react/prop-types
export const FuelProvider = ({ children }) => {
  const [fuelRecords, setFuelRecords] = useState([]);
  const [fuelCosts, setFuelCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "https://fleet-eyad.onrender.com/", // Replace with your backend base URL
    withCredentials: true, // Ensures authentication credentials are included
  });

  // Fetch all fuel consumption records
  const fetchFuelRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/admin/fuels");
      setFuelRecords(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching fuel records:", error);
      setError(error.response?.data?.message || "Error fetching fuel records.");
    } finally {
      setLoading(false);
    }
  };
  const fetchFuelCosts = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.get("/admin/fuel-cost-per-month");
        console.log(response.data)
        setFuelCosts(response.data);
    } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch fuel costs");
    } finally {
        setLoading(false);
    }
};


  // Create a new fuel record
  const createFuelRecord = async (fuelData) => {
    setError(null);
    try {
      const response = await axiosInstance.post("/admin/create-fuel", fuelData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFuelRecords((prevRecords) => [...prevRecords, response.data]);
      return { success: true };
    } catch (error) {
      console.error("Error creating fuel record:", error);
      setError("Error creating fuel record.");
      return {
        success: false,
        message: error.response?.data?.message || "Error creating fuel record.",
      };
    }
  };

  // Accept fuel record
  const acceptFuelRecord = async (id) => {
    setError(null);
    try {
      await axiosInstance.patch(`/admin/accept/${id}`);
      setFuelRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.F_ID === id ? { ...record, stat: "accepted" } : record
        )
      );
    } catch (error) {
      console.error("Error accepting fuel record:", error);
      setError("Error accepting fuel record.");
    }
  };

  // Reject fuel record
  const rejectFuelRecord = async (id) => {
    setError(null);
    try {
      await axiosInstance.patch(`/admin/reject/${id}`);
      setFuelRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.F_ID === id ? { ...record, stat: "rejected" } : record
        )
      );
    } catch (error) {
      console.error("Error rejecting fuel record:", error);
      setError("Error rejecting fuel record.");
    }
  };

  return (
    <FuelContext.Provider
      value={{
        fuelRecords,
        fuelCosts,
        loading,
        error,
        fetchFuelRecords,
        fetchFuelCosts,
        createFuelRecord,
        acceptFuelRecord,
        rejectFuelRecord,
      }}
    >
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) {
    throw new Error("useFuel must be used within a FuelProvider");
  }
  return context;
};
