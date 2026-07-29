"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageSlideshow } from "@/components/ImageSlideshow";
import { Heart, Users, Bed, Bath, ArrowUpDown, ChevronDown, Check, Shield, Calendar, Phone } from "lucide-react";

interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  pricePeriod: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  location: string;
  shortDescription: string;
  tagline: string;
  images?: string[];
}

interface CatalogClientProps {
  properties: Property[];
  typePath: string;
  locale: string;
  contact?: { whatsapp: string; phone: string; email: string };
}

export default function CatalogClient({ properties, typePath, locale, contact }: CatalogClientProps) {
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("all");
  const [selectedGuests, setSelectedGuests] = useState<number>(0);
  const [priceTier, setPriceTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Favorite Heart icon toggling
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Bedroom filter
        if (selectedBedrooms !== "all") {
          if (selectedBedrooms === "4+") {
            if (p.bedrooms < 4) return false;
          } else {
            if (p.bedrooms !== parseInt(selectedBedrooms, 10)) return false;
          }
        }
        // Guest filter
        if (selectedGuests > 0 && p.guests < selectedGuests) {
          return false;
        }
        // Price tier filter
        if (priceTier !== "all") {
          if (priceTier === "under-5k") {
            if (p.price > 5000) return false;
          } else if (priceTier === "5k-15k") {
            if (p.price < 5000 || p.price > 15000) return false;
          } else if (priceTier === "15k-25k") {
            if (p.price < 15000 || p.price > 25000) return false;
          } else if (priceTier === "25k-plus") {
            if (p.price < 25000) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low-high") return a.price - b.price;
        if (sortBy === "price-high-low") return b.price - a.price;
        return 0; // Default/Popular
      });
  }, [properties, selectedBedrooms, selectedGuests, priceTier, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-10">
      
      {/* FILTER & SORT CONTROLS BAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-[#eae6db] pb-8 mb-10 text-xs font-semibold text-[#2d3748]">
        
        {/* Bedrooms Filter Options */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["all", "1", "2", "3", "4+"].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedBedrooms(num)}
              className={`px-4 py-2.5 rounded-sm uppercase tracking-wider transition-all duration-200 border border-transparent select-none cursor-pointer ${
                selectedBedrooms === num
                  ? "bg-[#121212] text-white"
                  : "bg-white border-[#eae6db] hover:border-[#c5a880] text-gray-700"
              }`}
            >
              {num === "all" ? "All Stays" : num === "4+" ? "4+ Bedroom" : `${num} Bedroom`}
            </button>
          ))}
        </div>

        {/* Dropdowns filters */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Guests Count Selector */}
          <div className="relative select-none min-w-[140px]">
            <select
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(Number(e.target.value))}
              className="w-full bg-white border border-[#eae6db] hover:border-[#c5a880] px-4 py-3 rounded-sm appearance-none outline-none cursor-pointer font-bold tracking-wider text-gray-700 uppercase"
            >
              <option value={0}>Guests</option>
              {[1, 2, 4, 6, 8, 10].map((g) => (
                <option key={g} value={g}>{g === 1 ? "1 Guest" : `${g}+ Guests`}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Price Range Selector */}
          <div className="relative select-none min-w-[170px]">
            <select
              value={priceTier}
              onChange={(e) => setPriceTier(e.target.value)}
              className="w-full bg-white border border-[#eae6db] hover:border-[#c5a880] px-4 py-3 rounded-sm appearance-none outline-none cursor-pointer font-bold tracking-wider text-gray-700 uppercase"
            >
              <option value="all">Price Range</option>
              <option value="under-5k">Under ₹5,000</option>
              <option value="5k-15k">₹5,000 - ₹15,000</option>
              <option value="15k-25k">₹15,000 - ₹25,000</option>
              <option value="25k-plus">₹25,000+</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative select-none min-w-[170px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-[#eae6db] hover:border-[#c5a880] px-4 py-3 rounded-sm appearance-none outline-none cursor-pointer font-bold tracking-wider text-gray-700 uppercase"
            >
              <option value="popular">Sort by: Popular</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* PROPERTIES CARDS GRID */}
      {filteredProperties.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-400 bg-white border border-[#eae6db]/80 rounded-md shadow-sm">
          <p className="text-base font-medium">No properties match your current filter selections.</p>
          <button
            onClick={() => {
              setSelectedBedrooms("all");
              setSelectedGuests(0);
              setPriceTier("all");
              setSortBy("popular");
            }}
            className="mt-4 px-5 py-2.5 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-semibold uppercase tracking-wider rounded-sm transition-all duration-300 select-none cursor-pointer text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProperties.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image Wrapper */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden select-none">
                <ImageSlideshow
                  images={p.images}
                  defaultImage={p.image}
                  className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  alt={p.title}
                />
                
                {/* Dark vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                
                {/* Price tag */}
                <div className="absolute bottom-4 left-4 bg-[#121212]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-[11px] font-semibold tracking-wider">
                  From ₹{p.price.toLocaleString()} {p.pricePeriod}
                </div>

                {/* Favorite heart icon */}
                <button
                  onClick={(e) => toggleFavorite(p.id, e)}
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-sm cursor-pointer transition-colors z-20 group/heart"
                  aria-label="Add to favorites"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorites[p.id]
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 group-hover/heart:text-red-500"
                    }`}
                  />
                </button>
              </div>

              {/* Card Details */}
              <div className="p-5 flex flex-col flex-grow items-start">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest mb-1.5 select-none leading-none">
                  {p.location}
                </span>
                
                <h3 className="font-serif text-lg font-normal text-[#121212] mb-2 tracking-wide leading-tight group-hover:text-brand-gold transition-colors duration-300">
                  {p.title}
                </h3>

                {/* Specs tags bar */}
                <div className="flex items-center gap-3.5 text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-4 select-none flex-wrap">
                  <div className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-brand-gold/70" />
                    <span>{p.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-brand-gold/70" />
                    <span>{p.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-brand-gold/70" />
                    <span>{p.guests} Guests</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-gray-500 font-light leading-relaxed mb-6 font-sans flex-grow">
                  {p.shortDescription}
                </p>

                <Link
                  href={`/${locale}/accommodation/${typePath}/${p.slug}`}
                  className="w-full flex items-center justify-center bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider py-3 rounded-sm transition-all duration-300 select-none text-[10px]"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ASSURANCES & BRAND POLICY SLIDES */}
      <section className="w-full border-t border-[#eae6db] mt-20 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[#121212]">
          <div className="bg-white border border-[#eae6db]/80 p-6 rounded-md shadow-sm flex items-start gap-4">
            <Shield className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold tracking-wide text-[#121212]">Best Price Guarantee</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed mt-1.5">
                We offer the best rates for direct bookings on our website or through our support team.
              </p>
            </div>
          </div>
          <div className="bg-white border border-[#eae6db]/80 p-6 rounded-md shadow-sm flex items-start gap-4">
            <Calendar className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold tracking-wide text-[#121212]">Flexible Cancellation</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed mt-1.5">
                Easy cancellation up to 7 days before check-in. No hidden processing fees.
              </p>
            </div>
          </div>
          <div className="bg-white border border-[#eae6db]/80 p-6 rounded-md shadow-sm flex items-start gap-4">
            <Phone className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-sm font-semibold tracking-wide text-[#121212]">24/7 Guest Support</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed mt-1.5">
                Our team is always here in Varkala to support you and ensure a smooth stay.
              </p>
            </div>
          </div>
        </div>

        {/* WHATSAPP CONSULTATION BANNER */}
        <div className="w-full mt-10 bg-[#1e2a1e] text-white p-6 rounded-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-950/20">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-full text-emerald-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.528 2.012 14.077.99 11.493.99c-5.432 0-9.855 4.37-9.859 9.801-.001 1.77.475 3.497 1.378 5.016L1.932 21.09l5.123-1.33c-.12.073-.24.146-.408.234z" />
              </svg>
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold tracking-wide">Need Help Choosing?</h4>
              <p className="text-[11px] text-white/70 font-light mt-0.5 leading-relaxed">
                Chat with our villa expert on WhatsApp to build a customized package for your family.
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/${(contact?.whatsapp || "+91 73560 85055").replace(/[^0-9]/g, "")}`}
            target="_blank"
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shrink-0 select-none shadow-sm"
          >
            Chat with Us
          </a>
        </div>
      </section>

    </div>
  );
}
