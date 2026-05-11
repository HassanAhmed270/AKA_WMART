import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ THEME STATE (same idea as FilterSidebar logic)
  const [themeMode, setThemeMode] = useState("light");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [showReverify, setShowReverify] = useState(false);
  const [reverifyEmail, setReverifyEmail] = useState("");

  // ✅ Detect theme from CSS variable (bg-background logic)
  useEffect(() => {
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      .trim();

    // simple heuristic (you can adjust if needed)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowReverify(false);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "Signup Successful ✅",
          severity: "success"
        });

        setTimeout(() => navigate("/verify"), 1500);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setToast({
        open: true,
        message,
        severity: "error"
      });

      if (message === "Account already exists but is not verified. Please verify your account.") {
        setShowReverify(true);
        setReverifyEmail(formData.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReverify = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/reVerify`,
        { email: reverifyEmail },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "Verification Email Sent Again",
          severity: "success"
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || "Re-verify failed",
        severity: "error"
      });
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

            // ✅ THEME FIX (ONLY CHANGE YOU NEED)
            backgroundColor:
              themeMode === "dark" ? "#0f172a" : "#ffffff",

            color:
              themeMode === "dark" ? "#ffffff" : "#0f172a"
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
              Signup
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              gutterBottom
              sx={{
                color: themeMode === "dark" ? "#cbd5e1" : "#475569"
              }}
            >
              Create your account to continue
            </Typography>

            <form onSubmit={handleSubmit}>

              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                name="firstName"
                variant="outlined"
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
                label="Last Name"
                name="lastName"
                variant="outlined"
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
                label="Email"
                name="email"
                variant="outlined"
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
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{
                  style: { color: themeMode === "dark" ? "#cbd5e1" : undefined }
                }}
                InputProps={{
                  style: { color: themeMode === "dark" ? "#fff" : undefined },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: themeMode === "dark"
                      ? "0.5px solid rgba(255,255,255,0.2)"
                      : undefined
                  }
                }}
              />

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
                {loading ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>

              {showReverify && (
                <Button
                  onClick={handleReverify}
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.2,
                    borderColor: "#1e3a8a",
                    color: "#1e3a8a",
                    "&:hover": { backgroundColor: "#0f172a", color: "#fff" }
                  }}
                >
                  Re-verify Your Account
                </Button>
              )}

            </form>
            <Typography textAlign="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link to="/login">Login</Link>
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

export default Signup;