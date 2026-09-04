"use client";

import { useSession } from "@/lib/auth-client";
import {
  Scale,
  Mail,
  BriefcaseBusiness,
  BadgeCheck,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const LawyerDashboard = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="space-y-8">
      {/* ================= Welcome Banner ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-6 py-10 shadow-2xl sm:px-10">
        {/* Decorative Background */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <Scale size={17} />
            Lawyer Dashboard
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Welcome Back,
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {user?.name || "Lawyer"}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage your legal profile, consultation requests, clients, and
            professional services from your lawyer dashboard.
          </p>
        </div>
      </section>

      {/* ================= Profile Card ================= */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-indigo-500 opacity-70 blur-sm" />

              <img
                src={user?.image || "https://i.pravatar.cc/150?img=12"}
                alt={user?.name || "Lawyer"}
                className="relative h-24 w-24 rounded-full border-4 border-slate-900 object-cover shadow-lg sm:h-28 sm:w-28"
              />

              {/* Online Indicator */}
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-slate-900 bg-emerald-500" />
            </div>

            {/* User Information */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-1 flex items-center justify-center gap-2 sm:justify-start">
                <p className="text-sm font-medium text-indigo-400">
                  Professional Profile
                </p>

                <BadgeCheck size={17} className="text-emerald-400" />
              </div>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {user?.name || "Lawyer"}
              </h2>

              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start">
                <Mail size={16} className="text-slate-500" />
                <span>{user?.email || "No email available"}</span>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/10 px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">
                  Active
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">Account Status</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LawyerDashboard;
