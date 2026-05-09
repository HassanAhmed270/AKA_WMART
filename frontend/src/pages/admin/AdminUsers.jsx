import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import userLogo from "../../assets/userLogo.png";
import LoaderScreen from '../../components/LoaderScreen';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const navigate = useNavigate();

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // GET USERS
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setUsers(res.data.users);
        setFilteredList(res.data.users);

        setToast({
          open: true,
          message: "Users fetched successfully ✅",
          severity: "success"
        });
      }

    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Users not found ❌",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // CONVERT TO WORKER
  const convertToWorker = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/convert-to-worker/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "User converted to worker successfully ✅",
          severity: "success"
        });
        getAllUsers(); // Refresh the list
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to convert user ❌",
        severity: "error"
      });
    }
  };

  // REMOVE WORKER ROLE
  const removeWorkerRole = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/remove-worker-role/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "Worker role removed successfully ✅",
          severity: "success"
        });
        getAllUsers(); // Refresh the list
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to remove worker role ❌",
        severity: "error"
      });
    }
  };

  // DELETE USER
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "User deleted successfully ✅",
          severity: "success"
        });
        getAllUsers(); // Refresh the list
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to delete user ❌",
        severity: "error"
      });
    }
  };

  if (loading) return <LoaderScreen />;

  return (
    <div className="
      min-h-screen
      bg-[var(--color-background)]
      text-[var(--color-text)]
      px-4 sm:px-6 lg:px-10
      pt-6 md:pt-28
      flex
    ">

      {/* MAIN CONTENT (takes full remaining width on md+) */}
      <div className="flex-1 w-full ">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold">
          User Management
        </h1>

        <p className="text-sm opacity-70 mt-1">
          View and manage registered users
        </p>

        {/* SEARCH */}
        <div className="relative mt-6 w-full sm:w-[300px]">
          <input
            type="text"
            placeholder="Search Users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              p-2 pl-3 pr-10
              rounded-lg
              bg-white/10
              backdrop-blur-md
              border border-white/20
              outline-none
            "
          />
          <FaMagnifyingGlass className="absolute right-3 top-3 opacity-60" />
        </div>

        {/* USERS GRID */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
          mt-8
        ">

          {(filteredList.length ? filteredList : users).map((user) => (
            <div
              key={user._id}
              className="
                bg-white/10
                backdrop-blur-md
                border border-white/20
                rounded-xl
                p-5
                shadow-md
                hover:scale-[1.01]
                transition
              "
            >

              {/* USER INFO */}
              <div className="flex gap-4 items-center">

                <img
                  src={user?.profilePic || userLogo}
                  alt="user"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-xs opacity-70 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs opacity-70 truncate">
                    Role: {user.role}
                  </p>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-2 mt-4">

                <button
                  onClick={() => navigate(`/dashboard/users/${user._id}`)}
                  className="
                    flex items-center gap-1
                    px-3 py-1
                    rounded-lg
                    bg-[var(--color-primary)]
                    text-white
                    text-sm
                  "
                >
                  <MdEdit />
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/dashboard/users/orders/${user._id}`)}
                  className="
                    flex items-center gap-1
                    px-3 py-1
                    rounded-lg
                    bg-black
                    text-white
                    text-sm
                  "
                >
                  <IoEyeSharp />
                  Orders
                </button>

                {user.role === 'user' && (
                  <button
                    onClick={() => convertToWorker(user._id)}
                    className="
                      flex items-center gap-1
                      px-3 py-1
                      rounded-lg
                      bg-green-600
                      text-white
                      text-sm
                    "
                  >
                    Make Worker
                  </button>
                )}

                {user.role === 'worker' && (
                  <button
                    onClick={() => removeWorkerRole(user._id)}
                    className="
                      flex items-center gap-1
                      px-3 py-1
                      rounded-lg
                      bg-orange-600
                      text-white
                      text-sm
                    "
                  >
                    Remove Worker
                  </button>
                )}

                <button
                  onClick={() => {
                    if (user.role === "admin") return;
                    deleteUser(user._id);
                  }}
                  disabled={user.role === "admin"}
                  className={`
    flex items-center gap-1
    px-3 py-1
    rounded-lg
    text-white
    text-sm
    transition
    ${user.role === "admin"
                      ? "bg-gray-500 cursor-not-allowed opacity-60"
                      : "bg-red-600 hover:bg-red-700"
                    }
  `}
                >
                  <MdDelete />
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* TOAST */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast({ ...toast, open: false })}
          >
            {toast.message}
          </Alert>
        </Snackbar>

      </div>
    </div>
  );
};

export default AdminUsers;