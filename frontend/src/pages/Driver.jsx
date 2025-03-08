/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import { useDrivers } from "../contexts/DriverContext";
import Toast from "../components/Toast";

// eslint-disable-next-line react/prop-types
export default function Driver({ title, track }) {
  const { drivers, fetchDrivers, deleteDriver, updateDriver, addDriver } =
    useDrivers();
  const [editingDriver, setEditingDriver] = useState(null); // Tracks the driver being edited
  const [showCreateForm, setShowCreateForm] = useState(false); // Tracks Create Form visibility
  const [searchQuery, setSearchQuery] = useState(""); // Tracks search input
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Add this useEffect to monitor toast state changes
  useEffect(() => {
    console.log("Toast state changed:", toast);
  }, [toast]);

  const filteredDrivers = drivers.filter(
    (driver) =>
      (driver.NAME &&
        driver.NAME.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (driver.EMAIL_ID &&
        driver.EMAIL_ID.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (driver.LICENSE_NO &&
        driver.LICENSE_NO.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (driver.GENDER &&
        driver.GENDER.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  useEffect(() => {
    fetchDrivers();
  }, []);

  const showToast = (message, type = "success") => {
    console.log("Showing toast:", message, type); // Debug log
    setToast({ show: true, message, type });
    setTimeout(() => {
      console.log("Hiding toast"); // Debug log
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleAddDriver = async (data) => {
    try {
      await addDriver(data);
      showToast("Driver added successfully");
      setShowCreateForm(false); // Close the form after successful addition
    } catch (error) {
      showToast(error.message || "Failed to add driver", "error");
    }
  };

  const handleUpdateDriver = async (data) => {
    try {
      await updateDriver(data);
      showToast("Driver updated successfully");
      setEditingDriver(null); // Close the form after successful update
    } catch (error) {
      showToast(error.message || "Failed to update driver", "error");
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      const res = confirm("Are you sure you want to delete this driver?");
      if(res){
      await deleteDriver(id);
      }
      console.log("Delete successful, showing toast"); // Debug log
      showToast("Driver deleted successfully");
    } catch (error) {
      console.log("Delete failed, showing error toast"); // Debug log
      showToast(error.message || "Failed to delete driver", "error");
    }
  };

  return (
    <div className="relative">
      {" "}
      {/* Add relative positioning */}
      <Heading title={title} track={track} />
      {/* Move toast right after Heading */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {
            console.log("Toast closed manually"); // Debug log
            setToast({ show: false, message: "", type: "success" });
          }}
        />
      )}
      <div className="xl:max-w-[90%] max-xl:mx-auto max-w-screen-full bg-white my-20 dark:bg-gray-800">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="mx-4 text-3xl font-semibold">{title}</h2>
          <AddButton
            setShowCreateForm={setShowCreateForm}
            showCreateForm={showCreateForm}
          />
        </div>

        <Input
          title={title}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Render Create Form */}
        {showCreateForm && (
          <CreateForm
            addDriver={handleAddDriver}
            setShowCreateForm={setShowCreateForm}
          />
        )}

        {/* Render Vehicle Table */}
        <TableManage
          drivers={filteredDrivers} // Pass filtered Drivers
          setEditingDriver={setEditingDriver}
          deleteDriver={handleDeleteDriver}
        />

        {/* Render Edit Form */}
        {editingDriver && (
          <EditForm
            driver={editingDriver}
            updateDriver={handleUpdateDriver}
            setEditingDriver={setEditingDriver}
          />
        )}
      </div>
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

// Admin Table Component
// eslint-disable-next-line react/prop-types
function TableManage({ drivers = [], setEditingDriver, deleteDriver }) {
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
            <th className="px-6 py-3">DRIVER_ID</th>
            <th className="px-6 py-3">NAME</th>
            <th className="px-6 py-3">EMAIL_ID</th>
            <th className="px-6 py-3">LICENSE_NO</th>
            <th className="px-6 py-3">GENDER</th>
            <th className="px-6 py-3">DOCUMENTS</th>
            <th className="px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {drivers.length > 0 ? (
            drivers.map((driver) => (
              <tr
                key={driver.DRIVER_ID}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{driver.DRIVER_ID}</td>
                <td className="px-6 py-4">{driver.NAME}</td>
                <td className="px-6 py-4">{driver.EMAIL_ID}</td>
                <td className="px-6 py-4">{driver.LICENSE_NO}</td>
                <td className="px-6 py-4">{driver.GENDER}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => openModal(`http://localhost:3000/admin/img/driver-view/${driver.DRIVER_ID}/adharcard`)}
                  >
                    View Aadhaar
                  </button>
                  <button
                    className="font-medium text-green-600 dark:text-green-500 hover:underline"
                    onClick={() => openModal(`http://localhost:3000/admin/img/driver-view/${driver.DRIVER_ID}/pancard`)}
                  >
                    View PAN
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1"
                    onClick={() => setEditingDriver(driver)}
                  >
                    Edit
                  </button>
                  <button
                    className="font-medium text-red-600 dark:text-red-500 hover:underline pl-1"
                    onClick={() => deleteDriver(driver.DRIVER_ID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No drivers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
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
        Identity Document
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

import imageCompression from "browser-image-compression";

function CreateForm({ addDriver, setShowCreateForm }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    license_no: "",
    gender: "",
    adharcard: null,
    pancard: null,
    phone_no: null,
  });

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, // Maximum size in MB
      maxWidthOrHeight: 1024, // Maximum width or height
      useWebWorker: true, // Use web worker for better performance
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return file; // Return original file if compression fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compress images before submitting
    const compressedAdharcard = formData.adharcard
      ? await compressImage(formData.adharcard)
      : null;
    const compressedPancard = formData.pancard
      ? await compressImage(formData.pancard)
      : null;

    // Create a new FormData object
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("license_no", formData.license_no);
    data.append("gender", formData.gender);
    data.append("phone_no", formData.phone_no);
    if (compressedAdharcard) data.append("adharcard", compressedAdharcard);
    if (compressedPancard) data.append("pancard", compressedPancard);

    // Call the addDriver function with the compressed data
    addDriver(data);

    // Reset form and close
    setFormData({
      name: "",
      email: "",
      password: "",
      license_no: "",
      gender: "",
      adharcard: null,
      pancard: null,
      phone_no: null,
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
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Create Driver
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              License no
            </label>
            <input
              type="number"
              value={formData.license_no}
              onChange={(e) =>
                setFormData({ ...formData, license_no: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <input
              type="text"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_no"
              placeholder="Phone Number"
              value={formData.phone_no}
              onChange={(e) =>
                setFormData({ ...formData, phone_no: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>

          {/* Aadhaar Card Upload */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Aadhaar Card
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, adharcard: e.target.files[0] })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* PAN Card Upload */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              PAN Card
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, pancard: e.target.files[0] })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />
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
function EditForm({ driver, updateDriver, setEditingDriver }) {
  const [formData, setFormData] = useState({
    driverId: driver.DRIVER_ID,
    name: driver.NAME,
    email: driver.EMAIL_ID,
    license_no: driver.LICENSE_NO,
    gender: driver.GENDER,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDriver({
      DRIVER_ID: driver.DRIVER_ID,
      NAME: formData.name,
      EMAIL_ID: formData.email,
      LICENSE_NO: formData.license_no,
      GENDER: formData.gender,
    });
    setEditingDriver(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
        <button
          onClick={() => setEditingDriver(null)}
          className="absolute top-4 right-4 text-black dark:text-white"
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Edit Admin
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Car ID
            </label>
            <input
              type="text"
              value={formData.driverId}
              onChange={(e) =>
                setFormData({ ...formData, driverId: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              License no
            </label>
            <input
              type="number"
              value={formData.license_no}
              onChange={(e) =>
                setFormData({ ...formData, license_no: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <input
              type="text"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            {/* <label className="block mb-1 text-gray-700 dark:text-gray-300">Password (optional)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            /> */}
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
            onClick={() => setEditingDriver(null)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
