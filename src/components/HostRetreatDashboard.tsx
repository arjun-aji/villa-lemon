"use client";

import React, { useState, useMemo } from "react";
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

export default function HostRetreatDashboard({ locale, whatsappNumber }: { locale: string; whatsappNumber?: string }) {
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
    lines.push("🍋 VILLA LEMON YOGA RETREAT INQUIRY 🍋");
    lines.push(`Requested Date: [Enter Preferred Dates Here]`);
    lines.push(`Estimated Participants: ${stats.participants} guests`);
    lines.push(`Total Rooms Booked: ${stats.totalRooms} Rooms`);
    lines.push(`  • Phase 1 Rooms: ${stats.phase1Rooms}`);
    lines.push(`  • Phase 2 Rooms: ${stats.phase2Rooms}`);
    lines.push("");
    lines.push("🏠 ROOM ALLOCATION:");
    
    ROOMS_DATA.forEach(room => {
      if (selectedRooms[room.id]) {
        const occStr = room.id === "106" ? "Single Occupancy" : (roomOccupancy[room.id] === "shared" ? "Shared Occupancy (2 guests)" : "Single Occupancy (1 guest)");
        const bedStr = roomBedConfig[room.id];
        lines.push(`  - Room ${room.number} (${room.category}): ${occStr} | Bed: ${bedStr}`);
      }
    });
    
    lines.push("");
    lines.push("🍽 MEAL PREFERENCES:");
    if (mealOption === "full") {
      lines.push("  • Full Day Vegetarian Meals (Breakfast + Lunch + Dinner) Requested");
    } else if (mealOption === "breakfast") {
      lines.push("  • Breakfast Only Requested");
    } else {
      lines.push("  • No Meals Requested");
    }
    if (dietaryNotes.trim()) {
      lines.push(`  • Dietary Requirements: ${dietaryNotes}`);
    }
    if (customMealsRequest) {
      lines.push("  • Custom meal plan options requested");
    }

    lines.push("");
    lines.push("🚗 TRANSPORT LOGISTICS:");
    const vehicles: string[] = [];
    if (smallCarCount > 0) vehicles.push(`${smallCarCount}x Small Car (Trivandrum Airport Transfer)`);
    if (bigCarCount > 0) vehicles.push(`${bigCarCount}x Big Car (Trivandrum Airport Transfer)`);
    if (tempoTravellerCount > 0) vehicles.push(`${tempoTravellerCount}x 17-seater Tempo Traveller`);
    
    if (vehicles.length > 0) {
      vehicles.forEach(v => lines.push(`  • ${v}`));
    } else {
      lines.push("  • No airport transfers planned yet");
    }

    lines.push("");
    lines.push("🧘 YOGA FACILITIES:");
    lines.push(`  • Shared Rooftop Yoga Hall access requested`);
    lines.push(`  • Planned Yoga Sessions: ${yogaSessionsPerDay} per day`);
    if (customYogaRequirements.trim()) {
      lines.push(`  • Special Yoga Needs: ${customYogaRequirements}`);
    }
    lines.push("");
    lines.push("Thank you! Please contact us with the custom packages for this group size.");
    
    return lines.join("\n");
  }, [stats, selectedRooms, roomOccupancy, roomBedConfig, mealOption, dietaryNotes, customMealsRequest, smallCarCount, bigCarCount, tempoTravellerCount, yogaSessionsPerDay, customYogaRequirements]);

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
              Exclusive Group Retreat Venue
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-normal text-brand-dark tracking-wide leading-tight">
              Host Your Retreat at Villa Lemon
            </h2>
            <div className="w-16 h-[1.5px] bg-brand-gold mx-auto mt-4 mb-5" />
            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">
              We provide private, premium homestay accommodation combined with a tranquil rooftop yoga hall, 
              homely catering services, and reliable airport transfers. Use our interactive dashboard below to 
              plan your room layout, customize meals, select logistics, and draft a proposal request.
            </p>
          </div>

          {/* PROPERTY FEATURES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Home className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">10 Air-Conditioned Rooms</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Distributed across two adjacent phases. Offers comfortable options ranging from standard ground-floor units to premium deluxe rooms with private balconies.
              </p>
            </div>
            
            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">Rooftop Yoga Sala</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Shared rooftop studio equipped with yoga mats, blocks, natural fresh air, and excellent natural lighting. Holds a capacity of 15 to 18 participants.
              </p>
            </div>

            <div className="bg-[#fbf9f6] p-6 border border-[#eae6db]/40 rounded-sm">
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Utensils className="w-5 h-5" />
                <h4 className="font-serif font-medium text-brand-dark text-sm md:text-base">Customized Homely Meals</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Homestyle vegetarian, vegan, and gluten-free menus cooked fresh. Flexible meal options, including full day packages and customizable retreat group menus.
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
                  Planner Wizard
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
                    1. Accommodations
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
                    2. Dining & Menu
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
                    3. Airport & Extras
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
                    4. Get Proposal Summary
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* LIVE CAPACITY METER */}
            <div className="mt-8 border-t border-[#eae6db] pt-6">
              <h5 className="font-serif text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                LIVE CAPACITY CALCULATOR
              </h5>
              
              <div className="flex flex-col gap-4 bg-white p-4 border border-[#eae6db]/60 rounded-sm">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Total Participants</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-semibold text-brand-dark font-sans">{stats.participants}</span>
                    <span className="text-xs text-gray-400 font-light">guests max</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Allocated Rooms</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-semibold text-brand-dark font-sans">{stats.totalRooms}</span>
                    <span className="text-xs text-gray-400 font-light">/ 10 rooms</span>
                  </div>
                  <div className="text-[9px] text-gray-400 font-light mt-1 flex justify-between">
                    <span>Phase 1: {stats.phase1Rooms} rooms</span>
                    <span>Phase 2: {stats.phase2Rooms} rooms</span>
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
                    Configure Accommodation Blocks
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    Select rooms you wish to assign for your participants. Customize single vs double/shared occupancy to dynamically compute capacity.
                  </p>
                </div>

                {/* PHASE 1 GROUP */}
                <div className="mb-8">
                  <div className="flex justify-between items-center bg-[#fbf9f6] px-3 py-2 border border-[#eae6db]/60 rounded-sm mb-3">
                    <span className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider">
                      Phase 1 Homestay (4 Rooms - Rooftop Yoga Hall access)
                    </span>
                    <a href="https://photos.app.goo.gl/hQ2KY84mnMKHvBWQ6" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-gold hover:underline font-bold">
                      View Photos
                    </a>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {ROOMS_DATA.filter(r => r.phase === 1).map(room => (
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
                                {room.category}
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
                                  Single
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setOccupancy(room.id, "shared")}
                                  className={`px-2.5 py-1 ${roomOccupancy[room.id] === "shared" ? "bg-brand-gold text-white" : "bg-gray-50 text-gray-500"}`}
                                >
                                  Shared (2)
                                </button>
                              </div>

                              {/* Bed config */}
                              <select
                                value={roomBedConfig[room.id]}
                                onChange={(e) => setBedConfig(room.id, e.target.value as any)}
                                className="text-[10px] bg-[#fbf9f6] border border-gray-200 rounded-sm px-2 py-1 focus:ring-brand-gold focus:border-brand-gold"
                              >
                                {room.bedOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Room spec bullet points */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-500 font-light pt-2 mt-2 border-t border-gray-100">
                          <span>🌅 Balcony: {room.balcony}</span>
                          <span>🚪 Wardrobe: {room.wardrobe}</span>
                          <span>🚿 Bathroom: Attached</span>
                          <span>🔥 Hot Water: Geyser</span>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* PHASE 2 GROUP */}
                <div>
                  <div className="flex justify-between items-center bg-[#fbf9f6] px-3 py-2 border border-[#eae6db]/60 rounded-sm mb-3">
                    <span className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider">
                      Phase 2 Homestay (6 Rooms - AC Included)
                    </span>
                    <span className="flex gap-2">
                      <a href="https://photos.app.goo.gl/4rrQpirgHdyzojZj8" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-gold hover:underline font-bold">
                        Ground Floor Photos
                      </a>
                      <span className="text-gray-300">|</span>
                      <a href="https://photos.app.goo.gl/YXZy5o9WXxmJwohd6" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-gold hover:underline font-bold">
                        First Floor Photos
                      </a>
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {ROOMS_DATA.filter(r => r.phase === 2).map(room => (
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
                                {room.category}
                              </span>
                            </div>
                          </label>

                          {selectedRooms[room.id] && (
                            <div className="flex items-center gap-2">
                              {/* Occupancy Selector */}
                              {room.id === "106" ? (
                                <span className="text-[9px] bg-brand-cream border border-brand-gold/20 text-brand-gold-dark font-medium px-2 py-0.5 rounded-sm">
                                  Teacher/Single Only
                                </span>
                              ) : (
                                <div className="flex border border-gray-200 rounded-sm overflow-hidden text-[10px] font-bold">
                                  <button
                                    type="button"
                                    onClick={() => setOccupancy(room.id, "single")}
                                    className={`px-2.5 py-1 ${roomOccupancy[room.id] === "single" ? "bg-brand-gold text-white" : "bg-gray-50 text-gray-500"}`}
                                  >
                                    Single
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setOccupancy(room.id, "shared")}
                                    className={`px-2.5 py-1 ${roomOccupancy[room.id] === "shared" ? "bg-brand-gold text-white" : "bg-gray-50 text-gray-500"}`}
                                  >
                                    Shared (2)
                                  </button>
                                </div>
                              )}

                              {/* Bed config selector */}
                              <select
                                value={roomBedConfig[room.id]}
                                onChange={(e) => setBedConfig(room.id, e.target.value as any)}
                                className="text-[10px] bg-[#fbf9f6] border border-gray-200 rounded-sm px-2 py-1 focus:ring-brand-gold focus:border-brand-gold"
                              >
                                {room.bedOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Room notes & specifications */}
                        <div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-500 font-light pt-2 mt-2 border-t border-gray-100">
                            <span>❄️ Air Conditioning: Yes</span>
                            <span>🌅 Balcony: {room.balcony}</span>
                            <span>🚪 Wardrobe: {room.wardrobe}</span>
                            <span>🚿 Hot Water: Geyser</span>
                          </div>
                          {room.notes && (
                            <p className="text-[9px] text-[#c5a880] italic mt-1 font-light">
                              💡 Note: {room.notes}
                            </p>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MEALS & CATERING PANEL */}
            {activeStep === "meals" && (
              <div>
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-normal text-brand-dark mb-1">
                    Catering & Meal Options
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    We offer freshly prepared homestyle vegetarian meals for your group. Select your package details.
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
                      <span className="font-bold text-xs text-brand-dark uppercase">No Meals</span>
                      {mealOption === "none" && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      You will arrange external dining or use the shared kitchen facilities.
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
                      <span className="font-bold text-xs text-brand-dark uppercase">Breakfast Only</span>
                      {mealOption === "breakfast" && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      Homely breakfast served daily from 8:00 AM to 10:00 AM on request.
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
                      <span className="font-bold text-xs text-brand-dark uppercase">Full Day Meals</span>
                      {mealOption === "full" && <CheckCircle className="w-4 h-4 text-brand-gold" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      Complete package including Breakfast, Lunch (1:00 PM – 2:30 PM) and Dinner (7:30 PM – 9:00 PM).
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
                          🍳 Breakfast (09:00 AM – 10:00 AM)
                        </h5>
                        <ul className="text-[10px] text-gray-500 font-light space-y-1">
                          <li>• Fresh Seasonal Fruits & Juice</li>
                          <li>• Herbal / Masala Tea / Coffee</li>
                          <li>• Idli & Sambar / Dosa with Chutney</li>
                          <li>• Appam & Vegetable Stew</li>
                          <li>• Poha / Upma or Oats Porridge</li>
                          <li>• Eggs (cooked on request)</li>
                        </ul>
                      </div>

                      {/* Lunch Menu */}
                      {mealOption === "full" && (
                        <div>
                          <h5 className="font-bold text-[10px] text-brand-gold uppercase tracking-wider mb-2">
                            🍲 Lunch (1:00 PM – 2:00 PM)
                          </h5>
                          <ul className="text-[10px] text-gray-500 font-light space-y-1">
                            <li>• Steamed Rice & Chapati</li>
                            <li>• Homestyle Dal</li>
                            <li>• Two Seasonal Veg Curries</li>
                            <li>• Salad, Pickle & Papad</li>
                            <li>• Curd / Yogurt & Fresh Fruit</li>
                          </ul>
                        </div>
                      )}

                      {/* Dinner Menu */}
                      {mealOption === "full" && (
                        <div>
                          <h5 className="font-bold text-[10px] text-brand-gold uppercase tracking-wider mb-2">
                            🌙 Dinner (05:00 PM – 06:00 PM)
                          </h5>
                          <ul className="text-[10px] text-gray-500 font-light space-y-1">
                            <li>• Rice & Chapati with Dal</li>
                            <li>• Paneer or Tofu Dish</li>
                            <li>• Vegetable Curry & Salad</li>
                            <li>• Warm Soup</li>
                            <li>• Dessert (on selected days)</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Meal details list */}
                    <div className="mt-4 pt-3 border-t border-[#eae6db]/60 text-[9px] text-gray-400 font-light leading-relaxed flex flex-wrap gap-x-4 gap-y-1">
                      <span>✓ 100% Vegetarian</span>
                      <span>✓ Custom menus for groups</span>
                      <span>✓ Filtered drinking water included</span>
                      <span>✓ Vegan/Gluten-Free upon request</span>
                    </div>
                  </div>
                )}

                {/* DIETARY REQUIREMENTS & CUSTOM MENU DETAILS */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase mb-1.5">
                      Dietary Preferences & Requirements
                    </label>
                    <textarea
                      placeholder="e.g. 3 Vegans, 1 Gluten-free participant, allergy constraints..."
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
                      We would like to customize the menu for our retreat groups (South Indian, North Indian, and Continental options)
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
                    Logistics, Transfers & Yoga Hall
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    Select airport pickups from Trivandrum Airport (TRV - 42 km) and plan yoga sessions in the Rooftop Yoga Hall.
                  </p>
                </div>

                {/* TRIVANDRUM AIRPORT TRANSFERS */}
                <div className="bg-[#fbf9f6] border border-[#eae6db]/60 p-5 rounded-sm mb-6">
                  <h4 className="font-serif text-xs font-semibold text-brand-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-brand-gold" />
                    Airport Pickups / Drop Services
                  </h4>
                  <p className="text-[11px] text-gray-500 font-light mb-4 leading-relaxed font-sans">
                    We organize reliable logistics using three vehicle categories. Choose your required quantity:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 border border-gray-100 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-brand-dark block">Small Car</span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 font-sans">Fits 3 guests + luggage</span>
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
                        <span className="font-bold text-xs text-brand-dark block">Big Car (SUV)</span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 font-sans">Fits 4-5 guests + luggage</span>
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
                        <span className="font-bold text-xs text-brand-dark block">Tempo Traveller</span>
                        <span className="text-[9px] text-gray-400 font-light block mt-0.5 font-sans">17-Seater capacity coach</span>
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
                    Rooftop Yoga Sala Details
                  </h4>
                  <p className="text-[11px] text-gray-500 font-light mb-4 leading-relaxed font-sans">
                    Access to our rooftop sala includes Yoga Mats and Yoga Blocks. Natural ventilation with a peaceful view. Holds 15-18 mats comfortably.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-xs text-brand-dark block">Planned Yoga Sessions</span>
                      <span className="text-[9px] text-gray-400 font-light block mt-0.5 font-sans font-light">How many sessions do you plan to conduct daily?</span>
                    </div>

                    <div className="flex border border-gray-200 rounded-sm overflow-hidden text-xs font-bold">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setYogaSessionsPerDay(num)}
                          className={`px-3 py-1.5 ${yogaSessionsPerDay === num ? "bg-brand-gold text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                        >
                          {num} {num === 1 ? "Session" : "Sessions"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-bold text-brand-dark uppercase mb-1">
                      Special requests for yoga room setup / classes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sound system, meditation cushions, custom schedule..."
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
                  <h3 className="font-serif text-lg font-normal text-brand-dark mb-1">
                    Your Customized Retreat Proposal
                  </h3>
                  <p className="text-xs text-gray-500 font-light">
                    Review your group's requirements below. Submit this proposal template directly to Shahid via WhatsApp or copy details to your clipboard.
                  </p>
                </div>

                {/* TEXTAREA SHOWING GENERATED PROPOSAL */}
                <div className="relative mb-6">
                  <textarea
                    readOnly
                    value={proposalText}
                    className="w-full h-72 text-[10px] sm:text-xs bg-[#fbf9f6] border border-[#eae6db] rounded-sm p-4 text-gray-700 font-mono focus:ring-0 focus:border-[#eae6db] leading-relaxed resize-none cursor-text select-text"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="bg-white border border-gray-200 text-gray-700 text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-sm shadow-sm hover:bg-gray-50 flex items-center gap-1 transition-all select-none"
                    >
                      <Copy className="w-3 h-3 text-brand-gold" />
                      {copied ? "COPIED!" : "COPY PLAN"}
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
                    Submit Inquiry via WhatsApp
                  </button>
                </div>

                {/* BOOKING PROCEDURES SHORTLIST */}
                <div className="mt-8 border-t border-[#eae6db] pt-6">
                  <h5 className="font-serif text-[10px] font-bold tracking-wider text-brand-dark uppercase mb-3">
                    Important Terms & Booking Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-gray-500 font-light leading-relaxed font-sans">
                    <div className="space-y-1">
                      <p>• <strong>Deposit Required:</strong> 30% non-refundable advance confirms booking.</p>
                      <p>• <strong>Final Balance:</strong> Remaining 70% due 30 days prior to group arrival.</p>
                    </div>
                    <div className="space-y-1">
                      <p>• <strong>Meals & Sessions:</strong> Final headcounts must be locked in at booking confirmation.</p>
                      <p>• <strong>Check-In/Out:</strong> 2:00 PM check-in and 11:00 AM check-out.</p>
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
                    ← Previous Step
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
                    Continue to Next Step →
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
            Booking Terms & Conditions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left font-sans">
            {/* Booking policies */}
            <div className="space-y-4">
              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  Booking Confirmation
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  <li>• To confirm a retreat booking, a 30% non-refundable advance payment is required.</li>
                  <li>• The remaining balance must be paid 30 days before the retreat arrival date, unless otherwise agreed in writing.</li>
                  <li>• Bookings are confirmed only after the advance payment has been received and written confirmation has been issued by Villa Lemon.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  Payment Terms
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  <li>• 30% advance payment to confirm the booking.</li>
                  <li>• 70% balance payment due 30 days before arrival.</li>
                  <li>• Payments can be made by bank transfer or other agreed payment methods.</li>
                  <li>• Any additional services requested during the retreat must be settled before departure.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  Terms & Conditions
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5">
                  <li>• Prices are valid for the agreed travel period only.</li>
                  <li>• Room allocation is subject to availability.</li>
                  <li>• Check-in: 2:00 PM | Check-out: 11:00 AM.</li>
                  <li>• Early check-in and late check-out are subject to availability and may incur additional charges.</li>
                  <li>• Meal packages, yoga hall rental, airport transfers, and excursions should be confirmed before arrival.</li>
                  <li>• Organizers are responsible for providing the final rooming list and participant details before arrival.</li>
                  <li>• Any damages caused during the stay will be charged to the retreat organizer.</li>
                </ul>
              </div>
            </div>

            {/* Cancellation policies */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 p-5 rounded-sm">
                <h4 className="font-serif font-bold text-xs text-[#b3966e] uppercase tracking-wider mb-3">
                  Cancellation Policy
                </h4>
                
                <div className="space-y-3 text-xs text-gray-500 font-light leading-relaxed">
                  <div>
                    <span className="font-bold text-brand-dark block">More than 60 days before arrival</span>
                    <span className="block mt-0.5">Full refund of payments received, excluding the non-refundable booking deposit.</span>
                  </div>

                  <div className="border-t border-gray-100 pt-2.5">
                    <span className="font-bold text-brand-dark block">30–59 days before arrival</span>
                    <span className="block mt-0.5">50% of the total booking value will be charged.</span>
                  </div>

                  <div className="border-t border-gray-100 pt-2.5">
                    <span className="font-bold text-brand-dark block">Less than 30 days before arrival</span>
                    <span className="block mt-0.5">100% of the total booking value will be charged.</span>
                  </div>

                  <div className="border-t border-gray-100 pt-2.5">
                    <span className="font-bold text-brand-dark block">No-show or Early Departure</span>
                    <span className="block mt-0.5">No refund will be provided for unused nights, no-shows, or early departures.</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2">
                  Amendments
                </h4>
                <ul className="text-xs text-gray-500 font-light leading-relaxed space-y-1.5 font-sans">
                  <li>• Date changes are subject to availability and management approval.</li>
                  <li>• Reduction in the number of rooms or participants after confirmation may result in cancellation charges.</li>
                  <li>• Additional rooms or services will be subject to availability.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-bold text-xs text-brand-gold uppercase tracking-wider mb-2 font-sans">
                  Force Majeure
                </h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed font-sans">
                  Villa Lemon shall not be held liable for cancellations or interruptions caused by events beyond our reasonable control, including natural disasters, government restrictions, pandemics, civil unrest, or other unforeseen circumstances. In such cases, both parties will work together in good faith to reschedule the retreat where possible.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 bg-white border border-[#eae6db] p-6 rounded-sm">
            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed font-sans">
              We look forward to welcoming you and your retreat participants to Varkala. For any custom group sizes 
              or bespoke requests, contact us directly to craft a personalized wellness package.
            </p>
            <div className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-4 font-sans">
              Shahid — Villa Lemon Homestay
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
