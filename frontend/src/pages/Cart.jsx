import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CiShoppingCart } from "react-icons/ci";
import axios from 'axios';
import { setCart } from '../redux/productSlice';
import { Snackbar, Alert } from "@mui/material";
import { useCartContext } from "../CartContext";
import {
  updateGuestCartQuantity,
  removeFromGuestCart
} from '../utils/guestCart';

const Cart = () => {

  const accessToken = localStorage.getItem("accessToken");
  const { cart } = useCartContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const API = `${import.meta.env.VITE_API_URL}/cart`;

  const updateQuantity = async (productId, type) => {
    try {
      if (!accessToken) {
        const newCart = updateGuestCartQuantity(productId, type);
        dispatch(setCart(newCart));
        setToastState({
          open: true,
          message: "Quantity Updated",
          severity: "success"
        });
        return;
      }

      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {

        dispatch(setCart(res.data.cart));

        setToastState({
          open: true,
          message: "Quantity Updated",
          severity: "success"
        });
      }

    } catch (error) {

      setToastState({
        open: true,
        message: "Quantity cannot be updated",
        severity: "error"
      });

    }
  };

  const handleRemove = async (productId) => {

    try {
      if (!accessToken) {
        const newCart = removeFromGuestCart(productId);
        dispatch(setCart(newCart));
        setToastState({
          open: true,
          message: "Product removed from cart",
          severity: "success"
        });
        return;
      }

      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      });

      if (res.data.success) {

        dispatch(setCart(res.data.cart));

        setToastState({
          open: true,
          message: "Product removed from cart",
          severity: "success"
        });

      }

    } catch (error) {

      setToastState({
        open: true,
        message: "Cannot remove product",
        severity: "error"
      });

    }
  };

  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 50 ? 0 : 100;
  const total = subTotal + shipping;

  return (

    <div className='bg-[var(--color-background)] min-h-screen'>

      <Navbar />

      {cart?.items?.length > 0 ? (

        <div className='w-full max-w-screen-2xl mx-auto pt-28 px-4 sm:px-6 flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24'>

          {/* LEFT SIDE */}
          <div className='flex flex-col gap-5 flex-1 w-full'>

            <h1 className='text-2xl text-text dark:text-text-dark mb-4 font-bold'>
              Shopping Cart
            </h1>

            {cart.items.map((product, index) => (

              <div
                key={index}
                className="
                  p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4
                  bg-white/80 dark:bg-white/10
                  backdrop-blur-md
                  border border-gray-200 dark:border-white/10
                  rounded-lg shadow-sm text-black
                "
              >

                {/* PRODUCT */}
                <div className="flex items-center gap-4 w-full md:w-[350px] min-w-0">

                  <img
                    src={product?.productId?.productImg?.[0]?.url || '/logo.png'}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                    alt=""
                  />

                  <div className="w-full min-w-0">

                    <h1
                      className="
                        font-semibold
                        text-text dark:text-text-dark
                        break-words
                      "
                    >
                      {product?.productId?.productName}
                    </h1>

                    <p
                      className="
                        font-semibold
                        text-text dark:text-text-dark
                        break-words
                      "
                    >
                      PKR {product?.productId?.productPrice}
                    </p>

                  </div>

                </div>

                {/* QUANTITY */}
                <div className="flex gap-3 items-center md:justify-start">

                  <button
                    className='bg-blue-600 px-3 py-1 text-white rounded hover:bg-blue-700 transition'
                    onClick={() =>
                      updateQuantity(product.productId._id, "decrease")
                    }
                  >
                    -
                  </button>

                  <span className='text-text dark:text-text-dark'>
                    {product.quantity}
                  </span>

                  <button
                    className='bg-blue-600 px-3 py-1 text-white rounded hover:bg-blue-700 transition'
                    onClick={() =>
                      updateQuantity(product.productId._id, "increase")
                    }
                  >
                    +
                  </button>

                </div>

                {/* PRICE */}
                <p className='w-full md:w-[120px] md:text-right text-text dark:text-text-dark'>
                  PKR {(product?.productId?.productPrice * product.quantity).toLocaleString()}
                </p>

                {/* REMOVE */}
                <p
                  onClick={() => handleRemove(product?.productId?._id)}
                  className='flex text-red-500 items-center gap-1 cursor-pointer md:justify-end'
                >
                  <RiDeleteBinLine />
                  Remove
                </p>

              </div>

            ))}

          </div>

          {/* RIGHT SIDE */}
          <div className='w-full md:w-[350px]'>

            <div
              className="
                p-5 h-fit
                bg-white/80 dark:bg-white/10
                backdrop-blur-md
                border border-gray-200 dark:border-white/10
                rounded-lg shadow-md
                text-black
              "
            >

              <h1 className='font-bold text-xl mb-4 text-text dark:text-text-dark'>
                Order Summary
              </h1>

              <div className='space-y-4 text-text dark:text-text-dark'>

                <div className="flex justify-between">
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span>PKR {subTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>PKR {shipping}</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>PKR {total.toFixed(2)}</span>
                </div>

              </div>

              <div className='mt-6'>

                <button
                  onClick={() => navigate(`/address`)}
                  className='btn-primary mt-4 w-full'
                >
                  Place Order
                </button>

                <Link to="/products">

                  <button className='btn-primary mt-2 w-full'>
                    Continue Shopping
                  </button>

                </Link>

              </div>

              {/* INFO */}
              <div className="text-sm text-gray-500 dark:text-gray-400 pt-4">

                <p>* Free Shipping on Orders Over 50 PKR</p>
                <p>* 30 Days Return Policy</p>
                <p>* Cash on Delivery Available</p>

              </div>

            </div>

          </div>

        </div>

      ) : (

        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">

          <div
            className="
              bg-white/80 dark:bg-white/10
              backdrop-blur-md
              p-6 rounded-full
              border border-gray-200 dark:border-white/10
            "
          >

            <CiShoppingCart className='w-16 h-16 text-primary mx-auto' />

            <h2 className='mt-6 text-2xl font-bold text-text dark:text-text-dark'>
              Your Cart is Empty
            </h2>

            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Looks like you haven't added anything yet!
            </p>

            <Link to="/products">

              <button className='btn-primary mt-6'>
                Continue Shopping
              </button>

            </Link>

          </div>

        </div>

      )}

      {/* TOAST */}
      <Snackbar
        open={toastState.open}
        autoHideDuration={3000}
        onClose={() =>
          setToastState({
            ...toastState,
            open: false
          })
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >

        <Alert
          severity={toastState.severity}
          onClose={() =>
            setToastState({
              ...toastState,
              open: false
            })
          }
          variant="filled"
        >
          {toastState.message}
        </Alert>

      </Snackbar>

    </div>

  );
};

export default Cart;