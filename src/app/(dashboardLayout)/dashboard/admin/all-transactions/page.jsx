"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Loader2,
  Receipt,
  UserRound,
  Scale,
  CalendarDays,
} from "lucide-react";

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch All Transactions
  // =========================
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/transactions");

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await res.json();

      setTransactions(data);
    } catch (error) {
      console.error("Fetch transactions error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // =========================
  // Format Amount
  // =========================
  const formatAmount = (amount) => {
    const numericAmount = Number(amount) || 0;

    return `৳${numericAmount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-indigo-600" />

          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* =========================
          Header
      ========================== */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-100 p-3 text-amber-600">
            <CreditCard size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold  md:text-3xl">
              All Transactions
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View all transactions made through LegalEase.
            </p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-sm">
          <p className="text-sm font-bold text-gray-500">Total Transactions</p>

          <p className="text-2xl font-bold text-amber-600">
            {transactions.length}
          </p>
        </div>
      </div>

      {/* =========================
          Table
      ========================== */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            {/* Table Header */}
            <thead className="bg-amber-400">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  #
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Transaction ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  User Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Lawyer Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 rounded-full bg-gray-100 p-4">
                        <Receipt size={30} className="text-gray-400" />
                      </div>

                      <p className="font-semibold text-gray-700">
                        No transactions found
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Transactions will appear here after a successful
                        payment.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <tr
                    key={transaction._id || transaction.transactionId || index}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    {/* Number */}
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    {/* Transaction ID */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                          <Receipt size={18} />
                        </div>

                        <div>
                          <p className="font-mono text-sm font-semibold text-gray-900">
                            {transaction.transactionId ||
                              transaction.paymentId ||
                              transaction._id ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* User Email */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <UserRound size={17} className="text-gray-400" />

                        <span className="text-sm text-gray-600">
                          {transaction.userEmail ||
                            transaction.clientEmail ||
                            transaction.email ||
                            "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Lawyer Email */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Scale size={17} className="text-gray-400" />

                        <span className="text-sm text-gray-600">
                          {transaction.lawyerEmail || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-5">
                      <span className="font-semibold text-green-600">
                        {formatAmount(transaction.amount)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={17} className="text-gray-400" />

                        <span className="text-sm text-gray-600">
                          {formatDate(
                            transaction.date || transaction.createdAt,
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllTransactions;
