"use client";

import Link from "next/link";
import {
  Scale,
  Building2,
  Users,
  HeartHandshake,
  BriefcaseBusiness,
  Home,
  FileText,
  Shield,
  Gavel,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    name: "Criminal Law",
    slug: "criminal",
    description: "Expert help with criminal cases and defense.",
    icon: Gavel,
  },
  {
    name: "Corporate Law",
    slug: "corporate",
    description: "Legal solutions for businesses and companies.",
    icon: Building2,
  },
  {
    name: "Family Law",
    slug: "family",
    description: "Support for family and personal legal matters.",
    icon: HeartHandshake,
  },
  {
    name: "Civil Law",
    slug: "civil",
    description: "Professional assistance with civil disputes.",
    icon: Scale,
  },
  {
    name: "Business Law",
    slug: "business",
    description: "Protect your business with expert legal advice.",
    icon: BriefcaseBusiness,
  },
  {
    name: "Property Law",
    slug: "property",
    description: "Legal support for property and real estate issues.",
    icon: Home,
  },
  {
    name: "Employment Law",
    slug: "employment",
    description: "Help with workplace and employment matters.",
    icon: Users,
  },
  {
    name: "Immigration Law",
    slug: "immigration",
    description: "Guidance for immigration and visa-related cases.",
    icon: FileText,
  },
  {
    name: "Cyber Law",
    slug: "cyber",
    description: "Legal assistance for online and cyber issues.",
    icon: Shield,
  },
];

const LegalCategories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
            Legal Services
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Legal Categories
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Find the right legal expert based on your specific legal needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/browse-lawyers?specialization=${category.slug}`}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl border border-gray-200 bg-white hover:border-indigo-400 hover:shadow-lg transition-all duration-300">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Icon size={28} />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mt-2 leading-6">
                    {category.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 mt-5 text-indigo-600 font-semibold text-sm">
                    Find Lawyers
                    <ArrowRight
                      size={17}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LegalCategories;
