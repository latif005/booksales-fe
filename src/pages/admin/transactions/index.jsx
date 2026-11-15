import { useEffect, useMemo, useState } from "react";
import { getTransactions } from "../../../_services/transactions";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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

  // Mengelompokkan transaksi berdasarkan nomor pesanan
  const groupedTransactions = useMemo(() => {
    const groups = {};

    transactions.forEach((transaction) => {
      const key = transaction.order_number || `ORDER-${transaction.id}`;

      if (!groups[key]) {
        groups[key] = {
          order_number: key,
          id: transaction.id,
          customer: transaction.customer,
          created_at: transaction.created_at,
          payment_method: transaction.payment_method,
          payment_status: transaction.payment_status,
          items: [],
          total_amount: 0,
          total_quantity: 0,
        };
      }

      groups[key].items.push(transaction);
      groups[key].total_amount += Number(transaction.total_amount || 0);
      groups[key].total_quantity += Number(transaction.quantity || 1);
    });

    return Object.values(groups).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  }, [transactions]);

  // Pencarian pesanan
  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase();

    return groupedTransactions.filter((transaction) => {
      const orderNumber = transaction.order_number?.toLowerCase() || "";
      const customerName = transaction.customer?.name?.toLowerCase() || "";

      const bookTitles = transaction.items
        .map((item) => item.book?.title || "")
        .join(" ")
        .toLowerCase();

      return (
        orderNumber.includes(keyword) ||
        customerName.includes(keyword) ||
        bookTitles.includes(keyword)
      );
    });
  }, [groupedTransactions, search]);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      case "failed":
      case "cancel":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "paid":
        return "Paid";

      case "pending":
        return "Pending";

      case "failed":
      case "cancel":
        return "Failed";

      default:
        return status || "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Memuat data transaksi...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola dan lihat seluruh pesanan yang dilakukan customer.
        </p>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Pesanan
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white">
            {groupedTransactions.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Item Buku Terjual
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white">
            {groupedTransactions.reduce(
              (total, transaction) => total + transaction.total_quantity,
              0,
            )}
          </p>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white">
              Daftar Pesanan
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Satu pesanan ditampilkan dalam satu baris.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor pesanan, customer, atau buku..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-900 sm:max-w-xs"
          />
        </div>

        {error ? (
          <div className="p-6 text-center text-sm text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-4 font-medium">No.</th>
                  <th className="px-5 py-4 font-medium">Nomor Pesanan</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Buku</th>
                  <th className="px-5 py-4 font-medium">Tanggal</th>
                  <th className="px-5 py-4 font-medium">Total</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-center font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <tr
                      key={transaction.order_number}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {transaction.order_number}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {transaction.items.length} jenis buku
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {transaction.customer?.name || "-"}
                      </td>

                      <td className="max-w-[230px] px-5 py-4">
                        <p className="truncate font-medium text-gray-700 dark:text-gray-300">
                          {transaction.items[0]?.book?.title ||
                            "Buku tidak ditemukan"}
                        </p>

                        {transaction.items.length > 1 && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            +{transaction.items.length - 1} buku lainnya
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Total {transaction.total_quantity} buku
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.created_at)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800 dark:text-white">
                        {formatRupiah(transaction.total_amount)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            transaction.payment_status,
                          )}`}
                        >
                          {getStatusLabel(transaction.payment_status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      {search
                        ? "Pesanan yang dicari tidak ditemukan."
                        : "Belum ada data transaksi."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Menampilkan {filteredTransactions.length} dari{" "}
          {groupedTransactions.length} pesanan
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Detail Pesanan
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedTransaction.order_number}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Informasi Pesanan */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customer
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {selectedTransaction.customer?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tanggal Pesanan
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {formatDate(selectedTransaction.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Metode Pembayaran
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white">
                    {selectedTransaction.payment_method || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Status Pembayaran
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      selectedTransaction.payment_status,
                    )}`}
                  >
                    {getStatusLabel(selectedTransaction.payment_status)}
                  </span>
                </div>
              </div>

              {/* Daftar Buku */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-800 dark:text-white">
                  Buku yang Dibeli
                </h3>

                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                  {selectedTransaction.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {item.book?.title || "Buku tidak ditemukan"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Jumlah: {item.quantity || 1}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                        {formatRupiah(item.total_amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ringkasan Total */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Total item</span>
                  <span>{selectedTransaction.total_quantity} buku</span>
                </div>

                <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
                  <span className="font-semibold text-gray-800 dark:text-white">
                    Total Pembayaran
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatRupiah(selectedTransaction.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-200 px-6 py-4 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
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
