import { Schema, model } from "mongoose";
import { IRetreat } from "../types";

const L = new Schema({ en: { type: String, default: "" }, de: { type: String, default: "" }, fr: { type: String, default: "" }, ru: { type: String, default: "" } }, { _id: false });
const LReq = new Schema({ en: { type: String, required: true }, de: { type: String, default: "" }, fr: { type: String, default: "" }, ru: { type: String, default: "" } }, { _id: false });

const highlightSchema = new Schema({
  icon: { type: String, default: "Star" },
  title: { type: L },
  description: { type: L },
}, { _id: false });

const scheduleSchema = new Schema({
  time: { type: String, default: "" },
  activity: { type: L },
  description: { type: L },
  icon: { type: String, default: "" },
}, { _id: false });

const curriculumDaySchema = new Schema({
  dayNumber: { type: Number, default: 1 },
  dayTitle: { type: L },
  description: { type: L },
  topics: [L],
  learningOutcome: { type: L },
  images: [{ type: String }],
}, { _id: false });

const excursionSchema = new Schema({
  name: { type: L },
  duration: { type: L },
  description: { type: L },
  image: { type: String, default: "" },
  highlights: [L],
  relatedTour: { type: String, default: "" },
  included: { type: Boolean, default: true },
}, { _id: false });

const roomSchema = new Schema({
  name: { type: L },
  image: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
  description: { type: L },
  occupancy: { type: Number, default: 1 },
  isPrivate: { type: Boolean, default: false },
  hasAC: { type: Boolean, default: false },
  hasBathroom: { type: Boolean, default: true },
  hasBalcony: { type: Boolean, default: false },
  hasWorkspace: { type: Boolean, default: false },
  hotWater: { type: Boolean, default: true },
  sharedPrice: { type: Number, default: 0 },
  privatePrice: { type: Number, default: 0 },
  features: [L],
  hideRate: { type: Boolean, default: false },
}, { _id: false });

const mealSchema = new Schema({
  mealType: { type: L },
  description: { type: L },
  isVegan: { type: Boolean, default: true },
  isGlutenFree: { type: Boolean, default: false },
  isLactoseFree: { type: Boolean, default: false },
  gallery: [{ type: String }],
  menuItems: [L],
}, { _id: false });

const teacherSchema = new Schema({
  name: { type: String, default: "" },
  photo: { type: String, default: "" },
  photoPublicId: { type: String, default: "" },
  experience: { type: String, default: "" },
  specialization: { type: L },
  bio: { type: L },
  certificates: [L],
  instagramUrl: { type: String, default: "" },
  facebookUrl: { type: String, default: "" },
  websiteUrl: { type: String, default: "" },
}, { _id: false });

const treatmentSchema = new Schema({
  name: { type: L },
  description: { type: L },
  isOptional: { type: Boolean, default: true },
  extraCost: { type: Number, default: 0 },
}, { _id: false });

const pricingRowSchema = new Schema({
  roomCategory: { type: L },
  sharedPrice: { type: Number, default: 0 },
  privatePrice: { type: Number, default: 0 },
  availability: { type: L },
  upgradeCost: { type: Number, default: 0 },
}, { _id: false });

const faqSchema = new Schema({
  question: { type: L },
  answer: { type: L },
}, { _id: false });

const reviewSchema = new Schema({
  name: { type: String, default: "" },
  country: { type: String, default: "" },
  photo: { type: String, default: "" },
  stars: { type: Number, default: 5, min: 1, max: 5 },
  review: { type: L },
  retreatJoined: { type: String, default: "" },
}, { _id: false });

const certSchema = new Schema({
  image: { type: String, default: "" },
  name: { type: L },
  description: { type: L },
}, { _id: false });

