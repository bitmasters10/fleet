import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Adjust the path as necessary

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // Return the context values
};

export default useAuth;
