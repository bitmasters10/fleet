import { createContext, useContext, useState } from "react";
import axios from "axios";

const AdminContext = createContext();

// eslint-disable-next-line react/prop-types
export const AdminProvider = ({ children }) => {
  const [admins, setAdmins] = useState([]); // Ensure initial value is an array
  const [adminCount, setAdminCount] = useState(0);
  // Axios instance for session management
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Replace with your backend base URL
    withCredentials: true, // Important: This ensures that cookies (session) are included in requests
  });

  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get("/Sadmin/admins"); // Replace with your actual API endpoint
      setAdmins(response.data);
      setAdminCount(response.data.length);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]); // Fallback to an empty array in case of an error
    }
  };
  const addAdmin = async (admin) => {
    try {
      
      const response = await axiosInstance.post("/admin-auth/register", admin);
      setAdmins((prev) => [...prev, response.data.user]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error adding admin:" };
    }
  };


  

  const updateAdmin = async (id, updatedAdmin) => {
    try {
        const response = await axiosInstance.patch(`/Sadmin/admin/${id}`, updatedAdmin);
        
        // If response contains the updated admin data, map it correctly
        if (response.data.admin) {
            setAdmins((prev) =>
                prev.map((admin) =>
                    admin.aid === id ? { ...admin, ...response.data.admin } : admin
                )
            );
        } else {
            console.error("Update failed, no admin data returned.");
        }
    } catch (error) {
        console.error("Error updating admin:", error);
    }
};


  const deleteAdmin = async (id) => {
    try {
      await axiosInstance.delete(`/Sadmin/admin/${id}`);
      setAdmins((prev) => prev.filter((admin) => admin.aid !== id));
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{ admins,adminCount, fetchAdmins, addAdmin, updateAdmin, deleteAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  return useContext(AdminContext);
};
