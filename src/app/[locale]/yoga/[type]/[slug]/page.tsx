export const dynamic = "force-dynamic";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Clock, Check, Shield, Calendar, Phone, ChevronLeft, MapPin, Smile } from "lucide-react";
import PageAutoTranslator from "@/components/PageAutoTranslator";
import { API_BASE_URL } from "@/config/api";
import BookingButton from "@/components/BookingButton";
import { getContactSettings } from "@/utils/contactSettings";

import { localizeObject } from "@/utils/translator";

interface YogaDetails {
  _id: string;
  yogaType: string;
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
  schedule: Array<{ time: Record<string, string>; activity: Record<string, string> }>;
  benefits: Array<Record<string, string>>;
  inclusions: Array<Record<string, string>>;
  relatedYoga?: string[];
}

interface TeacherType {
  _id: string;
  name: string;
  role: Record<string, string>;
  bio: Record<string, string>;
  image: string;
}

async function getYogaDetails(slug: string): Promise<YogaDetails | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/items/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`[yoga details fetch]: Failed for slug ${slug}`, err);
    return null;
  }
}

async function getLeadTeacher(): Promise<TeacherType | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/teachers`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const list = json.data || [];
    return list.length > 0 ? list[0] : null;
  } catch (err) {
    console.warn("[yoga details fetch]: Failed to load lead teacher", err);
    return null;
  }
}

async function getAllYoga(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/items`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[yoga suggestions fetch]: Failed to load yoga items", err);
    return [];
  }
}

async function getAllProperties(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/accommodations/items`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[suggestions fetch]: Failed to load properties", err);
    return [];
  }
}

async function getAllPackages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/packages/items`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[suggestions fetch]: Failed to load packages", err);
    return [];
  }
}

