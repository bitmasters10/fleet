import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// eslint-disable-next-line react/prop-types
export default function Navbar({ isAuthenticated }) {
  const [isProfile, setIsProfile] = useState(false);

  const { logout } = useAuth();
  function toggleProfile() {
    setIsProfile(!isProfile);
  }

  return (
    <nav className="bg-white w-full border-gray-200 dark:bg-gray-900 top-0 z-50 sticky shadow-sm">
      <div className="xl:max-w-[95%] max-w-screen-full flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/icon.jpg" width={60} height={20} alt="fwes" />
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            onClick={toggleProfile}
            className="relative flex text-sm rounded-full p-[2px] bg-black  group"
            id="user-menu-button"
            aria-expanded={isProfile ? "true" : "false"}
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded-full">
              <img
                className="w-8 h-8 rounded-full"
                src="/user.jpg"
                width={100}
                height={0}
                alt="user photo"
              />
            </div>
          </button>

          {/* Conditionally render the dropdown based on authentication */}
          {isAuthenticated ? (
            <div
              className={`${
                isProfile
                  ? "opacity-100 translate-y-0 max-h-screen"
                  : "opacity-0 -translate-y-5 max-h-0"
              } transition-all duration-300 ease-in-out overflow-hidden z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute top-20 right-10 2xl:right-16`}
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Rayyan Shaikh
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  rayyan.shaikhh@gmail.com
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    onClick={logout}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </nav>
  );
}
