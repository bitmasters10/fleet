import { useEffect, useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import { useVehicle } from "../contexts/VehicleContext";
import { useDrivers } from "../contexts/DriverContext";

const TripAdvisorForm = ({ setShowCreateForm }) => {
  const { fetchAvailableVehicles } = useVehicle();
  const { fetchAvailableDrivers } = useDrivers();
  const { tripAdvisorBooking, fetchTripBookings, createAdvancedBooking, fetchPackages } = useBooking();

  const [availableCars, setAvailableCars] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [packages, setPackages] = useState([]);

  const [bookingData, setBookingData] = useState({
    success_id: "",
    PLACES: "",
    capacity: "",
    datetime: "",
    mobile_no: "",
    package_id: "",
    product_name: "",
    user_id: "",
    PICKUP_LOC: "",
    VID: "",
    DRIVER_ID: "",
    AC_NONAC: "",
    CAR_ID: "",
    NO_OF_PASSENGER: "",
    START_TIME: "",
    BOOK_NO: "",
    END_TIME: ""
  });

  useEffect(() => {
    fetchTripBookings();
  }, []);

  const handleSuccessIdChange = (e) => {
    const selectedId = e.target.value;
    setBookingData({ ...bookingData, success_id: selectedId });
    const selectedBooking = tripAdvisorBooking.find((b) => b.booking_reference === selectedId);
    if (selectedBooking) {
      setBookingData({
        ...bookingData,
        success_id: selectedBooking.booking_reference,
        PLACES: selectedBooking.PLACES,
        datetime: new Date(selectedBooking.start_datetime).toISOString().split('T')[0], // Format date
        START_TIME: new Date(selectedBooking.start_datetime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), // Format time
        PICKUP_LOC: selectedBooking.hotel_pickup,
        package_id: selectedBooking.PID,
        product_name: selectedBooking.title,
        DURATION: selectedBooking.DURATION
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateEndTime = () => {
    const { START_TIME, DURATION } = bookingData;
    if (START_TIME && DURATION) {
      let [startHour, startMinute] = START_TIME.split(":").map(Number);
      const durationHours = Number(DURATION);

      let endHour = (startHour + durationHours) % 24;
      const endTime = `${endHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
      setBookingData((prev) => ({ ...prev, END_TIME: endTime }));
    }
  };

  useEffect(() => {
    calculateEndTime();
    fetchAvailableDrivers(bookingData.datetime, bookingData.START_TIME, bookingData.END_TIME);
    fetchAvailableVehicles(bookingData.datetime, bookingData.START_TIME, bookingData.END_TIME);
  }, [bookingData.START_TIME, bookingData.DURATION]);

  useEffect(() => {
    const loadPackages = async () => {
      const fetchedPackages = await fetchPackages();
      setPackages(fetchedPackages || []);
    };
    loadPackages();
  }, []);

  const handleFetchAvailable = async () => {
    const { datetime, START_TIME, END_TIME } = bookingData;
    if (datetime && START_TIME && END_TIME) {
      try {
        const cars = await fetchAvailableVehicles(datetime, START_TIME, END_TIME);
        const drivers = await fetchAvailableDrivers(datetime, START_TIME, END_TIME);
        setAvailableCars(cars || []);
        setAvailableDrivers(drivers || []);
      } catch (error) {
        alert("Error fetching available cars and drivers: " + error.message);
      }
    } else {
      alert("Please provide the date, start time, and end time.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!bookingData.success_id) {
      alert("Please select a booking ID.");
      return;
    }
  
    // Format the data to match the required JSON structure
    const submissionData = {
      BR: bookingData.success_id, // Use the selected booking reference
      START_TIME: bookingData.START_TIME,
      PICKUP_LOC: bookingData.PICKUP_LOC,
      CAR_ID: bookingData.CAR_ID,
      USER_ID: bookingData.user_id,
      BOOK_NO: bookingData.BOOK_NO,
      DATE: bookingData.datetime,
      NO_OF_PASSENGER: bookingData.capacity,
      PACKAGE_ID: bookingData.package_id,
      DROP_LOC: bookingData.PLACES,
      AC_NONAC: bookingData.AC_NONAC,
      END_TIME: bookingData.END_TIME,
      DRIVER_ID: bookingData.DRIVER_ID,
      MOBILE_NO: bookingData.mobile_no,
    };
  
    console.log("Submitting booking data:", submissionData);
  
    // Send the data to the API
    const result = await createAdvancedBooking(submissionData);
    if (result.success) {
      alert("Booking created successfully!");
      setShowCreateForm(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto h-[55vh]">
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Select Booking</label>
        <select
          name="success_id"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.success_id}
          onChange={handleSuccessIdChange}
          required
        >
          <option value="">Select Booking ID</option>
          {tripAdvisorBooking.map((booking) => (
            <option key={booking.booking_reference} value={booking.booking_reference}>
              {booking.booking_reference} - {booking.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">User ID</label>
        <input type="text" name="user_id" className="mt-2 w-full p-2 border border-gray-300 rounded-md" value={bookingData.user_id} onChange={handleChange} readOnly />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Mobile Number</label>
        <input type="text" name="mobile_no" className="mt-2 w-full p-2 border border-gray-300 rounded-md" value={bookingData.mobile_no} onChange={handleChange} readOnly />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Package Name</label>
        <input type="text" name="product_name" className="mt-2 w-full p-2 border border-gray-300 rounded-md" value={bookingData.product_name} onChange={handleChange} readOnly />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Drop Location</label>
        <input
          type="text"
          name="DROP_LOC"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.PLACES}
          onChange={handleChange}
          readOnly
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">NO_OF_PASSENGER</label>
        <input type="text" name="capacity" className="mt-2 w-full p-2 border border-gray-300 rounded-md" onChange={handleChange} value={bookingData.capacity} readOnly />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Package</label>
        <select
          name="package_id"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          onChange={handleChange}
          value={bookingData.package_id}
          readOnly
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
        <label className="block text-gray-700 dark:text-gray-200">Pickup Location</label>
        <input
          type="text"
          name="PICKUP_LOC"
          onChange={handleChange}
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.PICKUP_LOC}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">AC/Non-AC</label>
        <select
          name="AC_NONAC"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          onChange={handleChange}
          value={bookingData.AC_NONAC}
          required
        >
          <option value="">Select</option>
          <option value="ac">AC</option>
          <option value="nonac">Non-AC</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">START TIME</label>
        <input
          type="time"
          name="START_TIME"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.START_TIME}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">DATE</label>
        <input
          type="text"
          name="datetime"
          placeholder="YYYY/MM/DD"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.datetime}
          onChange={handleChange}
          readOnly
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">END TIME</label>
        <input
          type="text"
          name="END_TIME"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          onChange={handleChange}
          value={bookingData.END_TIME}
          readOnly
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
          onChange={handleChange}
          required
        >
          <option value="">Select Car</option>
          {Array.isArray(availableCars) &&
            availableCars.map((car) => (
              <option key={car.CAR_ID} value={car.CAR_ID}>
                {car.MODEL_NAME || "Unknown Model"} (Capacity: {car.SEATING_CAPACITY || "N/A"})
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">Driver</label>
        <select
          name="DRIVER_ID"
          onChange={handleChange}
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          value={bookingData.DRIVER_ID}
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
        <label className="block text-gray-700 dark:text-gray-200">VID</label>
        <input
          type="text"
          name="VID"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          onChange={handleChange}
          value={bookingData.VID}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">BOOK_NO</label>
        <input type="text" name="BOOK_NO" className="mt-2 w-full p-2 border border-gray-300 rounded-md" value={bookingData.BOOK_NO} onChange={handleChange} />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200">STAT</label>
        <input type="text" name="stat" className="mt-2 w-full p-2 border border-gray-300 rounded-md" value={bookingData.stat} onChange={handleChange} />
      </div>

      <div className="mt-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
          Submit Booking
        </button>
      </div>
    </form>
  );
};

export default TripAdvisorForm;