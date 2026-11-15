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
      'script[data-midtrans-snap="true"]',
    );

    if (existingScript) {
      const handleLoad = () => setSnapReady(true);

      existingScript.addEventListener("load", handleLoad);
      return () => {
        existingScript.removeEventListener("load", handleLoad);
      };
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

  // Mengambil data keranjang
  useEffect(() => {
    setCart(getCart());
  }, []);

  // Format harga rupiah
  const formatRupiah = (price) => {
    return `Rp ${Number(price).toLocaleString("id-ID")}`;
  };

  // Menghapus buku dari keranjang
  const handleRemove = (id) => {
    const updatedCart = removeFromCart(id);
    setCart(updatedCart);
  };

  // Menghitung total belanja
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  // Proses checkout
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

    const paymentName = paymentMethod === "COD" ? "COD" : "Midtrans";

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin checkout dengan pembayaran ${paymentName}?\nTotal: ${formatRupiah(total)}`,
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
          "Checkout berhasil! Silakan lakukan pembayaran saat pesanan diterima.",
        );

        navigate("/transactions/history");
        return;
      }

      if (!result.snap_token) {
        throw new Error("Snap Token tidak ditemukan dari server.");
      }

      clearCart();
      setCart([]);

      setLoading(false);

      window.snap.pay(result.snap_token, {
        onSuccess: function () {
          alert("Pembayaran berhasil!");
          navigate("/transactions/history");
        },
        onPending: function () {
          alert(
            "Pembayaran belum selesai. Silakan cek status pesanan di riwayat transaksi.",
          );
          navigate("/transactions/history");
        },
        onError: function () {
          alert("Pembayaran mengalami kendala. Silakan cek riwayat transaksi.");
          navigate("/transactions/history");
        },
        onClose: function () {
          alert(
            "Halaman pembayaran ditutup. Pesanan tercatat dengan status pending.",
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
    <section className="min-h-screen bg-gray-900 py-10 text-white md:py-14">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
            BookSales
          </p>

          <h1 className="text-3xl font-bold text-white">Keranjang Belanja</h1>

          <p className="mt-2 text-gray-400">
            Periksa kembali buku pilihanmu sebelum melakukan checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Keranjang Kosong */
          <div className="rounded-xl border border-gray-700 bg-gray-800 px-6 py-16 text-center shadow-sm">
            <div className="mb-5 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10">
                <svg
                  className="h-10 w-10 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 7H6"
                  />
                  <circle cx="10" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                </svg>
              </div>
            </div>

            <h2 className="mb-2 text-xl font-bold text-white">
              Keranjang Masih Kosong
            </h2>

            <p className="mx-auto mb-6 max-w-md text-gray-400">
              Kamu belum menambahkan buku ke keranjang. Yuk, temukan buku
              menarik untuk dibaca!
            </p>

            <Link
              to="/books"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Jelajahi Koleksi Buku
              <span className="ml-2">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Daftar Keranjang */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-sm">
                <div className="border-b border-gray-700 px-6 py-5">
                  <h2 className="text-lg font-bold text-white">
                    Buku Pilihanmu
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {cart.length} jenis buku dalam keranjang
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-700/60 text-xs uppercase text-gray-300">
                      <tr>
                        <th className="whitespace-nowrap px-6 py-4">
                          Nama Buku
                        </th>
                        <th className="whitespace-nowrap px-6 py-4">Harga</th>
                        <th className="whitespace-nowrap px-6 py-4">Jumlah</th>
                        <th className="whitespace-nowrap px-6 py-4">
                          Subtotal
                        </th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                      {cart.map((item) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-gray-700/30"
                        >
                          <td className="whitespace-nowrap px-6 py-5 font-semibold text-white">
                            {item.title}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-gray-300">
                            {formatRupiah(item.price)}
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {item.quantity}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 font-semibold text-indigo-400">
                            {formatRupiah(
                              Number(item.price) * Number(item.quantity),
                            )}
                          </td>

                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-600 hover:text-white"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-700 px-6 py-4">
                  <Link
                    to="/books"
                    className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
                  >
                    ← Lanjutkan Belanja
                  </Link>
                </div>
              </div>
            </div>

            {/* Ringkasan Pesanan */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-5">
                {/* Total */}
                <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-bold text-white">
                    Ringkasan Pesanan
                  </h2>

                  <div className="flex justify-between border-b border-gray-700 pb-4 text-sm">
                    <span className="text-gray-400">Jumlah jenis buku</span>

                    <span className="font-semibold text-white">
                      {cart.length} buku
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <span className="font-semibold text-gray-300">
                      Total Pembayaran
                    </span>

                    <span className="text-xl font-extrabold text-indigo-400">
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>

                {/* Metode Pembayaran */}
                <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-white">
                    Metode Pembayaran
                  </h2>

                  <div className="space-y-3">
                    {/* COD */}
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                        paymentMethod === "COD"
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 h-4 w-4 accent-indigo-500"
                      />

                      <div>
                        <p className="font-semibold text-white">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Bayar saat pesanan diterima.
                        </p>
                      </div>
                    </label>

                    {/* Midtrans */}
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                        paymentMethod === "MIDTRANS"
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="MIDTRANS"
                        checked={paymentMethod === "MIDTRANS"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 h-4 w-4 accent-indigo-500"
                      />

                      <div>
                        <p className="font-semibold text-white">Midtrans</p>

                        <p className="mt-1 text-xs text-gray-400">
                          Pembayaran online melalui Snap Checkout.
                        </p>

                        <p
                          className={`mt-2 text-xs font-medium ${
                            snapReady ? "text-green-400" : "text-yellow-400"
                          }`}
                        >
                          {snapReady
                            ? "● Siap digunakan"
                            : "● Sedang memuat pembayaran..."}
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Tombol Checkout */}
                  <button
                    onClick={handleCheckout}
                    disabled={
                      loading || (paymentMethod === "MIDTRANS" && !snapReady)
                    }
                    className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Memproses Pesanan..."
                      : paymentMethod === "COD"
                        ? "Checkout Sekarang"
                        : "Bayar dengan Midtrans"}
                  </button>

                  <p className="mt-4 text-center text-xs text-gray-500">
                    Pastikan pesanan dan metode pembayaran sudah benar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
