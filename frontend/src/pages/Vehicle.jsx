/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import { useVehicle } from "../contexts/VehicleContext"; // assuming useVehicle context is created for vehicle management

// Vehicle Component
export default function Vehicle({ title, track }) {
  const { vehicles, fetchVehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicle();
  const [editingVehicle, setEditingVehicle] = useState(null); // Tracks the vehicle being edited
  const [showCreateForm, setShowCreateForm] = useState(false); // Tracks Create Form visibility
  const [searchQuery, setSearchQuery] = useState(''); // Tracks search input

  const filteredVehicles = vehicles.filter((vehicle) =>
    (vehicle.MODEL_NAME && vehicle.MODEL_NAME.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vehicle.COMPANY_NAME && vehicle.COMPANY_NAME.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vehicle.CAR_NO && vehicle.CAR_NO.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vehicle.CAR_TYPE && vehicle.CAR_TYPE.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vehicle.COLOR && vehicle.COLOR.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vehicle.SEATING_CAPACITY && vehicle.SEATING_CAPACITY.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vehicle.STATUS && vehicle.STATUS.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[90%] max-xl:mx-auto max-w-screen-full bg-white my-20 dark:bg-gray-800">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="mx-4 text-3xl font-semibold">{title}</h2>
          <AddButton setShowCreateForm={setShowCreateForm} showCreateForm={showCreateForm} />
        </div>

        <Input title={title} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Render Create Form */}
        {showCreateForm && <CreateForm addVehicle={addVehicle} setShowCreateForm={setShowCreateForm} />}
        
        {/* Render Vehicle Table */}
        <TableManage
          vehicles={filteredVehicles}  // Pass filtered vehicles
          setEditingVehicle={setEditingVehicle}
          deleteVehicle={deleteVehicle}
        />

        {/* Render Edit Form */}
        {editingVehicle && (
          <EditForm
            vehicle={editingVehicle}
            updateVehicle={updateVehicle}
            setEditingVehicle={setEditingVehicle}
          />
        )}
      </div>
    </div>
  );
}

// Add Button Component
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
// Vehicle Table Component
function TableManage({ vehicles, setEditingVehicle, deleteVehicle }) {
  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Car No.</th>
            <th className="px-6 py-3">Model Name</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Color</th>
            <th className="px-6 py-3">Company Name</th>
            <th className="px-6 py-3">Seating Capacity</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr key={vehicle.CAR_ID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{vehicle.CAR_ID}</td>
                <td className="px-6 py-4">{vehicle.CAR_NO}</td>
                <td className="px-6 py-4">{vehicle.MODEL_NAME}</td>
                <td className="px-6 py-4">{vehicle.CAR_TYPE}</td>
                <td className="px-6 py-4">{vehicle.COLOR}</td>
                <td className="px-6 py-4">{vehicle.COMPANY_NAME}</td>
                <td className="px-6 py-4">{vehicle.SEATING_CAPACITY}</td>
                <td className="px-6 py-4">{vehicle.STATUS}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1"
                    onClick={() => setEditingVehicle(vehicle)}
                  >
                    Edit
                  </button>
                  <button
                    className="font-medium text-red-600 dark:text-red-500 hover:underline pl-1"
                    onClick={() => deleteVehicle(vehicle.CAR_ID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4">No vehicles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


// Create Form Component in Modal
function CreateForm({ addVehicle, setShowCreateForm }) {
  const [formData, setFormData] = useState({
    CAR_NO: "",
    CAR_TYPE: "",
    MODEL_NAME: "",
    COLOR: "",
    COMPANY_NAME: "",
    SEATING_CAPACITY: "",
    STATUS: "AVAILABLE", // Default status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addVehicle(formData);
    setFormData({
      CAR_NO: "",
      CAR_TYPE: "",
      MODEL_NAME: "",
      COLOR: "",
      COMPANY_NAME: "",
      SEATING_CAPACITY: "",
      STATUS: "AVAILABLE",
    });
    setShowCreateForm(false);
  };

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
      <button
        onClick={() => setShowCreateForm(false)}
        className="absolute top-4 right-4 text-black dark:text-white text-2xl"
      >
        &times;
      </button>
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Create Vehicle</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Car No.</label>
          <input
            type="text"
            value={formData.CAR_NO}
            onChange={(e) => setFormData({ ...formData, CAR_NO: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Car Type</label>
          <input
            type="text"
            value={formData.CAR_TYPE}
            onChange={(e) => setFormData({ ...formData, CAR_TYPE: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Model Name</label>
          <input
            type="text"
            value={formData.MODEL_NAME}
            onChange={(e) => setFormData({ ...formData, MODEL_NAME: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Color</label>
          <input
            type="text"
            value={formData.COLOR}
            onChange={(e) => setFormData({ ...formData, COLOR: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Company Name</label>
          <input
            type="text"
            value={formData.COMPANY_NAME}
            onChange={(e) => setFormData({ ...formData, COMPANY_NAME: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Seating Capacity</label>
          <input
            type="number"
            value={formData.SEATING_CAPACITY}
            onChange={(e) => setFormData({ ...formData, SEATING_CAPACITY: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Status</label>
          <select
            value={formData.STATUS}
            onChange={(e) => setFormData({ ...formData, STATUS: e.target.value })}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            required
          >
            <option value="AVAILABLE">Available</option>
            <option value="REPAIR">Repair</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Create
        </button>
      </form>
    </div>
  </div>
);

}

// Edit Form Component in Modal
function EditForm({ vehicle, updateVehicle, setEditingVehicle }) {
  const [formData, setFormData] = useState({
    carId: vehicle.CAR_ID,
    carNo: vehicle.CAR_NO,
    carType: vehicle.CAR_TYPE,
    modelName: vehicle.MODEL_NAME,
    color: vehicle.COLOR,
    companyName: vehicle.COMPANY_NAME,
    seatingCapacity: vehicle.SEATING_CAPACITY,
    status: vehicle.STATUS,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedVehicle = {
      CAR_ID: vehicle.CAR_ID, // Ensure this is the correct ID for update
      CAR_NO: formData.carNo,
      CAR_TYPE: formData.carType,
      MODEL_NAME: formData.modelName,
      COLOR: formData.color,
      COMPANY_NAME: formData.companyName,
      SEATING_CAPACITY: formData.seatingCapacity,
      STATUS: formData.status,
    };
    updateVehicle(updatedVehicle);
    setEditingVehicle(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
        <button
          onClick={() => setEditingVehicle(null)}
          className="absolute top-4 right-4 text-black dark:text-white"
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Edit Vehicle</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Car ID</label>
            <input
              type="text"
              value={formData.carId}
              onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Car No.</label>
            <input
              type="text"
              value={formData.carNo}
              onChange={(e) => setFormData({ ...formData, carNo: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Car Type</label>
            <input
              type="text"
              value={formData.carType}
              onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Model Name</label>
            <input
              type="text"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Seating Capacity</label>
            <input
              type="number"
              value={formData.seatingCapacity}
              onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Status</label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
          >
            Update
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded ml-2 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
            onClick={() => setEditingVehicle(null)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
  
}
