"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { API_BASE_URL } from "@/config/api";
import RetreatsTab from "./RetreatsTab";
import {
  LayoutDashboard,
  Home,
  FileText,
  Bed,
  Settings,
  Users,
  Compass,
  Smile,
  HelpCircle,
  ExternalLink,
  Bell,
  ChevronDown,
  Plus,
  Edit2,
  MoreVertical,
  LogOut,
  FolderOpen,
  Calendar,
  MessageSquare,
  Activity,
  Globe,
  Database,
  CloudLightning,
  Sparkles,
  X,
  Upload,
  Check,
  Trash2,
  Loader2,
  MapPin,
  Clock,
  ListPlus,
  Sliders,
  DollarSign
} from "lucide-react";

interface LocalizedText {
  en: string;
  de: string;
  fr: string;
  ru: string;
}

// ------------------------------------------------------------------
// DATA INTERFACES
// ------------------------------------------------------------------
interface HomepageData {
  hero: {
    tagline: LocalizedText;
    headingPart1: LocalizedText;
    headingPart2: LocalizedText;
    nature: LocalizedText;
    description: LocalizedText;
    bookStay: LocalizedText;
    whatsappBooking: LocalizedText;
  };
  about: {
    tagline: LocalizedText;
    heading: LocalizedText;
    paragraph1: LocalizedText;
    paragraph2: LocalizedText;
    button: LocalizedText;
    natureTitle: LocalizedText;
    natureDesc: LocalizedText;
    luxuryTitle: LocalizedText;
    luxuryDesc: LocalizedText;
    serviceTitle: LocalizedText;
    serviceDesc: LocalizedText;
    everyoneTitle: LocalizedText;
    everyoneDesc: LocalizedText;
    quoteText: LocalizedText;
    quoteAuthor: LocalizedText;
    statsVillasLabel: LocalizedText;
    statsGuestsLabel: LocalizedText;
    statsRatingLabel: LocalizedText;
    statsLocationLabel: LocalizedText;
  };
}

// Subgroups / Categories
interface AccommodationCategoryData {
  _id: string;
  type: "villa" | "floor" | "room";
  title: LocalizedText;
  description: LocalizedText;
  price: LocalizedText;
  image: string;
  explore: LocalizedText;
  href: string;
}

interface PackageCategoryData {
  _id: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  explore: LocalizedText;
  href: string;
}

interface YogaCategoryData {
  _id: string;
  type: "retreats" | "classes" | "private";
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  explore: LocalizedText;
  href: string;
}

// Items inside subgroups
interface AccommodationItemData {
  _id: string;
  accommodationType: "villa" | "floor" | "room";
  title: LocalizedText;
  slug: string;
  price: number;
  pricePeriod: LocalizedText;
  image: string;
  aboutImage: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  location: LocalizedText;
  shortDescription: LocalizedText;
  tagline: LocalizedText;
  aboutText1: LocalizedText;
  aboutText2: LocalizedText;
  perfectLocationText: LocalizedText;
  groupAccommodationText: LocalizedText;
  checkInTime: string;
  checkOutTime: string;
  highlights: { icon: string; label: LocalizedText }[];
  whyGuestsLoveUs: { icon: string; title: LocalizedText; desc: LocalizedText }[];
  distances: { place: LocalizedText; distance: LocalizedText }[];
  roomAmenities: LocalizedText[];
  idealFor: LocalizedText[];
  checkInOutRules: LocalizedText[];
  additionalServices: { service: LocalizedText; details: LocalizedText }[];
  mapLink?: string;
  gallery?: string[];
  relatedAccommodations?: string[];
}

interface PackageItemData {
  _id: string;
  packageCategory: "varkalaSightseeing" | "dayTrips" | "backwaterExperiences" | "adventureActivities";
  title: LocalizedText;
  slug: string;
  price: number;
  pricePeriod: LocalizedText;
  image: string;
  aboutImage: string;
  duration: LocalizedText;
  shortDescription: LocalizedText;
  tagline: LocalizedText;
  aboutText: LocalizedText;
  itinerary: { timeOrDay: LocalizedText; activity: LocalizedText; desc: LocalizedText }[];
  inclusions: LocalizedText[];
  exclusions: LocalizedText[];
  highlights: { icon: string; label: LocalizedText }[];
  whyGuestsLoveUs: { icon: string; title: LocalizedText; desc: LocalizedText }[];
  
  // General Info
  travelTime?: LocalizedText;
  entryFee?: LocalizedText;
  optionalCharges?: LocalizedText;
  difficulty?: LocalizedText;
  groupSize?: LocalizedText;
  location?: LocalizedText;

  // Localized Content
  tourOverview?: LocalizedText;
  bestTime?: LocalizedText;
  dressCode?: LocalizedText;
  cta?: LocalizedText;

  // Images & Media
  gallery?: string[];
  video?: string;

  // Structural lists
  quickFacts?: { key: LocalizedText; value: LocalizedText }[];
  thingsToBring?: LocalizedText[];
  nearbyAttractions?: { name: LocalizedText; distance: LocalizedText }[];
  relatedPackages?: string[];
  faqs?: { question: LocalizedText; answer: LocalizedText }[];

  // SEO
  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;
  keywords?: LocalizedText;
  ogImage?: string;
  canonicalUrl?: string;

  // Booking Info
  cancellation?: LocalizedText;
  refund?: LocalizedText;
  pickup?: LocalizedText;
  drop?: LocalizedText;
  notes?: LocalizedText;
}

interface YogaItemData {
  _id: string;
  yogaType: "retreats" | "classes" | "private";
  title: LocalizedText;
  slug: string;
  price: number;
  pricePeriod: LocalizedText;
  image: string;
  aboutImage: string;
  duration: LocalizedText;
  shortDescription: LocalizedText;
  tagline: LocalizedText;
  aboutText: LocalizedText;
  schedule: { time: LocalizedText; activity: LocalizedText }[];
  benefits: LocalizedText[];
  inclusions: LocalizedText[];
  relatedYoga?: string[];
}

interface TeacherData {
  _id: string;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  image: string;
}

