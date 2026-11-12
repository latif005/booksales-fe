import { useEffect, useState } from "react";
import { getContactMessages } from "../../../_services/contact";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getContactMessages();
        setMessages(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Gagal mengambil data pesan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Kotak Pesan
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Daftar pesan yang dikirim oleh pengguna BookSales.
        </p>
      </div>

      <div className="mb-5 rounded-lg bg-white p-5 shadow dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Pesan Masuk
        </p>
        <h2 className="mt-2 text-3xl font-bold text-indigo-600">
          {messages.length}
        </h2>
      </div>

      {loading && (
        <p className="text-gray-600 dark:text-gray-300">
          Memuat pesan...
        </p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && !error && messages.length === 0 && (
        <p className="rounded-lg bg-white p-5 text-gray-600 shadow dark:bg-gray-800 dark:text-gray-300">
          Belum ada pesan masuk.
        </p>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Subjek</th>
                <th className="px-6 py-4">Pesan</th>
                <th className="px-6 py-4">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((message, index) => (
                <tr
                  key={message.id}
                  className="border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {message.name}
                  </td>
                  <td className="px-6 py-4">{message.email}</td>
                  <td className="px-6 py-4">{message.subject}</td>
                  <td className="max-w-xs px-6 py-4 whitespace-normal">
                    {message.message}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(message.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
