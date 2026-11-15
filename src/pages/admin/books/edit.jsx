import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthors } from "../../../_services/authors";
import { getGenres } from "../../../_services/genres";
import { showBook, updateBook } from "../../../_services/books";

export default function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    genre_id: "",
    author_id: "",
    cover_photo: null,
    description: "",
    _method: "PUT",
  });

  const [existingCover, setExistingCover] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresData, authorsData, bookData] = await Promise.all([
          getGenres(),
          getAuthors(),
          showBook(id),
        ]);

        setGenres(genresData || []);
        setAuthors(authorsData || []);

        setExistingCover(bookData.cover_photo || "");

        setFormData({
          title: bookData.title || "",
          price: bookData.price ?? "",
          stock: bookData.stock ?? "",
          genre_id: bookData.genre_id ?? "",
          author_id: bookData.author_id ?? "",
          cover_photo: null,
          description: bookData.description || "",
          _method: "PUT",
        });
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil data buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "cover_photo" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      for (const key in formData) {
        if (key === "cover_photo") {
          if (formData.cover_photo instanceof File) {
            payload.append("cover_photo", formData.cover_photo);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }

      await updateBook(id, payload);
      navigate("/admin/books");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui buku. Silakan coba lagi.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <section className="min-h-screen bg-gray-50 p-3 sm:p-5 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-5 shadow-md sm:p-6 dark:bg-gray-800">
          {/* Header */}
          <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Book
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Perbarui informasi buku yang tersedia di BookSales.
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Memuat data buku...
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label htmlFor="title" className={labelClass}>
                    Book Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Masukkan judul buku"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className={labelClass}>
                    Price (Rp)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="stock" className={labelClass}>
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="genre_id" className={labelClass}>
                    Genre
                  </label>
                  <select
                    name="genre_id"
                    id="genre_id"
                    value={formData.genre_id}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">-- Select Genre --</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="author_id" className={labelClass}>
                    Author
                  </label>
                  <select
                    name="author_id"
                    id="author_id"
                    value={formData.author_id}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">-- Select Author --</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cover Photo */}
                <div className="sm:col-span-2">
                  <label htmlFor="cover_photo" className={labelClass}>
                    Cover Photo
                  </label>

                  {existingCover && (
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      Cover saat ini: {existingCover}
                    </p>
                  )}

                  <input
                    type="file"
                    name="cover_photo"
                    id="cover_photo"
                    accept="image/*"
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  />

                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Kosongkan jika tidak ingin mengganti cover buku.
                  </p>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Masukkan deskripsi buku..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-700">
                <Link
                  to="/admin/books"
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  Update Book
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}