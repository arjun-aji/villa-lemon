"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { 
  Home, 
  Coffee, 
  Car, 
  Check, 
  Sparkles,
  Utensils,
  ExternalLink
} from "lucide-react";

interface RoomInfo {
  id: string;
  phase: number;
  number: string;
  category: string | Record<string, string>;
  balcony: string | Record<string, string>;
  beds: string | Record<string, string>;
  wardrobe: string | Record<string, string>;
  bathroom: string | Record<string, string>;
  hotWater: string | Record<string, string>;
  notes?: string | Record<string, string>;
  ac: boolean;
  photoLink?: string;
  images?: string[];
  imagePublicIds?: string[];
}

const FALLBACK_ROOMS: RoomInfo[] = [
  { id: "101", phase: 1, number: "101", category: "Double Room Ground Floor", balcony: "No (garden-view window)", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", wardrobe: "Closed Type", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: true, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"] },
  { id: "102", phase: 1, number: "102", category: "Double Room Ground Floor", balcony: "Small private balcony", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", wardrobe: "Not available", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: true, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6", images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"] },
  { id: "103", phase: 1, number: "103", category: "Deluxe Room With Balcony", balcony: "Yes", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", wardrobe: "Closed Type", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: true, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"] },
  { id: "104", phase: 1, number: "104", category: "Deluxe Room With Balcony", balcony: "Yes", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", wardrobe: "Open Type", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: true, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6", images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"] },
  { id: "105", phase: 2, number: "105", category: "Standard Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/4rrQpirgHdyzojZj8", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"] },
  { id: "106", phase: 2, number: "106", category: "Standard Room (Teacher/Single)", balcony: "No", beds: "Single Large Bed (Non-Separable)", wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", notes: "Recommended for Teacher Accommodation or Single Occupancy", ac: true, photoLink: "https://photos.app.goo.gl/4rrQpirgHdyzojZj8", images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"] },
  { id: "107", phase: 2, number: "107", category: "Standard Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/4rrQpirgHdyzojZj8", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"] },
  { id: "108", phase: 2, number: "108", category: "Deluxe Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/YXZy5o9WXxmJwohd6", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"] },
  { id: "109", phase: 2, number: "109", category: "Deluxe Room with Balcony", balcony: "Private Balcony", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/YXZy5o9WXxmJwohd6", images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"] },
  { id: "110", phase: 2, number: "110", category: "Deluxe Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/YXZy5o9WXxmJwohd6", images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"] },
];

function RoomCard({ room, locale }: { room: RoomInfo; locale: string }) {
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const locField = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field["en"] || Object.values(field)[0] || "";
  };

  const images = room.images && room.images.length > 0
    ? room.images
    : [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"
      ];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white border border-[#eae6db]/40 rounded-sm shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
      <div>
        {/* Slideshow image container */}
        <div className="relative aspect-[16/9] bg-[#121212] overflow-hidden group select-none">
          <Image 
            src={images[currentIdx]}
            alt={locField(room.category)}
            fill
            className="object-cover transition-transform duration-500 hover:scale-103"
          />
          
          {images.length > 1 && (
            <>
              <button 
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ‹
              </button>
              <button 
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ›
              </button>
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, i) => (
                  <span 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIdx ? "bg-brand-gold" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Room details */}
        <div className="p-5 text-left">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-serif font-semibold text-[#121212] text-sm md:text-base">Room {room.number}</h4>
              <span className="text-[10px] text-gray-400 font-light block">{locField(room.category)}</span>
            </div>
            <span className={`text-[9px] px-2 py-0.5 font-bold uppercase rounded-sm border ${
              room.ac 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" 
                : "bg-amber-50 text-amber-700 border-amber-100/50"
            }`}>
              {room.ac ? "AC Included" : "Non-AC"}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-gray-500 font-light border-t border-gray-100 pt-3">
            <p><strong className="text-gray-700 font-medium">Beds:</strong> {locField(room.beds)}</p>
            <p><strong className="text-gray-700 font-medium">Balcony:</strong> {locField(room.balcony)}</p>
            <p><strong className="text-gray-700 font-medium">Wardrobe:</strong> {locField(room.wardrobe)}</p>
            <p><strong className="text-gray-700 font-medium">Bathroom:</strong> {locField(room.bathroom)}</p>
            <p><strong className="text-gray-700 font-medium">Hot Water:</strong> {locField(room.hotWater)}</p>
            {room.notes && locField(room.notes) && (
              <p className="text-[10px] text-[#c5a880] italic mt-2 bg-amber-50/50 px-2 py-1 rounded-sm border border-amber-100/35">
                💡 Note: {locField(room.notes)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HostRetreatDashboard({ locale, whatsappNumber, dbConfig }: { locale: string; whatsappNumber?: string; dbConfig?: any }) {
  const rawT = useTranslations("HostRetreat");
  const [yogaHallIdx, setYogaHallIdx] = React.useState(0);

  const t = (key: string, values?: any): string => {
    const val = dbConfig?.[key]?.[locale] || dbConfig?.[key]?.en;
    if (val) return val;
    try {
      if (values) {
        return rawT(key, values);
      }
      return rawT.raw(key) as string;
    } catch {
      try {
        return rawT.raw(key) as string;
      } catch {
        return key;
      }
    }
  };

  const renderRule = (key: string) => {
    const val = t(key);
    if (!val || val === key || val.trim() === "") return null;
    return <li key={key}>• {val}</li>;
  };

  // Rooms source: CMS or fallback static list
  const roomsList: RoomInfo[] = dbConfig?.rooms && Array.isArray(dbConfig.rooms) && dbConfig.rooms.length > 0
    ? dbConfig.rooms
    : FALLBACK_ROOMS;

  // Custom package options editable from CMS
  const noMealsTitle = dbConfig?.noMealsOption?.[locale] || dbConfig?.noMealsOption?.en || t("noMealsOption");
  const breakfastOnlyTitle = dbConfig?.breakfastOnlyOption?.[locale] || dbConfig?.breakfastOnlyOption?.en || t("breakfastOnlyOption");
  const fullDayTitle = dbConfig?.fullDayOption?.[locale] || dbConfig?.fullDayOption?.en || t("fullDayOption");

  // WhatsApp contact link
  const defaultPhone = "917356085055";
  const phone = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, "") : defaultPhone;
  const whatsappInquiryUrl = `https://wa.me/${phone}?text=${encodeURIComponent("Hi Shahid, I am interested in hosting a yoga retreat at Villa Lemon. Can you share availability and room configurations?")}`;

  return (
    <div className="w-full text-[#121212] select-text bg-[#fbf9f6] pb-16 font-sans">
      
      {/* ─── INTRODUCTION SECTION ─── */}
      <section className="bg-white border-b border-[#eae6db]/60 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block">
              {t("retreatVenue")}
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-normal text-brand-dark tracking-wide leading-tight">
              {t("hostTitle")}
            </h2>
            <div className="w-16 h-[1.5px] bg-brand-gold mx-auto mt-4 mb-5" />
            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              {t("hostIntro")}
            </p>
          </div>

          {/* PROPERTY FEATURES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Home className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">{t("roomsFeatureTitle")}</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {t("roomsFeatureDesc")}
              </p>
            </div>
            
            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">{t("hallFeatureTitle")}</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {t("hallFeatureDesc")}
              </p>
            </div>

            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Utensils className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">{t("mealsFeatureTitle")}</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {t("mealsFeatureDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETAILED BROCHURE CONTENT ─── */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        
        {/* 1. PROPERTY & ROOM LAYOUTS */}
        <section id="rooms" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1.5 block">
              Accommodation Config
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-brand-dark tracking-wide">
              Rooms & Property Layout
            </h3>
            <div className="w-10 h-[1px] bg-brand-gold/60 mx-auto mt-3 mb-4" />
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              We offer premium rooms distributed across two adjacent phases. Perfect layout flexibility for teachers, couples, and single/shared retreat participants.
            </p>
          </div>

          {/* PHASE 1 ROOMS */}
          {roomsList.some(r => r.phase === 1) && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white px-5 py-3 border border-[#eae6db]/50 rounded-sm shadow-sm">
                <span className="font-serif text-sm font-semibold text-brand-dark uppercase tracking-wider">
                  {t("phase1Title")}
                </span>
                <a 
                  href="https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[11px] text-brand-gold hover:text-brand-gold-dark font-bold flex items-center gap-1 uppercase transition-colors"
                >
                  <span>View Phase 1 Photos</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roomsList.filter(r => r.phase === 1).map((room) => (
                  <RoomCard key={room.id} room={room} locale={locale} />
                ))}
              </div>
            </div>
          )}

          {/* PHASE 2 ROOMS */}
          {roomsList.some(r => r.phase === 2) && (
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center bg-white px-5 py-3 border border-[#eae6db]/50 rounded-sm shadow-sm">
                <span className="font-serif text-sm font-semibold text-brand-dark uppercase tracking-wider">
                  {t("phase2Title")}
                </span>
                <div className="flex gap-4">
                  <a 
                    href="https://photos.app.goo.gl/4rrQpirgHdyzojZj8" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-brand-gold hover:text-brand-gold-dark font-bold flex items-center gap-1 uppercase transition-colors"
                  >
                    <span>Ground Floor Photos</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-gray-300">|</span>
                  <a 
                    href="https://photos.app.goo.gl/YXZy5o9WXxmJwohd6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-brand-gold hover:text-brand-gold-dark font-bold flex items-center gap-1 uppercase transition-colors"
                  >
                    <span>First Floor Photos</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roomsList.filter(r => r.phase === 2).map((room) => (
                  <RoomCard key={room.id} room={room} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 2. CUISINE & DINING MENU CARD */}
        <section id="dining" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1.5 block">
              Homestyle Catering
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-brand-dark tracking-wide">
              Cuisine & Dining Packages
            </h3>
            <div className="w-10 h-[1px] bg-brand-gold/60 mx-auto mt-3 mb-4" />
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              We provide customizable, homely dining options cooked fresh daily by our local chefs using organic local produce.
            </p>
          </div>

          {/* Dining Package Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 border border-gray-150 rounded-sm shadow-sm text-left">
              <span className="font-bold text-xs text-brand-dark block uppercase mb-1.5">{noMealsTitle.split(" (")[0]}</span>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                {noMealsTitle}
              </p>
            </div>
            <div className="bg-white p-5 border border-gray-150 rounded-sm shadow-sm text-left">
              <span className="font-bold text-xs text-brand-dark block uppercase mb-1.5">{breakfastOnlyTitle.split(" (")[0]}</span>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                {breakfastOnlyTitle}
              </p>
            </div>
            <div className="bg-white p-5 border border-gray-150 rounded-sm shadow-sm text-left">
              <span className="font-bold text-xs text-brand-dark block uppercase mb-1.5">{fullDayTitle.split(" (")[0]}</span>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                {fullDayTitle}
              </p>
            </div>
          </div>

          {/* ELEGANT MENU CARD DISPLAY */}
          <div className="relative bg-[#faf7f2] border-2 border-brand-gold/25 p-6 md:p-10 rounded-sm shadow-md max-w-5xl mx-auto overflow-hidden">
            {/* Watermark/Background ornament */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 opacity-5 text-[#eae6db] font-serif pointer-events-none select-none text-[200px]">
              🍋
            </div>
            
            <div className="text-center mb-8 border-b border-brand-gold/20 pb-6">
              <div className="text-[10px] text-brand-gold tracking-[0.3em] font-bold uppercase mb-1">🍋 Villa Lemon 🍋</div>
              <h4 className="font-serif text-xl md:text-2xl text-brand-dark font-normal uppercase tracking-wider">
                Daily Vegetarian Retreat Menu
              </h4>
              <p className="text-[10px] text-gray-400 font-sans tracking-wide mt-1.5">100% Homemade · Fresh Ingredients · Traditional Flavors</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Breakfast Menu Card */}
              <div className="space-y-4">
                <div className="text-center">
                  <h5 className="font-serif font-bold text-xs text-[#b3966e] uppercase tracking-widest border-b border-brand-gold/15 pb-1 mb-3">
                    {t("menuBreakfastTitle").replace(/[^a-zA-Z\s]/g, "").trim() || "Breakfast"}
                  </h5>
                  <span className="text-[9px] text-gray-400 block font-light mb-4">(09:00 AM – 10:00 AM)</span>
                </div>
                <ul className="text-xs text-gray-600 font-light space-y-2.5 text-center leading-relaxed">
                  {t("menuBreakfastItems").split(", ").map((item, idx) => (
                    <li key={idx} className="hover:text-brand-gold transition-colors duration-200 md:whitespace-nowrap">{item}</li>
                  ))}
                </ul>
              </div>
 
              {/* Lunch Menu Card */}
              <div className="space-y-4 border-t md:border-t-0 md:border-l md:border-r border-brand-gold/15 pt-6 md:pt-0 px-0 md:px-4">
                <div className="text-center">
                  <h5 className="font-serif font-bold text-xs text-[#b3966e] uppercase tracking-widest border-b border-brand-gold/15 pb-1 mb-3">
                    {t("menuLunchTitle").replace(/[^a-zA-Z\s]/g, "").trim() || "Lunch"}
                  </h5>
                  <span className="text-[9px] text-gray-400 block font-light mb-4">(01:00 PM – 02:00 PM)</span>
                </div>
                <ul className="text-xs text-gray-600 font-light space-y-2.5 text-center leading-relaxed">
                  {t("menuLunchItems").split(", ").map((item, idx) => (
                    <li key={idx} className="hover:text-brand-gold transition-colors duration-200 md:whitespace-nowrap">{item}</li>
                  ))}
                </ul>
              </div>
 
              {/* Dinner Menu Card */}
              <div className="space-y-4 border-t md:border-t-0 pt-6 md:pt-0">
                <div className="text-center">
                  <h5 className="font-serif font-bold text-xs text-[#b3966e] uppercase tracking-widest border-b border-brand-gold/15 pb-1 mb-3">
                    {t("menuDinnerTitle").replace(/[^a-zA-Z\s]/g, "").trim() || "Dinner"}
                  </h5>
                  <span className="text-[9px] text-gray-400 block font-light mb-4">(05:00 PM – 06:00 PM)</span>
                </div>
                <ul className="text-xs text-gray-600 font-light space-y-2.5 text-center leading-relaxed">
                  {t("menuDinnerItems").split(", ").map((item, idx) => (
                    <li key={idx} className="hover:text-brand-gold transition-colors duration-200 md:whitespace-nowrap">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
 
            {/* Menu Legend/Footnote */}
            <div className="mt-10 pt-5 border-t border-brand-gold/20 text-[9px] text-gray-400 font-sans text-center flex flex-wrap justify-center gap-x-6 gap-y-2">
              {t("menuFooterItems").split(", ").map((item, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <span className="text-brand-gold">✓</span> {item.replace("✓", "").trim()}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. ROOFTOP YOGA SALA CARD */}
        <section id="yoga-hall" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1.5 block">
              Yoga Facilities
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-brand-dark tracking-wide">
              {t("yogaHallUsageTitle")}
            </h3>
            <div className="w-10 h-[1px] bg-brand-gold/60 mx-auto mt-3 mb-4" />
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Conduct your daily yoga and meditation classes in our quiet, high-ceiling rooftop studio.
            </p>
          </div>

          <div className="bg-white border border-[#eae6db]/60 rounded-sm overflow-hidden shadow-sm max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 text-left">
            {/* Left side: Shala image slideshow */}
            {(() => {
              const yogaHallImages = dbConfig?.yogaHallImages && dbConfig.yogaHallImages.length > 0
                ? dbConfig.yogaHallImages
                : (dbConfig?.yogaHallImage ? [dbConfig.yogaHallImage] : ["https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=800"]);

              const handleYogaHallNext = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setYogaHallIdx((prev) => (prev + 1) % yogaHallImages.length);
              };

              const handleYogaHallPrev = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setYogaHallIdx((prev) => (prev - 1 + yogaHallImages.length) % yogaHallImages.length);
              };

              return (
                <div className="md:col-span-5 relative min-h-[220px] md:min-h-[280px] bg-[#121212] overflow-hidden group select-none">
                  <Image 
                    src={yogaHallImages[yogaHallIdx]} 
                    alt="Rooftop Yoga Sala" 
                    fill 
                    className="object-cover opacity-90 transition-transform duration-500 hover:scale-103"
                  />
                  
                  {yogaHallImages.length > 1 && (
                    <>
                      <button 
                        type="button"
                        onClick={handleYogaHallPrev}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ‹
                      </button>
                      <button 
                        type="button"
                        onClick={handleYogaHallNext}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {yogaHallImages.map((_: string, i: number) => (
                          <span 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === yogaHallIdx ? "bg-brand-gold" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Right side: details */}
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 text-brand-gold">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-serif font-semibold text-brand-dark text-base md:text-lg">
                  {t("yogaHallUsageTitle")}
                </h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {t("yogaHallSessionsLabel")}. Equipped with premium quality yoga mats, cork yoga blocks, and straps. The rooftop hall has natural ventilation, fresh ocean breezes, and natural lighting. Holds 15–18 participants comfortably.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-500 pt-2 font-medium font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">🧘</span>
                  <span>15–18 Mats Capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">🌬️</span>
                  <span>Natural Airy Atmosphere</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">📦</span>
                  <span>Mats & Blocks Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">🌅</span>
                  <span>Serene Rooftop Views</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. AIRPORT TRANSFERS */}
        <section id="transfers" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1.5 block">
              Logistics Support
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-brand-dark tracking-wide">
              {t("airportLogisticsTitle")}
            </h3>
            <div className="w-10 h-[1px] bg-brand-gold/60 mx-auto mt-3 mb-4" />
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              We arrange smooth airport transfers from Trivandrum Airport (TRV) directly to our homestay properties.
            </p>
          </div>

          <div className="bg-white border border-[#eae6db]/60 p-6 md:p-8 rounded-sm shadow-sm max-w-4xl mx-auto text-left">
            <h4 className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-brand-gold" />
              {t("trivandrumAirport")}
            </h4>
            <p className="text-xs text-gray-500 font-light mb-6 leading-relaxed">
              {t("airportLogisticsIntro")}
            </p>

            {/* Vehicle types card grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#fbf9f6] p-4 border border-gray-150 rounded-sm">
                <span className="font-serif font-bold text-xs text-brand-dark block">{t("carSmallLabel").split(" - ")[0]}</span>
                <span className="text-[10px] text-gray-400 font-light block mt-1 leading-relaxed">
                  {t("carSmallLabel").split(" - ")[1] || "Fits 3 guests + luggage comfortably."}
                </span>
              </div>
              <div className="bg-[#fbf9f6] p-4 border border-gray-150 rounded-sm">
                <span className="font-serif font-bold text-xs text-brand-dark block">{t("carLargeLabel").split(" - ")[0]}</span>
                <span className="text-[10px] text-gray-400 font-light block mt-1 leading-relaxed">
                  {t("carLargeLabel").split(" - ")[1] || "Fits 4–5 guests + luggage comfortably."}
                </span>
              </div>
              <div className="bg-[#fbf9f6] p-4 border border-gray-150 rounded-sm">
                <span className="font-serif font-bold text-xs text-brand-dark block">{t("tempoLabel").split(" - ")[0]}</span>
                <span className="text-[10px] text-gray-400 font-light block mt-1 leading-relaxed">
                  {t("tempoLabel").split(" - ")[1] || "17-Seater coach for large group logistics."}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION BANNER */}
        <section className="bg-brand-dark text-white p-8 md:p-12 rounded-sm text-center space-y-5 shadow-lg border border-brand-gold/15 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-radial-gradient from-brand-gold via-transparent to-transparent pointer-events-none" />
          <span className="text-[10px] text-brand-gold tracking-[0.2em] font-bold uppercase block">
            Plan Your Next Event
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-white font-normal max-w-lg mx-auto leading-tight">
            Ready to Host Your Yoga Retreat at Villa Lemon?
          </h3>
          <p className="text-xs text-white/70 max-w-md mx-auto font-light leading-relaxed font-sans">
            Get in touch with Shahid directly to verify seasonal availability, check rates, and design a custom wellness retreat package.
          </p>
          <div className="pt-2 flex justify-center">
            <a 
              href={whatsappInquiryUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-sm transition-all duration-300 shadow-md flex items-center gap-2 uppercase font-sans"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
                <path d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.21 2 5.87L3 22l4.3-1c1.6.9 3.4 1.3 5.7 1.3 5.5 0 10-4.48 10-10S17.524 2 12.004 2zm5.7 14.1c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .2-3.1-.6-2.5-1-4-3.6-4.1-3.8-.1-.2-.8-1-1-2.1v-.1c0-.6.3-.9.4-1 .2-.2.4-.2.5-.2h.4c.1 0 .3-.1.5.3.2.5.7 1.6.7 1.8 0 .1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.3.3-.4.4-.1.1-.3.2-.1.5.2.4.9 1.5 2 2.4.9.8 1.7 1.1 2 1.3.3.1.5.1.7-.1.2-.3.9-1.1 1.1-1.4.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1.1.3.2.5.3.6.4.1.3.1 1.2-.1 1.7z" />
              </svg>
              <span>Send WhatsApp Inquiry</span>
            </a>
          </div>
        </section>

      </div>

      {/* ─── POLICY TERMS & CONDITIONS SECTION ─── */}
      <section className="bg-white border-t border-[#eae6db]/60 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-serif text-xl md:text-2xl font-normal text-brand-dark tracking-wide leading-tight mb-8 text-center">
            {t("termsTitle")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left font-sans">
            {/* Booking policies */}
            <div className="space-y-4">
              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("confirmationTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  {renderRule("confirmationRule1")}
                  {renderRule("confirmationRule2")}
                  {renderRule("confirmationRule3")}
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("paymentTermsTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  {renderRule("paymentTermsRule1")}
                  {renderRule("paymentTermsRule2")}
                  {renderRule("paymentTermsRule3")}
                  {renderRule("paymentTermsRule4")}
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("termsAndCondTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  {renderRule("termsRule1")}
                  {renderRule("termsRule2")}
                  {renderRule("termsRule3")}
                  {renderRule("termsRule4")}
                  {renderRule("termsRule5")}
                  {renderRule("termsRule6")}
                  {renderRule("termsRule7")}
                </ul>
              </div>
            </div>

            {/* Cancellation policies */}
            <div className="space-y-4">
              <div className="bg-[#fbf9f6] border border-gray-150 p-5 rounded-sm">
                <h4 className="font-serif font-bold text-xs text-[#b3966e] uppercase tracking-wider mb-3">
                  {t("cancellationTitle")}
                </h4>
                
                <div className="space-y-3 text-xs text-gray-500 font-light leading-relaxed">
                  {t("cancel60Days") && t("cancel60Days") !== "cancel60Days" && t("cancel60Days").trim() !== "" && (
                    <div>
                      <span className="font-bold text-brand-dark block">{t("cancel60Days")}</span>
                      {t("cancel60DaysDesc") && t("cancel60DaysDesc") !== "cancel60DaysDesc" && t("cancel60DaysDesc").trim() !== "" && (
                        <span className="block mt-0.5">{t("cancel60DaysDesc")}</span>
                      )}
                    </div>
                  )}

                  {t("cancel30to59") && t("cancel30to59") !== "cancel30to59" && t("cancel30to59").trim() !== "" && (
                    <div className="border-t border-gray-200 pt-2.5">
                      <span className="font-bold text-brand-dark block">{t("cancel30to59")}</span>
                      {t("cancel30to59Desc") && t("cancel30to59Desc") !== "cancel30to59Desc" && t("cancel30to59Desc").trim() !== "" && (
                        <span className="block mt-0.5">{t("cancel30to59Desc")}</span>
                      )}
                    </div>
                  )}

                  {t("cancelUnder30") && t("cancelUnder30") !== "cancelUnder30" && t("cancelUnder30").trim() !== "" && (
                    <div className="border-t border-gray-200 pt-2.5">
                      <span className="font-bold text-brand-dark block">{t("cancelUnder30")}</span>
                      {t("cancelUnder30Desc") && t("cancelUnder30Desc") !== "cancelUnder30Desc" && t("cancelUnder30Desc").trim() !== "" && (
                        <span className="block mt-0.5">{t("cancelUnder30Desc")}</span>
                      )}
                    </div>
                  )}

                  {t("noShow") && t("noShow") !== "noShow" && t("noShow").trim() !== "" && (
                    <div className="border-t border-gray-200 pt-2.5">
                      <span className="font-bold text-brand-dark block">{t("noShow")}</span>
                      {t("noShowDesc") && t("noShowDesc") !== "noShowDesc" && t("noShowDesc").trim() !== "" && (
                        <span className="block mt-0.5">{t("noShowDesc")}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("amendmentsTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5 font-sans">
                  {renderRule("amendmentsRule1")}
                  {renderRule("amendmentsRule2")}
                  {renderRule("amendmentsRule3")}
                </ul>
              </div>

              {t("forceMajeureTitle") && t("forceMajeureTitle") !== "forceMajeureTitle" && t("forceMajeureTitle").trim() !== "" && (
                <div>
                  <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2 font-sans">
                    {t("forceMajeureTitle")}
                  </h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed font-sans font-sans">
                    {t("forceMajeureDesc")}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center mt-12 bg-[#fbf9f6] border border-[#eae6db] p-6 rounded-sm">
            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed font-sans">
              {t("footerGreeting")}
            </p>
            <div className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-4 font-sans">
              {t("footerSignature")}
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOCATION DISTANCE LOG ─── */}
      <section className="bg-white py-12 md:py-16 font-sans">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="font-serif text-xl md:text-2xl font-normal text-brand-dark tracking-wide leading-tight mb-3">
            Prime Location in Varkala
          </h3>
          <p className="text-xs text-gray-500 font-light max-w-xl mx-auto mb-8">
            All Villa Lemon properties are conveniently located near Varkala's most popular attractions while maintaining a peaceful residential atmosphere.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto text-xs text-gray-600 font-light font-sans">
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🌊 Black Beach</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans font-light">900 m away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">⛰️ Varkala Cliff</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans font-light">900 m away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🧭 North Cliff</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans font-light">1 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🚉 Varkala Station</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans font-light">2.5 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🏖️ Kappil Beach</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans font-light">5.5 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🦅 Jatayu Center</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans font-light">28 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">✈️ TRV Airport</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans font-light">42 km away</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
