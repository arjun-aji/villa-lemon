export const dynamic = "force-dynamic";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { Clock, CheckCircle, Users } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

import { localizeObject } from "@/utils/translator";

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
}

interface TeacherType {
  _id: string;
  name: string;
  role: Record<string, string>;
  bio: Record<string, string>;
  image: string;
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
          {/* HEADER SECTION */}
          <section className="relative w-full h-[240px] md:h-[300px] flex items-end bg-[#121212] overflow-hidden pt-24">
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
              <div className="flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase mb-3 font-semibold select-none">
                <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                <span>&gt;</span>
                <span className="hover:text-brand-gold transition-colors">Yoga</span>
                <span>&gt;</span>
                <span className="text-brand-gold">{tYoga.teachersTitle || "Our Teachers"}</span>
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
        </main>
      </>
    );
  }

  // PROGRAM CATALOG LAYOUT
  let dbType = "retreats";
  let titleKey = "retreatsTitle";
  let descKey = "retreatsDesc";

  if (type === "daily-yoga-classes") {
    dbType = "classes";
    titleKey = "classesTitle";
    descKey = "classesDesc";
  } else if (type === "private-yoga-sessions") {
    dbType = "private";
    titleKey = "privateTitle";
    descKey = "privateDesc";
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
        duration: lp.duration,
        shortDescription: lp.shortDescription,
        tagline: lp.tagline,
      };
    })
  );

  const title = tYoga[titleKey] || "Yoga Program";
  const programDescription = tYoga[descKey] || "";

  return (
    <>
      <Navbar />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16">
        {/* HEADER SECTION */}
        <section className="relative w-full h-[240px] md:h-[300px] flex items-end bg-[#121212] overflow-hidden pt-24">
          <div className="absolute inset-0 z-0">
            {programs.length > 0 ? (
              <Image
                src={programs[0].image}
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
            <div className="flex items-center gap-1.5 text-white/60 text-[10px] md:text-xs tracking-wider uppercase mb-3 font-semibold select-none">
              <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="hover:text-brand-gold transition-colors">Yoga</span>
              <span>&gt;</span>
              <span className="text-brand-gold">{title}</span>
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
              <Link href="/#yoga" className="inline-block mt-4 text-xs font-bold text-brand-gold uppercase tracking-wider">
                Back to yoga
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden select-none">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 bg-[#121212]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-[10px] font-bold tracking-wider">
                      ₹{p.price.toLocaleString()} {p.pricePeriod}
                    </div>
                  </div>

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
                      href={`/${locale}/yoga/${type}/${p.slug}`}
                      className="w-full flex items-center justify-center bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider py-3.5 rounded-sm transition-all duration-300 text-[10px] select-none"
                    >
                      Explore Retreat
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
