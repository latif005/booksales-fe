import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres, deleteGenre } from "../../../_services/genres";

export default function GenresIndex() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGenres = async () => {
      try {
        const response = await getGenres();

        if (isMounted) {
          setGenres(response || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data genre:", error);
        alert("Gagal mengambil data genre.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGenres();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus genre ini?",
    );

    if (!confirmDelete) return;

    try {
      await deleteGenre(id);
      setGenres((current) => current.filter((genre) => genre.id !== id));
      setOpenMenu(null);
    } catch (error) {
      console.error("Gagal menghapus genre:", error);
      alert("Gagal menghapus genre. Silakan coba lagi.");
    }
  };

  const filteredGenres = genres.filter((genre) =>
    `${genre.name || ""} ${genre.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const shouldOpenUp = (index) => {
    return index >= filteredGenres.length - 3;
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 min-h-screen">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Genres
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kelola daftar genre buku pada BookSales.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari genre..."
              className="w-full sm:w-64 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <Link
              to="/admin/genres/create"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
            >
              <span className="mr-2 text-lg">+</span>
              Add Genre
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Genre Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    Memuat data genre...
                  </td>
                </tr>
              ) : filteredGenres.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    Data genre tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredGenres.map((genre, index) => (
                  <tr
                    key={genre.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {genre.name}
                    </td>

                    <td className="px-6 py-4 max-w-md">
                      {genre.description || "-"}
                    </td>

                    <td className="px-6 py-4 text-center relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(openMenu === genre.id ? null : genre.id)
                        }
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        <span className="text-xl leading-none">⋮</span>
                      </button>

                      {openMenu === genre.id && (
                        <div
                          className={`absolute right-8 z-30 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-lg dark:border-gray-600 dark:bg-gray-700 ${
                            shouldOpenUp(index) ? "bottom-10" : "top-10"
                          }`}
                        >
                          <Link
                            to={`/admin/genres/edit/${genre.id}`}
                            onClick={() => setOpenMenu(null)}
                            className="flex w-full items-center px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(genre.id)}
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

        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
          Total genre: {filteredGenres.length}
        </div>
      </div>
    </section>
  );
}
