import React, { useState, useContext } from "react";
import { useReport } from "../contexts/ReportContext";
import Heading from "../components/Heading";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// eslint-disable-next-line react/prop-types
export default function Report({ title, track }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const { reportData, loading, error, fetchMonthlyReport, generatePDF } = useReport();

  const handleGenerateReport = () => {
    if (!selectedDate) return;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    fetchMonthlyReport(year, month);
  };

  // Data for charts
  const fuelPerVehicleData = reportData?.fuel_per_vehicle || [];
  const tripsPerVehicleData = reportData?.trips_per_vehicle || [];
  const tripsPerDriverData = reportData?.trips_per_driver || [];

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[50%] max-xl:mx-auto w-full bg-white dark:bg-gray-800 my-5">
        <div className="p-4 flex items-center justify-between">
          <ReactDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="w-full 2xl:w-[20vw] px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6500]"
            placeholderText="Select a month"
          />
          <button
            onClick={handleGenerateReport}
            className="bg-[#FF6500] text-white px-4 py-2 rounded-full transition duration-200 ease-in-out hover:bg-orange-600 active:bg-[#FF6500] focus:outline-none"
          >
            Generate Report
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {reportData && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Monthly Report: {reportData.month}</h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow text-gray-800">
              <h3 className="text-lg font-semibold">Total Fuel Cost</h3>
              <p className="text-2xl">₹{reportData.total_fuel_cost}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-gray-800">
              <h3 className="text-lg font-semibold">Total Bookings</h3>
              <p className="text-2xl">{reportData.total_bookings}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-gray-800">
              <h3 className="text-lg font-semibold">Total Trips</h3>
              <p className="text-2xl">{reportData.total_trips}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Fuel Cost Per Vehicle</h3>
              <BarChart width={400} height={300} data={fuelPerVehicleData}>
                <XAxis dataKey="CAR_NO" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fuel_cost" fill="#0088FE" />
              </BarChart>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Trips Per Vehicle</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={tripsPerVehicleData}
                  dataKey="trips_completed"
                  nameKey="CAR_NO"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {tripsPerVehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Download PDF Button */}
          <div className="flex justify-center">
            <button
              onClick={generatePDF}
              className="bg-[#FF6500] text-white px-4 py-2 rounded-full transition duration-200 ease-in-out hover:bg-orange-600 active:bg-[#FF6500] focus:outline-none"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}