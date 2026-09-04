"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

export default function FeaturedLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session, isPending } = useSession();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchFeaturedLawyers = async () => {
      try {
        const res = await fetch(`${API_URL}/featured-lawyers`);

        if (!res.ok) {
          throw new Error("Failed to fetch featured lawyers");
        }

        const data = await res.json();

        setLawyers(data);
      } catch (error) {
        console.error("Featured lawyers error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLawyers();
  }, [API_URL]);

  const handleViewProfile = (id) => {
    const detailsUrl = `/lawyers/${id}`;

    if (!session?.user) {
      router.push(`/signin?callbackUrl=${encodeURIComponent(detailsUrl)}`);
      return;
    }

    router.push(detailsUrl);
  };

  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-400">
            Featured Lawyers
          </span>

          <h2 className="mt-5 text-4xl font-bold text-white">
            Meet Our Legal Experts
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Connect with experienced legal professionals specialized in
            corporate, criminal, family, immigration and business law.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                <div className="h-72 bg-white/10"></div>

                <div className="space-y-4 p-6">
                  <div className="h-6 w-2/3 rounded bg-white/10"></div>
                  <div className="h-4 w-1/2 rounded bg-white/10"></div>
                  <div className="h-4 w-1/3 rounded bg-white/10"></div>
                  <div className="h-4 w-1/4 rounded bg-white/10"></div>
                  <div className="h-12 rounded-xl bg-white/10"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Lawyers */}
        {!loading && lawyers.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-slate-400">
              No featured lawyers available right now.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && lawyers.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {lawyers.map((lawyer) => (
              <motion.div
                key={lawyer._id}
                variants={item}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 },
                }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg"
              >
                {/* Image */}
                <div className="h-72 w-full overflow-hidden">
                  <img
                    src={lawyer.image || "https://i.pravatar.cc/500?img=12"}
                    alt={lawyer.name || "Lawyer"}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  {/* Name */}
                  <h3 className="text-2xl font-semibold text-white">
                    {lawyer.name}
                  </h3>

                  {/* Specialization */}
                  <div className="mt-3 flex items-center gap-2 text-amber-400">
                    <BriefcaseBusiness size={16} />

                    <span>{lawyer.specialization || "Legal Expert"}</span>
                  </div>

                  {/* Location */}
                  <div className="mt-2 flex items-center gap-2 text-slate-400">
                    <MapPin size={16} />

                    <span>Bangladesh</span>
                  </div>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-2 text-yellow-400">
                    <Star size={16} fill="currentColor" />

                    <span>{lawyer.rating || "New"}</span>
                  </div>

                  {/* Fee */}
                  <p className="mt-4 text-slate-400">
                    Consultation Fee:{" "}
                    <span className="font-semibold text-white">
                      ৳{lawyer.fee || 0}
                    </span>
                  </p>

                  {/* Bio */}
                  {lawyer.bio && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                      {lawyer.bio}
                    </p>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => handleViewProfile(lawyer._id)}
                    disabled={isPending}
                    className="mt-6 inline-block w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-center font-semibold text-slate-900 transition hover:scale-[1.02]"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
