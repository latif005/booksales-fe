import { useEffect, useState } from "react";
import { getUsers } from "../../../_services/users";

export default function UsersIndex() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const data = await getUsers();

        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Gagal mengambil data pengguna:", err);

        if (isMounted) {
          setError("Gagal mengambil data pengguna.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(keyword) ||
      user.username?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.role?.toLowerCase().includes(keyword)
    );
  });

  return (
    <section className="min-h-screen bg-gray-50 p-3 dark:bg-gray-900 sm:p-5">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Users
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kelola dan pantau akun pengguna BookSales.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, username, email..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white md:w-72"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    {search
                      ? "Pengguna tidak ditemukan."
                      : "Belum ada pengguna terdaftar."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>

                    <td className="px-6 py-4">{user.username || "-"}</td>

                    <td className="px-6 py-4">{user.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            : "border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.role || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </div>
        )}
      </div>
    </section>
  );
}