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

const runUpdate = async () => {
  try {
    await connectDB();

    console.log("[update]: Finding Varkala Cliff tour package...");
    const tour = await PackageItem.findOne({
      $or: [
        { slug: "cliff-beach-sightseeing-tour" },
        { "title.en": /Varkala Cliff/i }
      ]
    });

    if (!tour) {
      console.error("[update]: Varkala Cliff tour package not found in DB!");
      process.exit(1);
    }

    console.log(`[update]: Found tour: "${tour.title.en}" with ID: ${tour._id}. Updating details...`);

    tour.packageCategory = ["varkalaSightseeing"];
    tour.slug = "mangrove-forest-kayaking";
    tour.price = 2500;
    tour.duration = local("5 Hours");
    tour.travelTime = local("30 Minutes Each Way");
    tour.entryFee = local("Included");
    tour.optionalCharges = local("Optional Activities (if available)");
    tour.difficulty = local("Easy");
    tour.groupSize = local("2–10 People");
    tour.location = local("Mangrove Forest, Varkala, Kerala");

    // Localized content
    tour.title = local("Mangrove Forest Kayaking Experience from Varkala");
    tour.pricePeriod = local("/person");
    tour.tagline = local("Discover Kerala's Hidden Backwater Paradise");
    tour.shortDescription = local(
      "Paddle through Kerala's serene mangrove forests, explore peaceful backwaters, observe native wildlife, and enjoy one of the most relaxing eco-adventures near Varkala."
    );
    tour.aboutText = local(
      "Experience one of Kerala's most peaceful and unforgettable eco-adventures with our Mangrove Forest Kayaking Experience from Varkala. Paddle through serene backwaters surrounded by lush mangrove forests, discover hidden waterways, observe native birds and wildlife, and immerse yourself in the untouched beauty of South Kerala's unique coastal ecosystem.\n\nLocated just a short drive from Varkala, this guided kayaking tour is perfect for nature lovers, adventure seekers, families, couples, photographers, and anyone looking to experience Kerala beyond its famous beaches. Whether you're a beginner or an experienced paddler, our professional guides ensure a safe, enjoyable, and memorable kayaking journey through one of the region's most beautiful natural landscapes."
    );
    tour.tourOverview = local(
      "Your adventure begins with an early morning pickup from Villa Lemon or your accommodation in Varkala. After a scenic drive to the mangrove forest, your guide provides a complete safety briefing and kayaking instructions before heading onto the calm backwaters.\n\nGlide through peaceful waterways surrounded by dense mangrove forests while learning about Kerala's unique coastal ecosystem. Watch for kingfishers, herons, egrets, cormorants, and other native birds as you enjoy one of the most relaxing outdoor experiences near Varkala."
    );
    tour.bestTime = local("Early Morning (Year Round)");
    tour.dressCode = local("Comfortable quick-dry outdoor clothing");
    tour.cta = local("Book Mangrove Kayaking");

    // Highlights
    tour.highlights = [
      { icon: "compass", label: local("Guided Mangrove Kayaking") },
      { icon: "compass", label: local("Peaceful Backwater Experience") },
      { icon: "compass", label: local("Bird Watching") },
      { icon: "compass", label: local("Wildlife Photography") },
      { icon: "compass", label: local("Hidden Waterways") },
      { icon: "compass", label: local("Suitable for Beginners") },
      { icon: "compass", label: local("Private Pickup & Drop") },
      { icon: "compass", label: local("Professional Kayaking Guide") },
    ];

    // Why guests love us
    tour.whyGuestsLoveUs = [
      {
        icon: "star",
        title: local("Local Expert Guides"),
        desc: local("Experienced local guides ensure a safe and memorable kayaking adventure."),
      },
      {
        icon: "star",
        title: local("Peaceful Nature Experience"),
        desc: local("Escape the crowds and discover Kerala's hidden mangrove ecosystem."),
      },
      {
        icon: "star",
        title: local("Premium Equipment"),
        desc: local("Quality kayaks, life jackets, and safety equipment are included."),
      },
      {
        icon: "star",
        title: local("Private Transfers"),
        desc: local("Comfortable pickup and drop-off directly from your accommodation."),
      },
    ];

    // Quick Facts
    tour.quickFacts = [
      { key: local("Best Time"), value: local("Early Morning") },
      { key: local("Difficulty"), value: local("Easy") },
      { key: local("Duration"), value: local("5 Hours") },
      { key: local("Pickup"), value: local("Included") },
      { key: local("Drop"), value: local("Included") },
      { key: local("Suitable For"), value: local("Beginners") },
    ];

    // Inclusions & Exclusions
    tour.inclusions = [
      local("Hotel pickup and drop-off"),
      local("Private transportation"),
      local("Kayak and paddle"),
      local("Life jacket"),
      local("Professional kayaking guide"),
      local("Safety briefing"),
      local("Drinking water"),
    ];

    tour.exclusions = [
      local("Meals"),
      local("Personal expenses"),
      local("Travel insurance"),
      local("Optional activities"),
    ];

    // Things to bring
    tour.thingsToBring = [
      local("Comfortable clothing"),
      local("Quick-dry outfit"),
      local("Hat or Cap"),
      local("Sunglasses"),
      local("Sunscreen"),
      local("Waterproof phone pouch"),
      local("Camera"),
      local("Towel"),
      local("Extra clothes"),
    ];

    // Itinerary
    tour.itinerary = [
      {
        timeOrDay: local("06:30 AM"),
        activity: local("Pickup from Villa Lemon"),
        desc: local("Pickup from Villa Lemon or your hotel in Varkala."),
      },
      {
        timeOrDay: local("07:00 AM"),
        activity: local("Arrival at Mangrove Forest"),
        desc: local("Meet your kayaking guide and receive a welcome briefing."),
      },
      {
        timeOrDay: local("07:15 AM"),
        activity: local("Safety Briefing"),
        desc: local("Kayaking instructions and safety demonstration."),
      },
      {
        timeOrDay: local("07:30 AM – 09:30 AM"),
        activity: local("Guided Kayaking"),
        desc: local("Enjoy a peaceful guided kayaking experience through Kerala's mangrove forests."),
      },
      {
        timeOrDay: local("09:45 AM"),
        activity: local("Photography Break"),
        desc: local("Relax and capture beautiful photographs of the surroundings."),
      },
      {
        timeOrDay: local("10:15 AM"),
        activity: local("Nature Exploration"),
        desc: local("Explore nearby mangrove areas and observe local wildlife."),
      },
      {
        timeOrDay: local("11:00 AM"),
        activity: local("Return Journey"),
        desc: local("Begin the return drive back to Varkala."),
      },
      {
        timeOrDay: local("11:30 AM"),
        activity: local("Drop Off"),
        desc: local("Drop-off at Villa Lemon or your accommodation."),
      },
    ];

    // Attractions
    tour.nearbyAttractions = [
      { name: local("Golden Island Canoeing"), distance: local("8 km") },
      { name: local("Kappil Beach"), distance: local("10 km") },
      { name: local("Varkala Cliff"), distance: local("12 km") },
      { name: local("Janardhanaswamy Temple"), distance: local("12 km") },
    ];

    // Related
    tour.relatedPackages = [
      "golden-island-canoeing",
      "kappil-beach-lake-tour",
      "varkala-cliff-tour",
      "janardhanaswamy-temple-tour",
    ];

    // FAQs
    tour.faqs = [
      {
        question: local("Do I need kayaking experience?"),
        answer: local(
          "No. This experience is suitable for beginners, and your guide will provide complete kayaking instructions before the tour begins."
        ),
      },
      {
        question: local("Is the tour safe?"),
        answer: local("Yes. Safety equipment, including life jackets, is provided, and experienced guides accompany every tour."),
      },
      {
        question: local("How long is the experience?"),
        answer: local("Approximately 5 hours including transportation."),
      },
      {
        question: local("Can children participate?"),
        answer: local("Yes. Children can participate under adult supervision and according to local safety guidelines."),
      },
      {
        question: local("Is hotel pickup included?"),
        answer: local(
          "Yes. Complimentary pickup and drop-off are available from Villa Lemon and most accommodations around Varkala."
        ),
      },
    ];

    // SEO
    tour.metaTitle = local("Mangrove Forest Kayaking Experience from Varkala | Villa Lemon Kerala");
    tour.metaDescription = local(
      "Enjoy a guided Mangrove Forest Kayaking Experience from Varkala with hotel pickup, professional guides, peaceful backwaters, bird watching, and unforgettable Kerala nature adventures."
    );
    tour.keywords = local(
      "mangrove kayaking varkala, kayaking kerala, backwater kayaking, varkala activities, eco tourism kerala, villa lemon tours, mangrove forest, nature tour varkala"
    );
    tour.canonicalUrl = "";
    if (tour.image) {
      tour.ogImage = tour.image;
      tour.ogImagePublicId = tour.imagePublicId || "";
    }

    // Booking Details
    tour.cancellation = local("Free cancellation up to 24 hours before departure.");
    tour.refund = local("Eligible refunds are processed within 5–7 working days after approval.");
    tour.pickup = local("Pickup is available from Villa Lemon and most hotels within Varkala.");
    tour.drop = local("Guests are dropped back at their original pickup location after the tour.");
    tour.notes = local(
      "Please arrive 10 minutes before pickup. Wear comfortable clothing, bring sunscreen and a waterproof phone pouch. Tour timings may vary depending on weather conditions for guest safety."
    );

    await tour.save();
    console.log("[update]: Varkala Cliff tour package updated successfully in DB!");

    await mongoose.disconnect();
    console.log("[update]: DB connection closed.");
  } catch (error) {
    console.error("[update]: Error updating tour package:", error);
    process.exit(1);
  }
};

runUpdate();
