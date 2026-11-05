import { RouterProvider } from 'react-router-dom';
import './App.css';
import { setProducts } from "./redux/productSlice";
import { syncCart } from "./utils/cartSync";

import { CartContext } from "./CartContext";
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// The router is created ONCE by the entry (main.jsx) and passed in as a prop.
// Creating it inside App() rebuilt it on every cart change, which remounted the
// page tree and made navigate() calls (e.g. to /order-success/:id) change the
// URL without changing the page.
function App({ router }) {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.products.cart);
  const userId = useSelector(state => state.user.user?._id);

  // The cart follows the session: after login the account cart is loaded (a
  // guest cart is merged into it), after logout the guest cart is shown again,
  // and an expired token clears the dead session.
  useEffect(() => {
    syncCart(dispatch);
  }, [dispatch, userId]);

  // Products load once
  useEffect(() => {

    const fetchProducts = async () => {

      try {

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

    fetchProducts();

  }, [dispatch]);

  return (
    <CartContext.Provider value={{ cart }}>
      <RouterProvider router={router} />
    </CartContext.Provider>
  );
}

export default App;
