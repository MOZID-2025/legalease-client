"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, LogOut, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();

  // =========================
  // State
  // =========================
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // =========================
  // Dropdown Ref
  // =========================
  const dropdownRef = useRef(null);

  // =========================
  // Better Auth Session
  // =========================
  const { data: session } = useSession();
  const user = session?.user;

  const isLoggedIn = !!user;

  // =========================
  // Close Dropdown Outside
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // Close Mobile Menu
  // =========================
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    try {
      await signOut();

      setDropdownOpen(false);
      setMobileOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // =========================
  // Navigation Items
  // =========================
  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Browse Lawyers",
      href: "/browse-lawyers",
    },
  ];

  // =========================
  // Dashboard URL
  // =========================
  const getDashboardUrl = () => {
    if (user?.role === "lawyer") {
      return "/dashboard/lawyer";
    }

    if (user?.role === "admin") {
      return "/dashboard/admin";
    }

    return "/dashboard/client";
  };

  // =========================
  // Profile URL
  // =========================
  const getProfileUrl = () => {
    if (user?.role === "lawyer") {
      return "/dashboard/lawyer/update-profile";
    }

    if (user?.role === "admin") {
      return "/dashboard/admin/manage-users";
    }

    return "/dashboard/client/update-profile";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* =========================
              Logo
          ========================= */}
          <Logo />

          {/* =========================
              Desktop Navigation
          ========================= */}
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition ${
                  pathname === item.href
                    ? "text-amber-400"
                    : "text-gray-300 hover:text-amber-400"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Dashboard */}
            {isLoggedIn && (
              <Link
                href={getDashboardUrl()}
                className={`font-medium transition ${
                  pathname.startsWith("/dashboard")
                    ? "text-amber-400"
                    : "text-gray-300 hover:text-amber-400"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* =========================
              Desktop Right Side
          ========================= */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search lawyers..."
                className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-black placeholder:text-gray-400 outline-none focus:border-amber-400"
              />
            </div>

            {/* =========================
                Logged Out
            ========================= */}
            {!isLoggedIn && (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:scale-105"
                >
                  Login
                </Link>

                {/* <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:scale-105"
                >
                  Signup
                </Link> */}
              </div>
            )}

            {/* =========================
                Logged In
            ========================= */}
            {isLoggedIn && (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex cursor-pointer items-center outline-none transition-transform hover:scale-105 focus:outline-none"
                  aria-label="Open user menu"
                >
                  <img
                    src={user?.image || "https://i.pravatar.cc/100?img=12"}
                    alt={user?.name || "User"}
                    className="h-10 w-10 rounded-full border-2 border-amber-400 object-cover shadow-md shadow-amber-500/10"
                  />
                </button>

                {/* =========================
                    Dropdown
                ========================= */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 py-2 shadow-2xl backdrop-blur-xl">
                    {/* User Info */}
                    <div className="mb-1 border-b border-white/10 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {user?.role || "user"} Account
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-white">
                        {user?.name || "User"}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {user?.email || ""}
                      </p>
                    </div>

                    {/* My Dashboard */}
                    <Link
                      href={getDashboardUrl()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-amber-400"
                    >
                      <LayoutDashboard size={17} />
                      <span>My Dashboard</span>
                    </Link>

                    {/* Profile Settings */}
                    <Link
                      href={getProfileUrl()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-amber-400"
                    >
                      <User size={17} />
                      <span>Profile Settings</span>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-3 border-t border-white/10 px-4 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut size={17} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =========================
              Mobile Menu Button
          ========================= */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="cursor-pointer text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* =========================
          Mobile Menu
      ========================= */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl lg:hidden">
          <div className="space-y-4 px-6 py-5">
            {/* Mobile Nav Items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block font-medium ${
                  pathname === item.href
                    ? "text-amber-400"
                    : "text-gray-300 hover:text-amber-400"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Dashboard */}
            {isLoggedIn && (
              <div className="border-t border-white/10 pt-4">
                <p className="mb-2 text-sm font-semibold text-amber-400">
                  Dashboard
                </p>

                <Link
                  href={getDashboardUrl()}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-gray-300 hover:text-amber-400"
                >
                  My Dashboard
                </Link>

                <Link
                  href={getProfileUrl()}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-gray-300 hover:text-amber-400"
                >
                  Profile Settings
                </Link>
              </div>
            )}

            {/* Mobile Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search lawyers..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-black placeholder:text-gray-400 outline-none focus:border-amber-400"
              />
            </div>

            {/* =========================
                Mobile Auth
            ========================= */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-semibold text-white transition hover:opacity-90"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-xl border border-white/10 py-3 text-center font-semibold text-gray-200 hover:bg-white/5"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-center font-semibold text-slate-900"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
