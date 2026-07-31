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

    console.log("🗑️  Cleaning existing Sunrise Kayaking package if it exists...");
    await PackageItem.deleteMany({ slug: "mangrove-forest-sunrise-kayaking-varkala" });

    console.log("🌿 Creating Mangrove Forest Sunrise Kayaking from Varkala package item...");
    const tour = new PackageItem({
      packageCategory: ["dayTrips"], // Array of strings as defined in the updated schema
      slug: "mangrove-forest-sunrise-kayaking-varkala",
      price: 2500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&w=1200&q=80",
      duration: local("3.5 Hours"),
      travelTime: local("30 Minutes"),
      entryFee: local("Included"),
      optionalCharges: local("Personal expenses"),
      difficulty: local("Easy"),
      groupSize: local("Up to 10"),
      location: local("Varkala"),

      title: local("Mangrove Forest Sunrise Kayaking from Varkala"),
      tagline: local("Experience the Magic of Sunrise on Kerala's Peaceful Backwaters"),
      shortDescription: local(
        "Begin your day with a peaceful sunrise kayaking adventure through Kerala's beautiful mangrove forests. Paddle across calm backwaters, enjoy incredible birdwatching, and experience nature at its most serene."
      ),
      aboutText: local(
        "Start your day with one of the most unforgettable nature experiences near Varkala. Paddle through tranquil mangrove waterways as the first rays of sunlight illuminate Kerala's peaceful backwaters.\n\nLed by experienced local guides, this beginner-friendly kayaking adventure offers calm waters, abundant birdlife, breathtaking sunrise photography, and an opportunity to discover Kerala's fascinating mangrove ecosystem. Perfect for couples, families, photographers, birdwatchers, and nature lovers seeking a peaceful outdoor experience."
      ),
      tourOverview: local(
        "Enjoy an early morning pickup from Varkala before travelling to Kerala's peaceful mangrove forests. After a short safety briefing, paddle through calm backwaters as the rising sun transforms the landscape into a spectacular natural paradise. Discover hidden waterways, observe native wildlife, capture stunning sunrise photographs, and experience one of Kerala's most rewarding eco-adventures."
      ),
      bestTime: local("October to March"),
      dressCode: local("Comfortable Quick-Dry Clothing"),
      cta: local("Book Now"),

      highlights: [
        { icon: "compass", label: local("Sunrise Mangrove Kayaking") },
        { icon: "compass", label: local("Guided Kayaking Adventure") },
        { icon: "leaf", label: local("Explore Hidden Waterways") },
        { icon: "sun", label: local("Beautiful Sunrise Views") },
        { icon: "compass", label: local("Excellent Birdwatching") },
        { icon: "camera", label: local("Sunrise Photography") },
        { icon: "compass", label: local("Peaceful Backwaters") },
        { icon: "book", label: local("Learn About Mangrove Ecosystem") },
        { icon: "car", label: local("Private Transportation") },
      ],

      whyGuestsLoveUs: [
        {
          icon: "star",
          title: local("Beautiful Sunrise Experience"),
          desc: local("Witness Kerala's peaceful backwaters illuminated by the first light of the day."),
        },
        {
          icon: "star",
          title: local("Perfect for Beginners"),
          desc: local("Easy kayaking with professional local guides and complete safety instruction."),
        },
        {
          icon: "star",
          title: local("Birdwatcher's Paradise"),
          desc: local("Observe kingfishers, herons, egrets and other wildlife during the most active time of day."),
        },
        {
          icon: "star",
          title: local("Relaxing Nature Escape"),
          desc: local("Enjoy calm waterways, fresh morning air and the untouched beauty of Kerala's mangroves."),
        },
      ],

      quickFacts: [
        { key: local("Duration"), value: local("3.5 Hours") },
        { key: local("Departure"), value: local("06:00 AM") },
        { key: local("Return"), value: local("09:30 AM") },
        { key: local("Location"), value: local("Mangrove Forest, Varkala") },
        { key: local("Transport"), value: local("Private AC Vehicle") },
        { key: local("Difficulty"), value: local("Easy") },
        { key: local("Suitable For"), value: local("Beginners") },
        { key: local("Guide"), value: local("Professional Local Guide") },
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
        local("Breakfast"),
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
        { name: local("Kappil Beach"), distance: local("10 km") },
        { name: local("Kappil Lake"), distance: local("10 km") },
        { name: local("Edava Beach"), distance: local("7 km") },
        { name: local("Anjengo Lighthouse"), distance: local("15 km") },
      ],

      faqs: [
        {
          question: local("Do I need previous kayaking experience?"),
          answer: local("No. This experience is beginner-friendly. Professional guides provide complete safety instructions and paddling guidance before the tour begins."),
        },
        {
          question: local("Why is sunrise the best time for kayaking?"),
          answer: local("Early mornings offer calm waters, cooler temperatures, active birdlife and beautiful natural light, making sunrise the ideal time to explore Kerala's mangrove forests."),
        },
        {
          question: local("How long is the kayaking experience?"),
          answer: local("The kayaking session lasts approximately 2½ hours, while the complete excursion takes around 3½ hours including transportation."),
        },
        {
          question: local("Is this tour suitable for children?"),
          answer: local("Yes. Children can participate under adult supervision and according to local safety guidelines."),
        },
        {
          question: local("What wildlife can I expect to see?"),
          answer: local("Depending on the season, you may spot kingfishers, herons, egrets, cormorants, butterflies, crabs, fish and many other species that inhabit Kerala's mangrove ecosystem."),
        },
      ],

      metaTitle: local("Mangrove Forest Sunrise Kayaking from Varkala | Villa Lemon"),
      metaDescription: local("Experience sunrise kayaking through Kerala's peaceful mangrove forests near Varkala. Enjoy birdwatching, wildlife, breathtaking sunrise views and guided eco-adventures with private transportation."),
      keywords: local("sunrise kayaking Varkala, mangrove kayaking Kerala, Varkala kayaking, mangrove forest tour Varkala, birdwatching Kerala, sunrise backwater tour, eco tour Varkala, kayaking Kerala, Villa Lemon tours"),
      canonicalUrl: "https://villalemonvarkala.com/tours/mangrove-forest-sunrise-kayaking-varkala",

      cancellation: local("Free cancellation up to 24 hours before departure. Cancellations made within 24 hours may be subject to charges."),
      refund: local("Eligible cancellations receive a full refund through the original payment method."),
      pickup: local("Villa Lemon or any hotel/accommodation in Varkala."),
      drop: local("Return drop-off at Villa Lemon or your accommodation in Varkala."),
      notes: local("• Suitable for beginners with no prior kayaking experience.\n• Life jackets must be worn throughout the activity.\n• Tour timings may vary slightly depending on weather and water conditions.\n• Children must be accompanied by an adult.\n• Carry a waterproof phone pouch for electronic devices.\n• Wildlife sightings depend on season and natural conditions."),
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
