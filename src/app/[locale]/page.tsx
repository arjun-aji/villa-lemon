export const revalidate = 3600;
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

  // Fetch translation messages
  const messages = await getMessages({ locale });
  const tAcc = messages.Accommodations as any || {};
  const tPkg = messages.Packages as any || {};
  const tYoga = messages.Yoga as any || {};

  // Localize Accommodation arrays list
  const rawAccs = await Promise.all(
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

  const finalAccommodations = rawAccs.length > 0 ? rawAccs : [
    {
      _id: "villa",
      type: "villa",
      title: tAcc.villaTitle || "Entire Villas",
      description: tAcc.villaDesc || "Spacious private villas with modern amenities, perfect for families & groups.",
      price: tAcc.villaPrice || "From ₹16,500 /night",
      image: "/assets/villa_entire.png",
      images: ["/assets/villa_entire.png"],
      explore: tAcc.explore || tAcc.villaExplore || "Explore Villas",
      href: `/${locale}/accommodation/villas`,
      hideRate: false
    },
    {
      _id: "floor",
      type: "floor",
      title: tAcc.floorTitle || "Private Floors",
      description: tAcc.floorDesc || "Independent floors with privacy & comfort, ideal for small families.",
      price: tAcc.floorPrice || "From ₹8,500 /night",
      image: "/assets/villa_terrace.png",
      images: ["/assets/villa_terrace.png"],
      explore: tAcc.explore || tAcc.floorExplore || "Explore Floors",
      href: `/${locale}/accommodation/floors`,
      hideRate: false
    },
    {
      _id: "room",
      type: "room",
      title: tAcc.roomTitle || "Individual Rooms",
      description: tAcc.roomDesc || "Beautifully designed rooms with all essentials for a relaxing stay.",
      price: tAcc.roomPrice || "From ₹3,800 /night",
      image: "/assets/villa_room.png",
      images: ["/assets/villa_room.png"],
      explore: tAcc.explore || tAcc.roomExplore || "Explore Rooms",
      href: `/${locale}/accommodation/rooms`,
      hideRate: false
    }
  ];

  // Localize Tour Package arrays list
  const rawPkgs = await Promise.all(
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

  const finalPackages = rawPkgs.length > 0 ? rawPkgs : [
    {
      _id: "pkg-varkala",
      category: "varkalaSightseeing",
      title: tPkg.varkalaTitle || "Varkala Sightseeing",
      description: tPkg.varkalaDesc || "Explore the best beaches, cliffs & local attractions.",
      image: "/assets/package_varkala.png",
      images: ["/assets/package_varkala.png"],
      explore: tPkg.explore || tPkg.varkalaExplore || "Explore",
      href: `/${locale}/packages/varkala-sightseeing`
    },
    {
      _id: "pkg-daytrips",
      category: "dayTrips",
      title: tPkg.daytripsTitle || "Day Trips",
      description: tPkg.daytripsDesc || "Perfect one-day getaways around Kerala.",
      image: "/assets/package_daytrips.png",
      images: ["/assets/package_daytrips.png"],
      explore: tPkg.explore || tPkg.daytripsExplore || "Explore",
      href: `/${locale}/packages/day-trips`
    },
    {
      _id: "pkg-backwater",
      category: "backwaterExperiences",
      title: tPkg.backwaterTitle || "Backwater Experiences",
      description: tPkg.backwaterDesc || "Scenic houseboat cruises & canal canoe tours.",
      image: "/assets/package_houseboat.png",
      images: ["/assets/package_houseboat.png"],
      explore: tPkg.explore || tPkg.backwaterExplore || "Explore",
      href: `/${locale}/packages/backwater-experiences`
    },
    {
      _id: "pkg-adventure",
      category: "adventureActivities",
      title: tPkg.adventureTitle || "Adventure Activities",
      description: tPkg.adventureDesc || "Mangrove kayaking, surfing, and paragliding options.",
      image: "/assets/package_adventure.png",
      images: ["/assets/package_adventure.png"],
      explore: tPkg.explore || tPkg.adventureExplore || "Explore",
      href: `/${locale}/packages/adventure-activities`
    }
  ];

  // Localize Yoga program arrays list
  const rawYoga = await Promise.all(
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

  const finalYoga = rawYoga.length > 0 ? rawYoga : [
    {
      _id: "yoga-retreats",
      type: "retreats",
      title: tYoga.retreatsTitle || "Yoga Retreats",
      description: tYoga.retreatsDesc || "Transformative retreats for mind, body & soul.",
      image: "/assets/yoga_retreats.png",
      images: ["/assets/yoga_retreats.png"],
      explore: tYoga.explore || tYoga.retreatsExplore || "Explore",
      href: `/${locale}/yoga/yoga-retreats`
    },
    {
      _id: "yoga-classes",
      type: "classes",
      title: tYoga.classesTitle || "Daily Yoga Classes",
      description: tYoga.classesDesc || "Join our daily sessions for all levels.",
      image: "/assets/yoga_classes.png",
      images: ["/assets/yoga_classes.png"],
      explore: tYoga.explore || tYoga.classesExplore || "Explore",
      href: `/${locale}/yoga/daily-yoga-classes`
    },
    {
      _id: "yoga-private",
      type: "private",
      title: tYoga.privateTitle || "Private Yoga Sessions",
      description: tYoga.privateDesc || "Personalized sessions for individuals & groups.",
      image: "/assets/yoga_private.png",
      images: ["/assets/yoga_private.png"],
      explore: tYoga.explore || tYoga.privateExplore || "Explore",
      href: `/${locale}/yoga/private-yoga-sessions`
    }
  ];

  // Append "Meet Our Teachers" card to the grid if not present
  const hasTeachersCard = finalYoga.some((y: any) => y.type === "teachers" || y.href?.includes("/teachers"));
  if (!hasTeachersCard) {
    finalYoga.push({
      _id: "yoga-teachers",
      type: "teachers",
      title: tYoga.teachersTitle || "Meet Our Teachers",
      description: tYoga.teachersDesc || "Our certified Acharyas guide travelers from all over the world toward mindful recovery.",
      image: "/assets/yoga_teachers.png",
      images: ["/assets/yoga_teachers.png"],
      explore: tYoga.teachersExplore || "Meet Them",
      href: `/${locale}/yoga/teachers`,
    });
  }

  // Localize Gallery items list
  const rawGallery = await Promise.all(
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

  const finalGallery = rawGallery.length > 0 ? rawGallery : [
    { _id: "gal-1", image: "/assets/hero.png", category: "resort", caption: "Villa Lemon Resort View", displayOrder: 1 },
    { _id: "gal-2", image: "/assets/about_sunset.png", category: "scenery", caption: "Sunset Scenery in Varkala", displayOrder: 2 },
    { _id: "gal-3", image: "/assets/about_interior.png", category: "interiors", caption: "Luxury Villa Interiors", displayOrder: 3 },
    { _id: "gal-4", image: "/assets/yoga_retreats.png", category: "activities", caption: "Yoga and Meditation Practice", displayOrder: 4 },
    { _id: "gal-5", image: "/assets/villa_entire.png", category: "villas", caption: "Private Villa Front", displayOrder: 5 },
    { _id: "gal-6", image: "/assets/package_varkala.png", category: "sightseeing", caption: "Cliff Beach Excursion", displayOrder: 6 }
  ];

  return (
    <main className="w-full flex flex-col">
      <Hero data={heroData} highlightsData={highlightsData} />
      <Accommodations data={finalAccommodations} />
      <Packages data={finalPackages} />
      <Yoga data={finalYoga} />
      <About data={aboutData} />
      <HomeGallery data={finalGallery} />
      <Contact 
        locale={locale} 
        staysList={finalAccommodations.map(acc => ({ _id: acc._id, title: acc.title }))} 
        contact={contactData}
      />
      <Footer contact={contactData} />
    </main>
  );
}
