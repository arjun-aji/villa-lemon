export const revalidate = 3600;
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  
  let titleKey = "retreatsTitle";
  let descKey = "retreatsDesc";

  if (type.toLowerCase() === "host-your-yoga-retreat") {
    titleKey = "hostRetreatTitle";
    descKey = "hostRetreatDesc";
  } else if (type === "daily-yoga-classes" || type === "classes") {
    titleKey = "classesTitle";
    descKey = "classesDesc";
  } else if (type === "private-yoga-sessions" || type === "private") {
    titleKey = "privateTitle";
    descKey = "privateDesc";
  } else if (type === "teachers") {
    titleKey = "teachersTitle";
    descKey = "teachersDesc";
  }

  const messages = await getMessages({ locale });
  const t = messages.Yoga as any || {};
  const title = t[titleKey] || "Yoga Program";
  const description = t[descKey] || `Explore curated yoga ${type} options at Villa Lemon in Varkala, Kerala.`;

  return {
    title: `${title} | Villa Lemon`,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/${locale}/yoga/${type}`,
    },
  };
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageSlideshow } from "@/components/ImageSlideshow";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { Clock, CheckCircle, Users, ChevronLeft } from "lucide-react";
import PageAutoTranslator from "@/components/PageAutoTranslator";
import HostRetreatDashboard from "@/components/HostRetreatDashboard";
import { API_BASE_URL } from "@/config/api";
import YogaGridSlider from "@/components/YogaGridSlider";
import { localizeObject } from "@/utils/translator";
import { getContactSettings } from "@/utils/contactSettings";

interface YogaItemType {
  _id: string;
  yogaType: string;
  title: Record<string, string>;
  slug: string;
  price: number;
  pricePeriod: Record<string, string>;
  image: string;
  duration: Record<string, string>;
  shortDescription: Record<string, string>;
  tagline: Record<string, string>;
  hideRate?: boolean;
}

interface TeacherType {
  _id: string;
  name: string;
  role: Record<string, string>;
  bio: Record<string, string>;
  image: string;
}

async function getRetreats() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/retreats?status=published`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[retreats catalog fetch]: Failed", err);
    return [];
  }
}

async function getYogaItems(type: string): Promise<YogaItemType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/items?type=${type}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn(`[yoga catalog fetch]: Failed for type ${type}`, err);
    return [];
  }
}

