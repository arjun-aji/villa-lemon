export const dynamic = "force-dynamic";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { ImageSlideshow } from "@/components/ImageSlideshow";
import { getMessages } from "next-intl/server";
import { Heart, Users, Bed, Bath, ArrowUpDown, ChevronDown, Compass, CheckCircle, ChevronLeft } from "lucide-react";
import CatalogClient from "./CatalogClient";
import PageAutoTranslator from "@/components/PageAutoTranslator";
import { API_BASE_URL } from "@/config/api";

import { localizeObject } from "@/utils/translator";
import { getContactSettings } from "@/utils/contactSettings";

interface PropertyItem {
  _id: string;
  accommodationType: string;
  title: Record<string, string>;
  slug: string;
  price: number;
  pricePeriod: Record<string, string>;
  image: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  location: Record<string, string>;
  shortDescription: Record<string, string>;
  tagline: Record<string, string>;
  highlights: Array<{ icon: string; label: Record<string, string> }>;
  images?: string[];
  badgeText?: Record<string, string>;
  hideRate?: boolean;
}

async function getProperties(type: string): Promise<PropertyItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/accommodations/items?type=${type}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn(`[accommodation catalog]: Failed to fetch properties for type ${type}`, err);
    return [];
  }
}

async function getCategory(type: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/accommodations?type=${type}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] || null;
  } catch (err) {
    console.warn(`[accommodation catalog]: Failed to fetch category for type ${type}`, err);
    return null;
  }
}

export default async function AccommodationCatalogPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  
  // Map page type segment to DB enum
  let dbType = "villa";
  let titleKey = "villaTitle";
  let descKey = "villaDesc";
  
  if (type === "floors" || type === "floor") {
    dbType = "floor";
    titleKey = "floorTitle";
    descKey = "floorDesc";
  } else if (type === "rooms" || type === "room") {
    dbType = "room";
    titleKey = "roomTitle";
    descKey = "roomDesc";
  }

  const [rawProperties, category, contact] = await Promise.all([
    getProperties(dbType),
    getCategory(dbType),
    getContactSettings(),
  ]);

  // Localize properties for rendering
  const properties = await Promise.all(
    rawProperties.map(async (p) => {
      const lp = await localizeObject(p, locale) as any;
      return {
        id: lp._id,
        title: lp.title,
        slug: lp.slug,
        price: lp.price,
        pricePeriod: lp.pricePeriod,
        image: lp.image,
        bedrooms: lp.bedrooms,
        bathrooms: lp.bathrooms,
        guests: lp.guests,
        location: lp.location,
        shortDescription: lp.shortDescription,
        tagline: lp.tagline,
        images: lp.images,
        badgeText: lp.badgeText || "",
        hideRate: lp.hideRate || false,
      };
    })
  );

  // Fetch translation messages
  const messages = await getMessages({ locale });

  // Get specific translations
  const title = (messages.Accommodations as any)?.[titleKey] || (type === "villas" ? "Entire Villas" : type === "floors" ? "Private Floors" : "Individual Rooms");
  const description = (messages.Accommodations as any)?.[descKey] || "";

  const bannerImage = category?.image || (properties.length > 0 ? properties[0].image : "");

  // Localize banner features from the category DB data (with auto-translate fallback)
  const lcat = category ? await localizeObject(category, locale) as any : null;
  const features = [
    { title: lcat?.feature1Title || "Private Pool", subtitle: lcat?.feature1Subtitle || "In most villas", icon: "Compass" },
    { title: lcat?.feature2Title || "Spacious Living", subtitle: lcat?.feature2Subtitle || "For families & groups", icon: "Users" },
    { title: lcat?.feature3Title || "Premium Amenities", subtitle: lcat?.feature3Subtitle || "Luxury redefined", icon: "CheckCircle" },
    { title: lcat?.feature4Title || "Dedicated Service", subtitle: lcat?.feature4Subtitle || "24/7 assistance", icon: "Compass" },
  ];

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
        <PageAutoTranslator locale={locale}>
        {/* HERO BANNER SECTION */}
        <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end bg-[#121212] overflow-hidden pt-32 md:pt-28 pb-8">
          {/* Cover background image */}
          <div className="absolute inset-0 z-0">
            {bannerImage ? (
              <ImageSlideshow
                images={category?.images}
                defaultImage={bannerImage}
                className="object-cover w-full h-full opacity-45 brightness-75 select-none"
                alt={title}
              />
            ) : (
              <div className="w-full h-full bg-[#1e1e1e]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent z-10" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pb-6 md:pb-8 relative z-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link 
                href={`/${locale}#villas`}
                className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Accommodations</span>
              </Link>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
                <span>&gt;</span>
                <Link href={`/${locale}#villas`} className="hover:text-brand-gold transition-colors">Accommodation</Link>
                <span>&gt;</span>
                <span className="text-brand-gold">{title}</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight animate-fade-in-up">
              {title}
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm md:text-base text-white/80 font-sans font-light leading-relaxed animate-fade-in-up delay-100">
              {description || "Discover premium private homestays with direct cliffs proximity and unmatched coastal luxury."}
            </p>
          </div>
        </section>

        {/* QUICK FEATURES BADGES BAR */}
        <section className="w-full bg-[#121212] text-white border-y border-white/10 select-none py-5 md:py-6">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            {features.map((feat, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                {feat.icon === "Users" ? (
                  <Users className="w-5 h-5 text-brand-gold shrink-0" />
                ) : feat.icon === "CheckCircle" ? (
                  <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
                ) : (
                  <Compass className="w-5 h-5 text-brand-gold shrink-0" />
                )}
                <div>
                  <h4 className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white">{feat.title}</h4>
                  <p className="text-[9px] text-white/50 mt-0.5 font-medium">{feat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE FILTERS & CARDS GRID (CLIENT SIDE CONTAINER) */}
        <CatalogClient properties={properties} typePath={type} locale={locale} contact={contact} />
        </PageAutoTranslator>
      </main>
    </>
  );
}
