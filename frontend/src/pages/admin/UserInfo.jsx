import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserInfo = () => {

  const { userId } = useParams();
  const navigate = useNavigate();

  const [updateUser, setUpdateUser] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempRole, setTempRole] = useState("");

  const getUserDetails = async () => {
    if (!userId) return;

    try {
            const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/get-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      if (res.data.success) {
        setUpdateUser(res.data.user);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) getUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile)
    });
  };

  const handleRoleChange = (role) => {
    if (role !== updateUser.role) {
      setTempRole(role);
      setShowConfirm(true);
    }
  };

  const confirmRoleChange = () => {
    setUpdateUser({
      ...updateUser,
      role: tempRole
    });
    setShowConfirm(false);
  };

  const cancelRoleChange = () => {
    setShowConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("address", updateUser.address);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) formData.append("file", file);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        alert("User Updated Successfully ✅");

        setTimeout(() => {
          navigate(-1);
        }, 1000);
      }

    } catch (error) {
      alert("Update Failed ❌");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] px-4 sm:px-6 lg:px-10 py-10">

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-6 md:p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <button onClick={() => navigate(-1)} className="text-lg">
            <FaArrowLeft />
          </button>

          <h1 className="text-lg sm:text-2xl font-bold text-center flex-1">
            Update User
          </h1>

          <div className="w-5"></div>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="flex flex-col items-center gap-4">

            <img
              src={updateUser?.profilePic}
              alt=""
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-pink-600"
            />

            <label className="cursor-pointer bg-pink-600 px-5 py-2 rounded-lg text-white text-sm">

              {loading ? (
                <span className="flex items-center gap-2">
                  <LuLoaderCircle className="animate-spin" />
                  Uploading...
                </span>
              ) : "Upload Image"}

              <input type="file" onChange={handleFileChange} className="hidden" />

            </label>

          </div>

          {/* RIGHT */}
          <div className="space-y-3">

            <input
              type="text"
              name="firstName"
              value={updateUser.firstName || ""}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none"
            />

            <input
              type="text"
              name="lastName"
              value={updateUser.lastName || ""}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none"
            />

            <input
              type="email"
              name="email"
              value={updateUser.email || ""}
              disabled
              className="w-full p-2 rounded-lg bg-white/20 border border-white/10 outline-none"
            />

            <input
              type="text"
              name="phoneNo"
              value={updateUser.phoneNo || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none"
            />

            <input
              type="text"
              name="address"
              value={updateUser.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none"
            />

            <input
              type="text"
              name="city"
              value={updateUser.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none"
            />

            <input
              type="text"
              name="zipCode"
              value={updateUser.zipCode || ""}
              onChange={handleChange}
              placeholder="Zip Code"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/10 outline-none"
            />

            {/* ROLE */}
            <div>
              <p className="font-semibold mb-2">Role</p>

              <div className="flex gap-4 text-sm">

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={updateUser.role === "user"}
                    onChange={() => handleRoleChange("user")}
                  />
                  User
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={updateUser.role === "admin"}
                    onChange={() => handleRoleChange("admin")}
                  />
                  Admin
                </label>

              </div>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white transition ${
                loading ? "bg-pink-400" : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {loading ? "Updating..." : "Update User"}
            </button>

          </div>

        </form>

      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">

          <div className="bg-white p-5 rounded-lg w-full max-w-sm text-center">

            <h2 className="font-bold text-lg mb-2">Confirm Role Change</h2>

            <p>Change role to <b>{tempRole}</b>?</p>

            <div className="flex justify-center gap-4 mt-4">

              <button
                onClick={confirmRoleChange}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Yes
              </button>

              <button
                onClick={cancelRoleChange}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default UserInfo;