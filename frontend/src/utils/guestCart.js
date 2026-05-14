const GUEST_CART_KEY = "guestCart";

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

export const addToGuestCart = (product) => {
  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex(
    (item) => item.productId?._id === product._id
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push({
      productId: product,
      quantity: 1,
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
