import userSlice from "./userSlice";
import productSlice from "./productSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// 🔹 Safe fallback for localStorage
const safeStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve(true);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// 🔹 Persist Config
const persistConfig = {
  key: "Ekart",
  version: 1,
  storage: safeStorage,
  whitelist: ["user"], // only user persists
};

// 🔹 Root Reducer (✅ FIXED HERE)
const rootReducer = combineReducers({
  user: userSlice,
  products: productSlice,   // ✅ ADDED (this was missing)
});

// 🔹 Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

// 🔹 Persistor
export const persistor = persistStore(store);

// 🔹 Export Store
export default store;