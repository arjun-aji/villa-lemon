"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Clock, CheckCircle, Users } from "lucide-react";
import { ImageSlideshow } from "./ImageSlideshow";

export interface YogaCardItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  images?: string[];
  price: number;
  pricePeriod: string;
  duration?: string;
  shortDescription: string;
  featured?: boolean;
  hideRate?: boolean;
  detailUrl: string;
  yogaLevel?: string;
  groupSize?: string;
  location?: string;
}

interface YogaGridSliderProps {
  items: YogaCardItem[];
  locale: string;
}

export default function YogaGridSlider({ items, locale }: YogaGridSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const cardWidth = clientWidth / 3;
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Navigation Buttons (Desktop only, overlayed on the sides) */}
      {items.length >= 4 && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-35 w-12 h-12 bg-white/95 hover:bg-white text-gray-800 disabled:opacity-0 disabled:pointer-events-none rounded-full shadow-lg border border-gray-150 items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6 text-[#121212]" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-35 w-12 h-12 bg-white/95 hover:bg-white text-gray-800 disabled:opacity-0 disabled:pointer-events-none rounded-full shadow-lg border border-gray-150 items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6 text-[#121212]" />
          </button>
        </>
      )}

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="w-full flex flex-col sm:flex-row sm:overflow-x-auto sm:snap-x sm:snap-mandatory gap-6 pb-6 no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="sm:snap-start shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Cover Image Wrapper */}
            <div className="relative w-full h-40 sm:h-48 md:aspect-[4/3] overflow-hidden bg-brand-cream-soft select-none">
              <ImageSlideshow
                images={item.images}
                defaultImage={item.image}
                className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {!item.hideRate && (
                <div className="absolute bottom-4 right-4 bg-[#121212]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-[11px] font-semibold tracking-wider shadow-sm z-20">
                  ₹{item.price.toLocaleString()} {item.pricePeriod}
                </div>
              )}
              
              {item.featured && (
                <div className="absolute top-3 right-3 bg-brand-gold text-black text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider z-20 shadow-md">
                  Featured
                </div>
              )}
            </div>

            {/* Details Wrapper */}
            <div className="p-6 md:p-8 flex flex-col flex-grow items-start text-left">
              {item.location && (
                <div className="flex items-center gap-1.5 text-brand-gold text-[9px] font-bold tracking-widest uppercase mb-1.5 select-none font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  <span>{item.location}</span>
                </div>
              )}
              {item.duration && !item.location && (
                <div className="flex items-center gap-1.5 text-brand-gold text-[9px] font-bold tracking-widest uppercase mb-1.5 select-none font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.duration}</span>
                </div>
              )}

              <h3 className="font-serif text-lg font-normal text-[#121212] mb-2 tracking-wide leading-tight group-hover:text-brand-gold transition-colors duration-300">
                {item.title}
              </h3>
              
              <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed mb-6 font-sans flex-grow select-text line-clamp-2">
                {item.shortDescription}
              </p>

              <Link
                href={item.detailUrl}
                className="group/link flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest text-[#121212] hover:text-brand-gold uppercase transition-colors duration-300 mt-auto select-none"
              >
                <span>{item.detailUrl.includes("/retreats/") ? "Explore Retreat" : "Explore Program"}</span>
                <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
