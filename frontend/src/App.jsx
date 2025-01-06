import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Admin from "./pages/Admin";
import Driver from "./pages/Driver";
import User from "./pages/User";
import Vehicle from "./pages/Vehicle";
import Trip from "./pages/Trip";
import Booking from "./pages/Booking";
import Report from "./pages/Report";
import Login from "./pages/Auth/Login";
import { useState } from "react";
import SignupForm from "./pages/Auth/Signup";

function App() {
  // Track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {/* Navbar is always visible */}
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

      {/* Conditionally render Sidebar based on authentication */}
      {isAuthenticated && <Sidebar />}

      <div className={` ${!isAuthenticated ? "p-0 sm:ml-0" : "p-4 sm:ml-64"}`}>
        <div className="max-w-screen-2xl mx-auto  ">
          <Routes>
            {/* Pass setIsAuthenticated prop to Login component */}
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/signup"
              element={<SignupForm setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard title="Dashboard" track="Track" />}
            />
            <Route path="/map" element={<Map title="Map" track="Analyze" />} />
            <Route
              path="/report"
              element={<Report title="Report" track="Analyze" />}
            />
            <Route
              path="/admin"
              element={<Admin title="Admin" track="Manage" />}
            />
            <Route
              path="/driver"
              element={<Driver title="Driver" track="Manage" />}
            />
            <Route
              path="/user"
              element={<User title="User" track="Manage" />}
            />
            <Route
              path="/vehicle"
              element={<Vehicle title="Vehicle" track="Manage" />}
            />
            <Route
              path="/trip"
              element={<Trip title="Trip" track="Manage" />}
            />
            <Route
              path="/booking"
              element={<Booking title="Booking" track="Manage" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
