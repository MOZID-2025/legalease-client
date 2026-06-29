"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { User, FileText, BriefcaseBusiness, ArrowRight } from "lucide-react";

const ClientDashboard = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-[300px] items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 p-8">
        <h1 className="text-4xl font-bold text-white">
          Welcome Back, {user?.name}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">
          Manage your legal consultations, hiring requests, profile information,
          and legal services from your personal dashboard.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <img
            src={user?.image || "https://i.pravatar.cc/150?img=12"}
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-amber-400 object-cover"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>

            <p className="text-slate-400">{user?.email}</p>
          </div>

          <Link
            href="/dashboard/user/update-profile"
            className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 font-semibold text-slate-900 transition hover:scale-105"
          >
            Update Profile
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <BriefcaseBusiness size={32} className="mb-3 text-amber-400" />

          <h3 className="text-3xl font-bold text-white">5</h3>

          <p className="text-slate-400">Total Hiring Requests</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <FileText size={32} className="mb-3 text-green-400" />

          <h3 className="text-3xl font-bold text-white">2</h3>

          <p className="text-slate-400">Accepted Requests</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <User size={32} className="mb-3 text-blue-400" />

          <h3 className="text-3xl font-bold text-white">Active</h3>

          <p className="text-slate-400">Account Status</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
        <h2 className="mb-5 text-2xl font-bold text-white">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/user/hiring-history"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 font-semibold text-slate-900"
          >
            Hiring History
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard/user/update-profile"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-white hover:bg-white/5"
          >
            Update Profile
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
