import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await axiosInstance.post("/create-booking", bookingData);
      setBookings((prevBookings) => [...prevBookings, response.data]);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        fetchBookings,
        createBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
export default BookingContext;
