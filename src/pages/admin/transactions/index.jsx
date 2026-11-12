import { useEffect, useState } from "react";
import {
  getTransactions,
  deleteTransaction,
} from "../../../_services/transactions";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus transaksi ini?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteTransaction(id);

      setTransactions(
        transactions.filter((transaction) => transaction.id !== id),
      );

      alert("Transaksi berhasil dihapus!");
    } catch (error) {
      console.log(error);
      alert("Gagal menghapus transaksi!");
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.log(error);
        setError("Gagal mengambil data transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transaction
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Kelola seluruh transaksi pembelian Customer.
        </p>
      </div>

      {loading ? (
        <p>Memuat data transaksi...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nomor Transaksi</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Buku</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Metode Pembayaran</th>
                <th className="px-6 py-4">Status Pembayaran</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {transaction.order_number}
                    </td>
                    <td className="px-6 py-4">
                      {transaction.customer?.name || "Customer"}
                    </td>
                    <td className="px-6 py-4">
                      {transaction.book?.title || "Buku tidak ditemukan"}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {formatRupiah(transaction.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      {transaction.payment_method || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          transaction.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.payment_status || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="mr-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center">
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Detail Transaksi
              </h2>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Nomor Transaksi
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedTransaction.order_number}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedTransaction.customer?.name || "Customer"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Buku</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedTransaction.book?.title || "Buku tidak ditemukan"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Tanggal Transaksi
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(selectedTransaction.created_at)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Total Pembayaran
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatRupiah(selectedTransaction.total_amount)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Metode Pembayaran
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedTransaction.payment_method || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Status Pembayaran
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedTransaction.payment_status || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Jumlah Buku</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedTransaction.quantity || 1} buku
                </p>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg bg-gray-600 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
