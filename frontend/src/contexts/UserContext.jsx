// UserContext:
import axios from "axios";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Replace with your backend base URL
    withCredentials: true, // Important: This ensures that cookies (session) are included in requests
  });
  // Fetch all drivers
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError("Error fetching drivers."); // Set error state
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user) => {
    console.log("USER:",user)
    try {
      const response = await axiosInstance.post(
        "/admin/register",
        user
      );
      console.log(response.data.user)
      setUsers((prev) => [...prev, response.data.user]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error adding admin:",
      };
    }
  };

  // Context value
  const value = {
    users,
    loading,
    error,
    addUser,
    fetchUsers,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => useContext(UserContext);