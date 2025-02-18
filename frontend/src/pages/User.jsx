/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import { useUsers } from "../contexts/UserContext";
import Toast from "../components/Toast";

// eslint-disable-next-line react/prop-types
export default function Driver({ title, track }) {
  const { users, fetchUsers, addUser } =
  useUsers();

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

  const filteredUsers = users.filter(
    (user) =>
      (user.first_name &&
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.mobile_no &&
        user.mobile_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.sex &&
        user.sex.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => {
    console.log("Showing toast:", message, type); // Debug log
    setToast({ show: true, message, type });
    setTimeout(() => {
      console.log("Hiding toast"); // Debug log
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleAddUser = async (data) => {
    try {
      await addUser(data);
      showToast("User added successfully");
      setShowCreateForm(false); // Close the form after successful addition
    } catch (error) {
      showToast(error.message || "Failed to add driver", "error");
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
            addUser={handleAddUser}
            setShowCreateForm={setShowCreateForm}
          />
        )}

        {/* Render Vehicle Table */}
        <TableManage
          users={filteredUsers} // Pass filtered Drivers
    
        />

        {/* Render Edit Form */}
       
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
function TableManage({ users = []}) {
 

  return (
    <div className="max-lg:relative block overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full lg:max-w-[95%] mx-auto text-sm text-left rtl:text-right mb-9 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">USER_ID</th>
            <th className="px-6 py-3">FNAME</th>
            <th className="px-6 py-3">LNAME</th>
            <th className="px-6 py-3">MOBILE_NO</th>
            <th className="px-6 py-3">GENDER</th>
            <th className="px-6 py-3">EMAIL</th>
            <th className="px-6 py-3">AGE</th>

          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.USER_ID}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.first_name}</td>
                <td className="px-6 py-4">{user.last_name}</td>
                <td className="px-6 py-4">{user.mobile_no}</td>
                <td className="px-6 py-4">{user.sex}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.age}</td>


                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CreateForm({ addUser, setShowCreateForm }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_no: "",
    sex: "",
    email: "",
    password: "",
    age: "",


  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    addUser(formData);
    setFormData({
        first_name: "",
        last_name: "",
        mobile_no: "",
        sex: "",
        email: "",
        password: "",
    age: "",

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
          Create User
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              FName
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              LName
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
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
              Mobile no
            </label>
            <input
              type="number"
              value={formData.mobile_no}
              onChange={(e) =>
                setFormData({ ...formData, mobile_no: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
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
              value={formData.sex}
              onChange={(e) =>
                setFormData({ ...formData, sex: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
             

             
            </label>
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
