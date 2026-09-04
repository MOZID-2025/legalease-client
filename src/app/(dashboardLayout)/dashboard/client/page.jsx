"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Mail, ShieldCheck, Pencil } from "lucide-react";

const ClientDashboard = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-6 py-10 shadow-2xl sm:px-10">
        {/* Background Decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <ShieldCheck size={17} />
            User Dashboard
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Welcome Back,
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {user?.name || "User"}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage your legal consultations, hiring requests, profile
            information, and legal services from your personal dashboard.
          </p>
        </div>
      </section>

      {/* Profile Card */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-indigo-500 opacity-70 blur-sm" />

              <img
                src={user?.image || "https://i.pravatar.cc/150?img=12"}
                alt={user?.name || "Profile"}
                className="relative h-24 w-24 rounded-full border-4 border-slate-900 object-cover shadow-lg sm:h-28 sm:w-28"
              />

              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-slate-900 bg-emerald-500" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <p className="mb-1 text-sm font-medium text-indigo-400">
                Profile Information
              </p>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {user?.name || "User"}
              </h2>

              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start">
                <Mail size={16} className="text-slate-500" />
                <span>{user?.email || "No email available"}</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link
              href="/dashboard/client/update-profile"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/10 transition duration-300 hover:scale-105 hover:shadow-amber-500/20"
            >
              <Pencil size={17} />
              Edit Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard;
