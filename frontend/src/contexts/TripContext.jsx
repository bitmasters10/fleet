/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Fetch all trips
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/trips");
      const data = await response.json();
      console.log(data)
      setTrips(data);
    } catch (err) {
      setError("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  // Fetch active trip locations
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/location");
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      setError("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  // Create a new trip
  const createTrip = async (tripData) => {
    setLoading(true);
    try {
      const response = await fetch("/admin/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
        credentials: "include", // Ensures session-based authentication
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create trip");
      setTrips((prevTrips) => [...prevTrips, data.trip]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchLocations();
  }, []);

  return (
    <TripContext.Provider value={{ trips, locations, loading, error, createTrip, fetchTrips, fetchLocations }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
