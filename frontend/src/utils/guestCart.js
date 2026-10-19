const GUEST_CART_KEY = "guestCart";

// Same limit the server enforces for orders and carts.
export const MAX_QTY_PER_PRODUCT = 5;
export const MAX_QTY_MESSAGE = `Maximum ${MAX_QTY_PER_PRODUCT} units per product per order`;

export const getGuestCart = () => {
  try {
    const data = localStorage.getItem(GUEST_CART_KEY);
    if (!data) return { items: [], totalPrice: 0 };
    return JSON.parse(data);
  } catch {
    return { items: [], totalPrice: 0 };
  }
};

export const saveGuestCart = (cart) => {
  const normalizedCart = {
    items: Array.isArray(cart?.items) ? cart.items : [],
    totalPrice: Number(cart?.totalPrice || 0)
  };
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(normalizedCart));
};

export const clearGuestCart = () => {
  saveGuestCart({ items: [], totalPrice: 0 });
};

export const calculateGuestTotal = (items) => {
  return items.reduce((acc, item) => {
    const price = Number(item.price || item.productId?.productPrice || 0);
    const qty = Number(item.quantity || 0);
    return acc + price * qty;
  }, 0);
};

// Throws an Error (with a user-readable message) when the quantity is invalid
// or would exceed the per-product limit.
export const addToGuestCart = (product, quantity = 1) => {
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error("Invalid quantity");
  }

  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex(
    (item) => item.productId?._id === product._id
  );

  if (itemIndex > -1) {
    if (cart.items[itemIndex].quantity + qty > MAX_QTY_PER_PRODUCT) {
      throw new Error(MAX_QTY_MESSAGE);
    }
    cart.items[itemIndex].quantity += qty;
  } else {
    if (qty > MAX_QTY_PER_PRODUCT) {
      throw new Error(MAX_QTY_MESSAGE);
    }
    cart.items.push({
      productId: product,
      quantity: qty,
      price: product.productPrice || product.price || 0
    });
  }

  cart.totalPrice = calculateGuestTotal(cart.items);
  saveGuestCart(cart);
  return cart;
};

export const updateGuestCartQuantity = (productId, type) => {
  const cart = getGuestCart();
  const item = cart.items.find(
    (item) => item.productId?._id === productId
  );
  if (!item) return cart;

  if (type === "increase") {
    if (item.quantity >= MAX_QTY_PER_PRODUCT) {
      throw new Error(MAX_QTY_MESSAGE);
    }
    item.quantity += 1;
  } else if (type === "decrease" && item.quantity > 1) {
    item.quantity -= 1;
  }

  cart.totalPrice = calculateGuestTotal(cart.items);
  saveGuestCart(cart);
  return cart;
};

export const removeFromGuestCart = (productId) => {
  const cart = getGuestCart();
  cart.items = cart.items.filter(
    (item) => item.productId?._id !== productId
  );
  cart.totalPrice = calculateGuestTotal(cart.items);
  saveGuestCart(cart);
  return cart;
};