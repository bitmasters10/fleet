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
import CalendarPage from "./pages/Calendar";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppLayout from "./pages/AppLayout";
import { AdminProvider } from "./contexts/AdminContext";
import { VehicleProvider } from "./contexts/VehicleContext";
import { DriverProvider } from "./contexts/DriverContext";

// PrivateRoute Component to protect routes
// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

// Sidebar wrapper to conditionally render Sidebar based on authentication
const SidebarWrapper = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Sidebar /> : null;
};
const NavbarWrapper = () => {
  const { isAuthenticated } = useAuth();

  return <Navbar isAuthenticated={isAuthenticated} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <VehicleProvider>
            <DriverProvider>
              {/* Navbar is always visible */}
              <NavbarWrapper />

              {/* Conditionally render Sidebar based on authentication */}
              <SidebarWrapper />
              <AppLayout>
                <div className="max-w-screen-2xl mx-auto">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard title="Dashboard" track="Track" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/map"
                      element={
                        <PrivateRoute>
                          <Map title="Map" track="Analyze" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/report"
                      element={
                        <PrivateRoute>
                          <Report title="Report" track="Analyze" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute>
                          <Admin title="Admin" track="Manage" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/driver"
                      element={
                        <PrivateRoute>
                          <Driver title="Driver" track="Manage" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/user"
                      element={
                        <PrivateRoute>
                          <User title="User" track="Manage" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/vehicle"
                      element={
                        <PrivateRoute>
                          <Vehicle title="Vehicle" track="Manage" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/trip"
                      element={
                        <PrivateRoute>
                          <Trip title="Trip" track="Manage" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/booking"
                      element={
                        <PrivateRoute>
                          <Booking title="Booking" track="Manage" />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/calendar"
                      element={
                        <PrivateRoute>
                          <CalendarPage title="Calendar" track="Manage" />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </div>
              </AppLayout>
            </DriverProvider>
          </VehicleProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