export default async function YogaDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}) {
  const { locale, type, slug } = await params;
  
  const [rawYoga, rawTeacher, allYoga, allProperties, allPackages, contact] = await Promise.all([
    getYogaDetails(slug),
    getLeadTeacher(),
    getAllYoga(),
    getAllProperties(),
    getAllPackages(),
    getContactSettings(),
  ]);

  if (!rawYoga) {
    return notFound();
  }

  // Fetch translations
  const messages = await getMessages({ locale });
  const tYoga = messages.YogaDetails as any;

interface LocalizedYogaDetails {
  id: string;
  type: string;
  title: string;
  price: number;
  pricePeriod: string;
  image: string;
  aboutImage: string;
  duration: string;
  shortDescription: string;
  tagline: string;
  aboutText: string;
  schedule: Array<{ time: string; activity: string }>;
  benefits: string[];
  inclusions: string[];
  relatedYoga: string[];
}

  // Localize properties using translator helper
  const ly = await localizeObject(rawYoga, locale) as any;
  const yoga: LocalizedYogaDetails = {
    id: rawYoga._id,
    type: rawYoga.yogaType,
    title: ly.title,
    price: ly.price,
    pricePeriod: ly.pricePeriod,
    image: ly.image,
    aboutImage: rawYoga.aboutImage || rawYoga.image,
    duration: ly.duration,
    shortDescription: ly.shortDescription,
    tagline: ly.tagline,
    aboutText: ly.aboutText,
    schedule: await Promise.all(
      (rawYoga.schedule || []).map(async (sc) => ({
        time: await localizeObject(sc.time, locale) as any,
        activity: await localizeObject(sc.activity, locale) as any,
      }))
    ),
    benefits: await Promise.all(
      (rawYoga.benefits || []).map((b) => localizeObject(b, locale) as any)
    ),
    inclusions: await Promise.all(
      (rawYoga.inclusions || []).map((inc) => localizeObject(inc, locale) as any)
    ),
    relatedYoga: rawYoga.relatedYoga || [],
  };

  const teacher = rawTeacher ? await localizeObject(rawTeacher, locale) as any : null;

  // Resolve suggestions
  let suggestionsList: any[] = [];

  for (const rSlug of yoga.relatedYoga) {
    // 1. Check stays
    const foundStay = allProperties.find((p) => p.slug === rSlug);
    if (foundStay) {
      suggestionsList.push({
        id: foundStay._id,
        cardType: "accommodation",
        type: foundStay.accommodationType,
        title: foundStay.title[locale] || foundStay.title["en"] || "",
        price: foundStay.price,
        pricePeriod: foundStay.pricePeriod[locale] || foundStay.pricePeriod["en"] || "",
        image: foundStay.image,
        slug: foundStay.slug,
        category: foundStay.accommodationType === "villa" ? "villas" : foundStay.accommodationType === "floor" ? "floors" : "rooms",
      });
      continue;
    }

    // 2. Check packages
    const foundPkg = allPackages.find((p) => p.slug === rSlug);
    if (foundPkg) {
      suggestionsList.push({
        id: foundPkg._id,
        cardType: "package",
        type: foundPkg.packageCategory,
        title: foundPkg.title[locale] || foundPkg.title["en"] || "",
        price: foundPkg.price,
        pricePeriod: foundPkg.pricePeriod[locale] || foundPkg.pricePeriod["en"] || "",
        image: foundPkg.image,
        slug: foundPkg.slug,
        category: foundPkg.packageCategory === "varkalaSightseeing" ? "varkala-sightseeing" : foundPkg.packageCategory === "dayTrips" ? "day-trips" : foundPkg.packageCategory === "backwaterExperiences" ? "backwater-experiences" : foundPkg.packageCategory === "varkalaPackages" ? "varkala-packages" : "adventure-activities",
      });
      continue;
    }

    // 3. Check yoga
    const foundYoga = allYoga.find((y) => y.slug === rSlug);
    if (foundYoga) {
      suggestionsList.push({
        id: foundYoga._id,
        cardType: "yoga",
        type: foundYoga.yogaType,
        title: foundYoga.title[locale] || foundYoga.title["en"] || "",
        price: foundYoga.price,
        pricePeriod: foundYoga.pricePeriod[locale] || foundYoga.pricePeriod["en"] || "",
        image: foundYoga.image,
        slug: foundYoga.slug,
        category: foundYoga.yogaType,
      });
      continue;
    }
  }

  // Fallback to other yoga programs if empty
  if (suggestionsList.length === 0) {
    const defaultYoga = allYoga.filter((y) => y._id.toString() !== rawYoga._id.toString()).slice(0, 3);
    suggestionsList = defaultYoga.map((foundYoga) => ({
      id: foundYoga._id,
      cardType: "yoga",
      type: foundYoga.yogaType,
      title: foundYoga.title[locale] || foundYoga.title["en"] || "",
      price: foundYoga.price,
      pricePeriod: foundYoga.pricePeriod[locale] || foundYoga.pricePeriod["en"] || "",
      image: foundYoga.image,
      slug: foundYoga.slug,
      category: foundYoga.yogaType,
    }));
  } else if (suggestionsList.length < 3) {
    const alreadySlugs = suggestionsList.map((s) => s.slug);
    const fillers = allYoga.filter((y) => 
      y._id.toString() !== rawYoga._id.toString() && !alreadySlugs.includes(y.slug)
    ).slice(0, 3 - suggestionsList.length);
    const mappedFillers = fillers.map((foundYoga) => ({
      id: foundYoga._id,
      cardType: "yoga",
      type: foundYoga.yogaType,
      title: foundYoga.title[locale] || foundYoga.title["en"] || "",
      price: foundYoga.price,
      pricePeriod: foundYoga.pricePeriod[locale] || foundYoga.pricePeriod["en"] || "",
      image: foundYoga.image,
      slug: foundYoga.slug,
      category: foundYoga.yogaType,
    }));
    suggestionsList = [...suggestionsList, ...mappedFillers];
  }

  const suggestions = suggestionsList;

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16 font-sans">
        <PageAutoTranslator locale={locale}>
        
        {/* BANNER COVER PHOTO */}
        <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end bg-[#121212] overflow-hidden pt-28 pb-10">
          <div className="absolute inset-0 z-0">
            <Image
              src={yoga.image}
              alt={yoga.title}
              fill
              className="object-cover opacity-50 brightness-75 select-none"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent z-10" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link 
                href={`/${locale}/yoga/${type}`}
                className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{tYoga.back || "Back to listing"}</span>
              </Link>

              <div className="flex items-center gap-1.5 text-white/50 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
                <span>&gt;</span>
                <Link href={`/${locale}#yoga`} className="hover:text-brand-gold transition-colors">Yoga</Link>
                <span>&gt;</span>
                <Link href={`/${locale}/yoga/${type}`} className="hover:text-brand-gold transition-colors">
                  {type === "retreats" ? "Yoga Retreats" : type === "classes" ? "Daily Yoga Classes" : type === "private" ? "Private Yoga Sessions" : "Our Teachers"}
                </Link>
                <span>&gt;</span>
                <span className="text-brand-gold">{yoga.title}</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight">
              {yoga.title}
            </h1>
            <p className="max-w-3xl text-sm sm:text-base md:text-lg text-brand-gold font-serif italic mb-6">
              {yoga.tagline}
            </p>
            
            <div className="flex flex-col gap-6 md:flex-row md:items-center border-t border-white/10 pt-6 mt-8">
              <div className="flex items-center gap-2.5 text-white select-none">
                <Clock className="w-5 h-5 text-brand-gold" />
                <div className="text-left">
                  <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Program Type</span>
                  <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">{yoga.duration}</h4>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-white select-none md:ml-8">
                <Shield className="w-5 h-5 text-brand-gold" />
                <div className="text-left">
                  <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Investment</span>
                  <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">₹{yoga.price.toLocaleString()} {yoga.pricePeriod}</h4>
                </div>
              </div>

              <div className="flex items-center gap-4 select-none md:ml-auto">
                <BookingButton
                  className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm"
                  context={`Yoga Program: ${yoga.title}`}
                >
                  {tYoga.bookNow || "Book Now"}
                </BookingButton>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left animate-fade-in">
          
          {/* Left Details column */}
          <div className="lg:col-span-8 flex flex-col items-start">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none">
              {tYoga.overview || "Overview"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
              Program Description
            </h2>
            <div className="text-sm font-sans font-light leading-relaxed text-gray-700 select-text mb-12">
              <p>{yoga.aboutText}</p>
            </div>

            {/* SCHEDULE */}
            {yoga.schedule.length > 0 && (
              <div className="w-full mb-12">
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-6 border-b border-[#eae6db] pb-3">
                  {tYoga.schedule || "Daily Schedule"}
                </h3>
                <div className="relative pl-6 border-l-2 border-brand-gold/30 space-y-6 select-text">
                  {yoga.schedule.map((sc, idx) => (
                    <div key={idx} className="relative">
                      {/* Dot */}
                      <div className="w-3 h-3 bg-[#121212] border border-brand-gold rounded-full absolute -left-[31px] top-1" />
                      
                      <span className="text-[10px] font-bold text-brand-gold tracking-widest leading-none select-none">
                        {sc.time}
                      </span>
                      <h4 className="font-serif text-sm font-semibold text-[#121212] mt-1 leading-tight">
                        {sc.activity}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BENEFITS & INCLUSIONS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#eae6db] pt-10">
              {/* Benefits */}
              <div>
                <h4 className="font-serif text-base font-semibold text-emerald-800 mb-4 flex items-center gap-2 select-none">
                  <Smile className="w-5 h-5 text-emerald-600" />
                  <span>Wellness Benefits</span>
                </h4>
                <ul className="space-y-3 select-text text-xs text-gray-600 font-light leading-relaxed">
                  {yoga.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inclusions */}
              <div>
                <h4 className="font-serif text-base font-semibold text-[#121212] mb-4 flex items-center gap-2 select-none">
                  <Check className="w-5 h-5 text-brand-gold" />
                  <span>{tYoga.benefits || "Inclusions"}</span>
                </h4>
                <ul className="space-y-3 select-text text-xs text-gray-600 font-light leading-relaxed">
                  {yoga.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                      <span>{inc}</span>
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
                src={yoga.aboutImage}
                alt="Yoga Program Secondary Photo"
                fill
                className="object-cover"
              />
            </div>

            {/* Teacher showcase card */}
            {teacher && (
              <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm select-text text-center flex flex-col items-center">
                <h3 className="font-serif text-base font-semibold text-[#121212] mb-4 border-b border-[#eae6db] pb-3 w-full">
                  {tYoga.teachers || "Program Director"}
                </h3>
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-brand-gold/30 bg-gray-50 mb-3 select-none">
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-serif font-semibold text-[#121212] leading-tight">{teacher.name}</h4>
                <span className="text-[9px] text-brand-gold uppercase tracking-wider font-bold mt-0.5 mb-3 block leading-none">
                  {teacher.role}
                </span>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed font-sans">
                  {teacher.bio}
                </p>
              </div>
            )}

            {/* Side CTA Panel */}
            <div id="book" className="bg-[#121212] text-white p-6 rounded-md shadow-lg select-none text-center">
              <span className="text-[9px] text-brand-gold font-bold tracking-widest uppercase">Direct Booking</span>
              <h4 className="font-serif text-lg font-normal text-white mt-1 mb-4">Request wellness package</h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-light mb-6">
                Consult with our Acharyas to design a personal retreat or schedule a private therapy session.
              </p>
              <a
                href={`https://wa.me/${(contact.whatsapp || "+91 73560 85055").replace(/[^0-9]/g, "")}?text=Hi, I would like to consult/book the yoga package: ${encodeURIComponent(yoga.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider py-3.5 rounded-sm transition-all duration-300 text-[10px]"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </section>

        {/* Row: Related yoga programs */}
        {suggestions.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 border-t border-[#eae6db] pt-16 text-left">
            <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block select-none">
              Recommendations
            </span>
            <h3 className="font-serif text-3xl font-normal text-[#121212] mb-8">
              Other Yoga Programs You Might Enjoy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {suggestions.map((y) => {
                let href = `/${locale}/yoga/${y.category}/${y.slug}`;
                if (y.cardType === "accommodation") {
                  href = `/${locale}/accommodation/${y.category}/${y.slug}`;
                } else if (y.cardType === "package") {
                  href = `/${locale}/packages/${y.category}/${y.slug}`;
                }

                return (
                  <Link
                    key={y.slug}
                    href={href}
                    className="bg-white border border-[#eae6db]/80 rounded-sm overflow-hidden hover:shadow-md group transition-all duration-300 flex flex-col"
                  >
                    <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                      {y.image ? (
                        <Image
                          src={y.image}
                          alt={y.title}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#121212]/20" />
                      )}
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] font-bold text-brand-gold uppercase tracking-wider block mb-1">
                          {y.cardType === "accommodation" ? "🏨 Stay" : y.cardType === "yoga" ? "🧘 Yoga" : "🎒 Tour"}
                        </span>
                        <h4 className="font-serif text-base font-semibold text-[#121212] group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
                          {y.title}
                        </h4>
                      </div>
                      {y.duration && (
                        <div className="flex items-center justify-between border-t border-gray-150 pt-4 mt-4 text-[10px]">
                          <span className="text-gray-400 uppercase tracking-widest text-[9px] font-medium">Duration</span>
                          <span className="font-medium text-gray-600">{y.duration}</span>
                        </div>
                      )}
                      <div className={`flex items-center justify-between text-[10px] ${y.duration ? "pt-2" : "border-t border-gray-150 pt-4 mt-4"}`}>
                        <span className="text-gray-400 uppercase tracking-widest text-[9px] font-medium">Starting from</span>
                        <span className="font-bold text-gray-800">
                          {y.price > 0 ? `₹${y.price.toLocaleString()} ${y.pricePeriod}` : "On Request"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        </PageAutoTranslator>
      </main>
    </>
  );
}
