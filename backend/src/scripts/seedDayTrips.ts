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

    const slugs = [
      "jatayu-elephant-kayaking-tour",
      "ponmudi-hill-station-trip",
      "munroe-island-backwater-tour",
      "kanyakumari-day-trip",
      "kollam-munroe-island-cruise",
      "neyyar-dam-trip",
      "houseboat-cruises-from-varkala",
      "elephant-farm-mangrove-kayaking"
    ];

    console.log(`🗑️  Cleaning existing dayTrips packages...`);
    await PackageItem.deleteMany({ slug: { $in: slugs } });

    console.log("🌿 Seeding Package 1: Jatayu, Elephant Farm & Kayaking...");
    const p1 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "jatayu-elephant-kayaking-tour",
      price: 4999,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      duration: local("10 Hours"),
      travelTime: local("1 to 1.5 Hours each way"),
      entryFee: local("Not Included (Jatayu, Elephant farm separately)"),
      optionalCharges: local("Elephant feeding/riding & cable car ride optional"),
      difficulty: local("Easy to Moderate"),
      groupSize: local("2-10 People"),
      location: local("Kollam & Varkala, Kerala"),

      title: local("Jatayu Earth Center, Kaveri Elephant Farm & Mangrove Kayaking Tour from Varkala"),
      tagline: local("A Perfect Day of Adventure, Wildlife & Nature"),
      shortDescription: local(
        "Experience one of the most exciting day trips from Varkala with our Jatayu Earth Center, Kaveri Elephant Farm & Mangrove Kayaking Tour. This full-day package combines Kerala's most iconic attractions into one unforgettable journey."
      ),
      aboutText: local(
        "Experience one of the most exciting day trips from Varkala with our Jatayu Earth Center, Kaveri Elephant Farm & Mangrove Kayaking Tour. This carefully designed full-day package combines Kerala's most iconic attractions into one unforgettable journey, featuring the world's largest bird sculpture, an authentic elephant experience, peaceful mangrove kayaking, and the scenic beauty of Kappil Beach.\n\nIdeal for families, couples, groups, and adventure lovers, this tour offers the perfect balance of culture, wildlife, nature, and outdoor adventure. From breathtaking hilltop views and thrilling cable car rides to tranquil backwaters and beautiful beaches, you'll experience the very best of South Kerala in a single day."
      ),
      tourOverview: local(
        "Instead of booking multiple tours on different days, this carefully planned itinerary lets you experience Kerala's most popular attractions in one seamless journey. From the legendary Jatayu Earth Center and the gentle giants at Kaveri Elephant Farm to the peaceful mangrove waterways and the stunning coastal scenery of Kappil Beach, this tour showcases the incredible diversity of South Kerala. Whether you're visiting Varkala for a short holiday or looking for an unforgettable day of exploration, this package delivers a perfect mix of culture, wildlife, adventure, and relaxation."
      ),
      bestTime: local("Morning (Year Round)"),
      dressCode: local("Comfortable casual clothing with walking shoes"),
      cta: local("Book Jatayu & Kayaking"),

      highlights: [
        { icon: "compass", label: local("Visit the world-famous Jatayu Earth Center") },
        { icon: "compass", label: local("Scenic cable car ride (optional)") },
        { icon: "compass", label: local("Meet and interact with elephants at Kaveri Elephant Farm") },
        { icon: "compass", label: local("Guided Mangrove Forest Kayaking Experience") },
        { icon: "compass", label: local("Visit the beautiful Kappil Beach & Lake") },
        { icon: "compass", label: local("Bird watching and nature photography") },
        { icon: "compass", label: local("Private transportation from Varkala") },
        { icon: "compass", label: local("Flexible sightseeing itinerary") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("All-in-One Adventure"), desc: local("Save time and money by combining Varkala's best nature and wildlife spots in one private day trip.") },
        { icon: "star", title: local("Experienced Driver"), desc: local("Safe, relaxed private AC transport with a friendly local chauffeur.") }
      ],

      quickFacts: [
        { key: local("Tour Duration"), value: local("10 Hours") },
        { key: local("Kayaking time"), value: local("1.5 Hours") },
        { key: local("Highlights count"), value: local("4 Key destinations") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Professional local driver"),
        local("Guided mangrove kayaking"),
        local("Kayak and safety equipment"),
        local("Drinking water")
      ],

      exclusions: [
        local("Entry tickets"),
        local("Cable car tickets"),
        local("Elephant activities (if charged separately)"),
        local("Lunch and refreshments"),
        local("Personal expenses")
      ],

      thingsToBring: [
        local("Quick-dry clothes for kayaking"),
        local("Sunscreen, sunglasses, hat"),
        local("Camera/smartphone waterproof pouch"),
        local("Comfortable footwear")
      ],

      nearbyAttractions: [
        { name: local("Golden Island"), distance: local("12 km") },
        { name: local("Varkala Cliff"), distance: local("15 km") }
      ],

      faqs: [
        { question: local("Is kayaking beginner-friendly?"), answer: local("Yes. It is fully guided on calm waters and completely safe for beginners.") },
        { question: local("Are elephant rides compulsory?"), answer: local("No, all activities at Kaveri Elephant Farm are optional based on your choice.") }
      ],

      itinerary: [
        { timeOrDay: local("07:30 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your accommodation in Varkala.") },
        { timeOrDay: local("08:30 AM - 11:00 AM"), activity: local("Jatayu Earth Center"), desc: local("Cable car ride, giant bird sculpture, panoramic views.") },
        { timeOrDay: local("11:30 AM - 12:30 PM"), activity: local("Kaveri Elephant Farm"), desc: local("Meet, feed and interact with elephants, photography.") },
        { timeOrDay: local("01:00 PM"), activity: local("Lunch"), desc: local("Lunch break at a local restaurant (optional).") },
        { timeOrDay: local("02:00 PM - 03:30 PM"), activity: local("Mangrove Kayaking"), desc: local("Guided kayaking through peaceful mangrove waterways.") },
        { timeOrDay: local("03:45 PM - 04:30 PM"), activity: local("Kappil Beach & Lake"), desc: local("Visit Kappil Bridge, coastal views, lake sightseeing.") },
        { timeOrDay: local("05:30 PM"), activity: local("Return"), desc: local("Return to Villa Lemon.") }
      ]
    });
    await p1.save();
    console.log("✅ Seeded p1");

    console.log("🌿 Seeding Package 2: Ponmudi Hill Station Trip...");
    const p2 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "ponmudi-hill-station-trip",
      price: 3200,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
      duration: local("9 Hours"),
      travelTime: local("2 Hours each way"),
      entryFee: local("Nominal entry charges at hill checkpoint"),
      optionalCharges: local("Personal expenses & guide fees"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Western Ghats, Thiruvananthapuram, Kerala"),

      title: local("Ponmudi Hill Station Trip from Varkala"),
      tagline: local("Escape to Kerala's Scenic Hill Paradise"),
      shortDescription: local(
        "Leave the coastline behind and journey into the misty Western Ghats with our Ponmudi Hill Station Trip from Varkala. Famous for its winding mountain roads, tea gardens, and cool climate."
      ),
      aboutText: local(
        "Leave the coastline behind and journey into the misty Western Ghats with our Ponmudi Hill Station Trip from Varkala. Located approximately 60 km from Varkala, Ponmudi is one of Kerala's most beautiful hill stations, famous for its winding mountain roads, lush tea gardens, waterfalls, panoramic viewpoints, and cool climate.\n\nOften called the 'Golden Peak of Kerala,' Ponmudi offers a refreshing escape from the tropical heat of the coast. Whether you're looking to enjoy breathtaking mountain views, explore nature trails, relax beside waterfalls, or simply breathe in the fresh mountain air, this full-day excursion promises an unforgettable experience for couples, families, photographers, and nature lovers.\n\nSurrounded by evergreen forests and rich biodiversity, Ponmudi is also home to a variety of rare butterflies, birds, and wildlife, making it one of the most scenic destinations in South Kerala."
      ),
      tourOverview: local(
        "Your adventure begins with a comfortable pickup from Villa Lemon or your accommodation in Varkala. Enjoy a scenic drive through villages, rubber plantations, forests, and winding mountain roads before reaching the beautiful hill station of Ponmudi.\n\nSpend the day exploring spectacular viewpoints, enjoying the cool mountain breeze, visiting Golden Valley, relaxing beside streams, and capturing stunning photographs of Kerala's highlands. Along the way, your driver will stop at popular viewpoints, waterfalls (season permitting), and local attractions, allowing plenty of time to experience the natural beauty of the region."
      ),
      bestTime: local("October to March (Year Round)"),
      dressCode: local("Comfortable casual clothing with a light jacket/shawl"),
      cta: local("Book Ponmudi Trip"),

      highlights: [
        { icon: "compass", label: local("Scenic drive through the Western Ghats") },
        { icon: "compass", label: local("Panoramic viewpoints") },
        { icon: "compass", label: local("Ponmudi Hill Station summit") },
        { icon: "compass", label: local("Golden Valley walk") },
        { icon: "compass", label: local("Tea gardens and mountain landscapes") },
        { icon: "compass", label: local("Beautiful waterfalls (seasonal)") },
        { icon: "compass", label: local("Nature photography") },
        { icon: "compass", label: local("Bird watching and butterfly spotting") },
        { icon: "compass", label: local("Cool mountain climate") },
        { icon: "compass", label: local("Optional short nature walks") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Beat the Coast Heat"), desc: local("Escape to cool altitudes with fresh mist, evergreen pine trees, and a mountain breeze.") },
        { icon: "star", title: local("Lush Tea Gardens"), desc: local("Take scenic strolls through high-elevation tea plantations and streams.") }
      ],

      quickFacts: [
        { key: local("Distance"), value: local("60 km from Varkala") },
        { key: local("Hairpin curves"), value: local("22 hairpin curves") },
        { key: local("Elevation"), value: local("Over 915 meters") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Experienced local driver"),
        local("Flexible sightseeing itinerary"),
        local("Drinking water")
      ],

      exclusions: [
        local("Entry tickets (if applicable)"),
        local("Meals and refreshments"),
        local("Personal expenses"),
        local("Guide services"),
        local("Optional activities")
      ],

      thingsToBring: [
        local("Comfortable walking shoes"),
        local("Light jacket or sweater"),
        local("Sunglasses and sunscreen"),
        local("Camera for photography")
      ],

      nearbyAttractions: [
        { name: local("Golden Valley"), distance: local("2 km") },
        { name: local("Peppara Wildlife Sanctuary"), distance: local("12 km") }
      ],

      faqs: [
        { question: local("How far is Ponmudi from Varkala?"), answer: local("Ponmudi is approximately 60 km from Varkala, taking around 2 hours each way.") },
        { question: local("Are there restaurants?"), answer: local("Yes, there are local cafes and restaurants near the peak for lunch and snacks.") }
      ],

      itinerary: [
        { timeOrDay: local("08:00 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your accommodation in Varkala.") },
        { timeOrDay: local("09:45 AM"), activity: local("Scenic Drive"), desc: local("Drive through Western Ghats with panoramic photo stops.") },
        { timeOrDay: local("10:30 AM"), activity: local("Arrival"), desc: local("Arrival at Ponmudi Hill Station.") },
        { timeOrDay: local("10:30 AM - 01:00 PM"), activity: local("Explore peak"), desc: local("Explore viewpoints, tea gardens, and misty walking trails.") },
        { timeOrDay: local("01:00 PM"), activity: local("Lunch"), desc: local("Lunch at a local hill restaurant (optional).") },
        { timeOrDay: local("02:00 PM - 03:30 PM"), activity: local("Golden Valley"), desc: local("Visit Golden Valley and relax beside natural mountain streams.") },
        { timeOrDay: local("03:30 PM"), activity: local("Return"), desc: local("Begin return journey back down the hills.") },
        { timeOrDay: local("05:30 PM"), activity: local("Drop-off"), desc: local("Drop-off at your accommodation in Varkala.") }
      ]
    });
    await p2.save();
    console.log("✅ Seeded p2");

    console.log("🌿 Seeding Package 3: Munroe Island Backwater Tour...");
    const p3 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "munroe-island-backwater-tour",
      price: 2500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1602180830070-880af913101a?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1602180830070-880af913101a?auto=format&fit=crop&w=1200&q=80",
      duration: local("7 Hours"),
      travelTime: local("1 Hour each way"),
      entryFee: local("Ferry / Canoe tickets as applicable"),
      optionalCharges: local("Local guide / village lunch fees"),
      difficulty: local("Easy"),
      groupSize: local("2-12 People"),
      location: local("Munroe Island, Kollam, Kerala"),

      title: local("Munroe Island Backwater Tour from Varkala"),
      tagline: local("Discover Kerala's Hidden Backwater Paradise"),
      shortDescription: local(
        "Escape the crowds and experience the authentic beauty of Kerala with our Munroe Island Backwater Tour. Located at the meeting point of Ashtamudi Lake and the Kallada River."
      ),
      aboutText: local(
        "Escape the crowds and experience the authentic beauty of Kerala with our Munroe Island Backwater Tour from Varkala. Located at the meeting point of Ashtamudi Lake and the Kallada River, Munroe Island is a peaceful cluster of eight small islands connected by canals, narrow waterways, and traditional village roads.\n\nKnown for its untouched backwaters, traditional canoe cruises, lush coconut groves, mangrove forests, and vibrant village life, Munroe Island offers one of the most authentic backwater experiences in Kerala. Unlike commercial destinations, this hidden paradise allows visitors to explore the region's natural beauty while witnessing the daily life of local communities.\n\nPerfect for couples, families, photographers, birdwatchers, and nature lovers, this full-day excursion from Varkala combines scenic landscapes, peaceful boating, delicious local cuisine, and unforgettable memories."
      ),
      tourOverview: local(
        "Your journey begins with pickup from Villa Lemon or your accommodation in Varkala, followed by a scenic drive to Munroe Island. Upon arrival, board a traditional country boat and begin your cruise through the island's peaceful network of canals.\n\nAs you glide through the calm backwaters, you'll pass coconut plantations, fishing villages, mangrove forests, and traditional Kerala homes. Watch local fishermen at work, observe native birds, and experience the slow-paced lifestyle that makes Munroe Island one of Kerala's most charming destinations. After the boating experience, guests can enjoy a traditional Kerala lunch (optional) before exploring more of the island and returning comfortably to Varkala."
      ),
      bestTime: local("Mornings for bird watching, afternoons for golden light photography"),
      dressCode: local("Comfortable light summer clothing"),
      cta: local("Book Munroe Tour"),

      highlights: [
        { icon: "compass", label: local("Traditional country boat cruise through Munroe Island") },
        { icon: "compass", label: local("Explore narrow canals and peaceful backwaters") },
        { icon: "compass", label: local("Experience authentic Kerala village life") },
        { icon: "compass", label: local("Beautiful coconut plantations and paddy fields") },
        { icon: "compass", label: local("Bird watching and wildlife spotting") },
        { icon: "compass", label: local("Mangrove forests and scenic waterways") },
        { icon: "compass", label: local("Local village interactions") },
        { icon: "compass", label: local("Excellent photography opportunities") },
        { icon: "compass", label: local("Private transportation from Varkala") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Authentic & Quiet"), desc: local("Canoe through tiny water arches under lush trees without noisy motorboats.") },
        { icon: "star", title: local("Trusted Local Boatmen"), desc: local("Operated by local residents who share genuine stories of life on the island.") }
      ],

      quickFacts: [
        { key: local("Distance"), value: local("40 km from Varkala") },
        { key: local("Boat Cruise"), value: local("1.5 to 2 Hours") },
        { key: local("Attraction"), value: local("Narrow backwater canals") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Traditional country boat cruise"),
        local("Experienced local boatman"),
        local("Drinking water")
      ],

      exclusions: [
        local("Boat tickets (if not included in your selected package)"),
        local("Lunch and refreshments"),
        local("Personal expenses"),
        local("Guide services (unless requested)")
      ],

      thingsToBring: [
        local("Hat, sunglasses, sunscreen"),
        local("Camera with zoom lens"),
        local("Insect repellent"),
        local("Binoculars for bird watching")
      ],

      nearbyAttractions: [
        { name: local("Kollam Lighthouse"), distance: local("15 km") },
        { name: local("Thangassery Beach"), distance: local("16 km") }
      ],

      faqs: [
        { question: local("Is it suitable for children?"), answer: local("Yes. It is a slow, relaxing experience suitable for all ages.") },
        { question: local("Will we see birds?"), answer: local("Yes. It is home to kingfishers, herons, egrets, cormorants, and other native species.") }
      ],

      itinerary: [
        { timeOrDay: local("08:30 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your accommodation in Varkala.") },
        { timeOrDay: local("09:30 AM"), activity: local("Arrival"), desc: local("Arrival at Munroe Island backwater jetty.") },
        { timeOrDay: local("10:00 AM - 12:00 PM"), activity: local("Boat Cruise"), desc: local("Traditional country boat cruise through narrow canals.") },
        { timeOrDay: local("12:30 PM"), activity: local("Lunch"), desc: local("Enjoy optional traditional Kerala lunch.") },
        { timeOrDay: local("01:30 PM"), activity: local("Explore village"), desc: local("Explore the village, local markets, and scenic viewpoints.") },
        { timeOrDay: local("03:00 PM"), activity: local("Return"), desc: local("Begin return journey back to Varkala.") },
        { timeOrDay: local("04:00 PM"), activity: local("Drop-off"), desc: local("Drop-off at your accommodation.") }
      ]
    });
    await p3.save();
    console.log("✅ Seeded p3");

    console.log("🌿 Seeding Package 4: Kanyakumari Day Trip...");
    const p4 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "kanyakumari-day-trip",
      price: 5500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
      duration: local("12 Hours"),
      travelTime: local("2.5 to 3 Hours each way"),
      entryFee: local("Ferry and monument entry tickets not included"),
      optionalCharges: local("Ferry tickets & meals"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Kanyakumari, Tamil Nadu, India"),

      title: local("Kanyakumari Day Trip from Varkala"),
      tagline: local("Discover the Southernmost Tip of India"),
      shortDescription: local(
        "Embark on an unforgettable Kanyakumari Day Trip from Varkala and explore one of India's most iconic destinations, where the Arabian Sea, Bay of Bengal, and Indian Ocean meet."
      ),
      aboutText: local(
        "Embark on an unforgettable Kanyakumari Day Trip from Varkala and explore one of India's most iconic destinations, where the Arabian Sea, Bay of Bengal, and Indian Ocean meet. Renowned for its spectacular sunrise and sunset views, historic landmarks, spiritual significance, and coastal beauty, Kanyakumari is one of the most popular day trips from Varkala.\n\nLocated approximately 120 km from Varkala, this full-day excursion takes you across the Kerala–Tamil Nadu border to experience famous attractions such as the Vivekananda Rock Memorial, Thiruvalluvar Statue, Bhagavathy Amman Temple, Gandhi Memorial, and the vibrant local markets. Whether you're travelling as a couple, family, solo traveller, or group, this journey offers the perfect blend of history, culture, spirituality, and breathtaking ocean views."
      ),
      tourOverview: local(
        "Your journey begins with an early morning pickup from Villa Lemon or your accommodation in Varkala. Enjoy a scenic drive through Kerala and Tamil Nadu before arriving at Kanyakumari.\n\nExplore the famous Vivekananda Rock Memorial by ferry, admire the towering Thiruvalluvar Statue, visit the sacred Bhagavathy Amman Temple, and learn about India's history at the Gandhi Memorial. Stroll along the lively beachfront promenade, browse local handicraft shops, and enjoy stunning views of the coastline before returning comfortably to Varkala."
      ),
      bestTime: local("October to March (Pleasant weather)"),
      dressCode: local("Modest, respectful clothing for temples"),
      cta: local("Book Kanyakumari Trip"),

      highlights: [
        { icon: "compass", label: local("Visit the southernmost point of mainland India") },
        { icon: "compass", label: local("Witness the meeting of three seas") },
        { icon: "compass", label: local("Ferry to Vivekananda Rock Memorial") },
        { icon: "compass", label: local("Thiruvalluvar Statue landmark") },
        { icon: "compass", label: local("Bhagavathy Amman Temple") },
        { icon: "compass", label: local("Gandhi Memorial visit") },
        { icon: "compass", label: local("Walk along Kanyakumari Beach") },
        { icon: "compass", label: local("Local handicraft and souvenir shopping") },
        { icon: "compass", label: local("Spectacular sunrise or sunset views") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Unique Geography"), desc: local("Stand at the literal end of the Indian subcontinent where three giant oceans merge.") },
        { icon: "star", title: local("Border Cross Experience"), desc: local("Drive from green Kerala into historical Tamil Nadu in a private AC car.") }
      ],

      quickFacts: [
        { key: local("Distance"), value: local("120 km from Varkala") },
        { key: local("Travel Time"), value: local("3 hours each way") },
        { key: local("Key Highlight"), value: local("Vivekananda Rock Memorial") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Experienced local driver"),
        local("Flexible sightseeing itinerary"),
        local("Drinking water")
      ],

      exclusions: [
        local("Ferry tickets"),
        local("Monument entry fees"),
        local("Meals and refreshments"),
        local("Personal expenses"),
        local("Guide services")
      ],

      thingsToBring: [
        local("Sun protection (hat, sunglasses, sunscreen)"),
        local("Camera/phone for views"),
        local("ID card for temple entry requirements"),
        local("Comfortable footwear")
      ],

      nearbyAttractions: [
        { name: local("Our Lady of Ransom Church"), distance: local("1 km") },
        { name: local("Wax Museum"), distance: local("2 km") }
      ],

      faqs: [
        { question: local("Are ferry tickets included?"), answer: local("No, ferry tickets to the Rock Memorial are purchased separately at the jetty.") },
        { question: local("Can we see both sunrise and sunset?"), answer: local("A standard day trip includes one. To see both, we recommend an overnight custom package.") }
      ],

      itinerary: [
        { timeOrDay: local("06:00 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your accommodation in Varkala.") },
        { timeOrDay: local("08:30 AM"), activity: local("Arrival"), desc: local("Arrival at Kanyakumari.") },
        { timeOrDay: local("08:45 AM - 12:30 PM"), activity: local("Sightseeing"), desc: local("Visit Rock Memorial, Statue, temple, and Gandhi Memorial.") },
        { timeOrDay: local("12:30 PM"), activity: local("Lunch"), desc: local("Lunch at a local restaurant (optional).") },
        { timeOrDay: local("01:30 PM"), activity: local("Shopping"), desc: local("Free time for souvenir shopping and beach strolls.") },
        { timeOrDay: local("03:30 PM"), activity: local("Return"), desc: local("Begin return journey back to Varkala.") },
        { timeOrDay: local("06:00 PM"), activity: local("Drop-off"), desc: local("Drop-off at your accommodation.") }
      ]
    });
    await p4.save();
    console.log("✅ Seeded p4");

    console.log("🌿 Seeding Package 5: Kollam & Munroe Island Cruise...");
    const p5 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "kollam-munroe-island-cruise",
      price: 3900,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      duration: local("10 Hours"),
      travelTime: local("1 Hour each way"),
      entryFee: local("Ferry & lighthouse ticket fees apply"),
      optionalCharges: local("Spice shopping and Guru Prasad lunch charges"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Kollam & Munroe Island, Kerala"),

      title: local("Kollam & Munroe Island Backwater Cruise from Varkala"),
      tagline: local("Experience Kerala Like a Local"),
      shortDescription: local(
        "Discover the authentic charm of Kerala on our Kollam & Munroe Island Backwater Cruise. Combines history, local spice markets, a local train ride, and a traditional canoe backwater cruise."
      ),
      aboutText: local(
        "Discover the authentic charm of Kerala on our Kollam & Munroe Island Backwater Cruise from Varkala. This carefully curated full-day excursion combines history, local culture, shopping, traditional cuisine, and a peaceful backwater cruise through one of Kerala's most beautiful hidden destinations.\n\nUnlike ordinary sightseeing tours, this experience allows you to travel like a local. Enjoy a scenic coastal drive, climb Kerala's famous Thangassery Lighthouse, shop for premium spices at a genuine wholesale market, savour authentic South Indian cuisine, travel by local train to Munroe Island, and cruise through tranquil backwaters aboard a traditional country boat.\n\nPerfect for couples, families, photographers, and travellers looking to experience the real Kerala, this tour offers an unforgettable journey through the state's coastal heritage and village life."
      ),
      tourOverview: local(
        "This is far more than a sightseeing trip—it's a chance to experience Kerala through the eyes of its local communities. From historic landmarks and bustling spice markets to traditional transport and peaceful backwaters, every part of the journey has been carefully designed to showcase the region's authentic character. Whether you're admiring the views from Thangassery Lighthouse, enjoying a traditional vegetarian lunch, travelling by local train, or cruising through the serene canals of Munroe Island, you'll create memories that capture the true spirit of Kerala."
      ),
      bestTime: local("Late morning departure for afternoon golden hour cruise"),
      dressCode: local("Casual summer wear"),
      cta: local("Book Kollam & Munroe Cruise"),

      highlights: [
        { icon: "compass", label: local("Scenic coastal drive from Varkala to Kollam") },
        { icon: "compass", label: local("Visit the historic Thangassery Lighthouse") },
        { icon: "compass", label: local("Shop at Kollam's wholesale spice & cashew market") },
        { icon: "compass", label: local("Explore local handicraft and textile stores") },
        { icon: "compass", label: local("Traditional Kerala lunch at Guru Prasad Restaurant") },
        { icon: "compass", label: local("Local train journey from Kollam to Munroe Island") },
        { icon: "compass", label: local("Auto-rickshaw ride through island villages") },
        { icon: "compass", label: local("Two-hour traditional backwater boat cruise") },
        { icon: "compass", label: local("Fresh tender coconut served onboard") },
        { icon: "compass", label: local("Explore authentic village life and mangroves") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Live Like a Local"), desc: local("Includes riding on a public passenger train and local tuk-tuks for a true regional lifestyle experience.") },
        { icon: "star", title: local("Spice Wholesale Prices"), desc: local("Shop cashew nuts and cardamoms at genuine local pricing away from tourist traps.") }
      ],

      quickFacts: [
        { key: local("Activity"), value: local("Lighthouse climb & boat cruise") },
        { key: local("Local Transport"), value: local("Train, Tuk-tuk & Canoe") },
        { key: local("Hours"), value: local("10 Hours (Full Day)") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private transportation"),
        local("Local train ticket"),
        local("Traditional country boat cruise"),
        local("Auto-rickshaw transfers"),
        local("Drinking water")
      ],

      exclusions: [
        local("Lunch"),
        local("Lighthouse entry ticket"),
        local("Shopping expenses"),
        local("Personal expenses"),
        local("Tips and gratuities")
      ],

      thingsToBring: [
        local("Camera/smartphone for panoramic views"),
        local("Cash for cashew and spice shopping"),
        local("Hat and sunglasses")
      ],

      nearbyAttractions: [
        { name: local("Thangassery Beach"), distance: local("2 km") },
        { name: local("Ashtamudi Lake"), distance: local("Inside route") }
      ],

      faqs: [
        { question: local("Is the train ticket included?"), answer: local("Yes, the passenger train ticket from Kollam to Munroe Island is fully included in the package.") },
        { question: local("Is lunch provided?"), answer: local("Lunch is optional and can be purchased at the famous Guru Prasad vegetarian restaurant.") }
      ],

      itinerary: [
        { timeOrDay: local("09:30 AM"), activity: local("Departure"), desc: local("Scenic coastal drive from Varkala to Kollam City.") },
        { timeOrDay: local("10:30 AM"), activity: local("Lighthouse"), desc: local("Climb Thangassery Lighthouse for 360-degree ocean views.") },
        { timeOrDay: local("11:30 AM"), activity: local("Spice Market"), desc: local("Visit the wholesale Cashew and Spice market in Kollam.") },
        { timeOrDay: local("01:30 PM"), activity: local("Lunch"), desc: local("Savor traditional Kerala vegetarian lunch at Guru Prasad.") },
        { timeOrDay: local("02:40 PM"), activity: local("Train Ride"), desc: local("Board local passenger train to Munroe Island.") },
        { timeOrDay: local("03:15 PM"), activity: local("Tuk-Tuk & Cruise"), desc: local("Rickshaw to jetty, board traditional country boat for 2 hours.") },
        { timeOrDay: local("05:30 PM"), activity: local("Return transfers"), desc: local("Local bus and private transfer back to Varkala.") },
        { timeOrDay: local("07:30 PM"), activity: local("Arrival"), desc: local("Arrival back at Villa Lemon.") }
      ]
    });
    await p5.save();
    console.log("✅ Seeded p5");

    console.log("🌿 Seeding Package 6: Neyyar Dam Trip...");
    const p6 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "neyyar-dam-trip",
      price: 3400,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=1200&q=80",
      duration: local("9.5 Hours"),
      travelTime: local("1.5 to 2 Hours each way"),
      entryFee: local("Wildlife park / Lion safari fees apply"),
      optionalCharges: local("Lake boating and Lion Safari tickets"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Neyyar Reservoir, Thiruvananthapuram, Kerala"),

      title: local("Neyyar Dam Trip from Varkala"),
      tagline: local("Discover the Natural Beauty of Kerala's Scenic Reservoir and Wildlife Sanctuary"),
      shortDescription: local(
        "Escape into the tranquil landscapes of South Kerala with our Neyyar Dam Trip. Boasting dam viewpoints, reservoir boat rides, deer parks, and crocodile centers."
      ),
      aboutText: local(
        "Escape into the tranquil landscapes of South Kerala with our Neyyar Dam Trip from Varkala. Nestled at the foothills of the majestic Western Ghats, Neyyar Dam is one of Kerala's most picturesque destinations, offering breathtaking reservoir views, lush forests, wildlife, boating, and peaceful surroundings.\n\nLocated approximately 65 km from Varkala, Neyyar Dam is an ideal full-day excursion for families, couples, nature lovers, photographers, and adventure enthusiasts. Surrounded by evergreen forests and rolling hills, the area is home to the famous Neyyar Wildlife Sanctuary, Lion Safari Park, Crocodile Rehabilitation Centre, Deer Park, and scenic boating facilities."
      ),
      tourOverview: local(
        "Your journey begins with pickup from Villa Lemon or your accommodation in Varkala before travelling through the picturesque countryside towards Neyyar Dam.\n\nUpon arrival, admire the impressive dam and enjoy spectacular views of the reservoir surrounded by lush green hills. Guests can take an optional boat ride across Neyyar Lake, visit the Lion Safari Park, explore the Crocodile Rehabilitation Centre, and enjoy leisurely walks through the scenic gardens and viewpoints."
      ),
      bestTime: local("October to March (Year Round)"),
      dressCode: local("Comfortable walking wear"),
      cta: local("Book Neyyar Dam Trip"),

      highlights: [
        { icon: "compass", label: local("Visit the beautiful Neyyar Dam and reservoir") },
        { icon: "compass", label: local("Scenic reservoir surrounded by the Western Ghats") },
        { icon: "compass", label: local("Boat ride on Neyyar Lake (optional)") },
        { icon: "compass", label: local("Lion Safari Park (optional)") },
        { icon: "compass", label: local("Crocodile Rehabilitation Centre") },
        { icon: "compass", label: local("Deer Park & beautiful gardens") },
        { icon: "compass", label: local("Nature photography and wildlife spotting") },
        { icon: "compass", label: local("Panoramic mountain views") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Rich Wildlife Spotting"), desc: local("Great for children and families with crocodile parks, deer, and reservoir boating.") },
        { icon: "star", title: local("Lush Forest Foothills"), desc: local("Surrounded by the dense jungles of Neyyar Wildlife Sanctuary in the Ghats.") }
      ],

      quickFacts: [
        { key: local("Distance"), value: local("65 km from Varkala") },
        { key: local("Main Attraction"), value: local("Dam & Reservoir Boating") },
        { key: local("Travel Time"), value: local("1.5 to 2 hours each way") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Experienced local driver"),
        local("Flexible sightseeing itinerary"),
        local("Drinking water")
      ],

      exclusions: [
        local("Entry tickets"),
        local("Boat ride charges"),
        local("Lion Safari tickets"),
        local("Meals and refreshments"),
        local("Personal expenses")
      ],

      thingsToBring: [
        local("Camera for wildlife capture"),
        local("Sun block and hat"),
        local("Comfortable walking shoes")
      ],

      nearbyAttractions: [
        { name: local("Neyyar Wildlife Sanctuary"), distance: local("Inside route") },
        { name: local("Lion Safari Park"), distance: local("2 km") }
      ],

      faqs: [
        { question: local("Is lake boating safe for kids?"), answer: local("Yes, life jackets are provided for all lake boating passengers.") },
        { question: local("Can we see wild lions?"), answer: local("The Lion Safari Park is closed occasionally for maintenance. Please confirm schedules prior to booking.") }
      ],

      itinerary: [
        { timeOrDay: local("08:00 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your accommodation in Varkala.") },
        { timeOrDay: local("09:45 AM"), activity: local("Arrival"), desc: local("Arrival at Neyyar Dam and reservoir check-point.") },
        { timeOrDay: local("10:00 AM - 12:30 PM"), activity: local("Dam & Boating"), desc: local("Explore the dam, gardens, viewpoints, and optional lake boat ride.") },
        { timeOrDay: local("12:45 PM"), activity: local("Lunch"), desc: local("Lunch at a local restaurant (optional).") },
        { timeOrDay: local("02:00 PM - 03:30 PM"), activity: local("Wildlife Park"), desc: local("Visit Lion Safari Park, Crocodile Rehabilitation Centre, and Deer Park.") },
        { timeOrDay: local("04:00 PM"), activity: local("Return"), desc: local("Begin return journey back to Varkala.") },
        { timeOrDay: local("05:30 PM"), activity: local("Drop-off"), desc: local("Drop-off at your accommodation.") }
      ]
    });
    await p6.save();
    console.log("✅ Seeded p6");

    console.log("🌿 Seeding Package 7: Houseboat Cruises...");
    const p7 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "houseboat-cruises-from-varkala",
      price: 6500,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
      duration: local("11 Hours"),
      travelTime: local("1.5 to 2.5 Hours each way"),
      entryFee: local("Houseboat rental included (options available)"),
      optionalCharges: local("Premium houseboat upgrades / overnight options"),
      difficulty: local("Easy"),
      groupSize: local("2-15 People"),
      location: local("Alleppey or Kollam Backwaters, Kerala"),

      title: local("Houseboat Cruises from Varkala"),
      tagline: local("Experience Kerala's Famous Backwaters in Alleppey & Kollam"),
      shortDescription: local(
        "Discover the timeless beauty of Kerala's backwaters with our Houseboat Cruises. Choose between the classic narrow canals of Alleppey or the peaceful uncrowded Ashtamudi Lake in Kollam."
      ),
      aboutText: local(
        "Discover the timeless beauty of Kerala's backwaters with our Houseboat Cruises from Varkala. Whether you choose the vibrant canals of Alleppey (Alappuzha) or the peaceful waters of Kollam's Ashtamudi Lake, every cruise offers a unique opportunity to experience Kerala's breathtaking landscapes, traditional village life, delicious local cuisine, and world-famous houseboat hospitality.\n\nA Kerala houseboat cruise is more than a sightseeing trip—it's a journey through tranquil waterways, lush coconut groves, paddy fields, fishing villages, and mangrove forests aboard a beautifully crafted traditional Kettuvallam. Relax on the sun deck, enjoy freshly prepared Kerala meals, and watch everyday life unfold along the banks as your houseboat glides through the backwaters."
      ),
      tourOverview: local(
        "Villa Lemon offers carefully selected houseboat experiences from both Alleppey and Kollam, allowing you to choose the destination that best suits your travel style. Alleppey is best for first-time visitors, honeymoon couples, and classic canal cruising. Kollam is best for nature lovers, peaceful and less crowded cruises, bird watching, and exploring Ashtamudi Lake."
      ),
      bestTime: local("September to May (Cool and pleasant breeze)"),
      dressCode: local("Casual holiday wear"),
      cta: local("Book Houseboat Cruise"),

      highlights: [
        { icon: "compass", label: local("Private or shared houseboat options available") },
        { icon: "compass", label: local("Choice of Alleppey or Kollam backwater networks") },
        { icon: "compass", label: local("Traditional Kerala meals prepared fresh onboard") },
        { icon: "compass", label: local("Cruise through coconut plantations and green paddy fields") },
        { icon: "compass", label: local("Observe local fishing villages and water canals") },
        { icon: "compass", label: local("Bird watching and nature photography") },
        { icon: "compass", label: local("Comfortable private transportation from Varkala") },
        { icon: "compass", label: local("Ideal for couples, families, and honeymooners") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Fresh Local Food"), desc: local("Enjoy authentic local pearl spot fish fry and Kerala red rice cooked fresh by the onboard chef.") },
        { icon: "star", title: local("Top-tier Houseboats"), desc: local("We collaborate with safe, certified, premium houseboat operators for maximum hygiene and comfort.") }
      ],

      quickFacts: [
        { key: local("Cruise Duration"), value: local("5 to 6 Hours") },
        { key: local("Meal Type"), value: local("Traditional Kerala Lunch") },
        { key: local("Boat Type"), value: local("Traditional Kettuvallam") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off from Varkala"),
        local("Private transportation"),
        local("Houseboat cruise"),
        local("Welcome drink & traditional Kerala lunch"),
        local("Onboard crew & guide support"),
        local("Drinking water")
      ],

      exclusions: [
        local("Personal expenses"),
        local("Optional activities"),
        local("Additional beverages"),
        local("Tips and gratuities")
      ],

      thingsToBring: [
        local("Sunglasses and sunscreen"),
        local("Camera with spare battery"),
        local("Personal medications")
      ],

      nearbyAttractions: [
        { name: local("Alleppey Beach"), distance: local("5 km") },
        { name: local("Munroe Island (Kollam route)"), distance: local("2 km") }
      ],

      faqs: [
        { question: local("Which is better: Alleppey or Kollam?"), answer: local("Alleppey offers the classic narrow canal network. Kollam offers a much quieter, open lake experience.") },
        { question: local("Are meals included?"), answer: local("Yes, a traditional Kerala lunch and evening tea are cooked fresh and served onboard.") }
      ],

      itinerary: [
        { timeOrDay: local("08:00 AM"), activity: local("Departure"), desc: local("Private AC pick up from Villa Lemon towards Alleppey or Kollam.") },
        { timeOrDay: local("10:30 AM"), activity: local("Boarding"), desc: local("Welcome drink and check-in onboard your private houseboat.") },
        { timeOrDay: local("11:00 AM - 01:00 PM"), activity: local("Morning Cruise"), desc: local("Glide past coconut groves, village shores, and watch local life.") },
        { timeOrDay: local("01:00 PM - 02:00 PM"), activity: local("Lunch"), desc: local("Onboard chef serves hot traditional Kerala lunch.") },
        { timeOrDay: local("02:00 PM - 04:00 PM"), activity: local("Afternoon Cruise"), desc: local("Explore deep backwater canals, birdwatching, and tea snacks.") },
        { timeOrDay: local("04:30 PM"), activity: local("Checkout"), desc: local("Check out from houseboat, meet your driver.") },
        { timeOrDay: local("05:00 PM"), activity: local("Return"), desc: local("Return private transfer back to Varkala.") },
        { timeOrDay: local("07:30 PM"), activity: local("Arrival"), desc: local("Arrival back at Villa Lemon.") }
      ]
    });
    await p7.save();
    console.log("✅ Seeded p7");

    console.log("🌿 Seeding Package 8: Elephant Farm & Kayaking Tour...");
    const p8 = new PackageItem({
      packageCategory: ["dayTrips"],
      slug: "elephant-farm-mangrove-kayaking",
      price: 3600,
      pricePeriod: local("/ person"),
      image: "https://images.unsplash.com/photo-1609137144813-979435b2b2b6?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1609137144813-979435b2b2b6?auto=format&fit=crop&w=1200&q=80",
      duration: local("5.5 Hours"),
      travelTime: local("30 Minutes each way"),
      entryFee: local("Elephant farm entry not included"),
      optionalCharges: local("Elephant feeding and shower optional fees"),
      difficulty: local("Easy"),
      groupSize: local("2-10 People"),
      location: local("Varkala Backwaters, Kerala"),

      title: local("Kaveri Elephant Farm & Mangrove Forest Kayaking Tour from Varkala"),
      tagline: local("An Unforgettable Wildlife and Nature Adventure"),
      shortDescription: local(
        "Combine adventure, wildlife, and nature on one unforgettable journey from Varkala. Paddle through peaceful mangrove forests and meet elephants at Kaveri Elephant Farm."
      ),
      aboutText: local(
        "Experience one of the most unique day trips from Varkala with our Kaveri Elephant Farm & Mangrove Forest Kayaking Tour. This carefully designed half-day adventure combines an exciting guided kayaking experience through Kerala's peaceful mangrove forests with an unforgettable visit to Kaveri Elephant Farm, where you'll meet and learn about these magnificent gentle giants.\n\nPerfect for couples, families, nature lovers, photographers, and adventure seekers, this tour offers the ideal combination of outdoor adventure, wildlife encounters, and authentic Kerala experiences. Paddle through tranquil backwaters surrounded by lush mangrove forests before spending quality time with elephants in a natural environment."
      ),
      tourOverview: local(
        "Your adventure begins early in the morning with pickup from Villa Lemon or your accommodation in Varkala. Travel to the beautiful mangrove forest, where your experienced guide will provide a safety briefing before beginning your kayaking journey. Paddle through narrow waterways surrounded by dense mangrove forests while enjoying the peaceful atmosphere, spotting native birds, and discovering one of Kerala's most fascinating ecosystems. After kayaking, continue to Kaveri Elephant Farm, where you'll have the opportunity to observe elephants up close, learn about their daily care, take memorable photographs, and enjoy a unique wildlife experience in a beautiful natural setting."
      ),
      bestTime: local("Early Morning (Cooler temperatures, best bird watching)"),
      dressCode: local("Quick-dry athletic wear"),
      cta: local("Book Elephant & Kayak Tour"),

      highlights: [
        { icon: "compass", label: local("Guided Mangrove Forest Kayaking") },
        { icon: "compass", label: local("Visit Kaveri Elephant Farm") },
        { icon: "compass", label: local("Meet and interact with elephants") },
        { icon: "compass", label: local("Bird watching and wildlife photography") },
        { icon: "compass", label: local("Explore Kerala's unique mangrove ecosystem") },
        { icon: "compass", label: local("Peaceful backwater adventure") },
        { icon: "compass", label: local("Private transportation from Varkala") },
        { icon: "compass", label: local("Suitable for beginners") }
      ],

      whyGuestsLoveUs: [
        { icon: "star", title: local("Half-Day Express"), desc: local("Explore both the elephants and mangroves in just 5.5 hours, leaving your afternoon completely free.") },
        { icon: "star", title: local("Novice Paddlers Welcome"), desc: local("Calm backwaters and steady double kayaks make this a fun, beginner-safe trip.") }
      ],

      quickFacts: [
        { key: local("Tour Duration"), value: local("5.5 Hours") },
        { key: local("Start Time"), value: local("06:30 AM (Recommended)") },
        { key: local("Kayaking duration"), value: local("2 Hours") }
      ],

      inclusions: [
        local("Hotel pickup and drop-off"),
        local("Private air-conditioned transportation"),
        local("Guided kayaking experience"),
        local("Kayak, paddle, and life jacket"),
        local("Professional local guide"),
        local("Drinking water")
      ],

      exclusions: [
        local("Elephant activities (if charged separately)"),
        local("Entry fees (where applicable)"),
        local("Meals and refreshments"),
        local("Personal expenses"),
        local("Travel insurance")
      ],

      thingsToBring: [
        local("Comfortable quick-dry clothing"),
        local("Towel & change of clothes"),
        local("Sun hat & sunglasses"),
        local("Waterproof phone case")
      ],

      nearbyAttractions: [
        { name: local("Kappil Beach"), distance: local("6 km") },
        { name: local("Varkala Cliff"), distance: local("8 km") }
      ],

      faqs: [
        { question: local("Do I need kayaking experience?"), answer: local("No, our guides provide a complete safety briefing and instructions before launch.") },
        { question: local("Can I interact with the elephants?"), answer: local("Yes! Interaction options are available depending on the daily schedule.") }
      ],

      itinerary: [
        { timeOrDay: local("06:30 AM"), activity: local("Pickup"), desc: local("Pickup from Villa Lemon or your accommodation in Varkala.") },
        { timeOrDay: local("07:00 AM - 09:00 AM"), activity: local("Kayaking"), desc: local("Guided kayaking experience & birdwatching in mangrove forest.") },
        { timeOrDay: local("09:15 AM"), activity: local("Tea Break"), desc: local("Tea or coffee break at a local village shop (optional).") },
        { timeOrDay: local("09:45 AM - 11:15 AM"), activity: local("Elephant Farm"), desc: local("Visit Kaveri Elephant Farm, learn Care, take pictures.") },
        { timeOrDay: local("11:30 AM"), activity: local("Return"), desc: local("Begin return journey back to Varkala.") },
        { timeOrDay: local("12:00 PM"), activity: local("Drop-off"), desc: local("Drop-off at your accommodation.") }
      ]
    });
    await p8.save();
    console.log("✅ Seeded p8");

    console.log("🎉 All 8 dayTrips packages seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

run();
