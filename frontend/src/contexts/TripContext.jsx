import { createContext, useContext, useState } from "react";
import axios from "axios";

const TripContext = createContext();

// eslint-disable-next-line react/prop-types
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentRooms, setCurrentRooms] = useState([]); // New state for rooms
  const [currentTrips, setCurrentTrips] = useState([]); // New state for current trips
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
  });

  // Existing fetchTrips function
  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/admin/trips");
      setTrips(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch current rooms
  const fetchCurrentRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/location");
      setCurrentRooms(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch current rooms");
      setCurrentRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch current trips
  const fetchCurrentTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/curr-trips");
      setCurrentTrips(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch current trips");
      setCurrentTrips([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TripContext.Provider 
      value={{ 
        trips, 
        currentRooms, // Add to context value
        currentTrips, // Add to context value
        loading, 
        error, 
        fetchTrips, 
        fetchCurrentRooms, // Add to context value
        fetchCurrentTrips // Add to context value
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};
