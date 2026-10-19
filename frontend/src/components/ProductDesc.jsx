import React, { useState } from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { setCart } from '../redux/productSlice';
import { useDispatch } from 'react-redux';
import ProductImg from './ProductImg';
import { addToGuestCart, MAX_QTY_PER_PRODUCT } from '../utils/guestCart';
import { getErrorMessage } from '../utils/errorMessage';

const ProductDesc = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleQuantityChange = (e) => {
        const n = parseInt(e.target.value, 10);
        if (Number.isNaN(n)) {
            setQuantity(1);
            return;
        }
        setQuantity(Math.min(MAX_QTY_PER_PRODUCT, Math.max(1, n)));
    };

    const addToCart = async (productId) => {
        try {
            setLoading(true);

            // read at click time so a login/logout without a re-render is respected
            const accessToken = localStorage.getItem('accessToken');

            // Guests: same local cart the product cards use
            if (!accessToken) {
                const newCart = addToGuestCart(product, quantity);
                dispatch(setCart(newCart));
                setToastState({
                    open: true,
                    message: "Product added to cart",
                    severity: "success"
                });
                return;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/cart/add`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {
                setToastState({
                    open: true,
                    message: "Product added to cart",
                    severity: "success"
                });

                dispatch(setCart(res.data.cart));
            }

        } catch (error) {
            setToastState({
                open: true,
                message: getErrorMessage(error, "Something went wrong"),
                severity: "error"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='w-full md:px-3 px-4 lg:px-0'>

            {/* MAIN LAYOUT */}
            <div className='flex flex-col md:flex-row gap-8'>

                {/* LEFT SIDE (Image + Name + Price) */}
                <div className='md:w-1/2 flex flex-col gap-4'>

                    {/* Image */}
                    <div className='w-full flex justify-center md:justify-start'>
                        <ProductImg images={product.productImg} />
                    </div>

                    {/* Name */}
                    <h1 className='font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[var(--color-text)] leading-tight'>
                        {product.productName}
                    </h1>

                    {/* Price */}
                    <h2 className='text-[var(--color-primary)] font-bold text-2xl sm:text-3xl md:text-4xl'>
                        PKR: {product.productPrice}
                    </h2>

                    {/* Category */}
                    <p className='text-sm sm:text-base text-[var(--color-text)]/70'>
                        {product.category} | {product.brand}
                    </p>
                </div>

                {/* RIGHT SIDE (Details) */}
                <div className='md:w-1/2 flex flex-col gap-8'>

                    {/* Description */}
                    <div className="flex flex-col gap-2 ">
                        <h3 className='font-semibold text-base md:text-lg lg:text-xl'>
                            Description
                        </h3>

                        <p className='text-sm sm:text-base md:text-lg text-[var(--color-text)]/70 leading-6 md:leading-7'>
                            {product.productDescription}
                        </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col  gap-3">
                        <label className='text-lg md:text-base font-semibold'>
                            Quantity (max {MAX_QTY_PER_PRODUCT})
                        </label>

                        <input
                            type="number"
                            min={1}
                            max={MAX_QTY_PER_PRODUCT}
                            step={1}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-full  h-11 px-3 border border-primary/20 rounded-md 
                                       focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Button */}
                    <button
                        disabled={loading}
                        onClick={() => addToCart(product._id)}
                        className='btn-primary w-full h-12 md:h-14 text-base md:text-lg font-semibold 
                                   flex items-center justify-center gap-2 disabled:opacity-50 rounded-md'
                    >
                        <CiShoppingCart className='w-5 h-5 md:w-6 md:h-6' />
                        <span>{loading ? "Adding..." : "Add to Cart"}</span>
                    </button>

                </div>
            </div>

            {/* Snackbar */}
            <Snackbar
                open={toastState.open}
                autoHideDuration={3000}
                onClose={() => setToastState({ ...toastState, open: false })}
            >
                <Alert
                    severity={toastState.severity}
                    onClose={() => setToastState({ ...toastState, open: false })}
                >
                    {toastState.message}
                </Alert>
            </Snackbar>

        </section>
    )
}

export default ProductDesc