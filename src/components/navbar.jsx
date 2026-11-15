import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { logout } from "../_services/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = localStorage.getItem("accessToken");

  let userInfo = null;

  try {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
  } catch (error) {
    console.error("User information tidak valid:", error);
  }

  const handleLogout = async () => {
    try {
      if (token) {
        await logout({ token });
      }
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  const navClass = ({ isActive }) =>
    `block py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-indigo-400 bg-indigo-500/10"
        : "text-gray-300 hover:text-white hover:bg-gray-700"
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-md">
      <nav className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex flex-wrap items-center py-4 gap-3">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-9 w-9"
              alt="BookSales Logo"
            />

            <span className="text-2xl font-bold text-white tracking-tight">
              BookSales
            </span>
          </Link>

          {/* Tombol kanan */}
          <div className="order-2 ml-auto flex items-center gap-3 lg:order-3 lg:ml-0">
            {" "}
            {token && userInfo ? (
              <>
                <span className="hidden sm:block text-sm font-medium text-gray-200">
                  Halo, {userInfo.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white focus:outline-none lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } order-3 w-full mt-4 lg:order-2 lg:ml-0 lg:mt-0 lg:block lg:flex-1 lg:flex lg:justify-center`}
          >
            <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
              {" "}
              <li>
                <NavLink to="/" end className={navClass} onClick={closeMenu}>
                  Beranda
                </NavLink>
              </li>
              <li>
                <NavLink to="/books" className={navClass} onClick={closeMenu}>
                  Koleksi Buku
                </NavLink>
              </li>
              <li>
                <NavLink to="/cart" className={navClass} onClick={closeMenu}>
                  Keranjang
                </NavLink>
              </li>
              {token && userInfo?.role === "customer" && (
                <li>
                  <NavLink
                    to="/transactions/history"
                    className={navClass}
                    onClick={closeMenu}
                  >
                    Riwayat Transaksi
                  </NavLink>
                </li>
              )}
              {token && userInfo?.role === "admin" && (
                <li>
                  <NavLink
                    to="/admin"
                    end
                    className={navClass}
                    onClick={closeMenu}
                  >
                    Dashboard Admin
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/contact" className={navClass} onClick={closeMenu}>
                  Contact Admin
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
