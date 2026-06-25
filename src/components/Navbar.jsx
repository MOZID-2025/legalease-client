"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { data: session } = useSession();
  const user = session?.user;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Browse Lawyers", href: "/browse-lawyers" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDashboardOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-3xl font-extrabold text-white">
              Legal<span className="text-amber-400">Ease</span>
            </h1>
          </Link>

          {/* Desktop Nav */}
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

            {/* Dashboard Dropdown */}
            <div className=" relative" ref={dropdownRef}>
              <button
                onClick={() => setDashboardOpen(!dashboardOpen)}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-amber-400"
              >
                Dashboard
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    dashboardOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dashboardOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-white/10 bg-slate-900 shadow-lg">
                  <Link
                    href="/dashboard/client"
                    className="block px-4 py-2 text-gray-300 hover:bg-white/10"
                    onClick={() => setDashboardOpen(false)}
                  >
                    Client
                  </Link>

                  <Link
                    href="/dashboard/lawyer"
                    className="block px-4 py-2 text-gray-300 hover:bg-white/10"
                    onClick={() => setDashboardOpen(false)}
                  >
                    Lawyer
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden items-center gap-4 lg:flex">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search lawyers..."
                className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            {user ? (
              <>
                <span className="text-sm text-white">Hi, {user.name}</span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 font-semibold text-black hover:scale-105 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 font-semibold text-slate-900 hover:scale-105 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white lg:hidden"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl lg:hidden">
          <div className="space-y-4 px-6 py-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block ${
                  pathname === item.href ? "text-amber-400" : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t border-white/10 pt-4">
              <p className="mb-2 text-sm font-semibold text-amber-400">
                Dashboard
              </p>

              <Link
                href="/dashboard/client"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-300 hover:text-amber-400"
              >
                Client Dashboard
              </Link>

              <Link
                href="/dashboard/lawyer"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-300 hover:text-amber-400"
              >
                Lawyer Dashboard
              </Link>
            </div>

            <input
              type="text"
              placeholder="Search lawyers..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400"
            />

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 font-semibold text-black"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/signin"
                className="block w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-center font-semibold text-slate-900"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
