import React, { useState, useContext, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import { useBooking } from "../contexts/BookingContext";
import { useDrivers } from "../contexts/DriverContext";
import { useVehicle } from "../contexts/VehicleContext";

// eslint-disable-next-line react/prop-types
export default function Booking({ title, track }) {
  const { bookings, loading, fetchBookings, createBooking } = useBooking();

  const { fetchAvailableDrivers, drivers } = useDrivers();
  const { fetchAvailableVehicles, vehicles } = useVehicle();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const date = "25-01-2025";
  const start_time = "13:00";
  const end_time = "17:00";

  // Fetch available drivers and vehicles using the context functions
  useEffect(() => {
    fetchBookings();
    fetchAvailableDrivers(date, start_time, end_time);
    fetchAvailableVehicles(date, start_time, end_time);
  }, []);
  
  console.log("Bookings Data:", bookings);
  
  // Create booking logic
  const handleCreateBooking = async (bookingData) => {
    const { NO_OF_PASSENGER, CAR_ID, DRIVER_ID, PACKAGE_ID } = bookingData;

    // Validate the booking data
    const selectedCar = vehicles.find((vehicle) => vehicle.id === CAR_ID);
    const selectedDriver = drivers.find((driver) => driver.id === DRIVER_ID);

    if (!selectedCar || !selectedDriver) {
      setBookingError("Please select a valid car and driver.");
      return;
    }

    if (NO_OF_PASSENGER > selectedCar.capacity) {
      setBookingError("The number of passengers exceeds available capacity!");
      return;
    }

    await createBooking({ ...bookingData, CAR_ID, DRIVER_ID, PACKAGE_ID });
    alert("Booking created successfully!");
  };

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[90%] max-xl:mx-auto w-full bg-white my-20 dark:bg-gray-800">
        <div className="flex justify-between items-center mx-4 px-6 pt-6">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <AddButton
            setShowCreateForm={setShowCreateForm}
            showCreateForm={showCreateForm}
          />
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
              <button
                onClick={() => setShowCreateForm(false)}
                className="absolute top-4 right-4 text-black dark:text-white text-2xl"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Create Booking
              </h3>
              <CreateForm
                availableCars={vehicles}
                availableDrivers={drivers}
                createBooking={handleCreateBooking}
                setShowCreateForm={setShowCreateForm}
                bookingError={bookingError}
              />
            </div>
          </div>
        )}

        <Input title={title} />
        <TableManage bookings={bookings} loading={loading} />
      </div>
    </div>
  );
}

// CreateForm component
function CreateForm({
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
    <form onSubmit={handleSubmit}>
      {bookingError && <div className="text-red-500 mb-2">{bookingError}</div>}
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
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

// TableManage component
// eslint-disable-next-line react/prop-types
function TableManage({ bookings, loading }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle Accept and Reject actions
  const handleAccept = (bookingId) => {
    alert(`Accepted booking: ${bookingId}`);
    // Add API call or state update logic here
  };

  const handleReject = (bookingId) => {
    alert(`Rejected booking: ${bookingId}`);
    // Add API call or state update logic here
  };

  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Booking ID</th>
            <th scope="col" className="px-6 py-3">Car ID</th>
            <th scope="col" className="px-6 py-3">User ID</th>
            <th scope="col" className="px-6 py-3">Pickup Location</th>
            <th scope="col" className="px-6 py-3">Time</th>
            <th scope="col" className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.BOOK_ID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-3">{booking.BOOK_ID}</td>
              <td className="px-6 py-3">{booking.CAR_ID}</td>
              <td className="px-6 py-3">{booking.USER_ID}</td>
              <td className="px-6 py-3">{booking.PICKUP_LOC}</td>
              <td className="px-6 py-3">{booking.TIMING}</td>
              <td className="px-6 py-3 flex">
                <button
                  onClick={() => handleAccept(booking.BOOK_ID)}
                  className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 mx-1"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(booking.BOOK_ID)}
                  className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 mx-1"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
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
