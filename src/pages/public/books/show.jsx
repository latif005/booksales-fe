import { useEffect, useState } from "react";
import { showBook } from "../../../_services/books";
import { useNavigate, useParams } from "react-router-dom";
import { bookImageStorage } from "../../../_api";
import { addToCart } from "../../../_services/cart";

export default function ShowBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const bookData = await showBook(id);
        setBook(bookData);
      } catch (error) {
        console.error("Gagal mengambil detail buku:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (Number(quantity) < 1 || Number(quantity) > book.stock) {
      alert("Jumlah buku tidak valid atau melebihi stok!");
      return;
    }

    addToCart(book, Number(quantity));
    alert("Buku berhasil ditambahkan ke keranjang!");
  };

  if (loading) {
    return (
      <div className="bg-gray-900 py-20 text-center text-white">
        Memuat detail buku...
      </div>
    );
  }

  if (!book.id) {
    return (
      <div className="bg-gray-900 py-20 text-center text-white">
        Buku tidak ditemukan.
      </div>
    );
  }

  const stockAvailable = Number(book.stock) > 0;

  return (
    <section className="min-h-screen bg-gray-900 py-12 text-white md:py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="grid items-start gap-12 md:grid-cols-2">
          {/* Cover Buku */}
          <div className="flex justify-center rounded-xl bg-gray-800 p-8">
            <img
              src={`${bookImageStorage}/${book.cover_photo}`}
              alt={book.title}
              className="max-h-[550px] w-auto rounded-lg object-contain shadow-lg"
            />
          </div>

          {/* Informasi Buku */}
          <div className="pt-2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Detail Buku
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">{book.title}</h1>

            {/* Harga */}
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-400">Harga Buku</p>

              <p className="text-3xl font-extrabold text-indigo-400">
                {Number(book.price).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>

            {/* Informasi Stok */}
            <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
              <p className="mb-2 text-sm text-gray-400">Ketersediaan Buku</p>

              <div className="flex items-center justify-between">
                <span className="font-medium">Stok tersedia</span>

                <span
                  className={`font-semibold ${
                    stockAvailable ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stockAvailable ? `${book.stock} buku` : "Stok habis"}
                </span>
              </div>
            </div>

            {/* Form Keranjang */}
            <form onSubmit={handleAddToCart} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium"
                >
                  Jumlah Pembelian
                </label>

                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  min={1}
                  max={book.stock}
                  disabled={!stockAvailable}
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuantity(value === "" ? "" : Number(value));
                  }}
                  className="w-32 rounded-lg border border-gray-600 bg-gray-800 p-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!stockAvailable}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-600 sm:w-auto"
              >
                {stockAvailable ? "Tambah ke Keranjang" : "Stok Habis"}
              </button>
            </form>

            {/* Deskripsi */}
            <div className="mt-10 border-t border-gray-700 pt-6">
              <h2 className="mb-3 text-xl font-bold">Deskripsi Buku</h2>

              <p className="leading-relaxed text-gray-300">
                {book.description || "Belum ada deskripsi buku."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
