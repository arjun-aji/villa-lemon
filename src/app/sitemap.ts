import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "de", "fr", "ru"];
  const domain = "https://villalemon.in";
  
  const baseRoutes = [
    "",
    "/accommodation/villas",
    "/accommodation/floors",
    "/accommodation/rooms",
    "/packages/varkala-sightseeing",
    "/packages/day-trips",
    "/packages/backwater-experiences",
    "/packages/adventure-activities",
    "/packages/varkala-packages",
    "/retreats",
    "/yoga/yoga-retreats",
    "/yoga/daily-yoga-classes",
    "/yoga/private-yoga-sessions",
    "/yoga/teachers",
    "/gallery"
  ];
  
  const properties = [
    { type: "villas", slug: "lemon-grove-villa" },
    { type: "villas", slug: "ocean-whisper-villa" },
    { type: "floors", slug: "sunset-terrace-floor" },
    { type: "rooms", slug: "garden-view-room" },
    { type: "floors", slug: "deluxe-3bhk-private-floor" },
    { type: "rooms", slug: "deluxe-room-with-balcony" },
    { type: "villas", slug: "private-2bhk-apartment-villa-lemon-garden" }
  ];
  
  const packages = [
    { category: "varkalaSightseeing", slug: "cliff-beach-sightseeing-tour" },
    { category: "varkalaSightseeing", slug: "jatayu-earth-center-tour" },
    { category: "varkalaSightseeing", slug: "varkala-temple-ashram-tour" },
    { category: "varkalaSightseeing", slug: "golden-island-canoe-boating" },
    { category: "varkalaSightseeing", slug: "mangrove-forest-sunset-kayaking-varkala" },
    { category: "varkalaSightseeing", slug: "mangrove-forest-sunrise-kayaking-varkala" },
    { category: "varkalaSightseeing", slug: "kappil-beach-lake-trip" },
    { category: "dayTrips", slug: "jatayu-elephant-kayaking-tour" },
    { category: "dayTrips", slug: "ponmudi-hill-station-trip" },
    { category: "dayTrips", slug: "munroe-island-backwater-tour" },
    { category: "dayTrips", slug: "kanyakumari-day-trip" },
    { category: "dayTrips", slug: "kollam-munroe-island-cruise" },
    { category: "dayTrips", slug: "neyyar-dam-trip" },
    { category: "dayTrips", slug: "houseboat-cruises-from-varkala" },
    { category: "dayTrips", slug: "elephant-farm-mangrove-kayaking" },
    { category: "varkalaPackages", slug: "1-night-2-days-villa-lemon" },
    { category: "varkalaPackages", slug: "varkala-2-nights-3-days-experience" }
  ];
  
  const retreats = [
    "varkala-yoga-spiritual-retreat",
    "varkala-yoga-retreat-8-days",
    "varkala-yoga-wellness-retreat-4-days"
  ];
  
  const yogaItems = [
    { type: "retreats", slug: "7-day-beach-meditation-retreat" }
  ];

  const entries: MetadataRoute.Sitemap = [];
  
  // Dynamic generation for all locales
  for (const locale of locales) {
    // Base routes
    for (const route of baseRoutes) {
      entries.push({
        url: `${domain}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
    
    // Properties
    for (const prop of properties) {
      entries.push({
        url: `${domain}/${locale}/accommodation/${prop.type}/${prop.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    
    // Packages
    for (const pkg of packages) {
      entries.push({
        url: `${domain}/${locale}/packages/${pkg.category}/${pkg.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    
    // Retreats
    for (const slug of retreats) {
      entries.push({
        url: `${domain}/${locale}/retreats/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    
    // Yoga items
    for (const item of yogaItems) {
      entries.push({
        url: `${domain}/${locale}/yoga/${item.type}/${item.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }
  
  return entries;
}
