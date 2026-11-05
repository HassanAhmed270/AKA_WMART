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

// 🔹 Root Reducer
const rootReducer = combineReducers({
  user: userSlice,
  products: productSlice,
});

// 🔹 Store factory
// The browser creates a persisted store; the server passes a memory storage and
// persist: false so no localStorage is touched and no persistStore is called.
export const createAppStore = ({ storage, persist = true, preloadedState } = {}) => {
  // 🔹 Persist Config
  const persistConfig = {
    key: "Ekart",
    version: 1,
    storage,
    whitelist: ["user"], // only user persists
  };

  const reducer = persist ? persistReducer(persistConfig, rootReducer) : rootReducer;

  const store = configureStore({
    reducer,
    preloadedState,
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

  const persistor = persist ? persistStore(store) : null;

  return { store, persistor };
};

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

// Browser-only module-scope store so the server entry never touches localStorage.
const browser = typeof window !== "undefined"
  ? createAppStore({ storage: safeStorage, persist: true })
  : null;

// 🔹 Persistor
export const persistor = browser?.persistor;

// 🔹 Export Store
export default browser?.store;
