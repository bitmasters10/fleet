/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/Input";
import { useAdmin } from "../contexts/AdminContext";
import { useAuth } from "../contexts/AuthContext";

// Admin Component
export default function Admin({ title, track }) {
  const {user} = useAuth()
  const { admins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin } = useAdmin();
  const [editingAdmin, setEditingAdmin] = useState(null); // Tracks the admin being edited
  const [showCreateForm, setShowCreateForm] = useState(false); // Tracks Create Form visibility
  const [searchQuery, setSearchQuery] = useState('');
 
  const filteredAdmins = admins.filter((admin) =>
    admin.aname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
    
  useEffect(() => {
    fetchAdmins();
  }, []);
  if (user?.role !== 'superadmin') {
    return <div>You are not authorized to manage admins.</div>;
  }
  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[90%] max-xl:mx-auto max-w-screen-full bg-white my-20 dark:bg-gray-800">
      <div className="flex items-center justify-between  px-6 pt-6">
        <h2 className="mx-4 text-3xl font-semibold">{title}</h2>
        <AddButton setShowCreateForm={setShowCreateForm} showCreateForm={showCreateForm}/>
        </div>

        <Input title={title} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {/* Render Create Form */}
        {showCreateForm && <CreateForm addAdmin={addAdmin} setShowCreateForm={setShowCreateForm} />}

        {/* Render Admin Table */}
        <TableManage
        admins={filteredAdmins}  // Pass filtered admins
        setEditingAdmin={setEditingAdmin}
        deleteAdmin={deleteAdmin}
        />

        {/* Render Edit Form */}
        {editingAdmin && (
          <EditForm
            admin={editingAdmin}
            updateAdmin={updateAdmin}
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
  const [formData, setFormData] = useState({ aname: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAdmin(formData);
    setFormData({ aname: "", email: "", password: "" });
    setShowCreateForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-100 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
        <button
          onClick={() => setShowCreateForm(false)}
          className="absolute top-4 right-4 text-black text-2xl dark:text-white"
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4">Create Admin</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={formData.aname}
              onChange={(e) => setFormData({ ...formData, aname: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
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
      <div className="bg-gray-100 p-6 rounded-md shadow-md w-full lg:w-[90%] mx-auto relative">
        <button
          onClick={() => setEditingAdmin(null)}
          className="absolute top-4 right-4 text-black dark:text-white"
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4">Edit Admin</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={formData.aname}
              onChange={(e) => setFormData({ ...formData, aname: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password (optional)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Update
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
            onClick={() => setEditingAdmin(null)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

function AddButton({showCreateForm,setShowCreateForm}){
  return(
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
  )
}