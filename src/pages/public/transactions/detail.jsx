
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTransactionById } from "../../../_services/transactions";
import { bookImageStorage } from "../../../_api";

export default function TransactionDetail() {
  const { id } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getTransactionById(id);
        setTransaction(data);
      } catch (error) {
        console.log(error);
        setError("Gagal mengambil detail transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

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

  if (loading) {
    return (
      <section className="bg-gray-50 p-10 text-center dark:bg-gray-900">
        <p className="text-gray-500">Memuat detail transaksi...</p>
      </section>
    );
  }

  if (error || !transaction) {
    return (
      <section className="bg-gray-50 p-10 text-center dark:bg-gray-900">
        <p className="text-red-600">
          {error || "Transaksi tidak ditemukan."}
        </p>
        <Link
          to="/transactions/history"
          className="mt-4 inline-block text-indigo-600 hover:underline"
        >
          Kembali ke Riwayat Transaksi
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-3xl px-4">

        <Link
          to="/transactions/history"
          className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Kembali ke Riwayat Transaksi
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8">

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detail Transaksi
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Informasi lengkap pembelian buku kamu.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Nomor Transaksi
            </p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              {transaction.order_number}
            </p>
          </div>

          <div className="my-6 flex flex-col gap-5 sm:flex-row">
            <div className="h-48 w-32 flex-shrink-0">
              <img
                src={`${bookImageStorage}/${transaction.book?.cover_photo}`}
                alt={transaction.book?.title}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Buku yang Dibeli
              </p>
              <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                {transaction.book?.title || "Buku tidak ditemukan"}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Harga buku: {formatRupiah(transaction.book?.price || 0)}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-5 dark:border-gray-700">

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Tanggal Pembelian
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(transaction.created_at)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Nama Customer
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {transaction.customer?.name || "Customer"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500 dark:text-gray-400">
                Status
              </span>
              <span className="font-medium text-green-600">
                Transaksi Tercatat
              </span>
            </div>

          </div>

          <div className="mt-6 flex justify-between border-t border-gray-200 pt-5 dark:border-gray-700">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Pembayaran
            </span>
            <span className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
              {formatRupiah(transaction.total_amount)}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
