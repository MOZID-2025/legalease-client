"use client";

import { useEffect, useState } from "react";
import { Check, Clock, X, BriefcaseBusiness } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LawyerHiringHistory() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/hiring-requests/lawyer/${encodeURIComponent(
          session.user.email,
        )}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await res.json();

      console.log("HIRING REQUESTS:", data);

      setRequests(data);
    } catch (error) {
      console.error("Fetch hiring requests error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading && session?.user?.email) {
      fetchRequests();
    }
  }, [sessionLoading, session]);

  const updateRequest = async (id, action) => {
    try {
      setProcessingId(id);

      const res = await fetch(`${API_URL}/hiring-requests/${id}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      setRequests((prev) =>
        prev.map((request) =>
          request._id === id
            ? {
                ...request,
                status: action === "accept" ? "accepted" : "rejected",
              }
            : request,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-amber-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-400/10 p-3">
            <BriefcaseBusiness className="text-amber-400" size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Hiring History
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage hiring requests from your clients
            </p>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Client Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Request Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-16 text-center text-slate-400"
                  >
                    No hiring requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="transition hover:bg-white/[0.03]"
                  >
                    {/* Client */}

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-white">
                          {request.userName || "Unknown Client"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {request.userEmail}
                        </p>
                      </div>
                    </td>

                    {/* Date */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock size={16} className="text-amber-400" />

                        {new Date(request.hiringDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">
                      {request.status === "pending" && (
                        <span className="inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-sm font-medium text-yellow-400">
                          Pending
                        </span>
                      )}

                      {request.status === "accepted" && (
                        <span className="inline-flex rounded-full bg-green-400/10 px-3 py-1 text-sm font-medium text-green-400">
                          Accepted
                        </span>
                      )}

                      {request.status === "rejected" && (
                        <span className="inline-flex rounded-full bg-red-400/10 px-3 py-1 text-sm font-medium text-red-400">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Action */}

                    <td className="px-6 py-5 text-right">
                      {request.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateRequest(request._id, "accept")}
                            disabled={processingId === request._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400 transition hover:bg-green-500/20 disabled:opacity-50"
                          >
                            <Check size={16} />
                            Accept
                          </button>

                          <button
                            onClick={() => updateRequest(request._id, "reject")}
                            disabled={processingId === request._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                          >
                            <X size={16} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">
                          No action
                        </span>
                      )}
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
}
