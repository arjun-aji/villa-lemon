"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const VillaIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 mb-4 text-brand-gold"
  >
    {/* Stylized double-story villa outline matching the screenshot theme */}
    <path d="M3 21h18" />
    <path d="M5 21V10l7-5 7 5v11" />
    <path d="M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
    <path d="M10 10h4" />
    <circle cx="12" cy="7.5" r="0.75" fill="currentColor" />
  </svg>
);

const FloorIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 mb-4 text-brand-gold"
  >
    {/* Stylized balcony/roof structure outline for private floors */}
    <path d="M3 21h18" />
    <path d="M5 21V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v15" />
    <path d="M5 13.5h14" />
    <path d="M8 9h2M14 9h2" />
    <path d="M8 17h2M14 17h2" />
  </svg>
);

const RoomIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 mb-4 text-brand-gold"
  >
    {/* Cozy bedroom bed frame design for individual rooms */}
    <path d="M3 21h18" />
    <path d="M5 21v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8" />
    <path d="M7 14h10" />
    <path d="M9 14v2h6v-2" />
    <circle cx="12" cy="11.5" r="0.5" fill="currentColor" />
  </svg>
);

export default function Accommodations() {
  const t = useTranslations("Accommodations");

  const cards = [
    {
      img: "/assets/villa_entire.png",
      price: t("villaPrice"),
      icon: <VillaIcon />,
      title: t("villaTitle"),
      desc: t("villaDesc"),
      explore: t("villaExplore"),
      href: "#contact",
    },
    {
      img: "/assets/villa_terrace.png",
      price: t("floorPrice"),
      icon: <FloorIcon />,
      title: t("floorTitle"),
      desc: t("floorDesc"),
      explore: t("floorExplore"),
      href: "#contact",
    },
    {
      img: "/assets/villa_room.png",
      price: t("roomPrice"),
      icon: <RoomIcon />,
      title: t("roomTitle"),
      desc: t("roomDesc"),
      explore: t("roomExplore"),
      href: "#contact",
    },
  ];

  return (
    <section
      id="villas"
      className="w-full bg-brand-cream py-20 md:py-0 md:min-h-screen flex flex-col justify-center text-brand-dark"
      aria-label="Handpicked Stays"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-12 md:py-20">
        {/* HEADER SECTION */}
        <div className="flex items-end justify-between mb-12 md:mb-16 gap-4">
          <div>
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-brand-gold uppercase block mb-2 select-none">
              {t("tagline")}
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-4.5xl font-serif font-normal text-brand-dark leading-tight tracking-wide">
              {t("heading")}
            </h2>
          </div>
          <a
            href="#stays"
            className="group flex items-center gap-1.5 text-[9px] md:text-xs font-bold tracking-widest text-brand-dark hover:text-brand-gold uppercase transition-colors duration-300 select-none border-b border-transparent hover:border-brand-gold pb-1 shrink-0"
          >
            <span>{t("viewAll")}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        {/* ACCOMMODATION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative w-full h-40 sm:h-48 md:h-auto md:aspect-[4/3] overflow-hidden bg-brand-cream-soft select-none">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  quality={85}
                />
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                {/* Price Overlay tag */}
                <div className="absolute bottom-4 right-4 bg-brand-dark/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-[11px] font-semibold tracking-wider shadow-sm z-20">
                  {card.price}
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="p-6 md:p-8 flex flex-col flex-grow items-start">
                {card.icon}
                <h3 className="text-xl font-serif font-normal text-brand-dark mb-2 tracking-wide">
                  {card.title}
                </h3>
                <p className="text-xs md:text-sm text-brand-dark/75 font-sans font-light leading-relaxed mb-6 flex-grow">
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
    </section>
  );
}
