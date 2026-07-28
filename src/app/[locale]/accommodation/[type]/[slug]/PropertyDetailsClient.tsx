"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Check, 
  MapPin, 
  Clock, 
  Calendar, 
  HelpCircle, 
  Phone, 
  Bed, 
  Bath, 
  Users, 
  Compass, 
  Wifi, 
  Car, 
  Sun, 
  Activity, 
  ShieldCheck, 
  Info,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Trees,
  ImageIcon
} from "lucide-react";

interface Property {
  id: string;
  type: string;
  title: string;
  price: number;
  pricePeriod: string;
  image: string;
  aboutImage: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  location: string;
  shortDescription: string;
  tagline: string;
  aboutText1: string;
  aboutText2: string;
  perfectLocationText: string;
  groupAccommodationText: string;
  checkInTime: string;
  checkOutTime: string;
  highlights: Array<{ icon: string; label: string }>;
  whyGuestsLoveUs: Array<{ icon: string; title: string; desc: string }>;
  distances: Array<{ place: string; distance: string }>;
  roomAmenities: string[];
  idealFor: string[];
  checkInOutRules: string[];
  additionalServices: Array<{ service: string; details: string }>;
  mapLink: string;
  gallery: string[];
}

interface PropertyDetailsClientProps {
  property: Property;
  translations: Record<string, string>;
  locale: string;
  typePath: string;
  contact?: { whatsapp: string; phone: string; email: string };
  suggestions?: Array<{
    id: string;
    type: string;
    title: string;
    price: number;
    pricePeriod: string;
    image: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    location: string;
    shortDescription: string;
    tagline: string;
    slug: string;
    cardType: string;
  }>;
}

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "pool": return <Sun className="w-5 h-5 text-brand-gold" />;
    case "wifi": return <Wifi className="w-5 h-5 text-brand-gold" />;
    case "parking": return <Car className="w-5 h-5 text-brand-gold" />;
    case "shield": return <ShieldCheck className="w-5 h-5 text-brand-gold" />;
    case "compass": return <Compass className="w-5 h-5 text-brand-gold" />;
    case "mappin": return <MapPin className="w-5 h-5 text-brand-gold" />;
    case "bed": return <Bed className="w-5 h-5 text-brand-gold" />;
    case "home": return <Home className="w-5 h-5 text-brand-gold" />;
    case "trees": return <Trees className="w-5 h-5 text-brand-gold" />;
    case "users": return <Users className="w-5 h-5 text-brand-gold" />;
    default: return <Compass className="w-5 h-5 text-brand-gold" />;
  }
};

