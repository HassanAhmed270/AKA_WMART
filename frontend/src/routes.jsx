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
import ForgotPassword from './pages/ForgotPassword';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';

export const routes = [
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
    path: '/forgot-password',
    element: <ForgotPassword />
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
    element: <><Navbar/> <Products /></>
  },
  {
    path: '/products/:id',
    element: <><Navbar/> <SingleProduct /></>
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
    path: '/order-success/:orderId',
    element: (
      <>
        <Navbar />
        <OrderSuccess />
      </>
    )
  },
  {
    path: '/payment-demo/:orderId',
    element: <><Navbar /><Payment /></>
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute roles={["admin", "worker"]}>
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
          <ProtectedRoute roles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        )
      },
      { path: "users/:userId", element: (
          <ProtectedRoute roles={["admin"]}>
            <UserInfo />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <>
        <Navbar />
        <NotFound />
        <Footer />
      </>
    )
  }
];

export default routes;
