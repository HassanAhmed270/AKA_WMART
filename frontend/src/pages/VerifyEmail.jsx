import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page since verification is now handled via backend
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification
          </h2>
          <p className="text-gray-600">
            Please check your email and click the verification link.
            You will be redirected to login...
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
          