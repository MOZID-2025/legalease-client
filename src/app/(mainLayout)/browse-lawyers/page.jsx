"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  UserRound,
  BriefcaseBusiness,
  DollarSign,
  X,
  AlertCircle,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const BrowseLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [feeRange, setFeeRange] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ==========================================
  // Fetch Lawyers
  // ==========================================
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch(`${API_URL}/lawyers`);

        const data = await res.json();

        setLawyers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // Specialization List

  const specializations = useMemo(() => {
    const unique = [
      ...new Set(
        lawyers.map((lawyer) => lawyer.specialization).filter(Boolean),
      ),
    ];

    return ["All", ...unique];
  }, [lawyers]);

  // Filter + Search + Sort

  const filteredLawyers = useMemo(() => {
    let result = [...lawyers];

    // Search by name OR specialization
    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((lawyer) => {
        const name = lawyer.name?.toLowerCase() || "";
        const lawyerSpecialization = lawyer.specialization?.toLowerCase() || "";

        return (
          name.includes(searchValue) ||
          lawyerSpecialization.includes(searchValue)
        );
      });
    }

    // Specialization
    if (specialization !== "All") {
      result = result.filter(
        (lawyer) => lawyer.specialization === specialization,
      );
    }

    // Availability
    if (availability !== "All") {
      result = result.filter(
        (lawyer) =>
          lawyer.availability?.toLowerCase() === availability.toLowerCase(),
      );
    }

    // Fee
    if (feeRange !== "All") {
      result = result.filter((lawyer) => {
        const fee = Number(lawyer.fee || 0);

        if (feeRange === "0-100") return fee <= 100;

        if (feeRange === "101-250") {
          return fee >= 101 && fee <= 250;
        }

        if (feeRange === "251-500") {
          return fee >= 251 && fee <= 500;
        }

        if (feeRange === "500+") return fee > 500;

        return true;
      });
    }

    // Sorting
    if (sortBy === "fee-low") {
      result.sort((a, b) => Number(a.fee || 0) - Number(b.fee || 0));
    }

    if (sortBy === "fee-high") {
      result.sort((a, b) => Number(b.fee || 0) - Number(a.fee || 0));
    }

    if (sortBy === "name-az") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (sortBy === "name-za") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    }

    return result;
  }, [lawyers, search, specialization, availability, feeRange, sortBy]);

  // ==========================================
  // Pagination
  // ==========================================
  const totalPages = Math.ceil(filteredLawyers.length / ITEMS_PER_PAGE);

  const paginatedLawyers = filteredLawyers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, specialization, availability, feeRange, sortBy]);

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setSpecialization("All");
    setAvailability("All");
    setFeeRange("All");
    setSortBy("default");
    setCurrentPage(1);
  };

  const hasFilters =
    search ||
    specialization !== "All" ||
    availability !== "All" ||
    feeRange !== "All" ||
    sortBy !== "default";

  // Loading Skeleton

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="h-10 w-72 animate-pulse rounded bg-white/10" />
            <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-white/10" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // Error State
  // ==========================================
  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={42} />

          <h2 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-slate-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ==========================================
          Hero
      ========================================== */}
      <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-indigo-300">
              LegalEase
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Find the Right
              <span className="block text-indigo-300">Legal Expert</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Browse verified legal professionals, compare their expertise and
              consultation fees, and find the right lawyer for your legal needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          Search & Filters
      ========================================== */}
      <section className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
              />

              <input
                type="text"
                placeholder="Search by lawyer name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border  pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
              {/* Specialization */}
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="h-12 rounded-xl border text-black px-3 text-sm font-medium outline-none focus:border-indigo-500"
              >
                {specializations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Availability */}
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="h-12 rounded-xl border text-black px-3 text-sm font-medium outline-none focus:border-indigo-500"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
              </select>

              {/* Fee */}
              <select
                value={feeRange}
                onChange={(e) => setFeeRange(e.target.value)}
                className="h-12 rounded-xl border text-black  px-3 text-sm font-medium outline-none focus:border-indigo-500"
              >
                <option value="All">All Fees</option>
                <option value="0-100">$0 - $100</option>
                <option value="101-250">$101 - $250</option>
                <option value="251-500">$251 - $500</option>
                <option value="500+">$500+</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 rounded-xl border text-black px-3 text-sm font-medium outline-none focus:border-indigo-500"
              >
                <option value="default">Sort By</option>
                <option value="newest">Newest</option>
                <option value="fee-low">Fee: Low to High</option>
                <option value="fee-high">Fee: High to Low</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredLawyers.length}
                </span>{" "}
                lawyers
              </p>

              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <X size={16} />
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          Lawyers
      ========================================== */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {!hasFilters && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                All Legal Experts
              </h2>

              <p className="mt-1 text-slate-500">
                Find experienced lawyers ready to help.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <SlidersHorizontal size={17} />
              {filteredLawyers.length} lawyers
            </div>
          </div>
        )}

        {/* Empty State */}
        {paginatedLawyers.length === 0 ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Search size={28} className="text-slate-400" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                No lawyers found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your search or filter options.
              </p>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Lawyer Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {paginatedLawyers.map((lawyer, index) => (
                <motion.div
                  key={lawyer._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                  }}
                  whileHover={{ y: -5 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
                >
                  {/* Image */}
                  <Link href={`/lawyers/${lawyer._id}`}>
                    <div className="relative h-44 overflow-hidden bg-slate-100 sm:h-52">
                      {lawyer.image ? (
                        <img
                          src={lawyer.image}
                          alt={lawyer.name || "Lawyer"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <UserRound size={55} className="text-slate-300" />
                        </div>
                      )}

                      {/* Availability */}
                      <div className="absolute right-3 top-3">
                        {lawyer.availability?.toLowerCase() === "busy" ? (
                          <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                            Busy
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <Link href={`/lawyers/${lawyer._id}`}>
                      <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition group-hover:text-indigo-600 sm:text-lg">
                        {lawyer.name}
                      </h3>
                    </Link>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-indigo-600">
                      <BriefcaseBusiness size={15} />

                      <span className="line-clamp-1">
                        {lawyer.specialization || "Legal Professional"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">Consultation</p>

                        <p className="mt-0.5 flex items-center gap-1 font-bold text-slate-900">
                          <DollarSign size={15} />
                          {lawyer.fee || 0}
                        </p>
                      </div>

                      <Link
                        href={`/lawyers/${lawyer._id}`}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 sm:px-4 sm:text-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ==========================================
                Pagination
            ========================================== */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:border-indigo-500 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:border-indigo-500 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default BrowseLawyers;
