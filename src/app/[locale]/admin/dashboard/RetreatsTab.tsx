"use client";
/**
 * RetreatsTab — Full CMS for Yoga Retreats
 * Mounted inside the admin dashboard when activeTab === "retreats"
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Edit2, Trash2, X, Loader2, Upload, Check,
  ChevronDown, ChevronUp, Star, Calendar, Users, MapPin,
  Clock, BookOpen, Leaf, Heart, Award, Mountain, Sun, Moon,
  Dumbbell, Coffee, Camera, Home, DollarSign, Settings,
  FileText, Eye, EyeOff, ArrowUp, ArrowDown, Globe,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LT { en: string; de?: string; fr?: string; ru?: string; }
const emptyLT = (): LT => ({ en: "", de: "", fr: "", ru: "" });

interface Retreat {
  _id: string;
  slug: string;
  days: number;
  nights: number;
  price: number;
  heroTitle: LT;
  tagline: LT;
  shortDescription: LT;
  heroImage: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  isPopular: boolean;
  isSoldOut: boolean;
  isUpcoming: boolean;
  certificate: boolean;
  yogaLevel: LT;
  groupSize: LT;
  maxCapacity: number;
  teachers: any[];
  pricingRows: any[];
  inclusions: any[];
  exclusions: any[];
  highlights: any[];
  dailySchedule: any[];
  curriculum: any[];
  excursions: any[];
  rooms: any[];
  meals: any[];
  faqs: any[];
  reviews: any[];
  displayOrder: number;
}

// ─── TABS config ──────────────────────────────────────────────────────────────

const FORM_TABS = [
  { id: "general", label: "General Info", icon: Settings },
  { id: "content", label: "Content", icon: FileText },
  { id: "media", label: "Media", icon: Camera },
  { id: "highlights", label: "Highlights", icon: Star },
  { id: "schedule", label: "Daily Schedule", icon: Clock },
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "excursions", label: "Excursions", icon: Mountain },
  { id: "rooms", label: "Rooms", icon: Home },
  { id: "meals", label: "Meals", icon: Coffee },
  { id: "yoga", label: "Yoga Program", icon: Sun },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "ayurveda", label: "Ayurveda", icon: Leaf },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "checklists", label: "Checklists", icon: Check },
  { id: "faqs", label: "FAQs & Reviews", icon: Star },
  { id: "booking", label: "Booking & Settings", icon: Calendar },
  { id: "seo", label: "SEO", icon: Globe },
] as const;

type FormTabId = typeof FORM_TABS[number]["id"];

// ─── Default form state ────────────────────────────────────────────────────────

const defaultForm = () => ({
  slug: "",
  days: 7,
  nights: 7,
  price: 0,
  minAge: 18,
  maxCapacity: 20,
  certificate: false,
  featured: false,
  status: "draft" as const,
  displayOrder: 0,
  yogaHours: 0,
  maxParticipants: 20,
  minParticipants: 2,
  bookingOpen: true,
  isPopular: false,
  isSoldOut: false,
  isUpcoming: false,
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  emergencyContact: "",
  canonicalUrl: "",
  brochureUrl: "",
  packingListUrl: "",
  schedulePdfUrl: "",
  termsPdfUrl: "",
  video: "",
  retreatMap: "",
  availableDates: [] as string[],
  // Localized text fields
  heroTitle: emptyLT(),
  heroSubtitle: emptyLT(),
  tagline: emptyLT(),
  shortDescription: emptyLT(),
  fullDescription: emptyLT(),
  retreatOverview: emptyLT(),
  whyChoose: emptyLT(),
  whoIsItFor: emptyLT(),
  bestTime: emptyLT(),
  cta: emptyLT(),
  location: emptyLT(),
  difficulty: emptyLT(),
  yogaLevel: emptyLT(),
  language: emptyLT(),
  groupSize: emptyLT(),
  accommodationType: emptyLT(),
  yogaStyle: emptyLT(),
  morningSession: emptyLT(),
  eveningSession: emptyLT(),
  meditation: emptyLT(),
  pranayama: emptyLT(),
  philosophy: emptyLT(),
  classLanguage: emptyLT(),
  suitableFor: emptyLT(),
  yogaCertificate: emptyLT(),
  yogaDescription: emptyLT(),
  ayurvedaTitle: emptyLT(),
  ayurvedaDescription: emptyLT(),
  deposit: emptyLT(),
  balancePayment: emptyLT(),
  cancellation: emptyLT(),
  refund: emptyLT(),
  pickup: emptyLT(),
  drop: emptyLT(),
  medicalInfo: emptyLT(),
  specialRequests: emptyLT(),
  bookingTerms: emptyLT(),
  metaTitle: emptyLT(),
  metaDescription: emptyLT(),
  keywords: emptyLT(),
  // Arrays
  highlights: [] as { icon: string; title: LT; description: LT }[],
  dailySchedule: [] as { time: string; activity: LT; description: LT; icon: string }[],
  curriculum: [] as { dayNumber: number; dayTitle: LT; description: LT; topics: LT[]; learningOutcome: LT; images: string[] }[],
  excursions: [] as { name: LT; duration: LT; description: LT; image: string; highlights: LT[]; relatedTour: string; included: boolean }[],
  rooms: [] as { name: LT; image: string; description: LT; occupancy: number; isPrivate: boolean; hasAC: boolean; hasBathroom: boolean; hasBalcony: boolean; hasWorkspace: boolean; hotWater: boolean; sharedPrice: number; privatePrice: number; features: LT[] }[],
  meals: [] as { mealType: LT; description: LT; isVegan: boolean; isGlutenFree: boolean; isLactoseFree: boolean; gallery: string[]; menuItems: LT[] }[],
  teachers: [] as { name: string; photo: string; experience: string; specialization: LT; bio: LT; certificates: LT[]; instagramUrl: string; facebookUrl: string; websiteUrl: string }[],
  ayurvedaTreatments: [] as { name: LT; description: LT; isOptional: boolean; extraCost: number }[],
  pricingRows: [] as { roomCategory: LT; sharedPrice: number; privatePrice: number; availability: LT; upgradeCost: number }[],
  inclusions: [] as LT[],
  exclusions: [] as LT[],
  thingsToBring: [] as LT[],
  dressCode: [] as LT[],
  requirements: [] as LT[],
  whoShouldAvoid: [] as LT[],
  faqs: [] as { question: LT; answer: LT }[],
  reviews: [] as { name: string; country: string; photo: string; stars: number; review: LT; retreatJoined: string }[],
  certificates: [] as { image: string; name: LT; description: LT }[],
});

type RetreatForm = ReturnType<typeof defaultForm>;

// ─── Helper components ────────────────────────────────────────────────────────

const LTInput = ({ value, onChange, label, multiline = false, required = false, placeholder = "" }: {
  value: LT; onChange: (v: LT) => void; label: string;
  multiline?: boolean; required?: boolean; placeholder?: string;
}) => {
  const [lang, setLang] = useState<"en" | "de" | "fr" | "ru">("en");
  const flags: Record<string, string> = { en: "🇬🇧", de: "🇩🇪", fr: "🇫🇷", ru: "🇷🇺" };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
        <div className="flex gap-1">
          {(["en","de","fr","ru"] as const).map(l => (
            <button key={l} type="button" onClick={() => setLang(l)}
              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase transition-colors ${
                lang === l ? "bg-brand-gold text-black" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}>
              {flags[l]} {l}
            </button>
          ))}
        </div>
      </div>
      {multiline ? (
        <textarea rows={3} placeholder={lang === "en" ? placeholder : `${placeholder} (${lang.toUpperCase()})`}
          value={value[lang] || ""}
          onChange={e => onChange({ ...value, [lang]: e.target.value })}
          className="border border-gray-200 p-2.5 rounded text-sm font-sans resize-y focus:outline-none focus:border-brand-gold"
          required={required && lang === "en"}
        />
      ) : (
        <input type="text" placeholder={lang === "en" ? placeholder : `${placeholder} (${lang.toUpperCase()})`}
          value={value[lang] || ""}
          onChange={e => onChange({ ...value, [lang]: e.target.value })}
          className="border border-gray-200 p-2.5 rounded text-sm focus:outline-none focus:border-brand-gold"
          required={required && lang === "en"}
        />
      )}
    </div>
  );
};

const SimpleListEditor = ({ items, onChange, label, placeholder }: {
  items: LT[]; onChange: (items: LT[]) => void; label: string; placeholder?: string;
}) => {
  const add = () => onChange([...items, emptyLT()]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, v: LT) => { const arr = [...items]; arr[i] = v; onChange(arr); };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">{label}</span>
        <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-brand-gold hover:text-[#b8943e] font-bold cursor-pointer">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <LTInput value={item} onChange={v => update(i, v)} label="" placeholder={placeholder || "Item"} />
            </div>
            <button type="button" onClick={() => remove(i)} className="mt-1 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface RetreatsTabProps {
  token: string;
  modalMode?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: () => void;
  editingItem?: any;
}

export default function RetreatsTab({
  token,
  modalMode = false,
  isOpen = false,
  onClose,
  onSave,
  editingItem,
}: RetreatsTabProps) {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Retreat | null>(null);
  const [form, setForm] = useState<RetreatForm>(defaultForm());
  const [activeFormTab, setActiveFormTab] = useState<FormTabId>("general");
  const [saving, setSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");

  // Sync state if modalMode is enabled
  useEffect(() => {
    if (modalMode) {
      setShowModal(isOpen);
      if (isOpen) {
        if (editingItem) {
          setEditing(editingItem);
          setForm({ ...defaultForm(), ...editingItem });
          setHeroImagePreview(editingItem.heroImage || "");
        } else {
          setEditing(null);
          setForm(defaultForm());
          setHeroImagePreview("");
        }
        setHeroImageFile(null);
        setActiveFormTab("general");
      }
    }
  }, [modalMode, isOpen, editingItem]);

  const closeModal = () => {
    if (modalMode && onClose) {
      onClose();
    } else {
      setShowModal(false);
    }
  };

  // Fetch retreats
  const fetchRetreats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/retreats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setRetreats(json.data || []);
    } catch { setRetreats([]); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchRetreats(); }, [fetchRetreats]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setHeroImageFile(null);
    setHeroImagePreview("");
    setActiveFormTab("general");
    setShowModal(true);
  };

  const openEdit = (r: Retreat) => {
    setEditing(r);
    setForm({ ...defaultForm(), ...(r as any) });
    setHeroImageFile(null);
    setHeroImagePreview(r.heroImage || "");
    setActiveFormTab("general");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this retreat? This cannot be undone.")) return;
    await fetch(`${API_BASE_URL}/api/retreats/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRetreats();
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setHeroImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (heroImageFile) fd.append("heroImage", heroImageFile);

      // Append all simple fields
      const boolFields = ["certificate","featured","bookingOpen","isPopular","isSoldOut","isUpcoming"];
      const numFields = ["days","nights","price","minAge","maxCapacity","yogaHours","maxParticipants","minParticipants","displayOrder"];
      const strFields = ["slug","status","checkIn","checkOut","emergencyContact","canonicalUrl","brochureUrl","packingListUrl","schedulePdfUrl","termsPdfUrl","video","retreatMap"];
      const ltFields = ["heroTitle","heroSubtitle","tagline","shortDescription","fullDescription","retreatOverview","whyChoose","whoIsItFor","bestTime","cta","location","difficulty","yogaLevel","language","groupSize","accommodationType","yogaStyle","morningSession","eveningSession","meditation","pranayama","philosophy","classLanguage","suitableFor","yogaCertificate","yogaDescription","ayurvedaTitle","ayurvedaDescription","deposit","balancePayment","cancellation","refund","pickup","drop","medicalInfo","specialRequests","bookingTerms","metaTitle","metaDescription","keywords"];
      const arrFields = ["highlights","dailySchedule","curriculum","excursions","rooms","meals","teachers","ayurvedaTreatments","pricingRows","inclusions","exclusions","thingsToBring","dressCode","requirements","whoShouldAvoid","faqs","reviews","certificates","availableDates"];

      strFields.forEach(k => fd.append(k, (form as any)[k] || ""));
      boolFields.forEach(k => fd.append(k, String((form as any)[k])));
      numFields.forEach(k => fd.append(k, String((form as any)[k] || 0)));
      ltFields.forEach(k => fd.append(k, JSON.stringify((form as any)[k] || emptyLT())));
      arrFields.forEach(k => fd.append(k, JSON.stringify((form as any)[k] || [])));

      const url = editing ? `${API_BASE_URL}/api/retreats/${editing._id}` : `${API_BASE_URL}/api/retreats`;
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        if (modalMode) {
          if (onSave) onSave();
        } else {
          setShowModal(false);
          fetchRetreats();
        }
      } else {
        const err = await res.json();
        alert("Error: " + (err.message || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error saving retreat: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const setF = (key: keyof RetreatForm, val: any) => setForm(f => ({ ...f, [key]: val }));
  const setLT = (key: keyof RetreatForm) => (val: LT) => setF(key, val);

  // ─── Render ────────────────────────────────────────────────────────────────
  if (modalMode) {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto select-text text-left">
            <div className="bg-white rounded-md max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-gray-150 my-auto">

              {/* Modal header */}
              <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white rounded-t-md shrink-0">
                <div>
                  <h3 className="font-serif text-lg tracking-wide">
                    {editing ? "Edit Yoga Retreat" : "Create Yoga Retreat"}
                  </h3>
                  <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure program types, benefits, and schedule</p>
                </div>
                <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-white cursor-pointer transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab bar */}
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-2.5 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                {FORM_TABS.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} type="button" onClick={() => setActiveFormTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeFormTab === tab.id
                          ? "bg-brand-gold text-black shadow-sm"
                          : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      }`}>
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto text-left">
                <div className="px-6 py-6 space-y-6">

                  {/* ── Tab: General Info ── */}
                  {activeFormTab === "general" && (
                    <div className="space-y-5">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">General Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">Slug <span className="text-red-400">*</span></label>
                          <input type="text" required value={form.slug} onChange={e => setF("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                            placeholder="varkala-yoga-spiritual-retreat"
                            className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">Status</label>
                          <select value={form.status} onChange={e => setF("status", e.target.value as any)}
                            className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[["days","Days",7],["nights","Nights",7],["price","Starting Price (₹)",0],["displayOrder","Display Order",0]].map(([k,l,d]) => (
                          <div key={k as string} className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                            <input type="number" min="0" value={(form as any)[k as string] || d}
                              onChange={e => setF(k as keyof RetreatForm, Number(e.target.value))}
                              className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[["minAge","Min Age",18],["maxCapacity","Max Capacity",20],["yogaHours","Yoga Hours",0]].map(([k,l,d]) => (
                          <div key={k as string} className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                            <input type="number" min="0" value={(form as any)[k as string] || d}
                              onChange={e => setF(k as keyof RetreatForm, Number(e.target.value))}
                              className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <LTInput value={form.location} onChange={setLT("location")} label="Location" placeholder="Varkala, Kerala" />
                        <LTInput value={form.difficulty} onChange={setLT("difficulty")} label="Difficulty" placeholder="Beginner Friendly" />
                        <LTInput value={form.yogaLevel} onChange={setLT("yogaLevel")} label="Yoga Level" placeholder="All Levels" />
                        <LTInput value={form.language} onChange={setLT("language")} label="Language" placeholder="English" />
                        <LTInput value={form.groupSize} onChange={setLT("groupSize")} label="Group Size" placeholder="3-12 People" />
                        <LTInput value={form.accommodationType} onChange={setLT("accommodationType")} label="Accommodation Type" placeholder="Budget / Standard / Deluxe" />
                      </div>
                      <div className="flex flex-wrap gap-5">
                        {[
                          ["certificate","Certificate Provided","boolean"],
                          ["featured","Featured Retreat","boolean"],
                          ["isPopular","Mark as Popular","boolean"],
                          ["isSoldOut","Sold Out","boolean"],
                          ["isUpcoming","Upcoming","boolean"],
                          ["bookingOpen","Booking Open","boolean"],
                        ].map(([k, l]) => (
                          <label key={k as string} className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" checked={!!(form as any)[k as string]}
                              onChange={e => setF(k as keyof RetreatForm, e.target.checked)}
                              className="w-4 h-4 accent-[#c5a880]" />
                            <span className="text-xs font-semibold text-gray-700">{l as string}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Tab: Content ── */}
                  {activeFormTab === "content" && (
                    <div className="space-y-5">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Content & Descriptions</h3>
                      <LTInput value={form.heroTitle} onChange={setLT("heroTitle")} label="Hero Title" placeholder="Varkala Yoga, Spiritual & Nature Retreat" required multiline />
                      <LTInput value={form.heroSubtitle} onChange={setLT("heroSubtitle")} label="Hero Subtitle" placeholder="Reconnect · Rejuvenate · Transform" />
                      <LTInput value={form.tagline} onChange={setLT("tagline")} label="Tagline" placeholder="A transformative 8-day wellness journey..." />
                      <LTInput value={form.shortDescription} onChange={setLT("shortDescription")} label="Short Description" placeholder="Short summary shown in cards..." multiline />
                      <LTInput value={form.fullDescription} onChange={setLT("fullDescription")} label="Full Description" placeholder="Full about text..." multiline />
                      <LTInput value={form.retreatOverview} onChange={setLT("retreatOverview")} label="Retreat Overview" placeholder="Retreat overview paragraph..." multiline />
                      <LTInput value={form.whyChoose} onChange={setLT("whyChoose")} label="Why Choose This Retreat" placeholder="Why this retreat stands out..." multiline />
                      <LTInput value={form.whoIsItFor} onChange={setLT("whoIsItFor")} label="Who Is This For" placeholder="Perfect for beginners and experienced practitioners..." multiline />
                      <LTInput value={form.bestTime} onChange={setLT("bestTime")} label="Best Time to Join" placeholder="October to March" />
                      <LTInput value={form.cta} onChange={setLT("cta")} label="CTA Button Text" placeholder="Book Now" />
                    </div>
                  )}

                  {/* ── Tab: Media ── */}
                  {activeFormTab === "media" && (
                    <div className="space-y-5">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Media</h3>
                      <div className="space-y-2">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Hero Image <span className="text-red-400">*</span></label>
                        <div className="flex items-center gap-4">
                          {heroImagePreview && (
                            <div className="w-32 aspect-video rounded border overflow-hidden shrink-0">
                              <img src={heroImagePreview} className="w-full h-full object-cover" alt="Preview" />
                            </div>
                          )}
                          <label className="flex-1 border-2 border-dashed border-gray-300 hover:border-amber-400 rounded p-4 cursor-pointer text-center bg-white hover:bg-amber-50 transition-colors">
                            <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500 font-medium">Upload Hero Image</span>
                            <input type="file" accept="image/*" onChange={handleHeroImageChange} className="hidden" required={!editing} />
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Video URL (YouTube/Vimeo)</label>
                        <input type="url" value={form.video} onChange={e => setF("video", e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Retreat Map URL</label>
                        <input type="url" value={form.retreatMap} onChange={e => setF("retreatMap", e.target.value)}
                          placeholder="https://maps.google.com/..."
                          className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                      <p className="text-xs text-gray-400 italic">Gallery images per category can be added after creating the retreat (edit mode).</p>
                    </div>
                  )}

                  {/* ── Tab: Highlights ── */}
                  {activeFormTab === "highlights" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Retreat Highlights</h3>
                        <button type="button" onClick={() => setF("highlights", [...form.highlights, { icon: "Star", title: emptyLT(), description: emptyLT() }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Highlight
                        </button>
                      </div>
                      {form.highlights.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No highlights yet. Add your first highlight above.</p>}
                      {form.highlights.map((h, i) => (
                        <div key={i} className="bg-amber-50 border border-amber-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("highlights", form.highlights.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Icon name (Lucide icon)</label>
                            <input type="text" value={h.icon} placeholder="e.g. Sun, Leaf, Award, Heart"
                              onChange={e => { const arr = [...form.highlights]; arr[i] = { ...arr[i], icon: e.target.value }; setF("highlights", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                          <LTInput value={h.title} onChange={v => { const arr = [...form.highlights]; arr[i] = { ...arr[i], title: v }; setF("highlights", arr); }} label="Title" placeholder="Daily Yoga" />
                          <LTInput value={h.description} onChange={v => { const arr = [...form.highlights]; arr[i] = { ...arr[i], description: v }; setF("highlights", arr); }} label="Description" placeholder="Traditional Hatha & Vinyasa yoga practice twice daily" multiline />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Daily Schedule ── */}
                  {activeFormTab === "schedule" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Daily Schedule</h3>
                        <button type="button" onClick={() => setF("dailySchedule", [...form.dailySchedule, { time: "", activity: emptyLT(), description: emptyLT(), icon: "Clock" }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Time Slot
                        </button>
                      </div>
                      {form.dailySchedule.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No schedule items yet.</p>}
                      {form.dailySchedule.map((s, i) => (
                        <div key={i} className="bg-blue-50 border border-blue-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("dailySchedule", form.dailySchedule.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Time</label>
                              <input type="text" value={s.time} placeholder="06:00 AM"
                                onChange={e => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], time: e.target.value }; setF("dailySchedule", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Icon (Lucide)</label>
                              <input type="text" value={s.icon} placeholder="Sun, Coffee, Moon..."
                                onChange={e => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], icon: e.target.value }; setF("dailySchedule", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                          </div>
                          <LTInput value={s.activity} onChange={v => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], activity: v }; setF("dailySchedule", arr); }} label="Activity" placeholder="Morning Yoga & Meditation" />
                          <LTInput value={s.description} onChange={v => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], description: v }; setF("dailySchedule", arr); }} label="Description" placeholder="Traditional Hatha Yoga Practice" multiline />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Curriculum ── */}
                  {activeFormTab === "curriculum" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Day-by-Day Curriculum</h3>
                        <button type="button" onClick={() => setF("curriculum", [...form.curriculum, { dayNumber: form.curriculum.length + 1, dayTitle: emptyLT(), description: emptyLT(), topics: [], learningOutcome: emptyLT(), images: [] }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Day
                        </button>
                      </div>
                      {form.curriculum.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No curriculum days yet.</p>}
                      {form.curriculum.map((day, i) => (
                        <div key={i} className="bg-green-50 border border-green-100 rounded p-4 space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-green-700 uppercase">Day {day.dayNumber}</span>
                            <button type="button" onClick={() => setF("curriculum", form.curriculum.filter((_,idx) => idx !== i))}
                              className="p-1 text-red-400 hover:text-red-600">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Day Number</label>
                            <input type="number" min="1" value={day.dayNumber}
                              onChange={e => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], dayNumber: Number(e.target.value) }; setF("curriculum", arr); }}
                              className="border p-2 rounded text-sm w-24 focus:outline-none focus:border-amber-400" />
                          </div>
                          <LTInput value={day.dayTitle} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], dayTitle: v }; setF("curriculum", arr); }} label="Day Title" placeholder="Arrival & Welcome" />
                          <LTInput value={day.description} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], description: v }; setF("curriculum", arr); }} label="Description" placeholder="Arrive, settle in, welcome dinner..." multiline />
                          <LTInput value={day.learningOutcome} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], learningOutcome: v }; setF("curriculum", arr); }} label="Learning Outcome" placeholder="Foundation in breath awareness and asana" />
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-500 uppercase text-[10px]">Topics / Highlights</span>
                              <button type="button" onClick={() => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], topics: [...arr[i].topics, emptyLT()] }; setF("curriculum", arr); }}
                                className="text-xs text-amber-600 font-bold flex items-center gap-0.5"><Plus className="w-3 h-3" /> Add</button>
                            </div>
                            {day.topics.map((t, ti) => (
                              <div key={ti} className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <LTInput value={t} onChange={v => { const arr = [...form.curriculum]; arr[i].topics[ti] = v; setF("curriculum", arr); }} label="" placeholder="Pranayama basics" />
                                </div>
                                <button type="button" onClick={() => { const arr = [...form.curriculum]; arr[i].topics = arr[i].topics.filter((_,ti2) => ti2 !== ti); setF("curriculum", arr); }}
                                  className="mt-1 p-1 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Excursions ── */}
                  {activeFormTab === "excursions" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Excursions Included</h3>
                        <button type="button" onClick={() => setF("excursions", [...form.excursions, { name: emptyLT(), duration: emptyLT(), description: emptyLT(), image: "", highlights: [], relatedTour: "", included: true }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Excursion
                        </button>
                      </div>
                      {form.excursions.map((exc, i) => (
                        <div key={i} className="bg-purple-50 border border-purple-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("excursions", form.excursions.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                          <LTInput value={exc.name} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], name: v }; setF("excursions", arr); }} label="Excursion Name" placeholder="Golden Island Experience" />
                          <LTInput value={exc.duration} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], duration: v }; setF("excursions", arr); }} label="Duration" placeholder="2-3 Hours" />
                          <LTInput value={exc.description} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], description: v }; setF("excursions", arr); }} label="Description" placeholder="Boat trip to Golden Island..." multiline />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Related Tour Package Slug</label>
                              <input type="text" value={exc.relatedTour} placeholder="golden-island-experience"
                                onChange={e => { const arr = [...form.excursions]; arr[i] = { ...arr[i], relatedTour: e.target.value }; setF("excursions", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                            <div className="flex items-center gap-2 pt-5">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={exc.included} onChange={e => { const arr = [...form.excursions]; arr[i] = { ...arr[i], included: e.target.checked }; setF("excursions", arr); }} className="w-4 h-4 accent-[#c5a880]" />
                                <span className="text-xs font-semibold text-gray-700">Included in retreat price</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Rooms ── */}
                  {activeFormTab === "rooms" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Accommodation Rooms</h3>
                        <button type="button" onClick={() => setF("rooms", [...form.rooms, { name: emptyLT(), image: "", description: emptyLT(), occupancy: 1, isPrivate: false, hasAC: false, hasBathroom: true, hasBalcony: false, hasWorkspace: false, hotWater: true, sharedPrice: 0, privatePrice: 0, features: [] }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Room
                        </button>
                      </div>
                      {form.rooms.map((room, i) => (
                        <div key={i} className="bg-orange-50 border border-orange-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("rooms", form.rooms.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                          <LTInput value={room.name} onChange={v => { const arr = [...form.rooms]; arr[i] = { ...arr[i], name: v }; setF("rooms", arr); }} label="Room Name" placeholder="Budget Room / Standard Room / Deluxe Balcony" />
                          <LTInput value={room.description} onChange={v => { const arr = [...form.rooms]; arr[i] = { ...arr[i], description: v }; setF("rooms", arr); }} label="Description" placeholder="Comfortable room with garden view..." multiline />
                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Occupancy</label>
                              <input type="number" min="1" value={room.occupancy}
                                onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], occupancy: Number(e.target.value) }; setF("rooms", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Shared Price (₹)</label>
                              <input type="number" min="0" value={room.sharedPrice}
                                onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], sharedPrice: Number(e.target.value) }; setF("rooms", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Private Price (₹)</label>
                              <input type="number" min="0" value={room.privatePrice}
                                onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], privatePrice: Number(e.target.value) }; setF("rooms", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            {[["isPrivate","Private Room"],["hasAC","Air Conditioning"],["hasBathroom","Bathroom"],["hasBalcony","Balcony"],["hasWorkspace","Workspace"],["hotWater","Hot Water"]].map(([k,l]) => (
                              <label key={k as string} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={!!(room as any)[k as string]}
                                  onChange={e => { const arr = [...form.rooms]; (arr[i] as any)[k as string] = e.target.checked; setF("rooms", arr); }}
                                  className="w-3.5 h-3.5 accent-[#c5a880]" />
                                <span className="text-xs font-medium text-gray-700">{l as string}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Meals ── */}
                  {activeFormTab === "meals" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Meal Plan</h3>
                        <button type="button" onClick={() => setF("meals", [...form.meals, { mealType: emptyLT(), description: emptyLT(), isVegan: true, isGlutenFree: false, isLactoseFree: false, gallery: [], menuItems: [] }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Meal
                        </button>
                      </div>
                      {form.meals.map((meal, i) => (
                        <div key={i} className="bg-teal-50 border border-teal-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("meals", form.meals.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                          <LTInput value={meal.mealType} onChange={v => { const arr = [...form.meals]; arr[i] = { ...arr[i], mealType: v }; setF("meals", arr); }} label="Meal Type" placeholder="Breakfast / Lunch / Dinner / Brunch" />
                          <LTInput value={meal.description} onChange={v => { const arr = [...form.meals]; arr[i] = { ...arr[i], description: v }; setF("meals", arr); }} label="Description" placeholder="Healthy vegetarian breakfast with local produce..." multiline />
                          <div className="flex flex-wrap gap-4">
                            {[["isVegan","Vegan"],["isGlutenFree","Gluten Free"],["isLactoseFree","Lactose Free"]].map(([k,l]) => (
                              <label key={k as string} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={!!(meal as any)[k as string]}
                                  onChange={e => { const arr = [...form.meals]; (arr[i] as any)[k as string] = e.target.checked; setF("meals", arr); }}
                                  className="w-3.5 h-3.5 accent-teal-500" />
                                <span className="text-xs font-medium text-gray-700">{l as string}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Yoga Program ── */}
                  {activeFormTab === "yoga" && (
                    <div className="space-y-5">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Yoga Program Details</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <LTInput value={form.yogaStyle} onChange={setLT("yogaStyle")} label="Yoga Style" placeholder="Traditional Hatha & Vinyasa" />
                        <LTInput value={form.morningSession} onChange={setLT("morningSession")} label="Morning Session" placeholder="06:00–08:00 AM — Hatha Yoga & Pranayama" />
                        <LTInput value={form.eveningSession} onChange={setLT("eveningSession")} label="Evening Session" placeholder="05:30–07:00 PM — Vinyasa Flow & Meditation" />
                        <LTInput value={form.meditation} onChange={setLT("meditation")} label="Meditation" placeholder="Guided meditation, mindfulness practices" />
                        <LTInput value={form.pranayama} onChange={setLT("pranayama")} label="Pranayama" placeholder="Nadi Shodhana, Kapalabhati, Anulom Vilom" />
                        <LTInput value={form.philosophy} onChange={setLT("philosophy")} label="Yoga Philosophy" placeholder="Introduction to Patanjali Yoga Sutras" />
                        <LTInput value={form.classLanguage} onChange={setLT("classLanguage")} label="Class Language" placeholder="English" />
                        <LTInput value={form.suitableFor} onChange={setLT("suitableFor")} label="Suitable For" placeholder="All levels, beginners welcome" />
                        <LTInput value={form.yogaCertificate} onChange={setLT("yogaCertificate")} label="Certificate" placeholder="Certificate of Completion provided" />
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">Total Yoga Hours</label>
                          <input type="number" min="0" value={form.yogaHours}
                            onChange={e => setF("yogaHours", Number(e.target.value))}
                            className="border p-2.5 rounded text-sm w-32 focus:outline-none focus:border-amber-400" />
                        </div>
                        <LTInput value={form.yogaDescription} onChange={setLT("yogaDescription")} label="Yoga Program Description" multiline placeholder="Full description of the yoga program..." />
                      </div>
                    </div>
                  )}

                  {/* ── Tab: Teachers ── */}
                  {activeFormTab === "teachers" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Retreat Teachers</h3>
                        <button type="button" onClick={() => setF("teachers", [...form.teachers, { name: "", photo: "", experience: "", specialization: emptyLT(), bio: emptyLT(), certificates: [], instagramUrl: "", facebookUrl: "", websiteUrl: "" }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Teacher
                        </button>
                      </div>
                      {form.teachers.map((t, i) => (
                        <div key={i} className="bg-indigo-50 border border-indigo-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("teachers", form.teachers.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Full Name</label>
                              <input type="text" value={t.name} placeholder="Yogi Arun Sharma"
                                onChange={e => { const arr = [...form.teachers]; arr[i] = { ...arr[i], name: e.target.value }; setF("teachers", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Experience</label>
                              <input type="text" value={t.experience} placeholder="15+ Years"
                                onChange={e => { const arr = [...form.teachers]; arr[i] = { ...arr[i], experience: e.target.value }; setF("teachers", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                          </div>
                          <LTInput value={t.specialization} onChange={v => { const arr = [...form.teachers]; arr[i] = { ...arr[i], specialization: v }; setF("teachers", arr); }} label="Specialization" placeholder="Ashtanga & Hatha Yoga Teacher" />
                          <LTInput value={t.bio} onChange={v => { const arr = [...form.teachers]; arr[i] = { ...arr[i], bio: v }; setF("teachers", arr); }} label="Bio" multiline placeholder="Arun has over 15 years of teaching experience..." />
                          <div className="grid grid-cols-3 gap-3">
                            {[["instagramUrl","Instagram URL"],["facebookUrl","Facebook URL"],["websiteUrl","Website URL"]].map(([k,l]) => (
                              <div key={k as string} className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase text-[10px]">{l as string}</label>
                                <input type="url" value={(t as any)[k as string]} placeholder="https://..."
                                  onChange={e => { const arr = [...form.teachers]; (arr[i] as any)[k as string] = e.target.value; setF("teachers", arr); }}
                                  className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-gray-400 italic">Teacher photo can be uploaded after saving (edit mode).</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Ayurveda ── */}
                  {activeFormTab === "ayurveda" && (
                    <div className="space-y-5">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Ayurvedic Wellness</h3>
                      <LTInput value={form.ayurvedaTitle} onChange={setLT("ayurvedaTitle")} label="Section Title" placeholder="Ayurvedic Wellness Treatments" />
                      <LTInput value={form.ayurvedaDescription} onChange={setLT("ayurvedaDescription")} label="Description" multiline placeholder="Experience traditional Kerala Ayurveda..." />
                      <div className="flex items-center justify-between border-t pt-4">
                        <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Treatments</span>
                        <button type="button" onClick={() => setF("ayurvedaTreatments", [...form.ayurvedaTreatments, { name: emptyLT(), description: emptyLT(), isOptional: true, extraCost: 0 }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Treatment
                        </button>
                      </div>
                      {form.ayurvedaTreatments.map((tr, i) => (
                        <div key={i} className="bg-green-50 border border-green-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("ayurvedaTreatments", form.ayurvedaTreatments.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                          <LTInput value={tr.name} onChange={v => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], name: v }; setF("ayurvedaTreatments", arr); }} label="Treatment Name" placeholder="Abhyanga Massage" />
                          <LTInput value={tr.description} onChange={v => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], description: v }; setF("ayurvedaTreatments", arr); }} label="Description" multiline placeholder="Full body warm oil massage..." />
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={tr.isOptional} onChange={e => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], isOptional: e.target.checked }; setF("ayurvedaTreatments", arr); }} className="w-3.5 h-3.5 accent-[#c5a880]" />
                              <span className="text-xs font-medium text-gray-700">Optional (add-on)</span>
                            </label>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Extra Cost (₹)</label>
                              <input type="number" min="0" value={tr.extraCost}
                                onChange={e => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], extraCost: Number(e.target.value) }; setF("ayurvedaTreatments", arr); }}
                                className="border p-2 rounded text-sm w-28 focus:outline-none focus:border-amber-400" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Tab: Pricing ── */}
                  {activeFormTab === "pricing" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Room-Based Pricing</h3>
                        <button type="button" onClick={() => setF("pricingRows", [...form.pricingRows, { roomCategory: emptyLT(), sharedPrice: 0, privatePrice: 0, availability: emptyLT(), upgradeCost: 0 }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Row
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead><tr className="border-b">
                            <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Room Category</th>
                            <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Shared (₹)</th>
                            <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Private (₹)</th>
                            <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Availability</th>
                            <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider">Upgrade Cost</th>
                            <th></th>
                          </tr></thead>
                          <tbody className="space-y-2">
                            {form.pricingRows.map((row, i) => (
                              <tr key={i} className="border-b border-gray-100">
                                <td className="py-2 pr-4 min-w-[160px]">
                                  <input type="text" value={row.roomCategory.en} placeholder="Budget Room"
                                    onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], roomCategory: { ...arr[i].roomCategory, en: e.target.value } }; setF("pricingRows", arr); }}
                                    className="border p-1.5 rounded w-full text-xs focus:outline-none focus:border-amber-400" />
                                </td>
                                <td className="py-2 pr-4">
                                  <input type="number" min="0" value={row.sharedPrice}
                                    onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], sharedPrice: Number(e.target.value) }; setF("pricingRows", arr); }}
                                    className="border p-1.5 rounded w-24 text-xs focus:outline-none focus:border-amber-400" />
                                </td>
                                <td className="py-2 pr-4">
                                  <input type="number" min="0" value={row.privatePrice}
                                    onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], privatePrice: Number(e.target.value) }; setF("pricingRows", arr); }}
                                    className="border p-1.5 rounded w-24 text-xs focus:outline-none focus:border-amber-400" />
                                </td>
                                <td className="py-2 pr-4">
                                  <input type="text" value={row.availability.en} placeholder="Available"
                                    onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], availability: { ...arr[i].availability, en: e.target.value } }; setF("pricingRows", arr); }}
                                    className="border p-1.5 rounded w-28 text-xs focus:outline-none focus:border-amber-400" />
                                </td>
                                <td className="py-2">
                                  <input type="number" min="0" value={row.upgradeCost}
                                    onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], upgradeCost: Number(e.target.value) }; setF("pricingRows", arr); }}
                                    className="border p-1.5 rounded w-24 text-xs focus:outline-none focus:border-amber-400" />
                                </td>
                                <td className="py-2 pl-2">
                                  <button type="button" onClick={() => setF("pricingRows", form.pricingRows.filter((_,idx) => idx !== i))}
                                    className="p-1 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── Tab: Checklists ── */}
                  {activeFormTab === "checklists" && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Checklists</h3>
                      <SimpleListEditor items={form.inclusions} onChange={v => setF("inclusions", v)} label="✅ What's Included" placeholder="Accommodation for 7 nights" />
                      <SimpleListEditor items={form.exclusions} onChange={v => setF("exclusions", v)} label="❌ What's Excluded" placeholder="International flights" />
                      <SimpleListEditor items={form.thingsToBring} onChange={v => setF("thingsToBring", v)} label="🎒 Things to Bring" placeholder="Comfortable yoga mat" />
                      <SimpleListEditor items={form.dressCode} onChange={v => setF("dressCode", v)} label="👗 Dress Code" placeholder="Comfortable, breathable yoga wear" />
                      <SimpleListEditor items={form.requirements} onChange={v => setF("requirements", v)} label="📋 Requirements" placeholder="No prior yoga experience needed" />
                      <SimpleListEditor items={form.whoShouldAvoid} onChange={v => setF("whoShouldAvoid", v)} label="⚠️ Who Should Avoid" placeholder="Recent surgery or injury" />
                    </div>
                  )}

                  {/* ── Tab: FAQs & Reviews ── */}
                  {activeFormTab === "faqs" && (
                    <div className="space-y-6">
                      {/* FAQs */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">FAQs</h3>
                          <button type="button" onClick={() => setF("faqs", [...form.faqs, { question: emptyLT(), answer: emptyLT() }])}
                            className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                            <Plus className="w-3 h-3" /> Add FAQ
                          </button>
                        </div>
                        {form.faqs.map((faq, i) => (
                          <div key={i} className="bg-yellow-50 border border-yellow-100 rounded p-4 space-y-3 relative">
                            <button type="button" onClick={() => setF("faqs", form.faqs.filter((_,idx) => idx !== i))}
                              className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                            <LTInput value={faq.question} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], question: v }; setF("faqs", arr); }} label="Question" placeholder="Is this suitable for beginners?" />
                            <LTInput value={faq.answer} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], answer: v }; setF("faqs", arr); }} label="Answer" multiline placeholder="Yes, absolutely! This retreat is designed for all levels..." />
                          </div>
                        ))}
                      </div>

                      {/* Reviews */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Guest Reviews</h3>
                          <button type="button" onClick={() => setF("reviews", [...form.reviews, { name: "", country: "", photo: "", stars: 5, review: emptyLT(), retreatJoined: "" }])}
                            className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                            <Plus className="w-3 h-3" /> Add Review
                          </button>
                        </div>
                        {form.reviews.map((rev, i) => (
                          <div key={i} className="bg-pink-50 border border-pink-100 rounded p-4 space-y-3 relative">
                            <button type="button" onClick={() => setF("reviews", form.reviews.filter((_,idx) => idx !== i))}
                              className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase text-[10px]">Name</label>
                                <input type="text" value={rev.name} placeholder="Sarah M."
                                  onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], name: e.target.value }; setF("reviews", arr); }}
                                  className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase text-[10px]">Country</label>
                                <input type="text" value={rev.country} placeholder="Australia"
                                  onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], country: e.target.value }; setF("reviews", arr); }}
                                  className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-gray-500 uppercase text-[10px]">Stars (1-5)</label>
                                <input type="number" min="1" max="5" value={rev.stars}
                                  onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], stars: Number(e.target.value) }; setF("reviews", arr); }}
                                  className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                              </div>
                            </div>
                            <LTInput value={rev.review} onChange={v => { const arr = [...form.reviews]; arr[i] = { ...arr[i], review: v }; setF("reviews", arr); }} label="Review Text" multiline placeholder="It was a life-changing experience..." />
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Retreat Joined</label>
                              <input type="text" value={rev.retreatJoined} placeholder="7-Day Yoga Retreat, Dec 2024"
                                onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], retreatJoined: e.target.value }; setF("reviews", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Tab: Booking & Settings ── */}
                  {activeFormTab === "booking" && (
                    <div className="space-y-5">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Booking Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <LTInput value={form.deposit} onChange={setLT("deposit")} label="Deposit Policy" placeholder="50% advance to confirm booking" />
                        <LTInput value={form.balancePayment} onChange={setLT("balancePayment")} label="Balance Payment" placeholder="Balance payment due on arrival" />
                        <LTInput value={form.cancellation} onChange={setLT("cancellation")} label="Cancellation Policy" placeholder="Free cancellation up to 7 days before arrival" />
                        <LTInput value={form.refund} onChange={setLT("refund")} label="Refund Policy" placeholder="Full refund for cancellations 14+ days before arrival" />
                        <LTInput value={form.pickup} onChange={setLT("pickup")} label="Airport Pickup" placeholder="Airport pickup included" />
                        <LTInput value={form.drop} onChange={setLT("drop")} label="Airport Drop" placeholder="Airport drop included" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[["checkIn","Check-in Time","12:00 PM"],["checkOut","Check-out Time","11:00 AM"],["emergencyContact","Emergency Contact",""]].map(([k,l,p]) => (
                          <div key={k as string} className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                            <input type="text" value={(form as any)[k as string] || ""} placeholder={p as string}
                              onChange={e => setF(k as keyof RetreatForm, e.target.value)}
                              className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        ))}
                      </div>
                      <LTInput value={form.medicalInfo} onChange={setLT("medicalInfo")} label="Medical Information Note" multiline placeholder="Please inform us of any medical conditions..." />
                      <LTInput value={form.specialRequests} onChange={setLT("specialRequests")} label="Special Requests Policy" multiline placeholder="We do our best to accommodate special requests..." />
                      <LTInput value={form.bookingTerms} onChange={setLT("bookingTerms")} label="Booking Terms" multiline placeholder="By booking, you agree to our terms and conditions..." />

                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2 pt-4">Retreat Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[["maxParticipants","Max Participants",20],["minParticipants","Min Participants",2]].map(([k,l,d]) => (
                          <div key={k as string} className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                            <input type="number" min="1" value={(form as any)[k as string] || d}
                              onChange={e => setF(k as keyof RetreatForm, Number(e.target.value))}
                              className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Available Dates (one per line)</label>
                        <textarea rows={4} value={form.availableDates.join("\n")}
                          onChange={e => setF("availableDates", e.target.value.split("\n").map(d => d.trim()).filter(Boolean))}
                          placeholder="2025-01-15&#10;2025-02-01&#10;2025-03-10"
                          className="border p-2.5 rounded text-sm font-mono focus:outline-none focus:border-amber-400" />
                      </div>

                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2 pt-4">Download Links</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[["brochureUrl","Brochure PDF URL"],["packingListUrl","Packing List PDF URL"],["schedulePdfUrl","Schedule PDF URL"],["termsPdfUrl","Terms PDF URL"]].map(([k,l]) => (
                          <div key={k as string} className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                            <input type="url" value={(form as any)[k as string] || ""} placeholder="https://..."
                              onChange={e => setF(k as keyof RetreatForm, e.target.value)}
                              className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Tab: SEO ── */}
                  {activeFormTab === "seo" && (
                    <div className="space-y-5">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">SEO & Meta</h3>
                      <LTInput value={form.metaTitle} onChange={setLT("metaTitle")} label="Meta Title" placeholder="7-Day Yoga Retreat in Varkala | Villa Lemon" />
                      <LTInput value={form.metaDescription} onChange={setLT("metaDescription")} label="Meta Description" multiline placeholder="Join our transformative yoga retreat in Varkala, Kerala..." />
                      <LTInput value={form.keywords} onChange={setLT("keywords")} label="Keywords" placeholder="yoga retreat kerala, varkala yoga, spiritual retreat india" />
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Canonical URL</label>
                        <input type="url" value={form.canonicalUrl} onChange={e => setF("canonicalUrl", e.target.value)}
                          placeholder="https://villalemon.com/en/retreats/varkala-yoga-retreat"
                          className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                    </div>
                  )}

                </div>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between shrink-0 rounded-b-md">
                <div className="flex gap-1.5 items-center">
                  {FORM_TABS.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveFormTab(tab.id)}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        activeFormTab === tab.id ? "bg-brand-gold scale-125" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      title={tab.label} />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={closeModal}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider text-xs cursor-pointer transition-colors">
                    Cancel
                  </button>
                  <button type="button" onClick={handleSubmit} disabled={saving}
                    className="px-6 py-2.5 bg-brand-gold hover:bg-[#b8943e] text-black font-bold rounded uppercase tracking-wider text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? "Saving..." : (editing ? "✓ Update Retreat" : "✓ Create Retreat")}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* ── Listing ── */}
      <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-serif text-lg font-semibold text-gray-800">Yoga Retreats</h3>
            <p className="text-xs text-gray-500 mt-1">Full-featured retreat management — schedules, rooms, meals, teachers, pricing & more.</p>
          </div>
          <button onClick={openCreate}
            className="self-start sm:self-auto flex items-center gap-1 bg-brand-gold hover:bg-[#b8943e] text-black font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-sm transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> New Retreat
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-brand-gold animate-spin" /></div>
        ) : retreats.length === 0 ? (
          <div className="py-16 text-center">
            <Sun className="w-12 h-12 text-amber-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No retreats yet. Create your first retreat above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {retreats.map(r => (
              <div key={r._id} className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-36 bg-gray-100">
                  {r.heroImage ? (
                    <img src={r.heroImage} alt={r.heroTitle?.en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Sun className="w-10 h-10 text-gray-300" /></div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${r.status === "published" ? "bg-green-500 text-white" : r.status === "archived" ? "bg-gray-400 text-white" : "bg-yellow-400 text-black"}`}>
                      {r.status}
                    </span>
                    {r.featured && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">Featured</span>}
                    {r.isSoldOut && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500 text-white">Sold Out</span>}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-bold text-sm text-gray-800 leading-tight line-clamp-1">{r.heroTitle?.en || "Untitled Retreat"}</h4>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">{r.tagline?.en || r.yogaLevel?.en || ""}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.days}D / {r.nights}N</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.groupSize?.en || `Max ${r.maxCapacity}`}</span>
                    {r.price > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ₹{r.price.toLocaleString()}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => openEdit(r)}
                      className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 hover:text-amber-900 border border-amber-200 hover:border-amber-400 rounded py-1.5 transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <a href={`/en/retreats/${r.slug}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded border border-gray-200 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => handleDelete(r._id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded border border-red-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Full-screen Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-stretch overflow-hidden">
          <div className="bg-white w-full flex flex-col max-h-screen">

            {/* Modal header */}
            <div className="bg-[#121212] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-serif text-lg">{editing ? "Edit Retreat" : "New Yoga Retreat"}</h2>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest mt-0.5">17-section CMS · All localized · Cloudinary media</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab bar */}
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-2.5 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              {FORM_TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} type="button" onClick={() => setActiveFormTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      activeFormTab === tab.id
                        ? "bg-brand-gold text-black shadow-sm"
                        : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    }`}>
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">

                {/* ── Tab: General Info ── */}
                {activeFormTab === "general" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">General Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Slug <span className="text-red-400">*</span></label>
                        <input type="text" required value={form.slug} onChange={e => setF("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                          placeholder="varkala-yoga-spiritual-retreat"
                          className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Status</label>
                        <select value={form.status} onChange={e => setF("status", e.target.value as any)}
                          className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {[["days","Days",7],["nights","Nights",7],["price","Starting Price (₹)",0],["displayOrder","Display Order",0]].map(([k,l,d]) => (
                        <div key={k as string} className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                          <input type="number" min="0" value={(form as any)[k as string] || d}
                            onChange={e => setF(k as keyof RetreatForm, Number(e.target.value))}
                            className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[["minAge","Min Age",18],["maxCapacity","Max Capacity",20],["yogaHours","Yoga Hours",0]].map(([k,l,d]) => (
                        <div key={k as string} className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                          <input type="number" min="0" value={(form as any)[k as string] || d}
                            onChange={e => setF(k as keyof RetreatForm, Number(e.target.value))}
                            className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <LTInput value={form.location} onChange={setLT("location")} label="Location" placeholder="Varkala, Kerala" />
                      <LTInput value={form.difficulty} onChange={setLT("difficulty")} label="Difficulty" placeholder="Beginner Friendly" />
                      <LTInput value={form.yogaLevel} onChange={setLT("yogaLevel")} label="Yoga Level" placeholder="All Levels" />
                      <LTInput value={form.language} onChange={setLT("language")} label="Language" placeholder="English" />
                      <LTInput value={form.groupSize} onChange={setLT("groupSize")} label="Group Size" placeholder="3-12 People" />
                      <LTInput value={form.accommodationType} onChange={setLT("accommodationType")} label="Accommodation Type" placeholder="Budget / Standard / Deluxe" />
                    </div>
                    <div className="flex flex-wrap gap-5">
                      {[
                        ["certificate","Certificate Provided","boolean"],
                        ["featured","Featured Retreat","boolean"],
                        ["isPopular","Mark as Popular","boolean"],
                        ["isSoldOut","Sold Out","boolean"],
                        ["isUpcoming","Upcoming","boolean"],
                        ["bookingOpen","Booking Open","boolean"],
                      ].map(([k, l]) => (
                        <label key={k as string} className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="checkbox" checked={!!(form as any)[k as string]}
                            onChange={e => setF(k as keyof RetreatForm, e.target.checked)}
                            className="w-4 h-4 accent-[#c5a880]" />
                          <span className="text-xs font-semibold text-gray-700">{l as string}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Tab: Content ── */}
                {activeFormTab === "content" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Content & Descriptions</h3>
                    <LTInput value={form.heroTitle} onChange={setLT("heroTitle")} label="Hero Title" placeholder="Varkala Yoga, Spiritual & Nature Retreat" required multiline />
                    <LTInput value={form.heroSubtitle} onChange={setLT("heroSubtitle")} label="Hero Subtitle" placeholder="Reconnect · Rejuvenate · Transform" />
                    <LTInput value={form.tagline} onChange={setLT("tagline")} label="Tagline" placeholder="A transformative 8-day wellness journey..." />
                    <LTInput value={form.shortDescription} onChange={setLT("shortDescription")} label="Short Description" placeholder="Short summary shown in cards..." multiline />
                    <LTInput value={form.fullDescription} onChange={setLT("fullDescription")} label="Full Description" placeholder="Full about text..." multiline />
                    <LTInput value={form.retreatOverview} onChange={setLT("retreatOverview")} label="Retreat Overview" placeholder="Retreat overview paragraph..." multiline />
                    <LTInput value={form.whyChoose} onChange={setLT("whyChoose")} label="Why Choose This Retreat" placeholder="Why this retreat stands out..." multiline />
                    <LTInput value={form.whoIsItFor} onChange={setLT("whoIsItFor")} label="Who Is This For" placeholder="Perfect for beginners and experienced practitioners..." multiline />
                    <LTInput value={form.bestTime} onChange={setLT("bestTime")} label="Best Time to Join" placeholder="October to March" />
                    <LTInput value={form.cta} onChange={setLT("cta")} label="CTA Button Text" placeholder="Book Now" />
                  </div>
                )}

                {/* ── Tab: Media ── */}
                {activeFormTab === "media" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Media</h3>
                    <div className="space-y-2">
                      <label className="font-bold text-gray-600 uppercase text-[10px]">Hero Image <span className="text-red-400">*</span></label>
                      <div className="flex items-center gap-4">
                        {heroImagePreview && (
                          <div className="w-32 aspect-video rounded border overflow-hidden shrink-0">
                            <img src={heroImagePreview} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <label className="flex-1 border-2 border-dashed border-gray-300 hover:border-amber-400 rounded p-4 cursor-pointer text-center bg-white hover:bg-amber-50 transition-colors">
                          <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <span className="text-xs text-gray-500 font-medium">Upload Hero Image</span>
                          <input type="file" accept="image/*" onChange={handleHeroImageChange} className="hidden" required={!editing} />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase text-[10px]">Video URL (YouTube/Vimeo)</label>
                      <input type="url" value={form.video} onChange={e => setF("video", e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase text-[10px]">Retreat Map URL</label>
                      <input type="url" value={form.retreatMap} onChange={e => setF("retreatMap", e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <p className="text-xs text-gray-400 italic">Gallery images per category can be added after creating the retreat (edit mode).</p>
                  </div>
                )}

                {/* ── Tab: Highlights ── */}
                {activeFormTab === "highlights" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Retreat Highlights</h3>
                      <button type="button" onClick={() => setF("highlights", [...form.highlights, { icon: "Star", title: emptyLT(), description: emptyLT() }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Highlight
                      </button>
                    </div>
                    {form.highlights.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No highlights yet. Add your first highlight above.</p>}
                    {form.highlights.map((h, i) => (
                      <div key={i} className="bg-amber-50 border border-amber-100 rounded p-4 space-y-3 relative">
                        <button type="button" onClick={() => setF("highlights", form.highlights.filter((_,idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase text-[10px]">Icon name (Lucide icon)</label>
                          <input type="text" value={h.icon} placeholder="e.g. Sun, Leaf, Award, Heart"
                            onChange={e => { const arr = [...form.highlights]; arr[i] = { ...arr[i], icon: e.target.value }; setF("highlights", arr); }}
                            className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                        <LTInput value={h.title} onChange={v => { const arr = [...form.highlights]; arr[i] = { ...arr[i], title: v }; setF("highlights", arr); }} label="Title" placeholder="Daily Yoga" />
                        <LTInput value={h.description} onChange={v => { const arr = [...form.highlights]; arr[i] = { ...arr[i], description: v }; setF("highlights", arr); }} label="Description" placeholder="Traditional Hatha & Vinyasa yoga practice twice daily" multiline />
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Daily Schedule ── */}
                {activeFormTab === "schedule" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Daily Schedule</h3>
                      <button type="button" onClick={() => setF("dailySchedule", [...form.dailySchedule, { time: "", activity: emptyLT(), description: emptyLT(), icon: "Clock" }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Time Slot
                      </button>
                    </div>
                    {form.dailySchedule.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No schedule items yet.</p>}
                    {form.dailySchedule.map((s, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-100 rounded p-4 space-y-3 relative">
                        <button type="button" onClick={() => setF("dailySchedule", form.dailySchedule.filter((_,idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Time</label>
                            <input type="text" value={s.time} placeholder="06:00 AM"
                              onChange={e => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], time: e.target.value }; setF("dailySchedule", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Icon (Lucide)</label>
                            <input type="text" value={s.icon} placeholder="Sun, Coffee, Moon..."
                              onChange={e => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], icon: e.target.value }; setF("dailySchedule", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        </div>
                        <LTInput value={s.activity} onChange={v => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], activity: v }; setF("dailySchedule", arr); }} label="Activity" placeholder="Morning Yoga & Meditation" />
                        <LTInput value={s.description} onChange={v => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], description: v }; setF("dailySchedule", arr); }} label="Description" placeholder="Traditional Hatha Yoga Practice" multiline />
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Curriculum ── */}
                {activeFormTab === "curriculum" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Day-by-Day Curriculum</h3>
                      <button type="button" onClick={() => setF("curriculum", [...form.curriculum, { dayNumber: form.curriculum.length + 1, dayTitle: emptyLT(), description: emptyLT(), topics: [], learningOutcome: emptyLT(), images: [] }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Day
                      </button>
                    </div>
                    {form.curriculum.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No curriculum days yet.</p>}
                    {form.curriculum.map((day, i) => (
                      <div key={i} className="bg-green-50 border border-green-100 rounded p-4 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-green-700 uppercase">Day {day.dayNumber}</span>
                          <button type="button" onClick={() => setF("curriculum", form.curriculum.filter((_,idx) => idx !== i))}
                            className="p-1 text-red-400 hover:text-red-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase text-[10px]">Day Number</label>
                          <input type="number" min="1" value={day.dayNumber}
                            onChange={e => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], dayNumber: Number(e.target.value) }; setF("curriculum", arr); }}
                            className="border p-2 rounded text-sm w-24 focus:outline-none focus:border-amber-400" />
                        </div>
                        <LTInput value={day.dayTitle} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], dayTitle: v }; setF("curriculum", arr); }} label="Day Title" placeholder="Arrival & Welcome" />
                        <LTInput value={day.description} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], description: v }; setF("curriculum", arr); }} label="Description" placeholder="Arrive, settle in, welcome dinner..." multiline />
                        <LTInput value={day.learningOutcome} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], learningOutcome: v }; setF("curriculum", arr); }} label="Learning Outcome" placeholder="Foundation in breath awareness and asana" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-500 uppercase text-[10px]">Topics / Highlights</span>
                            <button type="button" onClick={() => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], topics: [...arr[i].topics, emptyLT()] }; setF("curriculum", arr); }}
                              className="text-xs text-amber-600 font-bold flex items-center gap-0.5"><Plus className="w-3 h-3" /> Add</button>
                          </div>
                          {day.topics.map((t, ti) => (
                            <div key={ti} className="flex gap-2 items-start">
                              <div className="flex-1">
                                <LTInput value={t} onChange={v => { const arr = [...form.curriculum]; arr[i].topics[ti] = v; setF("curriculum", arr); }} label="" placeholder="Pranayama basics" />
                              </div>
                              <button type="button" onClick={() => { const arr = [...form.curriculum]; arr[i].topics = arr[i].topics.filter((_,ti2) => ti2 !== ti); setF("curriculum", arr); }}
                                className="mt-1 p-1 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Excursions ── */}
                {activeFormTab === "excursions" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Excursions Included</h3>
                      <button type="button" onClick={() => setF("excursions", [...form.excursions, { name: emptyLT(), duration: emptyLT(), description: emptyLT(), image: "", highlights: [], relatedTour: "", included: true }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Excursion
                      </button>
                    </div>
                    {form.excursions.map((exc, i) => (
                      <div key={i} className="bg-purple-50 border border-purple-100 rounded p-4 space-y-3 relative">
                        <button type="button" onClick={() => setF("excursions", form.excursions.filter((_,idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                        <LTInput value={exc.name} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], name: v }; setF("excursions", arr); }} label="Excursion Name" placeholder="Golden Island Experience" />
                        <LTInput value={exc.duration} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], duration: v }; setF("excursions", arr); }} label="Duration" placeholder="2-3 Hours" />
                        <LTInput value={exc.description} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], description: v }; setF("excursions", arr); }} label="Description" placeholder="Boat trip to Golden Island..." multiline />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Related Tour Package Slug</label>
                            <input type="text" value={exc.relatedTour} placeholder="golden-island-experience"
                              onChange={e => { const arr = [...form.excursions]; arr[i] = { ...arr[i], relatedTour: e.target.value }; setF("excursions", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                          <div className="flex items-center gap-2 pt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={exc.included} onChange={e => { const arr = [...form.excursions]; arr[i] = { ...arr[i], included: e.target.checked }; setF("excursions", arr); }} className="w-4 h-4 accent-[#c5a880]" />
                              <span className="text-xs font-semibold text-gray-700">Included in retreat price</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Rooms ── */}
                {activeFormTab === "rooms" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Accommodation Rooms</h3>
                      <button type="button" onClick={() => setF("rooms", [...form.rooms, { name: emptyLT(), image: "", description: emptyLT(), occupancy: 1, isPrivate: false, hasAC: false, hasBathroom: true, hasBalcony: false, hasWorkspace: false, hotWater: true, sharedPrice: 0, privatePrice: 0, features: [] }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Room
                      </button>
                    </div>
                    {form.rooms.map((room, i) => (
                      <div key={i} className="bg-orange-50 border border-orange-100 rounded p-4 space-y-3 relative">
                        <button type="button" onClick={() => setF("rooms", form.rooms.filter((_,idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                        <LTInput value={room.name} onChange={v => { const arr = [...form.rooms]; arr[i] = { ...arr[i], name: v }; setF("rooms", arr); }} label="Room Name" placeholder="Budget Room / Standard Room / Deluxe Balcony" />
                        <LTInput value={room.description} onChange={v => { const arr = [...form.rooms]; arr[i] = { ...arr[i], description: v }; setF("rooms", arr); }} label="Description" placeholder="Comfortable room with garden view..." multiline />
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Occupancy</label>
                            <input type="number" min="1" value={room.occupancy}
                              onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], occupancy: Number(e.target.value) }; setF("rooms", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Shared Price (₹)</label>
                            <input type="number" min="0" value={room.sharedPrice}
                              onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], sharedPrice: Number(e.target.value) }; setF("rooms", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Private Price (₹)</label>
                            <input type="number" min="0" value={room.privatePrice}
                              onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], privatePrice: Number(e.target.value) }; setF("rooms", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {[["isPrivate","Private Room"],["hasAC","Air Conditioning"],["hasBathroom","Bathroom"],["hasBalcony","Balcony"],["hasWorkspace","Workspace"],["hotWater","Hot Water"]].map(([k,l]) => (
                            <label key={k as string} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={!!(room as any)[k as string]}
                                onChange={e => { const arr = [...form.rooms]; (arr[i] as any)[k as string] = e.target.checked; setF("rooms", arr); }}
                                className="w-3.5 h-3.5 accent-[#c5a880]" />
                              <span className="text-xs font-medium text-gray-700">{l as string}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Meals ── */}
                {activeFormTab === "meals" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Meal Plan</h3>
                      <button type="button" onClick={() => setF("meals", [...form.meals, { mealType: emptyLT(), description: emptyLT(), isVegan: true, isGlutenFree: false, isLactoseFree: false, gallery: [], menuItems: [] }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Meal
                      </button>
                    </div>
                    {form.meals.map((meal, i) => (
                      <div key={i} className="bg-teal-50 border border-teal-100 rounded p-4 space-y-3 relative">
                        <button type="button" onClick={() => setF("meals", form.meals.filter((_,idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                        <LTInput value={meal.mealType} onChange={v => { const arr = [...form.meals]; arr[i] = { ...arr[i], mealType: v }; setF("meals", arr); }} label="Meal Type" placeholder="Breakfast / Lunch / Dinner / Brunch" />
                        <LTInput value={meal.description} onChange={v => { const arr = [...form.meals]; arr[i] = { ...arr[i], description: v }; setF("meals", arr); }} label="Description" placeholder="Healthy vegetarian breakfast with local produce..." multiline />
                        <div className="flex flex-wrap gap-4">
                          {[["isVegan","Vegan"],["isGlutenFree","Gluten Free"],["isLactoseFree","Lactose Free"]].map(([k,l]) => (
                            <label key={k as string} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={!!(meal as any)[k as string]}
                                onChange={e => { const arr = [...form.meals]; (arr[i] as any)[k as string] = e.target.checked; setF("meals", arr); }}
                                className="w-3.5 h-3.5 accent-teal-500" />
                              <span className="text-xs font-medium text-gray-700">{l as string}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Yoga Program ── */}
                {activeFormTab === "yoga" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Yoga Program Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <LTInput value={form.yogaStyle} onChange={setLT("yogaStyle")} label="Yoga Style" placeholder="Traditional Hatha & Vinyasa" />
                      <LTInput value={form.morningSession} onChange={setLT("morningSession")} label="Morning Session" placeholder="06:00–08:00 AM — Hatha Yoga & Pranayama" />
                      <LTInput value={form.eveningSession} onChange={setLT("eveningSession")} label="Evening Session" placeholder="05:30–07:00 PM — Vinyasa Flow & Meditation" />
                      <LTInput value={form.meditation} onChange={setLT("meditation")} label="Meditation" placeholder="Guided meditation, mindfulness practices" />
                      <LTInput value={form.pranayama} onChange={setLT("pranayama")} label="Pranayama" placeholder="Nadi Shodhana, Kapalabhati, Anulom Vilom" />
                      <LTInput value={form.philosophy} onChange={setLT("philosophy")} label="Yoga Philosophy" placeholder="Introduction to Patanjali Yoga Sutras" />
                      <LTInput value={form.classLanguage} onChange={setLT("classLanguage")} label="Class Language" placeholder="English" />
                      <LTInput value={form.suitableFor} onChange={setLT("suitableFor")} label="Suitable For" placeholder="All levels, beginners welcome" />
                      <LTInput value={form.yogaCertificate} onChange={setLT("yogaCertificate")} label="Certificate" placeholder="Certificate of Completion provided" />
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase text-[10px]">Total Yoga Hours</label>
                        <input type="number" min="0" value={form.yogaHours}
                          onChange={e => setF("yogaHours", Number(e.target.value))}
                          className="border p-2.5 rounded text-sm w-32 focus:outline-none focus:border-amber-400" />
                      </div>
                      <LTInput value={form.yogaDescription} onChange={setLT("yogaDescription")} label="Yoga Program Description" multiline placeholder="Full description of the yoga program..." />
                    </div>
                  </div>
                )}

                {/* ── Tab: Teachers ── */}
                {activeFormTab === "teachers" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Retreat Teachers</h3>
                      <button type="button" onClick={() => setF("teachers", [...form.teachers, { name: "", photo: "", experience: "", specialization: emptyLT(), bio: emptyLT(), certificates: [], instagramUrl: "", facebookUrl: "", websiteUrl: "" }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Teacher
                      </button>
                    </div>
                    {form.teachers.map((t, i) => (
                      <div key={i} className="bg-indigo-50 border border-indigo-100 rounded p-4 space-y-3 relative">
                        <button type="button" onClick={() => setF("teachers", form.teachers.filter((_,idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Full Name</label>
                            <input type="text" value={t.name} placeholder="Yogi Arun Sharma"
                              onChange={e => { const arr = [...form.teachers]; arr[i] = { ...arr[i], name: e.target.value }; setF("teachers", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Experience</label>
                            <input type="text" value={t.experience} placeholder="15+ Years"
                              onChange={e => { const arr = [...form.teachers]; arr[i] = { ...arr[i], experience: e.target.value }; setF("teachers", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        </div>
                        <LTInput value={t.specialization} onChange={v => { const arr = [...form.teachers]; arr[i] = { ...arr[i], specialization: v }; setF("teachers", arr); }} label="Specialization" placeholder="Ashtanga & Hatha Yoga Teacher" />
                        <LTInput value={t.bio} onChange={v => { const arr = [...form.teachers]; arr[i] = { ...arr[i], bio: v }; setF("teachers", arr); }} label="Bio" multiline placeholder="Arun has over 15 years of teaching experience..." />
                        <div className="grid grid-cols-3 gap-3">
                          {[["instagramUrl","Instagram URL"],["facebookUrl","Facebook URL"],["websiteUrl","Website URL"]].map(([k,l]) => (
                            <div key={k as string} className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">{l as string}</label>
                              <input type="url" value={(t as any)[k as string]} placeholder="https://..."
                                onChange={e => { const arr = [...form.teachers]; (arr[i] as any)[k as string] = e.target.value; setF("teachers", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 italic">Teacher photo can be uploaded after saving (edit mode).</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Ayurveda ── */}
                {activeFormTab === "ayurveda" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Ayurvedic Wellness</h3>
                    <LTInput value={form.ayurvedaTitle} onChange={setLT("ayurvedaTitle")} label="Section Title" placeholder="Ayurvedic Wellness Treatments" />
                    <LTInput value={form.ayurvedaDescription} onChange={setLT("ayurvedaDescription")} label="Description" multiline placeholder="Experience traditional Kerala Ayurveda..." />
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Treatments</span>
                      <button type="button" onClick={() => setF("ayurvedaTreatments", [...form.ayurvedaTreatments, { name: emptyLT(), description: emptyLT(), isOptional: true, extraCost: 0 }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Treatment
                      </button>
                    </div>
                    {form.ayurvedaTreatments.map((tr, i) => (
                      <div key={i} className="bg-green-50 border border-green-100 rounded p-4 space-y-3 relative">
                        <button type="button" onClick={() => setF("ayurvedaTreatments", form.ayurvedaTreatments.filter((_,idx) => idx !== i))}
                          className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                        <LTInput value={tr.name} onChange={v => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], name: v }; setF("ayurvedaTreatments", arr); }} label="Treatment Name" placeholder="Abhyanga Massage" />
                        <LTInput value={tr.description} onChange={v => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], description: v }; setF("ayurvedaTreatments", arr); }} label="Description" multiline placeholder="Full body warm oil massage..." />
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={tr.isOptional} onChange={e => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], isOptional: e.target.checked }; setF("ayurvedaTreatments", arr); }} className="w-3.5 h-3.5 accent-[#c5a880]" />
                            <span className="text-xs font-medium text-gray-700">Optional (add-on)</span>
                          </label>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Extra Cost (₹)</label>
                            <input type="number" min="0" value={tr.extraCost}
                              onChange={e => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], extraCost: Number(e.target.value) }; setF("ayurvedaTreatments", arr); }}
                              className="border p-2 rounded text-sm w-28 focus:outline-none focus:border-amber-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tab: Pricing ── */}
                {activeFormTab === "pricing" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Room-Based Pricing</h3>
                      <button type="button" onClick={() => setF("pricingRows", [...form.pricingRows, { roomCategory: emptyLT(), sharedPrice: 0, privatePrice: 0, availability: emptyLT(), upgradeCost: 0 }])}
                        className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                        <Plus className="w-3 h-3" /> Add Row
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="border-b">
                          <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Room Category</th>
                          <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Shared (₹)</th>
                          <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Private (₹)</th>
                          <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider pr-4">Availability</th>
                          <th className="text-left py-2 font-bold text-gray-600 uppercase tracking-wider">Upgrade Cost</th>
                          <th></th>
                        </tr></thead>
                        <tbody className="space-y-2">
                          {form.pricingRows.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100">
                              <td className="py-2 pr-4 min-w-[160px]">
                                <input type="text" value={row.roomCategory.en} placeholder="Budget Room"
                                  onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], roomCategory: { ...arr[i].roomCategory, en: e.target.value } }; setF("pricingRows", arr); }}
                                  className="border p-1.5 rounded w-full text-xs focus:outline-none focus:border-amber-400" />
                              </td>
                              <td className="py-2 pr-4">
                                <input type="number" min="0" value={row.sharedPrice}
                                  onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], sharedPrice: Number(e.target.value) }; setF("pricingRows", arr); }}
                                  className="border p-1.5 rounded w-24 text-xs focus:outline-none focus:border-amber-400" />
                              </td>
                              <td className="py-2 pr-4">
                                <input type="number" min="0" value={row.privatePrice}
                                  onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], privatePrice: Number(e.target.value) }; setF("pricingRows", arr); }}
                                  className="border p-1.5 rounded w-24 text-xs focus:outline-none focus:border-amber-400" />
                              </td>
                              <td className="py-2 pr-4">
                                <input type="text" value={row.availability.en} placeholder="Available"
                                  onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], availability: { ...arr[i].availability, en: e.target.value } }; setF("pricingRows", arr); }}
                                  className="border p-1.5 rounded w-28 text-xs focus:outline-none focus:border-amber-400" />
                              </td>
                              <td className="py-2">
                                <input type="number" min="0" value={row.upgradeCost}
                                  onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], upgradeCost: Number(e.target.value) }; setF("pricingRows", arr); }}
                                  className="border p-1.5 rounded w-24 text-xs focus:outline-none focus:border-amber-400" />
                              </td>
                              <td className="py-2 pl-2">
                                <button type="button" onClick={() => setF("pricingRows", form.pricingRows.filter((_,idx) => idx !== i))}
                                  className="p-1 text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Tab: Checklists ── */}
                {activeFormTab === "checklists" && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Checklists</h3>
                    <SimpleListEditor items={form.inclusions} onChange={v => setF("inclusions", v)} label="✅ What's Included" placeholder="Accommodation for 7 nights" />
                    <SimpleListEditor items={form.exclusions} onChange={v => setF("exclusions", v)} label="❌ What's Excluded" placeholder="International flights" />
                    <SimpleListEditor items={form.thingsToBring} onChange={v => setF("thingsToBring", v)} label="🎒 Things to Bring" placeholder="Comfortable yoga mat" />
                    <SimpleListEditor items={form.dressCode} onChange={v => setF("dressCode", v)} label="👗 Dress Code" placeholder="Comfortable, breathable yoga wear" />
                    <SimpleListEditor items={form.requirements} onChange={v => setF("requirements", v)} label="📋 Requirements" placeholder="No prior yoga experience needed" />
                    <SimpleListEditor items={form.whoShouldAvoid} onChange={v => setF("whoShouldAvoid", v)} label="⚠️ Who Should Avoid" placeholder="Recent surgery or injury" />
                  </div>
                )}

                {/* ── Tab: FAQs & Reviews ── */}
                {activeFormTab === "faqs" && (
                  <div className="space-y-6">
                    {/* FAQs */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">FAQs</h3>
                        <button type="button" onClick={() => setF("faqs", [...form.faqs, { question: emptyLT(), answer: emptyLT() }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add FAQ
                        </button>
                      </div>
                      {form.faqs.map((faq, i) => (
                        <div key={i} className="bg-yellow-50 border border-yellow-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("faqs", form.faqs.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                          <LTInput value={faq.question} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], question: v }; setF("faqs", arr); }} label="Question" placeholder="Is this suitable for beginners?" />
                          <LTInput value={faq.answer} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], answer: v }; setF("faqs", arr); }} label="Answer" multiline placeholder="Yes, absolutely! This retreat is designed for all levels..." />
                        </div>
                      ))}
                    </div>

                    {/* Reviews */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">Guest Reviews</h3>
                        <button type="button" onClick={() => setF("reviews", [...form.reviews, { name: "", country: "", photo: "", stars: 5, review: emptyLT(), retreatJoined: "" }])}
                          className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                          <Plus className="w-3 h-3" /> Add Review
                        </button>
                      </div>
                      {form.reviews.map((rev, i) => (
                        <div key={i} className="bg-pink-50 border border-pink-100 rounded p-4 space-y-3 relative">
                          <button type="button" onClick={() => setF("reviews", form.reviews.filter((_,idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1 text-red-400"><X className="w-3.5 h-3.5" /></button>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Name</label>
                              <input type="text" value={rev.name} placeholder="Sarah M."
                                onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], name: e.target.value }; setF("reviews", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Country</label>
                              <input type="text" value={rev.country} placeholder="Australia"
                                onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], country: e.target.value }; setF("reviews", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Stars (1-5)</label>
                              <input type="number" min="1" max="5" value={rev.stars}
                                onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], stars: Number(e.target.value) }; setF("reviews", arr); }}
                                className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                            </div>
                          </div>
                          <LTInput value={rev.review} onChange={v => { const arr = [...form.reviews]; arr[i] = { ...arr[i], review: v }; setF("reviews", arr); }} label="Review Text" multiline placeholder="It was a life-changing experience..." />
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-500 uppercase text-[10px]">Retreat Joined</label>
                            <input type="text" value={rev.retreatJoined} placeholder="7-Day Yoga Retreat, Dec 2024"
                              onChange={e => { const arr = [...form.reviews]; arr[i] = { ...arr[i], retreatJoined: e.target.value }; setF("reviews", arr); }}
                              className="border p-2 rounded text-sm focus:outline-none focus:border-amber-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Tab: Booking & Settings ── */}
                {activeFormTab === "booking" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">Booking Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <LTInput value={form.deposit} onChange={setLT("deposit")} label="Deposit Policy" placeholder="50% advance to confirm booking" />
                      <LTInput value={form.balancePayment} onChange={setLT("balancePayment")} label="Balance Payment" placeholder="Balance payment due on arrival" />
                      <LTInput value={form.cancellation} onChange={setLT("cancellation")} label="Cancellation Policy" placeholder="Free cancellation up to 7 days before arrival" />
                      <LTInput value={form.refund} onChange={setLT("refund")} label="Refund Policy" placeholder="Full refund for cancellations 14+ days before arrival" />
                      <LTInput value={form.pickup} onChange={setLT("pickup")} label="Airport Pickup" placeholder="Airport pickup included" />
                      <LTInput value={form.drop} onChange={setLT("drop")} label="Airport Drop" placeholder="Airport drop included" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[["checkIn","Check-in Time","12:00 PM"],["checkOut","Check-out Time","11:00 AM"],["emergencyContact","Emergency Contact",""]].map(([k,l,p]) => (
                        <div key={k as string} className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                          <input type="text" value={(form as any)[k as string] || ""} placeholder={p as string}
                            onChange={e => setF(k as keyof RetreatForm, e.target.value)}
                            className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                      ))}
                    </div>
                    <LTInput value={form.medicalInfo} onChange={setLT("medicalInfo")} label="Medical Information Note" multiline placeholder="Please inform us of any medical conditions..." />
                    <LTInput value={form.specialRequests} onChange={setLT("specialRequests")} label="Special Requests Policy" multiline placeholder="We do our best to accommodate special requests..." />
                    <LTInput value={form.bookingTerms} onChange={setLT("bookingTerms")} label="Booking Terms" multiline placeholder="By booking, you agree to our terms and conditions..." />

                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2 pt-4">Retreat Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[["maxParticipants","Max Participants",20],["minParticipants","Min Participants",2]].map(([k,l,d]) => (
                        <div key={k as string} className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                          <input type="number" min="1" value={(form as any)[k as string] || d}
                            onChange={e => setF(k as keyof RetreatForm, Number(e.target.value))}
                            className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase text-[10px]">Available Dates (one per line)</label>
                      <textarea rows={4} value={form.availableDates.join("\n")}
                        onChange={e => setF("availableDates", e.target.value.split("\n").map(d => d.trim()).filter(Boolean))}
                        placeholder="2025-01-15&#10;2025-02-01&#10;2025-03-10"
                        className="border p-2.5 rounded text-sm font-mono focus:outline-none focus:border-amber-400" />
                    </div>

                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2 pt-4">Download Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[["brochureUrl","Brochure PDF URL"],["packingListUrl","Packing List PDF URL"],["schedulePdfUrl","Schedule PDF URL"],["termsPdfUrl","Terms PDF URL"]].map(([k,l]) => (
                        <div key={k as string} className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase text-[10px]">{l as string}</label>
                          <input type="url" value={(form as any)[k as string] || ""} placeholder="https://..."
                            onChange={e => setF(k as keyof RetreatForm, e.target.value)}
                            className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Tab: SEO ── */}
                {activeFormTab === "seo" && (
                  <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest border-b pb-2">SEO & Meta</h3>
                    <LTInput value={form.metaTitle} onChange={setLT("metaTitle")} label="Meta Title" placeholder="7-Day Yoga Retreat in Varkala | Villa Lemon" />
                    <LTInput value={form.metaDescription} onChange={setLT("metaDescription")} label="Meta Description" multiline placeholder="Join our transformative yoga retreat in Varkala, Kerala..." />
                    <LTInput value={form.keywords} onChange={setLT("keywords")} label="Keywords" placeholder="yoga retreat kerala, varkala yoga, spiritual retreat india" />
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase text-[10px]">Canonical URL</label>
                      <input type="url" value={form.canonicalUrl} onChange={e => setF("canonicalUrl", e.target.value)}
                        placeholder="https://villalemon.com/en/retreats/varkala-yoga-retreat"
                        className="border p-2.5 rounded text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>
                )}

              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between shrink-0">
              <div className="flex gap-1.5 items-center">
                {FORM_TABS.map((tab) => (
                  <button key={tab.id} type="button" onClick={() => setActiveFormTab(tab.id)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      activeFormTab === tab.id ? "bg-brand-gold scale-125" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    title={tab.label} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider text-xs cursor-pointer transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={handleSubmit} disabled={saving}
                  className="px-6 py-2.5 bg-brand-gold hover:bg-[#b8943e] text-black font-bold rounded uppercase tracking-wider text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {saving ? "Saving..." : (editing ? "✓ Update Retreat" : "✓ Create Retreat")}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
