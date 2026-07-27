import React from "react";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { API_BASE_URL } from "@/config/api";

interface PropertyDetails {
  _id: string;
  accommodationType: string;
  title: Record<string, string>;
  slug: string;
  price: number;
  pricePeriod: Record<string, string>;
  image: string;
  aboutImage: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  location: Record<string, string>;
  shortDescription: Record<string, string>;
  tagline: Record<string, string>;
  aboutText1: Record<string, string>;
  aboutText2: Record<string, string>;
  highlights: Array<{ icon: string; label: Record<string, string> }>;
  whyGuestsLoveUs: Array<{ icon: string; title: Record<string, string>; desc: Record<string, string> }>;
  distances: Array<{ place: Record<string, string>; distance: Record<string, string> }>;
  perfectLocationText: Record<string, string>;
  roomAmenities: Array<Record<string, string>>;
  idealFor: Array<Record<string, string>>;
  groupAccommodationText: Record<string, string>;
  checkInTime: string;
  checkOutTime: string;
  checkInOutRules: Array<Record<string, string>>;
  additionalServices: Array<{ service: Record<string, string>; details: Record<string, string> }>;
  mapLink?: string;
  gallery?: string[];
  relatedAccommodations?: string[];
}

async function getPropertyDetails(slug: string): Promise<PropertyDetails | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/accommodations/items/${slug}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`[property details fetch]: Failed to load slug details for ${slug}`, err);
    return null;
  }
}

async function getAllProperties(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/accommodations/items`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[suggestions fetch]: Failed to load properties", err);
    return [];
  }
}

async function getAllPackages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/packages/items`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[suggestions fetch]: Failed to load packages", err);
    return [];
  }
}

