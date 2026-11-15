import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createAuthor } from "../../../_services/authors";

export default function AuthorCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createAuthor({
        name,
        photo,
        bio,
      });

      alert("Author berhasil ditambahkan!");
      navigate("/admin/authors");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal menambahkan author.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-3 dark:bg-gray-900 sm:p-5">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
          {/* Header */}
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add New Author
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tambahkan informasi penulis baru ke BookSales.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-5">
            {error && (
              <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Author Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap author"
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="photo"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Photo
              </label>

              <input
                type="text"
                id="photo"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="Contoh: andrea-hirata.jpg"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />

              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Masukkan nama file foto author jika tersedia.
              </p>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Biography
              </label>

              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan biografi singkat author..."
                rows={5}
                className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700 sm:flex-row">
              <Link
                to="/admin/authors"
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Author"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
