// Mengambil key keranjang berdasarkan ID pengguna
const getCartKey = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo?.id) {
      return `bookSalesCart_${userInfo.id}`;
    }

    return "bookSalesCart_guest";
  } catch (error) {
    return "bookSalesCart_guest";
  }
};

// Mengambil data keranjang
export const getCart = () => {
  const CART_KEY = getCartKey();

  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

// Menambahkan buku ke keranjang
export const addToCart = (book, quantity) => {
  const CART_KEY = getCartKey();
  const cart = getCart();

  const existingBook = cart.find((item) => item.id === book.id);

  if (existingBook) {
    existingBook.quantity += Number(quantity);
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      price: book.price,
      cover_photo: book.cover_photo,
      quantity: Number(quantity),
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  return cart;
};

// Menghapus buku dari keranjang
export const removeFromCart = (id) => {
  const CART_KEY = getCartKey();

  const cart = getCart().filter((item) => item.id !== id);

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  return cart;
};

// Mengosongkan keranjang pengguna yang sedang login
export const clearCart = () => {
  const CART_KEY = getCartKey();

  localStorage.removeItem(CART_KEY);
};
