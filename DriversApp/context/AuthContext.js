import React, { createContext, useContext, useState } from "react";
import axios from "axios"; // Make sure to install axios
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data in state
  const [loading, setLoading] = useState(false); // Loading state
  const [position, setPosition] = useState(null);
  
  // Use localhost for Android emulator
  const BASE_URL = Platform.select({
    // For Android Emulator
    android: 'http://10.0.2.2:5000',  // Changed port to 5000 if that's what your backend uses
    // For iOS Simulator
    ios: 'http://localhost:5000',
    // For physical device, use your computer's IP address
    // default: 'http://192.168.1.X:5000'  // Replace X with your IP
  });

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email, BASE_URL });

      // First check if server is reachable
      try {
        await axios.get(`${BASE_URL}/health-check`, { timeout: 5000 });
      } catch (error) {
        throw new Error('Server is not reachable. Please check if the backend server is running.');
      }

      const response = await axios.post(
        `${BASE_URL}/driver-auth/login`,
        {
          email,
          password,
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log('Login response:', response.data);
      
      if (response.data.success) {
        setUser(response.data.user);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timed out. Please try again.');
      }
      
      if (error.message === 'Network Error') {
        throw new Error(
          'Cannot connect to server. Please check:\n' +
          '1. Backend server is running\n' +
          '2. Correct IP address is being used\n' +
          '3. You are connected to the internet'
        );
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/driver-auth/logout`);
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
