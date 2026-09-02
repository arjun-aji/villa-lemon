"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Clock, MapPin, Sparkles, Percent, ChevronLeft, ChevronRight,
  Calendar, Phone, Shield, Key, Car, Award, Leaf
} from "lucide-react";
import { useBookingModal } from "@/context/BookingModalContext";

export interface MonthPricingItem {
  _id?: string;
  month: Record<string, string>;
  year?: string;
  startDate?: string;
  endDate?: string;
  regularPrice: number;
  discountedPrice?: number;
  discountPercentage?: string;
  availableSpots?: number;
  availabilityStatus?: "available" | "limited" | "sold_out";
  isFeatured?: boolean;
  bookingEnabled?: boolean;
}

export interface PromotionalOffer {
  enableOfferBanner?: boolean;
  badge?: Record<string, string>;
  title?: Record<string, string>;
  description?: Record<string, string>;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  bookingDeadline?: string;
  applicableMonths?: Record<string, string>;
  ctaText?: Record<string, string>;
}

export interface AdvancedPricingConfig {
  enabled?: boolean;
  currency?: string;
  priceDisplayLabel?: Record<string, string>;
  pricePeriodLabel?: Record<string, string>;
  footnoteText?: Record<string, string>;
  offer?: PromotionalOffer;
  monthlyPricing?: MonthPricingItem[];
}

export interface YogaRetreatPricingSectionProps {
  retreat: {
    _id: string;
    slug: string;
    days: number;
    nights: number;
    price: number;
    actualPrice?: number;
    heroTitle: Record<string, string>;
    heroSubtitle?: Record<string, string>;
    location?: Record<string, string>;
    yogaLevel?: Record<string, string>;
    groupSize?: Record<string, string>;
    difficulty?: Record<string, string>;
    featured?: boolean;
    isPopular?: boolean;
    bestTime?: Record<string, string>;
    deposit?: Record<string, string>;
    cancellation?: Record<string, string>;
    pickup?: Record<string, string>;
    heroImage?: string;
    images?: string[];
    advancedPricing?: AdvancedPricingConfig;
  };
  locale: string;
  contact?: {
    whatsapp?: string;
    phone?: string;
    email?: string;
  };
}

