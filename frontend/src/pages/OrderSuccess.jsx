import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import axios from 'axios';
import { Snackbar, Alert } from "@mui/material";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const inquireOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");

            await axios.post(
                `${import.meta.env.VITE_API_URL}/orders/inquire`,
                { orderId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setToast({
                open: true,
                message: "Inquiry sent to admin. They will respond via email.",
                severity: "success"
            });
        } catch (error) {
            setToast({
                open: true,
                message: "Failed to send inquiry",
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-[420px] bg-white rounded-2xl shadow-lg p-8 text-center">

                {/* BIG ICON */}
                <div className="flex justify-center mb-6">
                    <FaCheckCircle className="text-green-500 text-7xl animate-pulse" />
                </div>

                {/* TITLE */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Order Created Successfully
                </h1>

                <p className="text-gray-500 mb-6">
                    Your COD order has been placed successfully. We will confirm delivery details shortly.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        Continue Shopping
                    </button>
                    
                    <button
                        onClick={inquireOrder}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Inquire Order"}
                    </button>
                </div>

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
    );
};

export default OrderSuccess;