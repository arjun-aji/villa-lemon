"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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

export default function Packages() {
  const t = useTranslations("Packages");

  const cards = [
    {
      img: "/assets/package_varkala.png",
      icon: <VarkalaIcon />,
      title: t("varkalaTitle"),
      desc: t("varkalaDesc"),
      explore: t("varkalaExplore"),
      href: "#contact",
    },
    {
      img: "/assets/package_daytrips.png",
      icon: <DayTripsIcon />,
      title: t("daytripsTitle"),
      desc: t("daytripsDesc"),
      explore: t("daytripsExplore"),
      href: "#contact",
    },
    {
      img: "/assets/package_houseboat.png",
      icon: <HouseboatIcon />,
      title: t("backwaterTitle"),
      desc: t("backwaterDesc"),
      explore: t("backwaterExplore"),
      href: "#contact",
    },
    {
      img: "/assets/package_adventure.png",
      icon: <AdventureIcon />,
      title: t("adventureTitle"),
      desc: t("adventureDesc"),
      explore: t("adventureExplore"),
      href: "#contact",
    },
  ];

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
              {t("tagline")}
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-4.5xl font-serif font-normal text-brand-dark leading-tight tracking-wide">
              {t("heading")}
            </h2>
          </div>
          <a
            href="#packages-list"
            className="group flex items-center gap-1.5 text-[9px] md:text-xs font-bold tracking-widest text-brand-dark hover:text-brand-gold uppercase transition-colors duration-300 select-none border-b border-transparent hover:border-brand-gold pb-1 shrink-0"
          >
            <span>{t("viewAll")}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        {/* PACKAGES CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              id={
                index === 0
                  ? "varkala-sightseeing"
                  : index === 1
                  ? "day-trips"
                  : index === 2
                  ? "backwater-experiences"
                  : "adventure-activities"
              }
              className="group flex flex-col bg-white border border-[#eae6db]/80 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 scroll-mt-24"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative w-full h-40 sm:h-48 md:h-auto md:aspect-[4/3] overflow-hidden bg-brand-cream-soft select-none">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  quality={80}
                />
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10" />
              </div>

              {/* CARD DETAILS */}
              <div className="p-5 md:p-6 flex flex-col flex-grow items-start">
                {card.icon}
                <h3 className="text-lg font-serif font-normal text-brand-dark mb-1.5 tracking-wide leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs md:text-sm text-brand-dark/75 font-sans font-light leading-relaxed mb-5 flex-grow">
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