async function getAllYoga(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/items`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[suggestions fetch]: Failed to load yoga items", err);
    return [];
  }
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; slug: string }>;
}) {
  const { locale, type, slug } = await params;
  const rawProperty = await getPropertyDetails(slug);

  if (!rawProperty) {
    return notFound();
  }

  // Fetch translation messages block
  const messages = await getMessages({ locale });
  const tDetails = messages.AccommodationDetails as any;

  // Map database localizations to current locale strings for rendering
  const property = {
    id: rawProperty._id,
    type: rawProperty.accommodationType,
    title: rawProperty.title[locale] || rawProperty.title["en"] || "",
    price: rawProperty.price,
    pricePeriod: rawProperty.pricePeriod[locale] || rawProperty.pricePeriod["en"] || "",
    image: rawProperty.image,
    aboutImage: rawProperty.aboutImage,
    bedrooms: rawProperty.bedrooms,
    bathrooms: rawProperty.bathrooms,
    guests: rawProperty.guests,
    location: rawProperty.location[locale] || rawProperty.location["en"] || "",
    shortDescription: rawProperty.shortDescription[locale] || rawProperty.shortDescription["en"] || "",
    tagline: rawProperty.tagline[locale] || rawProperty.tagline["en"] || "",
    aboutText1: rawProperty.aboutText1[locale] || rawProperty.aboutText1["en"] || "",
    aboutText2: rawProperty.aboutText2[locale] || rawProperty.aboutText2["en"] || "",
    perfectLocationText: rawProperty.perfectLocationText[locale] || rawProperty.perfectLocationText["en"] || "",
    groupAccommodationText: rawProperty.groupAccommodationText[locale] || rawProperty.groupAccommodationText["en"] || "",
    checkInTime: rawProperty.checkInTime,
    checkOutTime: rawProperty.checkOutTime,
    highlights: (rawProperty.highlights || []).map((h) => ({
      icon: h.icon,
      label: h.label[locale] || h.label["en"] || "",
    })),
    whyGuestsLoveUs: (rawProperty.whyGuestsLoveUs || []).map((w) => ({
      icon: w.icon,
      title: w.title[locale] || w.title["en"] || "",
      desc: w.desc[locale] || w.desc["en"] || "",
    })),
    distances: (rawProperty.distances || []).map((d) => ({
      place: d.place[locale] || d.place["en"] || "",
      distance: d.distance[locale] || d.distance["en"] || "",
    })),
    roomAmenities: (rawProperty.roomAmenities || []).map((r) => r[locale] || r["en"] || ""),
    idealFor: (rawProperty.idealFor || []).map((i) => i[locale] || i["en"] || ""),
    checkInOutRules: (rawProperty.checkInOutRules || []).map((c) => c[locale] || c["en"] || ""),
    additionalServices: (rawProperty.additionalServices || []).map((a) => ({
      service: a.service[locale] || a.service["en"] || "",
      details: a.details[locale] || a.details["en"] || "",
    })),
    mapLink: rawProperty.mapLink || "",
    gallery: rawProperty.gallery || [],
    relatedAccommodations: rawProperty.relatedAccommodations || [],
  };

  // Get Suggestions (You May Also Like)
  const [allProperties, allPackages, allYoga] = await Promise.all([
    getAllProperties(),
    getAllPackages(),
    getAllYoga(),
  ]);

  let suggestionsList: any[] = [];

  for (const rSlug of property.relatedAccommodations) {
    // 1. Check stays
    const foundStay = allProperties.find((p) => p.slug === rSlug);
    if (foundStay) {
      suggestionsList.push({
        id: foundStay._id,
        cardType: "accommodation",
        type: foundStay.accommodationType,
        title: foundStay.title[locale] || foundStay.title["en"] || "",
        price: foundStay.price,
        pricePeriod: foundStay.pricePeriod[locale] || foundStay.pricePeriod["en"] || "",
        image: foundStay.image,
        bedrooms: foundStay.bedrooms,
        bathrooms: foundStay.bathrooms,
        guests: foundStay.guests,
        location: foundStay.location[locale] || foundStay.location["en"] || "",
        shortDescription: foundStay.shortDescription[locale] || foundStay.shortDescription["en"] || "",
        tagline: foundStay.tagline[locale] || foundStay.tagline["en"] || "",
        slug: foundStay.slug,
      });
      continue;
    }

    // 2. Check packages
    const foundPkg = allPackages.find((p) => p.slug === rSlug);
    if (foundPkg) {
      suggestionsList.push({
        id: foundPkg._id,
        cardType: "package",
        type: foundPkg.packageCategory,
        title: foundPkg.title[locale] || foundPkg.title["en"] || "",
        price: foundPkg.price,
        pricePeriod: foundPkg.pricePeriod[locale] || foundPkg.pricePeriod["en"] || "",
        image: foundPkg.image,
        bedrooms: 0,
        bathrooms: 0,
        guests: 0,
        location: foundPkg.location?.[locale] || foundPkg.location?.["en"] || "Varkala, Kerala",
        shortDescription: foundPkg.shortDescription[locale] || foundPkg.shortDescription["en"] || "",
        tagline: foundPkg.tagline[locale] || foundPkg.tagline["en"] || "",
        slug: foundPkg.slug,
      });
      continue;
    }

    // 3. Check yoga
    const foundYoga = allYoga.find((y) => y.slug === rSlug);
    if (foundYoga) {
      suggestionsList.push({
        id: foundYoga._id,
        cardType: "yoga",
        type: foundYoga.yogaType,
        title: foundYoga.title[locale] || foundYoga.title["en"] || "",
        price: foundYoga.price,
        pricePeriod: foundYoga.pricePeriod[locale] || foundYoga.pricePeriod["en"] || "",
        image: foundYoga.image,
        bedrooms: 0,
        bathrooms: 0,
        guests: 0,
        location: "Varkala, Kerala",
        shortDescription: foundYoga.shortDescription[locale] || foundYoga.shortDescription["en"] || "",
        tagline: foundYoga.tagline[locale] || foundYoga.tagline["en"] || "",
        slug: foundYoga.slug,
      });
      continue;
    }
  }

  // Fallback if none found
  if (suggestionsList.length === 0) {
    const defaultStays = allProperties.filter((p) => p._id.toString() !== rawProperty._id.toString()).slice(0, 3);
    suggestionsList = defaultStays.map((foundStay) => ({
      id: foundStay._id,
      cardType: "accommodation",
      type: foundStay.accommodationType,
      title: foundStay.title[locale] || foundStay.title["en"] || "",
      price: foundStay.price,
      pricePeriod: foundStay.pricePeriod[locale] || foundStay.pricePeriod["en"] || "",
      image: foundStay.image,
      bedrooms: foundStay.bedrooms,
      bathrooms: foundStay.bathrooms,
      guests: foundStay.guests,
      location: foundStay.location[locale] || foundStay.location["en"] || "",
      shortDescription: foundStay.shortDescription[locale] || foundStay.shortDescription["en"] || "",
      tagline: foundStay.tagline[locale] || foundStay.tagline["en"] || "",
      slug: foundStay.slug,
    }));
  } else if (suggestionsList.length < 3) {
    const alreadySlugs = suggestionsList.map((s) => s.slug);
    const fillers = allProperties.filter((p) => 
      p._id.toString() !== rawProperty._id.toString() && !alreadySlugs.includes(p.slug)
    ).slice(0, 3 - suggestionsList.length);
    const mappedFillers = fillers.map((foundStay) => ({
      id: foundStay._id,
      cardType: "accommodation",
      type: foundStay.accommodationType,
      title: foundStay.title[locale] || foundStay.title["en"] || "",
      price: foundStay.price,
      pricePeriod: foundStay.pricePeriod[locale] || foundStay.pricePeriod["en"] || "",
      image: foundStay.image,
      bedrooms: foundStay.bedrooms,
      bathrooms: foundStay.bathrooms,
      guests: foundStay.guests,
      location: foundStay.location[locale] || foundStay.location["en"] || "",
      shortDescription: foundStay.shortDescription[locale] || foundStay.shortDescription["en"] || "",
      tagline: foundStay.tagline[locale] || foundStay.tagline["en"] || "",
      slug: foundStay.slug,
    }));
    suggestionsList = [...suggestionsList, ...mappedFillers];
  }

  const suggestions = suggestionsList;

  return (
    <>
      <Navbar absoluteOnly={true} />
      <PropertyDetailsClient 
        property={property} 
        translations={tDetails} 
        locale={locale} 
        typePath={type} 
        suggestions={suggestions} 
      />
    </>
  );
}
