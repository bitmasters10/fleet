import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://fleet-eyad.onrender.com/Sadmin-auth/check-auth", {
          credentials: "include", // Include cookies for session management
        });
        console.log('Auth check response:', response);

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          console.log(data.user)
          setIsAuthenticated(true);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (err) {
        console.error("Failed to verify authentication:", err);
      }
    };
    
    checkAuth(); // Call checkAuth inside useEffect

  }, []); // Empty dependency array to run this effect only once when the component mounts

  const login = async (email, password) => {
    try {
      const response = await fetch("https://fleet-eyad.onrender.com/Sadmin-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error(data.message || "Failed to login");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const response = await fetch("https://fleet-eyad.onrender.com/admin-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error(data.message || "Failed to login");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };


  const register = async (registrationData) => {
    try {
      const response = await fetch("https://fleet-eyad.onrender.com/Sadmin-auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        return data; // Return the response data for further handling
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };
  const registerAdmin = async (aname, email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post("https://fleet-eyad.onrender.com/admin-auth/register", { aname, email, password });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Registration failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("https://fleet-eyad.onrender.com/Sadmin-auth/logout", {
        method: "POST",
        credentials: "include", // Ensure session cookies are cleared
      });

      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        throw new Error("Failed to log out");
      }
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  };
  const logoutAdmin = async () => {
   try {
      const response = await fetch("https://fleet-eyad.onrender.com/admin-auth/logout", {
        method: "POST",
        credentials: "include", // Ensure session cookies are cleared
      });

      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        throw new Error("Failed to log out");
      }
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register,loginAdmin, logoutAdmin, registerAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
