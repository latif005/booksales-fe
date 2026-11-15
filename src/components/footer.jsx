import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-5 py-8 md:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Identitas aplikasi */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              BookSales
            </Link>

            <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Temukan dan beli buku favoritmu dengan mudah melalui BookSales.
            </p>
          </div>

          {/* Navigasi */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            <Link
              to="/"
              className="text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >
              Beranda
            </Link>

            <Link
              to="/books"
              className="text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >
              Books
            </Link>

            <Link
              to="/contact"
              className="text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >
              Contact Admin
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-7 border-t border-gray-200 pt-5 text-center dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 BookSales. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
