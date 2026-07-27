import dotenv from "dotenv";
import mongoose from "mongoose";
import { Retreat } from "../models/Retreat";

dotenv.config();

const L = (en: string, de = "", fr = "", ru = "") => ({ en, de, fr, ru });

const retreat = {
  // ── General Info ──────────────────────────────────────────────────────────
  slug: "varkala-yoga-spiritual-retreat",
  days: 7,
  nights: 6,
  price: 24999,
  displayOrder: 1,
  minAge: 18,
  maxCapacity: 20,
  yogaHours: 28,
  status: "published",
  featured: true,
  certificate: true,
  bookingOpen: true,

  location: L("Varkala, Kerala, India"),
  difficulty: L("Beginner Friendly"),
  yogaLevel: L("All Levels"),
  language: L("English"),
  groupSize: L("6–20 Participants"),
  accommodationType: L("Private & Shared Rooms"),

  // ── Content ───────────────────────────────────────────────────────────────
  heroTitle: L("7-Day Yoga, Spiritual & Nature Retreat in Varkala"),
  heroSubtitle: L("Reconnect • Rejuvenate • Transform"),
  tagline: L("Experience authentic yoga, meditation, Ayurveda, nature and Kerala hospitality in peaceful Varkala."),
  shortDescription: L(
    "Spend seven unforgettable days surrounded by tropical gardens, beautiful beaches and experienced yoga teachers. Restore your body, calm your mind and reconnect with yourself."
  ),
  fullDescription: L(
    "Escape the noise of everyday life and experience a transformational yoga retreat in Varkala, Kerala. Practice traditional Hatha and Vinyasa Yoga, meditation and pranayama while staying in comfortable accommodation surrounded by nature.\n\nEnjoy healthy vegetarian meals, relaxing Ayurvedic therapies, peaceful beaches and carefully selected local excursions. Whether you are a beginner or an experienced practitioner, this retreat offers the perfect balance of wellness, relaxation and cultural experiences."
  ),
  retreatOverview: L(
    "Escape to the peaceful coastline of Varkala and immerse yourself in a transformative 7-day yoga retreat designed to restore balance, improve well-being, and reconnect you with nature. Practice traditional Hatha and Vinyasa Yoga, guided meditation, and pranayama in a calm tropical environment just minutes from Varkala Cliff and Black Beach.\n\nYour stay includes comfortable accommodation, healthy vegetarian meals, experienced yoga instructors, optional Ayurvedic wellness treatments, and carefully selected local excursions that showcase the beauty and culture of Kerala. Whether you seek relaxation, personal growth, or a break from everyday life, this retreat offers the perfect balance of wellness, comfort, and authentic Kerala hospitality."
  ),
  whyChoose: L(
    "• Traditional Hatha & Vinyasa Yoga classes twice daily\n• Guided meditation and pranayama sessions\n• Peaceful accommodation surrounded by tropical greenery\n• Healthy vegetarian meals prepared fresh every day\n• Small group experience with personalized guidance\n• Optional authentic Ayurvedic therapies\n• Comfortable private and shared room options\n• Beautiful beaches, cliffs and nature nearby\n• Carefully planned local cultural and sightseeing experiences\n• Suitable for beginners as well as experienced practitioners\n• Warm Kerala hospitality throughout your stay\n• Airport transfers and local travel assistance available"
  ),
  whoIsItFor: L(
    "This retreat is ideal for beginners taking their first yoga journey, experienced practitioners looking to deepen their practice, solo travellers seeking personal growth, couples wanting a wellness getaway, families and friends interested in mindful travel, remote workers needing a peaceful environment, and anyone wishing to reduce stress, improve flexibility, reconnect with nature, or experience authentic Kerala culture through yoga and wellness."
  ),
  bestTime: L(
    "The retreat is available throughout the year, with the best weather from October to March when Varkala enjoys pleasant temperatures, sunny days, and cool evenings. The monsoon season from June to September offers lush green surroundings and is ideal for those seeking a peaceful atmosphere and traditional Ayurvedic rejuvenation. Retreat dates are scheduled regularly, allowing guests to choose a time that best fits their travel plans."
  ),
  cta: L("Book Your Retreat"),

  // ── Highlights ────────────────────────────────────────────────────────────
  highlights: [
    { icon: "Sun", title: L("Twice Daily Yoga"), description: L("Morning Hatha Yoga and evening Vinyasa sessions guided by experienced teachers.") },
    { icon: "Leaf", title: L("Meditation & Breathwork"), description: L("Daily meditation, mindfulness and pranayama practices for inner balance.") },
    { icon: "Utensils", title: L("Healthy Vegetarian Meals"), description: L("Fresh home-cooked vegetarian meals prepared with locally sourced ingredients.") },
    { icon: "Palmtree", title: L("Beautiful Beaches"), description: L("Relax at Varkala Cliff and Black Beach after your yoga sessions.") },
    { icon: "Mountain", title: L("Nature Excursions"), description: L("Explore Kerala's breathtaking attractions during your retreat.") },
    { icon: "Heart", title: L("Ayurvedic Wellness"), description: L("Optional traditional Kerala Ayurvedic treatments and massages.") },
  ],

  // ── Daily Schedule ────────────────────────────────────────────────────────
  dailySchedule: [
    { time: "06:00 AM", activity: L("Morning Yoga & Pranayama"), description: L("Traditional Hatha Yoga followed by guided breathing practices.") },
    { time: "08:00 AM", activity: L("Healthy Breakfast"), description: L("Fresh fruits, juices and nutritious vegetarian breakfast.") },
    { time: "10:00 AM", activity: L("Free Time"), description: L("Relax, read, explore the beach or enjoy the gardens.") },
    { time: "01:00 PM", activity: L("Lunch"), description: L("Authentic Kerala vegetarian meal.") },
    { time: "03:30 PM", activity: L("Excursion / Workshop"), description: L("Nature visits, philosophy sessions or cultural experiences.") },
    { time: "05:30 PM", activity: L("Evening Yoga"), description: L("Gentle Vinyasa Flow with meditation.") },
    { time: "07:30 PM", activity: L("Dinner"), description: L("Healthy vegetarian dinner.") },
    { time: "09:00 PM", activity: L("Silent Reflection"), description: L("Journaling and mindful relaxation before sleep.") },
  ],

  // ── Curriculum ────────────────────────────────────────────────────────────
  curriculum: [
    {
      dayNumber: 1,
      dayTitle: L("Arrival & Welcome"),
      description: L("Airport pickup, check-in, welcome dinner and introduction to the retreat."),
      learningOutcome: L("Settle into the retreat environment and begin your wellness journey."),
      topics: [L("Welcome Circle"), L("Property Tour"), L("Evening Meditation")],
    },
    {
      dayNumber: 2,
      dayTitle: L("Foundations of Yoga"),
      description: L("Breath awareness, alignment fundamentals and morning Hatha practice."),
      learningOutcome: L("Breath awareness and alignment."),
      topics: [L("Hatha Yoga"), L("Pranayama"), L("Meditation")],
    },
    {
      dayNumber: 3,
      dayTitle: L("Mindfulness & Nature"),
      description: L("Explore mindfulness in movement and connect with the natural surroundings."),
      learningOutcome: L("Deep relaxation and connection with nature."),
      topics: [L("Nature Walk"), L("Mindfulness Practice"), L("Beach Relaxation")],
    },
    {
      dayNumber: 4,
      dayTitle: L("Kerala Exploration"),
      description: L("Day trip to cultural and natural landmarks of Kerala."),
      learningOutcome: L("Experience local culture and landscapes."),
      topics: [L("Backwater Excursion"), L("Local Culture"), L("Evening Yoga")],
    },
    {
      dayNumber: 5,
      dayTitle: L("Yoga Philosophy"),
      description: L("Dive into yogic philosophy, Ayurveda basics and lifestyle principles."),
      learningOutcome: L("Understand yogic lifestyle and mindfulness."),
      topics: [L("Philosophy Class"), L("Ayurvedic Wellness"), L("Journaling")],
    },
    {
      dayNumber: 6,
      dayTitle: L("Inner Transformation"),
      description: L("Advanced practices, partner yoga and deep relaxation techniques."),
      learningOutcome: L("Improve flexibility, balance and mental clarity."),
      topics: [L("Partner Yoga"), L("Deep Stretch"), L("Nidra Session")],
    },
    {
      dayNumber: 7,
      dayTitle: L("Closing Ceremony"),
      description: L("Certificate ceremony, group sharing and mindful departure."),
      learningOutcome: L("Complete the retreat with gratitude and renewed energy."),
      topics: [L("Certificate Presentation"), L("Group Sharing"), L("Farewell Breakfast")],
    },
  ],

  // ── Excursions ────────────────────────────────────────────────────────────
  excursions: [
    {
      name: L("Golden Island Experience"),
      duration: L("2–3 Hours"),
      description: L("Boat ride through peaceful backwaters surrounded by tropical scenery."),
      relatedTour: "golden-island",
      included: true,
    },
    {
      name: L("Varkala Cliff Walk"),
      duration: L("2 Hours"),
      description: L("Sunset walk along the iconic Varkala Cliff with panoramic sea views."),
      included: true,
    },
  ],

  // ── Rooms ─────────────────────────────────────────────────────────────────
  rooms: [
    {
      name: L("Budget Room"),
      occupancy: 2,
      sharedPrice: 24999,
      privatePrice: 32999,
      hasAC: true,
      hasBathroom: true,
      hotWater: true,
      features: [L("AC"), L("Bathroom"), L("Hot Water"), L("WiFi")],
    },
    {
      name: L("Deluxe Balcony Room"),
      occupancy: 2,
      sharedPrice: 29999,
      privatePrice: 38999,
      hasAC: true,
      hasBathroom: true,
      hasBalcony: true,
      hasWorkspace: true,
      hotWater: true,
      features: [L("Private Balcony"), L("AC"), L("Hot Water"), L("Workspace")],
    },
  ],

  // ── Meals ─────────────────────────────────────────────────────────────────
  meals: [
    { mealType: L("Breakfast"), description: L("Fresh fruits, herbal tea, traditional Kerala breakfast."), isVegan: true, isGlutenFree: false },
    { mealType: L("Lunch"), description: L("Healthy vegetarian Kerala meals."), isVegan: true, isGlutenFree: false },
    { mealType: L("Dinner"), description: L("Balanced vegetarian dinner with seasonal ingredients."), isVegan: true, isGlutenFree: true },
  ],

  // ── Yoga Program ──────────────────────────────────────────────────────────
  yogaStyle: L("Traditional Hatha & Vinyasa Yoga"),
  morningSession: L("06:00–08:00 AM"),
  eveningSession: L("05:30–07:00 PM"),
  meditation: L("Daily Guided Meditation"),
  pranayama: L("Nadi Shodhana, Kapalabhati, Anulom Vilom"),
  suitableFor: L("Beginners & Intermediate Practitioners"),
  yogaCertificate: L("Participation Certificate"),

  // ── Teachers ──────────────────────────────────────────────────────────────
  teachers: [
    {
      name: "Yogi Arun Sharma",
      experience: "15+ Years",
      specialization: L("Hatha Yoga, Meditation & Pranayama"),
      bio: L("Arun has guided students from around the world through authentic yoga practices, helping them build strength, flexibility and inner peace."),
    },
  ],

  // ── Ayurveda ──────────────────────────────────────────────────────────────
  ayurvedaTitle: L("Traditional Kerala Ayurvedic Wellness"),
  ayurvedaDescription: L("Enhance your retreat experience with optional Ayurvedic therapies performed by experienced therapists."),
  ayurvedaTreatments: [
    {
      name: L("Abhyanga Massage"),
      description: L("Full body warm herbal oil massage."),
      isOptional: true,
      extraCost: 2500,
    },
  ],

  // ── Pricing Rows ──────────────────────────────────────────────────────────
  pricingRows: [
    { roomCategory: L("Budget Room"), sharedPrice: 24999, privatePrice: 32999, availability: L("Available") },
    { roomCategory: L("Deluxe Balcony Room"), sharedPrice: 29999, privatePrice: 38999, availability: L("Available") },
  ],

  // ── Checklists ────────────────────────────────────────────────────────────
  inclusions: [
    L("Accommodation"), L("Daily Yoga"), L("Meditation"), L("Vegetarian Meals"), L("WiFi"), L("Excursions"), L("Airport Assistance"),
  ],
  exclusions: [
    L("Flights"), L("Travel Insurance"), L("Personal Expenses"), L("Additional Treatments"),
  ],
  thingsToBring: [
    L("Comfortable Clothes"), L("Yoga Wear"), L("Water Bottle"), L("Personal Medicines"), L("Sunscreen"),
  ],
  dressCode: [L("Comfortable modest clothing suitable for yoga.")],
  requirements: [L("Basic physical fitness and willingness to participate.")],
  whoShouldAvoid: [L("Guests with serious medical conditions should consult a doctor before joining.")],

  // ── FAQs ──────────────────────────────────────────────────────────────────
  faqs: [
    { question: L("Is this retreat beginner friendly?"), answer: L("Yes. All classes are suitable for beginners.") },
    { question: L("Do you provide airport pickup?"), answer: L("Yes. Airport transfer can be arranged upon request.") },
    { question: L("Are meals vegetarian?"), answer: L("Yes. Healthy vegetarian meals are included daily.") },
    { question: L("Can I book a private room?"), answer: L("Yes. Private room upgrades are available.") },
  ],

  // ── Booking ───────────────────────────────────────────────────────────────
  deposit: L("30% deposit required to confirm your booking."),
  balancePayment: L("Full balance due 14 days before the retreat starts."),
  cancellation: L("Free cancellation up to 14 days before arrival. 50% refund within 7 days."),
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  bookingTerms: L("By booking you agree to Villa Lemon's terms and retreat guidelines."),

  // ── SEO ───────────────────────────────────────────────────────────────────
  metaTitle: L("7-Day Yoga & Spiritual Retreat in Varkala, Kerala | Villa Lemon"),
  metaDescription: L("Join a transformative 7-day Hatha & Vinyasa Yoga retreat in Varkala, Kerala. Daily yoga, meditation, Ayurveda, healthy meals & local excursions. All levels welcome."),
  keywords: L("yoga retreat varkala, kerala yoga retreat, hatha yoga india, ayurveda varkala, spiritual retreat kerala"),
};

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("No MONGODB_URI in .env"); process.exit(1); }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  // Remove existing if any
  await Retreat.deleteOne({ slug: retreat.slug });
  console.log("🗑️  Cleared existing retreat with same slug (if any)");

  const doc = await Retreat.create(retreat);
  console.log("🌿 Retreat created successfully:", doc._id.toString());
  console.log("   Title:", doc.heroTitle.en);
  console.log("   Slug: ", doc.slug);

  await mongoose.disconnect();
  console.log("🔒 Disconnected. Done!");
  process.exit(0);
};

seed().catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
