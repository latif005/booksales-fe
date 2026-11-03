import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Gagal menambahkan author."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Add New Author
      </h1>

      <p className="text-gray-400 mb-6">
        Tambahkan data penulis buku baru.
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
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Save Author"}
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