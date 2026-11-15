import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks } from "../../../_services/books";
import { getGenres } from "../../../_services/genres";
import { getAuthors } from "../../../_services/authors";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, genresData, authorsData] = await Promise.all([
          getBooks(),
          getGenres(),
          getAuthors(),
        ]);

        setBooks(Array.isArray(booksData) ? booksData : []);
        setGenres(Array.isArray(genresData) ? genresData : []);
        setAuthors(Array.isArray(authorsData) ? authorsData : []);
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil data buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGenreName = (id) => {
    const genre = genres.find((item) => Number(item.id) === Number(id));
    return genre ? genre.name : "Unknown Genre";
  };

  const getAuthorName = (id) => {
    const author = authors.find((item) => Number(item.id) === Number(id));
    return author ? author.name : "Unknown Author";
  };

  const filteredBooks = books.filter((book) => {
    const keyword = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(keyword) ||
      getGenreName(book.genre_id).toLowerCase().includes(keyword) ||
      getAuthorName(book.author_id).toLowerCase().includes(keyword)
    );
  });

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const shouldOpenUp = (index) => {
    return index >= filteredBooks.length - 3;
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus buku ini?",
    );

    if (!confirmDelete) return;

    try {
      await deleteBook(id);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      setOpenDropdownId(null);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus buku. Silakan coba lagi.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Books
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kelola data buku yang tersedia di BookSales.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Cari buku, genre, penulis..."
              />
            </div>

            {/* Add Book */}
            <Link
              to="/admin/books/create"
              className="flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                />
              </svg>
              Add Book
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    Memuat data buku...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr
                    key={book.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {book.title}
                    </th>

                    <td className="px-4 py-3 whitespace-nowrap">
                      Rp {Number(book.price).toLocaleString("id-ID")}
                    </td>

                    <td className="px-4 py-3">{book.stock}</td>

                    <td className="px-4 py-3">{book.cover_photo || "-"}</td>

                    <td className="px-4 py-3">{getGenreName(book.genre_id)}</td>

                    <td className="px-4 py-3">
                      {getAuthorName(book.author_id)}
                    </td>

                    <td className="px-4 py-3 text-right relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(book.id)}
                        className="inline-flex items-center p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg"
                        aria-label="Book actions"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>

                      {openDropdownId === book.id && (
                        <div
                          className={`absolute right-4 z-30 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700 ${
                            shouldOpenUp(index) ? "bottom-10" : "top-10"
                          }`}
                        >
                          <Link
                            to={`/admin/books/edit/${book.id}`}
                            onClick={() => setOpenDropdownId(null)}
                            className="flex w-full items-center px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(book.id)}
                            className="flex w-full items-center px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {search
                      ? "Buku yang dicari tidak ditemukan."
                      : "Belum ada data buku."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {filteredBooks.length} dari {books.length} buku
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
