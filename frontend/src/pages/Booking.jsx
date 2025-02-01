/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import { useBooking } from "../contexts/BookingContext";
import { useDrivers } from "../contexts/DriverContext";
import { useVehicle } from "../contexts/VehicleContext";
import NormalForm from "../components/NormalForm";

// eslint-disable-next-line react/prop-types
export default function Booking({ title, track }) {
  const {
    bookings,
    loading,
    fetchBookings,
    createBooking,
    deleteBooking,
    createManualBooking,
    fetchPackages,
  } = useBooking();

  const { fetchAvailableDrivers, drivers } = useDrivers();
  const { fetchAvailableVehicles, availableVehicles } = useVehicle();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [activeTab, setActiveTab] = useState("normal");

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
    const { NO_OF_PASSENGER, CAR_ID, DRIVER_ID } = bookingData;

    // Validate the booking data
    const selectedCar = availableVehicles.find(
      (vehicle) => vehicle.CAR_ID === CAR_ID
    );
    const selectedDriver = drivers.find(
      (driver) => driver.DRIVER_ID === DRIVER_ID
    );

    if (!selectedCar || !selectedDriver) {
      setBookingError("Please select a valid car and driver.");
      return;
    }

    if (NO_OF_PASSENGER > selectedCar.SEATING_CAPACITY) {
      setBookingError("The number of passengers exceeds available capacity!");
      return;
    }

    // Construct the booking data to match backend expectations
    const result = await createBooking({
      ...bookingData,
      CAR_ID,
      DRIVER_ID,
      // Add any other required fields here
    });

    if (result.success) {
      alert("Booking created successfully!");
    } else {
      alert(result.message);
    }
  };

  const handleCreateManualBooking = async (bookingData) => {
    const result = await createManualBooking(bookingData);
    console.log("Result from manual booking:", result);
    if (result && result.success) {
      alert("Manual booking created successfully!");
    } else {
      alert(
        result.message || "An error occurred while creating the manual booking."
      );
    }
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
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full h-[80vh] lg:w-[90%] mx-auto relative">
              <button
                onClick={() => setShowCreateForm(false)}
                className="absolute top-4 right-4 text-black dark:text-white text-2xl"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Create Booking
              </h3>

              {/* Tab Navigation */}
              <div className="flex mb-4">
                <button
                  className={`px-4 py-2 ${
                    activeTab === "normal"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("normal")}
                >
                  Normal Booking
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "manual"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("manual")}
                >
                  Manual Booking
                </button>
              </div>

              {/* Render the appropriate form based on the active tab */}
              {activeTab === "normal" ? (
                <NormalForm />
              ) : (
                <CreateForm
                  createBooking={handleCreateBooking}
                  createManualBooking={handleCreateManualBooking}
                  setShowCreateForm={setShowCreateForm}
                  bookingError={bookingError}
                  fetchPackages={fetchPackages}
                />
              )}
            </div>
          </div>
        )}

        <Input title={title} />
        <TableManage
          bookings={bookings}
          loading={loading}
          deleteBooking={deleteBooking}
        />
      </div>
    </div>
  );
}

// CreateForm component
function CreateForm({
  createBooking,
  createManualBooking,
  setShowCreateForm,
  bookingError,
  fetchPackages,
}) {
  const { fetchAvailableVehicles } = useVehicle();
  const { fetchAvailableDrivers } = useDrivers();

  const [bookingData, setBookingData] = useState({
    DATE: "",
    START_TIME: "13:00",
    END_TIME: "",
    PICKUP_LOC: "",
    DROP_LOC: "",
    NO_OF_PASSENGER: 1,
    AC_NONAC: "ac",
    USER_ID: "",
    BOOK_NO: "",
    CAR_ID: "",
    DRIVER_ID: "",
    PACKAGE_ID: "",
    MOBILE_NO: "",
  });

  const [availableCars, setAvailableCars] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [packages, setPackages] = useState([]);

  // Fetch available cars, drivers, and packages
  useEffect(() => {
    const loadPackages = async () => {
      const fetchedPackages = await fetchPackages();
      setPackages(fetchedPackages || []);
    };

    loadPackages();
  }, []);

  // Handle change in form inputs
  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch available cars and drivers when the button is clicked
  const handleFetchAvailable = async () => {
    const { DATE, START_TIME, END_TIME } = bookingData;
    if (DATE && START_TIME && END_TIME) {
      try {
        const cars = await fetchAvailableVehicles(DATE, START_TIME, END_TIME);
        console.log(cars);
        const drivers = await fetchAvailableDrivers(DATE, START_TIME, END_TIME);
        setAvailableCars(cars || []); // Ensure it's an array
        setAvailableDrivers(drivers || []); // Ensure it's an array
      } catch (error) {
        alert("Error fetching available cars and drivers: " + error.message);
      }
    } else {
      alert("Please provide the date, start time, and end time.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !bookingData.DATE ||
      !bookingData.START_TIME ||
      !bookingData.END_TIME ||
      !bookingData.CAR_ID ||
      !bookingData.DRIVER_ID
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Submitting manual booking data:", bookingData);
    const result = await createManualBooking(bookingData); // Call the manual booking function
    if (result.success) {
      alert("Manual booking created successfully!");
      setShowCreateForm(false); // Close the form after successful submission
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto h-[55vh]">
      {bookingError && <div className="text-red-500 mb-2">{bookingError}</div>}

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Date</label>
        <input
          type="date"
          name="DATE"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.DATE}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          Start Time
        </label>
        <input
          type="time"
          name="START_TIME"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.START_TIME}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          End Time
        </label>
        <input
          type="time"
          name="END_TIME"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.END_TIME}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <button
          type="button"
          onClick={handleFetchAvailable}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Fetch Available Cars and Drivers
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Car</label>
        <select
          name="CAR_ID"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.CAR_ID}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Car</option>
          {Array.isArray(availableCars) &&
            availableCars.map((car) => (
              <option key={car.CAR_ID} value={car.CAR_ID}>
                {car.MODEL_NAME || "Unknown Model"} (Capacity:{" "}
                {car.SEATING_CAPACITY || "N/A"})
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
          onChange={handleInputChange}
          required
        >
          <option value="">Select Driver</option>
          {Array.isArray(availableDrivers) &&
            availableDrivers.map((driver) => (
              <option key={driver.DRIVER_ID} value={driver.DRIVER_ID}>
                {driver.NAME || "Unknown Driver"}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          User ID
        </label>
        <input
          type="text"
          name="USER_ID"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.USER_ID}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          Booking Number
        </label>
        <input
          type="text"
          name="BOOK_NO"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.BOOK_NO}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          Number of Passengers
        </label>
        <input
          type="number"
          name="NO_OF_PASSENGER"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.NO_OF_PASSENGER}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          Package
        </label>
        <select
          name="PACKAGE_ID"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.PACKAGE_ID}
          onChange={handleInputChange}
        >
          <option value="">Select a Package</option>
          {packages.map((pkg) => (
            <option key={pkg.PID} value={pkg.PID}>
              {pkg.NAME} (Places: {pkg.PLACES}, Duration: {pkg.DURATION})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          AC/Non-AC
        </label>
        <select
          name="AC_NONAC"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.AC_NONAC}
          onChange={handleInputChange}
          required
        >
          <option value="">Select</option>
          <option value="ac">AC</option>
          <option value="nonac">Non-AC</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          Mobile Number
        </label>
        <input
          type="tel"
          name="MOBILE_NO"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.MOBILE_NO}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          Pickup Location
        </label>
        <input
          type="text"
          name="PICKUP_LOC"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.PICKUP_LOC}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">
          Drop Location
        </label>
        <input
          type="text"
          name="DROP_LOC"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.DROP_LOC}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Submit Manual Booking
        </button>
      </div>
    </form>
  );
}

// TableManage component
// eslint-disable-next-line react/prop-types
function TableManage({ bookings, loading, deleteBooking }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        console.log("Attempting to delete booking with ID:", bookingId); // Debugging log
        await deleteBooking(bookingId);
        alert("Booking deleted successfully!");
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Error deleting booking: " + error.message);
      }
    }
  };

  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Booking ID
            </th>
            <th scope="col" className="px-6 py-3">
              Car ID
            </th>
            <th scope="col" className="px-6 py-3">
              User ID
            </th>
            <th scope="col" className="px-6 py-3">
              Pickup Location
            </th>
            <th scope="col" className="px-6 py-3">
              Time
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={`${booking.BOOK_ID}-${booking.CAR_ID}`}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-3">{booking.BOOK_ID}</td>
              <td className="px-6 py-3">{booking.CAR_ID}</td>
              <td className="px-6 py-3">{booking.USER_ID}</td>
              <td className="px-6 py-3">{booking.PICKUP_LOC}</td>
              <td className="px-6 py-3">{booking.TIMING}</td>
              <td className="px-6 py-4 flex">
                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1">
                  Edit
                </button>
                <button
                  className="font-medium text-red-600 dark:text-red-500 hover:underline pl-1"
                  onClick={() => handleDelete(booking.BOOK_ID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
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
