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
        console.error(error);
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
    }).format(amount || 0);
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
      <section className="min-h-screen bg-gray-900 p-10 text-center">
        <p className="text-gray-300">Memuat detail transaksi...</p>
      </section>
    );
  }

  if (error || !transaction) {
    return (
      <section className="min-h-screen bg-gray-900 p-10 text-center">
        <p className="text-red-400">{error || "Transaksi tidak ditemukan."}</p>
        <Link
          to="/transactions/history"
          className="mt-4 inline-block text-indigo-400 hover:underline"
        >
          Kembali ke Riwayat Transaksi
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-900 py-10 text-white">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          to="/transactions/history"
          className="mb-6 inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          ← Kembali ke Riwayat Transaksi
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-700 p-6 md:p-8">
            <p className="text-sm font-medium text-indigo-400">
              DETAIL PESANAN
            </p>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Informasi Transaksi
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Berikut rincian seluruh buku dalam pesanan kamu.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Nomor Pesanan</p>
                <p className="mt-1 font-semibold">{transaction.order_number}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Tanggal Pembelian</p>
                <p className="mt-1 font-semibold">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Daftar Buku */}
          <div className="p-6 md:p-8">
            <h2 className="mb-5 text-lg font-bold">
              Buku yang Dibeli ({transaction.items?.length || 0})
            </h2>

            <div className="space-y-4">
              {transaction.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-700 bg-gray-900/60 p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-28 w-20 flex-shrink-0">
                    <img
                      src={
                        item.book?.cover_photo
                          ? `${bookImageStorage}/${item.book.cover_photo}`
                          : ""
                      }
                      alt={item.book?.title || "Cover buku"}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {item.book?.title || "Buku tidak ditemukan"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      Harga satuan:{" "}
                      {formatRupiah(
                        item.quantity > 0
                          ? item.total_amount / item.quantity
                          : 0,
                      )}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Jumlah: {item.quantity} buku
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-gray-400">Subtotal</p>
                    <p className="mt-1 text-lg font-bold text-indigo-400">
                      {formatRupiah(item.total_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informasi Pembayaran */}
          <div className="border-t border-gray-700 p-6 md:p-8">
            <h2 className="mb-5 text-lg font-bold">Informasi Pembayaran</h2>

            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Nama Customer</span>
                <span className="font-medium">
                  {transaction.customer?.name || "Customer"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Jumlah Buku</span>
                <span className="font-medium">
                  {transaction.total_quantity} buku
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Metode Pembayaran</span>
                <span className="font-medium">
                  {transaction.payment_method || "-"}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-400">Status Pembayaran</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    transaction.payment_status === "success"
                      ? "bg-green-500/20 text-green-400"
                      : transaction.payment_status === "failed"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {transaction.payment_status || "pending"}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-6">
              <span className="text-lg font-semibold">Total Pembayaran</span>

              <span className="text-xl font-bold text-indigo-400 md:text-2xl">
                {formatRupiah(transaction.total_amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/books"
            className="inline-flex rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Belanja Buku Lagi
          </Link>
        </div>
      </div>
    </section>
  );
}
