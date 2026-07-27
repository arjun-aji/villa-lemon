import dotenv from "dotenv";
import mongoose from "mongoose";
import { Retreat } from "../models/Retreat";

dotenv.config();

const L = (en: string, de = "", fr = "", ru = "") => ({ en, de, fr, ru });

// ─── Retreat 1: 11-Day Varkala Retreat ────────────────────────────────────────

const retreat11Days = {
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

  heroTitle: L("Varkala Yoga, Spiritual & Nature Retreat (11 Days)"),
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

  highlights: [
    { icon: "Sun", title: L("Daily Yoga"), description: L("Daily morning and evening yoga sessions with experienced Indian yoga teachers.") },
    { icon: "Leaf", title: L("Meditation & Breathwork"), description: L("Guided meditation, pranayama, and yoga philosophy classes for inner balance.") },
    { icon: "Utensils", title: L("Nourishing Dining"), description: L("Healthy vegetarian breakfast, brunch, lunch, and dinner prepared with fresh local ingredients.") },
    { icon: "Home", title: L("Comfortable Accommodation"), description: L("Stay at one of our peaceful Villa Lemon properties, thoughtfully designed for rest.") },
    { icon: "Mountain", title: L("Nature Excursions"), description: L("Private transfers to Golden Island, Kaveri Elephant Park, and Jatayu Earth's Center.") },
    { icon: "Heart", title: L("Ayurvedic Rejuvenation"), description: L("Access to qualified Ayurvedic consultations and customized rejuvenation treatments.") },
  ],

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

  excursions: [
    { name: L("Spiritual Varkala Tour"), duration: L("2 Hours"), description: L("Guided visit to Janardanaswamy Temple, Sivagiri Ashram and Varkala Town."), included: true },
    { name: L("Golden Island Backwater Experience"), duration: L("2 Hours"), description: L("Tranquil boat ride through palm tree backwaters."), included: true },
    { name: L("Kaveri Elephant Park"), duration: L("2 Hours"), description: L("Wildlife care interaction and countryside scenery."), included: true },
    { name: L("Jatayu Earth's Center"), duration: L("4–5 Hours"), description: L("Hilltop cable car ride to view the largest bird sculpture."), included: true },
    { name: L("Kappil Beach & Kappil Lake"), duration: L("2–3 Hours"), description: L("Nature walk where backwaters meet the Arabian Sea."), included: true },
    { name: L("Special Cultural Experience – Saree & Bollywood Dance Party"), duration: L("2–3 Hours"), description: L("Traditional saree dressup and Bollywood dance party."), included: true },
  ],

  rooms: [
    { name: L("Budget Room"), occupancy: 2, sharedPrice: 24999, privatePrice: 32999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("AC"), L("Attached private bathroom"), L("Complimentary Wi-Fi")] },
    { name: L("Standard Room"), occupancy: 2, sharedPrice: 29999, privatePrice: 38999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("AC"), L("Attached bathroom with hot water"), L("Shared kitchen & dining")] },
    { name: L("Deluxe Room"), occupancy: 2, sharedPrice: 34999, privatePrice: 44999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("Spacious layout"), L("AC"), L("Attached bathroom with hot water")] },
    { name: L("Deluxe Room with Balcony"), occupancy: 2, sharedPrice: 39999, privatePrice: 49999, hasAC: true, hasBathroom: true, hasBalcony: true, hotWater: true, features: [L("Private Balcony"), L("AC"), L("Attached bathroom")] },
    { name: L("Superior Deluxe Room (Villa Lemon Inn)"), occupancy: 2, sharedPrice: 44999, privatePrice: 56999, hasAC: true, hasBathroom: true, hasBalcony: true, hasWorkspace: true, hotWater: true, features: [L("Premium room"), L("Spacious layouts"), L("Private Balcony")] },
  ],

  meals: [
    { mealType: L("Morning Herbal Tea"), description: L("Freshly prepared herbal tea served at the Shala to start the day."), isVegan: true, isGlutenFree: true },
    { mealType: L("Healthy Breakfast"), description: L("Nutritious vegetarian choices to refuel after morning practice."), isVegan: true, isGlutenFree: false },
    { mealType: L("Fresh Fruit Brunch"), description: L("Seasonal tropical fruits including Pineapple, Watermelon, Papaya, etc."), isVegan: true, isGlutenFree: true },
    { mealType: L("Traditional Vegetarian Lunch"), description: L("Freshly prepared authentic Kerala vegetarian dishes."), isVegan: true, isGlutenFree: false },
    { mealType: L("Wholesome Vegetarian Dinner"), description: L("A balanced vegetarian dinner menu inspired by traditional Indian cuisine."), isVegan: true, isGlutenFree: true },
  ],

  yogaStyle: L("Traditional Hatha & Vinyasa Yoga"),
  morningSession: L("06:00–08:00 AM"),
  eveningSession: L("07:30–09:00 PM"),
  meditation: L("Daily Guided Meditation"),
  pranayama: L("Guided breathing techniques (Nadi Shodhana, Kapalabhati)"),
  suitableFor: L("Beginners, intermediate, and experienced practitioners"),
  yogaCertificate: L("Participation Certificate of Completion"),
  yogaDescription: L("Yoga is at the heart of this retreat. Each day begins with an energizing morning practice and concludes with a calming evening session, allowing participants to cultivate strength, flexibility, balance, and inner peace."),

  teachers: [
    { name: "Experienced Indian Yoga Teachers", experience: "15+ Years", specialization: L("Hatha Yoga, Vinyasa Flow, Yoga Philosophy & Pranayama"), bio: L("All sessions are led by certified Indian yoga teachers who have dedicated many years to studying and teaching the traditional science of yoga.") },
  ],

  ayurvedaTitle: L("Traditional Kerala Ayurvedic Wellness"),
  ayurvedaDescription: L("No wellness journey in Kerala is complete without experiencing the ancient healing science of Ayurveda. During your retreat, we can arrange professional consultations and therapies."),
  ayurvedaTreatments: [
    { name: L("Abhyanga Massage"), description: L("Rejuvenating full body warm herbal oil massage."), isOptional: true, extraCost: 2500 },
  ],

  pricingRows: [
    { roomCategory: L("Budget Room"), sharedPrice: 24999, privatePrice: 32999, availability: L("Available") },
    { roomCategory: L("Standard Room"), sharedPrice: 29999, privatePrice: 38999, availability: L("Available") },
    { roomCategory: L("Deluxe Room"), sharedPrice: 34999, privatePrice: 44999, availability: L("Available") },
    { roomCategory: L("Deluxe Room with Balcony"), sharedPrice: 39999, privatePrice: 49999, availability: L("Available") },
    { roomCategory: L("Superior Deluxe Room"), sharedPrice: 44999, privatePrice: 56999, availability: L("Available") },
  ],

  inclusions: [
    L("10 nights comfortable accommodation at Villa Lemon properties in Varkala"),
    L("Four healthy vegetarian buffet meals daily including fruits and herbal tea"),
    L("30-hour Yoga Program with daily morning and evening classes"),
    L("Guided meditation, pranayama and yoga philosophy lectures"),
    L("Airport group transfers from/to Trivandrum International Airport"),
    L("Private transportation for all scheduled excursions"),
    L("All 6 listed sightseeing tours and cultural events"),
    L("Certificate of Completion signed by an Indian yoga teacher"),
  ],
  exclusions: [
    L("International or domestic airfare"),
    L("Visa fees (where applicable)"),
    L("Travel insurance (highly recommended)"),
    L("Ayurvedic consultations and optional treatments"),
  ],
  thingsToBring: [
    L("Comfortable modest clothing suitable for yoga"),
    L("Refillable water bottle"),
    L("Sunscreen, hat, and sunglasses"),
  ],
  dressCode: [L("Comfortable modest clothing suitable for yoga.")],
  requirements: [L("Basic physical fitness and willingness to participate.")],
  whoShouldAvoid: [L("Guests with serious acute injuries should consult a doctor before joining.")],

  faqs: [
    { question: L("Is this retreat beginner friendly?"), answer: L("Yes. All classes and excursions are suitable for beginners as well as intermediate practitioners.") },
  ],

  deposit: L("A 30% deposit is required to confirm your booking."),
  balancePayment: L("The remaining balance is due 14 days before the retreat begins."),
  cancellation: L("Free cancellation is available up to 14 days before arrival."),
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  bookingTerms: L("By booking, you agree to Villa Lemon's guidelines and cancellation policy."),

  metaTitle: L("11-Day Varkala Yoga, Spiritual & Nature Retreat | Villa Lemon"),
  metaDescription: L("Immerse in an 11-day Hatha & Vinyasa Yoga retreat in Varkala, Kerala. All levels welcome."),
  keywords: L("yoga retreat varkala, kerala spiritual retreat"),
};

