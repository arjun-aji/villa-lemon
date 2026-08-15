"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface TourGalleryClientProps {
  images: string[];
  title?: string;
}

export default function TourGalleryClient({ images, title = "Tour Gallery" }: TourGalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const showBlurOverlay = images.length > 6 && !isExpanded;
  const visibleImages = showBlurOverlay ? images.slice(0, 6) : images;
  const remainingCount = images.length - 5; // since 6th is blurred, 5 are fully visible

  const handleImageClick = (idx: number) => {
    if (showBlurOverlay && idx === 5) {
      setIsExpanded(true);
    } else {
      setActiveIndex(idx);
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-serif text-2xl font-normal text-[#121212] mb-6">
        {title}
      </h3>

      {/* Grid Layout: 3 in a row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {visibleImages.map((img, idx) => {
          const isBlurSlot = showBlurOverlay && idx === 5;
          return (
            <div
              key={idx}
              onClick={() => handleImageClick(idx)}
              className="group relative aspect-video rounded-sm overflow-hidden border border-[#eae6db]/40 bg-[#121212] cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 select-none"
            >
              <img
                src={img}
                alt={`Tour image ${idx + 1}`}
                className={`object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-all duration-500 ease-out ${
                  isBlurSlot ? "blur-[2px] scale-105" : "group-hover:scale-[1.03]"
                }`}
                loading="lazy"
              />

              {isBlurSlot ? (
                // Blurred 6th image overlay
                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-center p-4 transition-colors group-hover:bg-black/50">
                  <span className="text-xl sm:text-2xl font-serif font-semibold text-white mb-1">
                    +{remainingCount}
                  </span>
                  <span className="text-[10px] sm:text-xs text-brand-gold font-bold uppercase tracking-widest border-b border-brand-gold/30 pb-0.5">
                    Show All
                  </span>
                </div>
              ) : (
                // Normal hover overlay with zoom icon/text
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 scale-95 group-hover:scale-100 transition-transform duration-300">
                    View Photo
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show Less toggle if expanded */}
      {isExpanded && images.length > 6 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsExpanded(false)}
            className="text-[10px] text-gray-500 hover:text-brand-gold font-bold uppercase tracking-widest border border-[#eae6db] hover:border-brand-gold/30 px-3 py-1.5 rounded-sm transition-colors duration-300 cursor-pointer"
          >
            Show Less
          </button>
        </div>
      )}

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
              alt={`Tour image full ${activeIndex + 1}`}
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
