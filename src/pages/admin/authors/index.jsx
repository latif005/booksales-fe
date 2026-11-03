import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "../../../_services/authors";

export default function AuthorsIndex() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAuthors = async () => {
      try {
        const data = await getAuthors();

        if (isMounted) {
          setAuthors(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data author:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAuthors();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Authors</h1>
          <p className="text-gray-400 mt-1">
            Kelola data penulis buku yang tersedia.
          </p>
        </div>

        <Link
          to="/admin/authors/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Author
        </Link>
      </div>

      <div className="bg-[#1e293b] rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-300">Memuat data author...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-[#263449] text-gray-300">
              <tr>
                <th className="p-4">No</th>
                <th className="p-4">Author Name</th>
                <th className="p-4">Photo</th>
                <th className="p-4">Bio</th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {authors.length > 0 ? (
                authors.map((author, index) => (
                  <tr key={author.id} className="border-t border-gray-700">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">{author.name}</td>
                    <td className="p-4">{author.photo || "-"}</td>
                    <td className="p-4">{author.bio || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Belum ada data author.
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