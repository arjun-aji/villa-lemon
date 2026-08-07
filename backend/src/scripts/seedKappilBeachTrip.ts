import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { PackageItem } from "../models/PackageItem";

dotenv.config();

const local = (text: string) => ({
  en: text,
  de: text,
  fr: text,
  ru: text,
});

const run = async () => {
  try {
    await connectDB();

    console.log("🗑️  Cleaning existing Kappil Beach packages...");
    await PackageItem.deleteMany({ slug: "kappil-beach-lake-trip" });

    console.log("🌿 Creating Kappil Beach & Lake Trip package item...");
    const tour = new PackageItem({
      packageCategory: ["varkalaSightseeing"],
      slug: "kappil-beach-lake-trip",
      price: 2000,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80",
      duration: local("4 Hours"),
      travelTime: local("15-20 Minutes Each Way"),
      entryFee: local("Free Entry"),
      optionalCharges: local("Boating charges apply if optional boat/canoe is taken"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Kappil, Kerala, India"),

      title: local("Kappil Beach & Lake Trip from Varkala"),
      tagline: local("Discover the Perfect Meeting Point of Beach, Lake, and Backwaters"),
      shortDescription: local(
        "Experience one of the most scenic destinations near Varkala with our Kappil Beach & Lake Trip. Kappil is a breathtaking location where the Arabian Sea, a tranquil freshwater lake, and Kerala's peaceful backwaters come together."
      ),
      aboutText: local(
        "Experience one of the most scenic destinations near Varkala with our Kappil Beach & Lake Trip. Just a short drive from Villa Lemon, Kappil is a breathtaking location where the Arabian Sea, a tranquil freshwater lake, and Kerala's peaceful backwaters come together to create one of the most picturesque landscapes in South India.\n\nKnown for its golden sandy beach, calm waters, scenic bridge, and spectacular sunsets, Kappil is the perfect getaway for couples, families, solo travellers, and photography enthusiasts. Whether you want to relax by the beach, enjoy panoramic views from Kappil Bridge, take a peaceful walk along the shoreline, or experience the beauty of Kerala's backwaters, this tour offers the perfect combination of nature and relaxation.\n\nUnlike the busy beaches of Varkala, Kappil offers a peaceful atmosphere where visitors can unwind, enjoy fresh sea breezes, and admire the unique landscape where the lake meets the sea. It is one of the hidden gems of Kerala and a must-visit destination for anyone staying in Varkala."
      ),
      tourOverview: local(
        "Your journey begins with pickup from Villa Lemon or your accommodation in Varkala. After a short scenic drive, you'll arrive at Kappil Beach, where you can enjoy stunning coastal views and relax away from the busy tourist areas. Continue to Kappil Bridge, one of the region's most photographed landmarks, offering spectacular views of the Arabian Sea on one side and the tranquil lake and backwaters on the other. Spend time walking along the beach, enjoying the peaceful surroundings, and capturing memorable photographs before returning to Varkala. Guests may also choose to combine this trip with nearby attractions such as Golden Island, Mangrove Forest Kayaking, or Varkala Cliff for a customized sightseeing experience."
      ),
      bestTime: local("Late Afternoon & Sunset (Recommended)"),
      dressCode: local("Comfortable casual clothing"),
      cta: local("Book Kappil Beach Trip"),

      highlights: [
        { icon: "compass", label: local("Visit the beautiful Kappil Beach") },
        { icon: "compass", label: local("Enjoy panoramic views from Kappil Bridge") },
        { icon: "compass", label: local("Explore the peaceful Kappil Lake") },
        { icon: "compass", label: local("Experience Kerala's scenic backwaters") },
        { icon: "compass", label: local("Relax on a less crowded beach") },
        { icon: "compass", label: local("Excellent photography opportunities") },
        { icon: "compass", label: local("Beautiful sunrise or sunset views") },
        { icon: "compass", label: local("Ideal for couples, families, and nature lovers") },
      ],

      whyGuestsLoveUs: [
        {
          icon: "star",
          title: local("Local Knowledge"),
          desc: local("Our friendly local team ensures a comfortable, flexible, and enjoyable journey while sharing insider knowledge."),
        },
        {
          icon: "star",
          title: local("Private & Flexible"),
          desc: local("Private comfortable vehicle and flexible itinerary to explore at your own pace."),
        },
      ],

      quickFacts: [
        { key: local("Distance"), value: local("7 km from Varkala") },
        { key: local("Travel Time"), value: local("15-20 minutes by car") },
        { key: local("Recommended hours"), value: local("Late afternoon or early morning") },
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned vehicle"),
        local("Experienced local driver"),
        local("Flexible sightseeing itinerary"),
        local("Drinking water"),
      ],

      exclusions: [
        local("Meals and refreshments"),
        local("Optional boating activities"),
        local("Personal expenses"),
        local("Entry fees (if applicable)"),
      ],

      thingsToBring: [
        local("Sun protection (sunscreen, sunglasses, hat)"),
        local("Camera or smartphone for photography"),
        local("Comfortable footwear for beach walk"),
      ],

      nearbyAttractions: [
        { name: local("Golden Island Canoeing"), distance: local("10 km") },
        { name: local("Mangrove Forest Kayaking"), distance: local("8 km") },
        { name: local("Varkala Cliff"), distance: local("7 km") },
        { name: local("Janardhanaswamy Temple"), distance: local("9 km") },
        { name: local("Sivagiri Ashram"), distance: local("10 km") },
      ],

      faqs: [
        {
          question: local("How far is Kappil Beach from Varkala?"),
          answer: local("Kappil Beach is approximately 7 km from Varkala and takes around 15–20 minutes by car."),
        },
        {
          question: local("Is the tour suitable for families?"),
          answer: local("Yes. It is an easy and relaxing sightseeing trip suitable for all age groups."),
        },
        {
          question: local("Can I swim at Kappil Beach?"),
          answer: local("Swimming conditions vary depending on the season and sea conditions. Please follow local safety advice and warning signs."),
        },
        {
          question: local("Can this trip be combined with other attractions?"),
          answer: local("Yes. Many guests combine Kappil Beach with Golden Island, Mangrove Forest Kayaking, or Varkala Cliff for a customized half-day sightseeing tour."),
        },
      ],

      itinerary: [
        { timeOrDay: local("08:30 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your hotel") },
        { timeOrDay: local("09:00 AM"), activity: local("Arrival"), desc: local("Arrival at Kappil Beach") },
        { timeOrDay: local("09:15 AM"), activity: local("Beach Walk"), desc: local("Beach walk and sightseeing") },
        { timeOrDay: local("10:00 AM"), activity: local("Kappil Bridge"), desc: local("Visit Kappil Bridge") },
        { timeOrDay: local("10:30 AM"), activity: local("Explore Lake"), desc: local("Explore Kappil Lake and surrounding viewpoints") },
        { timeOrDay: local("11:30 AM"), activity: local("Free Time"), desc: local("Free time for photography and relaxation") },
        { timeOrDay: local("12:00 PM"), activity: local("Return"), desc: local("Return to Varkala") },
      ],

      itineraryEvening: [
        { timeOrDay: local("03:30 PM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon") },
        { timeOrDay: local("04:00 PM"), activity: local("Beach Visit"), desc: local("Kappil Beach sightseeing") },
        { timeOrDay: local("04:45 PM"), activity: local("Kappil Bridge"), desc: local("Visit Kappil Bridge") },
        { timeOrDay: local("05:15 PM"), activity: local("Sunset"), desc: local("Enjoy the sunset over the Arabian Sea") },
        { timeOrDay: local("06:15 PM"), activity: local("Return"), desc: local("Return to Varkala") },
      ],

      metaTitle: local("Kappil Beach & Lake Trip from Varkala - Villa Lemon"),
      metaDescription: local("Discover where the Arabian Sea meets Kappil Lake. Book your private day trip from Varkala with Villa Lemon."),
    });

    await tour.save();
    console.log(`✅ Package saved successfully with ID: ${tour._id}`);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

run();
