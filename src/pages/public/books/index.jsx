
import { useEffect, useState } from "react";
import { getBooks } from "../../../_services/books";
import { Link } from "react-router-dom";
import { bookImageStorage } from "../../../_api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const booksData = await getBooks(search);
        setBooks(booksData);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search]);

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">

        {/* Kolom pencarian */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Daftar Buku
          </h2>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul buku..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Daftar buku */}
        {loading ? (
          <p className="py-8 text-center text-gray-500">
            Memuat data buku...
          </p>
        ) : books.length > 0 ? (
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="h-56 w-full">
                  <Link to={`/books/show/${book.id}`}>
                    <img
                      className="mx-auto h-full object-contain"
                      src={`${bookImageStorage}/${book.cover_photo}`}
                      alt={book.title}
                    />
                  </Link>
                </div>

                <div className="pt-6">
                  <Link
                    to={`/books/show/${book.id}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                  >
                    {book.title}
                  </Link>

                  <ul className="mt-2 flex items-center gap-4">
                    <li className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Fast Delivery
                      </p>
                    </li>

                    <li className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Best Price
                      </p>
                    </li>
                  </ul>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                      Rp{book.price}
                    </p>

                    <Link
                      to={`/books/show/${book.id}`}
                      className="inline-flex items-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800"
                    >
                      View detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            Buku tidak ditemukan.
          </p>
        )}

      </div>
    </section>
  );
}
