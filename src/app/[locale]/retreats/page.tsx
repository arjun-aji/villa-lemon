export const dynamic = "force-dynamic";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { Clock, Users, Compass, Calendar, Award, ChevronRight } from "lucide-react";
import PageAutoTranslator from "@/components/PageAutoTranslator";
import { API_BASE_URL } from "@/config/api";

interface RetreatSummary {
  _id: string;
  slug: string;
  days: number;
  nights: number;
  price: number;
  heroTitle: { en: string; de?: string; fr?: string; ru?: string };
  tagline: { en: string; de?: string; fr?: string; ru?: string };
  shortDescription: { en: string; de?: string; fr?: string; ru?: string };
  heroImage: string;
  yogaLevel: { en: string; de?: string; fr?: string; ru?: string };
  language: { en: string; de?: string; fr?: string; ru?: string };
  groupSize: { en: string; de?: string; fr?: string; ru?: string };
  certificate: boolean;
  featured: boolean;
  isPopular: boolean;
  isSoldOut: boolean;
}

async function getRetreats(): Promise<RetreatSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/retreats?status=published`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[retreats catalog fetch]: Failed to load retreats", err);
    return [];
  }
}

export default async function RetreatsCatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const retreats = await getRetreats();

  // Helper to extract translation values
  const loc = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field["en"] || Object.values(field)[0] || "";
  };

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
        <PageAutoTranslator locale={locale}>
          
          {/* HEADER SECTION */}
          <section className="relative w-full h-[260px] md:h-[320px] flex items-end bg-[#121212] overflow-hidden pt-24">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1600"
                alt="Yoga retreats banner"
                fill
                className="object-cover opacity-45"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-8 md:pb-12 text-left">
              <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.25em] mb-2 block select-none">
                Transformative Journeys
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal tracking-wide leading-tight">
                Yoga & Wellness Retreats
              </h1>
              <p className="max-w-xl text-xs sm:text-sm text-gray-300 font-light mt-2">
                Immerse yourself in nature, yoga, meditation, healthy meals, and local excursions. Curated premium retreats at Villa Lemon.
              </p>
            </div>
          </section>

          {/* LISTINGS GRID */}
          <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12 w-full text-left">
            {retreats.length === 0 ? (
              <div className="py-20 text-center border border-[#eae6db]/60 bg-white rounded-sm shadow-sm">
                <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-light text-sm">No retreats are currently scheduled. Please check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {retreats.map((retreat) => {
                  const title = loc(retreat.heroTitle);
                  const tagline = loc(retreat.tagline);
                  const shortDesc = loc(retreat.shortDescription);
                  const level = loc(retreat.yogaLevel);
                  const size = loc(retreat.groupSize);
                  const lang = loc(retreat.language);

                  return (
                    <div
                      key={retreat._id}
                      className="group flex flex-col bg-white border border-[#eae6db]/60 rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:border-[#c5a880]/60 transition-all duration-300"
                    >
                      {/* Image container */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#121212]">
                        {retreat.heroImage ? (
                          <Image
                            src={retreat.heroImage}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Compass className="w-8 h-8 text-gray-600" />
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 select-none">
                          {retreat.featured && (
                            <span className="bg-brand-gold text-black font-bold uppercase tracking-wider text-[8px] px-2.5 py-1 rounded-sm shadow-sm">
                              Featured
                            </span>
                          )}
                          {retreat.isPopular && (
                            <span className="bg-emerald-600 text-white font-bold uppercase tracking-wider text-[8px] px-2.5 py-1 rounded-sm shadow-sm">
                              Popular
                            </span>
                          )}
                          {retreat.isSoldOut && (
                            <span className="bg-red-600 text-white font-bold uppercase tracking-wider text-[8px] px-2.5 py-1 rounded-sm shadow-sm">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 flex-1 flex flex-col items-start justify-between">
                        <div className="w-full">
                          {/* Duration, levels & meta */}
                          <div className="flex flex-wrap items-center gap-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand-gold" /> {retreat.days} Days / {retreat.nights} Nights</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{level}</span>
                          </div>

                          <h3 className="font-serif text-lg font-normal text-[#121212] group-hover:text-brand-gold transition-colors leading-tight">
                            {title}
                          </h3>

                          {tagline && (
                            <p className="text-xs text-brand-gold font-serif italic mt-1.5 leading-relaxed">
                              {tagline}
                            </p>
                          )}

                          <p className="text-xs text-gray-500 font-light mt-3 leading-relaxed line-clamp-3">
                            {shortDesc}
                          </p>

                          {/* Detail Pills */}
                          <div className="flex flex-wrap gap-2 mt-4 select-none">
                            {size && (
                              <span className="bg-[#fbf9f6] border border-[#eae6db]/60 text-gray-600 text-[9px] font-medium px-2 py-0.5 rounded-sm flex items-center gap-1">
                                <Users className="w-3 h-3 text-[#c5a880]" /> Group: {size}
                              </span>
                            )}
                            {lang && (
                              <span className="bg-[#fbf9f6] border border-[#eae6db]/60 text-gray-600 text-[9px] font-medium px-2 py-0.5 rounded-sm flex items-center gap-1">
                                <Compass className="w-3 h-3 text-[#c5a880]" /> Language: {lang}
                              </span>
                            )}
                            {retreat.certificate && (
                              <span className="bg-amber-50 border border-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
                                <Award className="w-3 h-3 text-amber-600" /> Certificate
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="w-full flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
                          <div>
                            <span className="text-[9px] text-gray-400 block leading-none font-bold uppercase">Starting From</span>
                            <span className="text-sm font-bold text-gray-800 mt-1 block">
                              {retreat.price > 0 ? `₹${retreat.price.toLocaleString()}` : "On Request"}
                            </span>
                          </div>

                          <Link
                            href={`/${locale}/retreats/${retreat.slug}`}
                            className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-[#121212] uppercase group-hover:text-brand-gold transition-colors select-none"
                          >
                            <span>Explore Retreat</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </PageAutoTranslator>
      </main>
    </>
  );
}
