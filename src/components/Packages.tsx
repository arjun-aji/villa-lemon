"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ImageSlideshow } from "@/components/ImageSlideshow";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VarkalaIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 mb-3 text-brand-gold"
  >
    {/* Sun rising over water waves */}
    <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M20 12h2M19.07 4.93l-1.41 1.41M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
    <path d="M2 20h20M4 22h16" />
  </svg>
);

const DayTripsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 mb-3 text-brand-gold"
  >
    {/* Front view of car/SUV */}
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10" />
    <path d="M8 19h8a4 4 0 0 0 4-4v-3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3a4 4 0 0 0 4 4z" />
    <path d="M6 10l1.5-4h9l1.5 4" />
    <circle cx="6" cy="15" r="1.5" />
    <circle cx="18" cy="15" r="1.5" />
  </svg>
);

const HouseboatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 mb-3 text-brand-gold"
  >
    {/* Houseboat outline on water */}
    <path d="M2 17.5c2 0 3.5-1.5 5-1.5s3 1.5 5 1.5 3.5-1.5 5-1.5 3 1.5 5 1.5" />
    <path d="M4 16l1-5h14l1 5H4z" />
    <path d="M6 11V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4" />
    <path d="M9 6v5M15 6v5" />
  </svg>
);

const AdventureIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 mb-3 text-brand-gold"
  >
    {/* Compass / target outline */}
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    <path d="M16.24 7.76l-2.12 2.12a3 3 0 0 0-4.24 4.24l-2.12 2.12 4.24-4.24a3 3 0 0 0 4.24-4.24l2.12-2.12z" />
  </svg>
);
const TourPackagesIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 mb-3 text-brand-gold"
  >
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M12 8v12" />
  </svg>
);

interface PackageItem {
  _id?: string;
  category: string;
  image: string;
  images?: string[];
  title: string;
  description: string;
  explore: string;
  href: string;
}

interface PackagesProps {
  data?: PackageItem[];
  tagline?: string;
  heading?: string;
  viewAll?: string;
}

export default function Packages({
  data,
  tagline: taglineOverride,
  heading: headingOverride,
  viewAll: viewAllOverride,
}: PackagesProps) {
  const t = useTranslations("Packages");
  const tagline = taglineOverride || t("tagline");
  const heading = headingOverride || t("heading");
  const viewAll = viewAllOverride || t("viewAll");

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cards = React.useMemo(() => {
    if (data && data.length > 0) {
      return data.map((item) => ({
        category: item.category,
        img: item.image,
        imgs: item.images,
        icon:
          item.category === "varkalaSightseeing"
            ? <VarkalaIcon />
            : item.category === "dayTrips"
            ? <DayTripsIcon />
            : item.category === "backwaterExperiences"
            ? <HouseboatIcon />
            : item.category === "varkalaPackages"
            ? <TourPackagesIcon />
            : <AdventureIcon />,
        title: item.title,
        desc: item.description,
        explore: item.explore,
        href: item.href || "#contact",
      }));
    }

    return [];
  }, [data]);

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
  }, [cards]);

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

  if (cards.length === 0) return null;

  return (
    <section
      id="packages"
      className="w-full bg-brand-cream py-20 md:py-0 md:min-h-screen flex flex-col justify-center text-brand-dark"
      aria-label="Top Packages"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-12 md:py-20">
        {/* HEADER SECTION */}
        <div className="flex items-end justify-between mb-12 md:mb-16 gap-4">
          <div>
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-brand-gold uppercase block mb-2 select-none">
              {tagline}
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-4.5xl font-serif font-normal text-brand-dark leading-tight tracking-wide">
              {heading}
            </h2>
          </div>
        </div>

        {/* PACKAGES CARDS SLIDER */}
        <div className="relative w-full">
          {/* Navigation Buttons (Desktop only, overlayed on the sides) */}
          {cards.length >= 4 && (
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
            {cards.map((card, index) => (
              <div
                key={index}
                id={
                  card.category === "varkalaSightseeing"
                    ? "varkala-sightseeing"
                    : card.category === "dayTrips"
                    ? "day-trips"
                    : card.category === "backwaterExperiences"
                    ? "backwater-experiences"
                    : card.category === "varkalaPackages"
                    ? "varkala-packages"
                    : "adventure-activities"
                }
                className="sm:snap-start shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative w-full h-40 sm:h-48 md:aspect-[4/3] overflow-hidden bg-brand-cream-soft select-none">
                  <ImageSlideshow
                    images={card.imgs}
                    defaultImage={card.img}
                    className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    alt={card.title}
                  />
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10 pointer-events-none" />
                </div>

                {/* CARD DETAILS */}
                <div className="p-6 md:p-8 flex flex-col flex-grow items-start text-left">
                  {card.icon}
                  <h3 className="text-lg font-serif font-normal text-brand-dark mb-1.5 tracking-wide leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-brand-dark/75 font-sans font-light leading-relaxed mb-5 flex-grow line-clamp-2">
                    {card.desc}
                  </p>
                  <a
                    href={card.href}
                    className="group/link flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest text-brand-dark hover:text-brand-gold uppercase transition-colors duration-300 mt-auto select-none"
                  >
                    <span>{card.explore}</span>
                    <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
