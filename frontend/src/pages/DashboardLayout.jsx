import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { useAuth } from "./Auth/AuthContext";
import {
  IconDashboard,
  IconBox,
  IconOrders,
  IconUsers,
  IconLogout,
  IconMenu,
  IconClose,
} from "../helper/Icons";

const navItems = [
  { to: "/", label: "Dashboard", icon: IconDashboard, end: true },
  { to: "/products", label: "Products", icon: IconBox },
  { to: "/orders", label: "Orders", icon: IconOrders },
  { to: "/users", label: "Users", icon: IconUsers },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              A
            </div>
            <span className="text-lg font-semibold text-slate-900">AppHub</span>
          </div>
          <button
            className="text-slate-500 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClasses}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600"
        >
          <IconLogout className="h-5 w-5" />
          Log out
        </button>
      </aside>

      {/* main content */}
      <div className="flex min-h-screen flex-1 flex-col md:ml-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
          <button
            className="text-slate-500 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <IconMenu className="h-6 w-6" />
          </button>
          <div className="hidden text-sm text-slate-400 md:block">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
              {user?.name || user?.email}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}