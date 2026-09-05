"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Users, ArrowRight } from "lucide-react";

const TopLegalExperts = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTopExperts = async () => {
      try {
        const res = await fetch(`${API_URL}/lawyers`);

        if (!res.ok) {
          throw new Error("Failed to fetch lawyers");
        }

        const data = await res.json();

        const topThree = data
          .filter((lawyer) => lawyer.published === true)
          .sort((a, b) => (b.totalHires || 0) - (a.totalHires || 0))
          .slice(0, 3);

        setLawyers(topThree);
      } catch (error) {
        console.error("Top experts error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopExperts();
  }, [API_URL]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-650">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}

        <div className="mb-14 text-center">
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-400">
            Top Rated Lawyers
          </span>

          <h2 className="mt-5 text-4xl font-bold ">Top Legal Experts</h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Meet our most trusted legal professionals with the highest number of
            successful client hires.
          </p>
        </div>

        {/* Experts */}
        {lawyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lawyers.map((lawyer, index) => (
              <div
                key={lawyer._id}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              >
                {/* Rank */}
                <div className="flex justify-center mb-4">
                  <span className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold">
                    #{index + 1} Expert
                  </span>
                </div>

                {/* Avatar */}
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <Image
                    src={lawyer.image || "https://i.ibb.co/5GzXkwq/user.png"}
                    alt={lawyer.name || "Lawyer"}
                    fill
                    className="rounded-full object-cover border-4 border-indigo-100"
                    unoptimized
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900">
                  {lawyer.name}
                </h3>

                {/* Specialization */}
                <p className="text-indigo-600 font-medium mt-1">
                  {lawyer.specialization || "Legal Expert"}
                </p>

                {/* Hires */}
                <div className="flex justify-center items-center gap-2 mt-4 text-gray-600">
                  <Users size={18} />
                  <span>
                    <strong className="text-gray-900">
                      {lawyer.totalHires || 0}
                    </strong>{" "}
                    successful hires
                  </span>
                </div>

                {/* Button */}
                <Link
                  href={`/lawyers/${lawyer._id}`}
                  className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
                >
                  View Profile
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No legal experts available yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default TopLegalExperts;
