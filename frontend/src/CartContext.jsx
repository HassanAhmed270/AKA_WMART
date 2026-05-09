// CartContext.js
import { createContext, useContext } from "react";

export const CartContext = createContext();

export const useCartContext = () => {
    return useContext(CartContext);
};