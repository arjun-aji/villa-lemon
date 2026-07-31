"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Camera, 
  Home, 
  Compass, 
  Utensils, 
  Trees, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Grid
} from "lucide-react";

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export interface GalleryItemType {
  id: string;
  image: string;
  category: string;
  caption: string;
  displayOrder: number;
}

interface GalleryClientProps {
  items: GalleryItemType[];
  locale: string;
  translations: Record<string, string>;
}

export default function GalleryClient({ items, locale, translations }: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Categories list definition matching mockup icons & identifiers
  const categories = useMemo(() => [
    { id: "all", label: translations.allPhotos, icon: <Grid className="w-4 h-4" /> },
    { id: "villa-accommodation", label: translations.villaAccommodation, icon: <Home className="w-4 h-4" /> },
    { id: "yoga-wellness", label: translations.yogaWellness, icon: <Compass className="w-4 h-4" /> },
    { id: "experiences-tours", label: translations.experiencesTours, icon: <Compass className="w-4 h-4" /> },
    { id: "food-dining", label: translations.foodDining, icon: <Utensils className="w-4 h-4" /> },
    { id: "nature-surroundings", label: translations.natureSurroundings, icon: <Trees className="w-4 h-4" /> },
    { id: "events-culture", label: translations.eventsCulture, icon: <Sparkles className="w-4 h-4" /> },
  ], [translations]);

  // Compute number of photos in each category for overlay badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filter items based on active category tab
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.6 : clientWidth * 0.6;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    let nextIndex = direction === "prev" ? lightboxIndex - 1 : lightboxIndex + 1;
    if (nextIndex < 0) {
      nextIndex = filteredItems.length - 1;
    } else if (nextIndex >= filteredItems.length) {
      nextIndex = 0;
    }
    setLightboxIndex(nextIndex);
  };

  // Listen for escape and arrow keys when lightbox is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "ArrowRight") navigateLightbox("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-32 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
        {/* Text Area */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <h1 className="font-serif text-5xl sm:text-6.5xl font-normal text-[#0f2c1b] tracking-wide mb-3">
            {translations.title}
          </h1>
          {/* Elegant gold separator flourish */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-12 h-0.5 bg-brand-gold/60" />
            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <div className="w-12 h-0.5 bg-brand-gold/60" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-dark/85 font-normal mb-4 tracking-wide leading-tight">
            {translations.subtitle}
          </h2>
          <p className="text-sm font-sans font-light text-gray-500 leading-relaxed max-w-lg select-text">
            {translations.description}
          </p>
        </div>

        {/* Softly blended oval image wrapper */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end select-none">
          <div className="relative w-full max-w-[500px] aspect-[14/10] overflow-hidden rounded-[80px_20px_80px_20px] md:rounded-[120px_30px_120px_30px] border border-brand-gold/10 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
              alt="Villa Lemon Garden Inspiration"
              fill
              className="object-cover scale-[1.02] hover:scale-[1.05] transition-transform duration-700 ease-out"
              priority
            />
            {/* Edge soft fade vignettes */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#fbf9f6]/20 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS SELECTOR */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-10 overflow-x-auto select-none no-scrollbar flex items-center justify-start lg:justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shrink-0 ${
              activeCategory === cat.id
                ? "bg-[#0f2c1b] border-[#0f2c1b] text-white shadow-md"
                : "bg-white border-[#eae6db]/80 text-gray-600 hover:border-brand-gold/50 hover:text-brand-dark"
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </section>

      {/* 3. MASONRY PHOTO GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full select-none min-h-[400px]">
        {filteredItems.length === 0 ? (
          <div className="w-full py-24 text-center text-gray-400 bg-white border border-[#eae6db]/80 rounded-md shadow-xs">
            <Camera className="w-8 h-8 text-brand-gold/40 mx-auto mb-3" />
            <p className="text-sm font-medium">No photos found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredItems.map((item, idx) => {
              // Find matching category object labels for display tag
              const catObj = categories.find(c => c.id === item.category);
              const totalPhotos = categoryCounts[item.category] || 0;
              return (
                <div
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative aspect-[4/3] rounded-md overflow-hidden border border-[#eae6db]/60 shadow-xs cursor-pointer select-none"
                >
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    sizes="(max-w-768px) 100vw, 33vw"
                  />
                  
                  {/* Subtle dark gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
                  
                  {/* Mockup Overlay Tag (Bottom Left) */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start transition-transform duration-500 group-hover:translate-y-[-2px]">
                    <div className="flex items-center gap-2 bg-[#051c0e]/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10 text-white shadow-lg">
                      {catObj ? catObj.icon : <Camera className="w-3.5 h-3.5" />}
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
                          {catObj?.label || item.category}
                        </span>
                        <span className="text-[8px] text-white/70 font-light mt-0.5 leading-none">
                          {totalPhotos} {translations.photosLabel}
                        </span>
                      </div>
                    </div>
                    {item.caption && (
                      <span className="text-[10px] text-white/95 font-medium mt-2.5 px-1 leading-snug line-clamp-1 select-text">
                        {item.caption}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. RESPONSIVE THUMBNAILS CAROUSEL / SLIDER */}
      {items.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-16 select-none relative">
          <div className="flex items-center justify-between mb-6 select-none">
            <h3 className="font-serif text-lg font-normal text-brand-dark tracking-wide">
              {translations.allPhotos}
            </h3>
            {/* Scroll navigation arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollSlider("left")}
                disabled={!canScrollLeft}
                className="w-8 h-8 rounded-full border border-[#eae6db] bg-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-gray-700 hover:border-brand-gold active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                disabled={!canScrollRight}
                className="w-8 h-8 rounded-full border border-[#eae6db] bg-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-gray-700 hover:border-brand-gold active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="w-full flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item, idx) => (
              <div
                key={`thumb-${item.id}`}
                onClick={() => {
                  // Find index in filteredItems matching this item
                  const filterIdx = filteredItems.findIndex(fi => fi.id === item.id);
                  if (filterIdx !== -1) {
                    openLightbox(filterIdx);
                  } else {
                    setActiveCategory("all");
                    const allIdx = items.findIndex(i => i.id === item.id);
                    openLightbox(allIdx !== -1 ? allIdx : 0);
                  }
                }}
                className="snap-start shrink-0 w-28 h-20 relative rounded-md overflow-hidden border border-[#eae6db]/80 cursor-pointer hover:border-brand-gold/80 transition-colors"
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. FOOTER INSTAGRAM BANNER */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-20 mb-10 select-none">
        <div className="w-full bg-[#fbf9f5] border border-[#eae6db] p-8 md:p-10 rounded-md shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-[#0f2c1b]/10 flex items-center justify-center rounded-full text-[#0f2c1b]">
              <InstagramIcon className="w-5 h-5 text-[#0f2c1b]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold tracking-wide text-brand-dark">
                {translations.shareTitle}
              </h4>
              <p className="text-[11px] text-gray-500 font-light mt-1 leading-relaxed max-w-md select-text">
                {translations.shareSub}
              </p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/villalemon.varkala"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#0f2c1b] hover:bg-[#07160d] text-white font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shrink-0 select-none shadow-sm flex items-center gap-2"
          >
            <InstagramIcon className="w-3.5 h-3.5 fill-white text-[#0f2c1b]" />
            <span>{translations.followInsta}</span>
          </a>
        </div>
      </section>

      {/* LIGHTBOX POPUP MODAL (Fullscreen Overlay) */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-100 bg-black/95 flex flex-col items-center justify-center select-none animate-fade-in">
          {/* Top Info Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white/90 z-10">
            <span className="text-xs tracking-wider uppercase font-semibold font-sans">
              {lightboxIndex + 1} / {filteredItems.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2 text-white/70 hover:text-white cursor-pointer transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav arrow buttons */}
          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-4 p-4 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all active:scale-95 cursor-pointer z-10"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-4 p-4 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all active:scale-95 cursor-pointer z-10"
            aria-label="Next Image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Main Active Image container */}
          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center px-8">
            <Image
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].caption || "Villa Lemon Gallery Image"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Caption Bar (Bottom) */}
          {filteredItems[lightboxIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white/90 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-sm font-sans font-light leading-relaxed select-text max-w-xl mx-auto">
                {filteredItems[lightboxIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
