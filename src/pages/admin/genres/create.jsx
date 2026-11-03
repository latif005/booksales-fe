
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGenre } from "../../../_services/genres";

export default function GenreCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createGenre({
        name,
        description,
      });

      alert("Genre berhasil ditambahkan!");
      navigate("/admin/genres");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Gagal menambahkan genre."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Add New Genre
      </h1>

      <p className="text-gray-400 mb-6">
        Tambahkan kategori buku baru.
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
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Save Genre"}
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
