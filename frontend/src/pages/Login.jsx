import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [themeMode, setThemeMode] = useState("light"); // keep same logic if you already detect theme elsewhere

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setToast({
          open: true,
          message: "Login Successful ✅",
          severity: "success"
        });

        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect based on role
        if (res.data.user.role === 'worker') {
          setTimeout(() => navigate("/dashboard/insights"), 1500);
        } else {
          setTimeout(() => navigate("/"), 1500);
        }
      }
    } catch (error) {
      setToast({
        open: true,
        message: "Invalid Credentials",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };
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

            {/* TITLE */}
            <Typography
              variant="h5"
              textAlign="center"
              gutterBottom
              sx={{
                color: themeMode === "dark" ? "#fff" : "#0f172a"
              }}
            >
              Log In
            </Typography>

            <Typography
              variant="body2"
              textAlign="center"
              gutterBottom
              sx={{
                color: themeMode === "dark" ? "#cbd5e1" : "#475569"
              }}
            >
              Log in to your account to continue
            </Typography>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

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

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formData.password}
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

              {/* FORGOT PASSWORD */}
              <Typography variant="body2" textAlign="center">
                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: themeMode === "dark" ? "#60a5fa" : "#1d4ed8"
                  }}
                >
                  Forgot Password?
                </Link>
              </Typography>

              {/* BUTTON (MATCHED SIGNUP STYLE) */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  backgroundColor: "#1e3a8a",
                  color: "#fff",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#0f172a",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                  }
                }}
              >
                {loading ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>

              {/* SIGNUP LINK */}
              <Typography
                variant="body2"
                textAlign="center"
                sx={{ mt: 2 }}
              >
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  style={{
                    textDecoration: "none",
                    color: themeMode === "dark" ? "#60a5fa" : "#1d4ed8"
                  }}
                >
                  Signup
                </Link>
              </Typography>

            </form>
          </CardContent>
        </Card>
      </Box>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;