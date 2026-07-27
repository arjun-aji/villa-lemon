import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { 
  Clock, Check, X, Shield, Calendar, Phone, ChevronLeft, 
  MapPin, HelpCircle, AlertCircle, Compass, ListCollapse, 
  Map, Briefcase, Play, Users, Gauge, Info
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

import { localizeObject } from "@/utils/translator";

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

  // General Info
  travelTime?: Record<string, string>;
  entryFee?: Record<string, string>;
  optionalCharges?: Record<string, string>;
  difficulty?: Record<string, string>;
  groupSize?: Record<string, string>;
  location?: Record<string, string>;

  // Localized Content
  tourOverview?: Record<string, string>;
  bestTime?: Record<string, string>;
  dressCode?: Record<string, string>;
  cta?: Record<string, string>;

  // Media
  video?: string;
  gallery?: string[];

  // Quick Facts
  quickFacts?: Array<{ key: Record<string, string>; value: Record<string, string> }>;

  // Things to Bring
  thingsToBring?: Array<Record<string, string>>;

  // Nearby Attractions
  nearbyAttractions?: Array<{ name: Record<string, string>; distance: Record<string, string> }>;

  // Related Packages
  relatedPackages?: string[];

  // FAQs
  faqs?: Array<{ question: Record<string, string>; answer: Record<string, string> }>;

  // Booking Information
  cancellation?: Record<string, string>;
  refund?: Record<string, string>;
  pickup?: Record<string, string>;
  drop?: Record<string, string>;
  notes?: Record<string, string>;
}

async function getPackageDetails(slug: string): Promise<PackageDetails | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/packages/items/${slug}`, {
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

async function getAllPackages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/packages/items`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn(`[all packages fetch]: Failed`, err);
    return [];
  }
}

async function getAllProperties(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/accommodations/items`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[suggestions fetch]: Failed to load properties", err);
    return [];
  }
}

async function getAllYoga(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/items`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[suggestions fetch]: Failed to load yoga items", err);
    return [];
  }
}

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
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

  // Fetch all packages, stays, and yoga programs for related recommendations
  const [allProperties, allPackages, allYoga] = await Promise.all([
    getAllProperties(),
    getAllPackages(),
    getAllYoga(),
  ]);

  // Fetch translations
  const messages = await getMessages({ locale });
  const tPkg = messages.PackageDetails as any;

