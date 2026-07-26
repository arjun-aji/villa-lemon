import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Clock, Check, Shield, Calendar, Phone, ChevronLeft, MapPin, Smile } from "lucide-react";

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
    const res = await fetch(`http://localhost:5001/api/yoga/items/${slug}`, {
      next: { revalidate: 10 },
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
    const res = await fetch("http://localhost:5001/api/yoga/teachers", {
      next: { revalidate: 10 },
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

export default async function YogaDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}) {
  const { locale, type, slug } = await params;
  
  const [rawYoga, teacher] = await Promise.all([
    getYogaDetails(slug),
    getLeadTeacher()
  ]);

  if (!rawYoga) {
    return notFound();
  }

  // Fetch translations
  const messages = await getMessages({ locale });
  const tYoga = messages.YogaDetails as any;

  // Localize properties
  const yoga = {
    id: rawYoga._id,
    type: rawYoga.yogaType,
    title: rawYoga.title[locale] || rawYoga.title["en"] || "",
    price: rawYoga.price,
    pricePeriod: rawYoga.pricePeriod[locale] || rawYoga.pricePeriod["en"] || "",
    image: rawYoga.image,
    aboutImage: rawYoga.aboutImage || rawYoga.image,
    duration: rawYoga.duration[locale] || rawYoga.duration["en"] || "",
    shortDescription: rawYoga.shortDescription[locale] || rawYoga.shortDescription["en"] || "",
    tagline: rawYoga.tagline[locale] || rawYoga.tagline["en"] || "",
    aboutText: rawYoga.aboutText[locale] || rawYoga.aboutText["en"] || "",
    schedule: (rawYoga.schedule || []).map((sc) => ({
      time: sc.time[locale] || sc.time["en"] || "",
      activity: sc.activity[locale] || sc.activity["en"] || "",
    })),
    benefits: (rawYoga.benefits || []).map((b) => b[locale] || b["en"] || ""),
    inclusions: (rawYoga.inclusions || []).map((inc) => inc[locale] || inc["en"] || ""),
  };

  return (
    <>
      <Navbar absoluteOnly={true} />
      <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16 font-sans">
        
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
                <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                <span>&gt;</span>
                <Link href={`/${locale}/yoga/${type}`} className="hover:text-brand-gold transition-colors">Yoga</Link>
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
                <a
                  href="#book"
                  className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm"
                >
                  {tYoga.bookNow || "Book Now"}
                </a>
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
                  {teacher.role[locale] || teacher.role["en"] || ""}
                </span>
                <p className="text-[11px] text-gray-500 font-light leading-relaxed font-sans">
                  {teacher.bio[locale] || teacher.bio["en"] || ""}
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
                href={`https://wa.me/919000000000?text=Hi, I would like to consult/book the yoga package: ${encodeURIComponent(yoga.title)}`}
                target="_blank"
                className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider py-3.5 rounded-sm transition-all duration-300 text-[10px]"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </section>

      </main>
    </>
  );
}
