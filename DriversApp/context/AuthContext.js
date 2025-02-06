import React, { createContext, useContext, useState } from "react";
import axios from "axios"; // Make sure to install axios

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data in state
  const [loading, setLoading] = useState(false); // Loading state
   const [position, setPosition] = useState(null);
const home = "http://192.168.0.202:3000"
const clg = "http://172.16.255.151:3000"
  const login = async (email, password) => {
    try {
      setLoading(true); // Set loading to true while logging in
      const response = await axios.post(
        `${clg}/driver-auth/login`,
        {
          email,
          password,
        },
       
      );
      if (response.data.success) {
        console.log("Response", response.data)
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
      await axios.post(`${clg}/driver-auth/logout`);
      setUser(null); // Clear user data on logout
    } catch (error) {
      console.error("Logout error:", error);
      throw error; // Throw error for handling in the component
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, position, setPosition }}>
      {children}
    </AuthContext.Provider>
  );
};

 export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // Return the context values
};
