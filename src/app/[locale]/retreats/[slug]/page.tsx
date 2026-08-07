export const revalidate = 3600;
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const retreat = await getRetreatDetails(slug);
  
  const loc = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field["en"] || Object.values(field)[0] || "";
  };

  if (!retreat) {
    return {
      title: "Retreat Details | Villa Lemon",
      description: "Explore wellness retreats at Villa Lemon.",
      alternates: {
        canonical: `/${locale}/retreats/${slug}`,
      },
    };
  }

  const title = retreat.metaTitle?.[locale] || retreat.metaTitle?.en || `${loc(retreat.heroTitle)} | Villa Lemon`;
  const description = retreat.metaDescription?.[locale] || retreat.metaDescription?.en || loc(retreat.shortDescription) || `Discover the retreat ${loc(retreat.heroTitle)} at Villa Lemon in Varkala, Kerala.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/${locale}/retreats/${slug}`,
    },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: `https://villalemon.in/${locale}/retreats/${slug}`,
      images: [
        {
          url: retreat.heroImage || "/assets/hero.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Clock, Check, X, Shield, Calendar, Phone, ChevronLeft,
  MapPin, HelpCircle, Award, Compass, Users, Sparkles, Heart,
  Flame, Leaf, Coffee, Smile, Star, ArrowRight, BookOpen, ExternalLink
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import PageAutoTranslator from "@/components/PageAutoTranslator";
import { getContactSettings } from "@/utils/contactSettings";
import BookingButton from "@/components/BookingButton";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface RetreatDetail {
  _id: string;
  slug: string;
  days: number;
  nights: number;
  price: number;
  location: Record<string, string>;
  difficulty: Record<string, string>;
  yogaLevel: Record<string, string>;
  language: Record<string, string>;
  groupSize: Record<string, string>;
  minAge: number;
  maxCapacity: number;
  certificate: boolean;
  accommodationType: Record<string, string>;
  status: string;
  featured: boolean;
  hideRate?: boolean;
  metaTitle?: Record<string, string>;
  metaDescription?: Record<string, string>;
  keywords?: Record<string, string>;
  canonicalUrl?: string;

  // Content
  heroTitle: Record<string, string>;
  heroSubtitle: Record<string, string>;
  tagline: Record<string, string>;
  shortDescription: Record<string, string>;
  fullDescription: Record<string, string>;
  retreatOverview: Record<string, string>;
  whyChoose: Record<string, string>;
  whoIsItFor: Record<string, string>;
  bestTime: Record<string, string>;
  cta: Record<string, string>;

  // Media
  heroImage: string;
  video?: string;
  retreatMap?: string;
  brochurePdf?: string;

  // Repeaters
  highlights?: Array<{ icon: string; title: Record<string, string>; description: Record<string, string> }>;
  dailySchedule?: Array<{ time: string; activity: Record<string, string>; description: Record<string, string>; icon?: string }>;
  curriculum?: Array<{ dayNumber: number; dayTitle: Record<string, string>; description: Record<string, string>; topics?: Record<string, string>[]; learningOutcome?: Record<string, string>; images?: string[] }>;
  excursions?: Array<{ name: Record<string, string>; duration: Record<string, string>; description: Record<string, string>; image: string; highlights?: Record<string, string>[]; relatedTour?: string; included?: boolean }>;
  rooms?: Array<{ name: Record<string, string>; image: string; description: Record<string, string>; occupancy: number; isPrivate: boolean; hasAC: boolean; hasBathroom: boolean; hasBalcony: boolean; hasWorkspace: boolean; hotWater: boolean; sharedPrice: number; privatePrice: number; features?: Record<string, string>[]; hideRate?: boolean }>;
  meals?: Array<{ mealType: Record<string, string>; description: Record<string, string>; isVegan: boolean; isGlutenFree: boolean; isLactoseFree: boolean; gallery?: string[]; menuItems?: Record<string, string>[] }>;
  teachers?: Array<{ name: string; photo: string; experience: string; specialization: Record<string, string>; bio: Record<string, string>; certificates?: Record<string, string>[]; instagramUrl?: string; facebookUrl?: string; websiteUrl?: string }>;
  ayurvedaTitle?: Record<string, string>;
  ayurvedaDescription?: Record<string, string>;
  ayurvedaTreatments?: Array<{ name: Record<string, string>; description: Record<string, string>; isOptional: boolean; extraCost: number }>;
  pricingRows?: Array<{ roomCategory: Record<string, string>; sharedPrice: number; privatePrice: number; availability: Record<string, string>; upgradeCost: number }>;

  // Checklists
  inclusions?: Record<string, string>[];
  exclusions?: Record<string, string>[];
  thingsToBring?: Record<string, string>[];
  dressCode?: Record<string, string>[];
  requirements?: Record<string, string>[];
  whoShouldAvoid?: Record<string, string>[];

  faqs?: Array<{ question: Record<string, string>; answer: Record<string, string> }>;
  reviews?: Array<{ name: string; country: string; photo: string; stars: number; review: Record<string, string>; retreatJoined?: string }>;
  certificates?: Array<{ image: string; name: Record<string, string>; description: Record<string, string> }>;

  // Yoga Program
  yogaStyle?: Record<string, string>;
  morningSession?: Record<string, string>;
  eveningSession?: Record<string, string>;
  meditation?: Record<string, string>;
  pranayama?: Record<string, string>;
  philosophy?: Record<string, string>;
  classLanguage?: Record<string, string>;
  suitableFor?: Record<string, string>;
  yogaCertificate?: Record<string, string>;
  yogaHours?: number;
  yogaDescription?: Record<string, string>;

  // Settings
  bookingOpen?: boolean;
  availableDates?: string[];
  isPopular?: boolean;
  isSoldOut?: boolean;

  // Booking Policies
  deposit?: Record<string, string>;
  balancePayment?: Record<string, string>;
  cancellation?: Record<string, string>;
  refund?: Record<string, string>;
  pickup?: Record<string, string>;
  drop?: Record<string, string>;
  checkIn?: string;
  checkOut?: string;
  bookingTerms?: Record<string, string>;
}

async function getRetreatDetails(slug: string): Promise<RetreatDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/retreats/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`[retreat details fetch]: Failed for slug ${slug}`, err);
    return null;
  }
}

