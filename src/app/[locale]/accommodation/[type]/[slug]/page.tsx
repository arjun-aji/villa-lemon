import React from "react";
import Navbar from "@/components/Navbar";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import PropertyDetailsClient from "./PropertyDetailsClient";

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
}

async function getPropertyDetails(slug: string): Promise<PropertyDetails | null> {
  try {
    const res = await fetch(`http://localhost:5001/api/accommodations/items/${slug}`, {
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
    const res = await fetch("http://localhost:5001/api/accommodations/items", {
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
  };

  // Get Suggestions
  const allProperties = await getAllProperties();
  const rawSuggestions = allProperties.filter((p) => p._id.toString() !== rawProperty._id.toString()).slice(0, 3);
  const suggestions = rawSuggestions.map((p) => ({
    id: p._id,
    type: p.accommodationType,
    title: p.title[locale] || p.title["en"] || "",
    price: p.price,
    pricePeriod: p.pricePeriod[locale] || p.pricePeriod["en"] || "",
    image: p.image,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    guests: p.guests,
    location: p.location[locale] || p.location["en"] || "",
    shortDescription: p.shortDescription[locale] || p.shortDescription["en"] || "",
    tagline: p.tagline[locale] || p.tagline["en"] || "",
    slug: p.slug,
  }));

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
