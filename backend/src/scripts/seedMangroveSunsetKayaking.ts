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

    console.log("🗑️  Cleaning existing Sunset Kayaking package if it exists...");
    await PackageItem.deleteMany({ slug: "mangrove-forest-sunset-kayaking-varkala" });

    console.log("🌿 Creating Mangrove Forest Sunset Kayaking from Varkala package item...");
    const tour = new PackageItem({
      packageCategory: ["dayTrips"], // Array of strings as defined in the updated schema
      slug: "mangrove-forest-sunset-kayaking-varkala",
      price: 2500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      duration: local("3 Hours"),
      travelTime: local("30 Minutes"),
      entryFee: local("Included"),
      optionalCharges: local("Personal expenses"),
      difficulty: local("Easy"),
      groupSize: local("Up to 10 Guests"),
      location: local("Varkala"),

      title: local("Mangrove Forest Sunset Kayaking from Varkala"),
      tagline: local("Paddle into a Breathtaking Kerala Sunset"),
      shortDescription: local(
        "Experience the magical beauty of Kerala's backwaters during golden hour with a guided sunset kayaking adventure through peaceful mangrove forests. Perfect for couples, honeymooners, families, photographers and nature lovers."
      ),
      aboutText: local(
        "End your day with one of the most relaxing and romantic experiences near Varkala. Paddle through peaceful mangrove waterways during sunset as the sky transforms into beautiful shades of orange, pink and gold.\n\nLed by experienced local guides, this beginner-friendly kayaking adventure combines nature, wildlife, photography and unforgettable scenery. Enjoy calm waters, spectacular sunset reflections and discover Kerala's fascinating mangrove ecosystem while creating lasting memories."
      ),
      tourOverview: local(
        "Travel from Varkala to Kerala's beautiful mangrove forests for an unforgettable sunset kayaking experience. After a safety briefing, paddle through calm backwaters surrounded by lush greenery while enjoying breathtaking sunset views, peaceful waterways, local wildlife and excellent photography opportunities."
      ),
      bestTime: local("October to March"),
      dressCode: local("Comfortable Quick-Dry Clothing"),
      cta: local("Book Now"),

      highlights: [
        { icon: "compass", label: local("Sunset kayaking through peaceful mangrove forests") },
        { icon: "compass", label: local("Guided kayaking with experienced local instructors") },
        { icon: "leaf", label: local("Explore hidden backwater canals") },
        { icon: "sun", label: local("Spectacular golden-hour scenery") },
        { icon: "compass", label: local("Beautiful reflections on calm waters") },
        { icon: "camera", label: local("Excellent photography opportunities") },
        { icon: "book", label: local("Learn about Kerala's mangrove ecosystem") },
        { icon: "car", label: local("Private transportation from Varkala") },
        { icon: "compass", label: local("Perfect for couples, honeymooners, families and solo travellers") },
      ],

      whyGuestsLoveUs: [
        {
          icon: "star",
          title: local("Magical Sunset Experience"),
          desc: local("Witness breathtaking sunset colours reflected across Kerala's peaceful backwaters."),
        },
        {
          icon: "star",
          title: local("Beginner Friendly"),
          desc: local("Professional guides provide complete instruction, making this perfect even for first-time kayakers."),
        },
        {
          icon: "star",
          title: local("Incredible Photography"),
          desc: local("Capture stunning golden-hour landscapes and unforgettable sunset reflections."),
        },
        {
          icon: "star",
          title: local("Relaxing Nature Escape"),
          desc: local("Enjoy a peaceful evening surrounded by Kerala's beautiful mangrove forests."),
        },
      ],

      quickFacts: [
        { key: local("Duration"), value: local("3 Hours") },
        { key: local("Departure"), value: local("03:30 PM") },
        { key: local("Return"), value: local("06:30 PM") },
        { key: local("Location"), value: local("Mangrove Forest, Varkala") },
        { key: local("Transport"), value: local("Private Air-Conditioned Vehicle") },
        { key: local("Difficulty"), value: local("Easy") },
        { key: local("Suitable For"), value: local("Beginners") },
        { key: local("Guide"), value: local("Professional Local Kayaking Guide") },
      ],

      inclusions: [
        local("Hotel pickup & drop-off"),
        local("Private transportation"),
        local("Guided kayaking experience"),
        local("Kayak & paddle"),
        local("Life jacket"),
        local("Professional local guide"),
        local("Safety briefing"),
        local("Drinking water"),
      ],

      exclusions: [
        local("Meals & refreshments"),
        local("Personal expenses"),
        local("Travel insurance"),
      ],

      thingsToBring: [
        local("Comfortable quick-dry clothing"),
        local("Hat or cap"),
        local("Sunglasses"),
        local("Sunscreen"),
        local("Waterproof phone pouch"),
        local("Camera"),
        local("Towel"),
        local("Extra clothes"),
      ],

      nearbyAttractions: [
        { name: local("Varkala Cliff"), distance: local("8 km") },
        { name: local("Varkala Beach"), distance: local("8 km") },
        { name: local("Edava Beach"), distance: local("7 km") },
        { name: local("Kappil Beach"), distance: local("10 km") },
        { name: local("Kappil Lake"), distance: local("10 km") },
        { name: local("Anjengo Lighthouse"), distance: local("15 km") },
        { name: local("Golden Island"), distance: local("12 km") },
        { name: local("Paravur Backwaters"), distance: local("14 km") },
      ],

      faqs: [
        {
          question: local("Do I need kayaking experience?"),
          answer: local("No. This experience is beginner-friendly. Your professional guide will provide complete paddling instructions and a safety briefing before the tour begins."),
        },
        {
          question: local("Is the sunset visible from the mangrove forest?"),
          answer: local("Yes. Depending on the season and weather conditions, you'll enjoy beautiful golden-hour colours and spectacular reflections across the backwaters. Even when the sun sets behind surrounding vegetation, the evening atmosphere remains breathtaking."),
        },
        {
          question: local("How long is the kayaking experience?"),
          answer: local("The kayaking session lasts approximately 2 to 2½ hours, while the complete excursion takes around 3 hours including transportation."),
        },
        {
          question: local("Is this tour suitable for children?"),
          answer: local("Yes. Children can participate under adult supervision according to local safety guidelines. Life jackets are provided for all participants."),
        },
        {
          question: local("What wildlife might I see?"),
          answer: local("Depending on the season, you may spot kingfishers, herons, egrets, cormorants, butterflies, crabs, fish and many other species that become active during the evening hours."),
        },
      ],

      metaTitle: local("Mangrove Forest Sunset Kayaking from Varkala | Sunset Backwater Tour | Villa Lemon"),
      metaDescription: local("Experience a magical sunset kayaking adventure through Kerala's peaceful mangrove forests near Varkala. Enjoy guided kayaking, wildlife, golden-hour photography and private transportation with Villa Lemon."),
      keywords: local("sunset kayaking Varkala, mangrove kayaking Kerala, Varkala kayaking, sunset backwater tour, Kerala mangrove forest, Varkala eco tour, golden hour kayaking, mangrove forest Varkala, kayaking Kerala, Villa Lemon tours"),
      canonicalUrl: "https://villalemonvarkala.com/tours/mangrove-forest-sunset-kayaking-varkala",

      cancellation: local("Free cancellation up to 24 hours before departure. Cancellations made within 24 hours of the tour may be subject to cancellation charges."),
      refund: local("Eligible cancellations receive a full refund to the original payment method. Refunds are processed within the standard processing period."),
      pickup: local("Villa Lemon or any hotel/accommodation in Varkala."),
      drop: local("Return drop-off at Villa Lemon or your accommodation in Varkala after the kayaking experience."),
      notes: local("• No previous kayaking experience is required.\n• Life jackets are mandatory and provided for all participants.\n• Children must be accompanied by an adult.\n• Tour timings may vary slightly depending on weather, tides and water conditions.\n• Wear comfortable quick-dry clothing and carry a waterproof phone pouch.\n• Wildlife sightings depend on natural conditions and cannot be guaranteed.\n• Please arrive on time for pickup to ensure a smooth departure."),
      
      itinerary: [
        { timeOrDay: local("03:30 PM"), activity: local("Pickup from Varkala"), desc: local("Your journey begins with pickup from Villa Lemon or your accommodation in Varkala. Relax during a comfortable drive through Kerala's scenic countryside towards the beautiful mangrove forests.") },
        { timeOrDay: local("04:00 PM"), activity: local("Arrival & Safety Briefing"), desc: local("Meet your experienced kayaking guide for a short safety briefing and introduction to basic paddling techniques. Receive your kayak, paddle and life jacket before beginning the adventure.") },
        { timeOrDay: local("04:15 PM"), activity: local("Sunset Kayaking Experience"), desc: local("Launch your kayak and paddle through peaceful mangrove waterways as the afternoon light slowly transforms into Kerala's spectacular golden hour. Explore hidden canals surrounded by lush mangrove forests while your guide explains the local ecosystem and helps you spot birds, butterflies, crabs and other wildlife.") },
        { timeOrDay: local("05:45 PM"), activity: local("Golden Hour Photography Stop"), desc: local("Pause at one of the most scenic locations in the backwaters to admire the breathtaking sunset. Capture stunning photographs as the colourful sky reflects beautifully across the calm waterways.") },
        { timeOrDay: local("06:00 PM"), activity: local("Continue Kayaking"), desc: local("Continue your leisurely paddle through the peaceful mangrove forest while enjoying the cool evening breeze, tranquil surroundings and unforgettable sunset atmosphere before returning to the jetty.") },
        { timeOrDay: local("06:30 PM"), activity: local("Return to Varkala"), desc: local("After completing your kayaking adventure, relax during the drive back to Villa Lemon or your accommodation with unforgettable memories of Kerala's magical sunset backwaters.") }
      ]
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
