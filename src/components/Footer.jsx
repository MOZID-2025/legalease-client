"use client";

import Link from "next/link";
import { Scale, Send } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Scale className="text-amber-400" size={30} />

              <h2 className="text-3xl font-extrabold text-white">
                Legal<span className="text-amber-400">Ease</span>
              </h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Connecting clients with trusted legal professionals. Find expert
              legal counsel for criminal, corporate, family, immigration,
              property, and business law.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 transition hover:text-amber-400"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 transition hover:text-amber-400"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-400 transition hover:text-amber-400"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="group rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
              >
                <FaFacebookF
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>

              <a
                href="#"
                className="group rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
              >
                <FaXTwitter
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>

              <a
                href="#"
                className="group rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
              >
                <FaLinkedinIn
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>

              <a
                href="#"
                className="group rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-400"
              >
                <FaInstagram
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Newsletter
            </h3>

            <p className="mb-4 text-sm text-slate-400">
              Subscribe to receive legal insights and platform updates.
            </p>

            <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none"
              />

              <button className="bg-gradient-to-r from-amber-400 to-yellow-500 px-4 text-slate-900 transition hover:opacity-90">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} LegalEase. All rights reserved.
            </p>

            <p className="text-sm text-slate-500">
              Built with professionalism, trust & justice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
