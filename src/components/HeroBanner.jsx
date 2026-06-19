"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";

const bgImages = [
  "/hero/lawyer-consultation.jpg",
  "/hero/corporate-law.jpg",
  "/hero/courtroom.jpg",
];

export default function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bgImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh]">
      {/* Background Image Slider */}
      {bgImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            currentImage === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/95" />

      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"></div>
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-400 backdrop-blur-md">
              Trusted Legal Marketplace
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="mt-6 text-5xl font-extrabold leading-tight text-white lg:text-7xl"
            >
              Find &
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                {" "}
                Hire Expert
              </span>
              <br />
              Legal Counsel
            </motion.h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Connect with verified legal professionals for criminal, corporate,
              family, immigration, property and business law. Hire trusted
              lawyers with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/browse-lawyers"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 font-semibold text-slate-900 shadow-lg transition hover:scale-105"
              >
                Browse Lawyers
                <ArrowRight size={18} />
              </Link>

              <button className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white backdrop-blur-md transition hover:bg-white/10">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-5">
              <div>
                <h3 className="text-3xl font-bold text-amber-400">500+</h3>
                <p className="text-slate-400">Lawyers</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-amber-400">2K+</h3>
                <p className="text-slate-400">Clients</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-amber-400">98%</h3>
                <p className="text-slate-400">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
              <div className="grid gap-6">
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                  <Scale className="text-amber-400" size={40} />
                  <div>
                    <h3 className="font-semibold text-white">Criminal Law</h3>
                    <p className="text-sm text-slate-400">
                      Experienced legal defense specialists.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                  <BriefcaseBusiness className="text-amber-400" size={40} />
                  <div>
                    <h3 className="font-semibold text-white">Corporate Law</h3>
                    <p className="text-sm text-slate-400">
                      Business and compliance experts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-5">
                  <ShieldCheck className="text-amber-400" size={40} />
                  <div>
                    <h3 className="font-semibold text-white">
                      Trusted Protection
                    </h3>
                    <p className="text-sm text-slate-400">
                      Verified and trusted legal professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-5 -right-5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-bold text-slate-900 shadow-xl">
              Verified Lawyers
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="mt-10 flex justify-center gap-3">
          {bgImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                currentImage === index ? "bg-amber-400 w-8" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
