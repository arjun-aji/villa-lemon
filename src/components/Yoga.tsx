"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ImageSlideshow } from "@/components/ImageSlideshow";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RetreatsIcon = () => (
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
    {/* Meditating person outline */}
    <circle cx="12" cy="6" r="2" />
    <path d="M12 8v7M12 10c-3 0-5 2.5-5 5.5" />
    <path d="M12 10c3 0 5 2.5 5 5.5" />
    <circle cx="7" cy="15.5" r="0.75" fill="currentColor" />
    <circle cx="17" cy="15.5" r="0.75" fill="currentColor" />
    <path d="M5 19c2-1.5 12-1.5 14 0" />
    <path d="M8 17c2-1 6-1 8 0" />
  </svg>
);

const ClassesIcon = () => (
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
    {/* Concentric rings/gong representation */}
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const PrivateIcon = () => (
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
    {/* Zen balanced stones outline */}
    <ellipse cx="12" cy="19" rx="6" ry="2.5" />
    <ellipse cx="12" cy="13.5" rx="4.5" ry="2" />
    <ellipse cx="12" cy="9" rx="3.5" ry="1.5" />
    <circle cx="12" cy="5" r="1.5" />
  </svg>
);

const TeachersIcon = () => (
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
    {/* Multi-user group outline representing teachers/instructors */}
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

interface YogaProgramItem {
  _id?: string;
  type: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  explore: string;
  href: string;
}

interface YogaProps {
  data?: YogaProgramItem[];
  tagline?: string;
  heading?: string;
  viewAll?: string;
}

export default function Yoga({
  data,
  tagline: taglineOverride,
  heading: headingOverride,
  viewAll: viewAllOverride,
}: YogaProps) {
  const t = useTranslations("Yoga");

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const tagline = taglineOverride || t("tagline");
  const heading = headingOverride || t("heading");
  const viewAll = viewAllOverride || t("viewAll");

  const cards = React.useMemo(() => {
    if (data && data.length > 0) {
      return data.map((item) => ({
        img: item.image,
        imgs: item.images,
        icon:
          item.type === "retreats"
            ? <RetreatsIcon />
            : item.type === "classes"
            ? <ClassesIcon />
            : item.type === "private"
            ? <PrivateIcon />
            : <TeachersIcon />,
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
      id="yogatours"
      className="w-full bg-brand-cream py-20 md:py-0 md:min-h-screen flex flex-col justify-center text-brand-dark"
      aria-label="Yoga and Wellness"
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
          <a
            href="#yoga-programs"
            className="group flex items-center gap-1.5 text-[9px] md:text-xs font-bold tracking-widest text-brand-dark hover:text-brand-gold uppercase transition-colors duration-300 select-none border-b border-transparent hover:border-brand-gold pb-1 shrink-0"
          >
            <span>{viewAll}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        {/* YOGA CARDS SLIDER */}
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
                  index === 0
                    ? "yoga-retreats"
                    : index === 1
                    ? "daily-yoga-classes"
                    : index === 2
                    ? "private-yoga-sessions"
                    : "meet-our-teachers"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10" />
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
