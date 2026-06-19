"use client";

import { useState } from "react";
import { Menu, X, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: session, isPending } = useSession();

  const user = session?.user;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Browse Lawyers", href: "/browse-lawyers" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/signin");
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

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

          {/* Desktop Menu */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`font-medium transition ${
                    pathname === item.href
                      ? "text-amber-400"
                      : "text-gray-300 hover:text-amber-400"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search + Auth */}
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
                className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white"
              />
            </div>

            {/* AUTH BUTTON (FIXED) */}
            {user ? (
              <>
                Hi, {user.name}!
                <button
                  onClick={handleLogout}
                  className="flex items-center text-black gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 font-semibold transition hover:bg-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 font-semibold text-slate-900 transition hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="text-white lg:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 lg:hidden">
          <div className="space-y-4 px-6 py-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block ${
                  pathname === item.href ? "text-amber-400" : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <input
              type="text"
              placeholder="Search lawyers..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />

            {/* Mobile Auth */}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl text-black bg-gradient-to-r from-amber-400 to-yellow-500 py-3 font-semibold text-white"
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
