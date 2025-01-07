import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/Sadmin-auth/check-auth", {
          credentials: "include", // Include cookies for session management
        });
        console.log('Auth check response:', response);

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
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
      const response = await fetch("http://localhost:3000/Sadmin-auth/login", {
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
      const response = await fetch("http://localhost:3000/Sadmin-auth/register", {
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

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3000/Sadmin-auth/logout", {
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
