export const dynamic = "force-dynamic";
import Hero from "@/components/Hero";
import Accommodations from "@/components/Accommodations";
import Packages from "@/components/Packages";
import Yoga from "@/components/Yoga";
import About from "@/components/About";
import HomeGallery from "@/components/HomeGallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/config/api";
import { getMessages } from "next-intl/server";
import { localizeObject } from "@/utils/translator";

// Fetch Homepage data from Backend
async function getHomepageData() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/homepage`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[landing]: Homepage API offline, using fallback translations.");
    return null;
  }
}

// Fetch Accommodations list
async function getAccommodations() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/accommodations`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[landing]: Accommodations API offline, using fallbacks.");
    return null;
  }
}

// Fetch Tour Packages
async function getPackages() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/packages`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[landing]: Packages API offline, using fallbacks.");
    return null;
  }
}

// Fetch Yoga Programs
async function getYogaPrograms() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/yoga/programs`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[landing]: Yoga programs API offline, using fallbacks.");
    return null;
  }
}

// Fetch Gallery Items
async function getGalleryItems() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/gallery`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[landing]: Gallery API offline, using fallbacks.");
    return null;
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Resolve API data in parallel
  const [homepageRes, accRes, pkgRes, yogaRes, galleryRes] = await Promise.all([
    getHomepageData(),
    getAccommodations(),
    getPackages(),
    getYogaPrograms(),
    getGalleryItems(),
  ]);

  const homepage = homepageRes?.data || null;
  const accommodations = accRes?.data || [];
  const packages = pkgRes?.data || [];
  const yoga = yogaRes?.data || [];
  const gallery = galleryRes?.data || [];

  // Localize Homepage using translator
  const localizedHomepage = homepage ? await localizeObject(homepage, locale) : null;
  const heroData = {
    ...(localizedHomepage?.hero || {}),
    whatsapp: localizedHomepage?.contact?.whatsapp || "+91 73560 85055",
  };
  const highlightsData = localizedHomepage?.highlights;
  const aboutData = localizedHomepage?.about;
  const contactData = localizedHomepage?.contact;

  // Localize Accommodation arrays list
  const localizedAccs = await Promise.all(
    accommodations.map(async (item: any) => {
      const li = await localizeObject(item, locale);
      return {
        _id: li._id,
        type: li.type,
        title: li.title,
        description: li.description,
        price: li.price,
        image: li.image,
        images: li.images,
        explore: li.explore,
        href: li.href,
        hideRate: li.hideRate || false,
      };
    })
  );

  // Localize Tour Package arrays list
  const localizedPkgs = await Promise.all(
    packages.map(async (item: any) => {
      const li = await localizeObject(item, locale);
      return {
        _id: li._id,
        category: li.category,
        title: li.title,
        description: li.description,
        image: li.image,
        images: li.images,
        explore: li.explore,
        href: li.href,
      };
    })
  );

  // Fetch translation messages
  const messages = await getMessages({ locale });
  const tYoga = messages.Yoga as any;

  // Localize Yoga program arrays list
  const localizedYoga = await Promise.all(
    yoga.map(async (item: any) => {
      const li = await localizeObject(item, locale);
      return {
        _id: li._id,
        type: li.type,
        title: li.title,
        description: li.description,
        image: li.image,
        images: li.images,
        explore: li.explore,
        href: li.href,
      };
    })
  );

  // Append "Meet Our Teachers" card to the grid
  const hasTeachersCard = localizedYoga.some((y: any) => y.type === "teachers" || y.href?.includes("/teachers"));
  if (!hasTeachersCard) {
    localizedYoga.push({
      type: "teachers",
      title: tYoga.teachersTitle || "Meet Our Teachers",
      description: tYoga.teachersDesc || "Our certified Acharyas guide travelers from all over the world toward mindful recovery.",
      image: "https://res.cloudinary.com/d6qmn2vu/image/upload/v1785124904/villa-lemon/yoga/mdklggrrhf6qcmqmeizb.jpg",
      images: [],
      explore: tYoga.teachersExplore || "Meet Them",
      href: `/${locale}/yoga/teachers`,
    });
  }

  // Localize Gallery items list
  const localizedGallery = await Promise.all(
    gallery.map(async (item: any) => {
      const li = await localizeObject(item, locale);
      return {
        _id: li._id,
        image: li.image,
        category: li.category,
        caption: li.caption,
        displayOrder: li.displayOrder,
      };
    })
  );

  return (
    <main className="w-full flex flex-col">
      <Hero data={heroData} highlightsData={highlightsData} />
      <Accommodations data={localizedAccs} />
      <Packages data={localizedPkgs} />
      <Yoga data={localizedYoga} />
      <About data={aboutData} />
      <HomeGallery data={localizedGallery} />
      <Contact 
        locale={locale} 
        staysList={localizedAccs.map(acc => ({ _id: acc._id, title: acc.title }))} 
        contact={contactData}
      />
      <Footer contact={contactData} />
    </main>
  );
}
