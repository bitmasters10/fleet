import { createContext, useContext, useState } from "react";
import axios from "axios";

const ReportContext = createContext();

// Custom hook to use the ReportContext
export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};

// ReportContext Provider Component
// eslint-disable-next-line react/prop-types
export const ReportProvider = ({ children }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "https://fleet-eyad.onrender.com/", // Replace with your backend base URL
    withCredentials: true, // Ensures that cookies (session) are included in requests
  });

  // Fetch monthly report data
  const fetchMonthlyReport = async (year, month) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/Sadmin/monthly-report/${year}/${month}`);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching monthly report:", error);
      setError(error.response?.data?.message || "Error fetching monthly report.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF for the report
  const generatePDF = async () => {
    if (!reportData) return;

    try {
      const response = await axiosInstance.post(
        "/Sadmin/generate-pdf",
        { reportData },
        { responseType: "blob" } // Ensure the response is treated as a binary file
      );

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `monthly-report-${reportData.month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Error generating PDF.");
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reportData,
        loading,
        error,
        fetchMonthlyReport,
        generatePDF,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};