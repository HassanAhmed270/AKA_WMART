import React, { useState } from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { Snackbar, Alert } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setCart } from '../redux/productSlice';
import { useDispatch } from 'react-redux';
import { addToGuestCart } from '../utils/guestCart';
import { getErrorMessage } from '../utils/errorMessage';

const ProductCard = ({ product }) => {
    const { productName, productImg, productPrice } = product;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const addToCart = async (productId) => {
        try {
            setLoading(true);

            // read at click time so a login/logout without a re-render is respected
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                const newCart = addToGuestCart(product);
                dispatch(setCart(newCart));
                setToastState({
                    open: true,
                    message: "Product added to cart",
                    severity: "success"
                });
                return;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/cart/add/`,
                { productId },
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
            console.log(error);

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
        <div className='glass-card shadow-soft rounded-xl overflow-hidden h-max hover:shadow-lg transition-shadow duration-300'>

            {/* IMAGE */}
            <div
                className='w-full aspect-square overflow-hidden rounded-t-xl'
                onClick={() => navigate(`/products/${product._id}`)}
            >
                <img
                    src={productImg[0].url}
                    alt=""
                    className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
            </div>

            {/* CONTENT */}
            <div className="px-3 sm:px-4 py-3 space-y-2">

                <h1 className='font-semibold text-sm sm:text-base md:text-lg h-10 sm:h-12 line-clamp-2 text-text dark:text-text-dark'>
                    {productName}
                </h1>

                <h2 className='font-semibold text-primary text-sm sm:text-base md:text-lg'>
                    PKR {productPrice}
                </h2>

                <button
                    disabled={loading}
                    onClick={() => addToCart(product._id)}
                    className='btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm md:text-base py-2 sm:py-2.5'
                >
                    <CiShoppingCart className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' />
                    <span>{loading ? "Adding..." : "Add to Cart"}</span>
                </button>

            </div>

            {/* SNACKBAR */}
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

        </div>
    );
};

export default ProductCard;