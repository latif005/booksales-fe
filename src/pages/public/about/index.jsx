
export default function About() {
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4">

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">
            About BookSales
          </h1>

          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
            Mengenal lebih dekat BookSales, platform penjualan buku
            online yang memudahkan siapa saja menemukan dan membeli buku.
          </p>
        </div>

        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Siapa Kami?
            </h2>

            <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
              BookSales merupakan aplikasi penjualan buku berbasis web
              yang menyediakan berbagai pilihan buku dari beragam genre
              dan penulis.
            </p>

            <p className="leading-relaxed text-gray-600 dark:text-gray-300">
              Aplikasi ini dikembangkan untuk memberikan pengalaman
              berbelanja buku secara praktis, mudah, dan nyaman melalui
              internet.
            </p>
          </div>

          <div className="rounded-xl bg-indigo-700 p-10 text-center text-white shadow-lg">
            <h2 className="mb-4 text-3xl font-bold">
              BookSales
            </h2>

            <p className="leading-relaxed">
              Temukan buku favoritmu dan nikmati kemudahan berbelanja
              buku secara online.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Layanan Kami
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Koleksi Buku
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Menyediakan berbagai buku berdasarkan kategori dan penulis.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Pencarian Buku
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Memudahkan pengguna menemukan buku berdasarkan judul.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Pemesanan Online
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Memudahkan pengguna melakukan pemesanan buku secara online.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}