type TabType = "dashboard" | "stays" | "packages" | "yoga" | "retreats" | "teachers" | "homepage";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // LISTS STATES
  const [loading, setLoading] = useState(true);
  
  // Categories (Subgroups)
  const [accommodationCategories, setAccommodationCategories] = useState<AccommodationCategoryData[]>([]);
  const [packageCategories, setPackageCategories] = useState<PackageCategoryData[]>([]);
  const [yogaCategories, setYogaCategories] = useState<YogaCategoryData[]>([]);
  
  // Items inside categories
  const [stays, setStays] = useState<AccommodationItemData[]>([]);
  const [packages, setPackages] = useState<PackageItemData[]>([]);
  const [yogas, setYogas] = useState<YogaItemData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);

  // LOCALIZATION TAB
  const [activeLangTab, setActiveLangTab] = useState<"en" | "de" | "fr" | "ru">("en");
  const [activePkgFormTab, setActivePkgFormTab] = useState<string>("general");

  // IMAGE UPLOADS PREVIEWS
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  // MODALS STATE FOR SUBGROUPS (CATEGORIES)
  const [showSubgroupModal, setShowSubgroupModal] = useState(false);
  const [subgroupFormType, setSubgroupFormType] = useState<"accommodation" | "package" | "yoga">("accommodation");
  const [editingSubgroup, setEditingSubgroup] = useState<any | null>(null);
  const [savingSubgroup, setSavingSubgroup] = useState(false);
  const [subgroupForm, setSubgroupForm] = useState<any>({});

  // MOBILE SIDEBAR
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // MODALS STATE FOR ITEMS
  const [showStayModal, setShowStayModal] = useState(false);
  const [editingStay, setEditingStay] = useState<AccommodationItemData | null>(null);
  const [savingStay, setSavingStay] = useState(false);
  const [stayForm, setStayForm] = useState<Partial<AccommodationItemData>>({});

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItemData | null>(null);
  const [savingPackage, setSavingPackage] = useState(false);
  const [packageForm, setPackageForm] = useState<Partial<PackageItemData>>({});

  const [showYogaModal, setShowYogaModal] = useState(false);
  const [editingYoga, setEditingYoga] = useState<YogaItemData | null>(null);
  const [savingYoga, setSavingYoga] = useState(false);
  const [yogaForm, setYogaForm] = useState<Partial<YogaItemData>>({});

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState<Partial<TeacherData>>({});

  const [showHomepageModal, setShowHomepageModal] = useState(false);
  const [savingHomepage, setSavingHomepage] = useState(false);

  // Authenticate on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("villa_lemon_admin_token");
    const userStr = localStorage.getItem("villa_lemon_admin_user");
    if (!storedToken || !userStr) {
      router.push("/admin");
    } else {
      setToken(storedToken);
      setAdminUser(JSON.parse(userStr));
    }
  }, [router]);

  // Fetch lists
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Accommodation Subgroups (Categories) & Items
      const [resAccCats, resStays] = await Promise.all([
        fetch(`${API_BASE_URL}/api/accommodations`),
        fetch(`${API_BASE_URL}/api/accommodations/items`)
      ]);
      if (resAccCats.ok) {
        const d = await resAccCats.json();
        setAccommodationCategories(d.data || []);
      }
      if (resStays.ok) {
        const d = await resStays.json();
        setStays(d.data || []);
      }

      // 2. Fetch Package Subgroups (Categories) & Items
      const [resPkgCats, resPackages] = await Promise.all([
        fetch(`${API_BASE_URL}/api/packages`),
        fetch(`${API_BASE_URL}/api/packages/items`)
      ]);
      if (resPkgCats.ok) {
        const d = await resPkgCats.json();
        setPackageCategories(d.data || []);
      }
      if (resPackages.ok) {
        const d = await resPackages.json();
        setPackages(d.data || []);
      }

      // 3. Fetch Yoga Subgroups (Categories) & Items
      const [resYogaCats, resYoga] = await Promise.all([
        fetch(`${API_BASE_URL}/api/yoga/programs`),
        fetch(`${API_BASE_URL}/api/yoga/items`)
      ]);
      if (resYogaCats.ok) {
        const d = await resYogaCats.json();
        setYogaCategories(d.data || []);
      }
      if (resYoga.ok) {
        const d = await resYoga.json();
        setYogas(d.data || []);
      }

      // 4. Fetch teachers
      const resTeachers = await fetch(`${API_BASE_URL}/api/yoga/teachers`);
      if (resTeachers.ok) {
        const d = await resTeachers.json();
        setTeachers(d.data || []);
      }

      // 5. Fetch Homepage dynamic texts
      const resHome = await fetch(`${API_BASE_URL}/api/homepage`);
      if (resHome.ok) {
        const d = await resHome.json();
        setHomepageData(d.data || null);
      }
    } catch (err) {
      console.error("Failed to load CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("villa_lemon_admin_token");
    localStorage.removeItem("villa_lemon_admin_user");
    router.push("/admin");
  };

  // Helper localizer string init
  const createEmptyLocalizedText = (val = ""): LocalizedText => ({
    en: val,
    de: val,
    fr: val,
    ru: val,
  });

  // Helper handles cover image preview URL setup
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  // Helper handles about image preview URL setup
  const handleAboutImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAboutImageFile(file);
      setAboutImagePreview(URL.createObjectURL(file));
    }
  };

  // Helper handles SEO OG image preview URL setup
  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOgImageFile(file);
      setOgImagePreview(URL.createObjectURL(file));
    }
  };

  // ------------------------------------------------------------------
  // SUBGROUP (CATEGORY) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddSubgroup = (formType: "accommodation" | "package" | "yoga") => {
    setSubgroupFormType(formType);
    setEditingSubgroup(null);
    
    setSubgroupForm({
      type: formType === "accommodation" ? "villa" : formType === "yoga" ? "retreats" : "",
      category: formType === "package" ? "varkalaSightseeing" : "",
      href: "",
      title: createEmptyLocalizedText(),
      description: createEmptyLocalizedText(),
      price: formType === "accommodation" ? createEmptyLocalizedText("From ₹15,000") : undefined,
      explore: createEmptyLocalizedText("Explore Options"),
    });

    setCoverImagePreview(null);
    setCoverImageFile(null);
    setShowSubgroupModal(true);
  };

  const handleOpenEditSubgroup = (cat: any, formType: "accommodation" | "package" | "yoga") => {
    setSubgroupFormType(formType);
    setEditingSubgroup(cat);
    setSubgroupForm({ ...cat });
    setCoverImagePreview(cat.image);
    setCoverImageFile(null);
    setShowSubgroupModal(true);
  };

  const handleSaveSubgroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingSubgroup(true);

    try {
      const formData = new FormData();
      if (subgroupFormType === "accommodation") {
        formData.append("type", subgroupForm.type || "villa");
        formData.append("price", JSON.stringify(subgroupForm.price));
      } else if (subgroupFormType === "package") {
        formData.append("category", subgroupForm.category || "varkalaSightseeing");
      } else if (subgroupFormType === "yoga") {
        formData.append("type", subgroupForm.type || "retreats");
      }

      formData.append("href", subgroupForm.href || "");
      formData.append("title", JSON.stringify(subgroupForm.title));
      formData.append("description", JSON.stringify(subgroupForm.description));
      formData.append("explore", JSON.stringify(subgroupForm.explore));

      // Append banner feature fields for accommodation
      if (subgroupFormType === "accommodation") {
        const sf = subgroupForm as any;
        for (const n of [1, 2, 3, 4]) {
          const titleKey = `feature${n}Title`;
          const subtitleKey = `feature${n}Subtitle`;
          if (sf[titleKey]) formData.append(titleKey, JSON.stringify(sf[titleKey]));
          if (sf[subtitleKey]) formData.append(subtitleKey, JSON.stringify(sf[subtitleKey]));
        }
      }

      if (coverImageFile) {
        formData.append("image", coverImageFile);
      }

      let url = "";
      if (subgroupFormType === "accommodation") {
        url = editingSubgroup 
          ? `${API_BASE_URL}/api/accommodations/${editingSubgroup._id}`
          : `${API_BASE_URL}/api/accommodations`;
      } else if (subgroupFormType === "package") {
        url = editingSubgroup
          ? `${API_BASE_URL}/api/packages/${editingSubgroup._id}`
          : `${API_BASE_URL}/api/packages`;
      } else if (subgroupFormType === "yoga") {
        url = editingSubgroup
          ? `${API_BASE_URL}/api/yoga/programs/${editingSubgroup._id}`
          : `${API_BASE_URL}/api/yoga/programs`;
      }

      const method = editingSubgroup ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowSubgroupModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save category");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving category.");
    } finally {
      setSavingSubgroup(false);
    }
  };

  const handleDeleteSubgroup = async (id: string, formType: "accommodation" | "package" | "yoga") => {
    if (!token || !confirm("Delete this category subgroup? This might affect homepage sections.")) return;
    try {
      let url = "";
      if (formType === "accommodation") url = `${API_BASE_URL}/api/accommodations/${id}`;
      else if (formType === "package") url = `${API_BASE_URL}/api/packages/${id}`;
      else if (formType === "yoga") url = `${API_BASE_URL}/api/yoga/programs/${id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
      else alert("Delete failed");
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // STAYS (ITEMS) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddStay = (prefilledType?: "villa" | "floor" | "room") => {
    setEditingStay(null);
    setStayForm({
      accommodationType: prefilledType || "villa",
      slug: "",
      price: 15000,
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      title: createEmptyLocalizedText(),
      pricePeriod: createEmptyLocalizedText("/ night"),
      location: createEmptyLocalizedText("Varkala, Kerala"),
      shortDescription: createEmptyLocalizedText(),
      tagline: createEmptyLocalizedText(),
      aboutText1: createEmptyLocalizedText(),
      aboutText2: createEmptyLocalizedText(),
      perfectLocationText: createEmptyLocalizedText(),
      groupAccommodationText: createEmptyLocalizedText(),
      highlights: [
        { icon: "pool", label: createEmptyLocalizedText("Private Pool") },
        { icon: "wifi", label: createEmptyLocalizedText("Free Wi-Fi") }
      ],
      whyGuestsLoveUs: [
        { icon: "shield", title: createEmptyLocalizedText("Security"), desc: createEmptyLocalizedText("Secure gated facility.") }
      ],
      distances: [
        { place: createEmptyLocalizedText("Black Beach"), distance: createEmptyLocalizedText("900 m") }
      ],
      roomAmenities: [createEmptyLocalizedText("Air Conditioning"), createEmptyLocalizedText("Hot Water")],
      idealFor: [createEmptyLocalizedText("Wellness Groups"), createEmptyLocalizedText("Family Stays")],
      checkInOutRules: [createEmptyLocalizedText("Quiet hours after 10 PM.")],
      additionalServices: [
        { service: createEmptyLocalizedText("Laundry"), details: createEmptyLocalizedText("Paid service.") }
      ],
      relatedAccommodations: ["", "", ""]
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setAboutImagePreview(null);
    setAboutImageFile(null);
    setNewGalleryFiles([]);
    setShowStayModal(true);
  };

  const handleOpenEditStay = (s: AccommodationItemData) => {
    setEditingStay(s);
    setStayForm({
      ...s,
      relatedAccommodations: s.relatedAccommodations || ["", "", ""]
    });
    setCoverImagePreview(s.image);
    setCoverImageFile(null);
    setAboutImagePreview(s.aboutImage);
    setAboutImageFile(null);
    setNewGalleryFiles([]);
    setShowStayModal(true);
  };

  const handleSaveStay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingStay(true);

    try {
      const formData = new FormData();
      formData.append("accommodationType", stayForm.accommodationType || "villa");
      formData.append("slug", stayForm.slug || "");
      formData.append("price", String(stayForm.price || 0));
      formData.append("bedrooms", String(stayForm.bedrooms || 0));
      formData.append("bathrooms", String(stayForm.bathrooms || 0));
      formData.append("guests", String(stayForm.guests || 0));
      formData.append("checkInTime", stayForm.checkInTime || "14:00");
      formData.append("checkOutTime", stayForm.checkOutTime || "11:00");
      formData.append("mapLink", stayForm.mapLink || "");

      formData.append("title", JSON.stringify(stayForm.title));
      formData.append("pricePeriod", JSON.stringify(stayForm.pricePeriod));
      formData.append("location", JSON.stringify(stayForm.location));
      formData.append("shortDescription", JSON.stringify(stayForm.shortDescription));
      formData.append("tagline", JSON.stringify(stayForm.tagline));
      formData.append("aboutText1", JSON.stringify(stayForm.aboutText1));
      formData.append("aboutText2", JSON.stringify(stayForm.aboutText2));
      formData.append("perfectLocationText", JSON.stringify(stayForm.perfectLocationText));
      formData.append("groupAccommodationText", JSON.stringify(stayForm.groupAccommodationText));

      formData.append("highlights", JSON.stringify(stayForm.highlights || []));
      formData.append("whyGuestsLoveUs", JSON.stringify(stayForm.whyGuestsLoveUs || []));
      formData.append("distances", JSON.stringify(stayForm.distances || []));
      formData.append("roomAmenities", JSON.stringify(stayForm.roomAmenities || []));
      formData.append("idealFor", JSON.stringify(stayForm.idealFor || []));
      formData.append("checkInOutRules", JSON.stringify(stayForm.checkInOutRules || []));
      formData.append("additionalServices", JSON.stringify(stayForm.additionalServices || []));
      
      const filteredRelated = (stayForm.relatedAccommodations || []).filter(Boolean);
      formData.append("relatedAccommodations", JSON.stringify(filteredRelated));

      if (coverImageFile) formData.append("image", coverImageFile);
      if (aboutImageFile) formData.append("aboutImage", aboutImageFile);
      
      // Append gallery uploads and existing links
      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach((file) => {
          formData.append("gallery", file);
        });
      }
      formData.append("existingGallery", JSON.stringify(stayForm.gallery || []));

      const url = editingStay
        ? `${API_BASE_URL}/api/accommodations/items/${editingStay._id}`
        : `${API_BASE_URL}/api/accommodations/items`;
      const method = editingStay ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowStayModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save stay details");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving stay details.");
    } finally {
      setSavingStay(false);
    }
  };

  const handleDeleteStay = async (id: string) => {
    if (!token || !confirm("Delete this property? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/accommodations/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
      else alert("Delete failed");
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // PACKAGES (ITEMS) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddPackage = (prefilledCategory?: string) => {
    setEditingPackage(null);
    setPackageForm({
      packageCategory: (prefilledCategory as any) || "varkalaSightseeing",
      slug: "",
      price: 2500,
      title: createEmptyLocalizedText(),
      pricePeriod: createEmptyLocalizedText("/ person"),
      duration: createEmptyLocalizedText("4 Hours"),
      shortDescription: createEmptyLocalizedText(),
      tagline: createEmptyLocalizedText(),
      aboutText: createEmptyLocalizedText(),
      inclusions: [createEmptyLocalizedText("Guide service"), createEmptyLocalizedText("Water bottle")],
      exclusions: [createEmptyLocalizedText("Camera charges")],
      itinerary: [
        { timeOrDay: createEmptyLocalizedText("09:00 AM"), activity: createEmptyLocalizedText("Pick-up"), desc: createEmptyLocalizedText("Meeting at cliff helipad.") }
      ],
      highlights: [{ icon: "compass", label: createEmptyLocalizedText("Sightseeing") }],
      whyGuestsLoveUs: [{ icon: "star", title: createEmptyLocalizedText("Best Guides"), desc: createEmptyLocalizedText("Expert storytellers.") }],
      
      // General Info
      travelTime: createEmptyLocalizedText("1 Hour"),
      entryFee: createEmptyLocalizedText("None"),
      optionalCharges: createEmptyLocalizedText("None"),
      difficulty: createEmptyLocalizedText("Easy"),
      groupSize: createEmptyLocalizedText("Up to 10"),
      location: createEmptyLocalizedText("Varkala"),

      // Localized Content
      tourOverview: createEmptyLocalizedText(),
      bestTime: createEmptyLocalizedText("October to March"),
      dressCode: createEmptyLocalizedText("Casual"),
      cta: createEmptyLocalizedText("Book Now"),

      // Media
      gallery: [],
      video: "",

      // Structural lists
      quickFacts: [{ key: createEmptyLocalizedText("Duration"), value: createEmptyLocalizedText("4 Hours") }],
      thingsToBring: [createEmptyLocalizedText("Sunscreen"), createEmptyLocalizedText("Sunglasses")],
      nearbyAttractions: [{ name: createEmptyLocalizedText("Varkala Cliff"), distance: createEmptyLocalizedText("2 km") }],
      relatedPackages: ["", "", ""],
      faqs: [{ question: createEmptyLocalizedText("Is food included?"), answer: createEmptyLocalizedText("No, meals are not included.") }],

      // SEO
      metaTitle: createEmptyLocalizedText(),
      metaDescription: createEmptyLocalizedText(),
      keywords: createEmptyLocalizedText(),
      canonicalUrl: "",

      // Booking Info
      cancellation: createEmptyLocalizedText("Free cancellation up to 24 hours before."),
      refund: createEmptyLocalizedText("Full refund if cancelled in time."),
      pickup: createEmptyLocalizedText("Hotel lobby pick-up."),
      drop: createEmptyLocalizedText("Drop-off at hotel."),
      notes: createEmptyLocalizedText()
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setAboutImagePreview(null);
    setAboutImageFile(null);
    setOgImagePreview(null);
    setOgImageFile(null);
    setNewGalleryFiles([]);
    setActivePkgFormTab("general");
    setShowPackageModal(true);
  };

  const handleOpenEditPackage = (p: PackageItemData) => {
    setEditingPackage(p);
    setPackageForm({
      ...p,
      relatedPackages: p.relatedPackages || ["", "", ""]
    });
    setCoverImagePreview(p.image);
    setCoverImageFile(null);
    setAboutImagePreview(p.aboutImage);
    setAboutImageFile(null);
    setOgImagePreview(p.ogImage || null);
    setOgImageFile(null);
    setNewGalleryFiles([]);
    setActivePkgFormTab("general");
    setShowPackageModal(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingPackage(true);

    try {
      const formData = new FormData();
      formData.append("packageCategory", packageForm.packageCategory || "varkalaSightseeing");
      formData.append("slug", packageForm.slug || "");
      formData.append("price", String(packageForm.price || 0));
      formData.append("video", packageForm.video || "");
      formData.append("canonicalUrl", packageForm.canonicalUrl || "");

      formData.append("title", JSON.stringify(packageForm.title));
      formData.append("pricePeriod", JSON.stringify(packageForm.pricePeriod));
      formData.append("duration", JSON.stringify(packageForm.duration));
      formData.append("shortDescription", JSON.stringify(packageForm.shortDescription));
      formData.append("tagline", JSON.stringify(packageForm.tagline));
      formData.append("aboutText", JSON.stringify(packageForm.aboutText));

      formData.append("travelTime", JSON.stringify(packageForm.travelTime));
      formData.append("entryFee", JSON.stringify(packageForm.entryFee));
      formData.append("optionalCharges", JSON.stringify(packageForm.optionalCharges));
      formData.append("difficulty", JSON.stringify(packageForm.difficulty));
      formData.append("groupSize", JSON.stringify(packageForm.groupSize));
      formData.append("location", JSON.stringify(packageForm.location));

      formData.append("tourOverview", JSON.stringify(packageForm.tourOverview));
      formData.append("bestTime", JSON.stringify(packageForm.bestTime));
      formData.append("dressCode", JSON.stringify(packageForm.dressCode));
      formData.append("cta", JSON.stringify(packageForm.cta));

      formData.append("metaTitle", JSON.stringify(packageForm.metaTitle));
      formData.append("metaDescription", JSON.stringify(packageForm.metaDescription));
      formData.append("keywords", JSON.stringify(packageForm.keywords));

      formData.append("cancellation", JSON.stringify(packageForm.cancellation));
      formData.append("refund", JSON.stringify(packageForm.refund));
      formData.append("pickup", JSON.stringify(packageForm.pickup));
      formData.append("drop", JSON.stringify(packageForm.drop));
      formData.append("notes", JSON.stringify(packageForm.notes));

      formData.append("inclusions", JSON.stringify(packageForm.inclusions || []));
      formData.append("exclusions", JSON.stringify(packageForm.exclusions || []));
      formData.append("itinerary", JSON.stringify(packageForm.itinerary || []));
      formData.append("highlights", JSON.stringify(packageForm.highlights || []));
      formData.append("whyGuestsLoveUs", JSON.stringify(packageForm.whyGuestsLoveUs || []));
      formData.append("quickFacts", JSON.stringify(packageForm.quickFacts || []));
      formData.append("thingsToBring", JSON.stringify(packageForm.thingsToBring || []));
      formData.append("nearbyAttractions", JSON.stringify(packageForm.nearbyAttractions || []));
      const filteredRelated = (packageForm.relatedPackages || []).filter(Boolean);
      formData.append("relatedPackages", JSON.stringify(filteredRelated));
      formData.append("faqs", JSON.stringify(packageForm.faqs || []));

      if (coverImageFile) formData.append("image", coverImageFile);
      if (aboutImageFile) formData.append("aboutImage", aboutImageFile);
      if (ogImageFile) formData.append("ogImage", ogImageFile);

      // Append gallery uploads and existing links
      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach((file) => {
          formData.append("gallery", file);
        });
      }
      formData.append("existingGallery", JSON.stringify(packageForm.gallery || []));

      const url = editingPackage
        ? `${API_BASE_URL}/api/packages/items/${editingPackage._id}`
        : `${API_BASE_URL}/api/packages/items`;
      const method = editingPackage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowPackageModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save package");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPackage(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!token || !confirm("Delete this package?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/packages/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // YOGA (ITEMS) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddYoga = (prefilledType?: "retreats" | "classes" | "private") => {
    setEditingYoga(null);
    setYogaForm({
      yogaType: prefilledType || "retreats",
      slug: "",
      price: 15000,
      title: createEmptyLocalizedText(),
      pricePeriod: createEmptyLocalizedText("/ program"),
      duration: createEmptyLocalizedText("7 Days"),
      shortDescription: createEmptyLocalizedText(),
      tagline: createEmptyLocalizedText(),
      aboutText: createEmptyLocalizedText(),
      inclusions: [createEmptyLocalizedText("Organic meals"), createEmptyLocalizedText("Standard accommodation")],
      benefits: [createEmptyLocalizedText("De-stress"), createEmptyLocalizedText("Enhanced clarity")],
      schedule: [
        { time: createEmptyLocalizedText("06:30 AM"), activity: createEmptyLocalizedText("Sunrise Flow") }
      ],
      relatedYoga: ["", "", ""]
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setAboutImagePreview(null);
    setAboutImageFile(null);
    setShowYogaModal(true);
  };

  const handleOpenEditYoga = (y: YogaItemData) => {
    setEditingYoga(y);
    setYogaForm({
      ...y,
      relatedYoga: y.relatedYoga || ["", "", ""]
    });
    setCoverImagePreview(y.image);
    setCoverImageFile(null);
    setAboutImagePreview(y.aboutImage);
    setAboutImageFile(null);
    setShowYogaModal(true);
  };

  const handleSaveYoga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingYoga(true);

    try {
      const formData = new FormData();
      formData.append("yogaType", yogaForm.yogaType || "retreats");
      formData.append("slug", yogaForm.slug || "");
      formData.append("price", String(yogaForm.price || 0));

      formData.append("title", JSON.stringify(yogaForm.title));
      formData.append("pricePeriod", JSON.stringify(yogaForm.pricePeriod));
      formData.append("duration", JSON.stringify(yogaForm.duration));
      formData.append("shortDescription", JSON.stringify(yogaForm.shortDescription));
      formData.append("tagline", JSON.stringify(yogaForm.tagline));
      formData.append("aboutText", JSON.stringify(yogaForm.aboutText));

      formData.append("inclusions", JSON.stringify(yogaForm.inclusions || []));
      formData.append("benefits", JSON.stringify(yogaForm.benefits || []));
      formData.append("schedule", JSON.stringify(yogaForm.schedule || []));

      const filteredRelated = (yogaForm.relatedYoga || []).filter(Boolean);
      formData.append("relatedYoga", JSON.stringify(filteredRelated));

      if (coverImageFile) formData.append("image", coverImageFile);
      if (aboutImageFile) formData.append("aboutImage", aboutImageFile);

      const url = editingYoga
        ? `${API_BASE_URL}/api/yoga/items/${editingYoga._id}`
        : `${API_BASE_URL}/api/yoga/items`;
      const method = editingYoga ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowYogaModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save retreat");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingYoga(false);
    }
  };

  const handleDeleteYoga = async (id: string) => {
    if (!token || !confirm("Delete this yoga program?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/yoga/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // TEACHERS ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherForm({
      name: "",
      role: createEmptyLocalizedText(),
      bio: createEmptyLocalizedText()
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setShowTeacherModal(true);
  };

  const handleOpenEditTeacher = (t: TeacherData) => {
    setEditingTeacher(t);
    setTeacherForm({ ...t });
    setCoverImagePreview(t.image);
    setCoverImageFile(null);
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingTeacher(true);

    try {
      const formData = new FormData();
      formData.append("name", teacherForm.name || "");
      formData.append("role", JSON.stringify(teacherForm.role));
      formData.append("bio", JSON.stringify(teacherForm.bio));

      if (coverImageFile) formData.append("image", coverImageFile);

      const url = editingTeacher
        ? `${API_BASE_URL}/api/yoga/teachers/${editingTeacher._id}`
        : `${API_BASE_URL}/api/yoga/teachers`;
      const method = editingTeacher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowTeacherModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save teacher profiles");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!token || !confirm("Delete this teacher?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/yoga/teachers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save homepage static text edits
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepageData || !token) return;
    setSavingHomepage(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/homepage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(homepageData),
      });

      if (res.ok) {
        setShowHomepageModal(false);
        fetchData();
      } else {
        alert("Failed to save homepage changes.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving homepage content.");
    } finally {
      setSavingHomepage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#2d3748] flex select-none font-sans overflow-x-hidden relative">

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-[280px] bg-[#121212] text-white flex flex-col justify-between shrink-0 border-r border-white/5 z-40 transition-transform duration-300 ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="relative flex items-center justify-center w-8 h-8 border border-brand-gold/30 rounded-sm bg-black/40">
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none" className="text-brand-gold">
                <path d="M20 5L6 16V33H34V16L20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-sm tracking-[0.15em] text-white uppercase font-bold leading-none">VILLA LEMON</h2>
              <span className="text-[7px] tracking-[0.25em] text-brand-gold uppercase font-medium mt-1 block">CMS Dashboard</span>
            </div>
          </div>

          <nav className="p-4 flex flex-col gap-1 text-[11px] font-semibold tracking-wider uppercase text-gray-400">
            <div 
              onClick={() => setActiveTab("dashboard")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "dashboard" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard Overview</span>
            </div>

            <div className="text-[9px] font-bold text-gray-600 tracking-[0.2em] mt-5 mb-2 px-3">
              Content Managers
            </div>
            
            <div 
              onClick={() => setActiveTab("stays")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "stays" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Home className="w-4 h-4 text-brand-gold" />
              <span>Villas & Stays</span>
            </div>

            <div 
              onClick={() => setActiveTab("packages")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "packages" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4 text-brand-gold" />
              <span>Tour Packages</span>
            </div>

            <div 
              onClick={() => setActiveTab("yoga")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "yoga" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4 text-brand-gold" />
              <span>Yoga Programs</span>
            </div>

            <div 
              onClick={() => setActiveTab("retreats")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "retreats" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4 text-brand-gold" />
              <span>Yoga Retreats</span>
            </div>

            <div 
              onClick={() => setActiveTab("teachers")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "teachers" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Smile className="w-4 h-4 text-brand-gold" />
              <span>Yoga Teachers</span>
            </div>

            <div 
              onClick={() => {
                if (homepageData) setShowHomepageModal(true);
              }}
              className="px-3.5 py-3 hover:bg-white/5 hover:text-white rounded-sm flex items-center gap-3 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-brand-gold/80" />
              <span>Landing Page Texts</span>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center font-bold text-[#121212]">
              <span className="text-sm">AD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">{adminUser?.name || "Admin"}</span>
              <span className="text-[9px] text-gray-500">{adminUser?.email || "admin@villalemon.com"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-white/5 text-gray-500 hover:text-red-400 rounded-sm transition-colors duration-200"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-grow flex flex-col min-w-0 lg:pl-0">

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden bg-[#121212] text-white px-4 py-3 flex items-center justify-between shrink-0 z-20 sticky top-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-sm hover:bg-white/10 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none" className="text-brand-gold">
              <path d="M20 5L6 16V33H34V16L20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-serif text-sm tracking-widest text-white uppercase font-bold">VILLA LEMON</span>
          </div>
          <a href="/" target="_blank" className="p-2 rounded-sm hover:bg-white/10 text-brand-gold">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <header className="hidden lg:flex bg-white border-b border-gray-200 px-8 py-4 items-center justify-between relative z-10 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-none">CMS Dashboard Workspace</h1>
            <p className="text-xs text-gray-500 mt-1.5">Manage stays details, packages itinerary days, and yoga wellness retreats.</p>
          </div>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-700 hover:text-brand-gold uppercase border border-gray-200 hover:border-brand-gold px-3.5 py-2 rounded-sm transition-all duration-300 bg-white shadow-sm"
          >
            <span>View Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px]">
          
          {/* ANALYTICS SUMMARY BOXES */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 select-none">
            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("stays")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Stays</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stays.length}</h3>
                <span className="text-[10px] font-semibold text-green-500 mt-1 block">Dynamic rooms/villas</span>
              </div>
              <div className="w-12 h-12 bg-green-50 flex items-center justify-center rounded-full text-green-500">
                <Home className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("packages")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Packages</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{packages.length}</h3>
                <span className="text-[10px] font-semibold text-amber-500 mt-1 block">Sightseeing & tours</span>
              </div>
              <div className="w-12 h-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-500">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("yoga")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Yoga Retreats</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{yogas.length}</h3>
                <span className="text-[10px] font-semibold text-indigo-500 mt-1 block">Retreats & private sessions</span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-500">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("teachers")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Teachers</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{teachers.length}</h3>
                <span className="text-[10px] font-semibold text-rose-500 mt-1 block">Certified profiles</span>
              </div>
              <div className="w-12 h-12 bg-rose-50 flex items-center justify-center rounded-full text-rose-500">
                <Smile className="w-5 h-5" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
              <span>Fetching CMS data records...</span>
            </div>
          ) : (
            <div className="animate-fade-in space-y-8">
              
              {/* TAB: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm select-text text-left">
                  <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">Welcome to Villa Lemon CMS Panel</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Use the sidebar on the left to navigate between different content tables. You can edit subgroup category definitions (Entire Villas, Sightseeing Packages, Yoga retreat programs), add properties inside them, check landmarks, and upload cover photos optimized via Cloudinary.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Changes made here are applied instantly to public pages. Direct Cloudinary image optimization handles thumbnail formatting automatically.
                  </p>
                </div>
              )}

              {/* TAB: STAYS MANAGER */}
              {activeTab === "stays" && (
                <div className="space-y-10">
                  {/* CATEGORIES SECTION */}
                  <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                      <div className="text-left">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Accommodation Categories (Subgroups)</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure layout, cover photos, and starting prices for the main stays sections.</p>
                      </div>
                      <button
                        onClick={() => handleOpenAddSubgroup("accommodation")}
                        className="self-start sm:self-auto flex items-center gap-1 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[9px] px-3.5 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Subgroup</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {accommodationCategories.map((cat) => {
                        const catStays = stays.filter(s => s.accommodationType === cat.type);
                        
                        return (
                          <div key={cat._id} className="border border-gray-200 rounded p-4 bg-gray-50 text-left flex flex-col justify-between">
                            <div>
                              <div className="relative w-full aspect-[2/1] rounded overflow-hidden mb-3 bg-gray-100">
                                <img src={cat.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#121212]">{cat.title[activeLangTab]}</h4>
                              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">
                                type: {cat.type} • Price: {cat.price[activeLangTab]}
                              </span>
                              <p className="text-[11px] text-gray-500 mt-2 font-light line-clamp-3 font-sans">{cat.description[activeLangTab]}</p>
                              
                              {/* Subgroup items list inside */}
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Properties inside ({catStays.length})</span>
                                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                                  {catStays.map(item => (
                                    <div key={item._id} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-gray-150">
                                      <span className="font-medium truncate mr-2">{item.title[activeLangTab]}</span>
                                      <div className="flex gap-1.5">
                                        <button onClick={() => handleOpenEditStay(item)} className="text-gray-500 hover:text-brand-gold transition-colors"><Edit2 className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeleteStay(item._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-200 justify-between">
                              <button
                                onClick={() => handleOpenAddStay(cat.type)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#121212] hover:bg-brand-gold text-white hover:text-black rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Stay</span>
                              </button>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleOpenEditSubgroup(cat, "accommodation")}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors"
                                  title="Edit Subgroup Details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubgroup(cat._id, "accommodation")}
                                  className="p-1.5 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PACKAGES MANAGER */}
              {activeTab === "packages" && (
                <div className="space-y-6 sm:space-y-10">
                  <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                      <div className="text-left">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Tour Package Categories (Subgroups)</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure layout and descriptions for your sightseeing, houseboat, and local tours categories.</p>
                      </div>
                      <button
                        onClick={() => handleOpenAddSubgroup("package")}
                        className="self-start sm:self-auto flex items-center gap-1 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[9px] px-3.5 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Subgroup</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {packageCategories.map((cat) => {
                        const catPkgs = packages.filter(p => p.packageCategory === cat.category);
                        
                        return (
                          <div key={cat._id} className="border border-gray-200 rounded p-4 bg-gray-50 text-left flex flex-col justify-between">
                            <div>
                              <div className="relative w-full aspect-[2/1] rounded overflow-hidden mb-3 bg-gray-100">
                                <img src={cat.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#121212]">{cat.title[activeLangTab]}</h4>
                              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">
                                category: {cat.category}
                              </span>
                              <p className="text-[11px] text-gray-500 mt-2 font-light line-clamp-3 font-sans">{cat.description[activeLangTab]}</p>
                              
                              {/* Subgroup items list inside */}
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Packages inside ({catPkgs.length})</span>
                                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                                  {catPkgs.map(item => (
                                    <div key={item._id} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-gray-150">
                                      <span className="font-medium truncate mr-2">{item.title[activeLangTab]}</span>
                                      <div className="flex gap-1.5">
                                        <button onClick={() => handleOpenEditPackage(item)} className="text-gray-500 hover:text-brand-gold transition-colors"><Edit2 className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeletePackage(item._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-200 justify-between">
                              <button
                                onClick={() => handleOpenAddPackage(cat.category)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#121212] hover:bg-brand-gold text-white hover:text-black rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Package</span>
                              </button>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleOpenEditSubgroup(cat, "package")}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubgroup(cat._id, "package")}
                                  className="p-1.5 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: YOGA RETREATS MANAGER */}
              {activeTab === "yoga" && (
                <div className="space-y-6 sm:space-y-10">
                  <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                      <div className="text-left">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Yoga Program Categories (Subgroups)</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure layout, cover banners, and details for retreats, daily flow classes, and private sessions.</p>
                      </div>
                      <button
                        onClick={() => handleOpenAddSubgroup("yoga")}
                        className="self-start sm:self-auto flex items-center gap-1 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[9px] px-3.5 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Subgroup</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {yogaCategories.map((cat) => {
                        const catYogas = yogas.filter(y => y.yogaType === cat.type);
                        
                        return (
                          <div key={cat._id} className="border border-gray-200 rounded p-4 bg-gray-50 text-left flex flex-col justify-between">
                            <div>
                              <div className="relative w-full aspect-[2/1] rounded overflow-hidden mb-3 bg-gray-100">
                                <img src={cat.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#121212]">{cat.title[activeLangTab]}</h4>
                              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">
                                type: {cat.type}
                              </span>
                              <p className="text-[11px] text-gray-500 mt-2 font-light line-clamp-3 font-sans">{cat.description[activeLangTab]}</p>
                              
                              {/* Subgroup items list inside */}
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Programs inside ({catYogas.length})</span>
                                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                                  {catYogas.map(item => (
                                    <div key={item._id} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-gray-150">
                                      <span className="font-medium truncate mr-2">{item.title[activeLangTab]}</span>
                                      <div className="flex gap-1.5">
                                        <button onClick={() => handleOpenEditYoga(item)} className="text-gray-500 hover:text-brand-gold transition-colors"><Edit2 className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeleteYoga(item._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-200 justify-between">
                              <button
                                onClick={() => handleOpenAddYoga(cat.type)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#121212] hover:bg-brand-gold text-white hover:text-black rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Program</span>
                              </button>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleOpenEditSubgroup(cat, "yoga")}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubgroup(cat._id, "yoga")}
                                  className="p-1.5 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: YOGA TEACHERS */}
              {activeTab === "teachers" && (
                <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                    <div className="text-left">
                      <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Yoga Teachers Directory</h3>
                      <p className="text-xs text-gray-500 mt-1">Manage profiles and bios of your certified yoga acharyas.</p>
                    </div>
                    <button
                      onClick={handleOpenAddTeacher}
                      className="self-start sm:self-auto flex items-center gap-1 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-sm transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Teacher</span>
                    </button>
                  </div>

                  {teachers.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">No teachers seeded.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {teachers.map((teacher) => (
                        <div key={teacher._id} className="border border-gray-200 rounded-md p-5 bg-white shadow-sm flex items-start gap-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0 select-none">
                            <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0 text-left">
                            <h4 className="font-serif font-bold text-base text-gray-800 leading-tight truncate">{teacher.name}</h4>
                            <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">{teacher.role.en}</span>
                            <p className="text-[11px] text-gray-500 font-light mt-2 line-clamp-3">{teacher.bio.en}</p>
                            
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 justify-end w-full">
                              <button
                                onClick={() => handleOpenEditTeacher(teacher)}
                                className="px-2.5 py-1.5 border border-gray-200 text-gray-700 hover:text-brand-gold hover:border-brand-gold rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteTeacher(teacher._id)}
                                className="p-1.5 border border-gray-200 text-gray-400 hover:text-red-500 rounded-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "retreats" && (
                <RetreatsTab token={token || ""} />
              )}

            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          MODAL: SUBGROUP CATEGORY CREATOR / EDITOR
      ======================================================== */}
      {showSubgroupModal && subgroupForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-none sm:rounded-md max-w-2xl w-full h-screen sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl border-0 sm:border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingSubgroup ? `Edit Subgroup Category Details` : `Create New Subgroup Category`}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure layout, translations, and cover photo</p>
              </div>
              <button onClick={() => setShowSubgroupModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveSubgroup} className="flex-grow overflow-y-auto p-6 space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Type selector */}
                {subgroupFormType === "accommodation" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Subgroup Type</label>
                    <select
                      value={subgroupForm.type}
                      onChange={(e) => setSubgroupForm({ ...subgroupForm, type: e.target.value })}
                      className="border p-2.5 rounded bg-white"
                      disabled={!!editingSubgroup}
                    >
                      <option value="villa">Entire Villa</option>
                      <option value="floor">Private Floor</option>
                      <option value="room">Individual Room</option>
                    </select>
                  </div>
                )}

                {subgroupFormType === "package" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Subgroup Category Key</label>
                    <select
                      value={subgroupForm.category}
                      onChange={(e) => setSubgroupForm({ ...subgroupForm, category: e.target.value })}
                      className="border p-2.5 rounded bg-white"
                      disabled={!!editingSubgroup}
                    >
                      <option value="varkalaSightseeing">Varkala Sightseeing</option>
                      <option value="dayTrips">Day Trips</option>
                      <option value="backwaterExperiences">Backwater Experiences</option>
                      <option value="adventureActivities">Adventure Activities</option>
                    </select>
                  </div>
                )}

                {subgroupFormType === "yoga" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Subgroup Type</label>
                    <select
                      value={subgroupForm.type}
                      onChange={(e) => setSubgroupForm({ ...subgroupForm, type: e.target.value })}
                      className="border p-2.5 rounded bg-white"
                      disabled={!!editingSubgroup}
                    >
                      <option value="retreats">Yoga Retreats</option>
                      <option value="classes">Daily Yoga Classes</option>
                      <option value="private">Private Yoga Sessions</option>
                    </select>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Href Target Path</label>
                  <input
                    type="text"
                    value={subgroupForm.href || ""}
                    onChange={(e) => setSubgroupForm({ ...subgroupForm, href: e.target.value })}
                    placeholder="/accommodation/villas"
                    className="border p-2.5 rounded"
                    required
                  />
                </div>
              </div>

              {/* TRANSLATED FIELDS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Localized values ({activeLangTab.toUpperCase()})</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Title</label>
                    <input
                      type="text"
                      value={subgroupForm.title?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const title = { ...subgroupForm.title, [activeLangTab]: e.target.value };
                        setSubgroupForm({ ...subgroupForm, title });
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Explore Link Title</label>
                    <input
                      type="text"
                      value={subgroupForm.explore?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const explore = { ...subgroupForm.explore, [activeLangTab]: e.target.value };
                        setSubgroupForm({ ...subgroupForm, explore });
                      }}
                      placeholder="Explore Entire Villas"
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>

                {subgroupFormType === "accommodation" && subgroupForm.price && (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Starting Price Label</label>
                    <input
                      type="text"
                      value={subgroupForm.price?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const price = { ...subgroupForm.price, [activeLangTab]: e.target.value };
                        setSubgroupForm({ ...subgroupForm, price });
                      }}
                      placeholder="From ₹24,500 / night"
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Description Text</label>
                  <textarea
                    rows={4}
                    value={subgroupForm.description?.[activeLangTab] || ""}
                    onChange={(e) => {
                      const description = { ...subgroupForm.description, [activeLangTab]: e.target.value };
                      setSubgroupForm({ ...subgroupForm, description });
                    }}
                    className="border p-2.5 rounded font-sans"
                    required={activeLangTab === "en"}
                  />
                </div>
              </div>

              {/* BANNER FEATURES — only for accommodation subgroups */}
              {subgroupFormType === "accommodation" && (
                <div className="bg-amber-50 p-4 rounded border border-amber-200 space-y-4">
                  <h4 className="font-bold text-amber-800 uppercase tracking-wider border-b border-amber-200 pb-1.5 text-[11px]">
                    Banner Feature Badges ({activeLangTab.toUpperCase()}) — 4 highlighted icons below the hero image
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([1, 2, 3, 4] as const).map((n) => (
                      <div key={n} className="bg-white border border-amber-100 rounded p-3 space-y-2">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Feature {n}</span>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase text-[10px]">Title</label>
                          <input
                            type="text"
                            value={(subgroupForm as any)[`feature${n}Title`]?.[activeLangTab] || ""}
                            onChange={(e) => {
                              const key = `feature${n}Title`;
                              const prev = (subgroupForm as any)[key] || { en: "", de: "", fr: "", ru: "" };
                              setSubgroupForm({ ...subgroupForm, [key]: { ...prev, [activeLangTab]: e.target.value } });
                            }}
                            placeholder={n === 1 ? "Private Pool" : n === 2 ? "Spacious Living" : n === 3 ? "Premium Amenities" : "Dedicated Service"}
                            className="border p-2 rounded text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-500 uppercase text-[10px]">Subtitle</label>
                          <input
                            type="text"
                            value={(subgroupForm as any)[`feature${n}Subtitle`]?.[activeLangTab] || ""}
                            onChange={(e) => {
                              const key = `feature${n}Subtitle`;
                              const prev = (subgroupForm as any)[key] || { en: "", de: "", fr: "", ru: "" };
                              setSubgroupForm({ ...subgroupForm, [key]: { ...prev, [activeLangTab]: e.target.value } });
                            }}
                            placeholder={n === 1 ? "In most villas" : n === 2 ? "For families & groups" : n === 3 ? "Luxury redefined" : "24/7 assistance"}
                            className="border p-2 rounded text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="font-bold text-gray-600 uppercase">Cover Banner Image</label>
                <div className="flex items-center gap-3">
                  {coverImagePreview && (
                    <div className="relative w-24 aspect-[2/1] rounded border overflow-hidden shrink-0">
                      <img src={coverImagePreview} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                  <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-500">Upload Banner Image</span>
                    <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" required={!editingSubgroup} />
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubgroupModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingSubgroup} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingSubgroup ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Category</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ACCOMMODATION / STAY DETAILS FORM
      ======================================================== */}
      {showStayModal && stayForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-none sm:rounded-md max-w-4xl w-full h-screen sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl border-0 sm:border border-gray-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingStay ? "Edit Accommodation Stay" : "Create Accommodation Stay"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure layout, assets, and details checklist</p>
              </div>
              <button onClick={() => setShowStayModal(false)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selection Tabs */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            {/* Scroll Form Content */}
            <form onSubmit={handleSaveStay} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* SECTION: GENERAL SPECS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">1. General Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Property Category</label>
                    <select
                      value={stayForm.accommodationType}
                      onChange={(e) => setStayForm({ ...stayForm, accommodationType: e.target.value as any })}
                      className="border border-gray-200 p-2.5 rounded bg-white"
                    >
                      <option value="villa">Entire Villa</option>
                      <option value="floor">Private Floor</option>
                      <option value="room">Individual Room</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Slug Identifier (Unique URL)</label>
                    <input
                      type="text"
                      value={stayForm.slug}
                      onChange={(e) => setStayForm({ ...stayForm, slug: e.target.value })}
                      placeholder="e.g. lemon-grove-villa"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Starting Price per Period (₹)</label>
                    <input
                      type="number"
                      value={stayForm.price}
                      onChange={(e) => setStayForm({ ...stayForm, price: Number(e.target.value) })}
                      placeholder="e.g. 24500"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Bedrooms</label>
                    <input
                      type="number"
                      value={stayForm.bedrooms}
                      onChange={(e) => setStayForm({ ...stayForm, bedrooms: Number(e.target.value) })}
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Bathrooms</label>
                    <input
                      type="number"
                      value={stayForm.bathrooms}
                      onChange={(e) => setStayForm({ ...stayForm, bathrooms: Number(e.target.value) })}
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Max Guests</label>
                    <input
                      type="number"
                      value={stayForm.guests}
                      onChange={(e) => setStayForm({ ...stayForm, guests: Number(e.target.value) })}
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Check-In Time</label>
                    <input
                      type="text"
                      value={stayForm.checkInTime}
                      onChange={(e) => setStayForm({ ...stayForm, checkInTime: e.target.value })}
                      placeholder="14:00"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Check-Out Time</label>
                    <input
                      type="text"
                      value={stayForm.checkOutTime}
                      onChange={(e) => setStayForm({ ...stayForm, checkOutTime: e.target.value })}
                      placeholder="11:00"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-4">
                  <label className="font-bold text-gray-600 uppercase">Google Maps Embed Link (Src URL)</label>
                  <input
                    type="text"
                    value={stayForm.mapLink || ""}
                    onChange={(e) => setStayForm({ ...stayForm, mapLink: e.target.value })}
                    placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                    className="border border-gray-200 p-2.5 rounded w-full"
                  />
                </div>
              </div>

              {/* SECTION: TRANSLATED CORE FIELDS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                  2. Localized Text Fields ({activeLangTab.toUpperCase()})
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Property Title</label>
                    <input
                      type="text"
                      value={stayForm.title?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const title = { ...stayForm.title, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, title });
                      }}
                      placeholder="Lemon Grove Villa"
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Price Period Label</label>
                    <input
                      type="text"
                      value={stayForm.pricePeriod?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const pricePeriod = { ...stayForm.pricePeriod, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, pricePeriod });
                      }}
                      placeholder="/ night"
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Location Descriptor</label>
                    <input
                      type="text"
                      value={stayForm.location?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const location = { ...stayForm.location, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, location });
                      }}
                      placeholder="Varkala, Kerala"
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Tagline (Detail Page Top)</label>
                    <input
                      type="text"
                      value={stayForm.tagline?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const tagline = { ...stayForm.tagline, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, tagline });
                      }}
                      placeholder="Unrivaled ocean breezes surrounding private pool sanctuary..."
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Short Card Description</label>
                  <textarea
                    rows={2}
                    value={stayForm.shortDescription?.[activeLangTab] || ""}
                    onChange={(e) => {
                      const shortDescription = { ...stayForm.shortDescription, [activeLangTab]: e.target.value } as any;
                      setStayForm({ ...stayForm, shortDescription });
                    }}
                    placeholder="Short description displayed on card catalog grids."
                    className="border border-gray-200 p-2.5 rounded font-sans"
                    required={activeLangTab === "en"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Overview About Text (Para 1)</label>
                    <textarea
                      rows={4}
                      value={stayForm.aboutText1?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const aboutText1 = { ...stayForm.aboutText1, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, aboutText1 });
                      }}
                      placeholder="Main about paragraph..."
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Overview About Text (Para 2)</label>
                    <textarea
                      rows={4}
                      value={stayForm.aboutText2?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const aboutText2 = { ...stayForm.aboutText2, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, aboutText2 });
                      }}
                      placeholder="Secondary about paragraph..."
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Perfect Location Details</label>
                    <textarea
                      rows={2}
                      value={stayForm.perfectLocationText?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const perfectLocationText = { ...stayForm.perfectLocationText, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, perfectLocationText });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Group Capacity Info</label>
                    <textarea
                      rows={2}
                      value={stayForm.groupAccommodationText?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const groupAccommodationText = { ...stayForm.groupAccommodationText, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, groupAccommodationText });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: TWO IMAGES ASSETS UPLOADS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">3. Cover Photo & About Photo Assets</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Cover Photo */}
                  <div className="space-y-2">
                    <label className="font-bold text-gray-600 uppercase">Main Cover Image Banner</label>
                    <div className="flex items-center gap-3">
                      {coverImagePreview && (
                        <div className="relative w-24 aspect-[4/3] rounded border bg-gray-100 overflow-hidden shrink-0">
                          <img src={coverImagePreview} className="w-full h-full object-cover" alt="Cover Preview" />
                        </div>
                      )}
                      <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-500">Upload Cover Image</span>
                        <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" required={!editingStay} />
                      </label>
                    </div>
                  </div>

                  {/* About Photo */}
                  <div className="space-y-2">
                    <label className="font-bold text-gray-600 uppercase">About Section Image (Hammock Photo)</label>
                    <div className="flex items-center gap-3">
                      {aboutImagePreview && (
                        <div className="relative w-24 aspect-[4/3] rounded border bg-gray-100 overflow-hidden shrink-0">
                          <img src={aboutImagePreview} className="w-full h-full object-cover" alt="About Preview" />
                        </div>
                      )}
                      <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-500">Upload About Image</span>
                        <input type="file" accept="image/*" onChange={handleAboutImageChange} className="hidden" required={!editingStay} />
                      </label>
                    </div>
                  </div>

                  {/* Gallery Photos */}
                  <div className="space-y-3 sm:col-span-2 pt-4 border-t">
                    <label className="font-bold text-gray-600 uppercase block">Rooms & Villa Gallery Photos</label>
                    
                    {/* Existing Gallery Images with delete buttons */}
                    {stayForm.gallery && stayForm.gallery.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-3 bg-white p-3 rounded border shadow-inner">
                        {stayForm.gallery.map((url: string, idx: number) => (
                          <div key={idx} className="relative aspect-[4/3] rounded border overflow-hidden group bg-gray-100">
                            <img src={url} className="w-full h-full object-cover animate-fade-in" alt={`Gallery ${idx}`} />
                            <button
                              type="button"
                              onClick={() => {
                                const gallery = (stayForm.gallery || []).filter((_, i) => i !== idx);
                                setStayForm({ ...stayForm, gallery });
                              }}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 opacity-90 transition-opacity shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Upload File Zone */}
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-6 text-center cursor-pointer bg-white hover:bg-gray-50">
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="font-semibold text-gray-500">Select Rooms & Villa Photos (Multiple allowed)</span>
                          <span className="text-[10px] text-gray-400">Add up to 10 images</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              setNewGalleryFiles((prev) => [...prev, ...files]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Preview of newly selected files to upload */}
                      {newGalleryFiles.length > 0 && (
                        <div className="bg-amber-50/50 border border-amber-200/60 rounded p-3 text-left">
                          <span className="font-bold text-amber-800 text-[10px] uppercase block tracking-wider mb-2">New uploads (Pending save)</span>
                          <div className="flex flex-wrap gap-2">
                            {newGalleryFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-white border border-amber-200 px-2.5 py-1.5 rounded text-xs text-amber-900 shadow-sm">
                                <span className="max-w-[150px] truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-500 hover:text-red-700 font-bold"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: STRUCTURAL ARRAY LISTS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">4. Amenities & Services sub-lists</h4>
                
                {/* Room Amenities list editor */}
                <div className="space-y-2 text-left">
                  <label className="font-bold text-gray-600 uppercase block">Room Amenities Checklist ({activeLangTab.toUpperCase()})</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(stayForm.roomAmenities || []).map((am, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded">
                        <span>{am[activeLangTab] || ""}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const roomAmenities = [...(stayForm.roomAmenities || [])];
                            roomAmenities.splice(idx, 1);
                            setStayForm({ ...stayForm, roomAmenities });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      id="newAmenityInput"
                      placeholder="e.g. Free Wi-Fi"
                      className="border p-2 rounded flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (!input.value.trim()) return;
                          const roomAmenities = [...(stayForm.roomAmenities || [])];
                          roomAmenities.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, roomAmenities });
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newAmenityInput") as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const roomAmenities = [...(stayForm.roomAmenities || [])];
                          roomAmenities.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, roomAmenities });
                          input.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Ideal For list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Ideal For Matches Checklist ({activeLangTab.toUpperCase()})</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(stayForm.idealFor || []).map((ideal, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded">
                        <span>{ideal[activeLangTab] || ""}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const idealFor = [...(stayForm.idealFor || [])];
                            idealFor.splice(idx, 1);
                            setStayForm({ ...stayForm, idealFor });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      id="newIdealForInput"
                      placeholder="e.g. Yoga Retreats"
                      className="border p-2 rounded flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (!input.value.trim()) return;
                          const idealFor = [...(stayForm.idealFor || [])];
                          idealFor.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, idealFor });
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newIdealForInput") as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const idealFor = [...(stayForm.idealFor || [])];
                          idealFor.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, idealFor });
                          input.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Why Guests Love Us list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Why Guests Love Us List ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    {(stayForm.whyGuestsLoveUs || []).map((w, idx) => (
                      <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                        <div>
                          <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] block">icon: {w.icon}</span>
                          <h5 className="font-serif font-bold text-xs text-[#121212] mt-0.5">{w.title[activeLangTab]}</h5>
                          <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-relaxed font-sans">{w.desc[activeLangTab]}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const whyGuestsLoveUs = [...(stayForm.whyGuestsLoveUs || [])];
                            whyGuestsLoveUs.splice(idx, 1);
                            setStayForm({ ...stayForm, whyGuestsLoveUs });
                          }}
                          className="text-red-500 shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-100/50 border rounded p-4 space-y-3">
                    <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New "Why Guests Love Us" item</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Icon key</label>
                        <select id="newLoveIcon" className="border p-2 rounded bg-white text-xs">
                          <option value="star">Star</option>
                          <option value="coffee">Coffee (Breakfast)</option>
                          <option value="sunset">Sunset</option>
                          <option value="balcony">Balcony</option>
                          <option value="chat">Chat / Hosts</option>
                          <option value="pool">Pool</option>
                          <option value="wifi">WiFi</option>
                          <option value="shield">Shield / Safe</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Title</label>
                        <input type="text" id="newLoveTitle" placeholder="e.g. Organic Breakfast" className="border p-2 rounded text-xs" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500 text-[9px] uppercase">Description</label>
                      <textarea id="newLoveDesc" rows={2} placeholder="e.g. Freshly prepared local delicacies served on your balcony." className="border p-2 rounded text-xs font-sans" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const iconSelect = document.getElementById("newLoveIcon") as HTMLSelectElement;
                        const titleIn = document.getElementById("newLoveTitle") as HTMLInputElement;
                        const descIn = document.getElementById("newLoveDesc") as HTMLTextAreaElement;
                        if (iconSelect && titleIn && descIn && titleIn.value.trim() && descIn.value.trim()) {
                          const whyGuestsLoveUs = [...(stayForm.whyGuestsLoveUs || [])];
                          whyGuestsLoveUs.push({
                            icon: iconSelect.value,
                            title: createEmptyLocalizedText(titleIn.value.trim()),
                            desc: createEmptyLocalizedText(descIn.value.trim())
                          });
                          setStayForm({ ...stayForm, whyGuestsLoveUs });
                          titleIn.value = "";
                          descIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Distances Editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Landmarks Distances table ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(stayForm.distances || []).map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between border bg-white p-2 rounded gap-2">
                        <span className="font-medium truncate">{d.place[activeLangTab]} - {d.distance[activeLangTab]}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const distances = [...(stayForm.distances || [])];
                            distances.splice(idx, 1);
                            setStayForm({ ...stayForm, distances });
                          }}
                          className="text-red-500 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-md pt-1">
                    <input type="text" id="newPlaceInput" placeholder="Landmark Place e.g. Black Beach" className="border p-2 rounded w-1/2" />
                    <input type="text" id="newDistanceInput" placeholder="Distance e.g. 900 m" className="border p-2 rounded w-1/3" />
                    <button
                      type="button"
                      onClick={() => {
                        const placeIn = document.getElementById("newPlaceInput") as HTMLInputElement;
                        const distIn = document.getElementById("newDistanceInput") as HTMLInputElement;
                        if (placeIn && distIn && placeIn.value.trim() && distIn.value.trim()) {
                          const distances = [...(stayForm.distances || [])];
                          distances.push({
                            place: createEmptyLocalizedText(placeIn.value.trim()),
                            distance: createEmptyLocalizedText(distIn.value.trim())
                          });
                          setStayForm({ ...stayForm, distances });
                          placeIn.value = "";
                          distIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3 py-2 rounded font-bold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Highlights list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Property Highlights (Key Features) ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    {(stayForm.highlights || []).map((h, idx) => (
                      <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">Icon: {h.icon}</span>
                          <span className="font-medium text-xs text-[#121212]">{h.label[activeLangTab]}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const highlights = [...(stayForm.highlights || [])];
                            highlights.splice(idx, 1);
                            setStayForm({ ...stayForm, highlights });
                          }}
                          className="text-red-500 hover:text-red-700 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-md pt-1">
                    <select id="newHighlightIcon" className="border p-2 rounded bg-white text-xs w-1/3">
                      <option value="wifi">WiFi</option>
                      <option value="pool">Pool</option>
                      <option value="coffee">Coffee / Breakfast</option>
                      <option value="shield">Security</option>
                      <option value="sunset">Sunset View</option>
                      <option value="balcony">Balcony</option>
                      <option value="wind">AC / Breeze</option>
                      <option value="tv">TV</option>
                      <option value="key">Key Access</option>
                      <option value="compass">Compass / Guide</option>
                    </select>
                    <input
                      type="text"
                      id="newHighlightLabel"
                      placeholder="Highlight label e.g. Free Wi-Fi"
                      className="border p-2 rounded w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const iconSelect = document.getElementById("newHighlightIcon") as HTMLSelectElement;
                        const labelIn = document.getElementById("newHighlightLabel") as HTMLInputElement;
                        if (iconSelect && labelIn && labelIn.value.trim()) {
                          const highlights = [...(stayForm.highlights || [])];
                          highlights.push({
                            icon: iconSelect.value,
                            label: createEmptyLocalizedText(labelIn.value.trim())
                          });
                          setStayForm({ ...stayForm, highlights });
                          labelIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-bold uppercase tracking-wider text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Check In Out Rules list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Check-In / Check-Out Rules Checklist ({activeLangTab.toUpperCase()})</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(stayForm.checkInOutRules || []).map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded">
                        <span>{rule[activeLangTab] || ""}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const checkInOutRules = [...(stayForm.checkInOutRules || [])];
                            checkInOutRules.splice(idx, 1);
                            setStayForm({ ...stayForm, checkInOutRules });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      id="newRuleInput"
                      placeholder="e.g. Quiet hours after 10 PM"
                      className="border p-2 rounded flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (!input.value.trim()) return;
                          const checkInOutRules = [...(stayForm.checkInOutRules || [])];
                          checkInOutRules.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, checkInOutRules });
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newRuleInput") as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const checkInOutRules = [...(stayForm.checkInOutRules || [])];
                          checkInOutRules.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, checkInOutRules });
                          input.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Additional Services list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Additional Services List ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    {(stayForm.additionalServices || []).map((s, idx) => (
                      <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                        <div>
                          <h5 className="font-serif font-bold text-xs text-[#121212]">{s.service[activeLangTab]}</h5>
                          <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-relaxed font-sans">{s.details[activeLangTab]}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const additionalServices = [...(stayForm.additionalServices || [])];
                            additionalServices.splice(idx, 1);
                            setStayForm({ ...stayForm, additionalServices });
                          }}
                          className="text-red-500 shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-100/50 border rounded p-4 space-y-3">
                    <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New Additional Service</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Service Name</label>
                        <input type="text" id="newServiceName" placeholder="e.g. Airport Transfer" className="border p-2 rounded text-xs" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Service Details</label>
                        <input type="text" id="newServiceDetails" placeholder="e.g. Price on request, luxury sedan transfer." className="border p-2 rounded text-xs" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nameIn = document.getElementById("newServiceName") as HTMLInputElement;
                        const detailsIn = document.getElementById("newServiceDetails") as HTMLInputElement;
                        if (nameIn && detailsIn && nameIn.value.trim() && detailsIn.value.trim()) {
                          const additionalServices = [...(stayForm.additionalServices || [])];
                          additionalServices.push({
                            service: createEmptyLocalizedText(nameIn.value.trim()),
                            details: createEmptyLocalizedText(detailsIn.value.trim())
                          });
                          setStayForm({ ...stayForm, additionalServices });
                          nameIn.value = "";
                          detailsIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                    >
                      Add Service
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION: RELATED STAYS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">You May Also Like (Related Stays)</h4>
                <p className="text-[10px] text-gray-500">Select up to 3 stays to recommend at the bottom of this stay's details page.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => {
                    const currentSelected = stayForm.relatedAccommodations?.[index] || "";
                    return (
                      <div key={index} className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Recommendation #{index + 1}</label>
                        <select
                          value={currentSelected}
                          onChange={(e) => {
                            const newRelated = [...(stayForm.relatedAccommodations || [])];
                            while (newRelated.length < 3) {
                              newRelated.push("");
                            }
                            newRelated[index] = e.target.value;
                            setStayForm({ ...stayForm, relatedAccommodations: newRelated });
                          }}
                        >
                          <option value="">-- None --</option>
                          <optgroup label="Stays / Accommodations">
                            {stays
                              .filter((s) => s.slug !== stayForm.slug)
                              .map((s) => (
                                <option key={s._id} value={s.slug}>
                                  🏨 {s.title[activeLangTab] || s.title["en"] || s.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Tours / Packages">
                            {packages
                              .filter((p) => p.slug !== stayForm.slug)
                              .map((p) => (
                                <option key={p._id} value={p.slug}>
                                  🎒 {p.title[activeLangTab] || p.title["en"] || p.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Yoga Programs">
                            {yogas
                              .filter((y) => y.slug !== stayForm.slug)
                              .map((y) => (
                                <option key={y._id} value={y.slug}>
                                  🧘 {y.title[activeLangTab] || y.title["en"] || y.slug}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStayModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStay}
                  className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {savingStay ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Stay...</span>
                    </>
                  ) : (
                    <span>Save Stay</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TOUR PACKAGE FORM
      ======================================================== */}
      {showPackageModal && packageForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingPackage ? "Edit Tour Package" : "Create Tour Package"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure itinerary, inclusions, and covers</p>
              </div>
              <button onClick={() => setShowPackageModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <div className="px-6 py-2 border-b border-gray-100 bg-gray-50 flex gap-2 flex-wrap text-[10px] font-bold uppercase tracking-wider">
              {[
                { id: "general", label: "General Info" },
                { id: "localized", label: "Content" },
                { id: "media", label: "Media" },
                { id: "highlights", label: "Highlights & Facts" },
                { id: "checklists", label: "Checklists" },
                { id: "itinerary", label: "Itinerary" },
                { id: "related", label: "Related & FAQs" },
                { id: "seo", label: "SEO" },
                { id: "booking", label: "Booking Details" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePkgFormTab(tab.id)}
                  className={`px-3 py-1.5 rounded-sm transition-all duration-200 ${
                    activePkgFormTab === tab.id ? "bg-[#121212] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSavePackage} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              {activePkgFormTab === "general" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Package Category</label>
                      <select
                        value={packageForm.packageCategory}
                        onChange={(e) => setPackageForm({ ...packageForm, packageCategory: e.target.value as any })}
                        className="border p-2.5 rounded bg-white text-xs"
                      >
                        <option value="varkalaSightseeing">Varkala Sightseeing</option>
                        <option value="dayTrips">Day Trips</option>
                        <option value="backwaterExperiences">Backwater Experiences</option>
                        <option value="adventureActivities">Adventure Activities</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Unique Slug URL</label>
                      <input
                        type="text"
                        value={packageForm.slug}
                        onChange={(e) => setPackageForm({ ...packageForm, slug: e.target.value })}
                        className="border p-2.5 rounded text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Starting Price (₹)</label>
                      <input
                        type="number"
                        value={packageForm.price}
                        onChange={(e) => setPackageForm({ ...packageForm, price: Number(e.target.value) })}
                        className="border p-2.5 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Duration ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.duration?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const duration = { ...packageForm.duration, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, duration });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. 4 Hours"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Travel Time ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.travelTime?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const travelTime = { ...packageForm.travelTime, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, travelTime });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. 1 Hour each way"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Entry Fee ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.entryFee?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const entryFee = { ...packageForm.entryFee, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, entryFee });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Included / ₹100 per person"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Optional Charges ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.optionalCharges?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const optionalCharges = { ...packageForm.optionalCharges, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, optionalCharges });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Camera charges ₹50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Difficulty ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.difficulty?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const difficulty = { ...packageForm.difficulty, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, difficulty });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Easy / Moderate"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Group Size ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.groupSize?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const groupSize = { ...packageForm.groupSize, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, groupSize });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Max 10 people"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="font-bold text-gray-600 uppercase">Location ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.location?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const location = { ...packageForm.location, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, location });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Munroe Island, Kollam"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "localized" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Localized Content ({activeLangTab.toUpperCase()})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Package Title</label>
                        <input
                          type="text"
                          value={packageForm.title?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const title = { ...packageForm.title, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, title });
                          }}
                          className="border p-2.5 rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Price Period Label</label>
                        <input
                          type="text"
                          value={packageForm.pricePeriod?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const pricePeriod = { ...packageForm.pricePeriod, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, pricePeriod });
                          }}
                          className="border p-2.5 rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-bold text-gray-600 uppercase">Tagline</label>
                        <input
                          type="text"
                          value={packageForm.tagline?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const tagline = { ...packageForm.tagline, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, tagline });
                          }}
                          className="border p-2.5 rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Short Description</label>
                        <textarea
                          rows={3}
                          value={packageForm.shortDescription?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const shortDescription = { ...packageForm.shortDescription, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, shortDescription });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">About (Full Description)</label>
                        <textarea
                          rows={3}
                          value={packageForm.aboutText?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const aboutText = { ...packageForm.aboutText, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, aboutText });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-bold text-gray-600 uppercase">Tour Overview</label>
                        <textarea
                          rows={3}
                          value={packageForm.tourOverview?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const tourOverview = { ...packageForm.tourOverview, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, tourOverview });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Best Time to Visit</label>
                        <input
                          type="text"
                          value={packageForm.bestTime?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const bestTime = { ...packageForm.bestTime, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, bestTime });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Evening sunset / Nov-Feb"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Dress Code</label>
                        <input
                          type="text"
                          value={packageForm.dressCode?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const dressCode = { ...packageForm.dressCode, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, dressCode });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Modest wear / Beachwear"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-bold text-gray-600 uppercase">CTA Button Text</label>
                        <input
                          type="text"
                          value={packageForm.cta?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const cta = { ...packageForm.cta, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, cta });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Book Sightseeing / Enquire"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "media" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold text-gray-600 uppercase">Cover Banner Image</label>
                      <div className="flex items-center gap-3">
                        {coverImagePreview && (
                          <div className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0">
                            <img src={coverImagePreview} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-500">Upload Cover Image</span>
                          <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-gray-600 uppercase">Details Section Image</label>
                      <div className="flex items-center gap-3">
                        {aboutImagePreview && (
                          <div className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0">
                            <img src={aboutImagePreview} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-500">Upload Detail Image</span>
                          <input type="file" accept="image/*" onChange={handleAboutImageChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">YouTube / Video Embed Link</label>
                    <input
                      type="text"
                      value={packageForm.video || ""}
                      onChange={(e) => setPackageForm({ ...packageForm, video: e.target.value })}
                      className="border p-2.5 rounded text-xs bg-white"
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Tour Gallery Photos</label>
                    
                    {/* Existing Gallery Images with delete buttons */}
                    {packageForm.gallery && packageForm.gallery.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-3 bg-white p-3 rounded border shadow-inner">
                        {packageForm.gallery.map((url: string, idx: number) => (
                          <div key={idx} className="relative aspect-[4/3] rounded border overflow-hidden group bg-gray-100">
                            <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                            <button
                              type="button"
                              onClick={() => {
                                const gallery = (packageForm.gallery || []).filter((_, i) => i !== idx);
                                setPackageForm({ ...packageForm, gallery });
                              }}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 opacity-90 transition-opacity shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Upload File Zone */}
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-6 text-center cursor-pointer bg-white hover:bg-gray-50">
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="font-semibold text-gray-500">Select Gallery Photos (Multiple allowed)</span>
                          <span className="text-[10px] text-gray-400">Add up to 10 images</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              setNewGalleryFiles((prev) => [...prev, ...files]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Preview of newly selected files to upload */}
                      {newGalleryFiles.length > 0 && (
                        <div className="bg-amber-50/50 border border-amber-200/60 rounded p-3 text-left">
                          <span className="font-bold text-amber-800 text-[10px] uppercase block tracking-wider mb-2">New uploads (Pending save)</span>
                          <div className="flex flex-wrap gap-2">
                            {newGalleryFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-white border border-amber-200 px-2.5 py-1.5 rounded text-xs text-amber-900 shadow-sm">
                                <span className="max-w-[150px] truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-500 hover:text-red-700 font-bold"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "highlights" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Highlights list editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Highlights Editor ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.highlights || []).map((h, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">Icon: {h.icon}</span>
                            <span className="font-medium text-xs text-[#121212]">{h.label[activeLangTab]}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const highlights = [...(packageForm.highlights || [])];
                              highlights.splice(idx, 1);
                              setPackageForm({ ...packageForm, highlights });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New Highlight</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Icon Type</label>
                          <select id="newHighlightIcon" className="border p-2 rounded bg-white text-xs">
                            <option value="compass">Compass / Sightseeing</option>
                            <option value="boat">Boat / Backwater</option>
                            <option value="sun">Sun / Sunset</option>
                            <option value="camera">Camera / Sightseeing</option>
                            <option value="wave">Wave / Beach</option>
                            <option value="walk">Walk / Trekking</option>
                            <option value="check">Check / Inclusive</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Highlight Text</label>
                          <input type="text" id="newHighlightLabel" placeholder="e.g. Sunset Boat Cruise" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const iconIn = document.getElementById("newHighlightIcon") as HTMLSelectElement;
                          const labelIn = document.getElementById("newHighlightLabel") as HTMLInputElement;
                          if (iconIn && labelIn && labelIn.value.trim()) {
                            const highlights = [...(packageForm.highlights || [])];
                            highlights.push({
                              icon: iconIn.value,
                              label: createEmptyLocalizedText(labelIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, highlights });
                            labelIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Highlight
                      </button>
                    </div>
                  </div>

                  {/* Why Guests Love Us list editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Why Guests Love Us ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.whyGuestsLoveUs || []).map((w, idx) => (
                        <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                          <div>
                            <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] bg-gray-100 px-1.5 py-0.5 rounded inline-block mb-1">Icon: {w.icon}</span>
                            <h5 className="font-serif font-bold text-xs text-[#121212]">{w.title[activeLangTab]}</h5>
                            <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-relaxed font-sans">{w.desc[activeLangTab]}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const whyGuestsLoveUs = [...(packageForm.whyGuestsLoveUs || [])];
                              whyGuestsLoveUs.splice(idx, 1);
                              setPackageForm({ ...packageForm, whyGuestsLoveUs });
                            }}
                            className="text-red-500 shrink-0 mt-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New "Why Guests Love Us" item</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Icon key</label>
                          <select id="newPkgLoveIcon" className="border p-2 rounded bg-white text-xs">
                            <option value="star">Star / Rating</option>
                            <option value="coffee">Coffee / Meals</option>
                            <option value="sunset">Sunset view</option>
                            <option value="chat">Chat / Guide</option>
                            <option value="shield">Shield / Safe</option>
                            <option value="compass">Compass / Adventure</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Title</label>
                          <input type="text" id="newPkgLoveTitle" placeholder="e.g. Guided Experience" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Description</label>
                        <textarea id="newPkgLoveDesc" rows={2} placeholder="e.g. Expert guide with rich storytelling." className="border p-2 rounded text-xs font-sans" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const iconSelect = document.getElementById("newPkgLoveIcon") as HTMLSelectElement;
                          const titleIn = document.getElementById("newPkgLoveTitle") as HTMLInputElement;
                          const descIn = document.getElementById("newPkgLoveDesc") as HTMLTextAreaElement;
                          if (iconSelect && titleIn && descIn && titleIn.value.trim() && descIn.value.trim()) {
                            const whyGuestsLoveUs = [...(packageForm.whyGuestsLoveUs || [])];
                            whyGuestsLoveUs.push({
                              icon: iconSelect.value,
                              title: createEmptyLocalizedText(titleIn.value.trim()),
                              desc: createEmptyLocalizedText(descIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, whyGuestsLoveUs });
                            titleIn.value = "";
                            descIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  {/* Quick Facts list editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Quick Facts ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.quickFacts || []).map((fact, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2 shadow-sm">
                          <span className="font-medium text-xs">
                            <strong className="text-gray-700">{fact.key[activeLangTab]}:</strong> {fact.value[activeLangTab]}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const quickFacts = [...(packageForm.quickFacts || [])];
                              quickFacts.splice(idx, 1);
                              setPackageForm({ ...packageForm, quickFacts });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New Quick Fact</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Fact Label / Key</label>
                          <input type="text" id="newFactKey" placeholder="e.g. Best Time" className="border p-2 rounded text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Fact Value</label>
                          <input type="text" id="newFactValue" placeholder="e.g. Morning flow" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const keyIn = document.getElementById("newFactKey") as HTMLInputElement;
                          const valIn = document.getElementById("newFactValue") as HTMLInputElement;
                          if (keyIn && valIn && keyIn.value.trim() && valIn.value.trim()) {
                            const quickFacts = [...(packageForm.quickFacts || [])];
                            quickFacts.push({
                              key: createEmptyLocalizedText(keyIn.value.trim()),
                              value: createEmptyLocalizedText(valIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, quickFacts });
                            keyIn.value = "";
                            valIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Fact
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "checklists" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Inclusions */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Inclusions List ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(packageForm.inclusions || []).map((inc, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <span className="font-medium truncate text-xs text-[#121212]">{inc[activeLangTab]}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const inclusions = [...(packageForm.inclusions || [])];
                              inclusions.splice(idx, 1);
                              setPackageForm({ ...packageForm, inclusions });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-sm pt-2">
                      <input
                        type="text"
                        id="newInclusionInput"
                        placeholder="e.g. Life jackets / Water bottle"
                        className="border p-2 rounded flex-grow text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (!input.value.trim()) return;
                            const inclusions = [...(packageForm.inclusions || [])];
                            inclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, inclusions });
                            input.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("newInclusionInput") as HTMLInputElement;
                          if (input && input.value.trim()) {
                            const inclusions = [...(packageForm.inclusions || [])];
                            inclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, inclusions });
                            input.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider text-[10px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Exclusions List ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(packageForm.exclusions || []).map((exc, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <span className="font-medium truncate text-xs text-[#121212]">{exc[activeLangTab]}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const exclusions = [...(packageForm.exclusions || [])];
                              exclusions.splice(idx, 1);
                              setPackageForm({ ...packageForm, exclusions });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-sm pt-2">
                      <input
                        type="text"
                        id="newExclusionInput"
                        placeholder="e.g. Gratitude tips"
                        className="border p-2 rounded flex-grow text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (!input.value.trim()) return;
                            const exclusions = [...(packageForm.exclusions || [])];
                            exclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, exclusions });
                            input.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("newExclusionInput") as HTMLInputElement;
                          if (input && input.value.trim()) {
                            const exclusions = [...(packageForm.exclusions || [])];
                            exclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, exclusions });
                            input.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider text-[10px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Things to bring */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Things to Bring ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(packageForm.thingsToBring || []).map((thing, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <span className="font-medium truncate text-xs text-[#121212]">{thing[activeLangTab]}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const thingsToBring = [...(packageForm.thingsToBring || [])];
                              thingsToBring.splice(idx, 1);
                              setPackageForm({ ...packageForm, thingsToBring });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-sm pt-2">
                      <input
                        type="text"
                        id="newBringInput"
                        placeholder="e.g. Camera / Hat / Sunscreen"
                        className="border p-2 rounded flex-grow text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (!input.value.trim()) return;
                            const thingsToBring = [...(packageForm.thingsToBring || [])];
                            thingsToBring.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, thingsToBring });
                            input.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("newBringInput") as HTMLInputElement;
                          if (input && input.value.trim()) {
                            const thingsToBring = [...(packageForm.thingsToBring || [])];
                            thingsToBring.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, thingsToBring });
                            input.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider text-[10px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "itinerary" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Itinerary editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Itinerary Steps ({activeLangTab.toUpperCase()})</h4>
                    <div className="flex flex-col gap-3">
                      {(packageForm.itinerary || []).map((step, idx) => (
                        <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                          <div>
                            <span className="font-bold text-brand-gold uppercase tracking-wider text-[10px] block">{step.timeOrDay[activeLangTab]}</span>
                            <h5 className="font-serif font-semibold text-xs text-[#121212] mt-1">{step.activity[activeLangTab]}</h5>
                            <p className="text-[11px] text-gray-500 font-light font-sans mt-0.5">{step.desc[activeLangTab]}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const itinerary = [...(packageForm.itinerary || [])];
                              itinerary.splice(idx, 1);
                              setPackageForm({ ...packageForm, itinerary });
                            }}
                            className="text-red-500 mt-1 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end pt-2 border-t border-dashed">
                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">Time/Day Label</label>
                        <input type="text" id="newStepTime" placeholder="e.g. 09:00 AM" className="border p-2 rounded w-full text-xs" />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">Activity Label</label>
                        <input type="text" id="newStepActivity" placeholder="e.g. Cliff Helipad Meetup" className="border p-2 rounded w-full text-xs" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" id="newStepDesc" placeholder="e.g. Coordinator details..." className="border p-2 rounded flex-grow text-xs" />
                        <button
                          type="button"
                          onClick={() => {
                            const tIn = document.getElementById("newStepTime") as HTMLInputElement;
                            const aIn = document.getElementById("newStepActivity") as HTMLInputElement;
                            const dIn = document.getElementById("newStepDesc") as HTMLInputElement;
                            if (tIn && aIn && dIn && tIn.value.trim() && aIn.value.trim() && dIn.value.trim()) {
                              const itinerary = [...(packageForm.itinerary || [])];
                              itinerary.push({
                                timeOrDay: createEmptyLocalizedText(tIn.value.trim()),
                                activity: createEmptyLocalizedText(aIn.value.trim()),
                                desc: createEmptyLocalizedText(dIn.value.trim())
                              });
                              setPackageForm({ ...packageForm, itinerary });
                              tIn.value = "";
                              aIn.value = "";
                              dIn.value = "";
                            }
                          }}
                          className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider shrink-0 text-[10px]"
                        >
                          Add Step
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Attractions */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Nearby Attractions ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.nearbyAttractions || []).map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2 shadow-sm">
                          <span className="font-medium text-xs">
                            <strong className="text-gray-700">{att.name[activeLangTab]}:</strong> {att.distance[activeLangTab]}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const nearbyAttractions = [...(packageForm.nearbyAttractions || [])];
                              nearbyAttractions.splice(idx, 1);
                              setPackageForm({ ...packageForm, nearbyAttractions });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add Nearby Attraction</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Attraction Name</label>
                          <input type="text" id="newAttName" placeholder="e.g. Varkala Aquarium" className="border p-2 rounded text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Distance</label>
                          <input type="text" id="newAttDistance" placeholder="e.g. 5 km" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nameIn = document.getElementById("newAttName") as HTMLInputElement;
                          const distIn = document.getElementById("newAttDistance") as HTMLInputElement;
                          if (nameIn && distIn && nameIn.value.trim() && distIn.value.trim()) {
                            const nearbyAttractions = [...(packageForm.nearbyAttractions || [])];
                            nearbyAttractions.push({
                              name: createEmptyLocalizedText(nameIn.value.trim()),
                              distance: createEmptyLocalizedText(distIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, nearbyAttractions });
                            nameIn.value = "";
                            distIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Attraction
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "related" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Related Packages selectors */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Related Packages (You May Also Like)</label>
                    <p className="text-[10px] text-gray-500">Select up to 3 packages to recommend at the bottom of this package's details page.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => {
                        const currentSelected = packageForm.relatedPackages?.[index] || "";
                        return (
                          <div key={index} className="flex flex-col gap-1.5 bg-white p-3 border rounded shadow-2xs">
                            <label className="font-semibold text-gray-500 uppercase text-[10px]">Recommendation #{index + 1}</label>
                            <select
                              value={currentSelected}
                              onChange={(e) => {
                                const newRelated = [...(packageForm.relatedPackages || [])];
                                while (newRelated.length < 3) {
                                  newRelated.push("");
                                }
                                newRelated[index] = e.target.value;
                                setPackageForm({ ...packageForm, relatedPackages: newRelated });
                              }}
                              className="border border-gray-200 p-2.5 rounded bg-white text-xs mt-1"
                            >
                              <option value="">-- None --</option>
                              <optgroup label="Stays / Accommodations">
                                {stays
                                  .filter((s) => s.slug !== packageForm.slug)
                                  .map((s) => (
                                    <option key={s._id} value={s.slug}>
                                      🏨 {s.title[activeLangTab] || s.title["en"] || s.slug}
                                    </option>
                                  ))}
                              </optgroup>
                              <optgroup label="Tours / Packages">
                                {packages
                                  .filter((p) => p.slug !== packageForm.slug)
                                  .map((p) => (
                                    <option key={p._id} value={p.slug}>
                                      🎒 {p.title[activeLangTab] || p.title["en"] || p.slug}
                                    </option>
                                  ))}
                              </optgroup>
                              <optgroup label="Yoga Programs">
                                {yogas
                                  .filter((y) => y.slug !== packageForm.slug)
                                  .map((y) => (
                                    <option key={y._id} value={y.slug}>
                                      🧘 {y.title[activeLangTab] || y.title["en"] || y.slug}
                                    </option>
                                  ))}
                              </optgroup>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Frequently Asked Questions ({activeLangTab.toUpperCase()})</label>
                    <div className="flex flex-col gap-3">
                      {(packageForm.faqs || []).map((faq, idx) => (
                        <div key={idx} className="border bg-white p-3 rounded shadow-sm space-y-1 relative">
                          <h5 className="font-bold text-xs text-[#121212]">Q: {faq.question[activeLangTab]}</h5>
                          <p className="text-[11px] text-gray-600 font-light font-sans">A: {faq.answer[activeLangTab]}</p>
                          <button
                            type="button"
                            onClick={() => {
                              const faqs = [...(packageForm.faqs || [])];
                              faqs.splice(idx, 1);
                              setPackageForm({ ...packageForm, faqs });
                            }}
                            className="absolute top-2 right-2 text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add FAQ Item</span>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Question</label>
                          <input type="text" id="newFaqQuestion" placeholder="e.g. What is the dress code?" className="border p-2 rounded text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Answer</label>
                          <textarea id="newFaqAnswer" rows={2} placeholder="e.g. Dress modestly when visiting local villages." className="border p-2 rounded text-xs font-sans" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const qIn = document.getElementById("newFaqQuestion") as HTMLInputElement;
                          const aIn = document.getElementById("newFaqAnswer") as HTMLTextAreaElement;
                          if (qIn && aIn && qIn.value.trim() && aIn.value.trim()) {
                            const faqs = [...(packageForm.faqs || [])];
                            faqs.push({
                              question: createEmptyLocalizedText(qIn.value.trim()),
                              answer: createEmptyLocalizedText(aIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, faqs });
                            qIn.value = "";
                            aIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add FAQ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "seo" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">SEO Meta Parameters ({activeLangTab.toUpperCase()})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-bold text-gray-600 uppercase">Meta Title Tag</label>
                        <input
                          type="text"
                          value={packageForm.metaTitle?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const metaTitle = { ...packageForm.metaTitle, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, metaTitle });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Best Varkala Sightseeing Tour | Villa Lemon"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Meta Description</label>
                        <textarea
                          rows={3}
                          value={packageForm.metaDescription?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const metaDescription = { ...packageForm.metaDescription, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, metaDescription });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                          placeholder="Brief summary of package for search engines..."
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">SEO Keywords (Comma Separated)</label>
                        <textarea
                          rows={3}
                          value={packageForm.keywords?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const keywords = { ...packageForm.keywords, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, keywords });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                          placeholder="e.g. varkala, sightseeing, day trip, houseboat"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Canonical URL</label>
                      <input
                        type="text"
                        value={packageForm.canonicalUrl || ""}
                        onChange={(e) => setPackageForm({ ...packageForm, canonicalUrl: e.target.value })}
                        className="border p-2.5 rounded text-xs bg-white"
                        placeholder="e.g. https://villalemon.com/packages/varkala-sightseeing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-gray-600 uppercase">Social Sharing Image (OG Image)</label>
                      <div className="flex items-center gap-3">
                        {ogImagePreview && (
                          <div className="relative w-20 aspect-[12/6.3] rounded border overflow-hidden shrink-0">
                            <img src={ogImagePreview} className="w-full h-full object-cover" alt="SEO Preview" />
                          </div>
                        )}
                        <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-500">Upload Social Image</span>
                          <input type="file" accept="image/*" onChange={handleOgImageChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "booking" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Cancellation Rules ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={3}
                        value={packageForm.cancellation?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const cancellation = { ...packageForm.cancellation, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, cancellation });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Cancellation policy details..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Refund Terms ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={3}
                        value={packageForm.refund?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const refund = { ...packageForm.refund, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, refund });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Refund window and payment terms..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Pickup Location ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={2}
                        value={packageForm.pickup?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const pickup = { ...packageForm.pickup, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, pickup });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Pick up instructions..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Dropoff Details ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={2}
                        value={packageForm.drop?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const drop = { ...packageForm.drop, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, drop });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Drop off instructions..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="font-bold text-gray-600 uppercase">Important Notes ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={3}
                        value={packageForm.notes?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const notes = { ...packageForm.notes, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, notes });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Any additional notes or warnings..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingPackage} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingPackage ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Package</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: YOGA PROGRAM FORM
      ======================================================== */}
      {showYogaModal && yogaForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingYoga ? "Edit Yoga Program" : "Create Yoga Program"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure program types, benefits, and schedule</p>
              </div>
              <button onClick={() => setShowYogaModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveYoga} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Program Type</label>
                  <select
                    value={yogaForm.yogaType}
                    onChange={(e) => setYogaForm({ ...yogaForm, yogaType: e.target.value as any })}
                    className="border p-2.5 rounded bg-white"
                  >
                    <option value="retreats">Yoga Retreats</option>
                    <option value="classes">Daily Yoga Classes</option>
                    <option value="private">Private Yoga Sessions</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Slug segment (Unique URL)</label>
                  <input
                    type="text"
                    value={yogaForm.slug}
                    onChange={(e) => setYogaForm({ ...yogaForm, slug: e.target.value })}
                    className="border p-2.5 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Program Price (₹)</label>
                  <input
                    type="number"
                    value={yogaForm.price}
                    onChange={(e) => setYogaForm({ ...yogaForm, price: Number(e.target.value) })}
                    className="border p-2.5 rounded"
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Localized texts ({activeLangTab.toUpperCase()})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Program Title</label>
                    <input
                      type="text"
                      value={yogaForm.title?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const title = { ...yogaForm.title, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, title });
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Price Period</label>
                    <input
                      type="text"
                      value={yogaForm.pricePeriod?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const pricePeriod = { ...yogaForm.pricePeriod, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, pricePeriod });
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Duration Label</label>
                    <input
                      type="text"
                      value={yogaForm.duration?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const duration = { ...yogaForm.duration, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, duration });
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Tagline</label>
                  <input
                    type="text"
                    value={yogaForm.tagline?.[activeLangTab] || ""}
                    onChange={(e) => {
                      const tagline = { ...yogaForm.tagline, [activeLangTab]: e.target.value } as any;
                      setYogaForm({ ...yogaForm, tagline });
                    }}
                    className="border p-2.5 rounded"
                    required={activeLangTab === "en"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Short Description</label>
                    <textarea
                      rows={3}
                      value={yogaForm.shortDescription?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const shortDescription = { ...yogaForm.shortDescription, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, shortDescription });
                      }}
                      className="border p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Full Description (About Text)</label>
                    <textarea
                      rows={3}
                      value={yogaForm.aboutText?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const aboutText = { ...yogaForm.aboutText, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, aboutText });
                      }}
                      className="border p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>
              </div>

              {/* Image Uploads */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-bold text-gray-600 uppercase">Cover Banner Image</label>
                  <div className="flex items-center gap-3">
                    {coverImagePreview && (
                      <div className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0">
                        <img src={coverImagePreview} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                    <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-500">Upload Cover Image</span>
                      <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" required={!editingYoga} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-gray-600 uppercase">Details Section Image</label>
                  <div className="flex items-center gap-3">
                    {aboutImagePreview && (
                      <div className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0">
                        <img src={aboutImagePreview} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                    <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-500">Upload Detail Image</span>
                      <input type="file" accept="image/*" onChange={handleAboutImageChange} className="hidden" required={!editingYoga} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Schedule list editor */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Daily Schedule ({activeLangTab.toUpperCase()})</h4>
                <div className="flex flex-col gap-3">
                  {(yogaForm.schedule || []).map((sc, idx) => (
                    <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-3">
                      <div>
                        <span className="font-bold text-brand-gold uppercase tracking-wider text-[10px] block">{sc.time?.[activeLangTab]}</span>
                        <h5 className="font-serif font-semibold text-xs text-[#121212] mt-1">{sc.activity?.[activeLangTab]}</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const schedule = [...(yogaForm.schedule || [])];
                          schedule.splice(idx, 1);
                          setYogaForm({ ...yogaForm, schedule });
                        }}
                        className="text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 max-w-xl">
                  <input type="text" id="newScheduleTime" placeholder="e.g. 06:30 AM" className="border p-2 rounded w-1/3" />
                  <input type="text" id="newScheduleActivity" placeholder="e.g. Sunrise Yoga Flow" className="border p-2 rounded flex-grow" />
                  <button
                    type="button"
                    onClick={() => {
                      const tIn = document.getElementById("newScheduleTime") as HTMLInputElement;
                      const aIn = document.getElementById("newScheduleActivity") as HTMLInputElement;
                      if (tIn && aIn && tIn.value.trim() && aIn.value.trim()) {
                        const schedule = [...(yogaForm.schedule || [])];
                        schedule.push({
                          time: createEmptyLocalizedText(tIn.value.trim()),
                          activity: createEmptyLocalizedText(aIn.value.trim())
                        });
                        setYogaForm({ ...yogaForm, schedule });
                        tIn.value = "";
                        aIn.value = "";
                      }
                    }}
                    className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider shrink-0"
                  >
                    Add Schedule Block
                  </button>
                </div>
              </div>

              {/* SECTION: RELATED YOGA PROGRAMS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">You May Also Like (Related Yoga Programs)</h4>
                <p className="text-[10px] text-gray-500">Select up to 3 yoga programs to recommend at the bottom of this program's details page.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => {
                    const currentSelected = yogaForm.relatedYoga?.[index] || "";
                    return (
                      <div key={index} className="flex flex-col gap-1.5 bg-white p-3 border rounded shadow-2xs">
                        <label className="font-semibold text-gray-500 uppercase text-[10px]">Recommendation #{index + 1}</label>
                        <select
                          value={currentSelected}
                          onChange={(e) => {
                            const newRelated = [...(yogaForm.relatedYoga || [])];
                            while (newRelated.length < 3) {
                              newRelated.push("");
                            }
                            newRelated[index] = e.target.value;
                            setYogaForm({ ...yogaForm, relatedYoga: newRelated });
                          }}
                          className="border border-gray-200 p-2.5 rounded bg-white text-xs mt-1"
                        >
                          <option value="">-- None --</option>
                          <optgroup label="Stays / Accommodations">
                            {stays
                              .filter((s) => s.slug !== yogaForm.slug)
                              .map((s) => (
                                <option key={s._id} value={s.slug}>
                                  🏨 {s.title[activeLangTab] || s.title["en"] || s.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Tours / Packages">
                            {packages
                              .filter((p) => p.slug !== yogaForm.slug)
                              .map((p) => (
                                <option key={p._id} value={p.slug}>
                                  🎒 {p.title[activeLangTab] || p.title["en"] || p.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Yoga Programs">
                            {yogas
                              .filter((y) => y.slug !== yogaForm.slug)
                              .map((y) => (
                                <option key={y._id} value={y.slug}>
                                  🧘 {y.title[activeLangTab] || y.title["en"] || y.slug}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowYogaModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingYoga} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingYoga ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Program</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: YOGA TEACHER FORM
      ======================================================== */}
      {showTeacherModal && teacherForm.role && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingTeacher ? "Edit Teacher Profile" : "Create Teacher Profile"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure profile photo, name, and localized bio</p>
              </div>
              <button onClick={() => setShowTeacherModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveTeacher} className="flex-grow overflow-y-auto p-6 space-y-5 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase">Teacher's Full Name</label>
                <input
                  type="text"
                  value={teacherForm.name || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="e.g. Acharya Vishnu"
                  className="border p-2.5 rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase">Role / Specialty ({activeLangTab.toUpperCase()})</label>
                <input
                  type="text"
                  value={teacherForm.role?.[activeLangTab] || ""}
                  onChange={(e) => {
                    const role = { ...teacherForm.role, [activeLangTab]: e.target.value } as any;
                    setTeacherForm({ ...teacherForm, role });
                  }}
                  placeholder="e.g. Lead Yoga Acharya & Meditation Guide"
                  className="border p-2.5 rounded"
                  required={activeLangTab === "en"}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase">Short Bio ({activeLangTab.toUpperCase()})</label>
                <textarea
                  rows={4}
                  value={teacherForm.bio?.[activeLangTab] || ""}
                  onChange={(e) => {
                    const bio = { ...teacherForm.bio, [activeLangTab]: e.target.value } as any;
                    setTeacherForm({ ...teacherForm, bio });
                  }}
                  placeholder="Brief description of experience and mindfulness background..."
                  className="border p-2.5 rounded font-sans"
                  required={activeLangTab === "en"}
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-gray-600 uppercase">Profile Picture Photo</label>
                <div className="flex items-center gap-3">
                  {coverImagePreview && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border bg-gray-100 shrink-0">
                      <img src={coverImagePreview} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                  <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-500">Upload Profile Photo</span>
                    <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" required={!editingTeacher} />
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingTeacher} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingTeacher ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Profile</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: HOMEPAGE TEXT EDITOR (STATIC CONTENT)
      ======================================================== */}
      {showHomepageModal && homepageData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">Homepage Translation Editor</h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure static localized landing blocks</p>
              </div>
              <button onClick={() => setShowHomepageModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveHomepage} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-semibold border-b pb-2 text-brand-gold uppercase tracking-wider">Hero Section</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Tagline</label>
                    <input
                      type="text"
                      value={homepageData.hero.tagline[activeLangTab]}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        copy.hero.tagline[activeLangTab] = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Heading part 1</label>
                    <input
                      type="text"
                      value={homepageData.hero.headingPart1[activeLangTab]}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        copy.hero.headingPart1[activeLangTab] = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHomepageModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingHomepage} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingHomepage ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Landing Content</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
