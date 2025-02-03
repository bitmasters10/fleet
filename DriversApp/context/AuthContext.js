import React, { createContext, useState } from "react";
import axios from "axios"; // Make sure to install axios

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data in state
  const [loading, setLoading] = useState(false); // Loading state

  const login = async (email, password) => {
    try {
      setLoading(true); // Set loading to true while logging in
      const response = await axios.post(
        "http://192.168.0.202:3000/driver-auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        setUser(response.data.user); // Set user data in state
      }
      return response.data; // Return response data
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Throw error for handling in the component
    } finally {
      setLoading(false); // Set loading to false after login attempt
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://192.168.0.202:3000/driver-auth/logout");
      setUser(null); // Clear user data on logout
    } catch (error) {
      console.error("Logout error:", error);
      throw error; // Throw error for handling in the component
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
