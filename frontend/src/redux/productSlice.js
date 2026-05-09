import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    cart: [],
    addresses: [],
    selectedAddress: null
  },

  reducers: {

    // PRODUCTS
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    // CART
    setCart: (state, action) => {
      state.cart = action.payload;
    },

    // ADD ADDRESS
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },

    // SELECT ADDRESS
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    // DELETE ADDRESS
    deleteAddress: (state, action) => {
      const index = action.payload;

      state.addresses = state.addresses.filter((_, i) => i !== index);

      // reset selected if deleted
      if (state.selectedAddress === index) {
        state.selectedAddress = null;
      }
    }
  }
});

export const {
  setProducts,
  setCart,
  addAddress,
  setSelectedAddress,
  deleteAddress
} = productSlice.actions;

export default productSlice.reducer;