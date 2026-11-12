
import { useEffect, useState } from "react";
import { getUsers } from "../../../_services/users";

export default function UsersIndex() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil data pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Memuat data pengguna...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Daftar Pengguna
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Total pengguna: {users.length}
      </p>
    </div>
  );
}
