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

    console.log("🗑️  Cleaning existing Trivandrum Temple Tour package if it exists...");
    await PackageItem.deleteMany({ slug: "trivandrum-temple-tour-from-varkala" });

    console.log("🌿 Creating Trivandrum Temple Tour from Varkala package item...");
    const tour = new PackageItem({
      packageCategory: ["dayTrips"], // Array of strings as defined in the updated schema
      slug: "trivandrum-temple-tour-from-varkala",
      price: 3500,
      pricePeriod: local("/ private tour"),
      image: "https://images.unsplash.com/photo-1600100397608-f010e42ec970?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1600100397608-f010e42ec970?auto=format&fit=crop&w=1200&q=80",
      duration: local("Full Day"),
      travelTime: local("1.5 Hours"),
      entryFee: local("Not Included"),
      optionalCharges: local("Meals, Temple Offerings, Guide, Airport Transfer"),
      difficulty: local("Easy"),
      groupSize: local("Private Tour"),
      location: local("Thiruvananthapuram (Trivandrum)"),

      title: local("Trivandrum Temple Tour from Varkala"),
      tagline: local("A Full-Day Spiritual Journey Through Kerala's Most Sacred Temples"),
      shortDescription: local(
        "Experience Kerala's spiritual heritage on a carefully planned full-day temple tour from Varkala. Visit five iconic temples, witness centuries-old traditions, admire magnificent architecture and enjoy a peaceful pilgrimage through Thiruvananthapuram."
      ),
      aboutText: local(
        "Experience the spiritual heart of Kerala on this carefully curated full-day temple tour from Varkala. Visit five of the most revered temples in and around Thiruvananthapuram, where ancient traditions, magnificent architecture and peaceful surroundings create an unforgettable pilgrimage.\n\nFrom the famous Pazhavangadi Ganapathy Temple to the world-renowned Sree Padmanabhaswamy Temple, the beautiful Aazhimala Shiva Temple and the remarkable Chenkal Maheswaram Shiva Parvathy Temple, this tour offers a meaningful blend of devotion, history, architecture and culture. Designed around temple opening hours, it ensures a relaxed and enriching spiritual experience."
      ),
      tourOverview: local(
        "Travel comfortably from Varkala to Kerala's most sacred temples with private transportation. Receive blessings at five important temples, experience authentic Hindu traditions, admire historic architecture, enjoy scenic coastal views and discover the rich spiritual heritage of Thiruvananthapuram through a carefully planned full-day pilgrimage."
      ),
      bestTime: local("October to March"),
      dressCode: local("Traditional Indian attire recommended. Strict dress code applies at Sree Padmanabhaswamy Temple."),
      cta: local("Book Now"),

      highlights: [
        { icon: "compass", label: local("Visit five of Kerala's most sacred temples") },
        { icon: "compass", label: local("Sree Padmanabhaswamy Temple") },
        { icon: "compass", label: local("Pazhavangadi Ganapathy Temple") },
        { icon: "compass", label: local("Attukal Bhagavathy Temple") },
        { icon: "compass", label: local("Aazhimala Shiva Temple") },
        { icon: "compass", label: local("Chenkal Maheswaram Shiva Parvathy Temple") },
        { icon: "compass", label: local("Walk inside the 111-foot Shiva Lingam") },
        { icon: "car", label: local("Comfortable private transportation") },
        { icon: "compass", label: local("Beautiful coastal temple views") },
        { icon: "compass", label: local("Ideal for pilgrims, families and international visitors") },
      ],

      whyGuestsLoveUs: [
        {
          icon: "star",
          title: local("Carefully Planned Pilgrimage"),
          desc: local("Visit Kerala's most important temples following the ideal temple opening schedule."),
        },
        {
          icon: "star",
          title: local("Comfortable Private Travel"),
          desc: local("Travel in a private air-conditioned vehicle with pickup and drop-off from Varkala."),
        },
        {
          icon: "star",
          title: local("Authentic Spiritual Experience"),
          desc: local("Participate in Kerala's rich temple traditions while exploring centuries of history and culture."),
        },
        {
          icon: "star",
          title: local("Unique Temple Architecture"),
          desc: local("Discover magnificent temples, iconic sculptures and breathtaking coastal scenery throughout the journey."),
        },
      ],

      quickFacts: [
        { key: local("Duration"), value: local("Full Day") },
        { key: local("Departure"), value: local("05:00 AM") },
        { key: local("Return"), value: local("07:00 PM") },
        { key: local("Pickup"), value: local("Villa Lemon or Any Hotel in Varkala") },
        { key: local("Transport"), value: local("Private Air-Conditioned Vehicle") },
        { key: local("Tour Type"), value: local("Private Temple Tour") },
        { key: local("Best For"), value: local("Pilgrims • Families • Couples • Yoga Retreat Guests") },
      ],

      inclusions: [
        local("Private AC transportation"),
        local("Hotel pickup & drop-off"),
        local("Experienced local driver"),
        local("Flexible sightseeing"),
        local("Drinking water"),
      ],

      exclusions: [
        local("Temple offerings"),
        local("Breakfast & Lunch"),
        local("Entry charges (if applicable)"),
        local("Personal expenses"),
        local("Guide (optional)"),
      ],

      thingsToBring: [
        local("Traditional clothing"),
        local("Water bottle"),
        local("Comfortable sandals"),
        local("Umbrella"),
        local("Camera (outdoor use only)"),
        local("Cash for temple offerings"),
        local("Valid ID"),
        local("Sunglasses"),
      ],

      nearbyAttractions: [
        { name: local("Pazhavangadi Ganapathy Temple"), distance: local("0 km") },
        { name: local("Sree Padmanabhaswamy Temple"), distance: local("1 km") },
        { name: local("Attukal Bhagavathy Temple"), distance: local("3 km") },
        { name: local("Aazhimala Shiva Temple"), distance: local("20 km") },
        { name: local("Chenkal Maheswaram Shiva Parvathy Temple"), distance: local("35 km") },
        { name: local("Kovalam Beach"), distance: local("15 km") },
        { name: local("Vizhinjam Harbour"), distance: local("17 km") },
        { name: local("East Fort Market"), distance: local("1 km") },
      ],

      faqs: [
        {
          question: local("Is this a private tour?"),
          answer: local("Yes. This is a private tour conducted exclusively for you, your family or your group, ensuring a relaxed and personalized spiritual experience."),
        },
        {
          question: local("Can the itinerary be customized?"),
          answer: local("Yes. The itinerary can be adjusted according to your interests, group size and temple timings, subject to availability."),
        },
        {
          question: local("Are meals included?"),
          answer: local("Meals are optional and can be arranged upon request. Traditional Kerala vegetarian breakfast and lunch are available as add-ons."),
        },
        {
          question: local("Is this tour suitable for senior travellers?"),
          answer: local("Yes. The tour is comfortable and relaxed. Some walking and stair climbing are required at Chenkal Maheswaram Shiva Parvathy Temple."),
        },
        {
          question: local("What should I bring for the temple tour?"),
          answer: local("Carry traditional clothing for temple visits, a water bottle, umbrella, comfortable footwear, cash for offerings, valid ID and a camera for outdoor photography where permitted."),
        },
      ],

      metaTitle: local("Trivandrum Temple Tour from Varkala | Sree Padmanabhaswamy Temple Tour | Villa Lemon"),
      metaDescription: local("Visit five of Kerala's most sacred temples on a full-day private tour from Varkala. Explore Sree Padmanabhaswamy Temple, Attukal Temple, Aazhimala Shiva Temple and more with comfortable private transportation."),
      keywords: local("Trivandrum Temple Tour, Temple Tour from Varkala, Sree Padmanabhaswamy Temple Tour, Pazhavangadi Ganapathy Temple, Attukal Bhagavathy Temple, Aazhimala Shiva Temple, Chenkal Maheswaram Temple, Kerala pilgrimage tour, Varkala temple trip, Villa Lemon tours"),
      canonicalUrl: "https://villalemonvarkala.com/tours/trivandrum-temple-tour-from-varkala",

      cancellation: local("Free cancellation up to 24 hours before departure. Cancellations made within 24 hours of the tour may be subject to cancellation charges."),
      refund: local("Eligible cancellations receive a full refund through the original payment method. Refunds are processed according to the standard processing period."),
      pickup: local("Villa Lemon or any hotel/accommodation in Varkala."),
      drop: local("Return drop-off at Villa Lemon or your accommodation in Varkala after the temple tour."),
      notes: local("• Sree Padmanabhaswamy Temple permits entry only for Hindus.\n• Men must wear a Mundu (Dhoti) and remove shirts before entering the temple.\n• Women should wear a Saree, Traditional Indian attire or Salwar Kameez with dupatta as permitted by temple regulations.\n• Traditional garments are available for rent near the temple entrance.\n• Footwear must be removed before entering every temple.\n• Photography and mobile phones are not permitted inside Sree Padmanabhaswamy Temple.\n• Carry cash for temple offerings and personal expenses.\n• Tour timings may vary slightly depending on traffic, temple schedules and local conditions."),
      
      itinerary: [
        { timeOrDay: local("05:00 AM"), activity: local("Pickup from Varkala"), desc: local("Begin your spiritual journey with pickup from Villa Lemon or your accommodation in Varkala. Travel comfortably through Kerala's peaceful countryside towards Thiruvananthapuram.") },
        { timeOrDay: local("06:00 AM"), activity: local("Pazhavangadi Ganapathy Temple"), desc: local("Start your pilgrimage by seeking blessings from Lord Ganesha, the remover of obstacles. Experience the famous coconut-breaking ritual and admire this historic temple's traditional Kerala architecture.") },
        { timeOrDay: local("06:45 AM"), activity: local("Sree Padmanabhaswamy Temple"), desc: local("Visit one of India's holiest Vishnu temples, renowned for its magnificent Dravidian architecture, royal heritage and legendary treasure vaults. Traditional dress code is mandatory, and entry inside the sanctum is restricted to Hindus.") },
        { timeOrDay: local("07:45 AM"), activity: local("Attukal Bhagavathy Temple"), desc: local("Visit the famous 'Sabarimala of Women', dedicated to Goddess Kannaki. Experience the peaceful atmosphere of one of Kerala's most important Devi temples and learn about the internationally renowned Attukal Pongala festival.") },
        { timeOrDay: local("08:45 AM"), activity: local("Traditional Kerala Breakfast"), desc: local("Enjoy an optional traditional Kerala vegetarian breakfast at a local restaurant before continuing your temple pilgrimage.") },
        { timeOrDay: local("10:15 AM"), activity: local("Aazhimala Shiva Temple"), desc: local("Visit the spectacular oceanfront Shiva Temple featuring the magnificent Gangadhareshwara Shiva statue overlooking the Arabian Sea. Spend time admiring the breathtaking coastal scenery and peaceful surroundings.") },
        { timeOrDay: local("01:00 PM"), activity: local("Vegetarian Lunch"), desc: local("Enjoy an optional vegetarian lunch at a local restaurant serving authentic Kerala cuisine.") },
        { timeOrDay: local("03:15 PM"), activity: local("Chenkal Maheswaram Shiva Parvathy Temple"), desc: local("Explore one of India's most unique temples and walk inside the iconic 111-foot Shiva Lingam. Discover the symbolic architecture representing the journey towards spiritual enlightenment.") },
        { timeOrDay: local("05:30 PM"), activity: local("Return Journey"), desc: local("Begin the comfortable drive back to Varkala while reflecting on a memorable day of devotion, culture and spirituality.") },
        { timeOrDay: local("07:00 PM"), activity: local("Arrival in Varkala"), desc: local("Arrive back at Villa Lemon or your accommodation with unforgettable memories of Kerala's sacred temples and spiritual traditions.") }
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