export default function YogaRetreatPricingSection({
  retreat,
  locale,
  contact,
}: YogaRetreatPricingSectionProps) {
  const { openModal } = useBookingModal();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Localization helper
  const loc = (field: any) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field["en"] || Object.values(field)[0] || "";
  };

  const adv = retreat.advancedPricing;
  const monthlyList: MonthPricingItem[] = useMemo(() => {
    return adv?.monthlyPricing || [];
  }, [adv]);

  // Determine initial selected month:
  // 1. Featured month if set and not sold out
  // 2. First available (not sold out) month
  // 3. First month in list
  const initialIndex = useMemo(() => {
    if (!monthlyList || monthlyList.length === 0) return -1;
    const featuredIdx = monthlyList.findIndex(
      (m) => m.isFeatured && m.availabilityStatus !== "sold_out" && m.bookingEnabled !== false
    );
    if (featuredIdx !== -1) return featuredIdx;

    const firstAvailableIdx = monthlyList.findIndex(
      (m) => m.availabilityStatus !== "sold_out" && m.bookingEnabled !== false
    );
    if (firstAvailableIdx !== -1) return firstAvailableIdx;

    return 0;
  }, [monthlyList]);

  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  useEffect(() => {
    if (initialIndex !== -1 && (selectedIndex === -1 || selectedIndex >= monthlyList.length)) {
      setSelectedIndex(initialIndex);
    }
  }, [initialIndex, monthlyList.length, selectedIndex]);

  // Selected month entry
  const selectedMonth: MonthPricingItem | undefined =
    selectedIndex >= 0 && selectedIndex < monthlyList.length
      ? monthlyList[selectedIndex]
      : undefined;

  // Filter out the selected month so it doesn't duplicate what is already displayed at the top!
  const otherMonths = useMemo(() => {
    return monthlyList
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ originalIndex }) => originalIndex !== selectedIndex);
  }, [monthlyList, selectedIndex]);

  // Starting lowest price calculation across all available months
  const lowestStartingPrice = useMemo(() => {
    if (!monthlyList || monthlyList.length === 0) return retreat.price || 0;
    const available = monthlyList.filter((m) => m.bookingEnabled !== false);
    if (available.length === 0) return retreat.price || 0;
    const prices = available.map((m) => m.discountedPrice || m.regularPrice);
    return Math.min(...prices);
  }, [monthlyList, retreat.price]);

  // Lowest regular price matching the starting price
  const lowestRegularPrice = useMemo(() => {
    if (!monthlyList || monthlyList.length === 0) return retreat.actualPrice;
    const matched = monthlyList.find(
      (m) => (m.discountedPrice || m.regularPrice) === lowestStartingPrice
    );
    if (matched && matched.discountedPrice && matched.regularPrice > matched.discountedPrice) {
      return matched.regularPrice;
    }
    return retreat.actualPrice && retreat.actualPrice > lowestStartingPrice ? retreat.actualPrice : undefined;
  }, [monthlyList, lowestStartingPrice, retreat.actualPrice]);

  // Check scroll bounds
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [monthlyList]);

  const scrollMonths = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -140 : 140;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Currency & labels
  const currencySymbol = adv?.currency || "USD";
  const formattedCurrency =
    currencySymbol === "USD" ? "$" :
    currencySymbol === "EUR" ? "€" :
    currencySymbol === "GBP" ? "£" :
    currencySymbol === "INR" ? "₹" :
    `${currencySymbol} `;

  const displayLabel = loc(adv?.priceDisplayLabel) || "Starting from";
  const periodLabel = loc(adv?.pricePeriodLabel) || "per person";
  const footnoteText = loc(adv?.footnoteText) || "Prices are per person • All prices in USD • Subject to availability";

  // Effective price to display at top right
  const currentEffectivePrice = selectedMonth
    ? (selectedMonth.discountedPrice || selectedMonth.regularPrice)
    : lowestStartingPrice;

  const currentRegularPrice = selectedMonth
    ? (selectedMonth.discountedPrice ? selectedMonth.regularPrice : undefined)
    : lowestRegularPrice;

  const isSoldOut = selectedMonth?.availabilityStatus === "sold_out";
  const isBookingDisabled = selectedMonth?.bookingEnabled === false || isSoldOut;

  // Selected month text
  const selectedMonthText = selectedMonth
    ? (loc(selectedMonth.month) || `${selectedMonth.year || ""}`)
    : "";

  const selectedDatesText = selectedMonth?.startDate
    ? `${selectedMonth.startDate} ${selectedMonth.endDate ? `– ${selectedMonth.endDate}` : ""}`
    : "";

  // WhatsApp Pre-filled message
  const retreatTitle = loc(retreat.heroTitle) || "Yoga Retreat";
  const whatsappNumber = (contact?.whatsapp || "+91 73560 85055").replace(/[^0-9]/g, "");
  const whatsappMessage = selectedMonth
    ? `Hi, I would like to book the ${retreatTitle} for ${selectedMonthText}${selectedDatesText ? ` (${selectedDatesText})` : ""}. Price: ${formattedCurrency}${currentEffectivePrice.toLocaleString()} per person.`
    : `Hi, I would like to book the retreat: ${retreatTitle}. Starting from ${formattedCurrency}${lowestStartingPrice.toLocaleString()} per person.`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Book Now modal context
  const bookingModalContext = selectedMonth
    ? `Retreat: ${retreatTitle} - ${selectedMonthText} (${formattedCurrency}${currentEffectivePrice.toLocaleString()}/person)`
    : `Retreat: ${retreatTitle} (${formattedCurrency}${lowestStartingPrice.toLocaleString()}/person)`;

  // Promotional offer configuration
  const offer = adv?.offer;
  const hasOffer = offer?.enableOfferBanner && (offer.title?.en || offer.description?.en || offer.badge?.en);

  return (
    <div id="pricing-section" className="bg-white border border-[#eae6db]/70 rounded-sm shadow-sm p-6 space-y-5 text-left font-sans select-text w-full">
      
      {/* ── TOP BADGES ROW ── */}
      <div className="flex items-center justify-between gap-2 select-none w-full">
        <span className="bg-[#f0f4ee] text-[#4a6b52] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#5e8b67]" />
          {retreat.days} DAYS / {retreat.nights} NIGHTS RETREAT
        </span>

        {(retreat.isPopular || retreat.featured) && (
          <span className="bg-[#c5a880] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-2xs inline-flex items-center gap-1">
            <Award className="w-3 h-3" /> BEST SELLER
          </span>
        )}
      </div>

      {/* ── PRICE ROW (Right aligned starting/selected price) ── */}
      <div className="flex items-baseline justify-between border-b border-gray-100 pb-4 w-full">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            {selectedMonth ? (loc(selectedMonth.month) || "Selected Month Price") : displayLabel}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            {periodLabel}
          </span>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            {currentRegularPrice && currentRegularPrice > currentEffectivePrice && (
              <span className="line-through text-gray-400 font-normal text-sm sm:text-base">
                {formattedCurrency}{currentRegularPrice.toLocaleString()}
              </span>
            )}
            <span className="text-2xl sm:text-3xl font-bold text-[#121212] tracking-tight">
              {formattedCurrency}{currentEffectivePrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2 METADATA CHIPS (Duration & Location) ── */}
      <div className="grid grid-cols-2 gap-3 select-none w-full">
        <div className="bg-[#faf8f4] border border-[#eae6db]/70 rounded-sm p-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white border border-[#eae6db] flex items-center justify-center text-brand-gold shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Duration</span>
            <span className="text-[11px] font-bold text-gray-800 block truncate">
              {retreat.days} Days / {retreat.nights} Nights
            </span>
          </div>
        </div>

        <div className="bg-[#faf8f4] border border-[#eae6db]/70 rounded-sm p-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white border border-[#eae6db] flex items-center justify-center text-brand-gold shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Location</span>
            <span className="text-[11px] font-bold text-gray-800 block truncate">
              {loc(retreat.location) || "Varkala, Kerala"}
            </span>
          </div>
        </div>
      </div>

      {/* ── PROMOTIONAL / DISCOUNT BANNER (Optional) ── */}
      {hasOffer && offer && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#eef7ee] via-[#f4faf4] to-[#eef7ee] border border-[#d2ebd2] rounded-sm p-3.5 flex items-center justify-between gap-3 shadow-2xs w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center text-emerald-800 shrink-0 font-bold">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-[11px] uppercase tracking-wide">
                {loc(offer.title) || "BOOK EARLY & SAVE MORE!"}
              </h4>
              {offer.description && (
                <p className="text-[10px] text-emerald-800 font-light mt-0.5 leading-snug">
                  {loc(offer.description)}
                </p>
              )}
            </div>
          </div>

          {offer.badge && (
            <div className="shrink-0">
              <span className="bg-[#245b32] text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-2xs uppercase tracking-wider">
                {loc(offer.badge)}
              </span>
            </div>
          )}

          {/* Subtle leaf icon */}
          <div className="absolute -bottom-2 -right-2 opacity-15 pointer-events-none">
            <Leaf className="w-12 h-12 text-emerald-800" />
          </div>
        </div>
      )}

      {/* ── MONTH SELECTOR: "Choose Your Preferred Month" (Shows only other months) ── */}
      {otherMonths.length > 0 && (
        <div className="space-y-2.5 w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-serif text-sm font-normal text-gray-900 tracking-wide">
              Choose Your Preferred Month
            </h3>

            {/* Scroll navigation buttons */}
            <div className="flex items-center gap-1 select-none">
              <button
                type="button"
                onClick={() => scrollMonths("left")}
                disabled={!canScrollLeft}
                className="w-6 h-6 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-gray-700 shadow-2xs transition-all cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollMonths("right")}
                disabled={!canScrollRight}
                className="w-6 h-6 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-gray-700 shadow-2xs transition-all cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Month Cards Scrollable Row */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-2.5 overflow-x-auto pb-1 scroll-smooth no-scrollbar select-none w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {otherMonths.map(({ item, originalIndex }) => {
              const isItemSoldOut = item.availabilityStatus === "sold_out";
              const itemEffectivePrice = item.discountedPrice || item.regularPrice;
              const hasDiscount = Boolean(
                item.discountedPrice && item.discountedPrice < item.regularPrice
              );

              return (
                <div
                  key={item._id || originalIndex}
                  onClick={() => {
                    if (!isItemSoldOut) {
                      setSelectedIndex(originalIndex);
                    }
                  }}
                  className={`w-[115px] min-w-[115px] max-w-[130px] shrink-0 rounded-sm p-2.5 flex flex-col justify-between text-center transition-all duration-200 border-2 cursor-pointer ${
                    isItemSoldOut
                      ? "border-gray-200 bg-gray-50/80 opacity-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-emerald-700/60 bg-white hover:shadow-xs"
                  }`}
                >
                  {/* Month Name */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-800">
                      {loc(item.month) || `Month ${originalIndex + 1}`}
                    </h4>

                    {/* Discount Badge */}
                    <div className="min-h-[18px] flex items-center justify-center my-0.5">
                      {item.discountPercentage ? (
                        <span className="bg-[#245b32] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                          {item.discountPercentage}
                        </span>
                      ) : hasDiscount ? (
                        <span className="bg-[#245b32] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                          SAVE {Math.round(((item.regularPrice - (item.discountedPrice || 0)) / item.regularPrice) * 100)}%
                        </span>
                      ) : null}
                    </div>

                    {/* Strikethrough & Effective Price */}
                    <div className="my-0.5">
                      {hasDiscount && (
                        <span className="line-through text-gray-400 text-[9px] font-normal block leading-tight">
                          {formattedCurrency}{item.regularPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-sm sm:text-base font-bold text-[#121212] block tracking-tight">
                        {formattedCurrency}{itemEffectivePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Availability / Spots Indicator */}
                  <div className="pt-1 border-t border-gray-150 mt-1">
                    {isItemSoldOut ? (
                      <span className="text-[8px] font-bold text-red-600 uppercase tracking-wider block">
                        SOLD OUT
                      </span>
                    ) : item.availableSpots !== undefined && item.availableSpots > 0 ? (
                      <span className="text-[8px] font-bold text-[#b45309] tracking-wider block truncate">
                        {item.availableSpots <= 3 ? `Only ${item.availableSpots} Spots` : `${item.availableSpots} Spots Left`}
                      </span>
                    ) : item.availabilityStatus === "limited" ? (
                      <span className="text-[8px] font-bold text-[#b45309] tracking-wider block">
                        Limited Spots
                      </span>
                    ) : (
                      <span className="text-[8px] font-medium text-emerald-700 tracking-wider block">
                        Available
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FOOTNOTE STRIP ── */}
      <div className="bg-[#faf8f4] border border-[#eae6db]/80 rounded-sm py-2 px-3 text-center text-[10px] text-gray-600 font-medium flex items-center justify-center gap-1.5 select-none w-full">
        <Calendar className="w-3.5 h-3.5 text-brand-gold shrink-0" />
        <span>{footnoteText}</span>
      </div>

      {/* ── BOOKING ACTION BUTTONS ── */}
      <div className="space-y-2 pt-1 select-none w-full">
        {/* WhatsApp Booking Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold uppercase tracking-wider text-[11px] py-3 rounded-sm shadow-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 fill-white" />
          <span>WHATSAPP BOOKING</span>
        </a>

        {/* Book Now Button */}
        <button
          type="button"
          disabled={isBookingDisabled}
          onClick={() => {
            if (!isBookingDisabled) {
              openModal(bookingModalContext);
            }
          }}
          className={`w-full font-bold uppercase tracking-wider text-[11px] py-3 rounded-sm shadow-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.99] ${
            isBookingDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
              : "bg-[#121212] hover:bg-black text-white cursor-pointer border border-black"
          }`}
        >
          {isSoldOut ? "SOLD OUT FOR SELECTED MONTH" : "BOOK NOW"}
        </button>
      </div>

      {/* ── POLICY INFORMATION STRIP (3 Columns) ── */}
      <div className="border-t border-[#eae6db] pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10px] text-left w-full">
        {/* Deposit */}
        <div className="flex items-start gap-1.5">
          <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0 font-bold mt-0.5">
            <Key className="w-2.5 h-2.5" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-gray-900 block text-[8.5px]">
              DEPOSIT:
            </span>
            <p className="text-gray-500 font-light mt-0.5 leading-snug text-[9.5px]">
              {loc(retreat.deposit) || "30% deposit required."}
            </p>
          </div>
        </div>

        {/* Cancellation */}
        <div className="flex items-start gap-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shrink-0 font-bold mt-0.5">
            <Shield className="w-2.5 h-2.5" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-gray-900 block text-[8.5px]">
              CANCELLATION:
            </span>
            <p className="text-gray-500 font-light mt-0.5 leading-snug text-[9.5px]">
              {loc(retreat.cancellation) || "Free up to 14 days."}
            </p>
          </div>
        </div>

        {/* Airport Pickup */}
        <div className="flex items-start gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0 font-bold mt-0.5">
            <Car className="w-2.5 h-2.5" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-gray-900 block text-[8.5px]">
              AIRPORT PICK-UP:
            </span>
            <p className="text-gray-500 font-light mt-0.5 leading-snug text-[9.5px]">
              {loc(retreat.pickup) || "On request."}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
