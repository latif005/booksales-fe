import { useEffect, useMemo, useState } from "react";
import { getMyHistory } from "../../../_services/transactions";
import { bookImageStorage } from "../../../_api";
import { Link } from "react-router-dom";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getMyHistory();
        setTransactions(data);
      } catch (error) {
        console.error(error);
        setError("Gagal mengambil riwayat transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";

      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";

      case "failed":
      case "cancel":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 antialiased dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Akun Saya
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Riwayat Transaksi
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Lihat seluruh pesanan dan riwayat pembelian buku kamu.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              Memuat riwayat transaksi...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Transaction List */}
        {!loading && !error && groupedTransactions.length > 0 && (
          <div className="space-y-6">
            {groupedTransactions.map((transaction) => (
              <div
                key={transaction.order_number}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Transaction Header */}
                <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nomor Pesanan
                    </p>

                    <h2 className="mt-1 font-bold text-gray-900 dark:text-white">
                      {transaction.order_number}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tanggal Pembelian
                    </p>

                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>

                {/* Transaction Body */}
                <div className="grid gap-6 p-5 lg:grid-cols-3">
                  {/* Book List */}
                  <div className="space-y-4 lg:col-span-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Buku yang Dibeli ({transaction.items.length} jenis)
                    </h3>

                    {transaction.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-lg border border-gray-100 p-3 dark:border-gray-700"
                      >
                        <div className="h-24 w-16 flex-shrink-0">
                          <img
                            src={
                              item.book?.cover_photo
                                ? `${bookImageStorage}/${item.book.cover_photo}`
                                : "/placeholder.png"
                            }
                            alt={item.book?.title || "Buku"}
                            className="h-full w-full rounded-md object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.book?.title || "Buku tidak ditemukan"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {item.quantity || 1} buku
                          </p>

                          <p className="mt-2 font-semibold text-indigo-600 dark:text-indigo-400">
                            {formatRupiah(item.total_amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Summary */}
                  <div className="flex flex-col justify-between rounded-lg bg-gray-50 p-5 dark:bg-gray-700/40">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Pembayaran
                        </p>

                        <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {formatRupiah(transaction.total_amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Buku
                        </p>

                        <p className="font-semibold text-gray-900 dark:text-white">
                          {transaction.total_quantity} buku
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Metode Pembayaran
                        </p>

                        <p className="font-semibold text-gray-900 dark:text-white">
                          {transaction.payment_method || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Status Pembayaran
                        </p>

                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(transaction.payment_status)}`}
                        >
                          {transaction.payment_status || "-"}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/transactions/detail/${transaction.id}`}
                      className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Lihat Detail Pesanan
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && groupedTransactions.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-indigo-100 p-5 dark:bg-indigo-900/40">
                <svg
                  className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.7a2 2 0 002-1.6L22 7H6"
                  />
                  <circle cx="10" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Belum Ada Transaksi
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Kamu belum pernah melakukan pembelian buku.
            </p>

            <Link
              to="/books"
              className="mt-6 inline-flex rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Mulai Belanja
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
