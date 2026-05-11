import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CiShoppingCart } from "react-icons/ci";
import { Button } from '@mui/material';
import { LuLoaderCircle, LuSun, LuMoon, LuMenu, LuX } from "react-icons/lu";
import axios from 'axios';
import { setUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify';
import { useCartContext } from "../CartContext";

const Navbar = () => {

  const user = useSelector(store => store.user.user)
  const admin = user?.role === "admin" ? true : false
  const worker = user?.role === "worker" ? true : false

  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const { cart } = useCartContext();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(null));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        setTimeout(() => setLoading(false), 1500);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      if (error.response?.status === 401) {
        dispatch(setUser(null));
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = "/login";
      }
    }
  };

  return (
    <header className='bg-[var(--color-background)] fixed w-full top-0 z-50 border border-[var(--color-border-primary)] shadow-[var(--shadow-soft)]'>

      <div className='  mx-auto flex justify-between items-center  md:py-3  px-4  md:px-8 lg:px-16'>
        {/* Logo */}
        <img
          className="w-[100px] rounded-full cursor-pointer"
          src={theme === "dark" ? "/logo.png" : "/logo2.png"}
          alt="logo"
        />
        {/* Desktop Nav */}
        <nav className='hidden md:flex gap-6 items-center'>

          <ul className="flex gap-7 text-lg font-semibold">
            <Link to="/"><li>Home</li></Link>
            {!worker && <Link to="/products"><li>Products</li></Link>}

            {user && !worker && (
              <li>
                <Link to={`/profile/${user?._id}`}>
                  Hello, {user?.firstName}
                </Link>
              </li>
            )}

            {(admin || worker) && (
              <li>
                <Link to="/dashboard/insights">Dashboard</Link>
              </li>
            )}
          </ul>

          {/* Cart - hide for workers */}
          {!worker && (
            <Link to="/cart" className='relative text-2xl'>
              <CiShoppingCart />
              <span className="bg-primary text-white rounded-full absolute -top-3 -right-4 px-2 text-sm">
                {cart?.items?.length || 0}
              </span>
            </Link>
          )}

          {/* Theme */}
          <button onClick={toggleTheme} className='text-2xl p-2 rounded-full hover:bg-primary/10'>
            {theme === 'light' ? <LuMoon /> : <LuSun />}
          </button>

          {/* Auth */}
          {user ? (
            <div className='flex gap-3 items-center'>
              <Link to="/login">
                <Button
                  variant="outlined"
                  sx={{
                    py: 1,
                    px: 2,
                    color: "#1e3a8a",
                    borderColor: "#1e3a8a",
                    "&:hover": { backgroundColor: "#0f172a", color: "#fff", borderColor: "#0f172a" }
                  }}
                >
                  Login
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                  py: 1,
                  px: 2,
                  backgroundColor: "#1e3a8a",
                  "&:hover": { backgroundColor: "#0f172a" }
                }}
              >
                {loading ? <LuLoaderCircle className="animate-spin" /> : "Logout"}
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button
                variant="contained"
                sx={{
                  py: 1,
                  px: 2,
                  backgroundColor: "#1e3a8a",
                  "&:hover": { backgroundColor: "#0f172a" }
                }}
              >
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-3xl'
          onClick={() => setMenuOpen(true)}
        >
          <LuMenu />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-[var(--color-background)]  border-1 border-white md:border-hidden shadow-lg transform transition-transform duration-300 z-50
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Close Button */}
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='font-bold'>Menu</h2>
          <button onClick={() => setMenuOpen(false)} className='text-2xl'>
            <LuX />
          </button>
        </div>

        {/* Links */}
        <div className='flex flex-col gap-5 p-4 text-lg font-medium'>

          <Link onClick={() => setMenuOpen(false)} to="/">Home</Link>
          {!worker && <Link onClick={() => setMenuOpen(false)} to="/products">Products</Link>}

          {user && (
            <Link onClick={() => setMenuOpen(false)} to={`/profile/${user?._id}`}>
              Profile
            </Link>
          )}

          {(admin || worker) && (
            <Link onClick={() => setMenuOpen(false)} to="/dashboard/insights">
              Dashboard
            </Link>
          )}

          {!worker && <Link onClick={() => setMenuOpen(false)} to="/cart">
            Cart ({cart?.items?.length || 0})
          </Link>}

          {/* Theme */}
          <button onClick={toggleTheme} className='text-left'>
            Toggle Theme
          </button>

          {/* Auth */}
          {user ? (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/login">
                Login
              </Link>
              <button onClick={handleLogout} className='text-left text-red-500'>
                Logout
              </button>
            </>
          ) : (
            <Link onClick={() => setMenuOpen(false)} to="/login">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-40'
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default Navbar;