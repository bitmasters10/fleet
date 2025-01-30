import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const BookingContext = createContext();

// Custom hook to use the BookingContext
export const useBooking = () => {
  return useContext(BookingContext);
};

// BookingContext Provider Component
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Replace with your backend base URL
    withCredentials: true, // Ensures that cookies (session) are included in requests
  });

  // Fetch all bookings
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

  // Fetch a single booking by ID
  const fetchBookingById = async (id) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/booking/${id}`);
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async (bookingData) => {
    try {
      const response = await axiosInstance.post("/admin/create-booking", bookingData);
      setBookings((prevBookings) => [...prevBookings, response.data.booking]);
      return { success: true };
    } catch (error) {
      console.error("Error creating booking:", error);
      return { success: false, message: error.response?.data?.message || "Error creating booking." };
    }
  };

  // Update an existing booking
  const updateBooking = async (updatedBooking) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/booking/${updatedBooking.BOOKING_ID}`,
        updatedBooking
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.BOOKING_ID === updatedBooking.BOOKING_ID ? updatedBooking : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // Delete a booking
  const deleteBooking = async (id) => {
    try {
      await axiosInstance.delete(`/admin/booking/${id}`);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.BOOKING_ID !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        bookingDetails,
        loading,
        error,
        fetchBookings,
        fetchBookingById,
        createBooking,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

