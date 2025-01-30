/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import { useAdmin } from "../contexts/AdminContext";
import { useAuth } from "../contexts/AuthContext";
import Toast from "../components/Toast";

// Admin Component
export default function Admin({ title, track }) {
  const { user } = useAuth();
  const { admins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin } =
    useAdmin();
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Add this useEffect to monitor toast state changes
  useEffect(() => {
    console.log("Toast state changed:", toast);
  }, [toast]);

  const showToast = (message, type = "success") => {
    console.log("Showing toast:", message, type);
    setToast({ show: true, message, type });
    setTimeout(() => {
      console.log("Hiding toast");
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.aname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (data) => {
    try {
      await addAdmin(data);
      showToast("Admin added successfully");
      setShowCreateForm(false);
    } catch (error) {
      showToast(error.message || "Failed to add admin", "error");
    }
  };

  const handleUpdateAdmin = async (id, data) => {
    try {
      await updateAdmin(id, data);
      showToast("Admin updated successfully");
      setEditingAdmin(null);
    } catch (error) {
      showToast(error.message || "Failed to update admin", "error");
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await deleteAdmin(id);
      showToast("Admin deleted successfully");
    } catch (error) {
      showToast(error.message || "Failed to delete admin", "error");
    }
  };

  if (user?.role !== "superadmin") {
    return <div>You are not authorized to manage admins.</div>;
  }

  return (
    <div className="relative">
      <Heading title={title} track={track} />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {
            console.log("Toast closed manually");
            setToast({ show: false, message: "", type: "success" });
          }}
        />
      )}
      <div className="xl:max-w-[90%] max-xl:mx-auto max-w-screen-full bg-white my-20 dark:bg-gray-800">
        <div className="flex items-center justify-between  px-6 pt-6">
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
            addAdmin={handleAddAdmin}
            setShowCreateForm={setShowCreateForm}
          />
        )}

        {/* Render Admin Table */}
        <TableManage
          admins={filteredAdmins}
          setEditingAdmin={setEditingAdmin}
          deleteAdmin={handleDeleteAdmin}
        />

        {/* Render Edit Form */}
        {editingAdmin && (
          <EditForm
            admin={editingAdmin}
            updateAdmin={handleUpdateAdmin}
            setEditingAdmin={setEditingAdmin}
          />
        )}
      </div>
    </div>
  );
}

// Admin Table Component
function TableManage({ admins = [], setEditingAdmin, deleteAdmin }) {
  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <tr
                key={admin.aid}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{admin.aid}</td>
                <td className="px-6 py-4">{admin.aname}</td>
                <td className="px-6 py-4">{admin.email}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline px-1"
                    onClick={() => setEditingAdmin(admin)}
                  >
                    Edit
                  </button>
                  <button
                    className="font-medium text-red-600 dark:text-red-500 hover:underline pl-1"
                    onClick={() => deleteAdmin(admin.aid)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No admins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// Create Form Component in Modal
// Create Form Component in Modal
function CreateForm({ addAdmin, setShowCreateForm }) {
  const [formData, setFormData] = useState({
    aname: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAdmin(formData);
    setFormData({ aname: "", email: "", password: "" });
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
          Create Admin
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={formData.aname}
              onChange={(e) =>
                setFormData({ ...formData, aname: e.target.value })
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
function EditForm({ admin, updateAdmin, setEditingAdmin }) {
  const [formData, setFormData] = useState({
    aname: admin.aname,
    email: admin.email,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAdmin(admin.aid, formData);
    setEditingAdmin(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
        <button
          onClick={() => setEditingAdmin(null)}
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
              Name
            </label>
            <input
              type="text"
              value={formData.aname}
              onChange={(e) =>
                setFormData({ ...formData, aname: e.target.value })
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
            onClick={() => setEditingAdmin(null)}
          >
            Cancel
          </button>
        </form>
      </div>
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
        className="stroke-black dark:stroke-white fill-none  group-active:stroke-black group-active:fill-black group-active:duration-0 duration-300"
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