// ─── Retreat 2: 8-Day Varkala Retreat ─────────────────────────────────────────

const retreat8Days = {
  slug: "varkala-yoga-retreat-8-days",
  days: 8,
  nights: 7,
  price: 19999,
  displayOrder: 2,
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

  heroTitle: L("Varkala Yoga, Spiritual & Nature Retreat (8 Days)"),
  heroSubtitle: L("Reconnect • Rejuvenate • Transform"),
  tagline: L("Experience the perfect blend of yoga, meditation, spirituality, culture, and nature in the beautiful coastal town of Varkala, Kerala. Designed for those with limited time."),
  shortDescription: L(
    "A condensed 8-day yoga retreat combining Hatha & Vinyasa sessions, local sightseeing, Kaveri Elephant Park, and our Saree & Bollywood Indian cultural celebration."
  ),
  fullDescription: L(
    "Experience the perfect blend of yoga, meditation, spirituality, culture, and nature in the beautiful coastal town of Varkala, Kerala. Designed for those with limited time, this retreat combines daily yoga sessions, healthy vegetarian cuisine, authentic cultural experiences, and carefully selected excursions, allowing you to experience the essence of Kerala in just eight days.\n\nWhether you are a beginner or an experienced practitioner, this retreat provides the ideal environment to relax, recharge, and deepen your yoga practice while exploring one of South India's most beautiful destinations."
  ),
  retreatOverview: L(
    "This 8 Days / 7 Nights Varkala Yoga, Spiritual & Nature Retreat is designed for travelers seeking a meaningful escape that combines yoga, wellness, culture, and nature. Through daily practice, nourishing food, authentic Kerala experiences, and heartfelt hospitality, you'll return home refreshed, inspired, and equipped with tools to continue your wellness journey long after the retreat ends."
  ),
  whyChoose: L(
    "• Daily morning and evening yoga sessions\n• Guided meditation and pranayama\n• Yoga philosophy and wellness classes\n• Seven nights accommodation at Villa Lemon properties\n• Four healthy vegetarian meals daily\n• Trivandrum airport transfers included\n• Private transportation during scheduled excursions\n• Guided local sightseeing in Varkala\n• Concierge service throughout your stay\n• Free time for beach walks, shopping and optional Ayurvedic treatments"
  ),
  whoIsItFor: L(
    "Perfect for travelers who have limited time but wish to experience authentic Indian yoga, meditation, nature, and cultural highlights in peaceful Kerala."
  ),
  bestTime: L(
    "Available throughout the year, with excellent weather from October to March."
  ),
  cta: L("Book Your 8-Day Retreat"),

  highlights: [
    { icon: "Sun", title: L("Yoga & Pranayama"), description: L("Daily morning and evening sessions led by traditional Indian teachers.") },
    { icon: "Leaf", title: L("Meditation & Philosophy"), description: L("Guided sessions introducing timeless mindfulness principles.") },
    { icon: "Utensils", title: L("Communal Healthy Dining"), description: L("Four wholesome vegetarian meals served daily in a warm atmosphere.") },
    { icon: "Mountain", title: L("Sightseeing & Tours"), description: L("Excursions to temples, backwaters, Jatayu sculpture, and elephant park.") },
    { icon: "Heart", title: L("Wellness Consultations"), description: L("Optional Ayurvedic wellness treatments and massages.") },
  ],

  dailySchedule: [
    { time: "06:00 – 08:00 AM", activity: L("Morning Yoga & Meditation"), description: L("Authentic yoga followed by guided reflection.") },
    { time: "08:15 AM", activity: L("Herbal Tea"), description: L("Hot herbal tea served to stimulate digestion.") },
    { time: "09:00 AM", activity: L("Healthy Breakfast"), description: L("Wholesome vegetarian breakfast selection.") },
    { time: "10:00 AM – 01:00 PM", activity: L("Excursion / Free Time"), description: L("Time for exploring backwaters, temples, or relaxing.") },
    { time: "11:00 AM", activity: L("Fresh Fruit Brunch"), description: L("Nutritious seasonal tropical fruits brunch.") },
    { time: "01:00 PM", activity: L("Vegetarian Lunch"), description: L("Traditional Kerala vegetarian lunch.") },
    { time: "02:00 – 03:30 PM", activity: L("Yoga Philosophy"), description: L("Philosophy and meditation lectures on selected days.") },
    { time: "03:30 – 05:00 PM", activity: L("Beach / Relaxation"), description: L("Optional Ayurvedic massage or swimming at the beach.") },
    { time: "05:00 PM", activity: L("Healthy Dinner"), description: L("Freshly prepared vegetarian dinner.") },
    { time: "07:30 – 09:00 PM", activity: L("Evening Yoga & Meditation"), description: L("Gentle restorative sessions to release tension.") },
  ],

  curriculum: [
    {
      dayNumber: 1,
      dayTitle: L("Arrival & Welcome"),
      description: L("Arrive at Trivandrum International Airport or Varkala Railway Station and enjoy a comfortable transfer to Villa Lemon. After check-in, relax and settle into your accommodation before meeting your teachers and fellow participants during the welcome orientation. The evening includes a gentle restorative yoga session followed by a healthy vegetarian dinner."),
      learningOutcome: L("Transition into the retreat space and release travel fatigue."),
      topics: [L("Airport Transfer"), L("Welcome Drink"), L("Orientation"), L("Gentle Yoga"), L("Healthy Dinner")],
    },
    {
      dayNumber: 2,
      dayTitle: L("Spiritual Varkala"),
      description: L("Begin with morning yoga before discovering the spiritual heritage of Varkala. Visit the ancient Janardanaswamy Temple, Sivagiri Ashram, Varkala Town, and the vibrant local markets. Return in the evening for yoga and meditation."),
      learningOutcome: L("Connect with the spiritual history of the location."),
      topics: [L("Morning Yoga"), L("Janardanaswamy Temple"), L("Sivagiri Ashram"), L("Local Market Exploration"), L("Evening Yoga")],
    },
    {
      dayNumber: 3,
      dayTitle: L("Golden Island Backwater Experience"),
      description: L("After yoga, travel to Golden Island and experience Kerala's peaceful backwaters. Enjoy village walk, coconut plantations, traditional village life, nature photography, and relaxing backwater scenery. Return to the villa for evening yoga."),
      learningOutcome: L("Appreciate the slow-paced beauty of backwater nature."),
      topics: [L("Golden Island Boat Ride"), L("Village Walk"), L("Coconut Plantations"), L("Nature Photography"), L("Evening Yoga")],
    },
    {
      dayNumber: 4,
      dayTitle: L("Jatayu Earth's Center"),
      description: L("Today's excursion takes you to Kerala's famous Jatayu Earth's Center. Experience a scenic cable car ride, view the world's largest bird sculpture, and explore cultural and mythological attractions. Return for dinner and meditation."),
      learningOutcome: L("Witness a remarkable monument of mythological art and sculpture."),
      topics: [L("Cable Car Ride"), L("Jatayu Bird Sculpture"), L("Panoramic Viewpoints"), L("Ramayana Cultural Attraction"), L("Evening Meditation")],
    },
    {
      dayNumber: 5,
      dayTitle: L("Kaveri Elephant Park & Wellness"),
      description: L("Visit Kaveri Elephant Park for a memorable wildlife experience. Enjoy elephant interaction, learn about elephant conservation, and country scenery. The afternoon is free for an optional Ayurvedic massage, beach walk, or shopping before evening yoga."),
      learningOutcome: L("Interact with gentle elephants in a countryside environment."),
      topics: [L("Kaveri Elephant Park"), L("Elephant Conservation"), L("Free Time / Massage Option"), L("Varkala Beach Walk"), L("Evening Yoga")],
    },
    {
      dayNumber: 6,
      dayTitle: L("Kappil Beach & Lake"),
      description: L("Spend the morning exploring one of Kerala's most beautiful coastal landscapes. Activities include Kappil Beach, Kappil Lake, nature walk, sunset views, and beach relaxation. Evening meditation concludes the day."),
      learningOutcome: L("Connect with spectacular beach sunsets and nature."),
      topics: [L("Kappil Beach & Lake Walk"), L("Sunset Views"), L("Beach Relaxation"), L("Nature Photography"), L("Evening Meditation")],
    },
    {
      dayNumber: 7,
      dayTitle: L("Integration & Indian Cultural Evening"),
      description: L("Your final full day combines yoga, reflection, and celebration. Morning includes an extended yoga session and guided meditation. The evening features our Special Saree & Bollywood Cultural Experience, where guests enjoy traditional Indian attire, music, dance, and a festive vegetarian dinner. Finish the evening with a farewell gathering and certificate presentation."),
      learningOutcome: L("Celebrate community, music, and complete the yoga program."),
      topics: [L("Extended Yoga & Sharing"), L("Traditional Saree Experience"), L("Bollywood Dance Party"), L("Festive Dinner"), L("Certificate Presentation")],
    },
    {
      dayNumber: 8,
      dayTitle: L("Departure"),
      description: L("Enjoy one final meditation and breakfast before checking out. Our team will transfer you to Trivandrum International Airport or Varkala Railway Station. Leave Varkala refreshed and carrying unforgettable memories of your wellness journey."),
      learningOutcome: L("Conclude the retreat with gratitude and plan transition back home."),
      topics: [L("Final Meditation"), L("Breakfast"), L("Airport/Station Transfer"), L("Departure")],
    },
  ],

  excursions: [
    { name: L("Spiritual Varkala Tour"), duration: L("2 Hours"), description: L("Guided visit to Janardanaswamy Temple and Sivagiri Ashram."), included: true },
    { name: L("Golden Island Backwater Experience"), duration: L("2 Hours"), description: L("Tranquil boat ride through palm tree backwaters."), included: true },
    { name: L("Kaveri Elephant Park"), duration: L("2 Hours"), description: L("Wildlife care interaction and countryside scenery."), included: true },
    { name: L("Jatayu Earth's Center"), duration: L("4–5 Hours"), description: L("Hilltop cable car ride to view the largest bird sculpture."), included: true },
    { name: L("Kappil Beach & Kappil Lake"), duration: L("2–3 Hours"), description: L("Nature walk where backwaters meet the Arabian Sea."), included: true },
    { name: L("Special Saree & Bollywood Cultural Evening"), duration: L("2–3 Hours"), description: L("Traditional saree dressup and Bollywood dance party."), included: true },
  ],

  rooms: [
    { name: L("Budget Room"), occupancy: 2, sharedPrice: 19999, privatePrice: 26999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("AC"), L("Attached private bathroom"), L("Complimentary Wi-Fi")] },
    { name: L("Standard Room"), occupancy: 2, sharedPrice: 24999, privatePrice: 32999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("AC"), L("Attached bathroom with hot water"), L("Shared kitchen & dining")] },
    { name: L("Deluxe Room"), occupancy: 2, sharedPrice: 29999, privatePrice: 38999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("Spacious layout"), L("AC"), L("Attached bathroom with hot water")] },
    { name: L("Deluxe Room with Balcony"), occupancy: 2, sharedPrice: 34999, privatePrice: 44999, hasAC: true, hasBathroom: true, hasBalcony: true, hotWater: true, features: [L("Private Balcony"), L("AC"), L("Attached bathroom")] },
    { name: L("Superior Deluxe Room (Villa Lemon Inn)"), occupancy: 2, sharedPrice: 39999, privatePrice: 49999, hasAC: true, hasBathroom: true, hasBalcony: true, hasWorkspace: true, hotWater: true, features: [L("Premium room"), L("Spacious layouts"), L("Private Balcony")] },
  ],

  meals: [
    { mealType: L("Morning Herbal Tea"), description: L("Freshly prepared herbal tea served at the Shala to start the day."), isVegan: true, isGlutenFree: true },
    { mealType: L("Healthy Breakfast"), description: L("Nutritious vegetarian choices to refuel after morning practice."), isVegan: true, isGlutenFree: false },
    { mealType: L("Fresh Fruit Brunch"), description: L("Seasonal tropical fruits including Pineapple, Watermelon, Papaya, etc."), isVegan: true, isGlutenFree: true },
    { mealType: L("Traditional Vegetarian Lunch"), description: L("Freshly prepared authentic Kerala vegetarian dishes."), isVegan: true, isGlutenFree: false },
    { mealType: L("Wholesome Vegetarian Dinner"), description: L("A balanced vegetarian dinner menu inspired by traditional Indian cuisine."), isVegan: true, isGlutenFree: true },
  ],

  yogaStyle: L("Traditional Hatha & Vinyasa Yoga"),
  morningSession: L("06:00–08:00 AM"),
  eveningSession: L("07:30–09:00 PM"),
  meditation: L("Daily Guided Meditation"),
  pranayama: L("Guided breathing techniques (Nadi Shodhana, Kapalabhati)"),
  suitableFor: L("Beginners, intermediate, and experienced practitioners"),
  yogaCertificate: L("Participation Certificate of Completion"),
  yogaDescription: L("Yoga is at the heart of this retreat. Each day begins with an energizing morning practice and concludes with a calming evening session, allowing participants to cultivate strength, flexibility, balance, and inner peace."),

  teachers: [
    { name: "Experienced Indian Yoga Teachers", experience: "15+ Years", specialization: L("Hatha Yoga, Vinyasa Flow, Yoga Philosophy & Pranayama"), bio: L("All sessions are led by certified Indian yoga teachers who have dedicated many years to studying and teaching the traditional science of yoga.") },
  ],

  ayurvedaTitle: L("Traditional Kerala Ayurvedic Wellness"),
  ayurvedaDescription: L("No wellness journey in Kerala is complete without experiencing the ancient healing science of Ayurveda. During your retreat, we can arrange professional consultations and therapies."),
  ayurvedaTreatments: [
    { name: L("Abhyanga Massage"), description: L("Rejuvenating full body warm herbal oil massage."), isOptional: true, extraCost: 2500 },
  ],

  pricingRows: [
    { roomCategory: L("Budget Room"), sharedPrice: 19999, privatePrice: 26999, availability: L("Available") },
    { roomCategory: L("Standard Room"), sharedPrice: 24999, privatePrice: 32999, availability: L("Available") },
    { roomCategory: L("Deluxe Room"), sharedPrice: 29999, privatePrice: 38999, availability: L("Available") },
    { roomCategory: L("Deluxe Room with Balcony"), sharedPrice: 34999, privatePrice: 44999, availability: L("Available") },
    { roomCategory: L("Superior Deluxe Room"), sharedPrice: 39999, privatePrice: 49999, availability: L("Available") },
  ],

  inclusions: [
    L("7 nights comfortable accommodation at Villa Lemon properties in Varkala"),
    L("Four healthy vegetarian buffet meals daily including fruits and herbal tea"),
    L("30-hour Yoga Program with daily morning and evening classes"),
    L("Guided meditation, pranayama and yoga philosophy lectures"),
    L("Airport group transfers from/to Trivandrum International Airport"),
    L("Private transportation for all scheduled excursions"),
    L("All listed excursions and cultural events"),
    L("Certificate of Completion signed by an Indian yoga teacher"),
  ],
  exclusions: [
    L("International or domestic airfare"),
    L("Visa fees (where applicable)"),
    L("Travel insurance (highly recommended)"),
    L("Ayurvedic consultations and optional treatments"),
  ],
  thingsToBring: [
    L("Comfortable modest clothing suitable for yoga"),
    L("Refillable water bottle"),
    L("Sunscreen, hat, and sunglasses"),
  ],
  dressCode: [L("Comfortable modest clothing suitable for yoga.")],
  requirements: [L("Basic physical fitness and willingness to participate.")],
  whoShouldAvoid: [L("Guests with serious acute injuries should consult a doctor before joining.")],

  faqs: [
    { question: L("Is this retreat beginner friendly?"), answer: L("Yes. All classes and excursions are suitable for beginners as well as intermediate practitioners.") },
  ],

  deposit: L("A 30% deposit is required to confirm your booking."),
  balancePayment: L("The remaining balance is due 14 days before the retreat begins."),
  cancellation: L("Free cancellation is available up to 14 days before arrival."),
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  bookingTerms: L("By booking, you agree to Villa Lemon's guidelines and cancellation policy."),

  metaTitle: L("8-Day Varkala Yoga, Spiritual & Nature Retreat | Villa Lemon"),
  metaDescription: L("Immerse in an 8-day Hatha & Vinyasa Yoga retreat in Varkala, Kerala. All levels welcome."),
  keywords: L("yoga retreat varkala, kerala spiritual retreat"),
};