export default async function RetreatDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [rawRetreat, contact] = await Promise.all([
    getRetreatDetails(slug),
    getContactSettings(),
  ]);

  if (!rawRetreat) {
    return notFound();
  }

  // Fetch locale-specific static UI text
  const messages = await getMessages({ locale });
  const t = (messages.Retreats || {}) as Record<string, string>;

  // Localization helper
  const loc = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field["en"] || Object.values(field)[0] || "";
  };

  const retreat = rawRetreat;

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16 font-sans">
        <PageAutoTranslator locale={locale}>
          
          {/* HERO BANNER SECTION */}
          <section className="relative w-full min-h-[460px] md:min-h-[580px] flex items-end bg-[#121212] overflow-hidden pt-32 md:pt-28 pb-12">
            <div className="absolute inset-0 z-0">
              {retreat.heroImage ? (
                <Image
                  src={retreat.heroImage}
                  alt={loc(retreat.heroTitle)}
                  fill
                  className="object-cover opacity-50"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-left">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <Link 
                  href={`/${locale}/retreats`}
                  className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.backToListing || "Back to listings"}</span>
                </Link>

                {/* Breadcrumb */}
                <div className="hidden md:flex items-center gap-1.5 text-white/50 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                  <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
                  <span>&gt;</span>
                  <Link href={`/${locale}/retreats`} className="hover:text-brand-gold transition-colors">Retreats</Link>
                  <span>&gt;</span>
                  <span className="text-brand-gold truncate max-w-[200px]">{loc(retreat.heroTitle)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4 select-none">
                <span className="bg-brand-gold/15 text-brand-gold text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                  {retreat.days} Days / {retreat.nights} Nights
                </span>
                {retreat.isPopular && (
                  <span className="bg-emerald-500/25 text-emerald-400 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    {t.popular || "Popular"}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight max-w-4xl">
                {loc(retreat.heroTitle)}
              </h1>
              <p className="max-w-3xl text-sm sm:text-base md:text-lg text-brand-gold font-serif italic mb-6">
                {loc(retreat.heroSubtitle || retreat.tagline)}
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-5 mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-brand-gold" />
                  <div className="text-left">
                    <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Duration</span>
                    <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">{retreat.days} Days / {retreat.nights} Nights</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white md:ml-6">
                  <Compass className="w-5 h-5 text-brand-gold" />
                  <div className="text-left">
                    <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Yoga Level</span>
                    <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">{loc(retreat.yogaLevel)}</h4>
                  </div>
                </div>

                {retreat.certificate && (
                  <div className="flex items-center gap-2 text-white md:ml-6">
                    <Award className="w-5 h-5 text-brand-gold" />
                    <div className="text-left">
                      <span className="text-[9px] text-white/40 block leading-none font-semibold uppercase">Certificate</span>
                      <h4 className="text-xs font-bold mt-1 uppercase tracking-wider">{loc(retreat.yogaCertificate)}</h4>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 select-none md:ml-auto mt-4 sm:mt-0">
                  <a
                    href={`https://wa.me/${(contact?.whatsapp || "+91 73560 85055").replace(/[^0-9]/g, "")}?text=Hi, I would like to book the retreat: ${encodeURIComponent(loc(retreat.heroTitle))}`}
                    target="_blank"
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-md flex items-center gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white shrink-0">
                      <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.21 2 5.87L3 22l4.3-1c1.6.9 3.4 1.3 5.7 1.3 5.5 0 10-4.48 10-10S17.524 2 12.004 2zm5.7 14.1c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .2-3.1-.6-2.5-1-4-3.6-4.1-3.8-.1-.2-.8-1-1-2.1v-.1c0-.6.3-.9.4-1 .2-.2.4-.2.5-.2h.4c.1 0 .3-.1.5.3.2.5.7 1.6.7 1.8 0 .1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.3.3-.4.4-.1.1-.3.2-.1.5.2.4.9 1.5 2 2.4.9.8 1.7 1.1 2 1.3.3.1.5.1.7-.1.2-.3.9-1.1 1.1-1.4.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1.1.3.2.5.3.6.4.1.3.1 1.2-.1 1.7z" />
                    </svg>
                    <span>WhatsApp Booking</span>
                  </a>
                  <BookingButton
                    className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm"
                    context={`Retreat: ${loc(retreat.heroTitle)}`}
                  >
                    {loc(retreat.cta) || t.bookNow || "Book Now"}
                  </BookingButton>
                </div>
              </div>
            </div>
          </section>

          {/* OVERVIEW QUICK INFO STRIP */}
          <section className="bg-white border-b border-[#eae6db]/60 select-none py-6">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Location</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5 text-brand-gold" /> {loc(retreat.location)}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Group Size</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-1"><Users className="w-3.5 h-3.5 text-brand-gold" /> {loc(retreat.groupSize)}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Difficulty</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-1"><Flame className="w-3.5 h-3.5 text-brand-gold" /> {loc(retreat.difficulty)}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Language</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-1"><Compass className="w-3.5 h-3.5 text-brand-gold" /> {loc(retreat.language)}</span>
              </div>
            </div>
          </section>

          {/* MAIN PAGE BODY GRID */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            
            {/* LEFT COLUMN: RETREAT DETAILS */}
            <div className="lg:col-span-8 flex flex-col space-y-12">
              
              {/* SECTION: OVERVIEW */}
              <div className="bg-white border border-[#eae6db]/60 p-6 md:p-8 rounded-sm shadow-sm">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block">The Experience</span>
                <h2 className="font-serif text-2xl font-normal text-[#121212] mb-4">About This Retreat</h2>
                <div className="text-gray-600 font-light text-sm leading-relaxed space-y-4">
                  <p>{loc(retreat.fullDescription || retreat.shortDescription)}</p>
                  {retreat.retreatOverview && <p className="pt-2">{loc(retreat.retreatOverview)}</p>}
                </div>
              </div>

              {/* SECTION: WHY JOIN THIS RETREAT */}
              {(retreat.whyChoose || retreat.whoIsItFor) && (
                <div className="bg-white border border-[#eae6db]/60 p-6 md:p-8 rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                  {retreat.whyChoose && (
                    <div>
                      <h4 className="font-serif text-lg font-normal text-[#121212] mb-3">Why Choose Villa Lemon?</h4>
                      <p className="text-gray-600 font-light text-xs leading-relaxed">{loc(retreat.whyChoose)}</p>
                    </div>
                  )}
                  {retreat.whoIsItFor && (
                    <div>
                      <h4 className="font-serif text-lg font-normal text-[#121212] mb-3">Who Is This Retreat For?</h4>
                      <p className="text-gray-600 font-light text-xs leading-relaxed">{loc(retreat.whoIsItFor)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: HIGHLIGHTS */}
              {retreat.highlights && retreat.highlights.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-[#121212] mb-6">Retreat Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {retreat.highlights.map((item, idx) => (
                      <div key={idx} className="bg-white border border-[#eae6db]/50 p-5 rounded-sm shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-gray-800">{loc(item.title)}</h4>
                          <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">{loc(item.description)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: DAILY SCHEDULE TIMELINE */}
              {retreat.dailySchedule && retreat.dailySchedule.length > 0 && (
                <div className="bg-white border border-[#eae6db]/60 p-6 md:p-8 rounded-sm shadow-sm">
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block">Daily Routine</span>
                  <h3 className="font-serif text-xl text-[#121212] mb-6">A Typical Day at Villa Lemon</h3>
                  <div className="relative pl-6 border-l border-brand-gold/25 space-y-8">
                    {retreat.dailySchedule.map((item, idx) => (
                      <div key={idx} className="relative group text-left">
                        <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full bg-[#fbf9f6] border border-brand-gold flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-colors" />
                        <span className="text-[10px] font-bold text-brand-gold tracking-wider uppercase block">{item.time}</span>
                        <h4 className="font-serif text-sm font-medium text-gray-800 mt-1">{loc(item.activity)}</h4>
                        <p className="text-xs text-gray-500 font-light mt-1 leading-relaxed">{loc(item.description)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: DAY-BY-DAY CURRICULUM ACCORDION */}
              {retreat.curriculum && retreat.curriculum.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-[#121212] mb-6">Retreat Curriculum & Journey</h3>
                  <div className="space-y-3">
                    {retreat.curriculum.map((day, idx) => (
                      <details key={idx} className="group border border-[#eae6db]/60 bg-white rounded-sm overflow-hidden shadow-sm transition-all duration-300">
                        <summary className="flex items-center justify-between p-5 cursor-pointer select-none font-serif text-sm md:text-base font-normal text-gray-800 group-open:bg-[#fbf9f6] group-open:border-b border-[#eae6db]/50 hover:text-brand-gold transition-colors">
                          <span className="flex items-center gap-3">
                            <span className="bg-[#c5a880]/15 text-[#c5a880] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">Day {day.dayNumber}</span>
                            <span>{loc(day.dayTitle)}</span>
                          </span>
                          <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-5 text-xs text-gray-600 font-light leading-relaxed space-y-3 bg-white">
                          <p>{loc(day.description)}</p>
                          {day.learningOutcome && (
                            <div className="mt-2 bg-amber-50/55 p-3 border border-amber-100/50 rounded-sm">
                              <span className="font-bold text-brand-gold text-[9px] uppercase tracking-wider block">Learning Outcome</span>
                              <p className="mt-0.5 text-gray-700 font-medium">{loc(day.learningOutcome)}</p>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: EXCURSIONS */}
              {retreat.excursions && retreat.excursions.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-[#121212] mb-6">Included Excursions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {retreat.excursions.map((exc, idx) => (
                      <div key={idx} className="group bg-white border border-[#eae6db]/60 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-[16/10] bg-[#121212]">
                          {exc.image ? (
                            <Image src={exc.image} alt={loc(exc.name)} fill className="object-cover opacity-90 group-hover:scale-102 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600"><Compass className="w-8 h-8" /></div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-serif text-sm font-bold text-gray-800">{loc(exc.name)}</h4>
                            <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider">{loc(exc.duration)}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-light leading-relaxed mb-4">{loc(exc.description)}</p>
                          {exc.relatedTour && (
                            <Link href={`/${locale}/packages/varkala-sightseeing/${exc.relatedTour}`} className="text-[10px] font-bold uppercase tracking-wider text-brand-gold hover:text-brand-gold-dark inline-flex items-center gap-1">
                              View Tour Details <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: ACCOMMODATION ROOMS */}
              {retreat.rooms && retreat.rooms.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-[#121212] mb-6">Comfortable Room Accommodation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {retreat.rooms.map((room, idx) => (
                      <div key={idx} className="bg-white border border-[#eae6db]/60 rounded-sm overflow-hidden shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="relative aspect-[16/10] bg-[#121212]">
                            {room.image ? (
                              <Image src={room.image} alt={loc(room.name)} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                            )}
                          </div>
                          <div className="p-5">
                            <h4 className="font-serif text-base font-bold text-gray-800 mb-2">{loc(room.name)}</h4>
                            <p className="text-xs text-gray-500 font-light leading-relaxed mb-4">{loc(room.description)}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-[9px] font-semibold bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-150 text-gray-600">Occupancy: {room.occupancy}</span>
                              <span className="text-[9px] font-semibold bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-150 text-gray-600">{room.isPrivate ? "Private Room" : "Shared Room"}</span>
                              {room.hasAC && <span className="text-[9px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 text-emerald-800">A/C</span>}
                              {room.hasBathroom && <span className="text-[9px] font-semibold bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-150 text-gray-600">Attached Bath</span>}
                            </div>
                          </div>
                        </div>
                         {!room.hideRate && (room.sharedPrice > 0 || room.privatePrice > 0) && (
                          <div className="bg-gray-50/50 p-5 border-t border-gray-100 flex items-center justify-between text-xs w-full">
                            {room.sharedPrice > 0 && (
                              <div>
                                <span className="text-[9px] text-gray-400 uppercase font-bold block">Shared Price</span>
                                <span className="font-bold text-gray-800 mt-0.5 block">₹{room.sharedPrice.toLocaleString()}</span>
                              </div>
                            )}
                            {room.privatePrice > 0 && (
                              <div className="text-right ml-auto">
                                <span className="text-[9px] text-gray-400 uppercase font-bold block">Private Price</span>
                                <span className="font-bold text-gray-800 mt-0.5 block">₹{room.privatePrice.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: MEALS & DINING */}
              {retreat.meals && retreat.meals.length > 0 && (
                <div className="bg-white border border-[#eae6db]/60 p-6 md:p-8 rounded-sm shadow-sm">
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block">Nourishment</span>
                  <h3 className="font-serif text-xl text-[#121212] mb-4">Healthy Vegetarian Cuisine</h3>
                  <div className="space-y-6">
                    {retreat.meals.map((meal, idx) => (
                      <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-serif text-sm font-semibold text-gray-800">{loc(meal.mealType)}</h4>
                          <div className="flex gap-2">
                            {meal.isVegan && <span className="text-[8px] bg-green-50 text-green-700 px-2 py-0.5 font-bold uppercase rounded-sm">Vegan</span>}
                            {meal.isGlutenFree && <span className="text-[8px] bg-amber-50 text-amber-700 px-2 py-0.5 font-bold uppercase rounded-sm">Gluten-Free</span>}
                            {meal.isLactoseFree && <span className="text-[8px] bg-blue-50 text-blue-700 px-2 py-0.5 font-bold uppercase rounded-sm">Lactose-Free</span>}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">{loc(meal.description)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: YOGA PROGRAM & TEACHERS */}
              <div className="bg-white border border-[#eae6db]/60 p-6 md:p-8 rounded-sm shadow-sm space-y-6">
                <div>
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block">Practice</span>
                  <h3 className="font-serif text-xl text-[#121212] mb-3">Yoga & Meditation Program</h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed mb-4">{loc(retreat.yogaDescription)}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-bold block">Style</span>
                      <span className="font-medium text-gray-800 mt-0.5 block">{loc(retreat.yogaStyle)}</span>
                    </div>
                    {(retreat.yogaHours ?? 0) > 0 && (
                      <div>
                        <span className="text-gray-400 font-bold block">Hours</span>
                        <span className="font-medium text-gray-800 mt-0.5 block">{retreat.yogaHours} Hours</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Teachers profiles */}
                {retreat.teachers && retreat.teachers.length > 0 && (
                  <div className="border-t border-gray-150 pt-6">
                    <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-4 block">Our Teachers</span>
                    <div className="space-y-6">
                      {retreat.teachers.map((teacher, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-200">
                            {teacher.photo ? (
                              <Image src={teacher.photo} alt={teacher.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-200 flex items-center justify-center font-bold">{teacher.name[0]}</div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-serif text-sm font-bold text-gray-800">{teacher.name}</h4>
                            <span className="text-[9px] text-[#c5a880] uppercase tracking-wider block mt-0.5">{loc(teacher.specialization)} · {teacher.experience} Experience</span>
                            <p className="text-xs text-gray-500 font-light leading-relaxed mt-2">{loc(teacher.bio)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: AYURVEDA */}
              {retreat.ayurvedaTitle && (
                <div className="bg-white border border-[#eae6db]/60 p-6 md:p-8 rounded-sm shadow-sm space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block">Healing</span>
                    <h3 className="font-serif text-xl text-[#121212] mb-2">{loc(retreat.ayurvedaTitle)}</h3>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">{loc(retreat.ayurvedaDescription)}</p>
                  </div>
                  {retreat.ayurvedaTreatments && retreat.ayurvedaTreatments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {retreat.ayurvedaTreatments.map((tr, idx) => (
                        <div key={idx} className="border border-[#eae6db]/50 p-4 bg-gray-50/50 rounded-sm">
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-serif text-xs font-bold text-gray-800">{loc(tr.name)}</h4>
                            {tr.isOptional ? (
                              <span className="text-[8px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-sm font-semibold">Optional</span>
                            ) : (
                              <span className="text-[8px] bg-green-50 text-green-700 px-2 py-0.5 rounded-sm font-semibold">Included</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-light leading-relaxed">{loc(tr.description)}</p>
                          {tr.extraCost > 0 && (
                            <span className="text-[9px] text-gray-500 font-bold block mt-2">Extra cost: ₹{tr.extraCost.toLocaleString()}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: CHECKLISTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {retreat.inclusions && retreat.inclusions.length > 0 && (
                  <div className="bg-white border border-[#eae6db]/60 p-6 rounded-sm shadow-sm">
                    <h4 className="font-serif text-sm font-semibold text-gray-800 border-b pb-3 mb-3">Included in Retreat</h4>
                    <ul className="space-y-2 text-xs text-gray-600 font-light">
                      {retreat.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span>{loc(item)}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                {retreat.exclusions && retreat.exclusions.length > 0 && (
                  <div className="bg-white border border-[#eae6db]/60 p-6 rounded-sm shadow-sm">
                    <h4 className="font-serif text-sm font-semibold text-gray-800 border-b pb-3 mb-3">Excluded / Exclusions</h4>
                    <ul className="space-y-2 text-xs text-gray-600 font-light">
                      {retreat.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> <span>{loc(item)}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* SECTION: FAQS */}
              {retreat.faqs && retreat.faqs.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-[#121212] mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {retreat.faqs.map((faq, idx) => (
                      <details key={idx} className="group border border-[#eae6db]/60 bg-white rounded-sm overflow-hidden shadow-sm transition-all duration-300">
                        <summary className="flex items-center justify-between p-5 cursor-pointer select-none font-serif text-sm font-normal text-gray-800 group-open:bg-[#fbf9f6] group-open:border-b border-[#eae6db]/50 hover:text-brand-gold transition-colors">
                          <span>{loc(faq.question)}</span>
                          <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="p-5 text-xs text-gray-500 font-light leading-relaxed bg-white">
                          <p>{loc(faq.answer)}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: BOOKING SIDEBAR CARD */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              <div className="sticky top-28 space-y-6">
                <div id="booking-pricing" className="bg-white border border-[#eae6db]/70 rounded-sm shadow-sm p-6 text-left">
                  <span className="text-[8px] font-bold bg-brand-gold/15 text-brand-gold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm mb-3 inline-block">
                    Booking Enquiry
                  </span>
                   {!retreat.hideRate && (
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Starting From</span>
                      <span className="text-2xl font-bold text-gray-800">
                        {retreat.price > 0 ? `₹${retreat.price.toLocaleString()}` : "On Request"}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-b border-gray-100 py-4 my-4 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Duration:</span>
                      <span className="font-semibold text-gray-800">{retreat.days} Days / {retreat.nights} Nights</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Location:</span>
                      <span className="font-semibold text-gray-800">{loc(retreat.location)}</span>
                    </div>
                    {retreat.availableDates && retreat.availableDates.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400 font-medium">Available Dates:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {retreat.availableDates.map((date, idx) => (
                            <span key={idx} className="bg-gray-50 border border-gray-150 text-gray-600 text-[10px] px-2 py-0.5 rounded-sm font-medium">{date}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp & Email CTA Buttons */}
                  <div className="space-y-2 mt-6 select-none">
                    <a
                      href={`https://wa.me/${(contact.whatsapp || "+91 73560 85055").replace(/[^0-9]/g, "")}?text=Hello%20Villa%20Lemon,%20I%20am%20interested%20in%20booking%20the%20retreat:%20${encodeURIComponent(loc(retreat.heroTitle))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold uppercase tracking-wider text-[10px] py-3 rounded-sm transition-all shadow-sm"
                    >
                      <Phone className="w-4 h-4 fill-white" />
                      Enquire on WhatsApp
                    </a>

                    <a
                      href={`mailto:${contact.email}?subject=Retreat%20Booking%20Enquiry&body=Hello%20Villa%20Lemon,%20I'd%20like%20to%20know%20more%20about%20the%20retreat...`}
                      className="w-full flex items-center justify-center gap-2 bg-[#121212] hover:bg-black text-white font-bold uppercase tracking-wider text-[10px] py-3 rounded-sm transition-all border border-black"
                    >
                      Send Email Enquiry
                    </a>
                  </div>

                  {/* Checklist/Policies info inside sidebar card */}
                  <div className="mt-6 pt-5 border-t border-gray-100 text-[10px] text-gray-400 font-medium space-y-2.5">
                    {retreat.deposit && <p>🔑 <strong className="text-gray-500 uppercase text-[9px] tracking-wide">Deposit:</strong> {loc(retreat.deposit)}</p>}
                    {retreat.cancellation && <p>🛡️ <strong className="text-gray-500 uppercase text-[9px] tracking-wide">Cancellation:</strong> {loc(retreat.cancellation)}</p>}
                    {retreat.pickup && <p>🚗 <strong className="text-gray-500 uppercase text-[9px] tracking-wide">Airport Pick-up:</strong> {loc(retreat.pickup)}</p>}
                  </div>
                </div>

                {/* Best Time to Join Card */}
                {retreat.bestTime && (
                  <div className="bg-white border border-[#eae6db]/70 rounded-sm shadow-sm p-6 text-left">
                    <span className="text-[8px] font-bold bg-brand-gold/15 text-brand-gold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm mb-3 inline-block">
                      Best Time to Join
                    </span>
                    <p className="text-xs text-gray-500 font-light leading-relaxed font-sans select-text">
                      {loc(retreat.bestTime)}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </PageAutoTranslator>
      </main>
    </>
  );
}
