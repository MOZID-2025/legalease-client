"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Scale,
  BriefcaseBusiness,
  DollarSign,
  Loader2,
  TrendingUp,
} from "lucide-react";

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalHires: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Analytics
  // =========================
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:8080/admin/analytics");

      if (!res.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await res.json();

      setAnalytics({
        totalUsers: data.totalUsers || 0,
        totalLawyers: data.totalLawyers || 0,
        totalHires: data.totalHires || 0,
        totalRevenue: data.totalRevenue || 0,
      });
    } catch (error) {
      console.error("Analytics error:", error);

      setError("Unable to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =========================
  // Format Revenue
  // =========================
  const formatRevenue = (amount) => {
    return `৳${Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-indigo-600" />

          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-center">
          <p className="font-semibold text-red-600">{error}</p>

          <button
            onClick={fetchAnalytics}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* =========================
          Header
      ========================== */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
            <TrendingUp size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold  md:text-3xl">
              Analytics Overview
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Monitor your LegalEase platform statistics.
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          Analytics Cards
      ========================== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Users */}
        <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {analytics.totalUsers.toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-gray-500">Registered users</p>
            </div>

            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <Users size={25} />
            </div>
          </div>
        </div>

        {/* Total Lawyers */}
        <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Lawyers</p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {analytics.totalLawyers.toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-gray-500">Registered lawyers</p>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <Scale size={25} />
            </div>
          </div>
        </div>

        {/* Total Hires */}
        <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Hires</p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {analytics.totalHires.toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Successful lawyer hires
              </p>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
              <BriefcaseBusiness size={25} />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {formatRevenue(analytics.totalRevenue)}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Total platform revenue
              </p>
            </div>

            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
              <DollarSign size={25} />
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Summary Section
      ========================== */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Platform Summary</h2>

          <p className="text-sm text-gray-500">
            Quick overview of your platform performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Clients</p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {Math.max(
                analytics.totalUsers - analytics.totalLawyers,
                0,
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Average Revenue / Hire</p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatRevenue(
                analytics.totalHires > 0
                  ? analytics.totalRevenue / analytics.totalHires
                  : 0,
              )}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total Revenue</p>

            <p className="mt-1 text-xl font-bold text-green-600">
              {formatRevenue(analytics.totalRevenue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
