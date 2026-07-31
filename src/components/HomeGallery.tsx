"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";

interface HomeGalleryProps {
  data?: any[];
}

export default function HomeGallery({ data = [] }: HomeGalleryProps) {
  const t = useTranslations("Gallery");

  // Show up to 8 items as preview on the home page
  const previewItems = React.useMemo(() => {
    return (data || []).slice(0, 8);
  }, [data]);

  if (previewItems.length === 0) return null;

  return (
    <section
      id="gallery"
      className="w-full bg-[#fbf9f6] py-20 text-brand-dark"
      aria-label="Gallery Preview"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        
        {/* HEADER SECTION */}
        <div className="flex items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="text-left">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-brand-gold uppercase block mb-2 select-none">
              {t("subtitle") || "Moments & Memories"}
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-4.5xl font-serif font-normal text-brand-dark leading-tight tracking-wide">
              {t("title") || "Gallery"}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group flex items-center gap-1.5 text-[9px] md:text-xs font-bold tracking-widest text-brand-dark hover:text-brand-gold uppercase transition-colors duration-300 select-none border-b border-transparent hover:border-brand-gold pb-1 shrink-0"
          >
            <span>{t("viewAll") || "View All Gallery"}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        {/* PHOTO PREVIEW GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewItems.map((item, index) => (
            <Link
              key={item._id || index}
              href="/gallery"
              className="group relative aspect-[4/3] rounded-md overflow-hidden border border-[#eae6db]/60 shadow-xs cursor-pointer select-none"
            >
              <Image
                src={item.image}
                alt={item.caption?.en || "Villa Lemon Gallery Preview"}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                sizes="(max-w-768px) 50vw, 25vw"
              />
              {/* Subtle dark gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                {item.caption?.en && (
                  <p className="text-[9px] text-white/90 font-light truncate w-full text-left">
                    {item.caption.en}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