export default function PropertyDetailsClient({ property, translations, locale, typePath, suggestions = [], contact }: PropertyDetailsClientProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  const tabs = [
    { id: "overview", label: translations.overview || "Overview" },
    { id: "rooms", label: translations.rooms || (property.type === "room" ? "Room Details" : "Rooms & Apartment") },
    { id: "amenities", label: translations.amenities || "Amenities" },
    { id: "facilities", label: translations.facilities || "Facilities" },
    { id: "location", label: translations.location || "Location" },
    { id: "policies", label: translations.policies || "Info & Policies" },
  ];

  return (
    <main className="w-full bg-[#fbf9f6] text-[#121212] min-h-screen pb-16 font-sans">
      
      {/* HEADER HERO BANNER */}
      <section className="relative w-full min-h-[300px] md:min-h-[360px] flex items-end bg-[#121212] overflow-hidden pt-28 pb-10">
        {/* Cover Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover opacity-50 brightness-75 select-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-20">
          {/* Back & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link 
              href={`/${locale}/accommodation/${typePath}`}
              className="flex items-center gap-1 text-[10px] md:text-xs font-bold tracking-wider text-brand-gold hover:text-white uppercase transition-colors select-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{translations.back || "Back to listing"}</span>
            </Link>

            <div className="flex items-center gap-1.5 text-white/50 text-[10px] md:text-xs tracking-wider uppercase font-semibold select-none">
              <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors">Home</Link>
              <span>&gt;</span>
              <Link href={`/${locale}#villas`} className="hover:text-brand-gold transition-colors">Accommodation</Link>
              <span>&gt;</span>
              <Link href={`/${locale}/accommodation/${typePath}`} className="hover:text-brand-gold transition-colors">
                {typePath === "villas" ? "Entire Villas" : typePath === "floors" ? "Private Floors" : "Individual Rooms"}
              </Link>
              <span>&gt;</span>
              <span className="text-brand-gold">{property.title}</span>
            </div>
          </div>

          {/* Heading and details */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 tracking-wide leading-tight animate-fade-in-up">
            {property.title}
          </h1>
          <p className="max-w-3xl text-sm sm:text-base md:text-lg text-brand-gold font-serif italic mb-6 animate-fade-in-up delay-100">
            {property.tagline}
          </p>
          <p className="max-w-2xl text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-10 select-text animate-fade-in-up delay-200">
            {property.shortDescription}
          </p>

          {/* Highlights Row and Buttons */}
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between border-t border-white/10 pt-8 animate-fade-in-up delay-300">
            {/* Highlights list */}
            <div className="flex flex-wrap items-center gap-6 select-none">
              {property.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-10 h-10 border border-brand-gold/30 rounded-sm bg-black/40 flex items-center justify-center text-brand-gold shrink-0">
                    {getIcon(h.icon)}
                  </div>
                  <div className="text-left">
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">{h.label}</h4>
                    <span className="text-[8px] text-white/40 font-medium">Included</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Room stats + CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              {/* Bedroom / Bathroom count badges */}
              <div className="flex items-center gap-3 border border-white/10 bg-black/30 rounded-sm px-4 py-2.5 select-none">
                <div className="flex items-center gap-1.5 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l1-4h16l1 4M3 12v5a1 1 0 001 1h1m14 0h1a1 1 0 001-1v-5M3 12h18M7 17v1m10-1v1M7 8h.01M17 8h.01" />
                  </svg>
                  <span className="text-sm font-bold text-white leading-none">{property.bedrooms}</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider font-medium leading-none">
                    {property.bedrooms === 1 ? "Room" : "Rooms"}
                  </span>
                </div>
                <div className="w-px h-5 bg-white/15" />
                <div className="flex items-center gap-1.5 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 6a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2M4 6V4a1 1 0 011-1h4a1 1 0 011 1v2M14 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                  <span className="text-sm font-bold text-white leading-none">{property.bathrooms}</span>
                  <span className="text-[9px] text-white/50 uppercase tracking-wider font-medium leading-none">
                    {property.bathrooms === 1 ? "Bath" : "Baths"}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 select-none">
                <a
                  href="#booking"
                  className="px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm"
                >
                  {translations.bookStay || "Book Your Stay"}
                </a>
                <a
                  href={`https://wa.me/919000000000?text=Hi, I would like to book a stay at ${encodeURIComponent(property.title)}`}
                  target="_blank"
                  className="px-6 py-3.5 border border-white/20 hover:border-brand-gold text-white hover:text-brand-gold font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300"
                >
                  {translations.whatsappUs || "WhatsApp Us"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS BAR (STICKY) */}
      <nav className="w-full bg-[#121212] text-white border-y border-white/5 sticky top-[73px] z-35 shadow-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-1 overflow-x-auto select-none no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4.5 text-[10.5px] font-bold uppercase tracking-widest border-b-2 shrink-0 transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "border-brand-gold text-brand-gold font-extrabold"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* TABS PANELS WRAPPER */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 md:mt-16">
        
        {/* PANEL: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in">
            {/* Left Texts Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none">
                {translations.overview || "Overview"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
                {translations.aboutProperty || "About Property"}
              </h2>
              <div className="text-sm font-sans font-light leading-relaxed text-[#2d3748] space-y-6 select-text">
                <p>{property.aboutText1}</p>
                <p>{property.aboutText2}</p>
              </div>

              {/* Assurances: Why Guests Love Us */}
              <div className="w-full mt-12 pt-10 border-t border-[#eae6db]">
                <h3 className="font-serif text-xl font-normal mb-6 text-[#121212]">
                  {translations.whyLoveUs || "Why Guests Love Us"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 select-text">
                  {property.whyGuestsLoveUs.map((w, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-10 h-10 bg-brand-gold/10 flex items-center justify-center rounded-full text-brand-gold shrink-0 mt-0.5">
                        {getIcon(w.icon)}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#121212] leading-tight">{w.title}</h4>
                        <p className="text-xs text-gray-500 font-light leading-relaxed mt-1">{w.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Location Map Button */}
              {property.mapLink && (
                <div className="w-full mt-10 pt-8 border-t border-[#eae6db]">
                  <a
                    href={property.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-brand-gold hover:bg-brand-gold text-brand-gold hover:text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 select-none cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{translations.openInMaps || "Open in Maps"}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Right Photos & Distance Table Column */}
            <div className="lg:col-span-5 flex flex-col gap-8 select-none">
              {/* About section image */}
              <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden shadow-md border border-[#eae6db]">
                <Image
                  src={property.aboutImage}
                  alt="Property Detail Photo"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Landmark Distance Table */}
              <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm">
                <h3 className="font-serif text-base font-semibold text-[#121212] mb-4">
                  {translations.distances || "Distances from the Property"}
                </h3>
                <table className="w-full text-xs font-semibold text-gray-700">
                  <tbody>
                    {property.distances.map((d, i) => (
                      <tr key={i} className="border-b border-[#eae6db]/50 last:border-0">
                        <td className="py-3 text-left font-normal text-gray-600 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold/80" />
                          <span>{d.place}</span>
                        </td>
                        <td className="py-3 text-right font-bold text-[#121212]">{d.distance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Perfect location description block */}
              <div className="bg-brand-cream-soft border border-brand-gold/20 rounded-md p-6 select-text text-left">
                <h4 className="font-serif text-sm font-semibold text-brand-gold mb-2">
                  {translations.perfectLocation || "A Perfect Location"}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed font-light font-sans">
                  {property.perfectLocationText}
                </p>
              </div>
            </div>

            {/* General Information stacked block */}
            <div className="lg:col-span-12 w-full mt-12 pt-12 border-t border-[#eae6db] text-left">
              <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#121212] mb-12 tracking-wide">
                {translations.generalInformation || "General Information"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Room Amenities */}
                <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center">
                        <Bed className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#121212]">
                        {translations.roomAmenities || "Room Amenities"}
                      </h3>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4 select-none">
                      {translations.amenitiesSubtitle || "All rooms include:"}
                    </span>
                    <ul className="space-y-2.5 text-xs text-gray-600 font-light select-text">
                      {property.roomAmenities.slice(0, 8).map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Faint illustration placeholder SVG */}
                  <div className="absolute right-2 bottom-2 opacity-5 select-none pointer-events-none">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>

                {/* Column 2: Ideal For */}
                <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#121212]">
                        {translations.idealFor || "Ideal For"}
                      </h3>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4 select-none">
                      {translations.activitiesSubtitle || "Wellness matches:"}
                    </span>
                    <ul className="space-y-2.5 text-xs text-gray-600 font-light select-text">
                      {property.idealFor.map((ideal, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{ideal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute right-4 bottom-2 opacity-5 select-none pointer-events-none">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7c-2 0-4 1.5-4 4v3l4 4 4-4v-3c0-2.5-2-4-4-4zM6 20h12" />
                    </svg>
                  </div>
                </div>

                {/* Column 3: Group Accommodation */}
                <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#121212]">
                        {translations.groupAccommodation || "Group Accommodation"}
                      </h3>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4 select-none">
                      {translations.capacitySubtitle || "Capacity limits:"}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed font-light font-sans select-text">
                      {property.groupAccommodationText}
                    </p>
                  </div>
                  <div className="absolute right-4 bottom-2 opacity-5 select-none pointer-events-none">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 2: Check-in/Out & Additional Services */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Check-in & Check-out */}
                <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#121212]">
                        {translations.checkInOut || "Check-in & Check-out"}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 select-none">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Check-in time</span>
                        <span className="text-sm font-bold text-[#121212] mt-0.5 block">{property.checkInTime}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Check-out time</span>
                        <span className="text-sm font-bold text-[#121212] mt-0.5 block">{property.checkOutTime}</span>
                      </div>
                    </div>
                    <ul className="space-y-1 text-[11px] text-gray-500 font-light select-text">
                      {property.checkInOutRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute right-4 bottom-2 opacity-5 select-none pointer-events-none">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="6" width="18" height="14" rx="2" />
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    </svg>
                  </div>
                </div>

                {/* Additional Services */}
                <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#121212]">
                        {translations.additionalServices || "Additional Services Available on Request"}
                      </h3>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-600 font-light select-text">
                      {property.additionalServices.map((service, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-[#121212]">{service.service}</span>
                            <span className="text-gray-500 font-light ml-1.5">• {service.details}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="absolute right-4 bottom-2 opacity-5 select-none pointer-events-none">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C20.3 8.7 18.8 6 15.9 6H8.1C5.2 6 3.7 8.7 3.5 11.1c-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: ROOMS & APARTMENT */}
        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left animate-fade-in">
            {/* Left side details */}
            <div className="lg:col-span-7 flex flex-col items-start select-text">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none block">
                {translations.rooms || "Rooms & Apartment"}
              </span>
              <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
                Accommodation Capacity details
              </h2>
              <div className="grid grid-cols-3 gap-6 bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm mb-8 select-none text-center w-full">
                <div className="flex flex-col items-center gap-1">
                  <Bed className="w-6 h-6 text-brand-gold" />
                  <span className="text-lg font-bold text-[#121212] mt-1">{property.bedrooms}</span>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Bath className="w-6 h-6 text-brand-gold" />
                  <span className="text-lg font-bold text-[#121212] mt-1">{property.bathrooms}</span>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Users className="w-6 h-6 text-brand-gold" />
                  <span className="text-lg font-bold text-[#121212] mt-1">{property.guests}</span>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Max Guests</span>
                </div>
              </div>

              <h3 className="font-serif text-lg font-semibold text-[#121212] mb-3">
                {translations.groupAccommodation || "Group Accommodation"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light mb-6 font-sans">
                {property.groupAccommodationText}
              </p>
            </div>

            {/* Right side gallery */}
            <div className="lg:col-span-5 flex flex-col gap-6 select-none w-full">
              <h3 className="font-serif text-lg font-semibold text-[#121212] mb-1">
                {translations.roomsGallery || (
                  property.type === "villa"
                    ? "Rooms & Villa Gallery"
                    : property.type === "floor"
                    ? "Rooms & Floor Gallery"
                    : "Room Gallery"
                )}
              </h3>
              {property.gallery && property.gallery.length > 0 ? (
                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden shadow-md border border-[#eae6db] group bg-gray-100">
                  <Image
                    src={property.gallery[galleryIndex]}
                    alt={`Gallery Photo ${galleryIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-500 ease-in-out"
                  />
                  
                  {/* Left and Right Navigation Buttons */}
                  {property.gallery.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setGalleryIndex((prev) => (prev === 0 ? property.gallery.length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-[#121212] text-white flex items-center justify-center rounded-full transition-all duration-300 z-10 cursor-pointer shadow"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setGalleryIndex((prev) => (prev === property.gallery.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-[#121212] text-white flex items-center justify-center rounded-full transition-all duration-300 z-10 cursor-pointer shadow"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  {/* Slide Indicators Overlay */}
                  {property.gallery.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 backdrop-blur-xs px-2.5 py-1.5 rounded-full select-none">
                      {property.gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === galleryIndex ? "bg-brand-gold w-3" : "bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-[#eae6db] rounded-md p-10 bg-gray-50/50">
                  <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                  <span className="text-xs text-gray-400">No rooms gallery photos uploaded yet.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL: AMENITIES */}
        {activeTab === "amenities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left animate-fade-in">
            {/* Room Amenities Checklist */}
            <div>
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none block">
                {translations.amenities || "Amenities"}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
                {translations.roomAmenities || "Room Amenities"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-text">
                {property.roomAmenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                    <div className="w-5 h-5 bg-brand-gold/10 text-brand-gold flex items-center justify-center rounded-full shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal For Checklist */}
            <div>
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none block">
                Activity Matches
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
                {translations.idealFor || "Ideal For"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-text">
                {property.idealFor.map((ideal, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                    <div className="w-5 h-5 bg-[#e1eae1] text-emerald-700 flex items-center justify-center rounded-full shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <span>{ideal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: FACILITIES */}
        {activeTab === "facilities" && (
          <div className="max-w-2xl text-left animate-fade-in select-text">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none block">
              {translations.facilities || "Facilities"}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
              {translations.additionalServices || "Additional Services Available on Request"}
            </h2>
            <div className="flex flex-col gap-4">
              {property.additionalServices.map((service, idx) => (
                <div key={idx} className="bg-white border border-[#eae6db]/85 p-5 rounded-md shadow-sm">
                  <h4 className="font-serif text-sm font-semibold text-[#121212]">{service.service}</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed mt-1">{service.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: LOCATION */}
        {activeTab === "location" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left animate-fade-in">
            <div className="lg:col-span-7 select-text">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none block">
                {translations.location || "Location"}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
                Where you'll stay
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed font-light font-sans mb-6">
                {property.perfectLocationText}
              </p>
              <div className="flex flex-col gap-4 items-start">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-800 bg-[#eae6db]/30 px-4 py-3.5 rounded-sm select-none w-full max-w-sm">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                  <span>Located in {property.location}</span>
                </div>
                
                {property.mapLink && (
                  <a
                    href={property.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-brand-gold hover:bg-brand-gold text-brand-gold hover:text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 select-none cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{translations.openInMaps || "Open in Maps"}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 select-none">
              <div className="bg-white border border-[#eae6db]/80 rounded-md p-6 shadow-sm">
                <h3 className="font-serif text-base font-semibold text-[#121212] mb-4">Nearby Landmarks</h3>
                <table className="w-full text-xs font-semibold text-gray-700">
                  <tbody>
                    {property.distances.map((d, i) => (
                      <tr key={i} className="border-b border-[#eae6db]/50 last:border-0">
                        <td className="py-3 text-left font-normal text-gray-600">{d.place}</td>
                        <td className="py-3 text-right font-bold text-[#121212]">{d.distance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: POLICIES */}
        {activeTab === "policies" && (
          <div className="max-w-2xl text-left animate-fade-in select-text">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 select-none block">
              House Rules
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-6 leading-tight tracking-wide">
              {translations.checkInOut || "Check-in & Check-out"}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 select-none">
              <div className="bg-white border border-[#eae6db]/80 rounded-md p-5 shadow-sm flex items-center gap-4">
                <Clock className="w-6 h-6 text-brand-gold shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-in time</h4>
                  <span className="text-lg font-bold text-[#121212] mt-0.5 block">{property.checkInTime}</span>
                </div>
              </div>
              <div className="bg-white border border-[#eae6db]/80 rounded-md p-5 shadow-sm flex items-center gap-4">
                <Clock className="w-6 h-6 text-brand-gold shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Check-out time</h4>
                  <span className="text-lg font-bold text-[#121212] mt-0.5 block">{property.checkOutTime}</span>
                </div>
              </div>
            </div>

            <h3 className="font-serif text-base font-semibold text-[#121212] mb-3">Policy details</h3>
            <ul className="space-y-3.5 text-xs text-gray-600 font-light leading-relaxed">
              {property.checkInOutRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </section>

      {/* YOU MAY ALSO LIKE SECTION */}
      {suggestions && suggestions.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-24 text-left select-none">
          <h2 className="font-serif text-2xl sm:text-3.5xl font-normal text-center text-[#121212] mb-12 tracking-wide">
            {translations.youMayAlsoLike || "You May Also Like"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestions.map((item) => {
              let href = `/${locale}/accommodation/${item.type === "villa" ? "villas" : item.type === "floor" ? "floors" : "rooms"}/${item.slug}`;
              if (item.cardType === "package") {
                const categoryUrlSegment = item.type === "varkalaSightseeing" ? "varkala-sightseeing" : item.type === "dayTrips" ? "day-trips" : item.type === "backwaterExperiences" ? "backwater-experiences" : item.type === "varkalaPackages" ? "varkala-packages" : "adventure-activities";
                href = `/${locale}/packages/${categoryUrlSegment}/${item.slug}`;
              } else if (item.cardType === "yoga") {
                href = `/${locale}/yoga/${item.type}/${item.slug}`;
              }

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                    
                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4 bg-[#121212]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10 text-white text-[11px] font-semibold tracking-wider">
                      From ₹{item.price.toLocaleString()} {item.pricePeriod}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="p-5 flex flex-col flex-grow items-start">
                    <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest mb-1.5 leading-none">
                      {item.location}
                    </span>
                    
                    <h3 className="font-serif text-base font-normal text-[#121212] mb-2 tracking-wide leading-tight group-hover:text-brand-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed mb-4 text-left font-sans">
                      {item.shortDescription}
                    </p>
                    
                    {/* Icons row */}
                    {item.cardType === "accommodation" ? (
                      <div className="flex items-center gap-4 mt-auto text-[10px] font-bold text-gray-600 border-t border-[#eae6db]/50 pt-4 w-full">
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{item.bedrooms} Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{item.guests} Guests</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 mt-auto text-[10px] font-bold text-brand-gold border-t border-[#eae6db]/50 pt-4 w-full uppercase tracking-wider">
                        <span>{item.cardType === "package" ? "🎒 Tour Package" : "🧘 Yoga Program"}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* FOOTER CTA CALLOUT BANNER */}
      <section id="booking" className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-24">
        <div className="bg-[#121212] text-white rounded-md p-8 md:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left relative overflow-hidden">
          {/* Subtle gold decoration */}
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 select-text">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.25em] mb-2 select-none block">
              {translations.bookNow || "BOOK NOW"}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white mb-3">
              {translations.needHelp || "Need Help Planning Your Stay?"}
            </h2>
            <p className="text-xs sm:text-sm text-white/50 font-light max-w-xl leading-relaxed">
              {translations.support247 || "Our local team in Varkala is here to assist you with room alignments, airport transfers, and yoga programs."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10 select-none">
            <a
              href={`https://wa.me/${(contact?.whatsapp || "+91 73560 85055").replace(/[^0-9]/g, "")}`}
              target="_blank"
              className="px-6 py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <span>{translations.chatOnWhatsapp || "CHAT ON WHATSAPP"}</span>
            </a>
            <a
              href="#contact"
              className="px-6 py-4.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300"
            >
              {translations.bookStay || "BOOK YOUR STAY"}
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
