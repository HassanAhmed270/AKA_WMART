import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import {
    addAddress,
    deleteAddress,
    setCart,
    setSelectedAddress
} from '../redux/productSlice';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from "@mui/material";
import { useCartContext } from '../CartContext';
import { FaArrowLeft } from "react-icons/fa";

const AddressForm = () => {

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });

    const [orderType, setOrderType] = useState("Delivery");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useCartContext();
    const length = cart?.items?.length || 0;

    const { addresses = [], selectedAddress = null } =
        useSelector(store => store.products || {});

    const selectedAddr =
        selectedAddress !== null ? addresses[selectedAddress] : null;

    const [showForm, setShowForm] = useState(false);

    const subTotal = cart?.totalPrice || 0;
    const shipping = subTotal > 50 ? 0 : 10;
    const tax = Number((subTotal * 0.05).toFixed(2)) || 0;
    const total = subTotal + shipping + tax;

    // CART CHECK
    useEffect(() => {
        if (length === 0) {
            setToast({
                open: true,
                message: "Cart is Empty",
                severity: "error"
            });

            navigate(-1);
        }
    }, [length, navigate]);

    // ORDER TYPE CONTROL (IMPORTANT FIX)
    useEffect(() => {
        if (orderType === "Delivery") {
            setShowForm(addresses.length === 0);
        } else {
            setShowForm(false);
        }
    }, [orderType, addresses.length]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        dispatch(addAddress(formData));
        setShowForm(false);
    };

    const emptyCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/cart/clear`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                dispatch(setCart(res.data.cart));
            }

        } catch (error) {
            console.log(error);
        }
    };

    const placeOrder = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            // DELIVERY VALIDATION ONLY
            if (orderType === "Delivery" && !selectedAddr) {
                setToast({
                    open: true,
                    message: "Please select a delivery address",
                    severity: "error"
                });
                return;
            }

            const deliveryAddress =
                orderType === "Delivery"
                    ? `${selectedAddr.address}, ${selectedAddr.city}, ${selectedAddr.zip}`
                    : undefined;

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/orders/create`,
                {
                    products: cart.items,
                    amount: total,
                    tax,
                    shipping,
                    currency: "PKR",
                    orderType,

                    phoneNumber: phoneNumber || selectedAddr?.phone || "",

                    deliveryAddress
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setToast({
                open: true,
                message: `Order Created Successfully — ${orderType}`,
                severity: "success"
            });

            setTimeout(async () => {
                await emptyCart();
                navigate(`/order-success/${res.data.dbOrder._id}`);
            }, 1500);

        } catch (error) {
            setToast({
                open: true,
                message: "Order creation failed",
                severity: "error"
            });
        }
    };

    return (
        <div className="w-full px-4 py-10 bg-[var(--color-background)]">

            {/* BACK BUTTON */}
            <div className="max-w-7xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    style={{
                        backgroundColor: "var(--color-background-inverse)",
                        color: "var(--color-text-inverse)"
                    }}
                >
                    <FaArrowLeft />
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* LEFT SIDE */}
                <div className="space-y-5">

                    {/* ORDER TYPE */}
                    <div className="p-5 rounded-xl bg-white/5 border border-gray-900/10 space-y-3">

                        <div className='font-semibold'>Select Order Type</div>

                        <div className="flex gap-4">
                            <label>
                                <input
                                    type="radio"
                                    value="Delivery"
                                    checked={orderType === "Delivery"}
                                    onChange={(e) => setOrderType(e.target.value)}
                                />
                                Delivery
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="Pickup"
                                    checked={orderType === "Pickup"}
                                    onChange={(e) => setOrderType(e.target.value)}
                                />
                                Pickup
                            </label>
                        </div>

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-2 rounded-md border border-gray-900/10 bg-transparent"
                        />
                    </div>

                    {/* ADDRESS FORM ONLY FOR DELIVERY */}
                    {orderType === "Delivery" && (
                        showForm ? (
                            <div className="p-5 rounded-xl bg-white/5 border border-gray-900/10 space-y-3">

                                <div className="font-semibold">Add Address</div>

                                {Object.keys(formData).map((field) => (
                                    <input
                                        key={field}
                                        name={field}
                                        placeholder={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded-md border border-gray-900/10 bg-transparent"
                                    />
                                ))}

                                <button
                                    onClick={handleSave}
                                    className="w-full py-2 bg-[#d4af37] text-black font-semibold rounded-md"
                                >
                                    Save Address
                                </button>

                            </div>
                        ) : (
                            <>
                                {addresses.map((addr, index) => (
                                    <div
                                        key={index}
                                        onClick={() => dispatch(setSelectedAddress(index))}
                                        className={`p-4 rounded-lg border cursor-pointer bg-white/5 ${
                                            selectedAddress === index
                                                ? "border-[#d4af37]"
                                                : "border-gray-900/10"
                                        }`}
                                    >
                                        <p>{addr.fullName}</p>
                                        <p>{addr.phone}</p>
                                        <p>{addr.address}</p>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(deleteAddress(index));
                                            }}
                                            className="text-red-400 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </>
                        )
                    )}

                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-2 border border-[#d4af37] text-[#d4af37]"
                    >
                        Add New Address
                    </button>

                    <button
                        disabled={orderType === "Delivery" && selectedAddress === null}
                        onClick={placeOrder}
                        className="w-full py-3 bg-[#d4af37] text-black font-semibold disabled:opacity-50"
                    >
                        Confirm Order
                    </button>

                </div>

                {/* RIGHT SIDE */}
                <div className="p-5 rounded-xl bg-white/5 border border-gray-900/10">
                    <h2 className="font-semibold mb-3">Order Summary</h2>

                    <p>Items: {length}</p>
                    <p>Subtotal: PKR {subTotal}</p>
                    <p>Shipping: PKR {shipping}</p>
                    <p>Tax: PKR {tax}</p>

                    <hr className="my-2" />

                    <p className="font-bold">Total: PKR {total}</p>
                </div>

            </div>

            {/* TOAST */}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity={toast.severity}>
                    {toast.message}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default AddressForm;