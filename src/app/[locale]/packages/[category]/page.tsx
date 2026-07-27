import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { Clock, ShieldCheck, MapPin, Compass } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

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
      next: { revalidate: 10 },
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
  const packages = rawPackages.map((p) => ({
    id: p._id,
    title: p.title[locale] || p.title["en"] || "",
    slug: p.slug,
    price: p.price,
    pricePeriod: p.pricePeriod[locale] || p.pricePeriod["en"] || "",
    image: p.image,
    duration: p.duration[locale] || p.duration["en"] || "",
    shortDescription: p.shortDescription[locale] || p.shortDescription["en"] || "",
    tagline: p.tagline[locale] || p.tagline["en"] || "",
  }));

  // Fetch translation messages
  const messages = await getMessages({ locale });
  const title = (messages.Packages as any)?.[titleKey] || "Tour Packages";
  const categoryDescription = (messages.Packages as any)?.[descKey] || "";

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
        
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Photo cover */}
                  <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden select-none">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4 bg-[#121212]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-[10px] font-bold tracking-wider">
                      ₹{p.price.toLocaleString()} {p.pricePeriod}
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-6 flex flex-col flex-grow items-start text-left">
                    <div className="flex items-center gap-1.5 text-brand-gold text-[9px] font-bold tracking-widest uppercase mb-1 select-none">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{p.duration}</span>
                    </div>

                    <h3 className="font-serif text-lg font-normal text-[#121212] mb-2 tracking-wide leading-tight group-hover:text-brand-gold transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed mb-6 font-sans flex-grow select-text">
                      {p.shortDescription}
                    </p>

                    <Link
                      href={`/${locale}/packages/${category}/${p.slug}`}
                      className="w-full flex items-center justify-center bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider py-3.5 rounded-sm transition-all duration-300 text-[10px] select-none"
                    >
                      Explore Package
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </>
  );
}
