import { useEffect } from "react";
import { useFuel } from "../contexts/FuelContext";
import Heading from "../components/Heading";
import Input from "../components/Input";

// eslint-disable-next-line react/prop-types
export default function Fuel({ title, track }) {
  const { fuelRecords, fetchFuelRecords, acceptFuelRecord, rejectFuelRecord } = useFuel();
  console.log(fuelRecords);
  useEffect(() => {
    fetchFuelRecords();
  }, []);

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[90%] max-xl:mx-auto max-w-screen-full bg-white my-20 dark:bg-gray-800">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="mx-4 text-3xl font-semibold">{title}</h2>
          <AddButton />
        </div>
        <Input title={title} />
        <TableManage fuelRecords={fuelRecords} acceptFuelRecord={acceptFuelRecord} rejectFuelRecord={rejectFuelRecord} />
      </div>
    </div>
  );
}

function AddButton() {
  return (
    <a className="group cursor-pointer outline-none hover:rotate-90 duration-300 mx-3" title="Add New">
      <svg
        className="stroke-black dark:stroke-white fill-none group-active:stroke-black group-active:fill-black group-active:duration-0 duration-300"
        viewBox="0 0 24 24"
        height="50px"
        width="50px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeWidth="1.5" d="M8 12H16"></path>
        <path strokeWidth="1.5" d="M12 16V8"></path>
      </svg>
    </a>
  );
}

function TableManage({ fuelRecords, acceptFuelRecord, rejectFuelRecord }) {
  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Car ID</th>
            <th scope="col" className="px-6 py-3">Driver ID</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Cost</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fuelRecords.map((record) => (
            <tr key={record.F_ID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-4">{record.CAR_ID}</td>
              <td className="px-6 py-4">{record.DRIVER_ID}</td>
              <td className="px-6 py-4">{record.DATE}</td>
              <td className="px-6 py-4">${record.COST}</td>
              <td className="px-6 py-4">{record.stat}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => acceptFuelRecord(record.F_ID)} className="text-green-600 hover:underline px-2">
                  Accept
                </button>
                <button onClick={() => rejectFuelRecord(record.F_ID)} className="text-red-600 hover:underline px-2">
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
