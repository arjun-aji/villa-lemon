export const dynamic = "force-dynamic";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageAutoTranslator from "@/components/PageAutoTranslator";
import { API_BASE_URL } from "@/config/api";
import { getContactSettings } from "@/utils/contactSettings";
import { getMessages } from "next-intl/server";
import { localizeObject } from "@/utils/translator";
import GalleryClient from "./GalleryClient";

interface RawGalleryItem {
  _id: string;
  image: string;
  category: string;
  caption: Record<string, string>;
  displayOrder: number;
}

async function getGalleryItems(): Promise<RawGalleryItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/gallery`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("[gallery fetch failed]:", err);
    return [];
  }
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [rawItems, contact, messages] = await Promise.all([
    getGalleryItems(),
    getContactSettings(),
    getMessages({ locale }),
  ]);

  interface LocalizedGalleryItem {
    _id: string;
    image: string;
    category: string;
    caption: string;
    displayOrder: number;
  }

  // Localize items
  const items = await Promise.all(
    rawItems.map(async (item) => {
      const li = (await localizeObject(item, locale)) as unknown as LocalizedGalleryItem;
      return {
        id: li._id,
        image: li.image,
        category: li.category,
        caption: li.caption,
        displayOrder: li.displayOrder,
      };
    })
  );

  const t = (messages.Gallery || {}) as Record<string, string>;

  return (
    <>
      <Navbar forceSolid={true} />
      <main className="w-full bg-[#fbf9f6] text-brand-dark min-h-screen">
        <PageAutoTranslator locale={locale}>
          <GalleryClient 
            items={items} 
            locale={locale} 
            translations={{
              title: t.title || "Gallery",
              subtitle: t.subtitle || "Moments, Places & Experiences",
              description: t.description || "Explore the beauty, peace, and experiences that make Villa Lemon your perfect retreat in Varkala, Kerala.",
              shareTitle: t.shareTitle || "Share Your Villa Lemon Moments",
              shareSub: t.shareSub || "Tag us on Instagram @villalemon.varkala and use #VillaLemon to get featured on our gallery.",
              followInsta: t.followInsta || "Follow Us on Instagram",
              allPhotos: t.allPhotos || "All Photos",
              villaAccommodation: t.villaAccommodation || "Villa & Accommodation",
              yogaWellness: t.yogaWellness || "Yoga & Wellness",
              experiencesTours: t.experiencesTours || "Experiences & Tours",
              foodDining: t.foodDining || "Food & Dining",
              natureSurroundings: t.natureSurroundings || "Nature & Surroundings",
              eventsCulture: t.eventsCulture || "Events & Culture",
              photosLabel: t.photosLabel || "Photos",
            }}
          />
        </PageAutoTranslator>
      </main>
      <Footer contact={contact} />
    </>
  );
}
