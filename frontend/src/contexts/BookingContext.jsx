import { createContext, useContext, useState } from "react";
import axios from "axios";

const BookingContext = createContext();

// Custom hook to use the BookingContext

// BookingContext Provider Component
// eslint-disable-next-line react/prop-types
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [availableBookings, setAvailableBookings] = useState([]);
  const [tripAdvisorBooking, setTripAdvisorBookings] = useState([]);

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Replace with your backend base URL
    withCredentials: true, // Ensures that cookies (session) are included in requests
  });

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/admin/bookings");
      setBookings(response.data);
      setBookingCount(response.data.length)
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.response?.data?.message || "Error fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single booking by ID
  const fetchBookingById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/admin/booking/${id}`);
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Error fetching booking:", error);
      setError("Error fetching booking.");
    } finally {
      setLoading(false);
    }
  };


  const fetchTripBookings = async () => {
    try {
      const response = await axiosInstance.get("/admin/adv");
      setTripAdvisorBookings(response.data.res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchAvailableBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/available-books");

      setAvailableBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message);
    }
    setLoading(false);
  };
  // Create a new booking
  const createBooking = async (bookingData) => {
    console.log("Creating booking with data:", bookingData);
    setError(null);
    try {
      const response = await axiosInstance.post(
        "/admin/create-book",
        bookingData
      );
      console.log("Booking created successfully:", response.data);
      setBookings((prevBookings) => [...prevBookings, response.data.booking]);
      return { success: true };
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Error creating booking.");
      return {
        success: false,
        message: error.response?.data?.message || "Error creating booking.",
      };
    }
  };

  // Create a manual booking
  const createManualBooking = async (bookingData) => {
    console.log("Creating manual booking with data:", bookingData);
    setError(null);
    try {
      const response = await axiosInstance.post(
        "/admin/create-manual-book",
        bookingData
      );
      console.log("Manual booking created successfully:", response.data);
      setBookings((prevBookings) => [...prevBookings, response.data.booking]);
      return { success: true };
    } catch (error) {
      console.error("Error creating manual booking:", error);
      setError("Error creating manual booking.");
      return {
        success: false,
        message:
          error.response?.data?.message || "Error creating manual booking.",
      };
    }
  };


  const createAdvancedBooking = async (bookingData) => {
    try {
      const response = await axiosInstance.post("/admin/create-adv-book/", bookingData);
      setBookings((prevBookings) => [...prevBookings, response.data.booking]);
      return { success: true };

    } catch (error) {
      console.error("Error creating booking:", error);
      throw error.response?.data || "Error occurred while booking";
    }
  };

  // Update an existing booking
  const updateBooking = async (updatedBooking) => {
    console.log(updatedBooking.BOOK_ID);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/admin/booking/${updatedBooking.BOOK_ID}`,
        updatedBooking
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.BOOK_ID === updatedBooking.BOOK_ID
            ? updatedBooking
            : booking
        )
      );
      console.log(response.status)
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Error updating booking.");
    }
  };

  // Delete a booking
  const deleteBooking = async (id) => {
    setError(null);
    try {
      await axiosInstance.delete(`/admin/booking/${id}`);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.BOOKING_ID !== id)
      );
    } catch (error) {
      console.error("Error deleting booking:", error);
      setError("Error deleting booking.");
    }
  };

  // Fetch all packages
  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/admin/packages");
      return response.data; // Return the fetched packages
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError(error.response?.data?.message || "Error fetching packages.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new package
  const createPackage = async (packageData) => {
    console.log("Creating package with data:", packageData);
    setError(null);
    try {
      const response = await axiosInstance.post(
        "/admin/add-package",
        packageData
      );
      console.log("Package created successfully:", response.data);
      return { success: true };
    } catch (error) {
      console.error("Error creating package:", error);
      setError("Error creating package.");
      return {
        success: false,
        message: error.response?.data?.message || "Error creating package.",
      };
    }
  };

  // Update an existing package
  const updatePackage = async (packageId, packageData) => {
    console.log("Updating package with ID:", packageId);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/admin/package/${packageId}`,
        packageData
      );
      console.log("Package updated successfully:", response.data);
      return { success: true };
    } catch (error) {
      console.error("Error updating package:", error);
      setError("Error updating package.");
      return {
        success: false,
        message: error.response?.data?.message || "Error updating package.",
      };
    }
  };

  // Delete a package
  const deletePackage = async (packageId) => {
    console.log("Deleting package with ID:", packageId);
    setError(null);
    try {
      await axiosInstance.delete(`/admin/package/${packageId}`);
      console.log("Package deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("Error deleting package:", error);
      setError("Error deleting package.");
      return {
        success: false,
        message: error.response?.data?.message || "Error deleting package.",
      };
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        bookingCount,
        bookingDetails,
        availableBookings,
        loading,
        error,
        tripAdvisorBooking,
        fetchBookings,
        fetchBookingById,
        fetchAvailableBookings,
        createBooking,
        createManualBooking,
        createAdvancedBooking,
        fetchTripBookings,
        fetchPackages,
        createPackage,
        updatePackage,
        deletePackage,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};