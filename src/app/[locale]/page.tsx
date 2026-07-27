import Hero from "@/components/Hero";
import Accommodations from "@/components/Accommodations";
import Packages from "@/components/Packages";
import Yoga from "@/components/Yoga";
import About from "@/components/About";
import { API_BASE_URL } from "@/config/api";

// Fetch Homepage data from Backend
async function getHomepageData() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/homepage`, {
      next: { revalidate: 60 },
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
      next: { revalidate: 60 },
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
      next: { revalidate: 60 },
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
      next: { revalidate: 60 },
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

  // Localize Hero fields
  const heroData = homepage?.hero
    ? {
        tagline: homepage.hero.tagline[locale] || homepage.hero.tagline["en"],
        headingPart1: homepage.hero.headingPart1[locale] || homepage.hero.headingPart1["en"],
        headingPart2: homepage.hero.headingPart2[locale] || homepage.hero.headingPart2["en"],
        nature: homepage.hero.nature[locale] || homepage.hero.nature["en"],
        description: homepage.hero.description[locale] || homepage.hero.description["en"],
        bookStay: homepage.hero.bookStay[locale] || homepage.hero.bookStay["en"],
        whatsappBooking: homepage.hero.whatsappBooking[locale] || homepage.hero.whatsappBooking["en"],
        imageAlt: homepage.hero.imageAlt[locale] || homepage.hero.imageAlt["en"],
      }
    : undefined;

  // Localize Highlights bar fields
  const highlightsData = homepage?.highlights
    ? {
        premiumVillasTitle: homepage.highlights.premiumVillasTitle[locale] || homepage.highlights.premiumVillasTitle["en"],
        premiumVillasSubtitle: homepage.highlights.premiumVillasSubtitle[locale] || homepage.highlights.premiumVillasSubtitle["en"],
        greatLocationsTitle: homepage.highlights.greatLocationsTitle[locale] || homepage.highlights.greatLocationsTitle["en"],
        greatLocationsSubtitle: homepage.highlights.greatLocationsSubtitle[locale] || homepage.highlights.greatLocationsSubtitle["en"],
        wellnessTitle: homepage.highlights.wellnessTitle[locale] || homepage.highlights.wellnessTitle["en"],
        wellnessSubtitle: homepage.highlights.wellnessSubtitle[locale] || homepage.highlights.wellnessSubtitle["en"],
      }
    : undefined;

  // Localize About section fields
  const aboutData = homepage?.about
    ? {
        tagline: homepage.about.tagline[locale] || homepage.about.tagline["en"],
        heading: homepage.about.heading[locale] || homepage.about.heading["en"],
        paragraph1: homepage.about.paragraph1[locale] || homepage.about.paragraph1["en"],
        paragraph2: homepage.about.paragraph2[locale] || homepage.about.paragraph2["en"],
        button: homepage.about.button[locale] || homepage.about.button["en"],
        natureTitle: homepage.about.natureTitle[locale] || homepage.about.natureTitle["en"],
        natureDesc: homepage.about.natureDesc[locale] || homepage.about.natureDesc["en"],
        luxuryTitle: homepage.about.luxuryTitle[locale] || homepage.about.luxuryTitle["en"],
        luxuryDesc: homepage.about.luxuryDesc[locale] || homepage.about.luxuryDesc["en"],
        serviceTitle: homepage.about.serviceTitle[locale] || homepage.about.serviceTitle["en"],
        serviceDesc: homepage.about.serviceDesc[locale] || homepage.about.serviceDesc["en"],
        everyoneTitle: homepage.about.everyoneTitle[locale] || homepage.about.everyoneTitle["en"],
        everyoneDesc: homepage.about.everyoneDesc[locale] || homepage.about.everyoneDesc["en"],
        quoteText: homepage.about.quoteText[locale] || homepage.about.quoteText["en"],
        quoteAuthor: homepage.about.quoteAuthor[locale] || homepage.about.quoteAuthor["en"],
        statsVillasLabel: homepage.about.statsVillasLabel[locale] || homepage.about.statsVillasLabel["en"],
        statsGuestsLabel: homepage.about.statsGuestsLabel[locale] || homepage.about.statsGuestsLabel["en"],
        statsRatingLabel: homepage.about.statsRatingLabel[locale] || homepage.about.statsRatingLabel["en"],
        statsLocationLabel: homepage.about.statsLocationLabel[locale] || homepage.about.statsLocationLabel["en"],
      }
    : undefined;

  // Localize Accommodation arrays list
  const localizedAccs = accommodations.map((item: any) => ({
    _id: item._id,
    type: item.type,
    title: item.title[locale] || item.title["en"],
    description: item.description[locale] || item.description["en"],
    price: item.price[locale] || item.price["en"],
    image: item.image,
    explore: item.explore[locale] || item.explore["en"],
    href: item.href,
  }));

  // Localize Tour Package arrays list
  const localizedPkgs = packages.map((item: any) => ({
    _id: item._id,
    category: item.category,
    title: item.title[locale] || item.title["en"],
    description: item.description[locale] || item.description["en"],
    image: item.image,
    explore: item.explore[locale] || item.explore["en"],
    href: item.href,
  }));

  // Localize Yoga program arrays list
  const localizedYoga = yoga.map((item: any) => ({
    _id: item._id,
    type: item.type,
    title: item.title[locale] || item.title["en"],
    description: item.description[locale] || item.description["en"],
    image: item.image,
    explore: item.explore[locale] || item.explore["en"],
    href: item.href,
  }));

  return (
    <main className="w-full flex flex-col">
      <Hero data={heroData} highlightsData={highlightsData} />
      <Accommodations data={localizedAccs} />
      <Packages data={localizedPkgs} />
      <Yoga data={localizedYoga} />
      <About data={aboutData} />
    </main>
  );
}
