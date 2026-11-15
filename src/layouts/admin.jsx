import { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom";
import { logout } from "../_services/auth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("accessToken");

  let userInfo = null;

  try {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
  } catch (error) {
    userInfo = null;
  }

  useEffect(() => {
    if (!token || !userInfo) {
      navigate("/login", { replace: true });
      return;
    }

    if (userInfo.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [token, userInfo?.role, navigate]);

  const handleLogout = async () => {
    const confirmed = window.confirm("Apakah kamu yakin ingin logout?");

    if (!confirmed) return;

    try {
      if (token) {
        await logout({ token });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      navigate("/login", { replace: true });
    }
  };

  const menuGroups = [
    {
      title: "MENU UTAMA",
      items: [
        {
          name: "Overview",
          path: "/admin",
          icon: "▦",
          end: true,
        },
      ],
    },
    {
      title: "MANAJEMEN DATA",
      items: [
        { name: "Users", path: "/admin/users", icon: "♙" },
        { name: "Authors", path: "/admin/authors", icon: "✎" },
        { name: "Genres", path: "/admin/genres", icon: "◇" },
        { name: "Books", path: "/admin/books", icon: "▤" },
      ],
    },
    {
      title: "TRANSAKSI & PESAN",
      items: [
        {
          name: "Transaction",
          path: "/admin/transactions",
          icon: "▣",
        },
        {
          name: "Kotak Pesan",
          path: "/admin/contact-messages",
          icon: "✉",
        },
      ],
    },
  ];

  const adminName = userInfo?.name || "Administrator";

  const initials = adminName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-700 bg-slate-800">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-2 text-gray-300 hover:bg-slate-700 md:hidden"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-6 w-6"
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
            </button>

            <Link to="/admin" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-lg font-bold text-white">
                B
              </div>

              <span className="text-xl font-bold text-white">
                BookSales
                <span className="ml-1 font-medium text-blue-400">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">{adminName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 flex w-64 flex-col border-r border-slate-700 bg-slate-800 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-7">
              <p className="mb-3 px-3 text-xs font-semibold tracking-wide text-slate-500">
                {group.title}
              </p>

              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={menuClass}
                    >
                      <span className="flex h-6 w-6 items-center justify-center text-lg">
                        {item.icon}
                      </span>

                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-slate-700 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="flex h-6 w-6 items-center justify-center text-lg">
              ↪
            </span>
            <span>Logout</span>
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            BookSales Admin © 2026
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="min-h-screen pt-16 md:pl-64">
        <main className="min-h-[calc(100vh-4rem)] w-full bg-slate-900 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