async function getTeachers(): Promise<TeacherType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/teachers`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[yoga catalog fetch]: Failed to load teachers", err);
    return [];
  }
}

export default async function YogaCatalogPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;

  const messages = await getMessages({ locale });
  const tYoga = messages.Yoga as any;

  const isHostRetreat = type.toLowerCase() === "host-your-yoga-retreat";
  if (isHostRetreat) {
    const contactSettings = await getContactSettings();
    const whatsappNumber = contactSettings.whatsapp || "+91 73560 85055";

    const title = tYoga.hostRetreatTitle || "Host Your Yoga Retreat";
    const desc = tYoga.hostRetreatDesc || "Configure and book our property to conduct your own wellness retreats.";

    return (
      <>
        <Navbar />
        <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
          <PageAutoTranslator locale={locale}>
            {/* HEADER SECTION */}
            <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end bg-[#121212] overflow-hidden pt-32 md:pt-28 pb-8">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1600"
                  alt="Host Your Retreat Banner"
                  fill
                  className="object-cover opacity-45 brightness-75 select-none"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent z-10" />
              </div>

              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pb-6 md:pb-8 relative z-20">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <Link 
                    href={`/${locale}#yogatours`}
                    className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Yoga Tours</span>
                  </Link>

                  {/* Breadcrumb */}
                  <div className="hidden md:flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                    <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
                    <span>&gt;</span>
                    <Link href={`/${locale}#yogatours`} className="hover:text-brand-gold transition-colors">Yoga</Link>
                    <span>&gt;</span>
                    <span className="text-brand-gold">{title}</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight">
                  {title}
                </h1>
                <p className="max-w-2xl text-xs sm:text-sm text-white/80 font-light leading-relaxed font-sans font-light">
                  {desc}
                </p>
              </div>
            </section>

            {/* INTERACTIVE DASHBOARD AND INFORMATION DETAILS */}
            <HostRetreatDashboard locale={locale} whatsappNumber={whatsappNumber} />
          </PageAutoTranslator>
        </main>
      </>
    );
  }

  // Load yoga program categories
  let yogaCategories = [];
  try {
    const resCats = await fetch(`${API_BASE_URL}/api/yoga/programs`, { cache: "no-store" });
    if (resCats.ok) {
      const catsJson = await resCats.json();
      yogaCategories = catsJson.data || [];
    }
  } catch (err) {
    console.warn("Failed to fetch yoga categories in catalog page:", err);
  }

  // Try to find the matching category by matching its href suffix or type (case-insensitive)
  const programCategory = yogaCategories.find((cat: any) => {
    const hrefParts = (cat.href || "").split("/");
    const slug = hrefParts[hrefParts.length - 1];
    return slug.toLowerCase() === type.toLowerCase() || (cat.type && cat.type.toLowerCase() === type.toLowerCase());
  });

  if (type === "teachers") {
    // TEACHERS DIRECTORY LAYOUT
    const rawTeachersList = await getTeachers();
    const teachersList = await Promise.all(
      rawTeachersList.map(async (teacher) => {
        const lt = await localizeObject(teacher, locale) as any;
        return {
          _id: teacher._id,
          name: teacher.name,
          image: teacher.image,
          role: lt.role,
          bio: lt.bio,
        };
      })
    );

    return (
      <>
        <Navbar />
        <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
          <PageAutoTranslator locale={locale}>
          {/* HEADER SECTION */}
          <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end bg-[#121212] overflow-hidden pt-32 md:pt-28 pb-8">
            <div className="absolute inset-0 z-0">
              {teachersList.length > 0 ? (
                <Image
                  src={teachersList[0].image}
                  alt="Yoga Teachers"
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
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <Link 
                  href={`/${locale}#yogatours`}
                  className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Yoga Tours</span>
                </Link>

                {/* Breadcrumb */}
                <div className="hidden md:flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                  <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
                  <span>&gt;</span>
                  <Link href={`/${locale}#yogatours`} className="hover:text-brand-gold transition-colors">Yoga</Link>
                  <span>&gt;</span>
                  <span className="text-brand-gold">{tYoga.teachersTitle || "Our Teachers"}</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight">
                {tYoga.teachersTitle || "Meet Our Teachers"}
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm text-white/80 font-light leading-relaxed font-sans">
                {tYoga.teachersDesc || "Our certified Acharyas guide travelers from all over the world toward mindful recovery."}
              </p>
            </div>
          </section>

          {/* TEACHERS LIST GRID */}
          <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16">
            {teachersList.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <p>No teachers profiles found in database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teachersList.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm flex flex-col items-center text-center p-6"
                  >
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border border-brand-gold/30 shadow-sm bg-gray-50 mb-4 select-none">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#121212] leading-tight">
                      {teacher.name}
                    </h3>
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider mt-1 mb-4 select-none">
                      {teacher.role}
                    </span>
                    <p className="text-xs text-gray-500 font-light font-sans leading-relaxed select-text">
                      {teacher.bio}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
          </PageAutoTranslator>
        </main>
      </>
    );
  }

  const isRetreatsTemplate = (programCategory && programCategory.template === "retreats") || type === "yoga-retreats";

  // ── YOGA RETREATS — pulls from /api/retreats ──────────────────────────────
  if (isRetreatsTemplate) {
    const rawRetreats = await getRetreats();
    const targetType = programCategory ? programCategory.type : "retreats";
    const filteredRetreats = rawRetreats.filter((r: any) => (r.yogaType || "retreats") === targetType);

    const retreats = filteredRetreats.map((r: any) => ({
      id: r._id,
      title: (r.heroTitle?.[locale] || r.heroTitle?.en || "Yoga Retreat"),
      slug: r.slug,
      image: r.heroImage || "",
      images: r.images || [],
      price: r.price || 0,
      pricePeriod: `· ${r.days} Days`,
      duration: `${r.days} Days`,
      shortDescription: (r.shortDescription?.[locale] || r.shortDescription?.en || ""),
      featured: r.featured,
      hideRate: r.hideRate || false,
      detailUrl: `/${locale}/retreats/${r.slug}`,
      yogaLevel: (r.yogaLevel?.[locale] || r.yogaLevel?.en || ""),
      groupSize: (r.groupSize?.[locale] || r.groupSize?.en || ""),
      location: (r.location?.[locale] || r.location?.en || "Varkala, Kerala"),
    }));

    const title = tYoga.retreatsTitle || "Yoga Retreats";
    const desc = tYoga.retreatsDesc || "Transformative retreats for mind, body & soul.";

    return (
      <>
        <Navbar />
        <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
          <PageAutoTranslator locale={locale}>
          {/* HEADER */}
          <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end bg-[#121212] overflow-hidden pt-32 md:pt-28 pb-8">
            <div className="absolute inset-0 z-0">
              {programCategory?.image || (retreats.length > 0 && retreats[0].heroImage) ? (
                <ImageSlideshow
                  images={programCategory?.images}
                  defaultImage={programCategory?.image || (retreats.length > 0 ? retreats[0].heroImage : "")}
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
                  href={`/${locale}#yogatours`}
                  className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Yoga Tours</span>
                </Link>

                {/* Breadcrumb */}
                <div className="hidden md:flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                  <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
                  <span>&gt;</span>
                  <Link href={`/${locale}#yogatours`} className="hover:text-brand-gold transition-colors">Yoga</Link>
                  <span>&gt;</span>
                  <span className="text-brand-gold">{title}</span>
                </div>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight">
                {title}
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm text-white/80 font-light leading-relaxed font-sans">{desc}</p>
            </div>
          </section>

          {/* RETREAT CARDS */}
          <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16 animate-fade-in">
            {retreats.length === 0 ? (
              <div className="py-16 text-center text-gray-400 bg-white border border-[#eae6db]/80 rounded-md shadow-sm">
                <p className="text-sm font-semibold">No retreats found. Check back soon.</p>
                <Link href={`/${locale}#yogatours`} className="inline-block mt-4 text-xs font-bold text-brand-gold uppercase tracking-wider">Back to yoga</Link>
              </div>
            ) : (
              <YogaGridSlider items={retreats} locale={locale} />
            )}
          </section>
          </PageAutoTranslator>
        </main>
      </>
    );
  }

  // PROGRAM CATALOG LAYOUT (daily-yoga-classes / private-yoga-sessions / custom subgroups)
  let dbType = type;
  let title = "";
  let programDescription = "";

  if (programCategory) {
    dbType = programCategory.type;
    title = programCategory.title[locale] || programCategory.title.en || "";
    programDescription = programCategory.description[locale] || programCategory.description.en || "";
  } else {
    // Fallbacks
    if (type === "daily-yoga-classes") {
      dbType = "classes";
      title = tYoga.classesTitle || "Daily Yoga Classes";
      programDescription = tYoga.classesDesc || "";
    } else if (type === "private-yoga-sessions") {
      dbType = "private";
      title = tYoga.privateTitle || "Private Yoga Sessions";
      programDescription = tYoga.privateDesc || "";
    } else {
      dbType = type;
      title = type;
      programDescription = "";
    }
  }

  const rawPrograms = await getYogaItems(dbType);

  const programs = await Promise.all(
    rawPrograms.map(async (p) => {
      const lp = await localizeObject(p, locale) as any;
      return {
        id: lp._id,
        title: lp.title,
        slug: lp.slug,
        price: lp.price,
        pricePeriod: lp.pricePeriod,
        image: lp.image,
        images: lp.images,
        duration: lp.duration,
        shortDescription: lp.shortDescription,
        tagline: lp.tagline,
        hideRate: lp.hideRate || false,
        detailUrl: `/${locale}/yoga/${type}/${lp.slug}`,
      };
    })
  );

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
        <PageAutoTranslator locale={locale}>
        {/* HEADER SECTION */}
        <section className="relative w-full min-h-[280px] md:min-h-[340px] flex items-end bg-[#121212] overflow-hidden pt-32 md:pt-28 pb-8">
          <div className="absolute inset-0 z-0">
            {programCategory?.image || (programs.length > 0 && programs[0].image) ? (
              <ImageSlideshow
                images={programCategory?.images}
                defaultImage={programCategory?.image || (programs.length > 0 ? programs[0].image : "")}
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
                href={`/${locale}#yogatours`}
                className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Yoga Tours</span>
              </Link>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
                <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
                <span>&gt;</span>
                <Link href={`/${locale}#yogatours`} className="hover:text-brand-gold transition-colors">Yoga</Link>
                <span>&gt;</span>
                <span className="text-brand-gold">{title}</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight">
              {title}
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-white/80 font-light leading-relaxed font-sans">
              {programDescription || "Find internal balance under the Varkala sun."}
            </p>
          </div>
        </section>

        {/* PROGRAM CARDS LIST GRID */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16 animate-fade-in">
          {programs.length === 0 ? (
            <div className="py-16 text-center text-gray-400 bg-white border border-[#eae6db]/80 rounded-md shadow-sm select-none">
              <p className="text-sm font-semibold">No packages found under this yoga type.</p>
              <Link href={`/${locale}#yogatours`} className="inline-block mt-4 text-xs font-bold text-brand-gold uppercase tracking-wider">
                Back to yoga
              </Link>
            </div>
          ) : (
            <YogaGridSlider items={programs} locale={locale} />
          )}
        </section>
        </PageAutoTranslator>
      </main>
    </>
  );
}
