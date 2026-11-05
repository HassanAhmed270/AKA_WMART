// CartContext.js
import { createContext, useContext } from "react";

export const CartContext = createContext({ cart: { items: [], totalPrice: 0 } });

export const useCartContext = () => {
    return useContext(CartContext);
};