"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";

interface RetreatGalleryClientProps {
  images: string[];
}

export default function RetreatGalleryClient({ images }: RetreatGalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Close lightbox on ESC, navigate on arrow keys
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="font-serif text-xl text-[#121212] mb-6 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-brand-gold" />
        Retreat Photo Gallery
      </h3>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className="group relative aspect-[4/3] rounded-sm overflow-hidden border border-[#eae6db]/60 bg-[#121212] cursor-pointer shadow-sm hover:shadow-md transition-shadow select-none"
          >
            <img
              src={img}
              alt={`Gallery image ${idx + 1}`}
              className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 ease-out"
              loading="lazy"
            />
            {/* Hover overlay with zoom icon/subtle overlay */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] text-white font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 scale-95 group-hover:scale-100 transition-transform duration-300">
                View Full
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {activeIndex !== null && (
        <div
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center select-none animate-fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[1000] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
            }}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-[1000] cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image display */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[85vh] md:max-w-[80vw] flex flex-col items-center gap-3"
          >
            <img
              src={images[activeIndex]}
              alt={`Gallery image full ${activeIndex + 1}`}
              className="object-contain max-w-full max-h-[80vh] rounded-sm shadow-2xl select-text"
            />
            <span className="text-[11px] text-white/60 font-semibold tracking-wider uppercase bg-black/40 px-3 py-1 rounded-full border border-white/5">
              Image {activeIndex + 1} of {images.length}
            </span>
          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-[1000] cursor-pointer"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
