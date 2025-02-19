import Heading from "../components/Heading";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// Sample data for fleet management charts
const vehicleUtilizationData = [
  { name: "Truck 1", utilization: 75 },
  { name: "Truck 2", utilization: 60 },
  { name: "Van 1", utilization: 85 },
  { name: "Car 1", utilization: 50 },
];

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

export default function Dashboard({ title, track }) {
  // Detect dark mode
  const isDarkMode = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div className="p-6">
      <Heading title={title} track={track} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Vehicle Utilization Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Vehicle Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vehicleUtilizationData}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#FFF" : "#000"} />
              <YAxis stroke={isDarkMode ? "#FFF" : "#000"} />
              <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#FFF", color: isDarkMode ? "#FFF" : "#000" }} />
              <Bar dataKey="utilization" fill={isDarkMode ? "#4C9AFF" : "#82ca9d"} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Consumption Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Fuel Consumption Trends</h2>
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
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Maintenance Costs</h2>
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

