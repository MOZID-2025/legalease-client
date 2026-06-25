"use client";

import { motion } from "framer-motion";
import { Star, MapPin, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

const lawyers = [
  {
    id: 1,
    name: "Sarah Ahmed",
    category: "Corporate Law",
    experience: "8 Years",
    rating: 4.9,
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    id: 2,
    name: "Michael Johnson",
    category: "Criminal Law",
    experience: "12 Years",
    rating: 4.8,
    image: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: 3,
    name: "Emma Wilson",
    category: "Family Law",
    experience: "7 Years",
    rating: 4.7,
    image: "https://i.pravatar.cc/300?img=45",
  },
  {
    id: 4,
    name: "David Smith",
    category: "Immigration Law",
    experience: "10 Years",
    rating: 4.9,
    image: "https://i.pravatar.cc/300?img=15",
  },
  {
    id: 5,
    name: "Sophia Brown",
    category: "Property Law",
    experience: "6 Years",
    rating: 4.8,
    image: "https://i.pravatar.cc/300?img=25",
  },
  {
    id: 6,
    name: "James Lee",
    category: "Business Law",
    experience: "11 Years",
    rating: 5.0,
    image: "https://i.pravatar.cc/300?img=18",
  },
];

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

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {lawyers.map((lawyer) => (
            <motion.div
              key={lawyer.id}
              variants={item}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg"
            >
              <img
                src={lawyer.image}
                alt={lawyer.name}
                className="h-72 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white">
                  {lawyer.name}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-amber-400">
                  <BriefcaseBusiness size={16} />
                  <span>{lawyer.category}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-slate-400">
                  <MapPin size={16} />
                  <span>Bangladesh</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span>{lawyer.rating}</span>
                </div>

                <p className="mt-4 text-slate-400">
                  Experience: {lawyer.experience}
                </p>

                <Link
                  href={`/lawyers/${lawyer.id}`}
                  className="mt-6 inline-block w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-center font-semibold text-slate-900 transition hover:scale-[1.02]"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
