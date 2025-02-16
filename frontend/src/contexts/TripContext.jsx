import { createContext, useContext, useState } from "react";
import axios from "axios";

const TripContext = createContext();

// eslint-disable-next-line react/prop-types
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
  });

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/admin/trips");
      console.log("Trips response:", response.data);
      setTrips(response.data);
    } catch (error) {
      console.error("Full error:", error);
      setError(error.message || "Failed to fetch trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TripContext.Provider value={{ trips, loading, error, fetchTrips }}>
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