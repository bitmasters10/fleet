import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { user } = useAuth();
  console.log(user)
  const email = user?.email || "";
  function toggle() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        onClick={toggle}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-[#F6F9FF] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        ref={sidebarRef}
        id="default-sidebar"
        className={`fixed top-0 left-0 z-50 w-56 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white mt-[78px] dark:bg-gray-800 ">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white  flex items-center p-2 text-gray-900 rounded-lg  dark:text-white hover:bg-[#F6F9FF] dark:bg-gray-800 dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF]  flex items-center p-2 text-gray-900 rounded-lg  dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 0C6.48 0 2 4.48 2 9c0 3.87 3.12 7 6.95 8.16L12 22l3.05-4.84C18.88 16 22 12.87 22 9c0-4.52-4.48-9-10-9zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  />
                </svg>
                <span className="ms-3">Map</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/report"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 0C6.48 0 2 4.48 2 9c0 3.87 3.12 7 6.95 8.16L12 22l3.05-4.84C18.88 16 22 12.87 22 9c0-4.52-4.48-9-10-9zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  />
                </svg>
                <span className="ms-3">Report</span>
              </NavLink>
            </li>

            {email == "admin@example.com" ? (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    !isActive
                      ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                      : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                  }
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C7.58 2 4 5.58 4 10c0 3.5 2.6 6.5 6 6.5s6-3 6-6.5C20 5.58 16.42 2 12 2zm0 8c-1.38 0-2.5 1.12-2.5 2.5S10.62 15 12 15s2.5-1.12 2.5-2.5S13.38 10 12 10z" />
                  </svg>
                  <span className="ms-3">Admin</span>
                </NavLink>
              </li>
            ) : (
              <li></li>
            )}
            <li>
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C7.58 2 4 5.58 4 10c0 3.5 2.6 6.5 6 6.5s6-3 6-6.5C20 5.58 16.42 2 12 2zm0 8c-1.38 0-2.5 1.12-2.5 2.5S10.62 15 12 15s2.5-1.12 2.5-2.5S13.38 10 12 10z" />
                </svg>
                <span className="ms-3">Fuel</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/driver"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c-1.1 0-2 .9-2 2v2H8v2h2v10h4V8h2V6h-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <span className="ms-3">Driver</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/vehicle"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400  group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 16c1.1 0 1.99-.9 1.99-2L19 7c0-1.1-.9-2-1.99-2H5C3.9 5 3 5.9 3 7v7c0 1.1.9 2 2 2h12zM5 7h14v7H5V7z" />
                </svg>
                <span className="ms-3">Vehicle</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/trip"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 16c1.1 0 1.99-.9 1.99-2L19 7c0-1.1-.9-2-1.99-2H5C3.9 5 3 5.9 3 7v7c0 1.1.9 2 2 2h12z" />
                </svg>
                <span className="ms-3">Trip</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/booking"
                className={({ isActive }) =>
                  !isActive
                    ? "bg-white flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-800 hover:bg-[#F6F9FF] dark:hover:bg-gray-700 group"
                    : "bg-[#F6F9FF] flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 group"
                }
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 16c1.1 0 1.99-.9 1.99-2L19 7c0-1.1-.9-2-1.99-2H5C3.9 5 3 5.9 3 7v7c0 1.1.9 2 2 2h12z" />
                </svg>
                <span className="ms-3">Booking</span>
              </NavLink>
            </li>

            
            {/* Add more NavLinks as needed */}
          </ul>
        </div>
      </aside>
    </>
  );
}
