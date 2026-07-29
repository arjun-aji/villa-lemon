"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageSlideshow } from "./ImageSlideshow";

interface PackageItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  pricePeriod: string;
  image: string;
  images?: string[];
  duration: string;
  shortDescription: string;
  tagline: string;
}

interface Props {
  packages: PackageItem[];
  locale: string;
  categorySlug: string;
}

export default function PackagesGridSlider({ packages, locale, categorySlug }: Props) {
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
      // Run initially
      checkScroll();
      // Handle resize
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [packages]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      // Scroll by 1 card width + gap approx
      const cardWidth = clientWidth / 4;
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
      {packages.length >= 4 && (
        <>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-35 w-12 h-12 bg-white/95 hover:bg-white text-gray-800 disabled:opacity-0 disabled:pointer-events-none rounded-full shadow-lg border border-gray-150 items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer`}
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6 text-[#121212]" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-35 w-12 h-12 bg-white/95 hover:bg-white text-gray-800 disabled:opacity-0 disabled:pointer-events-none rounded-full shadow-lg border border-gray-150 items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer`}
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6 text-[#121212]" />
          </button>
        </>
      )}

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="w-full flex flex-col sm:flex-row sm:overflow-x-auto sm:snap-x sm:snap-mandatory gap-6 pb-4 no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {packages.map((p) => {
          const detailUrl = `/${locale}/packages/${categorySlug}/${p.slug}`;
          return (
            <div
              key={p.id}
              className="sm:snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(26%-18px)] group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Photo cover */}
              <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden select-none">
                <ImageSlideshow
                  images={p.images}
                  defaultImage={p.image}
                  className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  alt={p.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 bg-[#121212]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-[10px] font-bold tracking-wider">
                  ₹{p.price.toLocaleString()} {p.pricePeriod}
                </div>
              </div>

              {/* Card content */}
              <div className="p-6 flex flex-col flex-grow items-start text-left">
                <div className="flex items-center gap-1.5 text-brand-gold text-[9px] font-bold tracking-widest uppercase mb-1 select-none font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{p.duration}</span>
                </div>

                <h3 className="font-serif text-base font-normal text-[#121212] mb-2 tracking-wide leading-tight group-hover:text-brand-gold transition-colors duration-300 min-h-[48px] line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed mb-6 font-sans line-clamp-3 select-text flex-grow">
                  {p.shortDescription}
                </p>

                <Link
                  href={detailUrl}
                  className="mt-auto text-[10px] font-bold uppercase tracking-wider text-brand-dark hover:text-brand-gold transition-colors flex items-center gap-1 group/btn border-b border-brand-dark/15 pb-0.5"
                >
                  <span>Explore experience</span>
                  <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
