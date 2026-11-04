
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGenres, updateGenre } from "../../../_services/genres";

export default function GenreEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        setLoading(true);

        const genres = await getGenres();
        const genre = genres.find((item) => item.id === Number(id));

        if (!genre) {
          setError("Data genre tidak ditemukan.");
          return;
        }

        setName(genre.name);
        setDescription(genre.description || "");
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil data genre.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenre();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateGenre(id, {
        name,
        description,
      });

      alert("Genre berhasil diperbarui!");
      navigate("/admin/genres");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Gagal memperbarui genre."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-300">Memuat data genre...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Edit Genre
      </h1>

      <p className="text-gray-400 mb-6">
        Ubah informasi kategori buku.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded-xl max-w-2xl space-y-5"
      >
        <div>
          <label className="block text-gray-300 mb-2">
            Genre Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama genre"
            className="w-full p-3 rounded-lg bg-[#263449] text-white border border-gray-600 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi genre"
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
            {saving ? "Menyimpan..." : "Update Genre"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/genres")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
