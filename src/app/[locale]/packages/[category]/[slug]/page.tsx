import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Clock, Check, X, Shield, Calendar, Phone, ChevronLeft, MapPin, ListCollapse } from "lucide-react";

interface PackageDetails {
  _id: string;
  packageCategory: string;
  title: Record<string, string>;
  slug: string;
  price: number;
  pricePeriod: Record<string, string>;
  image: string;
  aboutImage: string;
  duration: Record<string, string>;
  shortDescription: Record<string, string>;
  tagline: Record<string, string>;
  aboutText: Record<string, string>;
  itinerary: Array<{ timeOrDay: Record<string, string>; activity: Record<string, string>; desc: Record<string, string> }>;
  inclusions: Array<Record<string, string>>;
  exclusions: Array<Record<string, string>>;
  highlights: Array<{ icon: string; label: Record<string, string> }>;
  whyGuestsLoveUs: Array<{ icon: string; title: Record<string, string>; desc: Record<string, string> }>;
}

async function getPackageDetails(slug: string): Promise<PackageDetails | null> {
  try {
    const res = await fetch(`http://localhost:5001/api/packages/items/${slug}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`[package details fetch]: Failed for slug ${slug}`, err);
    return null;
  }
}

export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const rawPackage = await getPackageDetails(slug);

  if (!rawPackage) {
    return notFound();
  }

  // Fetch translations
  const messages = await getMessages({ locale });
  const tPkg = messages.PackageDetails as any;

  // Localize properties
  const pkg = {
    id: rawPackage._id,
    category: rawPackage.packageCategory,
    title: rawPackage.title[locale] || rawPackage.title["en"] || "",
    price: rawPackage.price,
    pricePeriod: rawPackage.pricePeriod[locale] || rawPackage.pricePeriod["en"] || "",
    image: rawPackage.image,
    aboutImage: rawPackage.aboutImage || rawPackage.image,
    duration: rawPackage.duration[locale] || rawPackage.duration["en"] || "",
    shortDescription: rawPackage.shortDescription[locale] || rawPackage.shortDescription["en"] || "",
    tagline: rawPackage.tagline[locale] || rawPackage.tagline["en"] || "",
    aboutText: rawPackage.aboutText[locale] || rawPackage.aboutText["en"] || "",
    itinerary: (rawPackage.itinerary || []).map((it) => ({
      timeOrDay: it.timeOrDay[locale] || it.timeOrDay["en"] || "",
      activity: it.activity[locale] || it.activity["en"] || "",
      desc: it.desc[locale] || it.desc["en"] || "",
    })),
    inclusions: (rawPackage.inclusions || []).map((inc) => inc[locale] || inc["en"] || ""),
    exclusions: (rawPackage.exclusions || []).map((exc) => exc[locale] || exc["en"] || ""),
    highlights: (rawPackage.highlights || []).map((h) => ({
      icon: h.icon,
      label: h.label[locale] || h.label["en"] || "",
    })),
    whyGuestsLoveUs: (rawPackage.whyGuestsLoveUs || []).map((w) => ({
      icon: w.icon,
      title: w.title[locale] || w.title["en"] || "",
      desc: w.desc[locale] || w.desc["en"] || "",
    })),
  };

  return (
    <>
      <Navbar absoluteOnly={true} />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16 font-sans">
        
        {/* BANNER COVER PHOTO */}
        <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end bg-[#121212] overflow-hidden pt-28 pb-10">
          <div className="absolute inset-0 z-0">
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              className="object-cover opacity-50 brightness-75 select-none"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent z-10" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link 
                href={`/${locale}/packages/${category}`}
                className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{tPkg.back || "Back to listing"}</span>
              </Link>

              <div className="flex items-center gap-1.5 text-white/50 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                <span>&gt;</span>
                <Link href={`/${locale}/packages/${category}`} className="hover:text-brand-gold transition-colors">Packages</Link>
                <span>&gt;</span>
                <span className="text-brand-gold">{pkg.title}</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight">
              {pkg.title}
            </h1>
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-brand-gold font-serif italic mb-6">
              {pkg.tagline}
            </p>
            
            <div className="flex flex-col gap-6 md:flex-row md:items-center border-t border-white/10 pt-6 mt-8">
              <div className="flex items-center gap-2.5 text-white select-none">
                <Clock className="w-5 h-5 text-brand-gold" />
                <div className="text-left">
                  <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Duration</span>
                  <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">{pkg.duration}</h4>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-white select-none md:ml-8">
                <Shield className="w-5 h-5 text-brand-gold" />
                <div className="text-left">
                  <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Pricing</span>
                  <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">₹{pkg.price.toLocaleString()} {pkg.pricePeriod}</h4>
                </div>
              </div>

              <div className="flex items-center gap-4 select-none md:ml-auto">
                <a
                  href="#book"
                  className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm"
                >
                  {tPkg.bookNow || "Book Now"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Details column */}
          <div className="lg:col-span-8 flex flex-col items-start">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none">
              {tPkg.overview || "Overview"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
              Experience Description
            </h2>
            <div className="text-sm font-sans font-light leading-relaxed text-gray-700 select-text mb-12">
              <p>{pkg.aboutText}</p>
            </div>

            {/* ITINERARY */}
            {pkg.itinerary.length > 0 && (
              <div className="w-full mb-12">
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-6 border-b border-[#eae6db] pb-3">
                  {tPkg.itinerary || "Itinerary"}
                </h3>
                <div className="relative pl-6 border-l-2 border-brand-gold/30 space-y-8 select-text">
                  {pkg.itinerary.map((it, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="w-3.5 h-3.5 bg-[#121212] border-2 border-brand-gold rounded-full absolute -left-[33px] top-1.5" />
                      
                      <div className="text-[10px] font-bold text-brand-gold uppercase tracking-widest leading-none select-none">
                        {it.timeOrDay}
                      </div>
                      <h4 className="font-serif text-base font-semibold text-[#121212] mt-1.5 leading-tight">
                        {it.activity}
                      </h4>
                      <p className="text-xs text-gray-500 font-light leading-relaxed mt-1 font-sans">
                        {it.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INCLUSIONS & EXCLUSIONS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#eae6db] pt-10">
              {/* Inclusions */}
              <div>
                <h4 className="font-serif text-base font-semibold text-emerald-800 mb-4 flex items-center gap-2 select-none">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>{tPkg.inclusions || "Inclusions"}</span>
                </h4>
                <ul className="space-y-3 select-text text-xs text-gray-600 font-light leading-relaxed">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div>
                <h4 className="font-serif text-base font-semibold text-red-800 mb-4 flex items-center gap-2 select-none">
                  <X className="w-5 h-5 text-red-500" />
                  <span>{tPkg.exclusions || "Exclusions"}</span>
                </h4>
                <ul className="space-y-3 select-text text-xs text-gray-600 font-light leading-relaxed">
                  {pkg.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right sidebar column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden shadow-sm border border-[#eae6db] select-none">
              <Image
                src={pkg.aboutImage}
                alt="Package Secondary Photo"
                fill
                className="object-cover"
              />
            </div>

            {/* Why choose this experience */}
            <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm">
              <h3 className="font-serif text-base font-semibold text-[#121212] mb-4 border-b border-[#eae6db] pb-3">
                {tPkg.whyLoveUs || "Why Choose This Tour"}
              </h3>
              <div className="flex flex-col gap-5 select-text">
                {pkg.whyGuestsLoveUs.map((w, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="w-8 h-8 bg-brand-gold/10 text-brand-gold flex items-center justify-center rounded-full shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-[#121212] leading-tight">{w.title}</h4>
                      <p className="text-[11px] text-gray-500 font-light leading-relaxed mt-1">{w.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side CTA Panel */}
            <div id="book" className="bg-[#121212] text-white p-6 rounded-md shadow-lg select-none text-center">
              <span className="text-[9px] text-brand-gold font-bold tracking-widest uppercase">Direct Booking</span>
              <h4 className="font-serif text-lg font-normal text-white mt-1 mb-4">Chat with local coordinator</h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-light mb-6">
                Direct booking provides the most customizable experience details. Contact us on WhatsApp to confirm timing.
              </p>
              <a
                href={`https://wa.me/919000000000?text=Hi, I would like to book the package tour: ${encodeURIComponent(pkg.title)}`}
                target="_blank"
                className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider py-3.5 rounded-sm transition-all duration-300 text-[10px]"
              >
                <span>{tPkg.whatsappUs || "WhatsApp Us"}</span>
              </a>
            </div>
          </div>

        </section>

      </main>
    </>
  );
}
