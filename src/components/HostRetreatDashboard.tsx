"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { 
  Home, 
  Coffee, 
  Car, 
  Send, 
  Copy, 
  Users, 
  User, 
  Check, 
  CheckCircle, 
  Sparkles,
  Utensils,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  HelpCircle,
  Menu,
  ChevronRight,
  Info
} from "lucide-react";

interface RoomInfo {
  id: string;
  phase: 1 | 2;
  floor: "Ground Floor" | "First Floor";
  number: string;
  category: string;
  balcony: string;
  beds: string;
  bedOptions: ("1 Large Bed" | "2 Single Beds")[];
  wardrobe: string;
  bathroom: string;
  hotWater: string;
  notes?: string;
  ac: boolean;
  photoLink: string;
}

const ROOMS_DATA: RoomInfo[] = [
  { id: "101", phase: 1, floor: "Ground Floor", number: "101", category: "Double Room Ground Floor", balcony: "No (garden-view window)", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Closed Type", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: false, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6" },
  { id: "102", phase: 1, floor: "Ground Floor", number: "102", category: "Double Room Ground Floor", balcony: "Small private balcony", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Not available", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: false, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6" },
  { id: "103", phase: 1, floor: "First Floor", number: "103", category: "Deluxe Room With Balcony", balcony: "Yes", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Closed Type", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: false, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6" },
  { id: "104", phase: 1, floor: "First Floor", number: "104", category: "Deluxe Room With Balcony", balcony: "Yes", beds: "1 large bed (6 ft × 6 ft) or 2 single beds", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Open Type", bathroom: "Attached", hotWater: "Geyser system (direct shower)", ac: false, photoLink: "https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6" },
  { id: "105", phase: 2, floor: "Ground Floor", number: "105", category: "Standard Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/4rrQpirgHdyzojZj8" },
  { id: "106", phase: 2, floor: "Ground Floor", number: "106", category: "Standard Room (Teacher/Single)", balcony: "No", beds: "Single Large Bed (Non-Separable)", bedOptions: ["1 Large Bed"], wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", notes: "Recommended for Teacher Accommodation or Single Occupancy", ac: true, photoLink: "https://photos.app.goo.gl/4rrQpirgHdyzojZj8" },
  { id: "107", phase: 2, floor: "Ground Floor", number: "107", category: "Standard Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/4rrQpirgHdyzojZj8" },
  { id: "108", phase: 2, floor: "First Floor", number: "108", category: "Deluxe Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/YXZy5o9WXxmJwohd6" },
  { id: "109", phase: 2, floor: "First Floor", number: "109", category: "Deluxe Room with Balcony", balcony: "Private Balcony", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/YXZy5o9WXxmJwohd6" },
  { id: "110", phase: 2, floor: "First Floor", number: "110", category: "Deluxe Room", balcony: "No", beds: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)", bedOptions: ["1 Large Bed", "2 Single Beds"], wardrobe: "Closed Wardrobe", bathroom: "Attached", hotWater: "Geyser System", ac: true, photoLink: "https://photos.app.goo.gl/YXZy5o9WXxmJwohd6" },
];

export default function HostRetreatDashboard({ locale, whatsappNumber, dbConfig }: { locale: string; whatsappNumber?: string; dbConfig?: any }) {
  const rawT = useTranslations("HostRetreat");

  const t = (key: string, values?: any): string => {
    const val = dbConfig?.[key]?.[locale] || dbConfig?.[key]?.en;
    if (val) return val;
    try {
      if (values) {
        return rawT(key, values);
      }
      return rawT.raw(key) as string;
    } catch {
      try {
        return rawT.raw(key) as string;
      } catch {
        return key;
      }
    }
  };

  const getFloorText = (floor: string) => {
    if (floor === "Ground Floor") return t("phase1FloorGround");
    if (floor === "First Floor") return t("phase1FloorFirst");
    return floor;
  };

  const getCategoryText = (cat: string) => {
    if (cat.includes("Standard Room")) {
      if (cat.includes("Teacher/Single")) return t("roomCategoryTeacher");
      return t("roomCategoryStandard");
    }
    if (cat.includes("Deluxe Room")) {
      if (cat.includes("Balcony") || cat.includes("With Balcony")) return t("roomCategoryDeluxeBalcony");
      return t("roomCategoryDeluxe");
    }
    if (cat.includes("Double Room")) {
      return t("roomCategoryStandard");
    }
    return cat;
  };

  const getBalconyText = (balcony: string) => {
    if (balcony === "No (garden-view window)") return t("noBalcony");
    if (balcony === "Small private balcony") return t("smallBalcony");
    if (balcony === "Yes" || balcony === "Private Balcony") return t("hasBalcony");
    if (balcony === "No") return t("noBalcony");
    return balcony;
  };

  // Navigation / Tabs inside the planner
  const [activeStep, setActiveStep] = useState<"accommodations" | "meals" | "logistics" | "summary">("accommodations");

  // Accommodations State
  const [selectedRooms, setSelectedRooms] = useState<Record<string, boolean>>({
    "101": false, "102": false, "103": false, "104": false, // Phase 1
    "105": false, "106": false, "107": false, "108": false, "109": false, "110": false // Phase 2
  });

  const [roomOccupancy, setRoomOccupancy] = useState<Record<string, "single" | "shared">>({
    "101": "shared", "102": "shared", "103": "shared", "104": "shared",
    "105": "shared", "106": "single", "107": "shared", "108": "shared", "109": "shared", "110": "shared"
  });

  const [roomBedConfig, setRoomBedConfig] = useState<Record<string, "1 Large Bed" | "2 Single Beds">>({
    "101": "1 Large Bed", "102": "1 Large Bed", "103": "1 Large Bed", "104": "1 Large Bed",
    "105": "1 Large Bed", "106": "1 Large Bed", "107": "1 Large Bed", "108": "1 Large Bed", "109": "1 Large Bed", "110": "1 Large Bed"
  });

  // Meals State
  const [mealOption, setMealOption] = useState<"none" | "breakfast" | "full">("full");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [customMealsRequest, setCustomMealsRequest] = useState(false);

  // Logistics State
  const [smallCarCount, setSmallCarCount] = useState(0);
  const [bigCarCount, setBigCarCount] = useState(0);
  const [tempoTravellerCount, setTempoTravellerCount] = useState(0);
  
  // Yoga Hall Sessions State
  const [yogaSessionsPerDay, setYogaSessionsPerDay] = useState(2);
  const [customYogaRequirements, setCustomYogaRequirements] = useState("");

  // Copy status
  const [copied, setCopied] = useState(false);

  // Calculation helpers
  const stats = useMemo(() => {
    let participantCount = 0;
    let selectedCount = 0;
    let phase1Count = 0;
    let phase2Count = 0;

    ROOMS_DATA.forEach(room => {
      if (selectedRooms[room.id]) {
        selectedCount++;
        if (room.phase === 1) phase1Count++;
        else phase2Count++;

        if (room.id === "106") {
          participantCount += 1; // Room 106 is single-only
        } else {
          participantCount += roomOccupancy[room.id] === "shared" ? 2 : 1;
        }
      }
    });

    return {
      participants: participantCount,
      totalRooms: selectedCount,
      phase1Rooms: phase1Count,
      phase2Rooms: phase2Count
    };
  }, [selectedRooms, roomOccupancy]);

  // Generate Inquiry Proposal text
  const proposalText = useMemo(() => {
    const lines: string[] = [];
    lines.push(t("inquiryTemplateTitle"));
    lines.push(t("inquiryTemplateDates"));
    lines.push(t("inquiryTemplateParticipants").replace("{count}", String(stats.participants)));
    lines.push(t("inquiryTemplateRooms").replace("{count}", String(stats.totalRooms)));
    lines.push(t("inquiryTemplatePhase1").replace("{count}", String(stats.phase1Rooms)));
    lines.push(t("inquiryTemplatePhase2").replace("{count}", String(stats.phase2Rooms)));
    lines.push("");
    lines.push(t("inquiryTemplateRoomAllocation"));
    
    ROOMS_DATA.forEach(room => {
      if (selectedRooms[room.id]) {
        const occKey = room.id === "106" 
          ? "inquiryTemplateSingleOccupancy" 
          : (roomOccupancy[room.id] === "shared" 
            ? "inquiryTemplateSharedOccupancy" 
            : "inquiryTemplateSingleGuest");
        
        const occStr = t(occKey);
        
        let bedStr: string = roomBedConfig[room.id];
        if (bedStr === "1 Large Bed") {
          bedStr = t("oneLargeBed");
        } else if (bedStr === "2 Single Beds") {
          bedStr = t("twoSingleBeds");
        }
        
        let catStr = getCategoryText(room.category);

        lines.push(
          t("inquiryTemplateRoomDetail")
            .replace("{number}", room.number)
            .replace("{category}", catStr)
            .replace("{occupancy}", occStr)
            .replace("{bed}", bedStr)
        );
      }
    });
    
    lines.push("");
    lines.push(t("inquiryTemplateMealPreferences"));
    if (mealOption === "full") {
      lines.push(t("inquiryTemplateMealFull"));
    } else if (mealOption === "breakfast") {
      lines.push(t("inquiryTemplateMealBreakfast"));
    } else {
      lines.push(t("inquiryTemplateMealNone"));
    }
    if (dietaryNotes.trim()) {
      lines.push(t("inquiryTemplateDietaryNotes").replace("{notes}", dietaryNotes));
    }
    if (customMealsRequest) {
      lines.push(t("inquiryTemplateCustomMenu"));
    }

    lines.push("");
    lines.push(t("inquiryTemplateLogistics"));
    const vehicles: string[] = [];
    if (smallCarCount > 0) vehicles.push(`${smallCarCount}x ${t("carSmallLabel")}`);
    if (bigCarCount > 0) vehicles.push(`${bigCarCount}x ${t("carLargeLabel")}`);
    if (tempoTravellerCount > 0) vehicles.push(`${tempoTravellerCount}x ${t("tempoLabel")}`);
    
    if (vehicles.length > 0) {
      lines.push(t("inquiryTemplateTransfers"));
      vehicles.forEach(v => lines.push(`    - ${v}`));
    } else {
      lines.push(t("inquiryTemplateNoTransfers"));
    }

    lines.push("");
    lines.push("🧘 YOGA FACILITIES:");
    lines.push(`  • ${t("inquiryTemplateYogaSessions").replace("{count}", String(yogaSessionsPerDay))}`);
    if (customYogaRequirements.trim()) {
      lines.push(t("inquiryTemplateCustomYoga").replace("{notes}", customYogaRequirements));
    }
    lines.push("");
    lines.push(t("inquiryTemplateTncFooter"));
    lines.push(t("inquiryTemplateConfirmTnc"));
    lines.push(`  • Signature: ${t("inquiryTemplateSignature")}`);
    lines.push("");
    lines.push(t("inquiryTemplateCopyPrompt"));
    
    return lines.join("\n");
  }, [stats, selectedRooms, roomOccupancy, roomBedConfig, mealOption, dietaryNotes, customMealsRequest, smallCarCount, bigCarCount, tempoTravellerCount, yogaSessionsPerDay, customYogaRequirements, t]);

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  // Handle Send WhatsApp Inquiry
  const handleWhatsApp = () => {
    const defaultPhone = "917356085055";
    const phone = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, "") : defaultPhone;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(proposalText)}`;
    window.open(url, "_blank");
  };

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };

  const setOccupancy = (roomId: string, occ: "single" | "shared") => {
    setRoomOccupancy(prev => ({
      ...prev,
      [roomId]: occ
    }));
  };

  const setBedConfig = (roomId: string, config: "1 Large Bed" | "2 Single Beds") => {
    setRoomBedConfig(prev => ({
      ...prev,
      [roomId]: config
    }));
  };

  return (
    <div className="w-full text-[#121212] select-text">
      
      {/* INTRO INTRODUCTION SECTION */}
      <section className="bg-white border-b border-[#eae6db]/60 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 block">
              {t("retreatVenue")}
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-normal text-brand-dark tracking-wide leading-tight">
              {t("hostTitle")}
            </h2>
            <div className="w-16 h-[1.5px] bg-brand-gold mx-auto mt-4 mb-5" />
            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              {t("hostIntro")}
            </p>
          </div>

          {/* PROPERTY FEATURES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Home className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">{t("roomsFeatureTitle")}</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {t("roomsFeatureDesc")}
              </p>
            </div>
            
            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">{t("hallFeatureTitle")}</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {t("hallFeatureDesc")}
              </p>
            </div>

            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Utensils className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">{t("mealsFeatureTitle")}</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {t("mealsFeatureDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PLANNING WIZARD SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        
        {/* DASHBOARD PANEL WRAPPER */}
        <div className="bg-white border border-[#eae6db] rounded-sm shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          
          {/* LEFT SIDE: STEP NAVIGATION & LIVE SUMMARY WIDGET */}
          <div className="lg:col-span-4 bg-[#fbf9f6] border-r border-[#eae6db] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <span className="font-serif text-sm font-semibold tracking-wider text-brand-dark uppercase">
                  {t("plannerWizard")}
                </span>
              </div>

              {/* STICKY WIZARD MENU */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setActiveStep("accommodations")}
                  className={`w-full text-left p-3.5 rounded-sm flex items-center justify-between transition-all ${
                    activeStep === "accommodations" 
                      ? "bg-[#eae6db]/60 text-brand-dark border-l-2 border-brand-gold font-medium" 
                      : "hover:bg-gray-100 text-gray-500 font-light"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-xs md:text-sm">
                    <Home className="w-4 h-4 text-brand-gold" />
                    {t("stepAccommodations")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setActiveStep("meals")}
                  className={`w-full text-left p-3.5 rounded-sm flex items-center justify-between transition-all ${
                    activeStep === "meals" 
                      ? "bg-[#eae6db]/60 text-brand-dark border-l-2 border-brand-gold font-medium" 
                      : "hover:bg-gray-100 text-gray-500 font-light"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-xs md:text-sm">
                    <Coffee className="w-4 h-4 text-brand-gold" />
                    {t("stepDining")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setActiveStep("logistics")}
                  className={`w-full text-left p-3.5 rounded-sm flex items-center justify-between transition-all ${
                    activeStep === "logistics" 
                      ? "bg-[#eae6db]/60 text-brand-dark border-l-2 border-brand-gold font-medium" 
                      : "hover:bg-gray-100 text-gray-500 font-light"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-xs md:text-sm">
                    <Car className="w-4 h-4 text-brand-gold" />
                    {t("stepAirport")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setActiveStep("summary")}
                  className={`w-full text-left p-3.5 rounded-sm flex items-center justify-between transition-all ${
                    activeStep === "summary" 
                      ? "bg-[#eae6db]/60 text-brand-dark border-l-2 border-brand-gold font-medium" 
                      : "hover:bg-gray-100 text-gray-500 font-light"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-xs md:text-sm font-semibold">
                    <Send className="w-4 h-4 text-brand-gold" />
                    {t("stepSummary")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* LIVE CAPACITY METER */}
            <div className="mt-8 border-t border-[#eae6db] pt-6">
              <h5 className="font-serif text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                {t("liveCapacity")}
              </h5>
              
              <div className="flex flex-col gap-4 bg-white p-4 border border-[#eae6db]/60 rounded-sm">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">{t("totalParticipants")}</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-semibold text-brand-dark font-sans">{stats.participants}</span>
                    <span className="text-xs text-gray-400 font-light">{t("guestsMax")}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">{t("allocatedRooms")}</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-semibold text-brand-dark font-sans">{stats.totalRooms}</span>
                    <span className="text-xs text-gray-400 font-light">{t("roomsMax")}</span>
                  </div>
                  <div className="text-[9px] text-gray-400 font-light mt-1 flex justify-between">
                    <span>Phase 1: {stats.phase1Rooms} {t("allocatedRooms").toLowerCase()}</span>
                    <span>Phase 2: {stats.phase2Rooms} {t("allocatedRooms").toLowerCase()}</span>
                  </div>
                </div>

                {/* CAPACITY HEALTH WARNING */}
                {stats.participants > 18 && (
                  <div className="flex gap-2 items-start bg-amber-50 p-2.5 border border-amber-100 rounded-sm mt-1">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-amber-800 leading-relaxed font-light">
                      Yoga hall has a maximum layout capacity of 15–18 participants. Group sizes exceeding 18 may require split sessions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: MAIN INTERACTIVE STEP CONTENT */}
          <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between">
            
            {/* STEP 1: ACCOMMODATIONS PANEL */}
            {activeStep === "accommodations" && (
              <div>
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-normal text-brand-dark mb-1">
                    {t("roomDetailsTitle")}
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    {t("selectRoomsIntro")}
                  </p>
                </div>

                {/* PHASE 1 GROUP */}
                <div className="mb-8">
                  <div className="flex justify-between items-center bg-[#fbf9f6] px-3 py-2 border border-[#eae6db]/60 rounded-sm mb-3">
                    <span className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider">
                      {t("phase1Title")}
                    </span>
                    <a href="https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-gold hover:underline font-bold">
                      {t("roomPhotoLinkText")}
                    </a>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {ROOMS_DATA.filter(r => r.phase === 1).map(room => {
                      const roomCategory = getCategoryText(room.category);
                      const roomBalcony = getBalconyText(room.balcony);
                      return (
                        <div key={room.id} className={`p-4 border rounded-sm transition-all ${
                          selectedRooms[room.id] 
                            ? "border-brand-gold/60 bg-white" 
                            : "border-gray-200 bg-gray-50/50 opacity-60"
                        }`}>
                          
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={selectedRooms[room.id]}
                                onChange={() => toggleRoom(room.id)}
                                className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold border-gray-300"
                              />
                              <div>
                                <span className="font-bold text-xs md:text-sm text-brand-dark">Room {room.number}</span>
                                <span className="text-[10px] text-gray-400 font-light block md:inline md:ml-2">
                                  {roomCategory}
                                </span>
                              </div>
                            </label>

                            {selectedRooms[room.id] && (
                              <div className="flex items-center gap-2">
                                {/* Occupancy Selector */}
                                <div className="flex border border-gray-200 rounded-sm overflow-hidden text-[10px] font-bold">
                                  <button
                                    type="button"
                                    onClick={() => setOccupancy(room.id, "single")}
                                    className={`px-2.5 py-1 ${roomOccupancy[room.id] === "single" ? "bg-brand-gold text-white" : "bg-gray-50 text-gray-500"}`}
                                  >
                                    {t("singleOccupancy").split(" ")[0]}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setOccupancy(room.id, "shared")}
                                    className={`px-2.5 py-1 ${roomOccupancy[room.id] === "shared" ? "bg-brand-gold text-white" : "bg-gray-50 text-gray-500"}`}
                                  >
                                    {t("sharedOccupancy").split(" ")[0]} (2)
                                  </button>
                                </div>

                                {/* Bed config */}
                                <select
                                  value={roomBedConfig[room.id]}
                                  onChange={(e) => setBedConfig(room.id, e.target.value as any)}
                                  className="text-[10px] bg-[#fbf9f6] border border-gray-200 rounded-sm px-2 py-1 focus:ring-brand-gold focus:border-brand-gold"
                                >
                                  {room.bedOptions.map(opt => {
                                    const optStr = opt === "1 Large Bed" ? t("oneLargeBed") : t("twoSingleBeds");
                                    return (
                                      <option key={opt} value={opt}>{optStr}</option>
                                    );
                                  })}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Room spec bullet points */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-500 font-light pt-2 mt-2 border-t border-gray-100">
                            <span>🌅 {t("balconyLabel")}: {roomBalcony}</span>
                            <span>🚪 {t("wardrobeLabel")}: {room.id === "102" ? t("acNo") : (room.id === "104" ? "Open Type" : "Closed Type")}</span>
                            <span>🚿 {t("bathroomLabel")}: {t("attachedBathroom")}</span>
                            <span>🔥 {t("hotWaterLabel")}: Solar</span>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PHASE 2 GROUP */}
                <div>
                  <div className="flex justify-between items-center bg-[#fbf9f6] px-3 py-2 border border-[#eae6db]/60 rounded-sm mb-3">
                    <span className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider">
                      {t("phase2Title")}
                    </span>
                    <span className="flex gap-2">
                      <a href="https://photos.app.goo.gl/4rrQpirgHdyzojZj8" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-gold hover:underline font-bold">
                        {t("roomPhotoLinkText")} (G)
                      </a>
                      <span className="text-gray-300">|</span>
                      <a href="https://photos.app.goo.gl/YXZy5o9WXxmJwohd6" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-gold hover:underline font-bold">
                        {t("roomPhotoLinkText")} (1)
                      </a>
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {ROOMS_DATA.filter(r => r.phase === 2).map(room => {
                      const roomCategory = getCategoryText(room.category);
                      const roomBalcony = getBalconyText(room.balcony);
                      return (
                        <div key={room.id} className={`p-4 border rounded-sm transition-all ${
                          selectedRooms[room.id] 
                            ? "border-brand-gold/60 bg-white" 
                            : "border-gray-200 bg-gray-50/50 opacity-60"
                        }`}>
                          
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={selectedRooms[room.id]}
                                onChange={() => toggleRoom(room.id)}
                                className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold border-gray-300"
                              />
                              <div>
                                <span className="font-bold text-xs md:text-sm text-brand-dark">Room {room.number}</span>
                                <span className="text-[10px] text-gray-400 font-light block md:inline md:ml-2">
                                  {roomCategory}
                                </span>
                              </div>
                            </label>

                            {selectedRooms[room.id] && (
                              <div className="flex items-center gap-2">
                                {/* Occupancy Selector */}
                                {room.id === "106" ? (
                                  <span className="text-[9px] bg-brand-cream border border-brand-gold/20 text-brand-gold-dark font-medium px-2 py-0.5 rounded-sm">
                                    {t("roomIsTeacherSingleOnly")}
                                  </span>
                                ) : (
                                  <div className="flex border border-gray-200 rounded-sm overflow-hidden text-[10px] font-bold">
                                    <button
                                      type="button"
                                      onClick={() => setOccupancy(room.id, "single")}
                                      className={`px-2.5 py-1 ${roomOccupancy[room.id] === "single" ? "bg-brand-gold text-white" : "bg-gray-50 text-gray-500"}`}
                                    >
                                      {t("singleOccupancy").split(" ")[0]}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setOccupancy(room.id, "shared")}
                                      className={`px-2.5 py-1 ${roomOccupancy[room.id] === "shared" ? "bg-brand-gold text-white" : "bg-gray-50 text-gray-500"}`}
                                    >
                                      {t("sharedOccupancy").split(" ")[0]} (2)
                                    </button>
                                  </div>
                                )}

                                {/* Bed config selector */}
                                <select
                                  value={roomBedConfig[room.id]}
                                  onChange={(e) => setBedConfig(room.id, e.target.value as any)}
                                  className="text-[10px] bg-[#fbf9f6] border border-gray-200 rounded-sm px-2 py-1 focus:ring-brand-gold focus:border-brand-gold"
                                >
                                  {room.bedOptions.map(opt => {
                                    const optStr = opt === "1 Large Bed" ? t("oneLargeBed") : t("twoSingleBeds");
                                    return (
                                      <option key={opt} value={opt}>{optStr}</option>
                                    );
                                  })}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Room notes & specifications */}
                          <div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-500 font-light pt-2 mt-2 border-t border-gray-100">
                              <span>❄️ {t("acLabel")}: {t("acYes")}</span>
                              <span>🌅 {t("balconyLabel")}: {roomBalcony}</span>
                              <span>🚪 {t("wardrobeLabel")}: Closed Type</span>
                              <span>🚿 {t("hotWaterLabel")}: Geyser</span>
                            </div>
                            {room.notes && (
                              <p className="text-[9px] text-[#c5a880] italic mt-1 font-light">
                                💡 {t("notesLabel")}: {t("roomIsTeacherSingleOnly")}
                              </p>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MEALS & CATERING PANEL */}
            {activeStep === "meals" && (
              <div>
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-normal text-brand-dark mb-1">
                    {t("diningTitle")}
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    {t("diningIntro")}
                  </p>
                </div>

                {/* MEAL PACKAGE SELECTOR */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div 
                    onClick={() => setMealOption("none")}
                    className={`p-4 border rounded-sm cursor-pointer transition-all ${
                      mealOption === "none" 
                        ? "border-brand-gold bg-brand-cream/40" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-brand-dark uppercase">{t("noMealsOption").split(" ")[0]}</span>
                      {mealOption === "none" && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      {t("noMealsOption")}
                    </p>
                  </div>

                  <div 
                    onClick={() => setMealOption("breakfast")}
                    className={`p-4 border rounded-sm cursor-pointer transition-all ${
                      mealOption === "breakfast" 
                        ? "border-brand-gold bg-brand-cream/40" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-brand-dark uppercase">{t("breakfastOnlyOption").split(" ")[0]}</span>
                      {mealOption === "breakfast" && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      {t("breakfastOnlyOption")}
                    </p>
                  </div>

                  <div 
                    onClick={() => setMealOption("full")}
                    className={`p-4 border rounded-sm cursor-pointer transition-all ${
                      mealOption === "full" 
                        ? "border-brand-gold bg-brand-cream/40" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-xs text-brand-dark uppercase">{t("fullDayOption").split(" ")[0]}</span>
                      {mealOption === "full" && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      {t("fullDayOption")}
                    </p>
                  </div>
                </div>

                {/* SAMPLE DAILY MENU EXHIBIT */}
                {mealOption !== "none" && (
                  <div className="bg-[#fbf9f6] border border-[#eae6db]/60 p-5 rounded-sm mb-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-[#eae6db]/60 pb-2">
                      <Utensils className="w-4 h-4 text-brand-gold" />
                      <span className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider">
                        Sample Daily Menu Details
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                      {/* Breakfast Menu */}
                      <div>
                        <h5 className="font-bold text-[10px] text-brand-gold uppercase tracking-wider mb-2">
                          {t("menuBreakfastTitle")}
                        </h5>
                        <ul className="text-[10px] text-gray-500 font-light space-y-1">
                          {t("menuBreakfastItems").split(", ").map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Lunch Menu */}
                      {mealOption === "full" && (
                        <div>
                          <h5 className="font-bold text-[10px] text-brand-gold uppercase tracking-wider mb-2">
                            {t("menuLunchTitle")}
                          </h5>
                          <ul className="text-[10px] text-gray-500 font-light space-y-1">
                            {t("menuLunchItems").split(", ").map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dinner Menu */}
                      {mealOption === "full" && (
                        <div>
                          <h5 className="font-bold text-[10px] text-brand-gold uppercase tracking-wider mb-2">
                            {t("menuDinnerTitle")}
                          </h5>
                          <ul className="text-[10px] text-gray-500 font-light space-y-1">
                            {t("menuDinnerItems").split(", ").map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Meal details list */}
                    <div className="mt-4 pt-3 border-t border-[#eae6db]/60 text-[9px] text-gray-400 font-light leading-relaxed flex flex-wrap gap-x-4 gap-y-1">
                      {t("menuFooterItems").split(", ").map((item, idx) => (
                        <span key={idx}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* DIETARY REQUIREMENTS & CUSTOM MENU DETAILS */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase mb-1.5 font-sans">
                      {t("dietaryNotesLabel")}
                    </label>
                    <textarea
                      placeholder={t("dietaryNotesPlaceholder")}
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      className="w-full h-20 text-xs bg-[#fbf9f6] border border-gray-200 rounded-sm p-3 focus:ring-brand-gold focus:border-brand-gold font-light"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={customMealsRequest}
                      onChange={(e) => setCustomMealsRequest(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold border-gray-300"
                    />
                    <span className="text-xs text-gray-500 font-light font-sans">
                      {t("customGroupMenusCheck")}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3: LOGISTICS, TRANSFERS & EXTRAS PANEL */}
            {activeStep === "logistics" && (
              <div>
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-normal text-brand-dark mb-1">
                    {t("airportLogisticsTitle")}
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    {t("airportLogisticsIntro")}
                  </p>
                </div>

                {/* TRIVANDRUM AIRPORT TRANSFERS */}
                <div className="bg-[#fbf9f6] border border-[#eae6db]/60 p-5 rounded-sm mb-6">
                  <h4 className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-brand-gold" />
                    {t("trivandrumAirport")}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-light mb-4 leading-relaxed font-sans">
                    We organize reliable logistics using three vehicle categories. Choose your required quantity:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 border border-gray-100 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-brand-dark block">{t("carSmallLabel").split(" - ")[0]}</span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 font-sans">{t("carSmallLabel").split(" - ")[1] || "Fits 3 guests + luggage"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSmallCarCount(Math.max(0, smallCarCount - 1))}
                          className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{smallCarCount}</span>
                        <button
                          type="button"
                          onClick={() => setSmallCarCount(smallCarCount + 1)}
                          className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-3 border border-gray-100 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-brand-dark block">{t("carLargeLabel").split(" - ")[0]}</span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 font-sans">{t("carLargeLabel").split(" - ")[1] || "Fits 4-5 guests + luggage"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBigCarCount(Math.max(0, bigCarCount - 1))}
                          className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{bigCarCount}</span>
                        <button
                          type="button"
                          onClick={() => setBigCarCount(bigCarCount + 1)}
                          className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-3 border border-gray-100 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-brand-dark block">{t("tempoLabel").split(" - ")[0]}</span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 font-sans">{t("tempoLabel").split(" - ")[1] || "17-Seater capacity coach"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTempoTravellerCount(Math.max(0, tempoTravellerCount - 1))}
                          className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{tempoTravellerCount}</span>
                        <button
                          type="button"
                          onClick={() => setTempoTravellerCount(tempoTravellerCount + 1)}
                          className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* YOGA HALL SCHEDULER */}
                <div className="bg-[#fbf9f6] border border-[#eae6db]/60 p-5 rounded-sm mb-6">
                  <h4 className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    {t("yogaHallUsageTitle")}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-light mb-4 leading-relaxed font-sans">
                    Access to our rooftop sala includes Yoga Mats and Yoga Blocks. Natural ventilation with a peaceful view. Holds 15-18 mats comfortably.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-xs text-brand-dark block font-sans">{t("yogaHallSessionsLabel")}</span>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm overflow-hidden text-xs font-bold font-sans">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setYogaSessionsPerDay(num)}
                          className={`px-3 py-1.5 ${yogaSessionsPerDay === num ? "bg-brand-gold text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                        >
                          {num} {t("sessionsPerDay")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-brand-dark uppercase mb-1 font-sans">
                      {t("customYogaTitle")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("customYogaPlaceholder")}
                      value={customYogaRequirements}
                      onChange={(e) => setCustomYogaRequirements(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-200 rounded-sm px-3 py-2.5 focus:ring-brand-gold focus:border-brand-gold font-light"
                    />
                  </div>
                </div>

                {/* HOUSEKEEPING DETAILS */}
                <div className="bg-white border border-[#eae6db]/60 p-4 rounded-sm">
                  <h4 className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2">
                    🧹 Included Housekeeping Services
                  </h4>
                  <ul className="text-[10px] text-gray-500 font-light space-y-1.5 font-sans">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      Daily room cleaning service included.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      Fresh linen and towels provided every 4th day of stay.
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      Additional housekeeping requirements are easily customized on request.
                    </li>
                  </ul>
                </div>

              </div>
            )}

            {/* STEP 4: SUMMARY & SUBMIT PROPOSAL */}
            {activeStep === "summary" && (
              <div>
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-normal text-brand-dark mb-1 font-sans">
                    {t("proposalTitle")}
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    {t("proposalIntro")}
                  </p>
                </div>

                {/* TEXTAREA SHOWING GENERATED PROPOSAL */}
                <div className="relative mb-6">
                  <textarea
                    readOnly
                    value={proposalText}
                    className="w-full h-72 text-[10px] sm:text-xs bg-[#fbf9f6] border border-[#eae6db] rounded-sm p-4 text-gray-700 font-mono focus:ring-0 focus:border-[#eae6db] leading-relaxed resize-none cursor-text select-text font-sans"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="bg-white border border-gray-200 text-gray-700 text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-sm shadow-sm hover:bg-gray-50 flex items-center gap-1 transition-all select-none font-sans"
                    >
                      <Copy className="w-3 h-3 text-brand-gold" />
                      {copied ? t("proposalCopied") : t("copyProposal")}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-widest px-6 py-4 rounded-sm flex items-center justify-center gap-2 shadow-sm transition-all select-none uppercase font-sans"
                  >
                    <Send className="w-4 h-4" />
                    {t("sendProposal")}
                  </button>
                </div>

                {/* BOOKING PROCEDURES SHORTLIST */}
                <div className="mt-8 border-t border-[#eae6db] pt-6 font-sans">
                  <h5 className="font-serif text-[10px] font-bold tracking-wider text-brand-dark uppercase mb-3">
                    {t("termsTitle")}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-gray-500 font-light leading-relaxed">
                    <div className="space-y-1">
                      <p>• <strong>Deposit Required:</strong> {t("confirmationRule1")}</p>
                      <p>• <strong>Final Balance:</strong> {t("paymentTermsRule2")}</p>
                    </div>
                    <div className="space-y-1">
                      <p>• <strong>Meals & Sessions:</strong> Final headcounts must be locked in at booking confirmation.</p>
                      <p>• <strong>Check-In/Out:</strong> {t("termsRule3")}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* LOWER CONTROL NAVIGATION BAR */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between select-none">
              <div>
                {activeStep !== "accommodations" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep === "meals") setActiveStep("accommodations");
                      else if (activeStep === "logistics") setActiveStep("meals");
                      else if (activeStep === "summary") setActiveStep("logistics");
                    }}
                    className="text-[10px] font-bold tracking-wider text-gray-600 uppercase border border-gray-200 px-4 py-2 hover:bg-gray-50 rounded-sm font-sans"
                  >
                    {t("previousStep")}
                  </button>
                ) : (
                  <div />
                )}
              </div>

              <div>
                {activeStep !== "summary" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep === "accommodations") setActiveStep("meals");
                      else if (activeStep === "meals") setActiveStep("logistics");
                      else if (activeStep === "logistics") setActiveStep("summary");
                    }}
                    className="bg-brand-dark hover:bg-[#1e1e1e] text-white text-[10px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-sm font-sans"
                  >
                    {t("continueNextStep")}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* POLICY TERMS & CONDITIONS SECTION */}
      <section className="bg-[#fbf9f6] border-t border-[#eae6db]/60 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-serif text-xl md:text-2xl font-normal text-brand-dark tracking-wide leading-tight mb-8 text-center">
            {t("termsTitle")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left font-sans">
            {/* Booking policies */}
            <div className="space-y-4">
              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("confirmationTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  <li>• {t("confirmationRule1")}</li>
                  <li>• {t("confirmationRule2")}</li>
                  <li>• {t("confirmationRule3")}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("paymentTermsTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  <li>• {t("paymentTermsRule1")}</li>
                  <li>• {t("paymentTermsRule2")}</li>
                  <li>• {t("paymentTermsRule3")}</li>
                  <li>• {t("paymentTermsRule4")}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("termsAndCondTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  <li>• {t("termsRule1")}</li>
                  <li>• {t("termsRule2")}</li>
                  <li>• {t("termsRule3")}</li>
                  <li>• {t("termsRule4")}</li>
                  <li>• {t("termsRule5")}</li>
                  <li>• {t("termsRule6")}</li>
                  <li>• {t("termsRule7")}</li>
                </ul>
              </div>
            </div>

            {/* Cancellation policies */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 p-5 rounded-sm">
                <h4 className="font-serif font-bold text-xs text-[#b3966e] uppercase tracking-wider mb-3">
                  {t("cancellationTitle")}
                </h4>
                
                <div className="space-y-3 text-xs text-gray-500 font-light leading-relaxed">
                  <div>
                    <span className="font-bold text-brand-dark block">{t("cancel60Days")}</span>
                    <span className="block mt-0.5">{t("cancel60DaysDesc")}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-2.5">
                    <span className="font-bold text-brand-dark block">{t("cancel30to59")}</span>
                    <span className="block mt-0.5">{t("cancel30to59Desc")}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-2.5">
                    <span className="font-bold text-brand-dark block">{t("cancelUnder30")}</span>
                    <span className="block mt-0.5">{t("cancelUnder30Desc")}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-2.5">
                    <span className="font-bold text-brand-dark block">{t("noShow")}</span>
                    <span className="block mt-0.5">{t("noShowDesc")}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  {t("amendmentsTitle")}
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5 font-sans">
                  <li>• {t("amendmentsRule1")}</li>
                  <li>• {t("amendmentsRule2")}</li>
                  <li>• {t("amendmentsRule3")}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2 font-sans">
                  {t("forceMajeureTitle")}
                </h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed font-sans">
                  {t("forceMajeureDesc")}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 bg-white border border-[#eae6db] p-6 rounded-sm">
            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed font-sans">
              {t("footerGreeting")}
            </p>
            <div className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-4 font-sans">
              {t("footerSignature")}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION DISTANCE LOG */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="font-serif text-xl md:text-2xl font-normal text-brand-dark tracking-wide leading-tight mb-3">
            Prime Location in Varkala
          </h3>
          <p className="text-xs text-gray-500 font-light max-w-xl mx-auto mb-8 font-sans">
            All Villa Lemon properties are conveniently located near Varkala's most popular attractions while maintaining a peaceful residential atmosphere.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto text-xs text-gray-600 font-light font-sans">
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🌊 Black Beach</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans">900 m away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">⛰️ Varkala Cliff</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans">900 m away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🧭 North Cliff</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans">1 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🚉 Varkala Station</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans">2.5 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🏖️ Kappil Beach</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans">5.5 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">🦅 Jatayu Earth Center</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans">28 km away</span>
            </div>
            <div className="bg-[#fbf9f6] p-3.5 border border-[#eae6db]/30 rounded-sm">
              <span className="font-bold text-brand-dark block">✈️ Trivandrum Airport</span>
              <span className="text-[11px] text-gray-400 mt-1 block font-sans">42 km away</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
