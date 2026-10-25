import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '../../components/ImageUpload';
import { MAX_PRODUCT_PRICE } from '../../utils/productLimits';

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert
} from "@mui/material";

import { setProducts } from '../../redux/productSlice';

const AddProduct = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    brand: "",
    productDescription: "",
    category: "",
    quantity: "",
    productImg: []
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productPrice = Number(formData.productPrice);
    if (!Number.isFinite(productPrice) || productPrice < 1 || productPrice > MAX_PRODUCT_PRICE) {
      setToast({
        open: true,
        message: "Price must be between 1 and 10000 PKR",
        severity: "error"
      });
      return;
    }

    if (!formData.productImg?.length) {
      setToast({
        open: true,
        message: "At least one image is required ❌",
        severity: "error"
      });
      return;
    }

    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");

    try {

      const data = new FormData();

      data.append("productName", formData.productName);
      data.append("productPrice", formData.productPrice);
      data.append("quantity", formData.quantity);
      data.append("brand", formData.brand);
      data.append("productDescription", formData.productDescription);
      data.append("category", formData.category);

      formData.productImg.forEach((img) => {
        data.append("file", img);
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/product/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {

        dispatch(setProducts([...(products || []), res.data.product]));

        setToast({
          open: true,
          message: "Product Added ✅",
          severity: "success"
        });

        setTimeout(() => navigate("/products"), 1500);
      }

    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Error occurred",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center px-3 py-10 bg-[var(--color-background)]">

      <Card className="glass-card w-full max-w-[520px] bg-zinc-300 ">

        <CardContent className="p-4 md:p-6">

          <Typography
            variant="h5"
            textAlign="center"
            sx={{ color: "var(--color-text)", fontWeight: 600 }}
          >
            Add Product
          </Typography>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">

            <TextField
              label="Product Name"
              name="productName"
              fullWidth
              value={formData.productName}
              onChange={handleChange}
              required
              sx={{
                input: { color: "black" },
                label: { color: "black" }
              }}
            />

            <TextField
              label="Price"
              name="productPrice"
              type="number"
              fullWidth
              value={formData.productPrice}
              onChange={handleChange}
              required
              inputProps={{ min: 1, max: MAX_PRODUCT_PRICE }}
              sx={{
                input: { color: "black" },
                label: { color: "black" }
              }}
            />

            <TextField
              label="Initial Quantity"
              name="quantity"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={handleChange}
              required
              sx={{
                input: { color: "black" },
                label: { color: "black" }
              }}
            />

            <div className="flex flex-col md:flex-row gap-3">

              <TextField
                label="Brand"
                name="brand"
                fullWidth
                value={formData.brand}
                onChange={handleChange}
                required
                sx={{
                  input: { color: "black" },
                  label: { color: "black" }
                }}
              />

              <TextField
                label="Category"
                name="category"
                fullWidth
                value={formData.category}
                onChange={handleChange}
                required
                sx={{
                  input: { color: "black" },
                  label: { color: "black" }
                }}
              />

            </div>

            {/* Description */}
            <textarea
              name="productDescription"
              placeholder="Product Description"
              value={formData.productDescription}
              onChange={handleChange}
              rows={4}
              className="
      w-full p-3 rounded-md
      bg-transparent
      border border-white/10
      text-black
      outline-none
      resize-none
    "
            />

            {/* Image Upload */}
            <ImageUpload
              formData={formData}
              setFormData={setFormData}
              onLimit={(message) => setToast({
                open: true,
                message,
                severity: "error"
              })}
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
      w-full py-2.5 rounded-md
      bg-[var(--color-primary)]
      text-white font-semibold
      flex justify-center items-center gap-2
      hover:opacity-90 transition
    "
            >
              {loading ? (
                <LuLoaderCircle className="animate-spin" />
              ) : (
                "Add Product"
              )}
            </button>

          </form>

        </CardContent>

      </Card>

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

    </Box>
  );
};

export default AddProduct;