import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Dialog, DialogContent } from "@mui/material";

const Payment = () => {

    const navigate = useNavigate();

    const [method, setMethod] = useState(null);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [status, setStatus] = useState("select");

    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const [dialog, setDialog] = useState({
        open: false,
        type: ""
    });

    const orderId = localStorage.getItem("paymentOrderId");
    const token = localStorage.getItem("accessToken");

    // ⏳ TIMER
    useEffect(() => {
        let interval;

        if (status === "processing") {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [status]);

    // 🟢 COD FLOW
    const handleCOD = async () => {

        setMethod("cod");
        setStatus("pending");
        setLoading(true);

        setToast({
            open: true,
            message: "COD Order Placed (Pending Status)",
            severity: "info"
        });

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/orders/verify`,
                {
                    paymentOrderId: orderId,
                    paymentTransactionId: "COD_" + Date.now(),
                    paymentSignature: "cod",
                    paymentFailed: false,
                    paymentMethod: "COD"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        } catch (err) {
            console.log(err);
        }

        setLoading(false);

        setTimeout(() => {
            navigate("/products");
        }, 2000);
    };

    // 🟢 START JAZZCASH
    const startJazzCash = () => {
        setMethod("jazzcash");
        setStatus("processing");
        setTimer(60);

        setToast({
            open: true,
            message: "JazzCash OTP Sent (Demo: 1234)",
            severity: "info"
        });
    };

    // 🟢 VERIFY OTP (PAID / FAILED)
    const verifyOtp = async () => {

        if (loading) return;
        setLoading(true);

        try {

            if (otp === "1234") {

                await axios.post(
                    `${import.meta.env.VITE_API_URL}/orders/verify`,
                    {
                        paymentOrderId: orderId,
                        paymentTransactionId: "TXN_" + Date.now(),
                        paymentSignature: "demo_signature",
                        paymentFailed: false
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                setDialog({ open: true, type: "success" });

                setToast({
                    open: true,
                    message: "Payment Successful 🎉",
                    severity: "success"
                });

                setTimeout(() => {
                    navigate("/products");
                }, 2000);

            } else {

                await axios.post(
                    `${import.meta.env.VITE_API_URL}/orders/verify`,
                    {
                        paymentOrderId: orderId,
                        paymentTransactionId: "FAILED_" + Date.now(),
                        paymentSignature: "invalid",
                        paymentFailed: true
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDialog({ open: true, type: "fail" });

                setToast({
                    open: true,
                    message: "Payment Failed ❌",
                    severity: "error"
                });
            }

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-[420px] bg-white p-6 rounded-xl shadow-lg">

                <h1 className="text-2xl font-bold mb-4">Payment Method</h1>

                {/* JAZZ LOGO */}
                <img
                    src="data:image/png;base64,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"
                    className="w-full h-20 object-contain mb-4"
                />

                {/* SELECT */}
                {status === "select" && (
                    <>
                        <button
                            onClick={startJazzCash}
                            className="w-full bg-pink-600 text-white py-2 rounded-lg mb-3"
                        >
                            Pay with JazzCash
                        </button>

                        <button
                            onClick={handleCOD}
                            className="w-full bg-black text-white py-2 rounded-lg"
                        >
                            Cash on Delivery
                        </button>
                    </>
                )}

                {/* OTP STEP */}
                {status === "processing" && (
                    <div className="space-y-3 text-center">

                        <p>Enter OTP (Demo: 1234)</p>

                        <p className="text-red-500">
                            Timer: {timer}s
                        </p>

                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="Enter OTP"
                        />

                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded"
                        >
                            Verify OTP
                        </button>
                    </div>
                )}

                {/* COD STATUS */}
                {status === "pending" && method === "cod" && (
                    <h2 className="text-green-600 text-center font-bold">
                        COD Order Pending
                    </h2>
                )}

            </div>

            {/* DIALOG */}
            <Dialog open={dialog.open}>
                <DialogContent className="p-6 text-center">

                    {dialog.type === "success" ? (
                        <h2 className="text-green-600 text-xl font-bold">
                            Payment Successful 🎉
                        </h2>
                    ) : (
                        <h2 className="text-red-600 text-xl font-bold">
                            Payment Failed ❌
                        </h2>
                    )}

                </DialogContent>
            </Dialog>

            {/* TOAST */}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default Payment;