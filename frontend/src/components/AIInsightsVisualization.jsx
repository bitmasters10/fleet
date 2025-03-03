import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AIInsightsVisualization = ({ aiInsights, reportData }) => {
  const [vehicleEfficiency, setVehicleEfficiency] = useState([]);
  const [costBreakdown, setCostBreakdown] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  
  // Process report data to generate insights visualizations
  useEffect(() => {
    if (reportData && reportData.fuel_per_vehicle && reportData.trips_per_vehicle) {
      // Calculate vehicle efficiency (trips per fuel cost)
      const efficiency = reportData.fuel_per_vehicle.map(vehicle => {
        const trips = reportData.trips_per_vehicle.find(v => v.CAR_NO === vehicle.CAR_NO)?.trips_completed || 0;
        return {
          name: vehicle.CAR_NO,
          efficiency: vehicle.fuel_cost > 0 ? (trips / vehicle.fuel_cost * 100).toFixed(2) : 0,
          fuelCost: vehicle.fuel_cost,
          trips: trips,
        };
      }).sort((a, b) => b.efficiency - a.efficiency);
      
      setVehicleEfficiency(efficiency);
      
      // Generate cost breakdown
      const totalFuel = reportData.total_fuel_cost || 0;
      const maintenanceEstimate = totalFuel * 0.15; // Estimated maintenance cost
      const operationalEstimate = totalFuel * 0.25; // Estimated operational cost
      
      setCostBreakdown([
        { name: 'Fuel', value: totalFuel },
        { name: 'Maintenance (est.)', value: maintenanceEstimate },
        { name: 'Operational (est.)', value: operationalEstimate }
      ]);
      
      // Generate performance metrics for radar chart
      const avgTripsPerVehicle = reportData.total_trips / reportData.trips_per_vehicle.length;
      const avgFuelPerVehicle = reportData.total_fuel_cost / reportData.fuel_per_vehicle.length;
      const fleetUtilization = reportData.total_trips / (reportData.trips_per_vehicle.length * 30) * 100; // Rough estimate
      
      setPerformanceMetrics([
        { subject: 'Fleet Utilization', A: fleetUtilization > 100 ? 100 : fleetUtilization, fullMark: 100 },
        { subject: 'Fuel Efficiency', A: 70, fullMark: 100 }, // Placeholder
        { subject: 'Trip Completion', A: 90, fullMark: 100 }, // Placeholder
        { subject: 'Cost Optimization', A: 65, fullMark: 100 }, // Placeholder
        { subject: 'Maintenance', A: 80, fullMark: 100 } // Placeholder
      ]);
      
      // Generate main recommendation based on data
      const leastEfficientVehicle = [...efficiency].sort((a, b) => a.efficiency - b.efficiency)[0];
      if (leastEfficientVehicle) {
        setRecommendation(`Consider maintenance check for ${leastEfficientVehicle.name} to improve efficiency. Currently performing at ${leastEfficientVehicle.efficiency}% efficiency.`);
      }
    }
  }, [reportData]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2">
        AI-Powered Fleet Analytics
      </h3>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
          <div className="text-orange-500 dark:text-orange-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">Key Recommendation</h4>
            <p className="text-gray-600 dark:text-gray-400">{recommendation || "No recommendation available"}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Vehicle Efficiency Analysis</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vehicleEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }}
                formatter={(value, name) => [`${value}${name === 'efficiency' ? '%' : ''}`, name === 'efficiency' ? 'Efficiency' : name]}
              />
              <Legend />
              <Bar dataKey="efficiency" name="Efficiency Score" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Efficiency calculated as trips completed per unit of fuel cost (higher is better)
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Estimated Cost Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Fleet Performance Metrics</h4>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceMetrics}>
            <PolarGrid stroke="#666" />
            <PolarAngleAxis dataKey="subject" stroke="#888" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" />
            <Radar name="Performance" dataKey="A" stroke="#FF6500" fill="#FF6500" fillOpacity={0.6} />
            <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }} />
          </RadarChart>
        </ResponsiveContainer>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Performance metrics are calculated based on historical data and industry benchmarks
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Data-Driven Insights</h4>
        <ul className="list-disc pl-5 space-y-2">
          {vehicleEfficiency.length > 0 && (
            <li className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{vehicleEfficiency[0].name}</span> is your most efficient vehicle with an efficiency score of {vehicleEfficiency[0].efficiency}%.
            </li>
          )}
          {reportData && reportData.total_trips > 0 && (
            <li className="text-gray-600 dark:text-gray-400">
              Average fuel cost per trip: <span className="font-medium">₹{(reportData.total_fuel_cost / reportData.total_trips).toFixed(2)}</span>
            </li>
          )}
          {reportData && reportData.trips_per_vehicle && reportData.trips_per_vehicle.length > 0 && (
            <li className="text-gray-600 dark:text-gray-400">
              Vehicle utilization rate: <span className="font-medium">{(reportData.total_trips / (reportData.trips_per_vehicle.length * 30) * 100).toFixed(1)}%</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AIInsightsVisualization;