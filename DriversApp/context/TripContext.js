import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const HOME="http://192.168.1.243:3000"
   const home = HOME;
  const clg = "http://172.16.255.151:3000";

  // Fetch all current trips
  const fetchTrips = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(`${home}/driver/all/book`, {
        withCredentials: true,
      });
      setTrips(response.data);
      console.log(response.data)
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  // Fetch trips for a specific date
  const fetchTripsByDate = async (date) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(`${home}/driver/book/${date}`, {
        withCredentials: true,
      });
      setTrips(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch trips for date");
    } finally {
      setLoading(false);
    }
  };

  // Fetch trip history
  const fetchHistory = async () => {
    console.log("Fetching history...");
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(`${home}/driver/history`, {
        withCredentials: true,
      });
      setHistory(response.data);
      console.log("Fetched history:", response.data);  // Ensure data is received
      console.log("Updated state history:", history); // Check if state updates
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };
  

  // Create a new trip
  const createTrip = async (tripData) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${home}/driver/create-trip`,
        tripData,
        {
          withCredentials: true,
        }
      );
      setTrips((prevTrips) => [...prevTrips, response.data.trip]);
      setError(null);
      return response.data.trip;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  // Complete a trip
  const completeTrip = async (BOOK_ID) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.patch(
        `${home}/driver/trip-complete`,
        { BOOK_ID },
        {
          withCredentials: true,
        }
      );
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.BOOK_ID === BOOK_ID ? { ...trip, STAT: "COMPLETED" } : trip
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to complete trip");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (otp, BOOK_ID) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.post(`${home}/driver/otp`, {
        otp,
        BOOK_ID,
      });
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.BOOK_ID === BOOK_ID ? { ...trip, STAT: "ONGOING" } : trip
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Update driver's location
  const updateDriverLocation = async (lat, long) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${home}/driver/myloc`,
        { lat, long },
        {
          withCredentials: true,
        }
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTrips();
      fetchHistory();
    }
  }, [user]);

  const value = {
    trips,
    history,
    loading,
    error,
    fetchTrips,
    fetchTripsByDate,
    fetchHistory,
    createTrip,
    completeTrip,
    verifyOtp,
    updateDriverLocation,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

// Custom Hook to Use Trip Context
export const useTrip = () => {
  return useContext(TripContext);
};

export default TripProvider;