import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tabs from '../components/Tabs';
import { useSelector, useDispatch } from 'react-redux';
import userLogo from "../assets/userLogo.png";
import axios from 'axios';
import { setUser } from '../redux/userSlice';
import { Snackbar, Alert } from "@mui/material";

const Profile = () => {

  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(store => store.user);

  const [userOrder, setUserOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const buildUserForm = (nextUser) => ({
    firstName: nextUser?.firstName || "",
    lastName: nextUser?.lastName || "",
    email: nextUser?.email || "",
    phoneNo: nextUser?.phoneNo || "",
    address: nextUser?.address || "",
    city: nextUser?.city || "",
    zipCode: nextUser?.zipCode || "",
    profilePic: nextUser?.profilePic || "",
    role: nextUser?.role || ""
  });

  const [updateUser, setUpdateUser] = useState(() => buildUserForm(user));

  const getUserOrders = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/get-my-order`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setUserOrder(res.data);
      }

    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getUserOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, [getUserOrders]);

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const previewURL = URL.createObjectURL(selectedFile);

    setUpdateUser({
      ...updateUser,
      profilePic: previewURL
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

            Object.keys(updateUser).forEach(key => {
        if (key === "role") return;
        formData.append(key, updateUser[key]);
      });

      if (file) {
        formData.append("file", file);
      }

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
        dispatch(setUser(res.data.user));

        setToastState({
          open: true,
          message: "Profile Updated Successfully",
          severity: "success"
        });

        setTimeout(() => navigate("/"), 1200);
      }

    } catch (error) {
      setToastState({
        open: true,
        message: error.response?.data?.message || "Update Failed",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PAGE WRAPPER */}
      <div className="pt-20 min-h-screen bg-[var(--color-background)] px-3 md:px-6">

        <div className="max-w-7xl mx-auto">

          {/* RESPONSIVE CARD WRAPPER */}
          <div className="bg-white/5 dark:bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3 md:p-6">

            <Tabs
              profilePic={updateUser.profilePic || userLogo}
              handleFileChange={handleFileChange}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              updateUser={updateUser}
              loading={loading}
              userOrder={userOrder}
              setUserOrder={setUserOrder}
            />

          </div>

        </div>

      </div>

      {/* TOAST */}
      <Snackbar
        open={toastState.open}
        autoHideDuration={3000}
        onClose={() => setToastState({ ...toastState, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toastState.severity}
          variant="filled"
          onClose={() => setToastState({ ...toastState, open: false })}
        >
          {toastState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;