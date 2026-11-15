import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors, deleteAuthor } from "../../../_services/authors";

export default function AuthorsIndex() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAuthors = async () => {
      try {
        const data = await getAuthors();

        if (isMounted) {
          setAuthors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Gagal mengambil data author:", err);

        if (isMounted) {
          setError("Gagal mengambil data author.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAuthors();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus author ini?",
    );

    if (!confirmDelete) return;

    try {
      await deleteAuthor(id);

      setAuthors((current) => current.filter((author) => author.id !== id));

      setOpenMenu(null);
      alert("Author berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus author:", err);
      alert("Author gagal dihapus!");
    }
  };

  const filteredAuthors = authors.filter((author) =>
    `${author.name || ""} ${author.bio || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const shouldOpenUp = (index) => {
    return index >= filteredAuthors.length - 3;
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-5">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Authors
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kelola informasi penulis buku BookSales.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama author..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-64"
            />

            <Link
              to="/admin/authors/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <span className="text-lg leading-none">+</span>
              Add Author
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Author Name</th>
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Biography</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    Memuat data author...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredAuthors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    {search
                      ? "Author tidak ditemukan."
                      : "Belum ada data author."}
                  </td>
                </tr>
              ) : (
                filteredAuthors.map((author, index) => (
                  <tr
                    key={author.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {author.name}
                    </td>

                    <td className="px-6 py-4">
                      {author.photo ? (
                        <span className="inline-block max-w-[150px] truncate rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {author.photo}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="max-w-sm px-6 py-4">
                      <p className="line-clamp-2">{author.bio || "-"}</p>
                    </td>

                    <td className="relative px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(openMenu === author.id ? null : author.id)
                        }
                        className="inline-flex items-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        <span className="text-xl leading-none">⋮</span>
                      </button>

                      {openMenu === author.id && (
                        <div
                          className={`absolute right-8 z-30 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-lg dark:border-gray-600 dark:bg-gray-700 ${
                            shouldOpenUp(index) ? "bottom-10" : "top-10"
                          }`}
                        >
                          <Link
                            to={`/admin/authors/edit/${author.id}`}
                            onClick={() => setOpenMenu(null)}
                            className="flex w-full items-center px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(author.id)}
                            className="flex w-full items-center px-4 py-2.5 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Menampilkan {filteredAuthors.length} dari {authors.length} author
          </div>
        )}
      </div>
    </section>
  );
}
