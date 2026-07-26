"use client";

import React from "react";
import { Bed, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const YogaIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-brand-gold w-5 h-5 md:w-6 h-6"
  >
    {/* Head */}
    <circle cx="12" cy="6" r="2" />
    
    {/* Body / spine */}
    <path d="M12 8v7" />
    
    {/* Arms curving down to knees (mudra) */}
    <path d="M12 10c-3 0-5 2.5-5 5.5" />
    <path d="M12 10c3 0 5 2.5 5 5.5" />
    
    {/* Hands/knees circles/nodes */}
    <circle cx="7" cy="15.5" r="0.75" fill="currentColor" />
    <circle cx="17" cy="15.5" r="0.75" fill="currentColor" />
    
    {/* Crossed legs / base */}
    <path d="M5 19c2-1.5 12-1.5 14 0" />
    <path d="M8 17c2-1 6-1 8 0" />
  </svg>
);

interface HighlightItem {
  icon: React.ReactNode;
  titleKey: string;
  subtitleKey: string;
}

interface HighlightsBarProps {
  data?: {
    premiumVillasTitle?: string;
    premiumVillasSubtitle?: string;
    greatLocationsTitle?: string;
    greatLocationsSubtitle?: string;
    wellnessTitle?: string;
    wellnessSubtitle?: string;
  };
}

export default function HighlightsBar({ data }: HighlightsBarProps) {
  const t = useTranslations("HighlightsBar");

  const list = [
    {
      icon: <Bed className="w-5 h-5 md:w-6 h-6 text-brand-gold stroke-[1.5]" />,
      title: data?.premiumVillasTitle || t("premiumVillasTitle"),
      subtitle: data?.premiumVillasSubtitle || t("premiumVillasSubtitle"),
    },
    {
      icon: <MapPin className="w-5 h-5 md:w-6 h-6 text-brand-gold stroke-[1.5]" />,
      title: data?.greatLocationsTitle || t("greatLocationsTitle"),
      subtitle: data?.greatLocationsSubtitle || t("greatLocationsSubtitle"),
    },
    {
      icon: <YogaIcon />,
      title: data?.wellnessTitle || t("wellnessTitle"),
      subtitle: data?.wellnessSubtitle || t("wellnessSubtitle"),
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-0 md:gap-px border-0 md:border border-brand-cream/10 rounded-none md:rounded-lg overflow-hidden backdrop-blur-none md:backdrop-blur-md bg-transparent md:bg-[#121212]/35 shadow-none md:shadow-2xl divide-x divide-brand-cream/10 md:divide-x-0">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-2 md:p-6 bg-transparent md:bg-[#121212]/45 md:flex-row md:items-center md:text-left gap-2 md:gap-4 hover:bg-transparent md:hover:bg-[#121212]/60 transition-all duration-300 group cursor-default"
          >
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-transparent md:bg-brand-gold/5 border border-brand-gold/60 md:border-brand-gold/15 group-hover:border-brand-gold/40 md:group-hover:border-brand-gold/40 transition-all duration-500 shrink-0">
              {item.icon}
            </div>
            <div className="flex flex-col mt-2 md:mt-0 select-none">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-wider text-brand-cream uppercase leading-tight md:leading-normal">
                {item.title}
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[11px] tracking-wider text-brand-cream/50 mt-0.5 md:mt-1 font-medium font-sans">
                {item.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
