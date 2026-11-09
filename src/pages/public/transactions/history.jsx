import { useEffect, useState } from "react";
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
        console.log(error);
        setError("Gagal mengambil riwayat transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Riwayat Transaksi
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Daftar pembelian buku yang pernah kamu lakukan.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Memuat riwayat transaksi...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : transactions.length > 0 ? (
          <div className="grid gap-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nomor Transaksi
                    </p>
                    <h2 className="mt-1 font-semibold text-gray-900 dark:text-white">
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

                <div className="my-5 border-t border-gray-200 dark:border-gray-700"></div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-16 flex-shrink-0">
                      <img
                        src={`${bookImageStorage}/${transaction.book?.cover_photo}`}
                        alt={transaction.book?.title}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Buku yang Dibeli
                      </p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {transaction.book?.title || "Buku tidak ditemukan"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Pembayaran
                    </p>
                    <p className="mt-1 text-xl font-bold text-indigo-700 dark:text-indigo-400">
                      {formatRupiah(transaction.total_amount)}
                    </p>
                  </div>
                  <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <Link
                      to={`/transactions/detail/${transaction.id}`}
                      className="inline-flex items-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Belum Ada Transaksi
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Kamu belum pernah melakukan pembelian buku.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
