import { useAuth } from "../contexts/AuthContext";

// eslint-disable-next-line react/prop-types
export default function AppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  return (
    <div className={` ${isAuthenticated ? "p-4 sm:ml-64" : "p-0 sm:ml-0"}`}>
      {children}
    </div>
  );
}
