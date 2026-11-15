import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getAuthors, updateAuthor } from "../../../_services/authors";

export default function AuthorEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAuthor = async () => {
      try {
        const authors = await getAuthors();
        const author = authors.find((item) => Number(item.id) === Number(id));

        if (!author) {
          throw new Error("Data author tidak ditemukan.");
        }

        if (isMounted) {
          setName(author.name || "");
          setPhoto(author.photo || "");
          setBio(author.bio || "");
        }
      } catch (err) {
        console.error(err);

        if (isMounted) {
          setError(
            err.message === "Data author tidak ditemukan."
              ? err.message
              : "Gagal mengambil data author.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAuthor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateAuthor(id, {
        name,
        photo,
        bio,
      });

      alert("Author berhasil diperbarui!");
      navigate("/admin/authors");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal memperbarui author.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-5 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Memuat data author...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-3 dark:bg-gray-900 sm:p-5">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
          {/* Header */}
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Author
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Perbarui informasi penulis yang sudah terdaftar.
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
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />

              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Masukkan nama file foto author jika ingin mengubahnya.
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
                className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                disabled={saving || !!error}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Author"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
