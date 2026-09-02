import FeaturedLawyers from "@/components/FeaturedLawyers";
import HeroBanner from "@/components/HeroBanner";
import LegalCategories from "@/components/LegalCategories";
import TopLegalExperts from "@/components/TopLegalExperts";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeaturedLawyers />
      <TopLegalExperts />
      <LegalCategories />
    </div>
  );
}
