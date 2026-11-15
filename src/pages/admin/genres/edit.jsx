import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getGenres, updateGenre } from "../../../_services/genres";

export default function GenreEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchGenre = async () => {
      try {
        const genres = await getGenres();
        const genre = genres.find((item) => item.id === Number(id));

        if (!genre) {
          throw new Error("Genre tidak ditemukan.");
        }

        if (isMounted) {
          setFormData({
            name: genre.name || "",
            description: genre.description || "",
          });
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(
            err.message === "Genre tidak ditemukan."
              ? err.message
              : "Gagal mengambil data genre.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGenre();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateGenre(id, formData);
      alert("Genre berhasil diperbarui.");
      navigate("/admin/genres");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Gagal memperbarui genre. Silakan coba lagi.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-5">
        <div className="text-center text-gray-600 dark:text-gray-300">
          Memuat data genre...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-5">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Genre
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Perbarui informasi genre buku.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Genre Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/admin/genres"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Genre"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
