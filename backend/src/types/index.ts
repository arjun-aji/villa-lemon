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
  explore: ILocalizedText;
  href: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackage extends Document {
  category: string; // Varkala Sightseeing, Day Trips, etc.
  title: ILocalizedText;
  description: ILocalizedText;
  image: string;
  imagePublicId?: string;
  explore: ILocalizedText;
  href: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IYogaProgram extends Document {
  type: "retreats" | "classes" | "private" | "teachers";
  title: ILocalizedText;
  description: ILocalizedText;
  image: string;
  imagePublicId?: string;
  explore: ILocalizedText;
  href: string;
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
  aboutImage: string;
  aboutImagePublicId?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackageItem extends Document {
  packageCategory: "varkalaSightseeing" | "dayTrips" | "backwaterExperiences" | "adventureActivities";
  title: ILocalizedText;
  slug: string;
  price: number;
  pricePeriod: ILocalizedText;
  image: string;
  imagePublicId?: string;
  aboutImage: string;
  aboutImagePublicId?: string;
  duration: ILocalizedText;
  shortDescription: ILocalizedText;
  tagline: ILocalizedText;
  aboutText: ILocalizedText;
  itinerary: { timeOrDay: ILocalizedText; activity: ILocalizedText; desc: ILocalizedText }[];
  inclusions: ILocalizedText[];
  exclusions: ILocalizedText[];
  highlights: { icon: string; label: ILocalizedText }[];
  whyGuestsLoveUs: { icon: string; title: ILocalizedText; desc: ILocalizedText }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IYogaItem extends Document {
  yogaType: "retreats" | "classes" | "private";
  title: ILocalizedText;
  slug: string;
  price: number;
  pricePeriod: ILocalizedText;
  image: string;
  imagePublicId?: string;
  aboutImage: string;
  aboutImagePublicId?: string;
  duration: ILocalizedText;
  shortDescription: ILocalizedText;
  tagline: ILocalizedText;
  aboutText: ILocalizedText;
  schedule: { time: ILocalizedText; activity: ILocalizedText }[];
  benefits: ILocalizedText[];
  inclusions: ILocalizedText[];
  createdAt: Date;
  updatedAt: Date;
}

