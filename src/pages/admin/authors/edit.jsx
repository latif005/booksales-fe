
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    const fetchAuthor = async () => {
      try {
        const authors = await getAuthors();
        const author = authors.find((item) => item.id === Number(id));

        if (!author) {
          setError("Data author tidak ditemukan.");
          return;
        }

        setName(author.name);
        setPhoto(author.photo || "");
        setBio(author.bio || "");
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil data author.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
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
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Gagal memperbarui author."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-300">Memuat data author...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Edit Author
      </h1>

      <p className="text-gray-400 mb-6">
        Ubah informasi penulis buku.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded-xl max-w-2xl space-y-5"
      >
        <div>
          <label className="block text-gray-300 mb-2">
            Author Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama author"
            className="w-full p-3 rounded-lg bg-[#263449] text-white border border-gray-600 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Photo
          </label>
          <input
            type="text"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="Contoh: andrea-hirata.jpg"
            className="w-full p-3 rounded-lg bg-[#263449] text-white border border-gray-600 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Masukkan biografi author"
            rows="4"
            className="w-full p-3 rounded-lg bg-[#263449] text-white border border-gray-600 outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !!error}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Update Author"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/authors")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
