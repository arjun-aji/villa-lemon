import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { PackageItem } from "../models/PackageItem";
import { Package } from "../models/Package";

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

    const slugs = [
      "1-night-2-days-villa-lemon",
      "varkala-2-nights-3-days-experience"
    ];

    console.log(`🗑️  Cleaning existing Varkala stay packages...`);
    await PackageItem.deleteMany({ slug: { $in: slugs } });

    console.log("🌿 Seeding Package 1: 1 Night / 2 Days stay package...");
    const p1 = new PackageItem({
      packageCategory: "varkalaPackages",
      slug: "1-night-2-days-villa-lemon",
      price: 3500,
      pricePeriod: local("/ stay"),
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      duration: local("1 Night / 2 Days"),
      travelTime: local("Local taxi/tuk-tuk easily available"),
      entryFee: local("Not Included (Self-guided style)"),
      optionalCharges: local("Local guides / sightseeing transfers extra"),
      difficulty: local("Easy"),
      groupSize: local("1-4 People"),
      location: local("Varkala Cliff, Kerala"),

      title: local("1 Night / 2 Days – Villa Lemon Properties Stay"),
      tagline: local("Choose Stay Options: Villa Lemon Inn / Villa Lemon Garden / Villa Lemon Homestay"),
      shortDescription: local(
        "Discover the perfect coastal escape in Varkala at our premier Villa Lemon Properties (Inn, Garden, or Homestay). Includes 1 night of accommodation and custom tour guidance."
      ),
      aboutText: local(
        "Discover the perfect custom stay in Varkala at our premier Villa Lemon Properties. Whether you prefer the peaceful atmosphere of Villa Lemon Inn, the lush surroundings of Villa Lemon Garden, or the authentic experience of Villa Lemon Homestay, this package offers a seamless 2-day getaway.\n\nPlease note: This package is a flexible self-guided stay. Accommodation is fully included, while local excursions, transfers, and entry tickets can be custom-coordinated through our team on request."
      ),
      tourOverview: local(
        "Ideal for solo travelers, couples, or families looking for a quick coastal break with the comfort of premium villa lodging. Enjoy early luggage drop options, close proximity to the Varkala Cliff, and expert local recommendations. Suggested timings: recommended arrival 9:00 AM – 11:30 AM on Day 1, departure 4:00 PM onwards on Day 2."
      ),
      bestTime: local("Year Round"),
      dressCode: local("Comfortable casual clothing"),
      cta: local("Book 2 Days Stay"),

      highlights: [
        { icon: "compass", label: local("Choose between 3 premium Villa Lemon properties") },
        { icon: "compass", label: local("Luggage drop and early arrival support") },
        { icon: "compass", label: local("Walkable distance to Black Sand Beach & Cliff") },
        { icon: "compass", label: local("Near famous cliff-top restaurants, cafes & local markets") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Stay Flexibility"), desc: local("Pick the exact lodging vibe that fits your budget: Inn, Garden, or Homestay.") },
        { icon: "star", title: local("Luggage Drop Support"), desc: local("Drop your bags early and start exploring local cafes without carrying luggage around.") }
      ],

      quickFacts: [
        { key: local("Stay Options"), value: local("Inn / Garden / Homestay") },
        { key: local("Check-in Time"), value: local("12:00 PM") },
        { key: local("Check-out Time"), value: local("11:00 AM") },
        { key: local("Nearest Airport"), value: local("Trivandrum (TRV) - 45 km") }
      ],

      inclusions: [
        local("1 Night accommodation at selected Villa Lemon property"),
        local("Luggage drop-off assistance"),
        local("Villa Wi-Fi access & clean linens"),
        local("Local sightseeing tips & coordination support")
      ],

      exclusions: [
        local("Sightseeing entry tickets"),
        local("Local transfers and transportation"),
        local("Lunch & Dinner meals"),
        local("Personal expenses & shopping")
      ],

      thingsToBring: [
        local("Sunblock, hat & sunglasses"),
        local("Beachwear & comfortable slippers"),
        local("Personal toiletries")
      ],

      nearbyAttractions: [
        { name: local("Black Sand Beach"), distance: local("1 km") },
        { name: local("Varkala Siva Giri Station"), distance: local("2 km") }
      ],

      faqs: [
        { question: local("Is transportation included?"), answer: local("No, transportation is not included, but our desk can coordinate reliable local taxi/tuk-tuk drivers at standard rates.") },
        { question: local("Can we check in early?"), answer: local("Early arrivals are subject to availability. You can drop off your bags anytime.") }
      ],

      itinerary: [
        { timeOrDay: local("Day 1 - 12:00 PM"), activity: local("Arrival & Check-in"), desc: local("Arrive at your selected property, check-in or drop luggage and relax.") },
        { timeOrDay: local("Day 1 - 03:00 PM"), activity: local("Mangrove Kayaking"), desc: local("Optional sunset mangrove kayaking experience in Varkala backwaters.") },
        { timeOrDay: local("Day 1 - 06:00 PM"), activity: local("Varkala Cliff Visit"), desc: local("Walk along the lively cliff street, explore boutique shops, and enjoy cliff-side dining.") },
        { timeOrDay: local("Day 2 - 08:30 AM"), activity: local("Breakfast"), desc: local("Enjoy fresh daily breakfast at the villa property.") },
        { timeOrDay: local("Day 2 - 11:00 AM"), activity: local("Check-out"), desc: local("Check-out from the room. Keep luggage at reception if you have a late departure.") },
        { timeOrDay: local("Day 2 - 12:00 PM"), activity: local("Sightseeing & Departure"), desc: local("Optional morning trip to Black Sand Beach or Jatayu Earth Center before departure.") }
      ]
    });
    await p1.save();
    console.log("✅ Seeded p1");

    console.log("🌿 Seeding Package 2: Varkala 2 Nights / 3 Days Experience...");
    const p2 = new PackageItem({
      packageCategory: "varkalaPackages",
      slug: "varkala-2-nights-3-days-experience",
      price: 6999,
      pricePeriod: local("/ stay"),
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      duration: local("2 Nights / 3 Days"),
      travelTime: local("Railway station pickup included"),
      entryFee: local("Jatayu Earth Center tickets not included"),
      optionalCharges: local("Ayurvedic massage and elephant farm optional"),
      difficulty: local("Easy"),
      groupSize: local("2-6 People"),
      location: local("Villa Lemon Homestay & Varkala, Kerala"),

      title: local("Varkala 2 Nights / 3 Days Experience"),
      tagline: local("The Ultimate Stay & Excursions Combo Package"),
      shortDescription: local(
        "Enjoy a complete 3-day Varkala escape featuring 2 nights at Villa Lemon Homestay, auto-rickshaw pickup, private car tour to Jatayu Earth Center, sunrise kayaking at Mangrove Village, and daily breakfast."
      ),
      aboutText: local(
        "Immerse yourself in the authentic coastal charm of South India with our Varkala 2 Nights / 3 Days Experience. Base yourself at the relaxing Villa Lemon Homestay and explore the region's best highlights with all coordinates fully managed.\n\nFrom the towering mythical Jatayu Earth Center sculpture to the tranquil, misty canals of Mangrove Village during a magical sunrise kayaking tour, this package offers a complete, hassle-free combination of quality stays and premium activities."
      ),
      tourOverview: local(
        "Perfect for couples, small groups, or solo travelers looking to experience the best attractions near Varkala Cliff and backwaters in a single, well-coordinated package. Includes private car transfers for Jatayu and kayaking."
      ),
      bestTime: local("October to April (Best weather)"),
      dressCode: local("Casual wear, modest clothing for temples"),
      cta: local("Book 3 Days Experience"),

      highlights: [
        { icon: "compass", label: local("2 Nights accommodation at Villa Lemon Homestay") },
        { icon: "compass", label: local("Varkala Sivagiri station pickup by auto-rickshaw") },
        { icon: "compass", label: local("Jatayu Earth's Center private car trip") },
        { icon: "compass", label: local("Sunrise Kayaking experience at Mangrove Village") },
        { icon: "compass", label: local("Visit Janardanaswamy Temple & Golden Island") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Seamless Transfers"), desc: local("Includes station pickup, private car tours to Jatayu and kayaking so you never worry about finding taxis.") },
        { icon: "star", title: local("Sunrise Magic"), desc: local("Includes a premium guided kayaking trip through calm mangrove waters right at sunrise.") }
      ],

      quickFacts: [
        { key: local("Stay Location"), value: local("Villa Lemon Homestay") },
        { key: local("Distance to Cliff"), value: local("850 meters (10 min walk)") },
        { key: local("Station Pickup"), value: local("Included (Rickshaw)") },
        { key: local("Kayaking duration"), value: local("2 Hours (Sunrise)") }
      ],

      inclusions: [
        local("2 Nights accommodation at Villa Lemon Homestay"),
        local("Varkala Sivagiri Railway Station pickup (Auto-rickshaw)"),
        local("Jatayu Earth’s Center Trip (Private AC car transfer)"),
        local("Sunrise Kayaking Experience at Mangrove Village (Kayaks & private transfers)"),
        local("Welcome drink on arrival"),
        local("Daily breakfast"),
        local("Local assistance & trip coordination"),
        local("Villa Wi-Fi access")
      ],

      exclusions: [
        local("Flight / Train tickets"),
        local("Lunch & Dinner meals"),
        local("Entry tickets at Jatayu Earth's Center"),
        local("Elephant Farm visit charges (optional)"),
        local("Ayurvedic Massage / Spa charges (optional)"),
        local("Additional transport or shopping bills")
      ],

      thingsToBring: [
        local("Comfortable quick-dry athletic clothes"),
        local("Sunblock, hat & sunglasses"),
        local("Camera or phone for views"),
        local("Temple dress code clothing (if visiting temple inside)")
      ],

      nearbyAttractions: [
        { name: local("Varkala Cliff"), distance: local("850 m") },
        { name: local("Janardanaswamy Temple"), distance: local("3 km") }
      ],

      faqs: [
        { question: local("Where is Villa Lemon Homestay located?"), answer: local("It is located in a quiet tropical neighborhood just 850 meters from Varkala Cliff and beach.") },
        { question: local("Do we need kayaking experience?"), answer: local("No, our guides provide a complete safety briefing and instructions before launch in calm waters.") }
      ],

      itinerary: [
        { timeOrDay: local("Day 1 - 10:30 AM"), activity: local("Station Pickup & Check-in"), desc: local("Rickshaw pickup from Varkala Sivagiri Station to Homestay, check-in & welcome drink.") },
        { timeOrDay: local("Day 1 - 02:00 PM"), activity: local("Jatayu Earth's Center"), desc: local("Travel by private car to Chadayamangalam to explore the world's largest bird sculpture.") },
        { timeOrDay: local("Day 1 - 05:30 PM"), activity: local("Cliff Sunset"), desc: local("Walk to Varkala Cliff, watch sunset, relax at local cafes, dinner at cliff restaurant.") },
        { timeOrDay: local("Day 2 - 05:30 AM"), activity: local("Sunrise Mangrove Kayaking"), desc: local("Early taxi pickup to Mangrove Village for a guided sunrise kayaking session.") },
        { timeOrDay: local("Day 2 - 11:00 AM"), activity: local("Temple & Golden Island"), desc: local("Visit Janardanaswamy Temple and cruise backwaters of Golden Island.") },
        { timeOrDay: local("Day 3 - 09:00 AM"), activity: local("Breakfast & Optional tours"), desc: local("Daily breakfast at Homestay, optional visit to elephant farm.") },
        { timeOrDay: local("Day 3 - 11:00 AM"), activity: local("Check-out"), desc: local("Check-out and private departure transfer setup.") }
      ]
    });
    await p2.save();
    console.log("✅ Seeded p2");

    console.log("🌿 Checking/Seeding Homepage Category Card...");
    const categoryExists = await Package.findOne({ category: "varkalaPackages" });
    if (!categoryExists) {
      console.log("➕ Category card not found. Seeding varkalaPackages card...");
      const pkgCard = new Package({
        category: "varkalaPackages",
        title: {
          en: "Varkala Packages",
          de: "Varkala-Pakete",
          fr: "Forfaits Varkala",
          ru: "Туры в Варкалу"
        },
        description: {
          en: "Premium multi-day stay and experience packages in Varkala.",
          de: "Premium-Mehrtagesunterkünfte und Erlebnispakete in Varkala.",
          fr: "Forfaits premium de séjour et d'excursions de plusieurs jours à Varkala.",
          ru: "Премиальные многодневные туры с проживанием в Варкале."
        },
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
        explore: {
          en: "Explore",
          de: "Erkunden",
          fr: "Explorer",
          ru: "Подробнее"
        },
        href: "/packages/varkala-packages"
      });
      await pkgCard.save();
      console.log("✅ Category card saved!");
    } else {
      console.log("ℹ️ Category card already exists in Homepage list.");
    }

    console.log("🎉 Seeding completed successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

run();
