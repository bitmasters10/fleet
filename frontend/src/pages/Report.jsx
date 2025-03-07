import React, { useState, useEffect } from "react";
import { useReport } from "../contexts/ReportContext";
import Heading from "../components/Heading";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";
import AIInsightsVisualization from "../components/AIInsightsVisualization"; // Import the new component

//AIzaSyDAYA7L8JC7f4U5bOM7Ks-ejE1thVtBZhw api key
const API_KEY = "AIzaSyDAYA7L8JC7f4U5bOM7Ks-ejE1thVtBZhw"; // Set this in your .env file
const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

export default function Report({ title, track }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const { reportData, loading, error, fetchMonthlyReport, generatePDF } = useReport();
  const [aiInsights, setAIInsights] = useState(null);
  const [parsedInsights, setParsedInsights] = useState({
    summary: "",
    keyPoints: [],
    recommendations: []
  });
  const [showAIVisualizations, setShowAIVisualizations] = useState(true);

  useEffect(() => {
    if (reportData) {
      fetchAIInsights(reportData);
    }
  }, [reportData]);

  // Parse AI insights into a structured format
  useEffect(() => {
    if (aiInsights) {
      try {
        // Try to parse insights if they come in a structured format
        // Otherwise, extract sections using regex or simple text parsing
        const summary = aiInsights.match(/Summary:(.*?)(?=Key Points:|$)/s)?.[1]?.trim() || aiInsights.substring(0, 150) + "...";
        
        // Extract key points
        const keyPointsMatch = aiInsights.match(/Key Points:(.*?)(?=Recommendations:|$)/s);
        const keyPoints = keyPointsMatch ? 
          keyPointsMatch[1].split(/\n\s*[-•]\s*/).filter(point => point.trim()) : 
          aiInsights.split('. ').filter((s, i) => i < 3 && s.length > 10);
        
        // Extract recommendations
        const recommendationsMatch = aiInsights.match(/Recommendations:(.*?)$/s);
        const recommendations = recommendationsMatch ? 
          recommendationsMatch[1].split(/\n\s*[-•]\s*/).filter(rec => rec.trim()) : 
          [];

        setParsedInsights({
          summary,
          keyPoints,
          recommendations
        });
      } catch (err) {
        console.error("Error parsing AI insights:", err);
        // Fallback to using raw text
        setParsedInsights({
          summary: aiInsights,
          keyPoints: [],
          recommendations: []
        });
      }
    }
  }, [aiInsights]);

  const fetchAIInsights = async (data) => {
    try {
      const prompt = `
      Analyze the following fleet report data and provide insights:
      ${JSON.stringify(data)}
      
      Please structure your response with these sections:
      - Summary: A brief overview of the fleet performance
      - Key Points: 3-5 bullet points highlighting important metrics
      - Recommendations: 2-3 actionable suggestions based on the data
      `;

      const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const result = await response.json();
      setAIInsights(result.candidates?.[0]?.content?.parts?.[0]?.text || "No insights available");
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setAIInsights("Failed to fetch insights");
    }
  };

  const handleGenerateReport = () => {
    if (!selectedDate) return;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    fetchMonthlyReport(year, month);
  };

  const fuelPerVehicleData = reportData?.fuel_per_vehicle || [];
  const tripsPerVehicleData = reportData?.trips_per_vehicle || [];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  // Generate trend data if it exists
  const generateTrendData = () => {
    if (!reportData?.monthly_trends) return [];
    
    return reportData.monthly_trends.map(item => ({
      name: item.week || item.day,
      trips: item.trips || 0,
      fuel: item.fuel_cost || 0
    }));
  };

  const trendData = generateTrendData();

  const toggleAIVisualization = () => {
    setShowAIVisualizations(!showAIVisualizations);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Heading title={title} track={track} />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <ReactDatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="w-full md:w-64 px-3 py-2 text-gray-700 dark:text-gray-300 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6500] bg-white dark:bg-gray-700"
              placeholderText="Select a month"
            />
            <button 
              onClick={handleGenerateReport} 
              className="w-full md:w-auto bg-[#FF6500] text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300">Loading report data...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        )}

        {reportData && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Monthly Report: {reportData.month}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Fuel Cost</h3>
                  <p className="text-2xl text-gray-900 dark:text-white">₹{reportData.total_fuel_cost}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Bookings</h3>
                  <p className="text-2xl text-gray-900 dark:text-white">{reportData.total_bookings}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Trips</h3>
                  <p className="text-2xl text-gray-900 dark:text-white">{reportData.total_trips}</p>
                </div>
              </div>
            </div>

            {/* AI Visualizations - New Section */}
            {aiInsights && showAIVisualizations && (
              <AIInsightsVisualization aiInsights={aiInsights} reportData={reportData} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Fuel Cost Per Vehicle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fuelPerVehicleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="CAR_NO" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="fuel_cost" name="Fuel Cost (₹)" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Trips Per Vehicle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={tripsPerVehicleData} 
                      dataKey="trips_completed" 
                      nameKey="CAR_NO" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      label={({CAR_NO, trips_completed}) => `${CAR_NO}: ${trips_completed}`}
                    >
                      {tripsPerVehicleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {trendData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Monthly Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }} />
                      <Legend />
                      <Line type="monotone" dataKey="trips" name="Trips" stroke="#00C49F" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="fuel" name="Fuel Cost" stroke="#FF8042" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {aiInsights && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2">
                    AI Insights & Recommendations
                  </h3>
                  <button 
                    onClick={toggleAIVisualization} 
                    className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {showAIVisualizations ? "Hide Visualizations" : "Show Visualizations"}
                  </button>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Summary</h4>
                  <p className="text-gray-600 dark:text-gray-400">{parsedInsights.summary}</p>
                </div>
                
                {parsedInsights.keyPoints.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Key Points</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {parsedInsights.keyPoints.map((point, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {parsedInsights.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Recommendations</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {parsedInsights.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button 
                onClick={generatePDF} 
                className="bg-[#FF6500] text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Download PDF Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}