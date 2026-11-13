
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart, clearCart } from "../../../_services/cart";
import { checkoutCart } from "../../../_services/transactions";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [snapReady, setSnapReady] = useState(false);

  const navigate = useNavigate();
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

  // Memuat Snap.js Midtrans
  useEffect(() => {
    if (!clientKey) {
      console.error("Midtrans Client Key belum dikonfigurasi.");
      return;
    }

    if (window.snap) {
      setSnapReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[data-midtrans-snap="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setSnapReady(true));
      return;
    }

    const script = document.createElement("script");

    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-midtrans-snap", "true");
    script.async = true;

    script.onload = () => setSnapReady(true);
    script.onerror = () => {
      console.error("Gagal memuat Midtrans Snap.");
    };

    document.body.appendChild(script);
  }, [clientKey]);

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

    if (paymentMethod === "MIDTRANS" && !snapReady) {
      alert("Midtrans Snap belum siap. Silakan coba beberapa saat lagi.");
      return;
    }

    const paymentName =
      paymentMethod === "COD" ? "COD" : "Midtrans";

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin checkout dengan pembayaran ${paymentName}?\nTotal: Rp ${total.toLocaleString("id-ID")}`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const payload = {
        order_number: `ORD-${Date.now()}`,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          book_id: item.id,
          quantity: Number(item.quantity),
        })),
      };

      const result = await checkoutCart(payload);

      if (paymentMethod === "COD") {
        clearCart();
        setCart([]);

        alert(
          "Checkout berhasil! Silakan lakukan pembayaran saat pesanan diterima."
        );

        navigate("/transactions/history");
        return;
      }

      if (!result.snap_token) {
        throw new Error("Snap Token tidak ditemukan dari server.");
      }

      // Keranjang dikosongkan karena pesanan sudah tercatat di server
      clearCart();
      setCart([]);

      setLoading(false);

      // Membuka halaman pembayaran Midtrans
      window.snap.pay(result.snap_token, {
        onSuccess: function () {
          alert("Pembayaran berhasil!");
          navigate("/transactions/history");
        },
        onPending: function () {
          alert(
            "Pembayaran belum selesai. Silakan cek status pesanan di riwayat transaksi."
          );
          navigate("/transactions/history");
        },
        onError: function () {
          alert("Pembayaran mengalami kendala. Silakan cek riwayat transaksi.");
          navigate("/transactions/history");
        },
        onClose: function () {
          alert(
            "Halaman pembayaran ditutup. Pesanan tercatat dengan status pending."
          );
          navigate("/transactions/history");
        },
      });
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.message ||
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

          <div className="mt-6">
            <h2 className="mb-4 text-xl font-bold">
              Total: Rp {total.toLocaleString("id-ID")}
            </h2>

            <h3 className="mb-3 font-semibold">
              Pilih Metode Pembayaran
            </h3>

            <div className="mb-5 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <p className="font-semibold">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-500">
                    Bayar saat pesanan diterima.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MIDTRANS"
                  checked={paymentMethod === "MIDTRANS"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <p className="font-semibold">Midtrans</p>
                  <p className="text-sm text-gray-500">
                    Pembayaran online melalui Snap Checkout.
                    {snapReady
                      ? " Siap digunakan."
                      : " Sedang memuat pembayaran..."}
                  </p>
                </div>
              </label>
            </div>

            <div className="text-right">
              <button
                onClick={handleCheckout}
                disabled={
                  loading ||
                  (paymentMethod === "MIDTRANS" && !snapReady)
                }
                className="rounded-lg bg-indigo-700 px-6 py-3 text-white hover:bg-indigo-800 disabled:opacity-50"
              >
                {loading
                  ? "Memproses..."
                  : paymentMethod === "COD"
                    ? "Checkout COD"
                    : "Bayar dengan Midtrans"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
