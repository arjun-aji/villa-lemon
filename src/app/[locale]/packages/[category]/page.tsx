export const dynamic = "force-dynamic";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { Clock, ShieldCheck, MapPin, Compass } from "lucide-react";
import PageAutoTranslator from "@/components/PageAutoTranslator";
import { API_BASE_URL } from "@/config/api";
import PackagesGridSlider from "@/components/PackagesGridSlider";
import { localizeObject } from "@/utils/translator";

interface PackageItemType {
  _id: string;
  packageCategory: string;
  title: Record<string, string>;
  slug: string;
  price: number;
  pricePeriod: Record<string, string>;
  image: string;
  duration: Record<string, string>;
  shortDescription: Record<string, string>;
  tagline: Record<string, string>;
}

async function getPackageItems(category: string): Promise<PackageItemType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/packages/items?category=${category}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn(`[packages catalog fetch]: Failed for category ${category}`, err);
    return [];
  }
}

export default async function PackagesCatalogPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  // Map category URL segment to DB field
  let dbCategory = "varkalaSightseeing";
  let titleKey = "varkalaTitle";
  let descKey = "varkalaDesc";

  if (category === "day-trips") {
    dbCategory = "dayTrips";
    titleKey = "daytripsTitle";
    descKey = "daytripsDesc";
  } else if (category === "backwater-experiences") {
    dbCategory = "backwaterExperiences";
    titleKey = "backwaterTitle";
    descKey = "backwaterDesc";
  } else if (category === "adventure-activities") {
    dbCategory = "adventureActivities";
    titleKey = "adventureTitle";
    descKey = "adventureDesc";
  }

  const rawPackages = await getPackageItems(dbCategory);

  // Localize packages
  const packages = await Promise.all(
    rawPackages.map(async (p) => {
      const lp = await localizeObject(p, locale) as any;
      return {
        id: lp._id,
        title: lp.title,
        slug: lp.slug,
        price: lp.price,
        pricePeriod: lp.pricePeriod,
        image: lp.image,
        duration: lp.duration,
        shortDescription: lp.shortDescription,
        tagline: lp.tagline,
      };
    })
  );

  // Fetch translation messages
  const messages = await getMessages({ locale });
  const title = (messages.Packages as any)?.[titleKey] || "Tour Packages";
  const categoryDescription = (messages.Packages as any)?.[descKey] || "";

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
        <PageAutoTranslator locale={locale}>
        
        {/* HEADER SECTION */}
        <section className="relative w-full h-[240px] md:h-[300px] flex items-end bg-[#121212] overflow-hidden pt-24">
          {/* Cover background */}
          <div className="absolute inset-0 z-0">
            {packages.length > 0 ? (
              <Image
                src={packages[0].image}
                alt={title}
                fill
                className="object-cover opacity-45 brightness-75 select-none"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#1e1e1e]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent z-10" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pb-6 md:pb-8 relative z-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase mb-3 font-semibold select-none">
              <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="hover:text-brand-gold transition-colors">Packages</span>
              <span>&gt;</span>
              <span className="text-brand-gold">{title}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight">
              {title}
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-white/80 font-light leading-relaxed font-sans">
              {categoryDescription || "Explore handpicked local experiences and custom tour packages guided by local guides."}
            </p>
          </div>
        </section>

        {/* PACKAGE LIST GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16">
          {packages.length === 0 ? (
            <div className="w-full py-16 text-center text-gray-400 bg-white border border-[#eae6db]/80 rounded-md shadow-sm select-none">
              <p className="text-sm font-semibold">No packages found under this category.</p>
              <Link 
                href="/#packages"
                className="inline-block mt-4 text-xs font-bold text-brand-gold hover:text-brand-dark uppercase tracking-wider"
              >
                Back to experiences
              </Link>
            </div>
          ) : (
            <PackagesGridSlider packages={packages} locale={locale} categorySlug={category} />
          )}

        </section>
        </PageAutoTranslator>
      </main>
    </>
  );
}
