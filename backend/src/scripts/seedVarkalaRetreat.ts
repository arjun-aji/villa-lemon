import dotenv from "dotenv";
import mongoose from "mongoose";
import { Retreat } from "../models/Retreat";

dotenv.config();

const L = (en: string, de = "", fr = "", ru = "") => ({ en, de, fr, ru });

const retreat = {
  // ── General Info ──────────────────────────────────────────────────────────
  slug: "varkala-yoga-spiritual-retreat",
  days: 11,
  nights: 10,
  price: 24999,
  displayOrder: 1,
  minAge: 18,
  maxCapacity: 20,
  yogaHours: 30,
  status: "published",
  featured: true,
  certificate: true,
  bookingOpen: true,

  location: L("Varkala, Kerala, India"),
  difficulty: L("Beginner Friendly"),
  yogaLevel: L("Suitable for beginners, intermediate, and experienced practitioners"),
  language: L("English"),
  groupSize: L("Small groups to ensure personal attention and a welcoming community atmosphere"),
  accommodationType: L("Shared Twin / Private Room"),

  // ── Content ───────────────────────────────────────────────────────────────
  heroTitle: L("Varkala Yoga, Spiritual & Nature Retreat"),
  heroSubtitle: L("Reconnect • Rejuvenate • Transform"),
  tagline: L("Discover the perfect harmony of yoga, spirituality, nature, and authentic Kerala culture during this immersive 11 Days / 10 Nights Yoga Retreat in the beautiful coastal town of Varkala."),
  shortDescription: L(
    "Spend 11 unforgettable days guided by experienced Indian yoga teachers. Combines daily yoga & meditation, healthy vegetarian cuisine, spiritual exploration, cultural experiences, and nature excursions."
  ),
  fullDescription: L(
    "Discover the perfect harmony of yoga, spirituality, nature, and authentic Kerala culture during this immersive 11 Days / 10 Nights Yoga Retreat in the beautiful coastal town of Varkala.\n\nGuided by experienced Indian yoga teachers, this retreat combines daily yoga and meditation, healthy vegetarian cuisine, spiritual exploration, cultural experiences, and carefully selected excursions to Kerala's most beautiful destinations. Whether you are beginning your yoga journey or looking to deepen your practice, this retreat provides a peaceful environment where you can reconnect with yourself while experiencing the traditions and natural beauty of South India."
  ),
  retreatOverview: L(
    "Our Varkala Yoga, Spiritual & Nature Retreat offers much more than a traditional yoga holiday. It is a complete wellness experience that blends authentic Indian yoga, meditation, Ayurveda, spiritual exploration, cultural immersion, and the breathtaking natural beauty of Kerala.\n\nOver 11 days and 10 nights, you'll practice yoga with experienced Indian teachers, nourish your body with wholesome vegetarian cuisine, explore sacred temples and peaceful backwaters, meet gentle elephants, witness spectacular landscapes, and enjoy meaningful cultural experiences. Whether you are looking to deepen your yoga practice, reduce stress, reconnect with yourself, or simply experience the magic of Kerala, this retreat provides the perfect balance of wellness, spirituality, nature, culture, and relaxation."
  ),
  whyChoose: L(
    "• Traditional Hatha & Vinyasa Yoga classes twice daily\n• Guided meditation and pranayama sessions\n• Peaceful accommodation across our Villa Lemon properties\n• Healthy vegetarian meals prepared fresh every day\n• Small group experience with personalized guidance\n• Optional authentic Ayurvedic therapies\n• Private and shared room options\n• Beautiful Varkala Beach and Cliff nearby\n• Spiritual Varkala Tour (temples & Sivagiri Ashram)\n• Golden Island Backwater boat ride\n• Kaveri Elephant Park & Jatayu Hilltop experience\n• Indian Cultural Saree & Bollywood dance celebration"
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
    { icon: "Sun", title: L("Daily Yoga"), description: L("Daily morning and evening yoga sessions with experienced Indian yoga teachers.") },
    { icon: "Leaf", title: L("Meditation & Breathwork"), description: L("Guided meditation, pranayama, and yoga philosophy classes for inner balance.") },
    { icon: "Utensils", title: L("Nourishing Dining"), description: L("Healthy vegetarian breakfast, brunch, lunch, and dinner prepared with fresh local ingredients.") },
    { icon: "Home", title: L("Comfortable Accommodation"), description: L("Stay at one of our peaceful Villa Lemon properties, thoughtfully designed for rest.") },
    { icon: "Mountain", title: L("Nature Excursions"), description: L("Private transfers to Golden Island, Kaveri Elephant Park, and Jatayu Earth's Center.") },
    { icon: "Heart", title: L("Ayurvedic Rejuvenation"), description: L("Access to qualified Ayurvedic consultations and customized rejuvenation treatments.") },
  ],

  // ── Daily Schedule ────────────────────────────────────────────────────────
  dailySchedule: [
    { time: "06:00 – 08:00 AM", activity: L("Morning Yoga & Meditation"), description: L("Traditional Hatha Yoga followed by guided breathing and meditation.") },
    { time: "08:15 AM", activity: L("Herbal Tea"), description: L("Nourishing herbal tea served hot at the Shala.") },
    { time: "09:00 AM", activity: L("Healthy Breakfast"), description: L("Nutritious vegetarian breakfast selection.") },
    { time: "10:00 AM – 01:00 PM", activity: L("Excursion / Free Time"), description: L("Time for beach relaxation, Ayurvedic massage, or scheduled excursions.") },
    { time: "11:00 AM", activity: L("Fresh Fruit Brunch"), description: L("Fresh seasonal tropical fruits served daily.") },
    { time: "01:00 PM", activity: L("Vegetarian Lunch"), description: L("Authentic Kerala vegetarian lunch.") },
    { time: "02:00 – 03:30 PM", activity: L("Yoga Philosophy"), description: L("Philosophy class, meditation, or wellness lecture (twice weekly).") },
    { time: "03:30 – 05:00 PM", activity: L("Free Time / Relaxation"), description: L("Relax in the tropical gardens or explore the Varkala Cliff.") },
    { time: "05:00 PM", activity: L("Healthy Dinner"), description: L("Wholesome vegetarian dinner served at the dining area.") },
    { time: "07:30 – 09:00 PM", activity: L("Evening Yoga & Meditation"), description: L("Gentle restorative Vinyasa Yoga and calming meditation before sleep.") },
  ],

  // ── Curriculum ────────────────────────────────────────────────────────────
  curriculum: [
    {
      dayNumber: 1,
      dayTitle: L("Arrival in Varkala"),
      description: L("Welcome to God's Own Country! Upon arrival at Trivandrum International Airport or Varkala Railway Station, you will be warmly welcomed by our team and transferred to your accommodation. After checking in, relax in the peaceful surroundings of the villa before meeting your yoga teachers and fellow participants during the welcome orientation. The evening begins with a gentle restorative yoga session to release travel fatigue, followed by a delicious vegetarian dinner prepared with fresh local ingredients."),
      learningOutcome: L("Settle into the retreat environment and begin your wellness journey."),
      topics: [L("Airport/Railway Station Pickup"), L("Welcome Drink & Check-in"), L("Orientation Meeting"), L("Gentle Evening Yoga"), L("Healthy Dinner")],
    },
    {
      dayNumber: 2,
      dayTitle: L("Discover the Spiritual Heart of Varkala"),
      description: L("Start your morning with yoga and meditation before exploring the spiritual heritage of Varkala. Visit the sacred Janardanaswamy Temple, one of Kerala's oldest Vishnu temples, followed by the peaceful Sivagiri Ashram, founded by the great philosopher and social reformer Sree Narayana Guru. Continue with a guided introduction to Varkala Town, where you'll explore local markets, traditional streets, cafés, and discover the unique culture that makes this coastal destination so special. Return to the villa for evening yoga and meditation."),
      learningOutcome: L("Understand Varkala's rich spiritual roots and local culture."),
      topics: [L("Janardanaswamy Temple"), L("Sivagiri Ashram"), L("Varkala Town Guided Tour"), L("Local Markets & Cafés"), L("Kerala Culture & Heritage")],
    },
    {
      dayNumber: 3,
      dayTitle: L("Golden Island Backwater Experience"),
      description: L("Following your morning yoga session, travel through Kerala's countryside to the tranquil Golden Island. Surrounded by coconut palms and peaceful backwaters, you'll experience authentic village life, enjoy scenic nature walks, observe local fishermen, and immerse yourself in the calm atmosphere that has made Kerala's backwaters famous around the world. Evening yoga and meditation complete another peaceful day."),
      learningOutcome: L("Immerse in the tranquility of Kerala's backwaters."),
      topics: [L("Kerala Backwaters Boat Ride"), L("Village Life Exploration"), L("Coconut Plantations Walks"), L("Photography & Nature Appreciation"), L("Evening Yoga")],
    },
    {
      dayNumber: 4,
      dayTitle: L("Wellness & Beach Relaxation"),
      description: L("Today is dedicated entirely to your wellbeing. After yoga, enjoy free time to experience Varkala however you wish. Relax on the beach, book an Ayurvedic massage, enjoy fresh coconut water along the famous cliff, explore boutique shops, or simply spend time reading and relaxing at the villa. The evening yoga practice focuses on deep stretching, breathing techniques, and complete relaxation."),
      learningOutcome: L("Rejuvenate your body and enjoy peaceful coastal exploration."),
      topics: [L("Free Time"), L("Beach Relaxation"), L("Ayurvedic Massages"), L("Shopping at Cliff"), L("Deep Restorative Stretch")],
    },
    {
      dayNumber: 5,
      dayTitle: L("Kaveri Elephant Park"),
      description: L("Today's excursion introduces you to one of Kerala's most memorable wildlife experiences. Visit Kaveri Elephant Park, where you'll meet gentle elephants in a peaceful natural environment. Learn about elephant care, conservation, and their cultural importance while enjoying unforgettable moments surrounded by Kerala's lush countryside. Return to the villa for evening meditation."),
      learningOutcome: L("Learn about elephant care and connect with nature."),
      topics: [L("Elephant Interaction"), L("Learn About Elephant Care"), L("Nature Experience"), L("Countryside Settings"), L("Photography Opportunities")],
    },
    {
      dayNumber: 6,
      dayTitle: L("Jatayu Earth's Center"),
      description: L("Travel to Jatayu Earth's Center, home to the world's largest bird sculpture inspired by the Indian epic Ramayana. Enjoy a spectacular cable car ride to the hilltop, admire breathtaking panoramic views, explore the cultural park, and discover the inspiring legend of Jatayu. Return to Varkala in the evening for yoga and dinner."),
      learningOutcome: L("Explore Kerala's iconic mythological landmark."),
      topics: [L("World's Largest Bird Sculpture"), L("Scenic Cable Car Ride"), L("Hilltop Panoramic Views"), L("Cultural Ramayana Park"), L("Evening Yoga & Dinner")],
    },
    {
      dayNumber: 7,
      dayTitle: L("Healing, Reflection & Yoga Philosophy"),
      description: L("Begin with an extended yoga session followed by guided meditation and a yoga philosophy class exploring mindfulness, breath awareness, and yogic living. Spend the afternoon enjoying an Ayurvedic massage, relaxing on the beach, journaling, or simply appreciating the peaceful atmosphere of the retreat."),
      learningOutcome: L("Deepen your understanding of yogic philosophy and mindfulness."),
      topics: [L("Extended Yoga & Meditation"), L("Yoga Philosophy Lecture"), L("Ayurvedic Consultation"), L("Journaling & Reflection"), L("Beach Walk")],
    },
    {
      dayNumber: 8,
      dayTitle: L("Kappil Beach & Lake"),
      description: L("Following your morning practice, visit one of Kerala's most scenic coastal destinations. Kappil Beach is where the Arabian Sea meets tranquil backwaters, creating one of the most picturesque landscapes in South India. Walk along the beach, admire the peaceful surroundings, enjoy photography, and reconnect with nature before returning for evening yoga."),
      learningOutcome: L("Experience the intersection of sea and backwaters."),
      topics: [L("Kappil Beach Walks"), L("Kappil Lake Sightseeing"), L("Tranquil Backwaters Scenic Views"), L("Sunset Photography"), L("Nature Connection")],
    },
    {
      dayNumber: 9,
      dayTitle: L("Indian Cultural Celebration"),
      description: L("Experience the colourful traditions of India during a fun-filled cultural evening. Dress in a beautiful traditional saree, learn energetic Bollywood dance moves, enjoy lively Indian music, and celebrate together with your fellow participants. This joyful evening offers an unforgettable opportunity to experience authentic Indian culture while creating wonderful memories and friendships."),
      learningOutcome: L("Immerse in Indian cultural clothing, dance, and music."),
      topics: [L("Traditional Saree Experience"), L("Bollywood Dance Workshop"), L("Indian Music & Entertainment"), L("Cultural Group Photos"), L("Festive Vegetarian Dinner")],
    },
    {
      dayNumber: 10,
      dayTitle: L("Integration & Farewell"),
      description: L("Your final full day is dedicated to reflection and celebration. Enjoy an extended yoga practice followed by meditation and a sharing circle where everyone reflects on their personal journey throughout the retreat. Celebrate the evening with a farewell dinner and receive your participation certificate before your departure."),
      learningOutcome: L("Integrate your personal experiences and celebrate connections."),
      topics: [L("Extended Yoga Practice"), L("Closing Sharing Circle"), L("Farewell Communal Dinner"), L("Certificate Presentation"), L("Mindful Celebration")],
    },
    {
      dayNumber: 11,
      dayTitle: L("Departure"),
      description: L("Enjoy one final peaceful meditation and healthy breakfast before checking out. Our team will provide your private transfer to Trivandrum International Airport or Varkala Railway Station. Leave Varkala carrying beautiful memories, renewed energy, lasting friendships, and practical tools to continue your yoga journey wherever life takes you."),
      learningOutcome: L("Conclude the retreat with gratitude and tools for home practice."),
      topics: [L("Farewell Meditation"), L("Nutritious Breakfast"), L("Checkout"), L("Private Airport Transfer"), L("Departure")],
    },
  ],

  // ── Excursions ────────────────────────────────────────────────────────────
  excursions: [
    {
      name: L("Spiritual Varkala Tour"),
      duration: L("2 Hours"),
      description: L("Discover the spiritual heritage of Varkala through a guided visit to the ancient Janardanaswamy Temple, one of Kerala's oldest Vishnu temples. Continue to the serene Sivagiri Ashram, founded by Sree Narayana Guru, and conclude with an introduction to Varkala Town's local markets."),
      included: true,
    },
    {
      name: L("Golden Island Backwater Experience"),
      duration: L("2 Hours"),
      description: L("Escape into Kerala's backwaters with a visit to the peaceful Golden Island. Surrounded by coconut plantations and tranquil waterways, you'll enjoy authentic village life and local countryside rhythm."),
      included: true,
    },
    {
      name: L("Kaveri Elephant Park"),
      duration: L("2 Hours"),
      description: L("Spend time with India's gentle giants in a beautiful natural setting. Learn about elephant conservation and their importance in Kerala's culture while observing them up close."),
      included: true,
    },
    {
      name: L("Jatayu Earth's Center"),
      duration: L("4–5 Hours"),
      description: L("Visit the world's largest bird sculpture inspired by the Ramayana. Ride the hilltop cable car, enjoy panoramic views, and explore the cultural and mythological park."),
      included: true,
    },
    {
      name: L("Kappil Beach & Kappil Lake"),
      duration: L("2–3 Hours"),
      description: L("Discover the scenic coastal destination where golden sandy beaches meet peaceful backwaters, offering hidden nature walks and stunning sunsets."),
      included: true,
    },
    {
      name: L("Special Cultural Experience – Saree & Bollywood Dance Party"),
      duration: L("2–3 Hours (Evening)"),
      description: L("Celebrate India's vibrant culture. Dress in traditional sarees, learn Bollywood dance steps, enjoy lively music, and conclude with a festive vegetarian dinner."),
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
      features: [L("AC"), L("Attached private bathroom"), L("Complimentary Wi-Fi"), L("Ideal for budget travellers")],
    },
    {
      name: L("Standard Room"),
      occupancy: 2,
      sharedPrice: 29999,
      privatePrice: 38999,
      hasAC: true,
      hasBathroom: true,
      hotWater: true,
      features: [L("AC"), L("Attached bathroom with hot water"), L("Shared kitchen & dining"), L("Complimentary Wi-Fi")],
    },
    {
      name: L("Deluxe Room"),
      occupancy: 2,
      sharedPrice: 34999,
      privatePrice: 44999,
      hasAC: true,
      hasBathroom: true,
      hotWater: true,
      features: [L("Spacious & Modern layout"), L("AC"), L("Attached bathroom with hot water"), L("Comfortable seating area")],
    },
    {
      name: L("Deluxe Room with Balcony"),
      occupancy: 2,
      sharedPrice: 39999,
      privatePrice: 49999,
      hasAC: true,
      hasBathroom: true,
      hasBalcony: true,
      hotWater: true,
      features: [L("Private Balcony"), L("AC"), L("Attached bathroom with hot water"), L("Perfect for relaxing after yoga")],
    },
    {
      name: L("Superior Deluxe Room (Villa Lemon Inn)"),
      occupancy: 2,
      sharedPrice: 44999,
      privatePrice: 56999,
      hasAC: true,
      hasBathroom: true,
      hasBalcony: true,
      hasWorkspace: true,
      hotWater: true,
      features: [L("Premium Superior accommodation"), L("Spacious room with elegant interiors"), L("Private Balcony"), L("Modern attached bathroom"), L("Workspace & wardrobe")],
    },
  ],

  // ── Meals ─────────────────────────────────────────────────────────────────
  meals: [
    { mealType: L("Morning Herbal Tea"), description: L("Freshly prepared herbal tea served at the Shala to start the day."), isVegan: true, isGlutenFree: true },
    { mealType: L("Healthy Breakfast"), description: L("Nutritious vegetarian choices to refuel after morning practice."), isVegan: true, isGlutenFree: false },
    { mealType: L("Fresh Fruit Brunch"), description: L("Seasonal tropical fruits including Pineapple, Watermelon, Papaya, etc."), isVegan: true, isGlutenFree: true },
    { mealType: L("Traditional Vegetarian Lunch"), description: L("Freshly prepared authentic Kerala vegetarian dishes."), isVegan: true, isGlutenFree: false },
    { mealType: L("Wholesome Vegetarian Dinner"), description: L("A balanced vegetarian dinner menu inspired by traditional Indian cuisine."), isVegan: true, isGlutenFree: true },
    { mealType: L("Seasonal Fruits & Refreshments"), description: L("Complimentary tea & coffee station accessible throughout the day."), isVegan: true, isGlutenFree: true },
  ],

  // ── Yoga Program ──────────────────────────────────────────────────────────
  yogaStyle: L("Traditional Hatha & Vinyasa Yoga"),
  morningSession: L("06:00–08:00 AM"),
  eveningSession: L("07:30–09:00 PM"),
  meditation: L("Daily Guided Meditation"),
  pranayama: L("Guided breathing techniques (Nadi Shodhana, Kapalabhati)"),
  suitableFor: L("Beginners, intermediate, and experienced practitioners"),
  yogaCertificate: L("Participation Certificate of Completion"),
  yogaDescription: L("Yoga is at the heart of this retreat. Each day begins with an energizing morning practice and concludes with a calming evening session, allowing participants to cultivate strength, flexibility, balance, and inner peace."),

  // ── Teachers ──────────────────────────────────────────────────────────────
  teachers: [
    {
      name: "Experienced Indian Yoga Teachers",
      experience: "15+ Years",
      specialization: L("Hatha Yoga, Vinyasa Flow, Yoga Philosophy & Pranayama"),
      bio: L("All sessions are led by certified Indian yoga teachers who have dedicated many years to studying and teaching the traditional science of yoga. Their approach combines authentic yogic philosophy with compassionate guidance."),
    },
  ],

  // ── Ayurveda ──────────────────────────────────────────────────────────────
  ayurvedaTitle: L("Traditional Kerala Ayurvedic Wellness"),
  ayurvedaDescription: L("No wellness journey in Kerala is complete without experiencing the ancient healing science of Ayurveda. During your retreat, we can arrange professional consultations with qualified practitioners who will assess your Dosha and suggest personalized optional therapies."),
  ayurvedaTreatments: [
    {
      name: L("Ayurvedic Dosha Consultation"),
      description: L("Personalized consultation to assess body constitution and custom therapy recommendations."),
      isOptional: true,
      extraCost: 1500,
    },
    {
      name: L("Abhyanga Massage"),
      description: L("Rejuvenating full body warm herbal oil massage."),
      isOptional: true,
      extraCost: 2500,
    },
    {
      name: L("Stress-Relief Rejuvenation Treatment"),
      description: L("Traditional Ayurvedic therapy focused on deep relaxation and detoxification."),
      isOptional: true,
      extraCost: 3500,
    },
  ],

  // ── Pricing Rows ──────────────────────────────────────────────────────────
  pricingRows: [
    { roomCategory: L("Budget Room"), sharedPrice: 24999, privatePrice: 32999, availability: L("Available") },
    { roomCategory: L("Standard Room"), sharedPrice: 29999, privatePrice: 38999, availability: L("Available") },
    { roomCategory: L("Deluxe Room"), sharedPrice: 34999, privatePrice: 44999, availability: L("Available") },
    { roomCategory: L("Deluxe Room with Balcony"), sharedPrice: 39999, privatePrice: 49999, availability: L("Available") },
    { roomCategory: L("Superior Deluxe Room"), sharedPrice: 44999, privatePrice: 56999, availability: L("Available") },
  ],

  // ── Checklists ────────────────────────────────────────────────────────────
  inclusions: [
    L("10 nights comfortable accommodation at Villa Lemon properties in Varkala"),
    L("Four healthy vegetarian buffet meals daily including fruits and herbal tea"),
    L("30-hour Yoga Program with daily morning and evening classes"),
    L("Guided meditation, pranayama and yoga philosophy lectures"),
    L("Airport group transfers from/to Trivandrum International Airport"),
    L("Private transportation for all scheduled excursions"),
    L("All 6 listed sightseeing tours and cultural events"),
    L("Certificate of Completion signed by an Indian yoga teacher"),
    L("Daily housekeeping and local concierge assistance"),
    L("Complimentary high-speed Wi-Fi throughout your stay"),
  ],
  exclusions: [
    L("International or domestic airfare"),
    L("Visa fees (where applicable)"),
    L("Travel insurance (highly recommended)"),
    L("Ayurvedic consultations and optional treatments"),
    L("Personal expenses (laundry, shopping, additional food or beverages)"),
    L("Tips and gratuities for guides, drivers, therapists, and service staff"),
    L("Entrance fees to sightseeing attractions and excursion sites"),
    L("Expenses arising from unforeseen travel delays or illness"),
  ],
  thingsToBring: [
    L("Comfortable modest clothing suitable for yoga and temple visits"),
    L("Personal yoga mat (if preferred, mats are available at the Shala)"),
    L("Refillable water bottle"),
    L("Sunscreen, hat, and sunglasses"),
    L("Personal toiletries and prescription medicines"),
    L("Adaptor for plug points (Type D/G used in India)"),
  ],
  dressCode: [L("Comfortable modest clothing suitable for yoga. Shoulders and knees should be covered when visiting temples.")],
  requirements: [L("Basic physical fitness and willingness to participate in scheduled group sessions.")],
  whoShouldAvoid: [L("Guests with serious acute injuries should consult a doctor before joining.")],

  // ── FAQs ──────────────────────────────────────────────────────────────────
  faqs: [
    { question: L("Is this retreat beginner friendly?"), answer: L("Yes. All classes and excursions are suitable for beginners as well as intermediate practitioners.") },
    { question: L("Do you provide airport pickup?"), answer: L("Yes. Group airport transfers from Trivandrum International Airport are included in the price.") },
    { question: L("Are meals vegetarian?"), answer: L("Yes. Daily healthy vegetarian buffet meals (inspired by Kerala cuisine) are included.") },
    { question: L("Can I book a private room?"), answer: L("Yes. Private room upgrades are available for all categories (subject to availability).") },
  ],

  // ── Booking ───────────────────────────────────────────────────────────────
  deposit: L("A 30% deposit is required to confirm your booking and secure your room choice."),
  balancePayment: L("The full remaining balance is due 14 days before the retreat begins."),
  cancellation: L("Free cancellation is available up to 14 days before arrival. Cancellations made within 14 days are subject to fee details."),
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  bookingTerms: L("By booking, you agree to Villa Lemon's guidelines and cancellation policy."),

  // ── SEO ───────────────────────────────────────────────────────────────────
  metaTitle: L("11-Day Varkala Yoga, Spiritual & Nature Retreat | Villa Lemon"),
  metaDescription: L("Immerse in an 11-day Hatha & Vinyasa Yoga retreat in Varkala, Kerala. Includes yoga, meditation, Ayurvedic options, excursions & Kerala vegetarian cuisine. All levels welcome."),
  keywords: L("yoga retreat varkala, kerala spiritual retreat, 11 day yoga retreat, hatha yoga varkala, ayurveda vacation india"),
};

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("No MONGODB_URI in .env"); process.exit(1); }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  // Remove existing if any
  await Retreat.deleteOne({ slug: retreat.slug });
  console.log("🗑️  Cleared existing 11-day retreat with same slug (if any)");

  const doc = await Retreat.create(retreat);
  console.log("🌿 Retreat created successfully:", doc._id.toString());
  console.log("   Title:", doc.heroTitle.en);
  console.log("   Slug: ", doc.slug);

  await mongoose.disconnect();
  console.log("🔒 Disconnected. Done!");
  process.exit(0);
};

seed().catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
