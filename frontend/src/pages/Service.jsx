import { useEffect, useState } from "react";
import { useService } from "../contexts/ServiceContext";
import { useVehicle } from "../contexts/VehicleContext";

import Heading from "../components/Heading";
import Input from "../components/Input";

export default function Service({ title, track }) {
  const {   carHealthRecords,
    loading,
    error,
    fetchCarHealthRecords,
    createCarHealthRecord,
    updateCarHealthRecord,
    deleteCarHealthRecord,} = useService();
    const {sendToRepair} = useVehicle();
const [isRepair, setIsRepair] = useState(false);


    const handleDeleteService = async (id) => {
      try {
        const res = confirm("Are you sure you want to delete this service?");
        if(res){
          await deleteCarHealthRecord(id);

        }
        console.log("Delete successful, showing toast"); // Debug log
      } catch (error) {
        console.log("Delete failed, showing error toast"); // Debug log
      }
    };


    const handleRepair = async (id) => {
      try {
        const res = confirm("Are you sure you want to sent it for repair?");
        if(res){
          await sendToRepair(id);
          setIsRepair(true);

        }
        console.log("Delete successful, showing toast"); // Debug log
      } catch (error) {
        console.log("Delete failed, showing error toast"); // Debug log
      }
    };

  useEffect(() => {
    fetchCarHealthRecords();
  }, []);
console.log(carHealthRecords)
  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[90%] max-xl:mx-auto w-full bg-white my-20 dark:bg-gray-800">
        <h2 className="mx-4 text-3xl font-semibold px-6 pt-6">{title}</h2>
        <Input title={title} />
        {loading ? (
          <p className="text-center py-4">Loading car health records...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : (
          <TableManage data={carHealthRecords} handleDeleteService={handleDeleteService} isRepair={isRepair} handleRepair={handleRepair}/>
        )}
      </div>
    </div>
  );
}

function TableManage({ data = [] , handleDeleteService,handleRepair, isRepair}) {
  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
          <th className="px-6 py-3">HEALTH ID</th>
            <th className="px-6 py-3">CAR ID</th>
            <th className="px-6 py-3">DRIVER ID</th>

            <th className="px-6 py-3">RATING</th>
            <th className="px-6 py-3">LAST MAINTENANCE</th>
            <th className="px-6 py-3">TIME_STAMP</th>
            <th className="px-6 py-3">ISSUES</th>
            <th className="px-6 py-3">DESCRIPTION</th>
            <th className="px-6 py-3">ACTIONS</th>


          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((record) => (
              <tr
                key={record.HEALTH_ID}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{record.HEALTH_ID}</td>
                <td className="px-6 py-4">{record.CAR_ID}</td>
                <td className="px-6 py-4">{record.DRIVER_ID}</td>

                <td className="px-6 py-4">{record.RATING}</td>
                <td className="px-6 py-4">{record.LAST_MAINTENANCE}</td>
                <td className="px-6 py-4">{record.TIME_STAMP}</td>
                <td className="px-6 py-4">{record.MESSAGE}</td>
                <td className="px-6 py-4">{record.DESCRIPTION}</td>



                <td className="px-6 py-4 text-right">
              
                  <button onClick={() => handleDeleteService(record.HEALTH_ID)} className="text-red-600 hover:underline px-2">
                    Delete
                  </button>
                  {!isRepair &&  <button onClick={() => handleRepair(record.HEALTH_ID)} className="text-green-600 hover:underline px-2">
                    Repair
                  </button>}
                  
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No car health records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
