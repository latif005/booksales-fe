import { Link } from "react-router-dom";

export default function Dashboard() {
  const menus = [
    {
      title: "Kelola Buku",
      description: "Mengatur koleksi buku, harga, stok, dan informasi buku.",
      path: "/admin/books",
      icon: "▤",
    },
    {
      title: "Kelola Penulis",
      description: "Mengelola informasi dan data penulis buku.",
      path: "/admin/authors",
      icon: "✎",
    },
    {
      title: "Kelola Genre",
      description: "Mengatur kategori dan genre koleksi buku.",
      path: "/admin/genres",
      icon: "◇",
    },
    {
      title: "Kelola Pengguna",
      description: "Melihat dan mengelola akun pengguna BookSales.",
      path: "/admin/users",
      icon: "♙",
    },
    {
      title: "Data Transaksi",
      description: "Memantau pesanan dan status pembayaran pelanggan.",
      path: "/admin/transactions",
      icon: "▣",
    },
    {
      title: "Kotak Pesan",
      description: "Melihat pesan dan pertanyaan dari pelanggan.",
      path: "/admin/contact-messages",
      icon: "✉",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] w-full min-w-0 overflow-x-hidden bg-slate-900 p-5 text-gray-200 md:p-8 lg:p-9">
      {" "}
      {/* HEADER */}
      <div className="mb-9 border-b border-slate-700 pb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
          Administrator
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Selamat datang di panel administrasi BookSales. Kelola seluruh
          aktivitas toko buku melalui halaman ini.
        </p>
      </div>
      {/* WELCOME SECTION */}
      <div className="mb-9 flex flex-col justify-between gap-5 rounded-lg border border-slate-700 bg-slate-800 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <p className="text-sm font-medium text-blue-400">
            BOOKSALES ADMIN PANEL
          </p>

          <h2 className="mt-3 text-xl font-semibold text-white md:text-2xl">
            Selamat Datang, Admin
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            Pastikan data buku, pengguna, dan transaksi selalu terkelola dengan
            baik untuk mendukung operasional BookSales.
          </p>
        </div>

        <Link
          to="/admin/books"
          className="inline-flex w-fit shrink-0 items-center gap-3 rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Kelola Buku
          <span>→</span>
        </Link>
      </div>
      {/* MENU SECTION */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Menu Pengelolaan</h2>

        <p className="mt-1 text-sm text-slate-400">
          Pilih menu untuk mengakses dan mengelola data aplikasi.
        </p>
      </div>
      {/* MENU CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {menus.map((menu, index) => (
          <Link
            key={menu.title}
            to={menu.path}
            className="group rounded-lg border border-slate-700 bg-slate-800 p-5 transition duration-200 hover:border-blue-500 hover:bg-slate-800/80"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-600 bg-slate-700 text-lg text-blue-400">
                {menu.icon}
              </div>

              <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-400">
                →
              </span>
            </div>

            <h3 className="mt-5 font-semibold text-white">{menu.title}</h3>

            <p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-400">
              {menu.description}
            </p>

            <div className="mt-5 border-t border-slate-700 pt-4">
              <span className="text-sm font-medium text-blue-400 transition group-hover:text-blue-300">
                Buka Menu
              </span>
            </div>
          </Link>
        ))}
      </div>
      {/* INFORMATION */}
      <div className="mt-9 border-t border-slate-700 pt-5">
        <p className="text-xs leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-400">
            BookSales Administration
          </span>{" "}
          — Gunakan panel ini untuk mengelola koleksi buku, penulis, genre,
          pengguna, dan transaksi.
        </p>
      </div>
    </div>
  );
}
