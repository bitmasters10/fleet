import { useEffect , useState} from "react";
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
         
        </div>
        <Input title={title} />
        <TableManage fuelRecords={fuelRecords} acceptFuelRecord={acceptFuelRecord} rejectFuelRecord={rejectFuelRecord} />
      </div>
    </div>
  );
}


// eslint-disable-next-line react/prop-types
function TableManage({ fuelRecords, acceptFuelRecord, rejectFuelRecord }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
  
    const openModal = (docName) => {
      setSelectedDoc(docName);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedDoc(null);
    };
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
                <div className="flex space-x-2">
                <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => openModal(`https://fleet-eyad.onrender.com/admin/img/fuel-view/${record.F_ID}`)}
                  >
                    View
                  </button>
                  <button onClick={() => acceptFuelRecord(record.F_ID)} className="text-green-600 hover:underline px-2">
                    Accept
                  </button>
                  <button onClick={() => rejectFuelRecord(record.F_ID)} className="text-red-600 hover:underline px-2">
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
      {/* Close (X) Button */}
      <button
        className="absolute top-5.5 right-5  text-gray-600 dark:text-gray-300 text-2xl"
        onClick={closeModal}
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">
        Bill
      </h2>
      <img
        src={selectedDoc}
        alt="Identity Document"
        className="w-full h-auto rounded"
      />
    </div>
  </div>
)}
    </div>
  );
}
