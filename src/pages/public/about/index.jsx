import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getBooks } from "../../../_services/books";
import { bookImageStorage } from "../../../_api";

export default function About() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error("Gagal mengambil buku:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (location.hash === "#tentang-booksales") {
      const section = document.getElementById("tentang-booksales");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [location.hash]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-indigo-950">
        <div className="mx-auto max-w-screen-xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="mb-5 inline-block rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-300">
              Selamat Datang di BookSales
            </span>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Temukan Buku Favoritmu, Mulai Petualangan Baru
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
              Jelajahi berbagai pilihan buku menarik dan temukan bacaan yang
              sesuai dengan minatmu. Belanja buku jadi lebih mudah bersama
              BookSales.
            </p>

            <Link
              to="/books"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Jelajahi Buku
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Koleksi Buku */}
      <section className="py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Pilihan Untukmu
              </p>

              <h2 className="text-3xl font-bold text-white">
                Koleksi Buku Pilihan
              </h2>

              <p className="mt-2 text-gray-400">
                Temukan berbagai buku dari koleksi BookSales.
              </p>
            </div>

            <Link
              to="/books"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Lihat Semua Buku →
            </Link>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-400">
              Memuat koleksi buku...
            </p>
          ) : books.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 transition duration-300 hover:-translate-y-1 hover:border-indigo-500"
                >
                  <Link to={`/books/show/${book.id}`}>
                    <div className="flex h-64 items-center justify-center bg-gray-700 p-5">
                      <img
                        src={`${bookImageStorage}/${book.cover_photo}`}
                        alt={book.title}
                        className="h-full max-w-full object-contain"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link to={`/books/show/${book.id}`}>
                      <h3 className="mb-3 min-h-12 text-lg font-bold text-white hover:text-indigo-400">
                        {book.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-indigo-400">
                        {formatPrice(book.price)}
                      </p>

                      <Link
                        to={`/books/show/${book.id}`}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-gray-400">
              Belum ada buku yang tersedia.
            </p>
          )}
        </div>
      </section>

      {/* Keunggulan BookSales */}
      <section className="border-t border-gray-800 bg-gray-800/50 py-16">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white">
              Mengapa BookSales?
            </h2>

            <p className="mt-3 text-gray-400">
              Pengalaman membeli buku yang praktis dan nyaman.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-700 bg-gray-800 p-7 text-center">
              <div className="mb-4 text-4xl">📚</div>
              <h3 className="mb-2 text-lg font-bold text-white">
                Beragam Koleksi
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Temukan berbagai pilihan buku sesuai minat dan kebutuhanmu.
              </p>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gray-800 p-7 text-center">
              <div className="mb-4 text-4xl">🛒</div>
              <h3 className="mb-2 text-lg font-bold text-white">
                Pemesanan Mudah
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Pilih buku dan lakukan pemesanan dengan praktis.
              </p>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gray-800 p-7 text-center">
              <div className="mb-4 text-4xl">💳</div>
              <h3 className="mb-2 text-lg font-bold text-white">
                Pilihan Pembayaran
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Tersedia pilihan pembayaran COD dan pembayaran online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang BookSales */}
      <section
        id="tentang-booksales"
        className="scroll-mt-24 border-t border-gray-800 bg-gray-900 py-20"
      >
        <div className="mx-auto grid max-w-screen-xl items-center gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Tentang Kami
            </p>

            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              Mengenal Lebih Dekat BookSales
            </h2>

            <p className="mt-6 leading-relaxed text-gray-300">
              BookSales merupakan platform toko buku online yang dikembangkan
              untuk memudahkan pengguna dalam mencari dan memesan buku. Melalui
              BookSales, pengguna dapat menjelajahi berbagai koleksi, melihat
              informasi buku, serta memilih bacaan sesuai minat dan kebutuhan.
            </p>

            <p className="mt-4 leading-relaxed text-gray-300">
              Kami menghadirkan proses pemesanan yang praktis, mulai dari
              memilih buku, memasukkannya ke keranjang, hingga menyelesaikan
              transaksi melalui pilihan pembayaran yang tersedia.
            </p>

            <Link
              to="/books"
              className="mt-7 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Mulai Jelajahi Buku
              <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-8 md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20 text-3xl">
              📖
            </div>

            <h3 className="mb-4 text-2xl font-bold text-white">Tujuan Kami</h3>

            <p className="leading-relaxed text-gray-400">
              Menyediakan pengalaman belanja buku secara online yang mudah
              dipahami dan praktis digunakan, sehingga pengguna dapat menemukan
              serta memesan buku dalam satu platform.
            </p>

            <div className="mt-8 border-t border-gray-700 pt-6">
              <p className="text-sm font-semibold text-indigo-400">BOOKSALES</p>
              <p className="mt-1 text-sm text-gray-500">
                Temukan buku, perluas wawasan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
