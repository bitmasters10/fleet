import { useEffect } from "react";
import { useTrip } from "../contexts/TripContext";
import Heading from "../components/Heading";
import Input from "../components/Input";

// eslint-disable-next-line react/prop-types
export default function Trip({ title, track }) {
  const { trips, loading, error, fetchTrips } = useTrip();

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[90%] max-xl:mx-auto w-full bg-white my-20 dark:bg-gray-800">
        <h2 className="mx-4 text-3xl font-semibold px-6 pt-6">{title}</h2>
        <Input title={title} />
        {loading ? (
          <p className="text-center py-4">Loading trips...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : (
          <TableManage data={trips} />
        )}
      </div>
    </div>
  );
}



// eslint-disable-next-line react/prop-types
function TableManage({ trips = [] }) {
  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">TRIP_ID</th>
            <th className="px-6 py-3">BOOK_NO</th>
            <th className="px-6 py-3">BOOK_ID</th>
            <th className="px-6 py-3">ROUTE</th>
            <th className="px-6 py-3">START_TIME</th>
            <th className="px-6 py-3">OTP</th>
            <th className="px-6 py-3">STAT</th>
            <th className="px-6 py-3">ROOM_ID</th>
            <th className="px-6 py-3">DATE</th>
            <th className="px-6 py-3">DRIVER_ID</th>
          </tr>
        </thead>
        <tbody>
          {trips.length > 0 ? (
            trips.map((trip) => (
              <tr
                key={trip.TRIP_ID}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{trip.TRIP_ID}</td>
                <td className="px-6 py-4">{trip.BOOK_NO}</td>
                <td className="px-6 py-4">{trip.BOOK_ID}</td>
                <td className="px-6 py-4">{trip.ROUTE}</td>
                <td className="px-6 py-4">{trip.START_TIME}</td>
                <td className="px-6 py-4">{trip.OTP}</td>
                <td className="px-6 py-4">{trip.STAT}</td>
                <td className="px-6 py-4">{trip.ROOM_ID}</td>
                <td className="px-6 py-4">{trip.date}</td>
                <td className="px-6 py-4">{trip.DRIVER_ID}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-4">
                No trips found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}



