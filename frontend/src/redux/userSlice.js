import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", // better to keep lowercase
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // ✅ correct
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;