"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  CheckCircle,
  XCircle,
} from "lucide-react";

const HiringHistory = () => {
  const { data: session, isPending } = useSession();

  const [payingId, setPayingId] = useState(null);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handlePayment = async (requestId) => {
    try {
      setPayingId(requestId);

      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hiringRequestId: requestId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to start payment");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert(error.message || "Payment failed");
    } finally {
      setPayingId(null);
    }
  };
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchHiringHistory = async () => {
      try {
        const res = await fetch(
          `${API_URL}/hiring-requests/user/${encodeURIComponent(
            session.user.email,
          )}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch hiring history");
        }

        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHiringHistory();
  }, [session?.user?.email]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-6 py-10 shadow-2xl sm:px-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <BriefcaseBusiness size={17} />
            Hiring Management
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Hiring History
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
            Track your lawyer hiring requests and their current status.
          </p>
        </div>
      </section>

      {/* Empty */}
      {requests.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
            <BriefcaseBusiness size={30} className="text-indigo-400" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">
            No Hiring Requests
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Your lawyer hiring requests will appear here.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-300">
                    Lawyer
                  </th>

                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-300">
                    Specialisation
                  </th>

                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-300">
                    Fee
                  </th>

                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-300">
                    Hiring Date
                  </th>

                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {requests.map((request) => (
                  <tr
                    key={request._id}
                    className="transition hover:bg-white/[0.03]"
                  >
                    {/* Lawyer */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                          <BriefcaseBusiness
                            size={18}
                            className="text-indigo-400"
                          />
                        </div>

                        <span className="font-semibold text-white">
                          {request.lawyerName}
                        </span>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {request.specialization}
                    </td>

                    {/* Fee */}
                    <td className="px-6 py-5 font-semibold text-amber-400">
                      ৳{request.fee}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CalendarDays size={16} />

                        {new Date(request.hiringDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="px-6 py-5">
                      {request.status === "accepted" &&
                        request.paymentStatus !== "paid" && (
                          // <button
                          //   onClick={() => handlePayment(request._id)}
                          //   disabled={payingId === request._id}
                          //   className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                          // >
                          //   {payingId === request._id ? (
                          //     <>
                          //       <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                          //       Processing...
                          //     </>
                          //   ) : (
                          //     <>Pay Now</>
                          //   )}
                          // </button>

                          <form action="/api/checkout_sessions" method="POST">
                            <section>
                              <button
                                type="submit"
                                role="link"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Pay now
                              </button>
                            </section>
                          </form>
                        )}

                      {request.paymentStatus === "paid" && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400">
                          <CheckCircle size={16} />
                          Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-400">
        <CheckCircle size={15} />
        Accepted
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold capitalize text-red-400">
        <XCircle size={15} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold capitalize text-amber-400">
      <Clock3 size={15} />
      Pending
    </span>
  );
};

export default HiringHistory;
