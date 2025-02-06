import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Ensure you have an AuthContext managing the user

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user } = useAuth(); // Get authenticated user (driver)
  const [trips, setTrips] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const home = "http://192.168.0.202:3000";
  const clg = "http://172.16.255.151:3000";

  // Function to fetch current trips
  const fetchTrips = async () => {
    if (!user) return; // If no user is available, do not proceed
    try {
      setLoading(true);
      const response = await axios.get(`${clg}/driver/all/book`, {
        withCredentials: true, // Send session cookies with the request
      });
      console.log("DATA:", response.data);
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp, BOOK_ID) => {
    try {
      const response = await axios.post(`${clg}/driver/otp`, {
        otp,
        BOOK_ID,
      });

      if (response.status === 200) {
        console.log("OTP verification success:", response.data);
        return response.data; // Contains success message and record
      } else {
        console.log("OTP verification failed:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      return null;
    }
  };

  // Function to fetch trip history
  const fetchHistory = async () => {
    if (!user) return; // If no user is available, do not proceed
    try {
      const response = await axios.get(`${clg}/driver/history`, {
        withCredentials: true, // Send session cookies with the request
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching trip history:", error);
    }
  };

  // Function to create a new trip
  const createTrip = async (tripData) => {
    if (!user) return; // If no user is available, do not proceed
    try {
      const response = await axios.post(`${clg}/driver/create-trip`, tripData, {
        withCredentials: true, // Send session cookies with the request
      });
      setTrips((prevTrips) => [...prevTrips, response.data.trip]);
      return response.data.trip;
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  // Function to complete a trip
  const completeTrip = async (BOOK_ID) => {
    if (!user) return; // If no user is available, do not proceed
    try {
      await axios.patch(
        `${clg}/driver/trip-complete`,
        { BOOK_ID },
        {
          withCredentials: true, // Send session cookies with the request
        }
      );
      fetchTrips(); // Refresh trip list
    } catch (error) {
      console.error("Error completing trip:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTrips();
      fetchHistory();
    }
  }, [user]);

  return (
    <TripContext.Provider
      value={{ trips, history, createTrip, completeTrip, fetchTrips, loading, verifyOtp }}
    >
      {children}
    </TripContext.Provider>
  );
};

// Custom Hook to Use Trip Context
export const useTrip = () => {
  return useContext(TripContext);
};
