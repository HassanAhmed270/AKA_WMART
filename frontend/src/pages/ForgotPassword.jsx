import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState("light");
  const [step, setStep] = useState("request");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim();

    if (bg.includes("0") || document.documentElement.classList.contains("dark")) {
      setThemeMode("dark");
    } else {
      setThemeMode("light");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/forgot-password`,
        { email: formData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: res.data.message || "Reset email sent",
          severity: "success"
        });
        setStep("verify");
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Request failed",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

    const handleReset = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 8) {
      setToast({ open: true, message: "Password must be at least 8 characters", severity: "error" });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setToast({ open: true, message: "Passwords do not match", severity: "error" });
      return;
    }

    setLoading(true);

    try {
      const verifyRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/verify-otp/${formData.email}`,
        { otp: formData.otp },
        { headers: { "Content-Type": "application/json" } }
      );

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/change-password/${formData.email}`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
          resetToken: verifyRes.data.resetToken
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "Password reset successful. Please login.",
          severity: "success"
        });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Reset failed",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className="bg-[var(--color-background)]"
      >
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: themeMode === "dark" ? "#0f172a" : "#ffffff",
            borderRadius: "50%",
            p: 1,
            boxShadow: 2,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.2s",
            "&:hover": {
              transform: "scale(1.05)"
            }
          }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft
            size={16}
            color={themeMode === "dark" ? "#ffffff" : "#0f172a"}
          />
        </Box>
        <Card
          sx={{
            width: { xs: "92%", sm: 420 },
            borderRadius: 3,
            backgroundColor: themeMode === "dark" ? "#0f172a" : "#ffffff",
            color: themeMode === "dark" ? "#ffffff" : "#0f172a",
            border: themeMode === "dark"
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.08)",
            boxShadow: themeMode === "dark"
              ? "0 10px 30px rgba(0,0,0,0.6)"
              : "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              gutterBottom
              sx={{
                color: themeMode === "dark" ? "#fff" : "#0f172a"
              }}
            >
              {step === "request" ? "Forgot Password" : "Reset Password"}
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              gutterBottom
              sx={{
                color: themeMode === "dark" ? "#cbd5e1" : "#475569"
              }}
            >
              {step === "request"
                ? "Enter your email to receive reset instructions"
                : "Enter the OTP sent to your email and choose a new password"}
            </Typography>

            <form onSubmit={step === "request" ? handleRequest : handleReset}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{
                  style: { color: themeMode === "dark" ? "#cbd5e1" : undefined }
                }}
                InputProps={{
                  style: { color: themeMode === "dark" ? "#fff" : undefined }
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: themeMode === "dark"
                      ? "0.5px solid rgba(255,255,255,0.2)"
                      : undefined
                  }
                }}
              />

              {step === "verify" && (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="OTP"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: themeMode === "dark" ? "#cbd5e1" : undefined }
                    }}
                    InputProps={{
                      style: { color: themeMode === "dark" ? "#fff" : undefined }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: themeMode === "dark"
                          ? "0.5px solid rgba(255,255,255,0.2)"
                          : undefined
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: themeMode === "dark" ? "#cbd5e1" : undefined }
                    }}
                    InputProps={{
                      style: { color: themeMode === "dark" ? "#fff" : undefined }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: themeMode === "dark"
                          ? "0.5px solid rgba(255,255,255,0.2)"
                          : undefined
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    InputLabelProps={{
                      style: { color: themeMode === "dark" ? "#cbd5e1" : undefined }
                    }}
                    InputProps={{
                      style: { color: themeMode === "dark" ? "#fff" : undefined }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: themeMode === "dark"
                          ? "0.5px solid rgba(255,255,255,0.2)"
                          : undefined
                      }
                    }}
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  backgroundColor: "#1e3a8a",
                  "&:hover": { backgroundColor: "#0f172a" }
                }}
              >
                {loading ? "Processing..." : step === "request" ? "Send Reset Email" : "Reset Password"}
              </Button>
            </form>

            <Typography textAlign="center" sx={{ mt: 2 }}>
              Remembered your password? <Link to="/login">Login</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
};

export default ForgotPassword;
