"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  User,
  X,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

const LawyerDetails = () => {
  const router = useRouter();
  const params = useParams();

  const { data: session, isPending } = useSession();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showHireModal, setShowHireModal] = useState(false);
  const [hiring, setHiring] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  //HANDLE HIRING REQUEST
  const handleHireRequest = async () => {
    if (!session?.user || !lawyer) return;

    try {
      setHiring(true);

      const hiringData = {
        userEmail: session.user.email,
        userName: session.user.name,

        lawyerId: lawyer._id,
        lawyerName: lawyer.name,
        specialization: lawyer.specialization,
        fee: lawyer.fee,

        hiringDate: new Date(),
        status: "pending",
      };

      const res = await fetch(`${API_URL}/hiring-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hiringData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send hiring request");
      }

      setShowHireModal(false);

      alert("Hiring request sent successfully!");

      router.push("/dashboard/client/hiring-history");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setHiring(false);
    }
  };

  // ==============================
  // LOGIN PROTECTION
  // ==============================

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(`/login?callbackUrl=/lawyers/${params.id}`);
    }
  }, [isPending, session, router, params.id]);

  // ==============================
  // FETCH LAWYER
  // ==============================

  useEffect(() => {
    if (isPending || !session?.user || !params?.id) {
      return;
    }

    const fetchLawyer = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/lawyers/${params.id}`);

        if (!res.ok) {
          throw new Error("Lawyer not found");
        }

        const data = await res.json();

        setLawyer(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [isPending, session, params.id, API_URL]);

  // ==============================
  // SESSION LOADING
  // ==============================

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-amber-400"></div>

          <p className="mt-4 text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ==============================
  // NOT LOGGED IN
  // ==============================

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="text-center">
          <User className="mx-auto text-amber-400" size={50} />

          <h2 className="mt-5 text-2xl font-bold text-white">Login Required</h2>

          <p className="mt-2 text-slate-400">
            Please login to view lawyer details.
          </p>

          <button
            onClick={() =>
              router.replace(`/login?callbackUrl=/lawyers/${params.id}`)
            }
            className="mt-6 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 font-bold text-slate-900"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // LAWYER LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-32 rounded bg-white/10" />

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="h-[420px] rounded-3xl bg-white/10" />

            <div className="space-y-5 lg:col-span-2">
              <div className="h-12 w-1/2 rounded bg-white/10" />
              <div className="h-6 w-1/3 rounded bg-white/10" />
              <div className="h-24 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error || !lawyer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="text-center">
          <User size={50} className="mx-auto text-red-400" />

          <h2 className="mt-5 text-3xl font-bold text-white">
            Lawyer Not Found
          </h2>

          <p className="mt-3 text-slate-400">
            The lawyer profile you're looking for doesn't exist.
          </p>

          <Link
            href="/browse-lawyers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 font-bold text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to Lawyers
          </Link>
        </div>
      </div>
    );
  }

  // ==============================
  // MAIN DETAILS
  // ==============================

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Profile Section */}
      <section className="border-b border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-amber-950/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          {/* Back */}
          <Link
            href="/browse-lawyers"
            className="mb-8 inline-flex items-center gap-2 text-slate-400 transition hover:text-amber-400"
          >
            <ArrowLeft size={18} />
            Back to Lawyers
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Image */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3">
              <img
                src={lawyer.image || "https://i.pravatar.cc/600?img=12"}
                alt={lawyer.name}
                className="h-[420px] w-full rounded-2xl object-cover"
              />
            </div>

            {/* Information */}
            <div className="flex flex-col justify-center lg:col-span-2">
              {/* Availability */}
              <div>
                {lawyer.availability !== false ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-400/10 px-4 py-2 text-sm text-green-400">
                    <CheckCircle size={16} />
                    Available for Consultation
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-400/10 px-4 py-2 text-sm text-red-400">
                    <Clock size={16} />
                    Currently Unavailable
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="mt-5 text-4xl font-bold md:text-5xl">
                {lawyer.name}
              </h1>

              {/* Specialization */}
              <div className="mt-4 flex items-center gap-2 text-lg text-amber-400">
                <BriefcaseBusiness size={20} />

                <span>{lawyer.specialization || "Legal Expert"}</span>
              </div>

              {/* Location */}
              <div className="mt-3 flex items-center gap-2 text-slate-400">
                <MapPin size={18} />
                Bangladesh
              </div>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2 text-yellow-400">
                <Star size={18} fill="currentColor" />

                {lawyer.rating || "New"}

                {lawyer.totalReviews && (
                  <span className="text-slate-500">
                    ({lawyer.totalReviews} reviews)
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="mt-6 max-w-3xl leading-7 text-slate-400">
                {lawyer.bio ||
                  "This lawyer has not added a professional biography yet."}
              </p>

              {/* Info Cards */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-400/10 p-3 text-amber-400">
                      <DollarSign size={22} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Consultation Fee</p>

                      <p className="text-xl font-bold">৳{lawyer.fee || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-400/10 p-3 text-indigo-400">
                      <BriefcaseBusiness size={22} />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Specialization</p>

                      <p className="text-lg font-bold">
                        {lawyer.specialization || "General Law"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setShowHireModal(true)}
                  disabled={lawyer.availability === false}
                  className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-4 font-bold text-slate-900 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lawyer.availability === false
                    ? "Currently Unavailable"
                    : "Hire This Lawyer"}
                </button>

                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-semibold transition hover:bg-white/10">
                  <MessageCircle size={20} />
                  Contact Lawyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Why Choose {lawyer.name}?</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck size={30} className="text-indigo-400" />

            <h3 className="mt-4 text-xl font-semibold">Professional Service</h3>

            <p className="mt-2 text-slate-400">
              Get professional legal assistance from an experienced legal
              expert.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <Clock size={30} className="text-green-400" />

            <h3 className="mt-4 text-xl font-semibold">
              Flexible Consultation
            </h3>

            <p className="mt-2 text-slate-400">
              Discuss your legal concerns and find the right solution for your
              case.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <CheckCircle size={30} className="text-amber-400" />

            <h3 className="mt-4 text-xl font-semibold">Verified Lawyer</h3>

            <p className="mt-2 text-slate-400">
              Connect with a published legal professional through LegalEase.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Hire Confirmation Modal ================= */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            {/* Top Gradient */}
            <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-indigo-500" />

            <div className="p-6 sm:p-8">
              {/* Close Button */}
              <button
                onClick={() => setShowHireModal(false)}
                disabled={hiring}
                className="absolute right-5 top-6 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10">
                <BriefcaseBusiness size={30} className="text-amber-400" />
              </div>

              {/* Heading */}
              <div className="mt-5 text-center">
                <h2 className="text-2xl font-bold text-white">
                  Confirm Hiring Request
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Are you sure you want to send a hiring request to this lawyer?
                </p>
              </div>

              {/* Lawyer Information */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-4">
                  <img
                    src={lawyer.image || "https://i.pravatar.cc/100?img=12"}
                    alt={lawyer.name}
                    className="h-16 w-16 rounded-full border-2 border-amber-400 object-cover"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-white">
                      {lawyer.name}
                    </h3>

                    <p className="mt-1 text-sm text-amber-400">
                      {lawyer.specialization || "Legal Expert"}
                    </p>
                  </div>
                </div>

                {/* Fee */}
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-slate-400">
                    Consultation Fee
                  </span>

                  <span className="text-xl font-bold text-amber-400">
                    ৳{lawyer.fee || 0}
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="mt-5 rounded-2xl border border-indigo-400/10 bg-indigo-500/5 p-4">
                <p className="text-sm leading-6 text-slate-400">
                  Your request will be sent with a{" "}
                  <span className="font-semibold text-amber-400">Pending</span>{" "}
                  status. You can make the payment after the lawyer accepts your
                  request.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowHireModal(false)}
                  disabled={hiring}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleHireRequest}
                  disabled={hiring}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3.5 font-bold text-slate-900 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {hiring ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirm Hiring
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LawyerDetails;
