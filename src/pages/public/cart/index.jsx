
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart, clearCart } from "../../../_services/cart";
import { checkoutCart } from "../../../_services/transactions";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (id) => {
    const updatedCart = removeFromCart(id);
    setCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!localStorage.getItem("accessToken")) {
      alert("Silakan login terlebih dahulu!");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang belanja masih kosong!");
      return;
    }

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin checkout dengan pembayaran COD?\nTotal: Rp ${total.toLocaleString("id-ID")}`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const payload = {
        order_number: `ORD-${Date.now()}`,
        payment_method: "COD",
        items: cart.map((item) => ({
          book_id: item.id,
          quantity: Number(item.quantity),
        })),
      };

      await checkoutCart(payload);

      clearCart();
      setCart([]);

      alert("Checkout berhasil! Silakan lakukan pembayaran saat pesanan diterima.");

      navigate("/transactions/history");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Checkout gagal. Silakan periksa stok buku dan coba lagi.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Keranjang Belanja
      </h1>

      {cart.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="mb-4">Keranjang belanja masih kosong.</p>
          <Link
            to="/books"
            className="rounded-lg bg-indigo-700 px-5 py-2 text-white"
          >
            Lihat Buku
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Nama Buku</th>
                  <th className="p-3">Harga</th>
                  <th className="p-3">Jumlah</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-right">
            <h2 className="mb-4 text-xl font-bold">
              Total: Rp {total.toLocaleString("id-ID")}
            </h2>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="rounded-lg bg-indigo-700 px-6 py-3 text-white hover:bg-indigo-800 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Checkout COD"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
