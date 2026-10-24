import axios from "axios";
import { setCart } from "../redux/productSlice";
import { setUser } from "../redux/userSlice";
import { getGuestCart } from "./guestCart";

let inFlight = null;

const run = async (dispatch) => {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("accessToken");

  if (!token) {
    dispatch(setCart(getGuestCart()));
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const guest = getGuestCart();
    const lines = (guest.items || [])
      .map((item) => ({
        productId: item.productId?._id || item.productId,
        quantity: Number(item.quantity)
      }))
      .filter((line) => typeof line.productId === "string" && line.quantity >= 1);

    let res = null;

    if (lines.length > 0) {
      try {
        res = await axios.post(`${API}/cart/merge`, { items: lines }, { headers });
        if (res.data.success) {
          localStorage.removeItem("guestCart");
        }
      } catch (mergeError) {
        if (mergeError.response?.status === 401) throw mergeError;
        res = null;
      }
    }

    if (!res) {
      res = await axios.get(`${API}/cart`, { headers });
      if (res.data.success && lines.length === 0) {
        localStorage.removeItem("guestCart");
      }
    }

    if (res.data.success) {
      dispatch(setCart(res.data.cart));
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("persist:Ekart");
      dispatch(setUser(null));
      window.location.href = "/login";
      return;
    }
    console.log(error);
  }
};

export const syncCart = (dispatch) => {
  if (!inFlight) {
    inFlight = run(dispatch).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
};