interface LocalizedPackageDetails {
  id: string;
  category: string;
  title: string;
  price: number;
  pricePeriod: string;
  image: string;
  aboutImage: string;
  duration: string;
  shortDescription: string;
  tagline: string;
  aboutText: string;
  itinerary: Array<{ timeOrDay: string; activity: string; desc: string }>;
  inclusions: string[];
  exclusions: string[];
  highlights: Array<{ icon: string; label: string }>;
  whyGuestsLoveUs: Array<{ icon: string; title: string; desc: string }>;
  travelTime: string;
  entryFee: string;
  optionalCharges: string;
  difficulty: string;
  groupSize: string;
  location: string;
  tourOverview: string;
  bestTime: string;
  dressCode: string;
  cta: string;
  video: string;
  gallery: string[];
  quickFacts: Array<{ key: string; value: string }>;
  thingsToBring: string[];
  nearbyAttractions: Array<{ name: string; distance: string }>;
  relatedPackages: string[];
  faqs: Array<{ question: string; answer: string }>;
  cancellation: string;
  refund: string;
  pickup: string;
  drop: string;
  notes: string;
}

  // Localize properties using helper
  const lp = await localizeObject(rawPackage, locale) as any;
  const pkg: LocalizedPackageDetails = {
    id: rawPackage._id,
    category: rawPackage.packageCategory,
    title: lp.title,
    price: lp.price,
    pricePeriod: lp.pricePeriod,
    image: lp.image,
    aboutImage: rawPackage.aboutImage || rawPackage.image,
    duration: lp.duration,
    shortDescription: lp.shortDescription,
    tagline: lp.tagline,
    aboutText: lp.aboutText,
    itinerary: await Promise.all(
      (rawPackage.itinerary || []).map(async (it) => ({
        timeOrDay: await localizeObject(it.timeOrDay, locale) as any,
        activity: await localizeObject(it.activity, locale) as any,
        desc: await localizeObject(it.desc, locale) as any,
      }))
    ),
    inclusions: await Promise.all(
      (rawPackage.inclusions || []).map((inc) => localizeObject(inc, locale) as any)
    ),
    exclusions: await Promise.all(
      (rawPackage.exclusions || []).map((exc) => localizeObject(exc, locale) as any)
    ),
    highlights: await Promise.all(
      (rawPackage.highlights || []).map(async (h) => ({
        icon: h.icon,
        label: await localizeObject(h.label, locale) as any,
      }))
    ),
    whyGuestsLoveUs: await Promise.all(
      (rawPackage.whyGuestsLoveUs || []).map(async (w) => ({
        icon: w.icon,
        title: await localizeObject(w.title, locale) as any,
        desc: await localizeObject(w.desc, locale) as any,
      }))
    ),
    travelTime: lp.travelTime,
    entryFee: lp.entryFee,
    optionalCharges: lp.optionalCharges,
    difficulty: lp.difficulty,
    groupSize: lp.groupSize,
    location: lp.location,
    tourOverview: lp.tourOverview,
    bestTime: lp.bestTime,
    dressCode: lp.dressCode,
    cta: lp.cta,
    video: lp.video || "",
    gallery: lp.gallery || [],
    quickFacts: await Promise.all(
      (rawPackage.quickFacts || []).map(async (qf) => ({
        key: await localizeObject(qf.key, locale) as any,
        value: await localizeObject(qf.value, locale) as any,
      }))
    ),
    thingsToBring: await Promise.all(
      (rawPackage.thingsToBring || []).map((tb) => localizeObject(tb, locale) as any)
    ),
    nearbyAttractions: await Promise.all(
      (rawPackage.nearbyAttractions || []).map(async (na) => ({
        name: await localizeObject(na.name, locale) as any,
        distance: await localizeObject(na.distance, locale) as any,
      }))
    ),
    relatedPackages: rawPackage.relatedPackages || [],
    faqs: await Promise.all(
      (rawPackage.faqs || []).map(async (faq) => ({
        question: await localizeObject(faq.question, locale) as any,
        answer: await localizeObject(faq.answer, locale) as any,
      }))
    ),
    cancellation: lp.cancellation,
    refund: lp.refund,
    pickup: lp.pickup,
    drop: lp.drop,
    notes: lp.notes,
  };

  // Resolve related items lists
  let relatedList: any[] = [];

  for (const rSlug of pkg.relatedPackages) {
    // 1. Check stays
    const foundStay = allProperties.find((p) => p.slug === rSlug);
    if (foundStay) {
      relatedList.push({
        id: foundStay._id,
        cardType: "accommodation",
        type: foundStay.accommodationType,
        title: foundStay.title[locale] || foundStay.title["en"] || "",
        price: foundStay.price,
        pricePeriod: foundStay.pricePeriod[locale] || foundStay.pricePeriod["en"] || "",
        image: foundStay.image,
        bedrooms: foundStay.bedrooms,
        bathrooms: foundStay.bathrooms,
        guests: foundStay.guests,
        location: foundStay.location[locale] || foundStay.location["en"] || "",
        shortDescription: foundStay.shortDescription[locale] || foundStay.shortDescription["en"] || "",
        tagline: foundStay.tagline[locale] || foundStay.tagline["en"] || "",
        slug: foundStay.slug,
        category: foundStay.accommodationType === "villa" ? "villas" : foundStay.accommodationType === "floor" ? "floors" : "rooms",
      });
      continue;
    }

    // 2. Check packages
    const foundPkg = allPackages.find((p) => p.slug === rSlug);
    if (foundPkg) {
      relatedList.push({
        id: foundPkg._id,
        cardType: "package",
        type: foundPkg.packageCategory,
        title: foundPkg.title[locale] || foundPkg.title["en"] || "",
        price: foundPkg.price,
        pricePeriod: foundPkg.pricePeriod[locale] || foundPkg.pricePeriod["en"] || "",
        image: foundPkg.image,
        bedrooms: 0,
        bathrooms: 0,
        guests: 0,
        location: foundPkg.location?.[locale] || foundPkg.location?.["en"] || "Varkala, Kerala",
        shortDescription: foundPkg.shortDescription[locale] || foundPkg.shortDescription["en"] || "",
        tagline: foundPkg.tagline[locale] || foundPkg.tagline["en"] || "",
        slug: foundPkg.slug,
        category: foundPkg.packageCategory === "varkalaSightseeing" ? "varkala-sightseeing" : foundPkg.packageCategory === "dayTrips" ? "day-trips" : foundPkg.packageCategory === "backwaterExperiences" ? "backwater-experiences" : "adventure-activities",
      });
      continue;
    }

    // 3. Check yoga
    const foundYoga = allYoga.find((y) => y.slug === rSlug);
    if (foundYoga) {
      relatedList.push({
        id: foundYoga._id,
        cardType: "yoga",
        type: foundYoga.yogaType,
        title: foundYoga.title[locale] || foundYoga.title["en"] || "",
        price: foundYoga.price,
        pricePeriod: foundYoga.pricePeriod[locale] || foundYoga.pricePeriod["en"] || "",
        image: foundYoga.image,
        bedrooms: 0,
        bathrooms: 0,
        guests: 0,
        location: "Varkala, Kerala",
        shortDescription: foundYoga.shortDescription[locale] || foundYoga.shortDescription["en"] || "",
        tagline: foundYoga.tagline[locale] || foundYoga.tagline["en"] || "",
        slug: foundYoga.slug,
        category: foundYoga.yogaType,
      });
      continue;
    }
  }

  // Fallback to other packages under same category or other packages if empty
  if (relatedList.length === 0) {
    const defaultPkgs = allPackages.filter((p) => p._id.toString() !== rawPackage._id.toString()).slice(0, 3);
    relatedList = defaultPkgs.map((foundPkg) => ({
      id: foundPkg._id,
      cardType: "package",
      type: foundPkg.packageCategory,
      title: foundPkg.title[locale] || foundPkg.title["en"] || "",
      price: foundPkg.price,
      pricePeriod: foundPkg.pricePeriod[locale] || foundPkg.pricePeriod["en"] || "",
      image: foundPkg.image,
      slug: foundPkg.slug,
      category: foundPkg.packageCategory === "varkalaSightseeing" ? "varkala-sightseeing" : foundPkg.packageCategory === "dayTrips" ? "day-trips" : foundPkg.packageCategory === "backwaterExperiences" ? "backwater-experiences" : "adventure-activities",
    }));
  } else if (relatedList.length < 3) {
    const alreadySlugs = relatedList.map((s) => s.slug);
    const fillers = allPackages.filter((p) => 
      p._id.toString() !== rawPackage._id.toString() && !alreadySlugs.includes(p.slug)
    ).slice(0, 3 - relatedList.length);
    const mappedFillers = fillers.map((foundPkg) => ({
      id: foundPkg._id,
      cardType: "package",
      type: foundPkg.packageCategory,
      title: foundPkg.title[locale] || foundPkg.title["en"] || "",
      price: foundPkg.price,
      pricePeriod: foundPkg.pricePeriod[locale] || foundPkg.pricePeriod["en"] || "",
      image: foundPkg.image,
      slug: foundPkg.slug,
      category: foundPkg.packageCategory === "varkalaSightseeing" ? "varkala-sightseeing" : foundPkg.packageCategory === "dayTrips" ? "day-trips" : foundPkg.packageCategory === "backwaterExperiences" ? "backwater-experiences" : "adventure-activities",
    }));
    relatedList = [...relatedList, ...mappedFillers];
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(pkg.video);

  return (
    <>
      <Navbar absoluteOnly={true} />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16 font-sans">
        
        {/* BANNER COVER PHOTO */}
        <section className="relative w-full min-h-[300px] md:min-h-[400px] flex items-end bg-[#121212] overflow-hidden pt-28 pb-12">
          <div className="absolute inset-0 z-0">
            {pkg.image ? (
              <Image
                src={pkg.image}
                alt={pkg.title}
                fill
                className="object-cover opacity-50 brightness-75 select-none"
                priority
              />
            ) : (
              <div className="w-full h-full bg-brand-dark/80" />
            )}
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
                <span className="text-brand-gold truncate max-w-[200px]">{pkg.title}</span>
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
                  <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">{pkg.duration || "N/A"}</h4>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-white select-none md:ml-8">
                <Shield className="w-5 h-5 text-brand-gold" />
                <div className="text-left">
                  <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Pricing</span>
                  <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">
                    {pkg.price > 0 ? `₹${pkg.price.toLocaleString()} ${pkg.pricePeriod}` : "On Request"}
                  </h4>
                </div>
              </div>

              {pkg.location && (
                <div className="flex items-center gap-2.5 text-white select-none md:ml-8">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                  <div className="text-left">
                    <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Location</span>
                    <h4 className="text-xs font-bold mt-1 uppercase tracking-wider truncate max-w-[220px]">{pkg.location}</h4>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 select-none md:ml-auto">
                <a
                  href="#book"
                  className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm"
                >
                  {pkg.cta || tPkg.bookNow || "Book Now"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: OVERVIEW, DETAILS & HIGHLIGHTS */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Left Column: Description & Core features (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-start space-y-10">
            
            {/* GENERAL & QUICK FACTS SUMMARY */}
            <div className="w-full bg-white border border-[#eae6db]/65 p-6 md:p-8 rounded-sm shadow-sm">
              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block select-none">
                Key Parameters
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#121212] mb-6">
                Tour General Information
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 select-text text-xs">
                {pkg.difficulty && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium uppercase text-[9px] tracking-wider">Difficulty</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-brand-gold" /> {pkg.difficulty}</span>
                  </div>
                )}
                {pkg.groupSize && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium uppercase text-[9px] tracking-wider">Group Size</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-gold" /> {pkg.groupSize}</span>
                  </div>
                )}
                {pkg.travelTime && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium uppercase text-[9px] tracking-wider">Travel Time</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-gold" /> {pkg.travelTime}</span>
                  </div>
                )}
                {pkg.bestTime && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium uppercase text-[9px] tracking-wider">Best Time</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-gold" /> {pkg.bestTime}</span>
                  </div>
                )}
                {pkg.entryFee && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium uppercase text-[9px] tracking-wider">Entry Fees</span>
                    <span className="font-semibold text-gray-700">{pkg.entryFee}</span>
                  </div>
                )}
                {pkg.optionalCharges && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium uppercase text-[9px] tracking-wider">Optional Fees</span>
                    <span className="font-semibold text-gray-700">{pkg.optionalCharges}</span>
                  </div>
                )}
                {pkg.dressCode && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 font-medium uppercase text-[9px] tracking-wider">Dress Code</span>
                    <span className="font-semibold text-gray-700">{pkg.dressCode}</span>
                  </div>
                )}
              </div>

              {/* QUICK FACTS LIST (KEY VALUE) */}
              {pkg.quickFacts.length > 0 && (
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3.5 flex items-center gap-1"><Info className="w-3.5 h-3.5 text-brand-gold" /> Quick Facts</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    {pkg.quickFacts.map((fact, idx) => (
                      <div key={idx} className="bg-[#fbf9f6] p-2.5 rounded-sm border border-[#eae6db]/30 flex flex-col gap-0.5">
                        <span className="font-serif font-semibold text-[#121212]">{fact.key}</span>
                        <span className="text-gray-500 font-light">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* HIGHLIGHTS */}
            {pkg.highlights.length > 0 && (
              <div className="w-full bg-[#eae6db]/15 border border-[#eae6db]/60 p-6 md:p-8 rounded-sm">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block select-none">
                  Key Experiences
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#121212] mb-6">
                  Tour Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pkg.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs bg-white/70 p-3 border border-[#eae6db]/30 rounded-sm">
                      <Compass className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span className="font-serif font-medium text-gray-800 leading-tight">{hl.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="w-full flex flex-col items-start select-text text-left">
              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block select-none">
                {tPkg.overview || "Overview"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#121212] mb-5 leading-tight tracking-wide">
                Experience Description
              </h2>
              {pkg.tourOverview && (
                <div className="text-sm font-sans font-light leading-relaxed text-gray-700 mb-6 bg-white border border-[#eae6db]/40 p-5 italic rounded-sm shadow-2xs w-full">
                  {pkg.tourOverview.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-3 last:mb-0">{para}</p>
                  ))}
                </div>
              )}
              <div className="text-sm font-sans font-light leading-relaxed text-gray-700 space-y-4">
                {pkg.aboutText.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Top Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden shadow-sm border border-[#eae6db] select-none">
              {pkg.aboutImage ? (
                <Image
                  src={pkg.aboutImage}
                  alt="Package Secondary Photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand-dark/20" />
              )}
            </div>

            {/* Direct Booking WhatsApp Card */}
            <div id="book" className="bg-[#121212] text-white p-6 rounded-sm shadow-lg select-none text-center">
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
                <span>{pkg.cta || tPkg.whatsappUs || "WhatsApp Us"}</span>
              </a>
            </div>

            {/* EMBEDDED VIDEO */}
            {youtubeEmbedUrl && (
              <div className="w-full space-y-2">
                <h4 className="font-serif text-sm font-semibold text-[#121212]">Video Preview</h4>
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-[#eae6db] shadow-xs bg-black">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`${pkg.title} Tour Video`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: ITINERARY & WHY JOIN SIDE-BY-SIDE */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left border-t border-[#eae6db] pt-12">
          
          {/* Left: Itinerary Timeline (7 cols) */}
          <div className="lg:col-span-7">
            {pkg.itinerary.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#121212] mb-8 border-b border-[#eae6db] pb-3">
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
          </div>

          {/* Right: Why Choose, Things to bring & Guidelines (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Why choose this experience */}
            {pkg.whyGuestsLoveUs.length > 0 && (
              <div className="bg-white border border-[#eae6db]/85 rounded-sm p-6 shadow-sm">
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
            )}

            {/* Things to Bring */}
            {pkg.thingsToBring.length > 0 && (
              <div className="bg-white border border-[#eae6db]/85 rounded-sm p-6 shadow-sm">
                <h3 className="font-serif text-base font-semibold text-amber-800 mb-4 border-b border-[#eae6db] pb-3 flex items-center gap-2 select-none">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <span>Things to Bring</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 select-text text-xs text-gray-600 font-light leading-relaxed">
                  {pkg.thingsToBring.map((tb, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{tb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* BOOKING DETAILS & POLICIES CARD */}
            {(pkg.cancellation || pkg.refund || pkg.pickup || pkg.drop) && (
              <div className="bg-white border border-[#eae6db]/85 rounded-sm p-6 shadow-sm">
                <h3 className="font-serif text-base font-semibold text-[#121212] mb-4 border-b border-[#eae6db] pb-3">
                  Tour Guidelines & Policies
                </h3>
                <div className="flex flex-col gap-4 text-xs">
                  {pkg.cancellation && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Cancellation</span>
                      <p className="text-gray-600 font-light leading-relaxed">{pkg.cancellation}</p>
                    </div>
                  )}
                  {pkg.refund && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Refund Timeline</span>
                      <p className="text-gray-600 font-light leading-relaxed">{pkg.refund}</p>
                    </div>
                  )}
                  {pkg.pickup && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Pickup Logistics</span>
                      <p className="text-gray-600 font-light leading-relaxed">{pkg.pickup}</p>
                    </div>
                  )}
                  {pkg.drop && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Drop Off Logistics</span>
                      <p className="text-gray-600 font-light leading-relaxed">{pkg.drop}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* IMPORTANT NOTES ALERT BOX */}
            {pkg.notes && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex gap-3 text-xs text-amber-800 text-left">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[9px] block mb-1">Please Note</span>
                  <p className="font-light leading-relaxed font-sans">{pkg.notes}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: INCLUSIONS, GALLERY, FAQS */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 space-y-16 text-left">
          
          {/* Row: Inclusions & Exclusions */}
          {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#eae6db] pt-12">
              {/* Inclusions */}
              {pkg.inclusions.length > 0 && (
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
              )}

              {/* Exclusions */}
              {pkg.exclusions.length > 0 && (
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
              )}
            </div>
          )}

          {/* Row: Gallery */}
          {pkg.gallery.length > 0 && (
            <div className="w-full border-t border-[#eae6db] pt-12">
              <h3 className="font-serif text-2xl font-normal text-[#121212] mb-6">
                Tour Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pkg.gallery.map((imgUrl, i) => (
                  <div 
                    key={i} 
                    className="relative w-full aspect-video rounded-sm overflow-hidden border border-[#eae6db]/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${pkg.title} Gallery image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row: FAQs & Attractions side by side */}
          {(pkg.faqs.length > 0 || pkg.nearbyAttractions.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-[#eae6db] pt-12">
              {/* FAQs (7 cols) */}
              <div className="lg:col-span-7">
                {pkg.faqs.length > 0 && (
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-[#121212] mb-6 flex items-center gap-2">
                      <HelpCircle className="w-6 h-6 text-brand-gold" />
                      <span>Frequently Asked Questions</span>
                    </h3>
                    <div className="space-y-2">
                      {pkg.faqs.map((faq, idx) => (
                        <details key={idx} className="group border-b border-[#eae6db] pb-4">
                          <summary className="flex items-center justify-between cursor-pointer font-serif text-sm sm:text-base font-semibold text-[#121212] py-3 focus:outline-none select-none list-none [&::-webkit-details-marker]:hidden">
                            <span>{faq.question}</span>
                            <span className="text-brand-gold font-serif transition-transform duration-300 group-open:rotate-180">+</span>
                          </summary>
                          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed pl-1 pt-1 font-sans">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Nearby Attractions Explore card (5 cols) */}
              <div className="lg:col-span-5">
                {pkg.nearbyAttractions.length > 0 && (
                  <div className="bg-white border border-[#eae6db]/80 rounded-sm p-6 flex flex-col gap-6 shadow-xs">
                    <div className="bg-brand-dark text-brand-cream p-5 rounded-sm flex flex-col justify-center text-center items-center w-full shrink-0">
                      <Map className="w-8 h-8 text-brand-gold mb-2" />
                      <h4 className="font-serif text-sm font-semibold tracking-wider uppercase">Explore Nearby</h4>
                      <p className="text-[10px] text-brand-cream/65 leading-relaxed mt-1 font-light">Landmark proximity from experience location</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3.5 text-xs text-left">
                      {pkg.nearbyAttractions.map((att, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="font-serif font-medium text-gray-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {att.name}
                          </span>
                          <span className="font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm text-[10px]">{att.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Row: Related packages */}
          {relatedList.length > 0 && (
            <div className="border-t border-[#eae6db] pt-12">
              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block select-none">
                Recommendations
              </span>
              <h3 className="font-serif text-3xl font-normal text-[#121212] mb-8">
                Other Tours You Might Enjoy
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedList.map((rp) => {
                  let href = `/${locale}/packages/${rp.category}/${rp.slug}`;
                  if (rp.cardType === "accommodation") {
                    href = `/${locale}/accommodation/${rp.category}/${rp.slug}`;
                  } else if (rp.cardType === "yoga") {
                    href = `/${locale}/yoga/${rp.category}/${rp.slug}`;
                  }

                  return (
                    <Link
                      key={rp.slug}
                      href={href}
                      className="bg-white border border-[#eae6db]/80 rounded-sm overflow-hidden hover:shadow-md group transition-all duration-300 flex flex-col"
                    >
                      <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                        {rp.image ? (
                          <Image
                            src={rp.image}
                            alt={rp.title}
                            fill
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-brand-dark/20" />
                        )}
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] font-bold text-brand-gold uppercase tracking-wider block mb-1">
                            {rp.cardType === "accommodation" ? "🏨 Stay" : rp.cardType === "yoga" ? "🧘 Yoga" : "🎒 Tour"}
                          </span>
                          <h4 className="font-serif text-base font-semibold text-[#121212] group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
                            {rp.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 text-xs">
                          <span className="text-gray-400 uppercase tracking-widest text-[9px] font-medium">Starting from</span>
                          <span className="font-bold text-gray-800">
                            {rp.price > 0 ? `₹${rp.price.toLocaleString()} ${rp.pricePeriod}` : "On Request"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </section>

      </main>
    </>
  );
}
