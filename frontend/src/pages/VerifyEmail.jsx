import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setStatus(res.data.message || "Email Verified Successfully ✅");
        setSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (error) {
      setStatus(
        error.response?.data?.message || "Verification Failed ❌"
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-md text-center">

        {/* 🔄 Loader */}
        {loading && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-600">
              Verifying your email...
            </h2>
          </>
        )}

        {/* ✅ Success */}
        {!loading && success && (
          <>
            <div className="text-green-500 text-5xl mb-4">✔</div>
            <h2 className="text-xl font-semibold text-gray-700">
              {status}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login...
            </p>
          </>
        )}

        {/* ❌ Error */}
        {!loading && !success && (
          <>
            <div className="text-red-500 text-5xl mb-4">✖</div>
            <h2 className="text-xl font-semibold text-gray-700">
              {status}
            </h2>

            <button
              onClick={() => navigate("/signup")}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Go to Signup
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;