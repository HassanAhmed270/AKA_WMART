import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Login from './pages/Login';
import AddressForm from './pages/AddressForm';
import Profile from './pages/Profile';
import Verify from './pages/Verify';
import VerifyEmail from './pages/VerifyEmail';
import Products from './pages/Products';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import './App.css';
import Cart from './pages/Cart';
import AdminSales from './pages/admin/AdminSales';
import AddProduct from './pages/admin/AddProduct';
import AdminProduct from './pages/admin/AdminProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import UserInfo from './pages/admin/UserInfo';
import ShowUserOrders from './pages/admin/ShowUserOrders';
import ProtectedRoute from './components/ProtectedRoute';
import SingleProduct from './pages/SingleProduct';
import { setCart ,setProducts} from "./redux/productSlice";
import { setUser } from "./redux/userSlice";

import { CartContext } from "./CartContext";
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
function App() {
      const dispatch = useDispatch();
    const cart = useSelector(state => state.products.cart);

useEffect(() => {

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("accessToken");

      // ================= VALIDATE USER =================
      if (token) {
        try {
          const userRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/product/get-all-products`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } catch (authError) {
          if (authError.response?.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            localStorage.removeItem("persist:root");
            dispatch(setUser(null));
            window.location.href = "/login";
            return;
          }
        }
      }

      // ================= CART =================
      const cartRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (cartRes.data.success) {
        dispatch(setCart(cartRes.data.cart));
      }

      // ================= PRODUCTS =================
      const productRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/product/get-all-products`
      );

      if (productRes.data.success) {
        dispatch(setProducts(productRes.data.products));
      }

    } catch (error) {
      console.log(error);
    }

  };

  fetchData();

}, [dispatch]);
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <Home />
          <Footer />
        </>
      )
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/verify',
      element: <Verify />
    },
    {
      path: '/verify/:token',
      element: <VerifyEmail />
    },
    {
      path: '/profile/:userId',
      element: (
        <ProtectedRoute>
          <>
            <Navbar />
            <Profile />
            <Footer />
          </>
        </ProtectedRoute>
      )
    },
    {
      path: '/products',

      element:<><Navbar/> <Products /></>
    },
    {
      path: '/products/:id',
      element:<><Navbar/> <SingleProduct /></>
    },
    {
      path: '/cart',
      element: <Cart />
    },
     {
      path: '/address',
      element: <AddressForm />
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <>
            <Navbar />
            <Dashboard />
          </>
        </ProtectedRoute>
      ),
      children: [
        { path: "insights", element: <AdminSales /> },
        { path: "add-products", element: <AddProduct /> },
        { path: "products", element: <AdminProduct /> },
        { path: "orders", element: <AdminOrders /> },
        { path: "users/orders/:userId", element: <ShowUserOrders /> },
        { path: "users", element: (
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          )
        },
        { path: "users/:userId", element: (
            <ProtectedRoute adminOnly={true}>
              <UserInfo />
            </ProtectedRoute>
          )
        }
      ]
    }
  ]);

  return  <CartContext.Provider value={{ cart }}> <RouterProvider router={router}/> </CartContext.Provider>
}

export default App;