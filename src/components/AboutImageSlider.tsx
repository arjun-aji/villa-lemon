"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AboutImageSliderProps {
  images?: string[];
  defaultImage: string;
  alt?: string;
  className?: string;
}

export default function AboutImageSlider({
  images = [],
  defaultImage,
  alt = "Detail Photo",
  className = "object-cover",
}: AboutImageSliderProps) {
  const allImages = React.useMemo(() => {
    const list = (images || []).filter(Boolean);
    if (list.length === 0 && defaultImage) {
      list.push(defaultImage);
    }
    return list;
  }, [images, defaultImage]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  if (allImages.length === 0) {
    return <div className="w-full h-full bg-brand-dark/20" />;
  }

  if (allImages.length === 1) {
    return (
      <Image
        src={allImages[0]}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={className}
        priority
      />
    );
  }

  return (
    <div className="relative w-full h-full group/slider select-none">
      {allImages.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src + index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={className}
            />
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors z-20"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-[2px]">
        {allImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCurrentIndex(i);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
