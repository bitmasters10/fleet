import Heading from "../components/Heading";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { useAdmin } from "../contexts/AdminContext";
import { useUsers } from "../contexts/UserContext";
import { useBooking } from "../contexts/BookingContext";
import { useVehicle } from "../contexts/VehicleContext";
import { useDrivers } from "../contexts/DriverContext";
import { useTrip } from "../contexts/TripContext";
import { useEffect, useMemo } from "react";

// Sample Data (Only for Fuel and Maintenance)
const fuelConsumptionData = [
  { month: "Jan", fuel: 300 },
  { month: "Feb", fuel: 280 },
  { month: "Mar", fuel: 350 },
  { month: "Apr", fuel: 400 },
  { month: "May", fuel: 380 },
];

const maintenanceCostData = [
  { name: "Engine Repair", cost: 500 },
  { name: "Tire Replacement", cost: 300 },
  { name: "Oil Change", cost: 200 },
  { name: "Battery Replacement", cost: 150 },
];

const LIGHT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const DARK_COLORS = ["#4C9AFF", "#66D9E8", "#FFD54F", "#FF6E40"];

const CarTripStatsChart = ({ isDarkMode }) => {
  const { carTripStats, fetchCarTripStats, loading } = useVehicle();

  useEffect(() => {
    fetchCarTripStats();
  }, []);

  // Transform data for the chart
  const vehicleUtilizationData = useMemo(() => {
    return carTripStats.map((car) => ({
      name: car.MODEL_NAME || "Unknown", // Default to "Unknown" if MODEL_NAME is null
      utilization: car.completed_trips * 10, // Example calculation
      completed_trips: car.completed_trips,
    }));
  }, [carTripStats]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Vehicle Utilization
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={vehicleUtilizationData}>
          <XAxis dataKey="name" stroke={isDarkMode ? "#FFF" : "#000"} />
          <YAxis stroke={isDarkMode ? "#FFF" : "#000"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#333" : "#FFF",
              color: isDarkMode ? "#FFF" : "#000",
            }}
          />
          <Bar dataKey="utilization" fill={isDarkMode ? "#4C9AFF" : "#82ca9d"} />
          <Bar dataKey="completed_trips" fill={isDarkMode ? "#FFD700" : "#FF8042"} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function Dashboard({ title, track }) {
  const isDarkMode = typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const { adminCount, fetchAdmins } = useAdmin();
  const { userCount, fetchUsers } = useUsers();
  const { bookingCount, fetchBookings } = useBooking();
  const { vehicleCount, fetchVehicles, fetchCarTripStats } = useVehicle();
  const { driverCount, fetchDrivers } = useDrivers();
  const { tripCount, fetchTrips } = useTrip();

  useEffect(() => {
    fetchAdmins();
    fetchBookings();
    fetchDrivers();
    fetchUsers();
    fetchTrips();
    fetchVehicles();
    fetchCarTripStats();
  }, []);

  return (
    <div className="p-6">
      <Heading title={title} track={track} />

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        {[
          { label: "Total Users", count: userCount },
          { label: "Total Drivers", count: driverCount },
          { label: "Total Admins", count: adminCount },
          { label: "Total Vehicles", count: vehicleCount },
          { label: "Total Trips", count: tripCount },
          { label: "Total Bookings", count: bookingCount },
        ].map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.count}</h3>
            <p className="text-gray-600 dark:text-gray-300">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Vehicle Utilization Bar Chart */}
        <CarTripStatsChart isDarkMode={isDarkMode} />

        {/* Fuel Consumption Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Fuel Consumption Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fuelConsumptionData}>
              <XAxis dataKey="month" stroke={isDarkMode ? "#FFF" : "#000"} />
              <YAxis stroke={isDarkMode ? "#FFF" : "#000"} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#FFF", color: isDarkMode ? "#FFF" : "#000" }} />
              <Line type="monotone" dataKey="fuel" stroke={isDarkMode ? "#FFD54F" : "#8884d8"} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Costs Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Maintenance Costs
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={maintenanceCostData} dataKey="cost" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {maintenanceCostData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={isDarkMode ? DARK_COLORS[index % DARK_COLORS.length] : LIGHT_COLORS[index % LIGHT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#FFF", color: isDarkMode ? "#FFF" : "#000" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
