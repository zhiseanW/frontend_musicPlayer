export const addToCart = (item, quantity = 1) => {
  // add product into cart. If product already exists inside the cart data, just update the quantity
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProductIndex = cart.findIndex(
    (product) => product._id === item._id
  );
  if (existingProductIndex !== -1) {
    // If the product already exists in the cart, update its quantity
    cart[existingProductIndex].quantity += quantity;
  } else {
    // Otherwise, add the product to the cart with the specified quantity
    cart.push({ ...item, quantity });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCart = () => {
  // get cart items from local storage
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const removeProductFromCart = (id) => {
  // remove the item from cart based on id provided
  let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  existingCart = existingCart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(existingCart));
};

export const emptyCart = () => {
  localStorage.removeItem("cart");
};
