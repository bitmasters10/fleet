import React, { useState, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";

// eslint-disable-next-line react/prop-types
export default function Booking({ title, track }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Fetch available books
  useEffect(() => {
    fetch("http://localhost:3000/admin/available-books")
      .then((response) => response.json())
      .then((data) => setAvailableBooks(data))
      .catch((error) => console.error("Error fetching available books:", error));
  }, []);

  // Fetch available cars
  useEffect(() => {
    fetch("http://localhost:3000/admin/avail-cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: "25-01-2025",
        start_time: "13:00",
        end_time: "17:00",
      }),
    })
      .then((response) => response.json())
      .then((data) => setAvailableCars(data))
      .catch((error) => console.error("Error fetching available cars:", error));
  }, []);

  // Fetch available drivers
  useEffect(() => {
    fetch("http://localhost:3000/admin/avail-drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: "25-01-2025",
        start_time: "13:00",
        end_time: "17:00",
      }),
    })
      .then((response) => response.json())
      .then((data) => setAvailableDrivers(data))
      .catch((error) => console.error("Error fetching available drivers:", error));
  }, []);

  // Create booking logic
  const createBooking = async (bookingData) => {
    const { capacity, noOfPassenger } = bookingData;

    if (noOfPassenger > capacity) {
      setBookingError("The number of passengers exceeds available capacity!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/admin/create-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Booking created successfully!");
      } else {
        alert("Failed to create booking!");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[90%] max-xl:mx-auto w-full bg-white my-20 dark:bg-gray-800">
        <div className="flex justify-between items-center mx-4 px-6 pt-6">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <AddButton setShowCreateForm={setShowCreateForm} showCreateForm={showCreateForm} />
        </div>

        {showCreateForm && (
          <CreateForm
            availableBooks={availableBooks}
            availableCars={availableCars}
            availableDrivers={availableDrivers}
            createBooking={createBooking}
            setShowCreateForm={setShowCreateForm}
            bookingError={bookingError}
          />
        )}

        <Input title={title} />
        <TableManage />
      </div>
    </div>
  );
}

// CreateForm component
function CreateForm({
  availableBooks,
  availableCars,
  availableDrivers,
  createBooking,
  setShowCreateForm,
  bookingError,
}) {
  const [bookingData, setBookingData] = useState({
    TIMING: "13:00",
    DATE: "25-01-2025",
    PICKUP_LOC: "kurla",
    DROP_LOC: "wahi",
    NO_OF_PASSENGER: 4,
    AC_NONAC: "ac",
    END_TIME: "17:00",
    VID: "1",
    USER_ID: "23",
    BOOK_NO: "1",
    CAR_ID: "",
    DRIVER_ID: "",
    PACKAGE_ID: "2174bcf8-2bf2-44f0-9f05-a546ef1b306",
  });

  // Handle change in form inputs
  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle car and driver selection
  const handleCarSelection = (e) => {
    setBookingData({ ...bookingData, CAR_ID: e.target.value });
  };

  const handleDriverSelection = (e) => {
    setBookingData({ ...bookingData, DRIVER_ID: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking(bookingData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
        <button onClick={() => setShowCreateForm(false)} className="absolute top-4 right-4 text-black dark:text-white text-2xl">
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Create Booking</h3>

        {bookingError && <div className="text-red-500 mb-2">{bookingError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Car</label>
            <select
              name="CAR_ID"
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              value={bookingData.CAR_ID}
              onChange={handleCarSelection}
            >
              <option value="">Select Car</option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">Driver</label>
            <select
              name="DRIVER_ID"
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              value={bookingData.DRIVER_ID}
              onChange={handleDriverSelection}
            >
              <option value="">Select Driver</option>
              {availableDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// TableManage component
function TableManage() {
  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Product name</th>
            <th scope="col" className="px-6 py-3">Color</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Apple MacBook Pro 17
            </th>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">$2999</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1">
                Edit
              </a>
              <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline pl-1">
                Delete
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AddButton({ showCreateForm, setShowCreateForm }) {
  return (
    <a
      className="group cursor-pointer outline-none hover:rotate-90 duration-300 mx-3"
      title="Add New"
      onClick={() => setShowCreateForm(!showCreateForm)}
    >
      <svg
        className="stroke-black dark:stroke-white fill-none group-active:stroke-black group-active:fill-black group-active:duration-0 duration-300"
        viewBox="0 0 24 24"
        height="50px"
        width="50px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeWidth="1.5" d="M8 12H16" />
        <path strokeWidth="1.5" d="M12 16V8" />
      </svg>
    </a>
  );
}