const retreatSchema = new Schema<IRetreat>({
  // General Info
  yogaType: { type: String, default: "retreats" },
  slug: { type: String, required: true, unique: true },
  days: { type: Number, default: 7 },
  nights: { type: Number, default: 7 },
  price: { type: Number, default: 0 },
  location: { type: L },
  difficulty: { type: L },
  yogaLevel: { type: L },
  language: { type: L },
  groupSize: { type: L },
  minAge: { type: Number, default: 18 },
  maxCapacity: { type: Number, default: 20 },
  certificate: { type: Boolean, default: false },
  accommodationType: { type: L },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  hideRate: { type: Boolean, default: false },
  
  // Content
  heroTitle: { type: LReq, required: true },
  heroSubtitle: { type: L },
  tagline: { type: L },
  shortDescription: { type: L },
  fullDescription: { type: L },
  retreatOverview: { type: L },
  whyChoose: { type: L },
  whoIsItFor: { type: L },
  bestTime: { type: L },
  cta: { type: L },

  // Media
  heroImage: { type: String, default: "" },
  heroImagePublicId: { type: String, default: "" },
  video: { type: String, default: "" },
  retreatMap: { type: String, default: "" },
  brochurePdf: { type: String, default: "" },

  // Sections
  highlights: [highlightSchema],
  dailySchedule: [scheduleSchema],
  curriculum: [curriculumDaySchema],
  excursions: [excursionSchema],
  rooms: [roomSchema],
  meals: [mealSchema],

  // Yoga Program
  yogaStyle: { type: L },
  morningSession: { type: L },
  eveningSession: { type: L },
  meditation: { type: L },
  pranayama: { type: L },
  philosophy: { type: L },
  classLanguage: { type: L },
  suitableFor: { type: L },
  yogaCertificate: { type: L },
  yogaHours: { type: Number, default: 0 },
  yogaDescription: { type: L },

  // Teachers
  teachers: [teacherSchema],

  // Ayurveda
  ayurvedaTitle: { type: L },
  ayurvedaDescription: { type: L },
  ayurvedaTreatments: [treatmentSchema],

  // Pricing
  pricingRows: [pricingRowSchema],

  // Checklists
  inclusions: [L],
  exclusions: [L],
  thingsToBring: [L],
  dressCode: [L],
  requirements: [L],
  whoShouldAvoid: [L],

  // FAQs
  faqs: [faqSchema],

  // Reviews
  reviews: [reviewSchema],

  // Certificates
  certificates: [certSchema],

  // Gallery (categorized)
  galleryYoga: [{ type: String }],
  galleryAccommodation: [{ type: String }],
  galleryExcursions: [{ type: String }],
  galleryFood: [{ type: String }],
  galleryTeachers: [{ type: String }],
  galleryBeach: [{ type: String }],
  galleryStudents: [{ type: String }],
  galleryCampus: [{ type: String }],
  images: [{ type: String }],

  // Downloads
  brochureUrl: { type: String, default: "" },
  packingListUrl: { type: String, default: "" },
  schedulePdfUrl: { type: String, default: "" },
  termsPdfUrl: { type: String, default: "" },

  // Booking
  deposit: { type: L },
  balancePayment: { type: L },
  cancellation: { type: L },
  refund: { type: L },
  pickup: { type: L },
  drop: { type: L },
  checkIn: { type: String, default: "12:00 PM" },
  checkOut: { type: String, default: "11:00 AM" },
  emergencyContact: { type: String, default: "" },
  medicalInfo: { type: L },
  specialRequests: { type: L },
  bookingTerms: { type: L },

  // Settings
  maxParticipants: { type: Number, default: 20 },
  minParticipants: { type: Number, default: 2 },
  bookingOpen: { type: Boolean, default: true },
  availableDates: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  isSoldOut: { type: Boolean, default: false },
  isUpcoming: { type: Boolean, default: false },

  // SEO
  metaTitle: { type: L },
  metaDescription: { type: L },
  keywords: { type: L },
  ogImage: { type: String, default: "" },
  ogImagePublicId: { type: String, default: "" },
  canonicalUrl: { type: String, default: "" },
}, { timestamps: true });

export const Retreat = model<IRetreat>("Retreat", retreatSchema);
