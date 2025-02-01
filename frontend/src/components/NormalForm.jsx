import { useEffect, useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import { useVehicle } from "../contexts/VehicleContext";
import { useDrivers } from "../contexts/DriverContext";

// eslint-disable-next-line react/prop-types
const NormalForm = ({ setShowCreateForm }) => {
  const { fetchPackages, createBooking} = useBooking();
  const {  fetchAvailableVehicles} = useVehicle();
  const { fetchAvailableDrivers } = useDrivers();
  const [packages, setPackages] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [bookingData, setBookingData] = useState({
    DATE: "",
    START_TIME: "",
    END_TIME: "",
    PICKUP_LOC: "",
    DROP_LOC: "",
    CAR_ID: "",
    DRIVER_ID: "",
    USER_ID: "",
    BOOK_NO: "",
    NO_OF_PASSENGER: 1,
    PACKAGE_ID: "",
    AC_NONAC: "ac",
    MOBILE_NO: "",
  });

  useEffect(() => {
    const loadPackages = async () => {
      const fetchedPackages = await fetchPackages();
      setPackages(fetchedPackages || []);
    };
    loadPackages();
  }, [fetchPackages]);

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFetchAvailable = async () => {
    const { DATE, START_TIME, END_TIME } = bookingData;
    if (DATE && START_TIME && END_TIME) {
      const cars = await fetchAvailableVehicles(DATE, START_TIME, END_TIME);
      const drivers = await fetchAvailableDrivers(DATE, START_TIME, END_TIME);
      setAvailableCars(cars || []);
      setAvailableDrivers(drivers || []);
    } else {
      alert("Please provide the date, start time, and end time.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createBooking(bookingData);
    if (result.success) {
      alert("Booking created successfully!");
      setShowCreateForm(false);
    } else {
      alert(result.message || "Error creating booking");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto h-[60vh]">
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
        <label className="block text-gray-700 dark:text-gray-200">Start Time</label>
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
        <label className="block text-gray-700 dark:text-gray-200">End Time</label>
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
          {availableCars.map((car) => (
            <option key={car.CAR_ID} value={car.CAR_ID}>
              {car.MODEL_NAME || "Unknown Model"}
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
          {availableDrivers.map((driver) => (
            <option key={driver.DRIVER_ID} value={driver.DRIVER_ID}>
              {driver.NAME || "Unknown Driver"}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <button 
          type="submit" 
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Submit Booking
        </button>
      </div>
    </form>
  );
};

export default NormalForm;