import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { createAppStore } from "./redux/store";
import { CartContext } from "./CartContext";
import routes from "./routes";

const memoryStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

export async function render(url, { products = [] } = {}) {
  const { store } = createAppStore({
    storage: memoryStorage,
    persist: false,
    preloadedState: {
      user: { user: null },
      products: {
        products,
        cart: { items: [], totalPrice: 0 },
        addresses: [],
        selectedAddress: null,
      },
    },
  });

  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request("http://localhost" + url));
  const router = createStaticRouter(handler.dataRoutes, context);
  const cart = store.getState().products.cart;

  const html = renderToString(
    <Provider store={store}>
      <CartContext.Provider value={{ cart }}>
        <StaticRouterProvider router={router} context={context} />
      </CartContext.Provider>
    </Provider>
  );

  return { html, status: context.statusCode ?? 200 };
}
