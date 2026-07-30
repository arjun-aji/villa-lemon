export const dynamic = "force-dynamic";
import Hero from "@/components/Hero";
import Accommodations from "@/components/Accommodations";
import Packages from "@/components/Packages";
import Yoga from "@/components/Yoga";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/config/api";

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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Resolve API data in parallel
  const [homepageRes, accRes, pkgRes, yogaRes] = await Promise.all([
    getHomepageData(),
    getAccommodations(),
    getPackages(),
    getYogaPrograms(),
  ]);

  const homepage = homepageRes?.data || null;
  const accommodations = accRes?.data || [];
  const packages = pkgRes?.data || [];
  const yoga = yogaRes?.data || [];

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

  return (
    <main className="w-full flex flex-col">
      <Hero data={heroData} highlightsData={highlightsData} />
      <Accommodations data={localizedAccs} />
      <Packages data={localizedPkgs} />
      <Yoga data={localizedYoga} />
      <About data={aboutData} />
      <Contact 
        locale={locale} 
        staysList={localizedAccs.map(acc => ({ _id: acc._id, title: acc.title }))} 
        contact={contactData}
      />
      <Footer contact={contactData} />
    </main>
  );
}
