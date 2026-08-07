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

    const targetSlugs = ["jatayu-earth-center-tour", "varkala-temple-ashram-tour", "golden-island-canoe-boating"];
    console.log(`🗑️  Cleaning existing package items with slugs: ${targetSlugs.join(", ")}`);
    await PackageItem.deleteMany({ slug: { $in: targetSlugs } });

    console.log("🌿 Seeding Package 4: Jatayu Earth Center Tour...");
    const jatayuTour = new PackageItem({
      packageCategory: ["varkalaSightseeing"],
      slug: "jatayu-earth-center-tour",
      price: 3500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      duration: local("7 Hours"),
      travelTime: local("1 to 1.5 Hours Each Way"),
      entryFee: local("Not Included (Cable car + entry ticket required)"),
      optionalCharges: local("Adventure activities priced separately at the park"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Chadayamangalam, Kerala, India"),

      title: local("Jatayu Earth Center Tour from Varkala"),
      tagline: local("Visit the World's Largest Bird Sculpture and Kerala's Premier Adventure Destination"),
      shortDescription: local(
        "Discover one of Kerala's most iconic attractions with our Jatayu Earth Center Tour from Varkala. Jatayu Earth Center is home to the world's largest bird sculpture, inspired by the legendary eagle Jatayu from the Indian epic Ramayana."
      ),
      aboutText: local(
        "Discover one of Kerala's most iconic attractions with our Jatayu Earth Center Tour from Varkala. Located amidst the scenic hills of Chadayamangalam, Jatayu Earth Center is home to the world's largest bird sculpture, inspired by the legendary eagle Jatayu from the Indian epic Ramayana. Combining mythology, nature, adventure, and breathtaking panoramic views, this destination offers an unforgettable experience for visitors of all ages.\n\nJust a comfortable drive from Varkala, the Jatayu Earth Center is much more than a sightseeing destination. Guests can enjoy a thrilling cable car ride to the hilltop, admire the magnificent sculpture, explore interactive exhibits, walk through beautifully landscaped surroundings, and experience exciting adventure activities such as ziplining, rock climbing, archery, and more (activities subject to availability).\n\nWhether you're travelling as a couple, with family, or in a group, this tour offers the perfect blend of history, culture, nature, and adventure. From the summit, visitors are rewarded with spectacular panoramic views of Kerala's lush countryside, making it one of the most photographed attractions in South India."
      ),
      tourOverview: local(
        "Your journey begins with pickup from Villa Lemon or your accommodation in Varkala. Enjoy a scenic drive through Kerala's countryside before arriving at Jatayu Earth Center. Take the cable car to the summit and marvel at the impressive Jatayu sculpture, symbolizing courage, sacrifice, and protection. Spend time exploring the hilltop, enjoying breathtaking viewpoints, learning about the mythology behind the monument, and participating in optional adventure activities. After exploring the park, relax and enjoy refreshments before returning comfortably to Varkala."
      ),
      bestTime: local("Morning (Year Round)"),
      dressCode: local("Comfortable casual clothing & walking shoes"),
      cta: local("Book Jatayu Tour"),

      highlights: [
        { icon: "compass", label: local("Visit the world's largest bird sculpture") },
        { icon: "compass", label: local("Scenic cable car ride to the hilltop") },
        { icon: "compass", label: local("Explore the legendary story of Jatayu from the Ramayana") },
        { icon: "compass", label: local("Spectacular panoramic views of Kerala") },
        { icon: "compass", label: local("Adventure activities (optional)") },
        { icon: "compass", label: local("Beautiful gardens and walking trails") },
        { icon: "compass", label: local("Excellent photography opportunities") },
        { icon: "compass", label: local("Ideal for families, couples, and adventure lovers") },
      ],

      whyGuestsLoveUs: [
        {
          icon: "star",
          title: local("Mitigation & Comfort"),
          desc: local("Private comfortable AC transportation and hassle-free pickup/drop directly from your villa."),
        },
        {
          icon: "star",
          title: local("Flexible Sightseeing"),
          desc: local("Stop for lunch, pictures, and refreshments at your convenience along the scenic route."),
        },
      ],

      quickFacts: [
        { key: local("Distance"), value: local("40 km from Varkala") },
        { key: local("Travel Time"), value: local("1 to 1.5 hours each way") },
        { key: local("Key Highlight"), value: local("World's largest bird sculpture") },
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Experienced local driver"),
        local("Flexible sightseeing itinerary"),
        local("Drinking water"),
      ],

      exclusions: [
        local("Entry tickets"),
        local("Cable car tickets"),
        local("Adventure activity charges"),
        local("Meals and refreshments"),
        local("Personal expenses"),
      ],

      thingsToBring: [
        local("Sun protection (hat, sunglasses, sunscreen)"),
        local("Comfortable walking shoes"),
        local("Camera for photography"),
      ],

      nearbyAttractions: [
        { name: local("Kappil Beach & Lake"), distance: local("35 km") },
        { name: local("Ponmudi Hill Station"), distance: local("50 km") },
        { name: local("Varkala Cliff"), distance: local("40 km") },
        { name: local("Munroe Island"), distance: local("45 km") },
        { name: local("Trivandrum City Tour"), distance: local("55 km") },
      ],

      faqs: [
        {
          question: local("How far is Jatayu Earth Center from Varkala?"),
          answer: local("The attraction is approximately 40 km from Varkala, with a travel time of about 1 to 1.5 hours, depending on traffic."),
        },
        {
          question: local("Is the cable car included?"),
          answer: local("No. Cable car and entry tickets are not included unless specifically mentioned in your booking."),
        },
        {
          question: local("Are adventure activities compulsory?"),
          answer: local("No. All adventure activities are optional and can be booked separately at the park."),
        },
        {
          question: local("Is the tour suitable for children and senior citizens?"),
          answer: local("Yes. The cable car makes the hilltop easily accessible, making the attraction suitable for most visitors."),
        },
        {
          question: local("Can this tour be combined with other attractions?"),
          answer: local("Yes. We can customize the itinerary by combining Jatayu Earth Center with nearby attractions based on your preferences."),
        },
      ],

      itinerary: [
        { timeOrDay: local("08:30 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your hotel in Varkala.") },
        { timeOrDay: local("10:00 AM"), activity: local("Arrival"), desc: local("Arrival at Jatayu Earth Center.") },
        { timeOrDay: local("10:15 AM"), activity: local("Cable Car"), desc: local("Cable car ride to the hilltop.") },
        { timeOrDay: local("10:30 AM - 01:00 PM"), activity: local("Explore"), desc: local("Explore the Jatayu sculpture, viewpoints, gardens, and optional adventure activities.") },
        { timeOrDay: local("01:00 PM"), activity: local("Lunch"), desc: local("Lunch break (optional).") },
        { timeOrDay: local("02:00 PM"), activity: local("Return"), desc: local("Begin return journey.") },
        { timeOrDay: local("03:30 PM"), activity: local("Drop-off"), desc: local("Drop-off at your accommodation in Varkala.") },
      ],
      itineraryEvening: [],
    });

    await jatayuTour.save();
    console.log("✅ Seeded Package 4 (Jatayu Earth Center Tour)");

    console.log("🌿 Seeding Package 5: Varkala Janardhanaswamy Temple & Sivagiri Ashram Tour...");
    const spiritualTour = new PackageItem({
      packageCategory: ["varkalaSightseeing"],
      slug: "varkala-temple-ashram-tour",
      price: 1500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1602180830070-880af913101a?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1602180830070-880af913101a?auto=format&fit=crop&w=1200&q=80",
      duration: local("3-4 Hours"),
      travelTime: local("10-15 Minutes Each Way"),
      entryFee: local("Free Entry"),
      optionalCharges: local("Temple donations / nominal museum charge at Sivagiri"),
      difficulty: local("Easy"),
      groupSize: local("2-15 People"),
      location: local("Varkala, Kerala, India"),

      title: local("Varkala Janardhanaswamy Temple & Sivagiri Ashram Tour"),
      tagline: local("Discover the Spiritual Heart of Varkala"),
      shortDescription: local(
        "Experience the rich spiritual heritage of Kerala with our Varkala Janardhanaswamy Temple & Sivagiri Ashram Tour. This peaceful cultural journey takes you to two of Varkala's most revered spiritual landmarks."
      ),
      aboutText: local(
        "Experience the rich spiritual heritage of Kerala with our Varkala Janardhanaswamy Temple & Sivagiri Ashram Tour. This peaceful cultural journey takes you to two of Varkala's most revered landmarks—the ancient Janardhanaswamy Temple, dedicated to Lord Vishnu, and the renowned Sivagiri Ashram, founded by the great social reformer and philosopher Sree Narayana Guru.\n\nPerfect for pilgrims, culture enthusiasts, families, and travellers seeking a deeper understanding of Kerala's traditions, this half-day tour offers a unique opportunity to explore centuries-old history, sacred architecture, and the peaceful atmosphere that has made Varkala one of South India's most important spiritual destinations.\n\nLocated just minutes from Villa Lemon, these iconic attractions provide a fascinating glimpse into Kerala's religious harmony, cultural heritage, and philosophical legacy."
      ),
      tourOverview: local(
        "Your journey begins with pickup from Villa Lemon or your accommodation in Varkala. The first stop is the Janardhanaswamy Temple, an ancient temple believed to be over 2,000 years old and one of Kerala's most important Vaishnavite pilgrimage sites. Admire its traditional Kerala-style architecture, peaceful surroundings, and spiritual atmosphere while learning about its fascinating history and religious significance. The tour then continues to Sivagiri Ashram, the final resting place of Sree Narayana Guru, one of India's greatest spiritual leaders and social reformers. Walk through the serene ashram complex, visit the Guru's Samadhi, explore the museum, and learn about his timeless message of equality, education, and social harmony."
      ),
      bestTime: local("Morning and Late Afternoon (Year Round)"),
      dressCode: local("Modest clothing covering shoulders and knees. Remove footwear before entering temple/ashram spaces."),
      cta: local("Book Spiritual Tour"),

      highlights: [
        { icon: "compass", label: local("Visit the historic Janardhanaswamy Temple") },
        { icon: "compass", label: local("Explore the peaceful Sivagiri Ashram") },
        { icon: "compass", label: local("Learn about the life and teachings of Sree Narayana Guru") },
        { icon: "compass", label: local("Experience Kerala's spiritual traditions") },
        { icon: "compass", label: local("Beautiful traditional temple architecture") },
        { icon: "compass", label: local("Peaceful meditation and prayer spaces") },
        { icon: "compass", label: local("Cultural and historical insights") },
        { icon: "compass", label: local("Ideal for pilgrims, families, and cultural travellers") },
      ],

      whyGuestsLoveUs: [
        {
          icon: "star",
          title: local("Cultural Insights"),
          desc: local("Our experienced driver shares rich background stories about local rituals and histories."),
        },
        {
          icon: "star",
          title: local("Respect & Guide"),
          desc: local("We assist you with local temple guidelines, dress codes, and custom parameters for a smooth visit."),
        },
      ],

      quickFacts: [
        { key: local("Age of Temple"), value: local("Over 2,000 years old") },
        { key: local("Ashram Significance"), value: local("Sree Narayana Guru's final resting place") },
        { key: local("Tour Duration"), value: local("3-4 hours total") },
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Experienced local driver"),
        local("Flexible sightseeing itinerary"),
        local("Drinking water"),
      ],

      exclusions: [
        local("Temple donations"),
        local("Museum or special entry fees (if applicable)"),
        local("Personal expenses"),
        local("Meals and refreshments"),
      ],

      thingsToBring: [
        local("Modest clothing covering shoulders and knees"),
        local("Socks (if walking on hot stone tiles outside footwear removal limits)"),
        local("Camera (note that photography is restricted inside some inner shrines)"),
      ],

      nearbyAttractions: [
        { name: local("Varkala Cliff"), distance: local("3 km") },
        { name: local("Papanasam Beach"), distance: local("2 km") },
        { name: local("Kappil Beach & Lake"), distance: local("8 km") },
        { name: local("Mangrove Forest Kayaking"), distance: local("9 km") },
        { name: local("Golden Island Canoeing"), distance: local("7 km") },
      ],

      faqs: [
        {
          question: local("Is there an entry fee?"),
          answer: local("The Janardhanaswamy Temple generally does not charge an entry fee. Certain areas of Sivagiri Ashram or its museum may have a nominal charge."),
        },
        {
          question: local("Is the tour suitable for children?"),
          answer: local("Yes. The tour is suitable for visitors of all ages."),
        },
        {
          question: local("How long does the tour take?"),
          answer: local("Approximately 3–4 hours, including transportation."),
        },
        {
          question: local("Can non-Hindus visit the temple?"),
          answer: local("Entry policies may vary depending on temple regulations. If entry to the temple is restricted, visitors can still admire the beautiful architecture and surrounding areas, while Sivagiri Ashram welcomes visitors from all backgrounds."),
        },
        {
          question: local("Can this tour be combined with other attractions?"),
          answer: local("Yes. We can customize the itinerary by combining this spiritual tour with Varkala Cliff, Kappil Beach, or other nearby sightseeing attractions."),
        },
      ],

      itinerary: [
        { timeOrDay: local("08:30 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your hotel") },
        { timeOrDay: local("09:00 AM"), activity: local("Temple Visit"), desc: local("Visit Janardhanaswamy Temple") },
        { timeOrDay: local("10:00 AM"), activity: local("Drive"), desc: local("Drive to Sivagiri Ashram") },
        { timeOrDay: local("10:15 AM - 11:30 AM"), activity: local("Ashram Exploration"), desc: local("Explore the Ashram, museum, and meditation areas") },
        { timeOrDay: local("12:00 PM"), activity: local("Return"), desc: local("Return to Varkala") },
      ],

      itineraryEvening: [
        { timeOrDay: local("03:30 PM"), activity: local("Pickup"), desc: local("Pickup from your accommodation") },
        { timeOrDay: local("04:00 PM"), activity: local("Temple Visit"), desc: local("Janardhanaswamy Temple") },
        { timeOrDay: local("05:00 PM"), activity: local("Ashram Visit"), desc: local("Sivagiri Ashram") },
        { timeOrDay: local("06:30 PM"), activity: local("Return"), desc: local("Return to Villa Lemon") },
      ],
    });

    await spiritualTour.save();
    console.log("✅ Seeded Package 5 (Temple & Ashram Tour)");

    console.log("🌿 Seeding Package 6: Golden Island Canoe Boating Experience...");
    const goldenIslandCanoe = new PackageItem({
      packageCategory: ["varkalaSightseeing"],
      slug: "golden-island-canoe-boating",
      price: 2500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      duration: local("3-4 Hours"),
      travelTime: local("15-20 Minutes Each Way"),
      entryFee: local("Canoe ride included"),
      optionalCharges: local("Personal snacks, drinks, optional tips"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Golden Island, Varkala, Kerala, India"),

      title: local("Golden Island Canoe Boating Experience from Varkala"),
      tagline: local("Explore Kerala's Hidden Island by Traditional Canoe"),
      shortDescription: local(
        "Escape the crowds and discover one of Varkala's best-kept secrets with our Golden Island Canoe Boating Experience. Nestled amidst Kerala's peaceful backwaters, Golden Island is a hidden paradise surrounded by coconut groves."
      ),
      aboutText: local(
        "Escape the crowds and discover one of Varkala's best-kept secrets with our Golden Island Canoe Boating Experience. Nestled amidst Kerala's peaceful backwaters, Golden Island is a hidden paradise surrounded by lush coconut groves, mangrove forests, and tranquil waterways. This relaxing canoe journey offers a unique opportunity to experience the authentic beauty of Kerala while gliding through calm canals in a traditional country canoe.\n\nLocated just a short drive from Varkala, Golden Island is the perfect destination for nature lovers, couples, families, bird watchers, and photographers seeking a peaceful escape. As you cruise through narrow backwater channels, you'll witness traditional village life, spot native birds, admire tropical vegetation, and enjoy the unspoiled beauty of Kerala's countryside.\n\nUnlike busy tourist attractions, Golden Island offers a slow-paced and authentic backwater experience where you can disconnect from the crowds and reconnect with nature. Whether you're looking for relaxation, photography, or a memorable family outing, this canoe boating experience is one of the most beautiful nature excursions near Varkala."
      ),
      tourOverview: local(
        "Your journey begins with pickup from Villa Lemon or your accommodation in Varkala. After a short scenic drive, you'll arrive at Golden Island, where your experienced local boatman welcomes you aboard a traditional canoe. As you gently paddle through the calm backwaters, you'll pass coconut groves, small fishing villages, lush greenery, and quiet waterways rarely visited by large tourist groups. Along the way, enjoy spectacular views, observe local wildlife, and experience the relaxed rhythm of village life that has remained unchanged for generations. Take your time to enjoy the peaceful surroundings, capture stunning photographs, and immerse yourself in one of Kerala's most authentic backwater destinations before returning comfortably to Varkala."
      ),
      bestTime: local("Mornings for bird watching, evenings for sunset views"),
      dressCode: local("Comfortable casual clothing & hats"),
      cta: local("Book Canoe Experience"),

      highlights: [
        { icon: "compass", label: local("Traditional country canoe boating") },
        { icon: "compass", label: local("Explore the peaceful Golden Island backwaters") },
        { icon: "compass", label: local("Cruise through scenic canals and coconut plantations") },
        { icon: "compass", label: local("Experience authentic Kerala village life") },
        { icon: "compass", label: local("Bird watching and nature photography") },
        { icon: "compass", label: local("Beautiful mangrove surroundings") },
        { icon: "compass", label: local("Peaceful and family-friendly experience") },
        { icon: "compass", label: local("Ideal for couples, families, and nature lovers") },
      ],

      whyGuestsLoveUs: [
        {
          icon: "star",
          title: local("Authentic Country Boats"),
          desc: local("Traditional wooden canoes operated by expert local fishermen who know every hidden canal."),
        },
        {
          icon: "star",
          title: local("Escape the Noise"),
          desc: local("A slow-paced nature experience far away from the noisy motorboats and tourist crowds."),
        },
      ],

      quickFacts: [
        { key: local("Boat Type"), value: local("Traditional country canoe") },
        { key: local("Ride Duration"), value: local("60 to 90 minutes") },
        { key: local("Water Condition"), value: local("Calm backwaters") },
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private transportation"),
        local("Traditional canoe boating"),
        local("Experienced local boatman"),
        local("Drinking water"),
      ],

      exclusions: [
        local("Meals and refreshments"),
        local("Personal expenses"),
        local("Optional activities"),
        local("Travel insurance"),
      ],

      thingsToBring: [
        local("Sunscreen, sunglasses, hat"),
        local("Camera with zoom lens (great for birdwatching)"),
        local("Comfortable clothing"),
      ],

      nearbyAttractions: [
        { name: local("Kappil Beach & Lake"), distance: local("9 km") },
        { name: local("Mangrove Forest Kayaking"), distance: local("7 km") },
        { name: local("Varkala Cliff"), distance: local("6 km") },
        { name: local("Janardhanaswamy Temple"), distance: local("8 km") },
        { name: local("Sivagiri Ashram"), distance: local("7 km") },
      ],

      faqs: [
        {
          question: local("Is canoe boating suitable for beginners?"),
          answer: local("Yes. The canoe is operated by an experienced local boatman, making the experience safe and relaxing for visitors of all ages."),
        },
        {
          question: local("How long is the canoe ride?"),
          answer: local("The boating experience typically lasts 60 to 90 minutes, depending on the selected package and water conditions."),
        },
        {
          question: local("Is the tour suitable for children?"),
          answer: local("Yes. Families with children are welcome, and life jackets are provided where required."),
        },
        {
          question: local("Can I take photographs during the tour?"),
          answer: local("Absolutely. Golden Island is one of the most scenic locations near Varkala and is ideal for landscape, wildlife, and sunset photography."),
        },
        {
          question: local("Can this trip be combined with other attractions?"),
          answer: local("Yes. Many guests combine Golden Island with Kappil Beach & Lake, Mangrove Forest Kayaking, or other nearby sightseeing destinations for a memorable half-day excursion."),
        },
      ],

      itinerary: [
        { timeOrDay: local("08:30 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your hotel") },
        { timeOrDay: local("09:00 AM"), activity: local("Arrival"), desc: local("Arrival at Golden Island") },
        { timeOrDay: local("09:15 AM"), activity: local("Canoe Ride"), desc: local("Traditional canoe boating experience") },
        { timeOrDay: local("10:45 AM"), activity: local("Free Time"), desc: local("Free time for photography and relaxation") },
        { timeOrDay: local("11:30 AM"), activity: local("Return"), desc: local("Return journey to Varkala") },
        { timeOrDay: local("12:00 PM"), activity: local("Drop-off"), desc: local("Drop-off at your accommodation") },
      ],

      itineraryEvening: [
        { timeOrDay: local("03:30 PM"), activity: local("Pickup"), desc: local("Pickup from your accommodation") },
        { timeOrDay: local("04:00 PM"), activity: local("Canoe Ride"), desc: local("Golden Island canoe boating") },
        { timeOrDay: local("05:30 PM"), activity: local("Sunset"), desc: local("Sunset views and photography") },
        { timeOrDay: local("06:30 PM"), activity: local("Return"), desc: local("Return to Villa Lemon") },
      ],
    });

    await goldenIslandCanoe.save();
    console.log("✅ Seeded Package 6 (Golden Island Canoe Boating)");

    console.log("🎉 All packages seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

run();
