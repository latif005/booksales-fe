const CART_KEY = "bookSalesCart";

// Mengambil data keranjang
export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

// Menambahkan buku ke keranjang
export const addToCart = (book, quantity) => {
  const cart = getCart();

  const existingBook = cart.find(
    (item) => item.id === book.id
  );

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
  const cart = getCart().filter(
    (item) => item.id !== id
  );

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  return cart;
};

// Mengosongkan seluruh keranjang
export const clearCart = () => {
  localStorage.removeItem("bookSalesCart");
};