// ─── Retreat 3: 4-Day Varkala Retreat ─────────────────────────────────────────

const retreat4Days = {
  slug: "varkala-yoga-wellness-retreat-4-days",
  days: 4,
  nights: 3,
  price: 14999, // reasonable default price for 4 days
  displayOrder: 3,
  minAge: 18,
  maxCapacity: 20,
  yogaHours: 12, // approx 12 hours of classes
  status: "published",
  featured: true,
  certificate: true,
  bookingOpen: true,

  location: L("Varkala, Kerala, India"),
  difficulty: L("Beginner Friendly"),
  yogaLevel: L("Beginner to Advanced"),
  language: L("English"),
  groupSize: L("Small groups for a personalized experience"),
  accommodationType: L("Shared Twin Room or Private Room"),

  heroTitle: L("Varkala Yoga & Wellness Retreat (4 Days)"),
  heroSubtitle: L("Relax • Rejuvenate • Reconnect"),
  tagline: L("Escape to the peaceful coastal town of Varkala, Kerala, for a rejuvenating 4 Days / 3 Nights Yoga & Wellness Retreat. Designed for those seeking a short but meaningful break."),
  shortDescription: L(
    "Designed for a short but meaningful break, combining daily yoga & meditation, healthy vegetarian cuisine, comfortable stay, and a Golden Island backwater excursion."
  ),
  fullDescription: L(
    "Escape to the peaceful coastal town of Varkala, Kerala, for a rejuvenating 4 Days / 3 Nights Yoga & Wellness Retreat. Designed for those seeking a short but meaningful break, this retreat combines daily yoga and meditation, healthy vegetarian cuisine, comfortable accommodation, and a memorable backwater excursion to Golden Island.\n\nWhether you are new to yoga or an experienced practitioner, this retreat offers the perfect opportunity to relax, recharge, and experience the authentic beauty of Kerala."
  ),
  retreatOverview: L(
    "Our 4 Days / 3 Nights Varkala Yoga & Wellness Retreat is the perfect introduction to yoga, mindfulness, and Kerala's natural beauty. Through daily yoga, nourishing vegetarian cuisine, peaceful accommodation, and the unforgettable Golden Island backwater experience, you'll return home feeling refreshed, balanced, and inspired."
  ),
  whyChoose: L(
    "• Daily Yoga & Meditation\n• Healthy Vegetarian Cuisine\n• Comfortable Villa Accommodation\n• Authentic Kerala Hospitality\n• Peaceful Tropical Surroundings\n• Golden Island Backwater Experience\n• Small Group Experience\n• Free Time for Beach, Shopping & Relaxation\n• Optional Ayurvedic Consultations & Treatments"
  ),
  whoIsItFor: L(
    "Ideal for guests looking for a quick weekend wellness getaway, a short introduction to mindfulness, or a relaxing stay in a tranquil beach setting."
  ),
  bestTime: L(
    "Year-round availability, best enjoyed from October to March."
  ),
  cta: L("Book Your 4-Day Retreat"),

  highlights: [
    { icon: "Sun", title: L("Yoga & Meditation"), description: L("Daily morning and evening sessions led by traditional teachers.") },
    { icon: "Leaf", title: L("Ayurvedic consultations"), description: L("Optional Ayurvedic massage and herbal oil treatments.") },
    { icon: "Utensils", title: L("Vegetarian Recipes"), description: L("Four healthy communal vegetarian meals served fresh daily.") },
    { icon: "Mountain", title: L("Backwater Excursion"), description: L("A guided boat trip to the serene Golden Island backwaters.") },
  ],

  dailySchedule: [
    { time: "06:00 – 08:00 AM", activity: L("Morning Yoga & Meditation"), description: L("Rise and shine with traditional yoga postures and breathing.") },
    { time: "08:15 AM", activity: L("Herbal Tea"), description: L("Hot herbal tea served to stimulate digestion.") },
    { time: "09:00 AM", activity: L("Healthy Breakfast"), description: L("Nourishing vegetarian breakfast selection.") },
    { time: "10:00 AM – 01:00 PM", activity: L("Excursion / Free Time"), description: L("Golden Island excursion or relaxing beach walks.") },
    { time: "11:00 AM", activity: L("Fresh Fruit Brunch"), description: L("Seasonal tropical fruit salad brunch.") },
    { time: "01:00 PM", activity: L("Vegetarian Lunch"), description: L("Traditional Kerala vegetarian lunch.") },
    { time: "02:00 – 03:30 PM", activity: L("Meditation / Yoga Philosophy"), description: L("Lectures on yogic lifestyle and breath awareness.") },
    { time: "03:30 – 05:00 PM", activity: L("Beach / Relaxation / Massage"), description: L("Free time for swimming or booking optional therapies.") },
    { time: "05:00 PM", activity: L("Healthy Dinner"), description: L("Light and wholesome dinner menu.") },
    { time: "07:30 – 09:00 PM", activity: L("Evening Yoga"), description: L("Gentle evening yoga class to restore and stretch.") },
  ],

  curriculum: [
    {
      dayNumber: 1,
      dayTitle: L("Arrival & Welcome"),
      description: L("Upon arrival at Trivandrum International Airport or Varkala Railway Station, you will be welcomed by our team and transferred to Villa Lemon. After check-in, relax in the peaceful surroundings before meeting your yoga teachers and fellow participants during the welcome session. The evening includes a gentle yoga class followed by a healthy vegetarian dinner."),
      learningOutcome: L("Arrive comfortably, meet teachers, and set your wellness intentions."),
      topics: [L("Airport Transfer"), L("Welcome Drink"), L("Check-in"), L("Orientation"), L("Gentle Yoga"), L("Healthy Dinner")],
    },
    {
      dayNumber: 2,
      dayTitle: L("Golden Island Backwater Experience"),
      description: L("Start your day with sunrise yoga and meditation before travelling to the beautiful Golden Island. Enjoy one of Kerala's most peaceful backwater destinations where you'll experience traditional village life, coconut plantations, scenic backwaters, a nature walk, local culture, and beautiful photography opportunities. Return to the villa for relaxation before your evening yoga and meditation session."),
      learningOutcome: L("Explore Kerala's rustic backwater village landscapes."),
      topics: [L("Sunrise Yoga"), L("Golden Island Visit"), L("Traditional Village Life"), L("Coconut Plantations"), L("Nature Walk & Photos"), L("Evening Yoga")],
    },
    {
      dayNumber: 3,
      dayTitle: L("Wellness & Beach Day"),
      description: L("Following your morning yoga practice, enjoy a relaxing day at your own pace. You may choose to walk along Varkala Beach, visit the famous Varkala Cliff, enjoy an Ayurvedic Massage, explore local shops & cafés, relax at the villa, or join an optional meditation session. The evening concludes with an extended yoga class and a farewell dinner celebrating your retreat experience."),
      learningOutcome: L("Deepen physical relaxation and integrate your yoga practice."),
      topics: [L("Morning Yoga"), L("Varkala Cliff Walk"), L("Ayurvedic Massage Option"), L("Boutique Shops & Cafés"), L("Extended Yoga"), L("Farewell Dinner")],
    },
    {
      dayNumber: 4,
      dayTitle: L("Departure"),
      description: L("Begin your final morning with meditation and a gentle yoga session. After breakfast, enjoy some free time before your transfer to Trivandrum International Airport or Varkala Railway Station. Leave Varkala feeling refreshed, relaxed, and inspired to continue your wellness journey."),
      learningOutcome: L("Wrap up with renewed focus and transition back with peace."),
      topics: [L("Morning Meditation"), L("Gentle Yoga"), L("Breakfast"), L("Free Time"), L("Airport/Station Transfer")],
    },
  ],

  excursions: [
    { name: L("Golden Island Backwater Experience"), duration: L("2 Hours"), description: L("Scenic boat tour through Kerala's backwater channels and village visits."), included: true },
  ],

  rooms: [
    { name: L("Budget Room"), occupancy: 2, sharedPrice: 14999, privatePrice: 19999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("AC"), L("Attached private bathroom"), L("Complimentary Wi-Fi"), L("Comfortable Beds"), L("Daily Housekeeping")] },
    { name: L("Standard Room"), occupancy: 2, sharedPrice: 17999, privatePrice: 24999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("AC"), L("Attached bathroom with hot water"), L("Shared kitchen & dining"), L("Complimentary Wi-Fi")] },
    { name: L("Deluxe Room"), occupancy: 2, sharedPrice: 20999, privatePrice: 29999, hasAC: true, hasBathroom: true, hotWater: true, features: [L("Spacious & Modern layout"), L("AC"), L("Attached bathroom with hot water"), L("Comfortable seating area")] },
    { name: L("Deluxe Room with Balcony"), occupancy: 2, sharedPrice: 23999, privatePrice: 34999, hasAC: true, hasBathroom: true, hasBalcony: true, hotWater: true, features: [L("Private Balcony"), L("AC"), L("Attached bathroom with hot water")] },
    { name: L("Superior Deluxe Room (Villa Lemon Inn)"), occupancy: 2, sharedPrice: 26999, privatePrice: 39999, hasAC: true, hasBathroom: true, hasBalcony: true, hasWorkspace: true, hotWater: true, features: [L("Main Activity Hub"), L("Spacious room with elegant interiors"), L("Private Balcony")] },
  ],

  meals: [
    { mealType: L("Morning Herbal Tea"), description: L("Nourishing hot herbal tea to wake up the senses."), isVegan: true, isGlutenFree: true },
    { mealType: L("Healthy Breakfast"), description: L("Freshly prepared vegetarian breakfast choices."), isVegan: true, isGlutenFree: false },
    { mealType: L("Fresh Fruit Brunch"), description: L("Brunch of seasonal local fruits including pineapple, papaya, watermelon."), isVegan: true, isGlutenFree: true },
    { mealType: L("Vegetarian Lunch"), description: L("Fresh vegetarian recipes served hot daily."), isVegan: true, isGlutenFree: false },
    { mealType: L("Healthy Dinner"), description: L("Wholesome vegetarian dinner options to promote sleep."), isVegan: true, isGlutenFree: true },
  ],

  yogaStyle: L("Traditional Hatha & Vinyasa Yoga"),
  morningSession: L("06:00–08:00 AM"),
  eveningSession: L("07:30–09:00 PM"),
  meditation: L("Guided Meditation & Pranayama"),
  pranayama: L("Nadi Shodhana, Anulom Vilom"),
  suitableFor: L("Beginners and experienced practitioners alike"),
  yogaCertificate: L("Participation Certificate"),
  yogaDescription: L("Each day begins with energizing yoga and ends with relaxing evening practice, guided by experienced instructors."),

  teachers: [
    { name: "Experienced Indian Yoga Teachers", experience: "10+ Years", specialization: L("Hatha, Vinyasa, Pranayama & Meditation"), bio: L("All sessions are led by experienced Indian yoga teachers focusing on safe alignment and breathing.") },
  ],

  ayurvedaTitle: L("Ayurvedic Wellness Treatments"),
  ayurvedaDescription: L("Enhance your retreat with an optional Ayurvedic consultation and treatments. Professional practitioners can recommend personalized stress relief and rejuvenation programs."),
  ayurvedaTreatments: [
    { name: L("Abhyanga Massage"), description: L("Full body massage with warm herbal oils."), isOptional: true, extraCost: 2500 },
  ],

  pricingRows: [
    { roomCategory: L("Budget Room"), sharedPrice: 14999, privatePrice: 19999, availability: L("Available") },
    { roomCategory: L("Standard Room"), sharedPrice: 17999, privatePrice: 24999, availability: L("Available") },
    { roomCategory: L("Deluxe Room"), sharedPrice: 20999, privatePrice: 29999, availability: L("Available") },
    { roomCategory: L("Deluxe Room with Balcony"), sharedPrice: 23999, privatePrice: 34999, availability: L("Available") },
    { roomCategory: L("Superior Deluxe Room"), sharedPrice: 26999, privatePrice: 39999, availability: L("Available") },
  ],

  inclusions: [
    L("3 Nights comfortable villa accommodation at Villa Lemon properties in Varkala"),
    L("Four healthy vegetarian meals daily including brunch fruits and herbal tea"),
    L("Daily morning & evening yoga sessions"),
    L("Guided meditation & yoga philosophy sessions"),
    L("Golden Island Backwater boat excursion"),
    L("Airport transfers (Trivandrum Airport/Varkala Station)"),
    L("Private transportation during excursions"),
    L("Concierge service and friendly team support"),
    L("Complimentary high-speed Wi-Fi"),
    L("Daily housekeeping"),
  ],
  exclusions: [
    L("International or Domestic Flights"),
    L("Visa Fees"),
    L("Travel Insurance"),
    L("Ayurvedic Treatments and Massages"),
    L("Personal Expenses (laundry, additional shopping)"),
    L("Optional Activities and sightseeing entrance fees"),
    L("Tips & Gratuities"),
  ],
  thingsToBring: [
    L("Comfortable modest clothing suitable for yoga"),
    L("Personal water bottle"),
    L("Sunscreen, hat, and sunglasses"),
  ],
  dressCode: [L("Comfortable modest clothing suitable for yoga.")],
  requirements: [L("Openness to yoga practice and basic physical fitness.")],
  whoShouldAvoid: [L("Guests with acute health conditions should seek medical advice first.")],

  faqs: [
    { question: L("Is this short retreat suitable for beginners?"), answer: L("Yes, the program is designed for all levels from beginner to advanced.") },
  ],

  deposit: L("A 30% deposit is required to confirm your booking."),
  balancePayment: L("The remaining balance is due 14 days before the retreat begins."),
  cancellation: L("Free cancellation is available up to 14 days before arrival."),
  checkIn: "12:00 PM",
  checkOut: "11:00 AM",
  bookingTerms: L("By booking, you agree to Villa Lemon's guidelines and cancellation policy."),

  metaTitle: L("4-Day Varkala Yoga & Wellness Retreat | Villa Lemon"),
  metaDescription: L("Recharge with a 4-day Hatha & Vinyasa Yoga and wellness retreat in Varkala, Kerala. Includes yoga, vegetarian meals, and a backwater boat ride."),
  keywords: L("yoga retreat varkala, 4 day wellness retreat, kerala yoga weekend"),
};

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("No MONGODB_URI in .env"); process.exit(1); }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  // Remove existing
  await Retreat.deleteOne({ slug: retreat11Days.slug });
  await Retreat.deleteOne({ slug: retreat8Days.slug });
  await Retreat.deleteOne({ slug: retreat4Days.slug });
  console.log("🗑️  Cleared existing retreats with same slugs (if any)");

  const doc1 = await Retreat.create(retreat11Days);
  console.log("🌿 Retreat 1 created (11 Days):", doc1._id.toString());
  
  const doc2 = await Retreat.create(retreat8Days);
  console.log("🌿 Retreat 2 created (8 Days):", doc2._id.toString());

  const doc3 = await Retreat.create(retreat4Days);
  console.log("🌿 Retreat 3 created (4 Days):", doc3._id.toString());

  await mongoose.disconnect();
  console.log("🔒 Disconnected. Done!");
  process.exit(0);
};

seed().catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
