import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(passwordAttempt: string): Promise<boolean>;
}

export interface ILocalizedText {
  en: string;
  de: string;
  fr: string;
  ru: string;
}

export interface IAccommodation extends Document {
  type: "villa" | "floor" | "room";
  title: ILocalizedText;
  description: ILocalizedText;
  price: ILocalizedText;
  image: string;
  imagePublicId?: string;
  images?: string[];
  imagePublicIds?: string[];
  explore: ILocalizedText;
  href: string;
  feature1Title?: ILocalizedText;
  feature1Subtitle?: ILocalizedText;
  feature2Title?: ILocalizedText;
  feature2Subtitle?: ILocalizedText;
  feature3Title?: ILocalizedText;
  feature3Subtitle?: ILocalizedText;
  feature4Title?: ILocalizedText;
  feature4Subtitle?: ILocalizedText;
  displayOrder?: number;
  template?: string;
  hideRate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackage extends Document {
  category: string; // Varkala Sightseeing, Day Trips, etc.
  title: ILocalizedText;
  description: ILocalizedText;
  image: string;
  imagePublicId?: string;
  images?: string[];
  imagePublicIds?: string[];
  explore: ILocalizedText;
  href: string;
  displayOrder?: number;
  template?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IYogaProgram extends Document {
  type: string;
  title: ILocalizedText;
  description: ILocalizedText;
  image: string;
  imagePublicId?: string;
  images?: string[];
  imagePublicIds?: string[];
  explore: ILocalizedText;
  href: string;
  displayOrder?: number;
  template?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeacher extends Document {
  name: string;
  role: ILocalizedText;
  bio: ILocalizedText;
  image: string;
  imagePublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFAQ extends Document {
  question: ILocalizedText;
  answer: ILocalizedText;
  category: string; // e.g. General, Booking, Policies
  createdAt: Date;
  updatedAt: Date;
}

export interface IHomepage extends Document {
  hero: {
    tagline: ILocalizedText;
    headingPart1: ILocalizedText;
    headingPart2: ILocalizedText;
    nature: ILocalizedText;
    description: ILocalizedText;
    bookStay: ILocalizedText;
    whatsappBooking: ILocalizedText;
    imageAlt: ILocalizedText;
  };
  highlights: {
    premiumVillasTitle: ILocalizedText;
    premiumVillasSubtitle: ILocalizedText;
    greatLocationsTitle: ILocalizedText;
    greatLocationsSubtitle: ILocalizedText;
    wellnessTitle: ILocalizedText;
    wellnessSubtitle: ILocalizedText;
  };
  about: {
    tagline: ILocalizedText;
    heading: ILocalizedText;
    paragraph1: ILocalizedText;
    paragraph2: ILocalizedText;
    button: ILocalizedText;
    // Continuation features
    natureTitle: ILocalizedText;
    natureDesc: ILocalizedText;
    luxuryTitle: ILocalizedText;
    luxuryDesc: ILocalizedText;
    serviceTitle: ILocalizedText;
    serviceDesc: ILocalizedText;
    everyoneTitle: ILocalizedText;
    everyoneDesc: ILocalizedText;
    // Quote
    quoteText: ILocalizedText;
    quoteAuthor: ILocalizedText;
    // Stats labels
    statsVillasLabel: ILocalizedText;
    statsGuestsLabel: ILocalizedText;
    statsRatingLabel: ILocalizedText;
    statsLocationLabel: ILocalizedText;
  };
  contact?: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    receptionHours: string;
    googleMapsLink?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccommodationItem extends Document {
  accommodationType: "villa" | "floor" | "room";
  title: ILocalizedText;
  slug: string;
  price: number;
  pricePeriod: ILocalizedText;
  image: string;
  imagePublicId?: string;
  images?: string[];
  imagePublicIds?: string[];
  aboutImage: string;
  aboutImagePublicId?: string;
  aboutImages?: string[];
  aboutImagePublicIds?: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  location: ILocalizedText;
  shortDescription: ILocalizedText;
  tagline: ILocalizedText;
  aboutText1: ILocalizedText;
  aboutText2: ILocalizedText;
  highlights: { icon: string; label: ILocalizedText }[];
  whyGuestsLoveUs: { icon: string; title: ILocalizedText; desc: ILocalizedText }[];
  distances: { place: ILocalizedText; distance: ILocalizedText }[];
  perfectLocationText: ILocalizedText;
  roomAmenities: ILocalizedText[];
  idealFor: ILocalizedText[];
  groupAccommodationText: ILocalizedText;
  checkInTime: string;
  checkOutTime: string;
  checkInOutRules: ILocalizedText[];
  additionalServices: { service: ILocalizedText; details: ILocalizedText }[];
  mapLink?: string;
  gallery?: string[];
  galleryPublicIds?: string[];
  relatedAccommodations?: string[];
  displayOrder?: number;
  badgeText?: ILocalizedText;
  hideRate?: boolean;
  
  // SEO
  metaTitle?: ILocalizedText;
  metaDescription?: ILocalizedText;
  keywords?: ILocalizedText;
  ogImage?: string;
  ogImagePublicId?: string;
  canonicalUrl?: string;

  // Important Notes
  notes?: ILocalizedText;

  createdAt: Date;
  updatedAt: Date;
}

export interface IPackageItem extends Document {
  packageCategory: "varkalaSightseeing" | "dayTrips" | "backwaterExperiences" | "adventureActivities" | "varkalaPackages";
  title: ILocalizedText;
  slug: string;
  price: number;
  pricePeriod: ILocalizedText;
  image: string;
  imagePublicId?: string;
  images?: string[];
  imagePublicIds?: string[];
  aboutImage: string;
  aboutImagePublicId?: string;
  aboutImages?: string[];
  aboutImagePublicIds?: string[];
  duration: ILocalizedText;
  shortDescription: ILocalizedText;
  tagline: ILocalizedText;
  aboutText: ILocalizedText;
  itinerary: { timeOrDay: ILocalizedText; activity: ILocalizedText; desc: ILocalizedText }[];
  itineraryEvening?: { timeOrDay: ILocalizedText; activity: ILocalizedText; desc: ILocalizedText }[];
  inclusions: ILocalizedText[];
  exclusions: ILocalizedText[];
  highlights: { icon: string; label: ILocalizedText }[];
  whyGuestsLoveUs: { icon: string; title: ILocalizedText; desc: ILocalizedText }[];
  
  // General Info
  travelTime?: ILocalizedText;
  entryFee?: ILocalizedText;
  optionalCharges?: ILocalizedText;
  difficulty?: ILocalizedText;
  groupSize?: ILocalizedText;
  location?: ILocalizedText;

  // Localized Content
  tourOverview?: ILocalizedText;
  bestTime?: ILocalizedText;
  dressCode?: ILocalizedText;
  cta?: ILocalizedText;

  // Images & Media
  gallery?: string[];
  galleryPublicIds?: string[];
  video?: string;

  // Structural lists
  quickFacts?: { key: ILocalizedText; value: ILocalizedText }[];
  thingsToBring?: ILocalizedText[];
  nearbyAttractions?: { name: ILocalizedText; distance: ILocalizedText }[];
  relatedPackages?: string[];
  faqs?: { question: ILocalizedText; answer: ILocalizedText }[];

  // SEO
  metaTitle?: ILocalizedText;
  metaDescription?: ILocalizedText;
  keywords?: ILocalizedText;
  ogImage?: string;
  ogImagePublicId?: string;
  canonicalUrl?: string;

  // Booking Info
  cancellation?: ILocalizedText;
  refund?: ILocalizedText;
  pickup?: ILocalizedText;
  drop?: ILocalizedText;
  notes?: ILocalizedText;
  displayOrder?: number;
  hideRate?: boolean;
  badgeText?: ILocalizedText;
  createdAt: Date;
  updatedAt: Date;
}

export interface IYogaItem extends Document {
  yogaType: string;
  title: ILocalizedText;
  slug: string;
  price: number;
  pricePeriod: ILocalizedText;
  image: string;
  imagePublicId?: string;
  images?: string[];
  imagePublicIds?: string[];
  aboutImage: string;
  aboutImagePublicId?: string;
  aboutImages?: string[];
  aboutImagePublicIds?: string[];
  duration: ILocalizedText;
  shortDescription: ILocalizedText;
  tagline: ILocalizedText;
  aboutText: ILocalizedText;
  schedule: { time: ILocalizedText; activity: ILocalizedText }[];
  benefits: ILocalizedText[];
  inclusions: ILocalizedText[];
  relatedYoga?: string[];
  displayOrder?: number;
  hideRate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Retreat ──────────────────────────────────────────────────────────────────

export interface IRetreatHighlight {
  icon: string;
  title: ILocalizedText;
  description: ILocalizedText;
}

export interface IRetreatScheduleItem {
  time: string;
  activity: ILocalizedText;
  description: ILocalizedText;
  icon: string;
}

export interface IRetreatCurriculumDay {
  dayNumber: number;
  dayTitle: ILocalizedText;
  description: ILocalizedText;
  topics: ILocalizedText[];
  learningOutcome: ILocalizedText;
  images: string[];
}

export interface IRetreatExcursion {
  name: ILocalizedText;
  duration: ILocalizedText;
  description: ILocalizedText;
  image: string;
  highlights: ILocalizedText[];
  relatedTour: string;
  included: boolean;
}

export interface IRetreatRoom {
  name: ILocalizedText;
  image: string;
  imagePublicId: string;
  description: ILocalizedText;
  occupancy: number;
  isPrivate: boolean;
  hasAC: boolean;
  hasBathroom: boolean;
  hasBalcony: boolean;
  hasWorkspace: boolean;
  hotWater: boolean;
  sharedPrice: number;
  privatePrice: number;
  features: ILocalizedText[];
  hideRate?: boolean;
}

export interface IRetreatMeal {
  mealType: ILocalizedText;
  description: ILocalizedText;
  isVegan: boolean;
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  gallery: string[];
  menuItems: ILocalizedText[];
}

export interface IRetreatTeacher {
  name: string;
  photo: string;
  photoPublicId: string;
  experience: string;
  specialization: ILocalizedText;
  bio: ILocalizedText;
  certificates: ILocalizedText[];
  instagramUrl: string;
  facebookUrl: string;
  websiteUrl: string;
}

export interface IRetreatAyurvedaTreatment {
  name: ILocalizedText;
  description: ILocalizedText;
  isOptional: boolean;
  extraCost: number;
}

export interface IRetreatPricingRow {
  roomCategory: ILocalizedText;
  sharedPrice: number;
  privatePrice: number;
  availability: ILocalizedText;
  upgradeCost: number;
}

export interface IRetreatFAQ {
  question: ILocalizedText;
  answer: ILocalizedText;
}

export interface IRetreatReview {
  name: string;
  country: string;
  photo: string;
  stars: number;
  review: ILocalizedText;
  retreatJoined: string;
}

export interface IRetreatCertificate {
  image: string;
  name: ILocalizedText;
  description: ILocalizedText;
}

export interface IRetreat extends Document {
  // General Info
  yogaType?: string;
  slug: string;
  days: number;
  nights: number;
  price: number;
  location: ILocalizedText;
  difficulty: ILocalizedText;
  yogaLevel: ILocalizedText;
  language: ILocalizedText;
  groupSize: ILocalizedText;
  minAge: number;
  maxCapacity: number;
  certificate: boolean;
  accommodationType: ILocalizedText;
  status: "draft" | "published" | "archived";
  featured: boolean;
  displayOrder: number;
  hideRate?: boolean;

  // Content
  heroTitle: ILocalizedText;
  heroSubtitle: ILocalizedText;
  tagline: ILocalizedText;
  shortDescription: ILocalizedText;
  fullDescription: ILocalizedText;
  retreatOverview: ILocalizedText;
  whyChoose: ILocalizedText;
  whoIsItFor: ILocalizedText;
  bestTime: ILocalizedText;
  cta: ILocalizedText;

  // Media
  heroImage: string;
  heroImagePublicId: string;
  video: string;
  retreatMap: string;
  brochurePdf: string;

  // Sections
  highlights: IRetreatHighlight[];
  dailySchedule: IRetreatScheduleItem[];
  curriculum: IRetreatCurriculumDay[];
  excursions: IRetreatExcursion[];
  rooms: IRetreatRoom[];
  meals: IRetreatMeal[];

  // Yoga Program
  yogaStyle: ILocalizedText;
  morningSession: ILocalizedText;
  eveningSession: ILocalizedText;
  meditation: ILocalizedText;
  pranayama: ILocalizedText;
  philosophy: ILocalizedText;
  classLanguage: ILocalizedText;
  suitableFor: ILocalizedText;
  yogaCertificate: ILocalizedText;
  yogaHours: number;
  yogaDescription: ILocalizedText;

  // Teachers
  teachers: IRetreatTeacher[];

  // Ayurveda
  ayurvedaTitle: ILocalizedText;
  ayurvedaDescription: ILocalizedText;
  ayurvedaTreatments: IRetreatAyurvedaTreatment[];

  // Pricing
  pricingRows: IRetreatPricingRow[];

  // Checklists
  inclusions: ILocalizedText[];
  exclusions: ILocalizedText[];
  thingsToBring: ILocalizedText[];
  dressCode: ILocalizedText[];
  requirements: ILocalizedText[];
  whoShouldAvoid: ILocalizedText[];

  // FAQs
  faqs: IRetreatFAQ[];

  // Reviews
  reviews: IRetreatReview[];

  // Certificates
  certificates: IRetreatCertificate[];

  // Gallery (categorized)
  galleryYoga: string[];
  galleryAccommodation: string[];
  galleryExcursions: string[];
  galleryFood: string[];
  galleryTeachers: string[];
  galleryBeach: string[];
  galleryStudents: string[];
  galleryCampus: string[];

  // Downloads
  brochureUrl: string;
  packingListUrl: string;
  schedulePdfUrl: string;
  termsPdfUrl: string;

  // Booking
  deposit: ILocalizedText;
  balancePayment: ILocalizedText;
  cancellation: ILocalizedText;
  refund: ILocalizedText;
  pickup: ILocalizedText;
  drop: ILocalizedText;
  checkIn: string;
  checkOut: string;
  emergencyContact: string;
  medicalInfo: ILocalizedText;
  specialRequests: ILocalizedText;
  bookingTerms: ILocalizedText;

  // Settings
  maxParticipants: number;
  minParticipants: number;
  bookingOpen: boolean;
  availableDates: string[];
  isPopular: boolean;
  isSoldOut: boolean;
  isUpcoming: boolean;

  // SEO
  metaTitle: ILocalizedText;
  metaDescription: ILocalizedText;
  keywords: ILocalizedText;
  ogImage: string;
  ogImagePublicId: string;
  canonicalUrl: string;

  createdAt: Date;
  updatedAt: Date;
}
