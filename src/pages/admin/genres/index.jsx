
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres, deleteGenre } from "../../../_services/genres";

export default function GenresIndex() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Apakah kamu yakin ingin menghapus genre ini?"
  );

  if (!confirmDelete) return;

  try {
    await deleteGenre(id);

    setGenres(genres.filter((genre) => genre.id !== id));

    alert("Genre berhasil dihapus!");
  } catch (error) {
    console.error("Gagal menghapus genre:", error);
    alert("Genre gagal dihapus!");
  }
};

useEffect(() => {
  let isMounted = true;

  const fetchGenres = async () => {
    try {
      const data = await getGenres();

      if (isMounted) {
        setGenres(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data genre:", error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchGenres();

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Genres</h1>
          <p className="text-gray-400 mt-1">
            Kelola kategori buku yang tersedia.
          </p>
        </div>

        <Link
          to="/admin/genres/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Genre
        </Link>
      </div>

      <div className="bg-[#1e293b] rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-300">Memuat data genre...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-[#263449] text-gray-300">
              <tr>
                <th className="p-4">No</th>
                <th className="p-4">Genre Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {genres.length > 0 ? (
                genres.map((genre, index) => (
                  <tr key={genre.id} className="border-t border-gray-700">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">{genre.name}</td>
                    <td className="p-4">
                      {genre.description || "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/genres/edit/${genre.id}`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(genre.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Belum ada data genre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
