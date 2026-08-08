"use client";
/**
 * RetreatsTab — Full CMS for Yoga Retreats
 * Unified with the Packages tab design layout and top-level language selector
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Edit2, Trash2, X, Loader2, Upload, Check,
  Calendar, Users, Clock, BookOpen, Leaf, Heart, Star, Mountain, Home, Coffee, Sun, DollarSign, Settings, FileText, Globe
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
  { id: "media", label: "Media", icon: CameraIcon },
  { id: "highlights", label: "Highlights & Schedule", icon: Star },
  { id: "itinerary", label: "Itinerary & Excursions", icon: BookOpen },
  { id: "accommodation", label: "Rooms & Meals", icon: Home },
  { id: "yoga", label: "Yoga & Teachers", icon: Sun },
  { id: "ayurveda", label: "Ayurveda & Pricing", icon: Leaf },
  { id: "checklists", label: "Checklists & FAQs", icon: Check },
  { id: "booking", label: "Booking & SEO", icon: Calendar },
] as const;

type FormTabId = typeof FORM_TABS[number]["id"];

function CameraIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

// ─── Default form state ────────────────────────────────────────────────────────

const defaultForm = () => ({
  yogaType: "retreats",
  slug: "",
  days: 11,
  nights: 10,
  price: 24999,
  minAge: 18,
  maxCapacity: 20,
  certificate: true,
  featured: true,
  status: "published" as const,
  displayOrder: 1,
  yogaHours: 30,
  maxParticipants: 20,
  minParticipants: 6,
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
  hideRate: false,
  availableDates: [] as string[],
  // Localized fields
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
  rooms: [] as { name: LT; image: string; description: LT; occupancy: number; isPrivate: boolean; hasAC: boolean; hasBathroom: boolean; hasBalcony: boolean; hasWorkspace: boolean; hotWater: boolean; sharedPrice: number; privatePrice: number; features: LT[]; hideRate: boolean }[],
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

// ─── Helper inputs ────────────────────────────────────────────────────────────

const LocalInput = ({ value, onChange, label, activeLang, required = false, placeholder = "" }: {
  value: LT; onChange: (v: LT) => void; label: string; activeLang: "en" | "de" | "fr" | "ru"; required?: boolean; placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-bold text-gray-600 uppercase text-[9px] tracking-wider">{label}</label>
    <input type="text" placeholder={placeholder} value={value?.[activeLang] || ""}
      onChange={e => onChange({ ...value, [activeLang]: e.target.value })}
      className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none focus:border-brand-gold bg-white w-full"
      required={required && activeLang === "en"} />
  </div>
);

const LocalTextarea = ({ value, onChange, label, activeLang, required = false, placeholder = "", rows = 3 }: {
  value: LT; onChange: (v: LT) => void; label: string; activeLang: "en" | "de" | "fr" | "ru"; required?: boolean; placeholder?: string; rows?: number;
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-bold text-gray-600 uppercase text-[9px] tracking-wider">{label}</label>
    <textarea rows={rows} placeholder={placeholder} value={value?.[activeLang] || ""}
      onChange={e => onChange({ ...value, [activeLang]: e.target.value })}
      className="border border-gray-200 p-2.5 rounded text-xs font-sans resize-y focus:outline-none focus:border-brand-gold bg-white w-full"
      required={required && activeLang === "en"} />
  </div>
);

const LocalListEditor = ({ items, onChange, label, activeLang, placeholder }: {
  items: LT[]; onChange: (items: LT[]) => void; label: string; activeLang: "en" | "de" | "fr" | "ru"; placeholder?: string;
}) => {
  const add = () => onChange([...items, emptyLT()]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, v: LT) => { const arr = [...items]; arr[i] = v; onChange(arr); };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border-b pb-1">
        <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">{label}</span>
        <button type="button" onClick={add} className="flex items-center gap-1 text-[10px] text-brand-gold hover:text-[#b8943e] font-bold cursor-pointer">
          <Plus className="w-3 h-3" /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200 relative pr-8">
            <div className="flex-1">
              <input type="text" placeholder={placeholder} value={item?.[activeLang] || ""}
                onChange={e => update(i, { ...item, [activeLang]: e.target.value })}
                className="border border-gray-200 p-1.5 rounded text-xs w-full bg-white" />
            </div>
            <button type="button" onClick={() => remove(i)} className="absolute right-2 p-1 text-red-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-[10px] text-gray-400 italic">No items yet.</p>}
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
  defaultYogaType?: string;
}

export default function RetreatsTab({
  token,
  modalMode = false,
  isOpen = false,
  onClose,
  onSave,
  editingItem,
  defaultYogaType = "retreats",
}: RetreatsTabProps) {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Retreat | null>(null);
  const [form, setForm] = useState<RetreatForm>(defaultForm());

  const [activeFormTab, setActiveFormTab] = useState<FormTabId>("general");
  const [activeLangTab, setActiveLangTab] = useState<"en" | "de" | "fr" | "ru">("en");
  const [saving, setSaving] = useState(false);
  const [uploadingRoomIdx, setUploadingRoomIdx] = useState<number | null>(null);
  const [uploadingExcursionIdx, setUploadingExcursionIdx] = useState<number | null>(null);

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [teachersList, setTeachersList] = useState<any[]>([]);

  // Fetch teachers list
  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/yoga/teachers`);
      const json = await res.json();
      setTeachersList(json.data || []);
    } catch (err) {
      console.warn("Failed to fetch teachers", err);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

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
          setForm({ ...defaultForm(), yogaType: defaultYogaType });
          setHeroImagePreview("");
        }
        setHeroImageFile(null);
        setActiveFormTab("general");
        setActiveLangTab("en");
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
    } catch {
      setRetreats([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRetreats();
  }, [fetchRetreats]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setHeroImageFile(null);
    setHeroImagePreview("");
    setActiveFormTab("general");
    setActiveLangTab("en");
    setShowModal(true);
  };

  const openEdit = (r: Retreat) => {
    setEditing(r);
    setForm({ ...defaultForm(), ...(r as any) });
    setHeroImageFile(null);
    setHeroImagePreview(r.heroImage || "");
    setActiveFormTab("general");
    setActiveLangTab("en");
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

      // Append all fields
      const boolFields = ["certificate", "featured", "bookingOpen", "isPopular", "isSoldOut", "isUpcoming", "hideRate"];
      const numFields = ["days", "nights", "price", "minAge", "maxCapacity", "yogaHours", "maxParticipants", "minParticipants", "displayOrder"];
      const strFields = ["yogaType", "slug", "status", "checkIn", "checkOut", "emergencyContact", "canonicalUrl", "brochureUrl", "packingListUrl", "schedulePdfUrl", "termsPdfUrl", "video", "retreatMap"];
      const ltFields = [
        "heroTitle", "heroSubtitle", "tagline", "shortDescription", "fullDescription", "retreatOverview", "whyChoose", "whoIsItFor", "bestTime", "cta",
        "location", "difficulty", "yogaLevel", "language", "groupSize", "accommodationType", "yogaStyle", "morningSession", "eveningSession",
        "meditation", "pranayama", "philosophy", "classLanguage", "suitableFor", "yogaCertificate", "yogaDescription", "ayurvedaTitle",
        "ayurvedaDescription", "deposit", "balancePayment", "cancellation", "refund", "pickup", "drop", "medicalInfo", "specialRequests", "bookingTerms",
        "metaTitle", "metaDescription", "keywords"
      ];
      const arrFields = ["highlights", "dailySchedule", "curriculum", "excursions", "rooms", "meals", "teachers", "ayurvedaTreatments", "pricingRows", "inclusions", "exclusions", "thingsToBring", "dressCode", "requirements", "whoShouldAvoid", "faqs", "reviews", "certificates", "availableDates"];

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

  // ─── Render Modal Content ──────────────────────────────────────────────────

  const renderModalInner = () => (
    <div className="bg-white rounded-md max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-gray-150 my-auto text-xs">
      
      {/* Modal Header */}
      <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white rounded-t-md shrink-0 select-none">
        <div>
          <h3 className="font-serif text-base tracking-wide">
            {editing ? "Edit Yoga Retreat" : "Create Yoga Retreat"}
          </h3>
          <p className="text-[9px] text-brand-gold tracking-widest uppercase mt-1">Configure retreat layout, curriculum, itinerary, & excursions</p>
        </div>
        <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-white cursor-pointer transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Language Switcher Tabs */}
      <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50 flex gap-1.5 shrink-0 select-none">
        {(["en", "de", "fr", "ru"] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLangTab(lang)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer ${
              activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
          </button>
        ))}
      </div>

      {/* Section Form Tabs */}
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-2 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none select-none">
        {FORM_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} type="button" onClick={() => setActiveFormTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeFormTab === tab.id
                  ? "bg-[#121212] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}>
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs text-left">
        
        {/* ── Tab: General Info ── */}
        {activeFormTab === "general" && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600 uppercase text-[9px]">Slug *</label>
                <input type="text" required value={form.slug} onChange={e => setF("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="varkala-yoga-retreat" className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none focus:border-brand-gold bg-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600 uppercase text-[9px]">Status</label>
                <select value={form.status} onChange={e => setF("status", e.target.value as any)}
                  className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none focus:border-brand-gold bg-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600 uppercase text-[9px]">Display Order</label>
                <input type="number" value={form.displayOrder} onChange={e => setF("displayOrder", Number(e.target.value))}
                  className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none focus:border-brand-gold bg-white" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["days", "Days (Length)", 11],
                ["nights", "Nights (Length)", 10],
                ["price", "Price ($)", 599],
                ["yogaHours", "Total Yoga Hours", 30],
                ["minAge", "Min Age Allowed", 18],
                ["maxCapacity", "Max Capacity Limit", 20],
                ["minParticipants", "Min Participants Needed", 6]
              ].map(([k, l, d]) => (
                <div key={k as string} className="flex flex-col gap-1">
                  <label className="font-bold text-gray-600 uppercase text-[9px]">{l as string}</label>
                  <input type="number" min="0" value={(form as any)[k as string] ?? d}
                    onChange={e => setF(k as keyof RetreatForm, Number(e.target.value))}
                    className="border border-gray-200 p-2.5 rounded text-xs focus:outline-none focus:border-brand-gold bg-white" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 select-none bg-gray-50 p-4 rounded border border-gray-100 pl-5">
              <input
                type="checkbox"
                id="retreatHideRate"
                checked={form.hideRate || false}
                onChange={(e) => setF("hideRate", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
              />
              <label htmlFor="retreatHideRate" className="font-bold text-gray-700 uppercase cursor-pointer select-none text-[10px] tracking-wider">
                Hide Price / Rate from Listing Grid
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LocalInput value={form.location} onChange={setLT("location")} label="Location Details" activeLang={activeLangTab} placeholder="Varkala, Kerala, India" />
              <LocalInput value={form.difficulty} onChange={setLT("difficulty")} label="Difficulty Level" activeLang={activeLangTab} placeholder="Beginner Friendly" />
              <LocalInput value={form.yogaLevel} onChange={setLT("yogaLevel")} label="Yoga Level Suitability" activeLang={activeLangTab} placeholder="Suitable for all levels" />
              <LocalInput value={form.language} onChange={setLT("language")} label="Instruction Language" activeLang={activeLangTab} placeholder="English" />
              <LocalInput value={form.groupSize} onChange={setLT("groupSize")} label="Group Size Label" activeLang={activeLangTab} placeholder="6–20 Participants" />
              <LocalInput value={form.accommodationType} onChange={setLT("accommodationType")} label="Accommodation Type Overview" activeLang={activeLangTab} placeholder="Private & Shared Rooms" />
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-100 flex flex-wrap gap-4 select-none">
              {[
                ["certificate", "Certificate Provided"],
                ["featured", "Featured Retreat"],
                ["isPopular", "Mark as Popular"],
                ["isSoldOut", "Sold Out"],
                ["isUpcoming", "Upcoming"],
                ["bookingOpen", "Booking Open"],
              ].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!(form as any)[k]} onChange={e => setF(k as any, e.target.checked)}
                    className="w-4 h-4 accent-[#c5a880] cursor-pointer" />
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">{l}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Content ── */}
        {activeFormTab === "content" && (
          <div className="space-y-4 animate-fade-in bg-gray-50 p-4 rounded border border-gray-100">
            <LocalInput value={form.heroTitle} onChange={setLT("heroTitle")} label="Hero Title" activeLang={activeLangTab} placeholder="11-Day Varkala Yoga, Spiritual & Nature Retreat" required />
            <LocalInput value={form.heroSubtitle} onChange={setLT("heroSubtitle")} label="Hero Subtitle" activeLang={activeLangTab} placeholder="Reconnect • Rejuvenate • Transform" />
            <LocalInput value={form.tagline} onChange={setLT("tagline")} label="Tagline" activeLang={activeLangTab} placeholder="Discover the perfect harmony of yoga, nature and Kerala hospitality..." />
            <LocalTextarea value={form.shortDescription} onChange={setLT("shortDescription")} label="Short Description Summary" activeLang={activeLangTab} placeholder="A short summary of the retreat program..." rows={3} />
            <LocalTextarea value={form.fullDescription} onChange={setLT("fullDescription")} label="Full Details / Description" activeLang={activeLangTab} placeholder="Escape the noise of everyday life..." rows={4} />
            <LocalTextarea value={form.retreatOverview} onChange={setLT("retreatOverview")} label="Retreat Overview Paragraph" activeLang={activeLangTab} placeholder="A detailed overview paragraph..." rows={4} />
            <LocalTextarea value={form.whyChoose} onChange={setLT("whyChoose")} label="Why Choose This Retreat (Markdown/Bullet list)" activeLang={activeLangTab} placeholder="• Authentic Hatha & Vinyasa Yoga classes..." rows={4} />
            <LocalTextarea value={form.whoIsItFor} onChange={setLT("whoIsItFor")} label="Who Is This Retreat For?" activeLang={activeLangTab} placeholder="This retreat is ideal for anyone looking to deep stretch..." rows={3} />
            <LocalInput value={form.bestTime} onChange={setLT("bestTime")} label="Best Time to Join" activeLang={activeLangTab} placeholder="October to March" />
            <LocalInput value={form.cta} onChange={setLT("cta")} label="Call To Action Button Text" activeLang={activeLangTab} placeholder="Book Your Retreat" />
          </div>
        )}

        {/* ── Tab: Media ── */}
        {activeFormTab === "media" && (
          <div className="space-y-4 animate-fade-in bg-gray-50 p-4 rounded border border-gray-100">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-600 uppercase text-[9px]">Hero Background Image *</label>
              <div className="flex items-center gap-4">
                {heroImagePreview && (
                  <div className="w-36 aspect-video rounded border overflow-hidden shrink-0 bg-white">
                    <img src={heroImagePreview} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <label className="flex-1 border border-dashed border-gray-300 hover:border-brand-gold rounded p-6 cursor-pointer text-center bg-white hover:bg-amber-50/20 transition-all select-none">
                  <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleHeroImageChange} className="hidden" required={!editing} />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-600 uppercase text-[9px]">Video Link (YouTube/Vimeo)</label>
              <input type="url" value={form.video} onChange={e => setF("video", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..." className="border border-gray-200 p-2.5 rounded text-xs w-full bg-white focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-600 uppercase text-[9px]">Google Maps Embedded Location URL</label>
              <input type="url" value={form.retreatMap} onChange={e => setF("retreatMap", e.target.value)}
                placeholder="https://www.google.com/maps/embed?..." className="border border-gray-200 p-2.5 rounded text-xs w-full bg-white focus:outline-none" />
            </div>
          </div>
        )}

        {/* ── Tab: Highlights & Schedule ── */}
        {activeFormTab === "highlights" && (
          <div className="space-y-6 animate-fade-in">
            {/* Highlights Repeater */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Highlights List</span>
                <button type="button" onClick={() => setF("highlights", [...form.highlights, { icon: "Star", title: emptyLT(), description: emptyLT() }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add Highlight
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {form.highlights.map((h, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 relative space-y-3 shadow-sm">
                    <button type="button" onClick={() => setF("highlights", form.highlights.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600 uppercase text-[9px]">Lucide Icon Name</label>
                      <input type="text" value={h.icon} onChange={e => { const arr = [...form.highlights]; arr[i] = { ...arr[i], icon: e.target.value }; setF("highlights", arr); }}
                        placeholder="Sun / Leaf / Heart / Award" className="border border-gray-200 p-2 rounded text-xs bg-white focus:outline-none" />
                    </div>
                    <LocalInput value={h.title} onChange={v => { const arr = [...form.highlights]; arr[i] = { ...arr[i], title: v }; setF("highlights", arr); }} label="Title" activeLang={activeLangTab} placeholder="e.g. Twice Daily Yoga" />
                    <LocalTextarea value={h.description} onChange={v => { const arr = [...form.highlights]; arr[i] = { ...arr[i], description: v }; setF("highlights", arr); }} label="Short Description" activeLang={activeLangTab} placeholder="Traditional Hatha & Vinyasa yoga practice twice daily" rows={2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Schedule Repeater */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Daily Timeline Schedule</span>
                <button type="button" onClick={() => setF("dailySchedule", [...form.dailySchedule, { time: "", activity: emptyLT(), description: emptyLT(), icon: "" }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add Schedule Item
                </button>
              </div>
              <div className="space-y-3">
                {form.dailySchedule.map((s, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 relative shadow-sm">
                    <button type="button" onClick={() => setF("dailySchedule", form.dailySchedule.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600 uppercase text-[9px]">Time Range</label>
                      <input type="text" value={s.time} onChange={e => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], time: e.target.value }; setF("dailySchedule", arr); }}
                        placeholder="e.g. 06:00 – 08:00" className="border border-gray-200 p-2 rounded text-xs bg-white focus:outline-none" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <LocalInput value={s.activity} onChange={v => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], activity: v }; setF("dailySchedule", arr); }} label="Activity / Title" activeLang={activeLangTab} placeholder="Morning Yoga & Meditation" />
                      <LocalTextarea value={s.description} onChange={v => { const arr = [...form.dailySchedule]; arr[i] = { ...arr[i], description: v }; setF("dailySchedule", arr); }} label="Optional Note" activeLang={activeLangTab} placeholder="Herbal tea served right after class..." rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Itinerary & Excursions ── */}
        {activeFormTab === "itinerary" && (
          <div className="space-y-6 animate-fade-in">
            {/* Curriculum Days Repeater */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Day-by-Day Curriculum Itinerary</span>
                <button type="button" onClick={() => setF("curriculum", [...form.curriculum, { dayNumber: form.curriculum.length + 1, dayTitle: emptyLT(), description: emptyLT(), topics: [], learningOutcome: emptyLT(), images: [] }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add Day Itinerary
                </button>
              </div>
              <div className="space-y-4">
                {form.curriculum.map((c, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 relative space-y-3 shadow-sm">
                    <button type="button" onClick={() => setF("curriculum", form.curriculum.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Day Number</label>
                        <input type="number" value={c.dayNumber} onChange={e => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], dayNumber: Number(e.target.value) }; setF("curriculum", arr); }}
                          className="border border-gray-200 p-2 rounded text-xs bg-white focus:outline-none" />
                      </div>
                      <div className="col-span-3">
                        <LocalInput value={c.dayTitle} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], dayTitle: v }; setF("curriculum", arr); }} label="Day Heading Title" activeLang={activeLangTab} placeholder="Arrival in Varkala" />
                      </div>
                    </div>
                    <LocalTextarea value={c.description} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], description: v }; setF("curriculum", arr); }} label="Description details" activeLang={activeLangTab} placeholder="Welcome drink, check-in, gentle orientation" rows={3} />
                    <LocalInput value={c.learningOutcome} onChange={v => { const arr = [...form.curriculum]; arr[i] = { ...arr[i], learningOutcome: v }; setF("curriculum", arr); }} label="Learning Outcome / Daily Focus" activeLang={activeLangTab} placeholder="Settle into the retreat environment..." />
                    
                    {/* Bullet Highlights under day */}
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600 uppercase text-[9px]">Day Bullet Highlights (Comma separated)</label>
                      <input type="text" value={c.topics.map(t => t[activeLangTab] || "").join(", ")}
                        onChange={e => {
                          const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          const arr = [...form.curriculum];
                          arr[i].topics = list.map(itemText => {
                            const found = c.topics.find(t => t[activeLangTab] === itemText);
                            if (found) return found;
                            return { ...emptyLT(), [activeLangTab]: itemText };
                          });
                          setF("curriculum", arr);
                        }}
                        placeholder="Welcome Circle, Property Tour, Evening Meditation" className="border border-gray-200 p-2.5 rounded text-xs bg-white focus:outline-none w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Excursions Repeater */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Included Excursions</span>
                <button type="button" onClick={() => setF("excursions", [...form.excursions, { name: emptyLT(), duration: emptyLT(), description: emptyLT(), image: "", highlights: [], relatedTour: "", included: true }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add Excursion
                </button>
              </div>
              <div className="space-y-4">
                {form.excursions.map((exc, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 relative space-y-3 shadow-sm">
                    <button type="button" onClick={() => setF("excursions", form.excursions.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <LocalInput value={exc.name} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], name: v }; setF("excursions", arr); }} label="Excursion Name" activeLang={activeLangTab} placeholder="Golden Island Backwater Experience" />
                      <LocalInput value={exc.duration} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], duration: v }; setF("excursions", arr); }} label="Duration Label" activeLang={activeLangTab} placeholder="Approximately 2 Hours" />
                    </div>
                    <LocalTextarea value={exc.description} onChange={v => { const arr = [...form.excursions]; arr[i] = { ...arr[i], description: v }; setF("excursions", arr); }} label="Excursion Details Description" activeLang={activeLangTab} placeholder="Boat ride through peaceful backwaters..." rows={3} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Excursion Image URL</label>
                        <input
                          type="text"
                          value={exc.image || ""}
                          onChange={e => {
                            const arr = [...form.excursions];
                            arr[i] = { ...arr[i], image: e.target.value };
                            setF("excursions", arr);
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="border border-gray-200 p-2.5 rounded text-xs bg-white focus:outline-none w-full"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        {exc.image && (
                          <div className="w-16 h-10 rounded border overflow-hidden shrink-0 bg-gray-100">
                            <img src={exc.image} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <label className="flex-1 border border-dashed border-gray-300 hover:border-brand-gold rounded p-2.5 cursor-pointer text-center bg-gray-50 hover:bg-amber-50/20 transition-all select-none">
                          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {uploadingExcursionIdx === i ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>{uploadingExcursionIdx === i ? "Uploading..." : "Upload Image File"}</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingExcursionIdx(i);
                              try {
                                const fd = new FormData();
                                fd.append("image", file);
                                const res = await fetch(`${API_BASE_URL}/api/retreats/upload-image`, {
                                  method: "POST",
                                  headers: { Authorization: `Bearer ${token}` },
                                  body: fd,
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  const arr = [...form.excursions];
                                  arr[i] = { ...arr[i], image: data.secure_url };
                                  setF("excursions", arr);
                                } else {
                                  alert("Upload failed");
                                }
                              } catch (err) {
                                alert("Error uploading excursion image");
                              } finally {
                                setUploadingExcursionIdx(null);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Highlights Bullet List (Comma separated)</label>
                        <input type="text" value={exc.highlights.map(h => h[activeLangTab] || "").join(", ")}
                          onChange={e => {
                            const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                            const arr = [...form.excursions];
                            arr[i].highlights = list.map(itemText => {
                              const found = exc.highlights.find(h => h[activeLangTab] === itemText);
                              if (found) return found;
                              return { ...emptyLT(), [activeLangTab]: itemText };
                            });
                            setF("excursions", arr);
                          }}
                          placeholder="Kerala Backwaters, Village Life, Coconut Plantations" className="border border-gray-250 p-2.5 rounded text-xs bg-white focus:outline-none w-full" />
                      </div>
                      <div className="flex flex-col gap-1 select-none">
                        <label className="font-bold text-gray-600 uppercase text-[9px] mb-1">Inclusion Status</label>
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                          <input type="checkbox" checked={exc.included} onChange={e => { const arr = [...form.excursions]; arr[i] = { ...arr[i], included: e.target.checked }; setF("excursions", arr); }}
                            className="w-4.5 h-4.5 accent-[#c5a880]" />
                          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Fully Included in Package Price</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Rooms & Meals ── */}
        {activeFormTab === "accommodation" && (
          <div className="space-y-6 animate-fade-in">
            {/* Rooms list repeater */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Retreat Room Categories</span>
                <button type="button" onClick={() => setF("rooms", [...form.rooms, { name: emptyLT(), image: "", description: emptyLT(), occupancy: 2, isPrivate: false, hasAC: true, hasBathroom: true, hasBalcony: false, hasWorkspace: false, hotWater: true, sharedPrice: 0, privatePrice: 0, features: [], hideRate: false }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add Room Category
                </button>
              </div>
              <div className="space-y-4">
                {form.rooms.map((rm, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 relative space-y-3 shadow-sm">
                    <button type="button" onClick={() => setF("rooms", form.rooms.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <LocalInput value={rm.name} onChange={v => { const arr = [...form.rooms]; arr[i] = { ...arr[i], name: v }; setF("rooms", arr); }} label="Room Name Title" activeLang={activeLangTab} placeholder="Deluxe Room with Balcony" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Max Occupancy Count</label>
                        <input type="number" min="1" value={rm.occupancy} onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], occupancy: Number(e.target.value) }; setF("rooms", arr); }}
                          className="border border-gray-200 p-2 rounded text-xs bg-white focus:outline-none" />
                      </div>
                    </div>
                    <LocalTextarea value={rm.description} onChange={v => { const arr = [...form.rooms]; arr[i] = { ...arr[i], description: v }; setF("rooms", arr); }} label="Room Details / Description" activeLang={activeLangTab} placeholder="Spacious room with elegant interiors..." rows={2} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Shared Occupancy Price ($)</label>
                        <input type="number" min="0" value={rm.sharedPrice || 0} onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], sharedPrice: Number(e.target.value) }; setF("rooms", arr); }}
                          className="border border-gray-200 p-2 rounded text-xs bg-white focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Private Occupancy Price ($)</label>
                        <input type="number" min="0" value={rm.privatePrice || 0} onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], privatePrice: Number(e.target.value) }; setF("rooms", arr); }}
                          className="border border-gray-200 p-2 rounded text-xs bg-white focus:outline-none" />
                      </div>
                      <div className="flex items-center gap-1.5 cursor-pointer select-none pt-4">
                        <input type="checkbox" id={`roomHidePrice-${i}`} checked={!!rm.hideRate} onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], hideRate: e.target.checked }; setF("rooms", arr); }}
                          className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold accent-brand-gold" />
                        <label htmlFor={`roomHidePrice-${i}`} className="text-[10px] font-bold text-gray-700 uppercase tracking-wider cursor-pointer">Hide Price / Rate</label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Room Image URL</label>
                        <input
                          type="text"
                          value={rm.image || ""}
                          onChange={e => {
                            const arr = [...form.rooms];
                            arr[i] = { ...arr[i], image: e.target.value };
                            setF("rooms", arr);
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="border border-gray-200 p-2.5 rounded text-xs bg-white focus:outline-none w-full"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        {rm.image && (
                          <div className="w-16 h-10 rounded border overflow-hidden shrink-0 bg-gray-100">
                            <img src={rm.image} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <label className="flex-1 border border-dashed border-gray-300 hover:border-brand-gold rounded p-2.5 cursor-pointer text-center bg-gray-50 hover:bg-amber-50/20 transition-all select-none">
                          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {uploadingRoomIdx === i ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>{uploadingRoomIdx === i ? "Uploading..." : "Upload Room Image file"}</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingRoomIdx(i);
                              try {
                                const fd = new FormData();
                                fd.append("image", file);
                                const res = await fetch(`${API_BASE_URL}/api/retreats/upload-image`, {
                                  method: "POST",
                                  headers: { Authorization: `Bearer ${token}` },
                                  body: fd,
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  const arr = [...form.rooms];
                                  arr[i] = { ...arr[i], image: data.secure_url };
                                  setF("rooms", arr);
                                } else {
                                  alert("Upload failed");
                                }
                              } catch (err) {
                                alert("Error uploading room image");
                              } finally {
                                setUploadingRoomIdx(null);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                      <div className="flex flex-wrap gap-3">
                        {[
                          ["hasAC", "Air Conditioned"],
                          ["hasBathroom", "Attached Private Bathroom"],
                          ["hasBalcony", "Private Balcony"],
                          ["hasWorkspace", "Workspace / Desk"],
                          ["hotWater", "Hot Water Access"],
                          ["isPrivate", "Strictly Private Room Only"]
                        ].map(([k, l]) => (
                          <label key={k} className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={!!(rm as any)[k]} onChange={e => { const arr = [...form.rooms]; arr[i] = { ...arr[i], [k]: e.target.checked }; setF("rooms", arr); }}
                              className="w-3.5 h-3.5 accent-[#c5a880]" />
                            <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">{l}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-600 uppercase text-[9px]">Room Features & Amenities (Comma separated list)</label>
                        <input type="text" value={rm.features.map(f => f[activeLangTab] || "").join(", ")}
                          onChange={e => {
                            const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                            const arr = [...form.rooms];
                            arr[i].features = list.map(itemText => {
                              const found = rm.features.find(f => f[activeLangTab] === itemText);
                              if (found) return found;
                              return { ...emptyLT(), [activeLangTab]: itemText };
                            });
                            setF("rooms", arr);
                          }}
                          placeholder="Private Balcony, AC, Hot Water, Workspace" className="border border-gray-200 p-2.5 rounded text-xs bg-white focus:outline-none w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meals repeater */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Daily Dining Meal Options</span>
                <button type="button" onClick={() => setF("meals", [...form.meals, { mealType: emptyLT(), description: emptyLT(), isVegan: true, isGlutenFree: false, isLactoseFree: false, gallery: [], menuItems: [] }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add Meal Option
                </button>
              </div>
              <div className="space-y-4">
                {form.meals.map((ml, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 relative space-y-3 shadow-sm">
                    <button type="button" onClick={() => setF("meals", form.meals.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <LocalInput value={ml.mealType} onChange={v => { const arr = [...form.meals]; arr[i] = { ...arr[i], mealType: v }; setF("meals", arr); }} label="Meal Category Name" activeLang={activeLangTab} placeholder="e.g. Vegetarian Lunch / Morning Herbal Tea" />
                    <LocalTextarea value={ml.description} onChange={v => { const arr = [...form.meals]; arr[i] = { ...arr[i], description: v }; setF("meals", arr); }} label="Meal Description / Menu Outline" activeLang={activeLangTab} placeholder="Fresh fruits, traditional vegetarian lunch..." rows={2} />
                    
                    <div className="flex gap-4 select-none">
                      {[
                        ["isVegan", "Vegan Friendly Options"],
                        ["isGlutenFree", "Gluten Free Available"],
                        ["isLactoseFree", "Lactose Free Available"]
                      ].map(([k, l]) => (
                        <label key={k} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={!!(ml as any)[k]} onChange={e => { const arr = [...form.meals]; arr[i] = { ...arr[i], [k]: e.target.checked }; setF("meals", arr); }}
                            className="w-3.5 h-3.5 accent-[#c5a880]" />
                          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Yoga & Teachers ── */}
        {activeFormTab === "yoga" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LocalInput value={form.yogaStyle} onChange={setLT("yogaStyle")} label="Yoga Style Focus" activeLang={activeLangTab} placeholder="Traditional Hatha & Vinyasa Yoga" />
              <LocalInput value={form.morningSession} onChange={setLT("morningSession")} label="Morning Sessions Time" activeLang={activeLangTab} placeholder="06:00–08:00 AM" />
              <LocalInput value={form.eveningSession} onChange={setLT("eveningSession")} label="Evening Sessions Time" activeLang={activeLangTab} placeholder="05:30–07:00 PM" />
              <LocalInput value={form.meditation} onChange={setLT("meditation")} label="Meditation Routine" activeLang={activeLangTab} placeholder="Daily Guided Meditation & Mindfulness" />
              <LocalInput value={form.pranayama} onChange={setLT("pranayama")} label="Pranayama Focus" activeLang={activeLangTab} placeholder="Nadi Shodhana, Kapalabhati" />
              <LocalInput value={form.yogaCertificate} onChange={setLT("yogaCertificate")} label="Certificate Title Label" activeLang={activeLangTab} placeholder="Villa Lemon Participation Certificate" />
              <div className="col-span-2">
                <LocalTextarea value={form.yogaDescription} onChange={setLT("yogaDescription")} label="General Yoga Overview Details" activeLang={activeLangTab} placeholder="Yoga is at the heart of this retreat..." rows={3} />
              </div>
            </div>

            {/* Teachers dropdown selector */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Retreat Instructors / Teachers</span>
              </div>
              <div className="relative">
                <label className="font-bold text-gray-600 uppercase text-[9px] block mb-1">Select Instructors (Select Multiple)</label>
                <div className="border border-gray-200 p-2.5 rounded bg-white text-xs max-h-48 overflow-y-auto space-y-2 focus:outline-none focus:border-brand-gold">
                  {teachersList.length === 0 ? (
                    <span className="text-gray-400 italic">No teachers found in database. Create them in Teachers tab first.</span>
                  ) : (
                    teachersList.map((t) => {
                      const isSelected = form.teachers.some(teacher => teacher.name === t.name);
                      return (
                        <label key={t._id} className="flex items-center gap-2.5 cursor-pointer p-1.5 hover:bg-gray-50 rounded select-none">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newTeacher = {
                                  name: t.name,
                                  photo: t.image || "",
                                  photoPublicId: t.imagePublicId || "",
                                  experience: "Certified Instructor",
                                  specialization: t.role || emptyLT(),
                                  bio: t.bio || emptyLT(),
                                  certificates: [],
                                  instagramUrl: "",
                                  facebookUrl: "",
                                  websiteUrl: "",
                                };
                                setF("teachers", [...form.teachers, newTeacher]);
                              } else {
                                setF("teachers", form.teachers.filter(teacher => teacher.name !== t.name));
                              }
                            }}
                            className="w-4 h-4 rounded text-brand-gold accent-brand-gold focus:ring-brand-gold"
                          />
                          <span className="font-semibold text-gray-700">{t.name}</span>
                          <span className="text-[10px] text-gray-400">({t.role?.en || ""})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Show selected teachers avatars/names */}
              {form.teachers.length > 0 && (
                <div className="pt-2 border-t border-gray-150">
                  <span className="font-bold text-gray-500 uppercase text-[9px] block mb-2">Assigned Instructors:</span>
                  <div className="flex flex-wrap gap-3">
                    {form.teachers.map((teach, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-xs">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 shrink-0">
                          {teach.photo ? (
                            <img src={teach.photo} alt={teach.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-[10px]">{teach.name[0]}</div>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-gray-800">{teach.name}</span>
                        <button
                          type="button"
                          onClick={() => setF("teachers", form.teachers.filter(t => t.name !== teach.name))}
                          className="text-gray-400 hover:text-red-500 font-bold shrink-0 ml-1 cursor-pointer select-none"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Ayurveda & Pricing ── */}
        {activeFormTab === "ayurveda" && (
          <div className="space-y-6 animate-fade-in">
            {/* Ayurveda texts & treatments */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <span className="font-serif text-sm font-semibold text-gray-800 block">Ayurvedic Wellness Settings</span>
              <LocalInput value={form.ayurvedaTitle} onChange={setLT("ayurvedaTitle")} label="Ayurveda Section Heading" activeLang={activeLangTab} placeholder="Traditional Kerala Ayurvedic Wellness" />
              <LocalTextarea value={form.ayurvedaDescription} onChange={setLT("ayurvedaDescription")} label="Ayurveda Concept Description" activeLang={activeLangTab} placeholder="Enhance your retreat with customized herbal therapies..." rows={3} />
              
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs font-semibold text-gray-700">Therapies List</span>
                  <button type="button" onClick={() => setF("ayurvedaTreatments", [...form.ayurvedaTreatments, { name: emptyLT(), description: emptyLT(), isOptional: true, extraCost: 0 }])}
                    className="flex items-center gap-1 text-[9px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm transition-colors cursor-pointer select-none">
                    <Plus className="w-3 h-3" /> Add Therapy
                  </button>
                </div>
                <div className="space-y-3">
                  {form.ayurvedaTreatments.map((tr, i) => (
                    <div key={i} className="bg-white p-3 rounded border border-gray-200 relative space-y-2 shadow-xs">
                      <button type="button" onClick={() => setF("ayurvedaTreatments", form.ayurvedaTreatments.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <LocalInput value={tr.name} onChange={v => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], name: v }; setF("ayurvedaTreatments", arr); }} label="Treatment Title" activeLang={activeLangTab} placeholder="Abhyanga Massage" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-600 uppercase text-[9px]">Additional Cost ($)</label>
                          <input type="number" min="0" value={tr.extraCost} onChange={e => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], extraCost: Number(e.target.value) }; setF("ayurvedaTreatments", arr); }}
                            className="border border-gray-200 p-2 rounded text-xs bg-white" />
                        </div>
                      </div>
                      <LocalTextarea value={tr.description} onChange={v => { const arr = [...form.ayurvedaTreatments]; arr[i] = { ...arr[i], description: v }; setF("ayurvedaTreatments", arr); }} label="Description Summary" activeLang={activeLangTab} placeholder="Full body massage with warm herbal oils..." rows={2} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing rows */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Accommodation Room Rates Table</span>
                <button type="button" onClick={() => setF("pricingRows", [...form.pricingRows, { roomCategory: emptyLT(), sharedPrice: 0, privatePrice: 0, availability: emptyLT(), upgradeCost: 0 }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add Rates Row
                </button>
              </div>
              <div className="space-y-3">
                {form.pricingRows.map((pr, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3 relative shadow-sm">
                    <button type="button" onClick={() => setF("pricingRows", form.pricingRows.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="col-span-2">
                      <LocalInput value={pr.roomCategory} onChange={v => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], roomCategory: v }; setF("pricingRows", arr); }} label="Room Category name" activeLang={activeLangTab} placeholder="Budget Room / Standard Room" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600 uppercase text-[9px]">Shared price ($)</label>
                      <input type="number" min="0" value={pr.sharedPrice} onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], sharedPrice: Number(e.target.value) }; setF("pricingRows", arr); }}
                        className="border border-gray-200 p-2 rounded text-xs bg-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600 uppercase text-[9px]">Private price ($)</label>
                      <input type="number" min="0" value={pr.privatePrice} onChange={e => { const arr = [...form.pricingRows]; arr[i] = { ...arr[i], privatePrice: Number(e.target.value) }; setF("pricingRows", arr); }}
                        className="border border-gray-200 p-2 rounded text-xs bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Checklists & FAQs ── */}
        {activeFormTab === "checklists" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <span className="font-serif text-sm font-semibold text-gray-800 block border-b pb-2">Included / Excluded Details</span>
              <LocalListEditor items={form.inclusions} onChange={list => setF("inclusions", list)} label="Retreat Includes" activeLang={activeLangTab} placeholder="e.g. Daily morning and evening yoga" />
              <LocalListEditor items={form.exclusions} onChange={list => setF("exclusions", list)} label="Price Excludes" activeLang={activeLangTab} placeholder="e.g. Flight ticket & travel insurance" />
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <span className="font-serif text-sm font-semibold text-gray-800 block border-b pb-2">Checklist & Guidelines</span>
              <LocalListEditor items={form.thingsToBring} onChange={list => setF("thingsToBring", list)} label="Things To Bring" activeLang={activeLangTab} placeholder="e.g. Yoga Wear / Water bottle" />
              <LocalListEditor items={form.dressCode} onChange={list => setF("dressCode", list)} label="Dress Code Guideline" activeLang={activeLangTab} placeholder="Comfortable clothing..." />
              <LocalListEditor items={form.requirements} onChange={list => setF("requirements", list)} label="Requirements to Join" activeLang={activeLangTab} placeholder="Basic fitness..." />
              <LocalListEditor items={form.whoShouldAvoid} onChange={list => setF("whoShouldAvoid", list)} label="Who Should Avoid" activeLang={activeLangTab} placeholder="Guests with serious injuries..." />
            </div>

            {/* FAQs Repeater */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-serif text-sm font-semibold text-gray-800">Frequently Asked Questions</span>
                <button type="button" onClick={() => setF("faqs", [...form.faqs, { question: emptyLT(), answer: emptyLT() }])}
                  className="flex items-center gap-1 text-[10px] bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors cursor-pointer select-none">
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {form.faqs.map((f, i) => (
                  <div key={i} className="bg-white p-4 rounded border border-gray-200 relative space-y-3 shadow-sm">
                    <button type="button" onClick={() => setF("faqs", form.faqs.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                    <LocalInput value={f.question} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], question: v }; setF("faqs", arr); }} label="Question" activeLang={activeLangTab} placeholder="Is this retreat beginner friendly?" />
                    <LocalTextarea value={f.answer} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], answer: v }; setF("faqs", arr); }} label="Answer Description" activeLang={activeLangTab} placeholder="Yes, Hatha sessions are beginner friendly..." rows={3} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Booking & SEO ── */}
        {activeFormTab === "booking" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <span className="font-serif text-sm font-semibold text-gray-800 block col-span-2 border-b pb-2">Booking & Cancellations policies</span>
              <LocalInput value={form.deposit} onChange={setLT("deposit")} label="Required Deposit Label" activeLang={activeLangTab} placeholder="e.g. 30% deposit required" />
              <LocalInput value={form.balancePayment} onChange={setLT("balancePayment")} label="Balance Payment Terms" activeLang={activeLangTab} placeholder="Full balance due 14 days before start" />
              <LocalTextarea value={form.cancellation} onChange={setLT("cancellation")} label="Cancellation Policy" activeLang={activeLangTab} placeholder="Free cancellation up to 14 days..." rows={2} />
              <LocalTextarea value={form.refund} onChange={setLT("refund")} label="Refund / Terms details" activeLang={activeLangTab} placeholder="No refunds are processed within 7 days..." rows={2} />
              <div className="grid grid-cols-2 gap-3 col-span-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-600 uppercase text-[9px]">Check-In Time</label>
                  <input type="text" value={form.checkIn} onChange={e => setF("checkIn", e.target.value)}
                    placeholder="12:00 PM" className="border border-gray-200 p-2.5 rounded text-xs bg-white focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-600 uppercase text-[9px]">Check-Out Time</label>
                  <input type="text" value={form.checkOut} onChange={e => setF("checkOut", e.target.value)}
                    placeholder="11:00 AM" className="border border-gray-200 p-2.5 rounded text-xs bg-white focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
              <span className="font-serif text-sm font-semibold text-gray-800 block border-b pb-2">SEO Optimizations</span>
              <LocalInput value={form.metaTitle} onChange={setLT("metaTitle")} label="Meta Tag Title" activeLang={activeLangTab} placeholder="Varkala Yoga, Spiritual & Nature Retreat | Villa Lemon" />
              <LocalTextarea value={form.metaDescription} onChange={setLT("metaDescription")} label="Meta Tag Description" activeLang={activeLangTab} placeholder="Join our immersive 11-day yoga retreat in Varkala..." rows={2} />
              <LocalInput value={form.keywords} onChange={setLT("keywords")} label="SEO Keywords List" activeLang={activeLangTab} placeholder="yoga retreat varkala, kerala spiritual retreat" />
            </div>
          </div>
        )}

      </form>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between shrink-0 rounded-b-md select-none">
        <div className="flex gap-1.5 items-center">
          {FORM_TABS.map(tab => (
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
  );

  // ─── Render View ───────────────────────────────────────────────────────────

  if (modalMode) {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto select-text text-left">
            {renderModalInner()}
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
                    {r.featured && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-gold text-black">Featured</span>}
                    {r.isSoldOut && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500 text-white">Sold Out</span>}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-bold text-sm text-gray-800 leading-tight line-clamp-1">{r.heroTitle?.en || "Untitled Retreat"}</h4>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">{r.tagline?.en || r.yogaLevel?.en || ""}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.days}D / {r.nights}N</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.groupSize?.en || `Max ${r.maxCapacity}`}</span>
                    {r.price > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${r.price.toLocaleString()}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => openEdit(r)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-gray-200 hover:border-brand-gold px-2.5 py-1.5 rounded-sm text-gray-700 hover:text-brand-gold transition-colors cursor-pointer">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(r._id)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-gray-200 hover:border-red-200 px-2.5 py-1.5 rounded-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup wrapper for non-modal mode */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          {renderModalInner()}
        </div>
      )}
    </>
  );
}
