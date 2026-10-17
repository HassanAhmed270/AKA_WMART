import React, { useEffect, useRef, useState } from 'react';
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
import { clearGuestCart } from '../utils/guestCart';
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

    const [placingOrder, setPlacingOrder] = useState(false);

    // Set to true once the order is created, so that emptying the cart
    // afterwards does not trigger the "cart is empty" redirect below.
    const orderPlacedRef = useRef(false);

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

    // ✅ SAFE INDEX FIX (MAIN BUG FIX)
    const selectedAddr =
        Number.isInteger(selectedAddress) &&
        selectedAddress >= 0 &&
        selectedAddress < addresses.length
            ? addresses[selectedAddress]
            : null;

    const [showForm, setShowForm] = useState(false);

    // Display only. The server recomputes the real total from database prices.
    // Shipping is agreed over WhatsApp before confirmation, so it is not added.
    const subTotal = cart?.totalPrice || 0;

    // CART CHECK
    useEffect(() => {
        if (length === 0 && !orderPlacedRef.current) {
            setToast({
                open: true,
                message: "Cart is Empty",
                severity: "error"
            });

            navigate(-1);
        }
    }, [length, navigate]);

    // RESET INVALID ADDRESS INDEX
    useEffect(() => {
        if (selectedAddress >= addresses.length) {
            dispatch(setSelectedAddress(null));
        }
    }, [addresses.length, selectedAddress, dispatch]);

    // ORDER TYPE CONTROL
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

            if (!token) {
                clearGuestCart();
                dispatch(setCart({ items: [], totalPrice: 0 }));
                return;
            }

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

        } catch {
            console.log("Failed to clear cart");
        }
    };

    // 🔥 SAFE ORDER PLACE
    const placeOrder = async () => {

        if (placingOrder) return;
        setPlacingOrder(true);

        try {
            const token = localStorage.getItem("accessToken");

            if (orderType === "Delivery" && !selectedAddr) {
                setToast({
                    open: true,
                    message: "Please select a valid address",
                    severity: "error"
                });
                setPlacingOrder(false);
                return;
            }

            let Details = {};

            if (orderType === "Pickup") {
                if (!phoneNumber) {
                    setToast({
                        open: true,
                        message: "Phone number required",
                        severity: "error"
                    });
                    setPlacingOrder(false);
                    return;
                }

                Details = {
                    phone: phoneNumber
                };
            }

            if (orderType === "Delivery") {

                if (!selectedAddr) {
                    setToast({
                        open: true,
                        message: "Invalid address selected",
                        severity: "error"
                    });
                    setPlacingOrder(false);
                    return;
                }

                Details = {
                    fullName: selectedAddr.fullName || "",
                    phone: selectedAddr.phone || "",
                    email: selectedAddr.email || "",
                    address: selectedAddr.address || "",
                    city: selectedAddr.city || "",
                    state: selectedAddr.state || "",
                    zip: selectedAddr.zip || "",
                    country: selectedAddr.country || ""
                };
            }

            // Amount and shipping are intentionally NOT sent: the server
            // calculates the total from database prices.
            const body = {
                products: cart.items.map(item => ({
                  productId: item.productId?._id || item.productId,
                  quantity: item.quantity
                })),
                currency: "PKR",
                orderType,
                Details
            };

            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : {};

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/orders/create`,
                body,
                { headers }
            );

            // Order exists now: stop the empty-cart redirect from firing
            orderPlacedRef.current = true;

            setToast({
                open: true,
                message: `Order Created Successfully`,
                severity: "success"
            });

            setTimeout(async () => {
                await emptyCart();
                navigate(`/order-success/${res.data.dbOrder._id}`);
            }, 1200);

        } catch (error) {
            setToast({
                open: true,
                message: error.response?.data?.message || "Order creation failed",
                severity: "error"
            });
        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <div className="w-full px-4 py-10 bg-[var(--color-background)]">

            {/* BACK */}
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

                {/* LEFT */}
                <div className="space-y-5">

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
                            addresses.map((addr, index) => (
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
                            ))
                        )
                    )}

                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-2 border border-[#d4af37] text-[#d4af37]"
                    >
                        Add New Address
                    </button>

                    <button
                        disabled={placingOrder}
                        onClick={placeOrder}
                        className="w-full py-3 bg-[#d4af37] text-black font-semibold disabled:opacity-50"
                    >
                        {placingOrder ? "Placing Order..." : "Confirm Order"}
                    </button>

                </div>

                {/* RIGHT */}
                <div className="p-5 rounded-xl bg-white/5 border border-gray-900/10">
                    <h2 className="font-semibold mb-3">Order Summary</h2>

                    <p>Items: {length}</p>
                    <p className="font-bold">Subtotal: PKR {subTotal}</p>

                    <hr className="my-2" />

                    <p className="text-sm opacity-70">
                        Shipping charges will be communicated through WhatsApp before order confirmation.
                    </p>
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