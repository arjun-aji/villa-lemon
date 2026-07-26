import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Accommodation } from "../models/Accommodation";
import { Package } from "../models/Package";
import { YogaProgram, Teacher } from "../models/Yoga";
import { Homepage } from "../models/Homepage";
import { AccommodationItem } from "../models/AccommodationItem";
import { PackageItem } from "../models/PackageItem";
import { YogaItem } from "../models/YogaItem";
import { uploadImage } from "../utils/cloudinaryUpload";

// Load environment variables
dotenv.config();

const MESSAGES_DIR = path.resolve(__dirname, "../../../messages");
const ASSETS_DIR = path.resolve(__dirname, "../../../public/assets");

// Helper to load translation JSON files
const loadTranslations = (locale: string) => {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Translation file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// Helper to check if file exists and upload to Cloudinary
const uploadLocalImage = async (filename: string, folder: string): Promise<{ url: string; publicId: string }> => {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Asset file not found: ${filePath}`);
  }

  console.log(`[migration]: Uploading ${filename} to Cloudinary folder 'villa-lemon/${folder}'...`);
  const fileBuffer = fs.readFileSync(filePath);
  const result = await uploadImage(fileBuffer, folder);
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const runMigration = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    console.log("[migration]: Cleaning existing data in Mongoose collections...");
    await User.deleteMany({});
    await Accommodation.deleteMany({});
    await Package.deleteMany({});
    await YogaProgram.deleteMany({});
    await Teacher.deleteMany({});
    await Homepage.deleteMany({});
    await AccommodationItem.deleteMany({});
    await PackageItem.deleteMany({});
    await YogaItem.deleteMany({});
    console.log("[migration]: Collections cleared.");

    // 2. Load translations from Next.js messages files
    console.log("[migration]: Loading localized translation texts...");
    const en = loadTranslations("en");
    const de = loadTranslations("de");
    const fr = loadTranslations("fr");
    const ru = loadTranslations("ru");

    // 3. Upload all image assets to Cloudinary
    console.log("[migration]: Uploading assets to Cloudinary...");
    const images = {
      aboutSunset: await uploadLocalImage("about_sunset.png", "about"),
      aboutInterior: await uploadLocalImage("about_interior.png", "about"),
      aboutQuoteBg: await uploadLocalImage("about_quote_bg.png", "about"),
      villaEntire: await uploadLocalImage("villa_entire.png", "villas"),
      villaTerrace: await uploadLocalImage("villa_terrace.png", "villas"),
      villaRoom: await uploadLocalImage("villa_room.png", "villas"),
      packageVarkala: await uploadLocalImage("package_varkala.png", "packages"),
      packageDaytrips: await uploadLocalImage("package_daytrips.png", "packages"),
      packageHouseboat: await uploadLocalImage("package_houseboat.png", "packages"),
      packageAdventure: await uploadLocalImage("package_adventure.png", "packages"),
      yogaRetreats: await uploadLocalImage("yoga_retreats.png", "yoga"),
      yogaClasses: await uploadLocalImage("yoga_classes.png", "yoga"),
      yogaPrivate: await uploadLocalImage("yoga_private.png", "yoga"),
      yogaTeachers: await uploadLocalImage("yoga_teachers.png", "yoga"),
    };
    console.log("[migration]: All image assets uploaded to Cloudinary successfully.");

    // 4. Seed initial Admin User
    console.log("[migration]: Seeding initial admin user...");
    const adminUser = new User({
      name: "Villa Lemon Admin",
      email: "admin@villalemon.com",
      password: "adminpassword123", // Will be hashed by pre-save hook
      role: "admin",
    });
    await adminUser.save();
    console.log("[migration]: Admin user created successfully. Email: admin@villalemon.com / Password: adminpassword123");

    // 5. Seed Homepage texts (Hero, Highlights, About)
    console.log("[migration]: Seeding Homepage dynamic contents...");
    const homepage = new Homepage({
      hero: {
        tagline: { en: en.Hero.tagline, de: de.Hero.tagline, fr: fr.Hero.tagline, ru: ru.Hero.tagline },
        headingPart1: { en: en.Hero.headingPart1, de: de.Hero.headingPart1, fr: fr.Hero.headingPart1, ru: ru.Hero.headingPart1 },
        headingPart2: { en: en.Hero.headingPart2, de: de.Hero.headingPart2, fr: fr.Hero.headingPart2, ru: ru.Hero.headingPart2 },
        nature: { en: en.Hero.nature, de: de.Hero.nature, fr: fr.Hero.nature, ru: ru.Hero.nature },
        description: { en: en.Hero.description, de: de.Hero.description, fr: fr.Hero.description, ru: ru.Hero.description },
        bookStay: { en: en.Hero.bookStay, de: de.Hero.bookStay, fr: fr.Hero.bookStay, ru: ru.Hero.bookStay },
        whatsappBooking: { en: en.Hero.whatsappBooking, de: de.Hero.whatsappBooking, fr: fr.Hero.whatsappBooking, ru: ru.Hero.whatsappBooking },
        imageAlt: { en: en.Hero.imageAlt, de: de.Hero.imageAlt, fr: fr.Hero.imageAlt, ru: ru.Hero.imageAlt },
      },
      highlights: {
        premiumVillasTitle: { en: en.HighlightsBar.premiumVillasTitle, de: de.HighlightsBar.premiumVillasTitle, fr: fr.HighlightsBar.premiumVillasTitle, ru: ru.HighlightsBar.premiumVillasTitle },
        premiumVillasSubtitle: { en: en.HighlightsBar.premiumVillasSubtitle, de: de.HighlightsBar.premiumVillasSubtitle, fr: fr.HighlightsBar.premiumVillasSubtitle, ru: ru.HighlightsBar.premiumVillasSubtitle },
        greatLocationsTitle: { en: en.HighlightsBar.greatLocationsTitle, de: de.HighlightsBar.greatLocationsTitle, fr: fr.HighlightsBar.greatLocationsTitle, ru: ru.HighlightsBar.greatLocationsTitle },
        greatLocationsSubtitle: { en: en.HighlightsBar.greatLocationsSubtitle, de: de.HighlightsBar.greatLocationsSubtitle, fr: fr.HighlightsBar.greatLocationsSubtitle, ru: ru.HighlightsBar.greatLocationsSubtitle },
        wellnessTitle: { en: en.HighlightsBar.wellnessTitle, de: de.HighlightsBar.wellnessTitle, fr: fr.HighlightsBar.wellnessTitle, ru: ru.HighlightsBar.wellnessTitle },
        wellnessSubtitle: { en: en.HighlightsBar.wellnessSubtitle, de: de.HighlightsBar.wellnessSubtitle, fr: fr.HighlightsBar.wellnessSubtitle, ru: ru.HighlightsBar.wellnessSubtitle },
      },
      about: {
        tagline: { en: en.About.tagline, de: de.About.tagline, fr: fr.About.tagline, ru: ru.About.tagline },
        heading: { en: en.About.heading, de: de.About.heading, fr: fr.About.heading, ru: ru.About.heading },
        paragraph1: { en: en.About.paragraph1, de: de.About.paragraph1, fr: fr.About.paragraph1, ru: ru.About.paragraph1 },
        paragraph2: { en: en.About.paragraph2, de: de.About.paragraph2, fr: fr.About.paragraph2, ru: ru.About.paragraph2 },
        button: { en: en.About.button, de: de.About.button, fr: fr.About.button, ru: ru.About.button },
        natureTitle: { en: en.About.natureTitle, de: de.About.natureTitle, fr: fr.About.natureTitle, ru: ru.About.natureTitle },
        natureDesc: { en: en.About.natureDesc, de: de.About.natureDesc, fr: fr.About.natureDesc, ru: ru.About.natureDesc },
        luxuryTitle: { en: en.About.luxuryTitle, de: de.About.luxuryTitle, fr: fr.About.luxuryTitle, ru: ru.About.luxuryTitle },
        luxuryDesc: { en: en.About.luxuryDesc, de: de.About.luxuryDesc, fr: fr.About.luxuryDesc, ru: ru.About.luxuryDesc },
        serviceTitle: { en: en.About.serviceTitle, de: de.About.serviceTitle, fr: fr.About.serviceTitle, ru: ru.About.serviceTitle },
        serviceDesc: { en: en.About.serviceDesc, de: de.About.serviceDesc, fr: fr.About.serviceDesc, ru: ru.About.serviceDesc },
        everyoneTitle: { en: en.About.everyoneTitle, de: de.About.everyoneTitle, fr: fr.About.everyoneTitle, ru: ru.About.everyoneTitle },
        everyoneDesc: { en: en.About.everyoneDesc, de: de.About.everyoneDesc, fr: fr.About.everyoneDesc, ru: ru.About.everyoneDesc },
        quoteText: { en: en.About.quoteText, de: de.About.quoteText, fr: fr.About.quoteText, ru: ru.About.quoteText },
        quoteAuthor: { en: en.About.quoteAuthor, de: de.About.quoteAuthor, fr: fr.About.quoteAuthor, ru: ru.About.quoteAuthor },
        statsVillasLabel: { en: en.About.statsVillasLabel, de: de.About.statsVillasLabel, fr: fr.About.statsVillasLabel, ru: ru.About.statsVillasLabel },
        statsGuestsLabel: { en: en.About.statsGuestsLabel, de: de.About.statsGuestsLabel, fr: fr.About.statsGuestsLabel, ru: ru.About.statsGuestsLabel },
        statsRatingLabel: { en: en.About.statsRatingLabel, de: de.About.statsRatingLabel, fr: fr.About.statsRatingLabel, ru: ru.About.statsRatingLabel },
        statsLocationLabel: { en: en.About.statsLocationLabel, de: de.About.statsLocationLabel, fr: fr.About.statsLocationLabel, ru: ru.About.statsLocationLabel },
      },
    });
    await homepage.save();
    console.log("[migration]: Homepage seed saved.");

    // 6. Seed Accommodations (Villas, Floors, Rooms Category Cards)
    console.log("[migration]: Seeding Accommodations dynamic contents...");
    const accommodationsData = [
      {
        type: "villa" as const,
        title: { en: en.Accommodations.villaTitle, de: de.Accommodations.villaTitle, fr: fr.Accommodations.villaTitle, ru: ru.Accommodations.villaTitle },
        description: { en: en.Accommodations.villaDesc, de: de.Accommodations.villaDesc, fr: fr.Accommodations.villaDesc, ru: ru.Accommodations.villaDesc },
        price: { en: en.Accommodations.villaPrice, de: de.Accommodations.villaPrice, fr: fr.Accommodations.villaPrice, ru: ru.Accommodations.villaPrice },
        image: images.villaEntire.url,
        imagePublicId: images.villaEntire.publicId,
        explore: { en: en.Accommodations.villaExplore, de: de.Accommodations.villaExplore, fr: fr.Accommodations.villaExplore, ru: ru.Accommodations.villaExplore },
        href: "/accommodation/villas",
      },
      {
        type: "floor" as const,
        title: { en: en.Accommodations.floorTitle, de: de.Accommodations.floorTitle, fr: fr.Accommodations.floorTitle, ru: ru.Accommodations.floorTitle },
        description: { en: en.Accommodations.floorDesc, de: de.Accommodations.floorDesc, fr: fr.Accommodations.floorDesc, ru: ru.Accommodations.floorDesc },
        price: { en: en.Accommodations.floorPrice, de: de.Accommodations.floorPrice, fr: fr.Accommodations.floorPrice, ru: ru.Accommodations.floorPrice },
        image: images.villaTerrace.url,
        imagePublicId: images.villaTerrace.publicId,
        explore: { en: en.Accommodations.floorExplore, de: de.Accommodations.floorExplore, fr: fr.Accommodations.floorExplore, ru: ru.Accommodations.floorExplore },
        href: "/accommodation/floors",
      },
      {
        type: "room" as const,
        title: { en: en.Accommodations.roomTitle, de: de.Accommodations.roomTitle, fr: fr.Accommodations.roomTitle, ru: ru.Accommodations.roomTitle },
        description: { en: en.Accommodations.roomDesc, de: de.Accommodations.roomDesc, fr: fr.Accommodations.roomDesc, ru: ru.Accommodations.roomDesc },
        price: { en: en.Accommodations.roomPrice, de: de.Accommodations.roomPrice, fr: fr.Accommodations.roomPrice, ru: ru.Accommodations.roomPrice },
        image: images.villaRoom.url,
        imagePublicId: images.villaRoom.publicId,
        explore: { en: en.Accommodations.roomExplore, de: de.Accommodations.roomExplore, fr: fr.Accommodations.roomExplore, ru: ru.Accommodations.roomExplore },
        href: "/accommodation/rooms",
      },
    ];
    await Accommodation.insertMany(accommodationsData);
    console.log("[migration]: Accommodations categories seed saved.");

    // 7. Seed Packages Category Cards
    console.log("[migration]: Seeding Packages dynamic contents...");
    const packagesData = [
      {
        category: "varkalaSightseeing",
        title: { en: en.Packages.varkalaTitle, de: de.Packages.varkalaTitle, fr: fr.Packages.varkalaTitle, ru: ru.Packages.varkalaTitle },
        description: { en: en.Packages.varkalaDesc, de: de.Packages.varkalaDesc, fr: fr.Packages.varkalaDesc, ru: ru.Packages.varkalaDesc },
        image: images.packageVarkala.url,
        imagePublicId: images.packageVarkala.publicId,
        explore: { en: en.Packages.varkalaExplore, de: de.Packages.varkalaExplore, fr: fr.Packages.varkalaExplore, ru: ru.Packages.varkalaExplore },
        href: "/packages/varkala-sightseeing",
      },
      {
        category: "dayTrips",
        title: { en: en.Packages.daytripsTitle, de: de.Packages.daytripsTitle, fr: fr.Packages.daytripsTitle, ru: ru.Packages.daytripsTitle },
        description: { en: en.Packages.daytripsDesc, de: de.Packages.daytripsDesc, fr: fr.Packages.daytripsDesc, ru: ru.Packages.daytripsDesc },
        image: images.packageDaytrips.url,
        imagePublicId: images.packageDaytrips.publicId,
        explore: { en: en.Packages.daytripsExplore, de: de.Packages.daytripsExplore, fr: fr.Packages.daytripsExplore, ru: ru.Packages.daytripsExplore },
        href: "/packages/day-trips",
      },
      {
        category: "backwaterExperiences",
        title: { en: en.Packages.backwaterTitle, de: de.Packages.backwaterTitle, fr: fr.Packages.backwaterTitle, ru: ru.Packages.backwaterTitle },
        description: { en: en.Packages.backwaterDesc, de: de.Packages.backwaterDesc, fr: fr.Packages.backwaterDesc, ru: ru.Packages.backwaterDesc },
        image: images.packageHouseboat.url,
        imagePublicId: images.packageHouseboat.publicId,
        explore: { en: en.Packages.backwaterExplore, de: de.Packages.backwaterExplore, fr: fr.Packages.backwaterExplore, ru: ru.Packages.backwaterExplore },
        href: "/packages/backwater-experiences",
      },
      {
        category: "adventureActivities",
        title: { en: en.Packages.adventureTitle, de: de.Packages.adventureTitle, fr: fr.Packages.adventureTitle, ru: ru.Packages.adventureTitle },
        description: { en: en.Packages.adventureDesc, de: de.Packages.adventureDesc, fr: fr.Packages.adventureDesc, ru: ru.Packages.adventureDesc },
        image: images.packageAdventure.url,
        imagePublicId: images.packageAdventure.publicId,
        explore: { en: en.Packages.adventureExplore, de: de.Packages.adventureExplore, fr: fr.Packages.adventureExplore, ru: ru.Packages.adventureExplore },
        href: "/packages/adventure-activities",
      },
    ];
    await Package.insertMany(packagesData);
    console.log("[migration]: Packages categories seed saved.");

    // 8. Seed Yoga Programs Category Cards
    console.log("[migration]: Seeding Yoga dynamic contents...");
    const yogaData = [
      {
        type: "retreats" as const,
        title: { en: en.Yoga.retreatsTitle, de: de.Yoga.retreatsTitle, fr: fr.Yoga.retreatsTitle, ru: ru.Yoga.retreatsTitle },
        description: { en: en.Yoga.retreatsDesc, de: de.Yoga.retreatsDesc, fr: fr.Yoga.retreatsDesc, ru: ru.Yoga.retreatsDesc },
        image: images.yogaRetreats.url,
        imagePublicId: images.yogaRetreats.publicId,
        explore: { en: en.Yoga.retreatsExplore, de: de.Yoga.retreatsExplore, fr: fr.Yoga.retreatsExplore, ru: ru.Yoga.retreatsExplore },
        href: "/yoga/yoga-retreats",
      },
      {
        type: "classes" as const,
        title: { en: en.Yoga.classesTitle, de: de.Yoga.classesTitle, fr: fr.Yoga.classesTitle, ru: ru.Yoga.classesTitle },
        description: { en: en.Yoga.classesDesc, de: de.Yoga.classesDesc, fr: fr.Yoga.classesDesc, ru: ru.Yoga.classesDesc },
        image: images.yogaClasses.url,
        imagePublicId: images.yogaClasses.publicId,
        explore: { en: en.Yoga.classesExplore, de: de.Yoga.classesExplore, fr: fr.Yoga.classesExplore, ru: ru.Yoga.classesExplore },
        href: "/yoga/daily-yoga-classes",
      },
      {
        type: "private" as const,
        title: { en: en.Yoga.privateTitle, de: de.Yoga.privateTitle, fr: fr.Yoga.privateTitle, ru: ru.Yoga.privateTitle },
        description: { en: en.Yoga.privateDesc, de: de.Yoga.privateDesc, fr: fr.Yoga.privateDesc, ru: ru.Yoga.privateDesc },
        image: images.yogaPrivate.url,
        imagePublicId: images.yogaPrivate.publicId,
        explore: { en: en.Yoga.privateExplore, de: de.Yoga.privateExplore, fr: fr.Yoga.privateExplore, ru: ru.Yoga.privateExplore },
        href: "/yoga/private-yoga-sessions",
      },
    ];
    await YogaProgram.insertMany(yogaData);

    // Seeding Teacher (Single Profile showcase entry for daily classes)
    const teacher = new Teacher({
      name: "Acharya Vishnu",
      role: {
        en: "Lead Yoga Acharya & Meditation Guide",
        de: "Leitender Yoga Acharya & Meditationsleiter",
        fr: "Directeur Yoga Acharya & Guide de Méditation",
        ru: "Ведущий йога-ачарья и гид по медитации",
      },
      bio: {
        en: "Vishnu has over 15 years of experience in Hatha and Ashtanga yoga, helping travelers explore mindfulness closer to nature.",
        de: "Vishnu verfügt über mehr als 15 Jahre Erfahrung in Hatha- und Ashtanga-Yoga und hilft Reisenden, Achtsamkeit näher an der Natur zu entdecken.",
        fr: "Vishnu a plus de 15 ans d'expérience dans le Hatha et l'Ashtanga yoga, aidant les voyageurs à explorer la pleine conscience au plus près de la nature.",
        ru: "Вишну имеет более 15 лет опыта в хатха и аштанга йоге, помогая путешественникам познавать осознанность ближе к природе.",
      },
      image: images.yogaTeachers.url,
      imagePublicId: images.yogaTeachers.publicId,
    });
    await teacher.save();
    console.log("[migration]: Yoga Programs and Teacher seed saved.");

    // ========================================================
    // 9. NEW: Seed Specific Accommodation Items (Villas / Rooms)
    // ========================================================
    console.log("[migration]: Seeding Accommodation individual properties...");
    const sampleVillas = [
      {
        slug: "lemon-grove-villa",
        accommodationType: "villa" as const,
        title: { en: "Lemon Grove Villa", de: "Zitronenhain-Villa", fr: "Villa Citronneraie", ru: "Вилла Лимонная роща" },
        price: 24500,
        pricePeriod: { en: "/ night", de: "/ Nacht", fr: "/ nuit", ru: "/ ночь" },
        image: images.villaEntire.url,
        imagePublicId: images.villaEntire.publicId,
        aboutImage: images.aboutSunset.url,
        aboutImagePublicId: images.aboutSunset.publicId,
        bedrooms: 4,
        bathrooms: 4,
        guests: 8,
        location: { en: "Varkala, Kerala", de: "Varkala, Kerala", fr: "Varkala, Kerala", ru: "Варкала, Керала" },
        shortDescription: {
          en: "A stunning villa with private pool, lush garden and breathtaking sea views.",
          de: "Eine atemberaubende Villa mit privatem Pool, üppigem Garten und atemberaubendem Meerblick.",
          fr: "Une superbe villa avec piscine privée, jardin luxuriant et vue imprenable sur la mer.",
          ru: "Потрясающая вилла с собственным бассейном, пышным садом и захватывающим видом на море."
        },
        tagline: {
          en: "Unrivaled ocean breezes and lush gardens surrounding your private pool sanctuary.",
          de: "Unvergleichliche Meeresbrise und üppige Gärten umgeben Ihre private Pool-Oase.",
          fr: "Brises océaniques inégalées et jardins luxuriants entourent votre sanctuaire de piscine privée.",
          ru: "Неповторимый морской бриз и пышные сады окружают ваш уединенный бассейн."
        },
        aboutText1: {
          en: "Welcome to Lemon Grove Villa, the crown jewel of our homestays. Nestled just steps away from the peaceful Varkala cliffs, this four-bedroom estate offers travelers looking for privacy the ultimate refuge.",
          de: "Willkommen in der Lemon Grove Villa, dem Kronjuwel unserer Unterkünfte. Nur wenige Schritte von den friedlichen Klippen von Varkala entfernt bietet dieses Anwesen mit vier Schlafzimmern Reisenden, die Privatsphäre suchen, die ultimative Zuflucht.",
          fr: "Bienvenue à la Lemon Grove Villa, le joyau de nos séjours chez l'habitant. Nichée à quelques pas des falaises paisibles de Varkala, cette propriété de quatre chambres offre aux voyageurs en quête d'intimité le refuge ultime.",
          ru: "Добро пожаловать на виллу Лимонная роща, жемчужину наших гостевых домов. Расположенное всего в нескольких шагах от тихих скал Варкалы, это поместье с 4 спальнями предлагает путешественникам, ищущим уединения, идеальное прибежище."
        },
        aboutText2: {
          en: "Equipped with custom premium furniture, a completely private infinity-style swimming pool, and a rooftop sun terrace, you can enjoy twilight views of the Laccadive Sea in absolute comfort and silence.",
          de: "Ausgestattet mit maßgeschneiderten Premium-Möbeln, einem komplett privaten Infinity-Pool und einer Dachterrasse können Sie bei Einbruch der Dunkelheit die Aussicht auf das Lakadiven-Meer in absolutem Komfort und Stille genießen.",
          fr: "Équipé de meubles de qualité sur mesure, d'une piscine à débordement entièrement privée et d'une terrasse sur le toit, vous pourrez profiter de la vue crépusculaire sur la mer des Laquedives dans un confort et un silence absolus.",
          ru: "Оснащенный дизайнерской мебелью премиум-класса, полностью частным пейзажным бассейном и террасой на крыше для загара, вы сможете наслаждаться сумеречными видами на Лаккадивское море в абсолютном комфорте и тишине."
        },
        perfectLocationText: {
          en: "Positioned in a serene residential enclave, yet within walking distance to famous clifftop eateries, local art boutiques, and the tranquil Black Beach.",
          de: "In einer ruhigen Wohngegend gelegen, aber dennoch in Gehweite zu berühmten Klippenrestaurants, lokalen Kunstboutiquen und dem ruhigen Black Beach.",
          fr: "Situé dans une enclave résidentielle sereine, mais à distance de marche des célèbres restaurants des falaises, des boutiques d'art locales et de la paisible plage de Black Beach.",
          ru: "Расположен в тихом жилом районе, но в пешей доступности от знаменитых ресторанов на вершине скалы, местных арт-бутиков и спокойного Черного пляжа."
        },
        groupAccommodationText: {
          en: "Ideal for family reunions, group yoga packages, and small wellness retreats looking for shared spaces with individual private suites.",
          de: "Ideal für Familientreffen, Gruppen-Yoga-Pakete und kleine Wellness-Retreats, die nach gemeinsamen Räumen mit einzelnen privaten Suiten suchen.",
          fr: "Idéal pour les réunions de famille, les forfaits de yoga de groupe et les petits retraites de bien-être à la recherche d'espaces partagés avec des suites privées individuelles.",
          ru: "Идеально подходит для семейных встреч, групповых йога-туров и небольших оздоровительных ретритов, где требуются общие пространства с отдельными номерами люкс."
        },
        checkInTime: "14:00",
        checkOutTime: "11:00",
        checkInOutRules: [
          { en: "No loud music permitted after 10:00 PM.", de: "Keine laute Musik nach 22:00 Uhr gestattet.", fr: "Pas de musique forte autorisée après 22h00.", ru: "Шумная музыка после 22:00 запрещена." },
          { en: "Eco-friendly recycling rules apply to plastic containers.", de: "Für Kunststoffbehälter gelten umweltfreundliche Recyclingregeln.", fr: "Les règles de recyclage écologiques s'appliquent aux récipients en plastique.", ru: "Применяются правила экологичной переработки пластика." }
        ],
        roomAmenities: [
          { en: "Air Conditioning", de: "Klimaanlage", fr: "Climatisation", ru: "Кондиционер" },
          { en: "Private Pool Access", de: "Privater Poolzugang", fr: "Accès piscine privée", ru: "Собственный бассейн" },
          { en: "Ensuite Luxury Bathrooms", de: "Luxuriöse Ensuite-Bäder", fr: "Salles de bain attenantes de luxe", ru: "Собственные ванные комнаты люкс" },
          { en: "Smart High-Definition TV", de: "Smart-HD-Fernseher", fr: "Téléviseur intelligent HD", ru: "Смарт-телевизор высокой четкости" }
        ],
        idealFor: [
          { en: "Family Vacations", de: "Familienurlaub", fr: "Vacances en famille", ru: "Семейный отдых" },
          { en: "Private Wellness Groups", de: "Private Wellness-Gruppen", fr: "Groupes de bien-être privés", ru: "Частные велнес-группы" }
        ],
        highlights: [
          { icon: "pool", label: { en: "Private Pool", de: "Privater Pool", fr: "Piscine privée", ru: "Частный бассейн" } },
          { icon: "wifi", label: { en: "High-Speed Wi-Fi", de: "Schnelles WLAN", fr: "Wi-Fi haut débit", ru: "Высокоскоростной Wi-Fi" } },
          { icon: "parking", label: { en: "Free Parking", de: "Gratis Parken", fr: "Parking gratuit", ru: "Бесплатная парковка" } }
        ],
        whyGuestsLoveUs: [
          { icon: "shield", title: { en: "24/7 Security", de: "24/7 Sicherheit", fr: "Sécurité 24h/24", ru: "Круглосуточная охрана" }, desc: { en: "Total peace of mind with gated premises and automated intercoms.", de: "Völlige Sorgenfreiheit mit umzäuntem Gelände und automatischer Gegensprechanlage.", fr: "Tranquillité d'esprit totale avec locaux fermés et interphones automatisés.", ru: "Полное спокойствие благодаря закрытой территории и автоматическому домофону." } }
        ],
        distances: [
          { place: { en: "Black Beach", de: "Black Beach", fr: "Black Beach", ru: "Черный пляж" }, distance: { en: "900 m", de: "900 m", fr: "900 m", ru: "900 м" } },
          { place: { en: "Varkala Cliff", de: "Varkala Cliff", fr: "Falaises de Varkala", ru: "Скала Варкала" }, distance: { en: "900 m", de: "900 m", fr: "900 m", ru: "900 м" } }
        ],
        additionalServices: [
          { service: { en: "Airport Pick-up", de: "Flughafentransfer", fr: "Navette aéroport", ru: "Трансфер из аэропорта" }, details: { en: "Available from Trivandrum International Airport (TRV) upon request.", de: "Auf Anfrage vom internationalen Flughafen Trivandrum (TRV) verfügbar.", fr: "Disponible sur demande depuis l'aéroport international de Trivandrum (TRV).", ru: "Предоставляется из международного аэропорта Тривандрам (TRV) по запросу." } }
        ]
      },
      {
        slug: "ocean-whisper-villa",
        accommodationType: "villa" as const,
        title: { en: "Ocean Whisper Villa", de: "Meeresflüstern-Villa", fr: "Villa Murmure d'Océan", ru: "Вилла Шепот океана" },
        price: 21000,
        pricePeriod: { en: "/ night", de: "/ Nacht", fr: "/ nuit", ru: "/ ночь" },
        image: images.villaTerrace.url,
        imagePublicId: images.villaTerrace.publicId,
        aboutImage: images.aboutInterior.url,
        aboutImagePublicId: images.aboutInterior.publicId,
        bedrooms: 3,
        bathrooms: 3,
        guests: 6,
        location: { en: "Varkala, Kerala", de: "Varkala, Kerala", fr: "Varkala, Kerala", ru: "Варкала, Керала" },
        shortDescription: {
          en: "Wake up to the sound of waves in this serene villa with infinity pool.",
          de: "Wachen Sie in dieser ruhigen Villa mit Infinity-Pool zum Rauschen der Wellen auf.",
          fr: "Réveillez-vous au son des vagues dans cette villa sereine avec piscine à débordement.",
          ru: "Просыпайтесь под шум волн на этой безмятежной вилле с панорамным бассейном."
        },
        tagline: {
          en: "Hear the soft symphony of the ocean from every room.",
          de: "Hören Sie die leise Symphonie des Ozeans aus jedem Zimmer.",
          fr: "Écoutez la douce symphonie de l'océan depuis chaque pièce.",
          ru: "Слушайте нежную симфонию океана из каждой комнаты."
        },
        aboutText1: {
          en: "Ocean Whisper Villa integrates coastal modern aesthetics with local wood carvings and open-air layout. Featuring three king-size bedrooms, it is ideal for smaller groups wanting premium comforts.",
          de: "Die Ocean Whisper Villa verbindet moderne Küstenästhetik mit lokalen Holzschnitzereien und einem offenen Layout. Mit drei Kingsize-Schlafzimmern ist sie ideal für kleinere Gruppen, die erstklassigen Komfort wünschen.",
          fr: "La Villa Ocean Whisper associe une esthétique côtière moderne à des sculptures sur bois locales et à un agencement en plein air. Dotée de trois chambres king-size, elle est idéale pour les petits groupes souhaitant un confort haut de gamme.",
          ru: "Вилла Шепот океана сочетает в себе современную прибрежную эстетику с местной резьбой по дереву и открытой планировкой. Имея 3 спальни с двуспальными кроватями, она идеально подходит для небольших групп."
        },
        aboutText2: {
          en: "The highlight of the property is our shared outdoor lounge veranda, flanked by tropical coconut groves and looking out onto the sunset cliffside path.",
          de: "Das Highlight des Anwesens ist unsere gemeinsame Lounge-Veranda im Freien, flankiert von tropischen Kokoshainen und mit Blick auf den Klippenweg zum Sonnenuntergang.",
          fr: "Le point fort de la propriété est notre véranda salon extérieure partagée, flanquée de cocoteraies tropicales et donnant sur le sentier des falaises au coucher du soleil.",
          ru: "Главная изюминка виллы — наша общая открытая веранда для отдыха, окруженная тропическими кокосовыми рощами и выходящая на тропинку у обрыва на закате."
        },
        perfectLocationText: {
          en: "Direct cliffside proximity, offering easy access to surfing points and coastal walks.",
          de: "Direkte Klippennähe, einfacher Zugang zu Surfspots und Küstenwegen.",
          fr: "Proximité directe des falaises, offrant un accès facile aux spots de surf et aux promenades côtières.",
          ru: "Прямая близость к скале, обеспечивающая легкий доступ к местам для серфинга и прогулкам по побережью."
        },
        groupAccommodationText: {
          en: "Can accommodate up to 6 guests comfortably. Ideal for groups of friends or yoga practitioners.",
          de: "Bietet bequem Platz für bis auch 6 Gäste. Ideal für Freundesgruppen oder Yoga-Praktizierende.",
          fr: "Peut accueillir confortablement jusqu'à 6 personnes. Idéal pour des groupes d'amis ou des pratiquants de yoga.",
          ru: "Комфортно вмещает до 6 гостей. Отличный вариант для компании друзей или йогов."
        },
        checkInTime: "13:00",
        checkOutTime: "11:00",
        checkInOutRules: [
          { en: "No pets allowed inside rooms.", de: "Keine Haustiere in den Zimmern erlaubt.", fr: "Animaux non admis à l'intérieur des chambres.", ru: "Размещение с домашними животными в номерах не допускается." }
        ],
        roomAmenities: [
          { en: "Attached Private Bathroom", de: "Eigenes Badezimmer", fr: "Salle de bain privée attenante", ru: "Собственная ванная комната" },
          { en: "Complimentary Wi-Fi Access", de: "Kostenloses WLAN", fr: "Accès Wi-Fi gratuit", ru: "Бесплатный Wi-Fi" }
        ],
        idealFor: [
          { en: "Yoga Retreats", de: "Yoga-Retreats", fr: "Retraites de yoga", ru: "Йога-ретриты" }
        ],
        highlights: [
          { icon: "sunset", label: { en: "Sunset View", de: "Sonnenuntergang", fr: "Vue coucher de soleil", ru: "Вид на закат" } },
          { icon: "pool", label: { en: "Infinity Pool", de: "Infinity-Pool", fr: "Piscine à débordement", ru: "Пейзажный бассейн" } }
        ],
        whyGuestsLoveUs: [
          { icon: "coffee", title: { en: "Organic Breakfast", de: "Bio-Frühstück", fr: "Petit-déjeuner bio", ru: "Органический завтрак" }, desc: { en: "Freshly prepared local delicacies served on your balcony.", de: "Frisch zubereitete lokale Spezialitäten, serviert auf Ihrem Balkon.", fr: "Délices locaux fraîchement préparés servis sur votre balcon.", ru: "Свежеприготовленные местные деликатесы, подаваемые на ваш балкон." } }
        ],
        distances: [
          { place: { en: "Black Beach", de: "Black Beach", fr: "Black Beach", ru: "Черный пляж" }, distance: { en: "500 m", de: "500 m", fr: "500 m", ru: "500 м" } }
        ],
        additionalServices: [
          { service: { en: "Laundry Service", de: "Wäscheservice", fr: "Service de blanchisserie", ru: "Услуги прачечной" }, details: { en: "Same-day turnaround for standard garments.", de: "Rückgabe am selben Tag für Standardkleidung.", fr: "Traitement le jour même pour les vêtements standard.", ru: "Возврат готовой одежды в тот же день." } }
        ]
      },
      {
        slug: "sunset-terrace-floor",
        accommodationType: "floor" as const,
        title: { en: "Sunset Terrace Floor", de: "Sonnenuntergangs-Terrassenetage", fr: "Étage avec Terrasse du Coucher du Soleil", ru: "Этаж с террасой на закате" },
        price: 8500,
        pricePeriod: { en: "/ night", de: "/ Nacht", fr: "/ nuit", ru: "/ ночь" },
        image: images.villaTerrace.url,
        imagePublicId: images.villaTerrace.publicId,
        aboutImage: images.villaTerrace.url,
        aboutImagePublicId: images.villaTerrace.publicId,
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        location: { en: "Varkala, Kerala", de: "Varkala, Kerala", fr: "Varkala, Kerala", ru: "Варкала, Керала" },
        shortDescription: {
          en: "Independent floor with privacy & comfort, ideal for small families.",
          de: "Eigenständige Etage mit Privatsphäre & Komfort, ideal für kleine Familien.",
          fr: "Étage indépendant offrant intimité et confort, idéal pour les petites familles.",
          ru: "Отдельный этаж с высоким уровнем уединения и комфорта, идеальный для небольших семей."
        },
        tagline: {
          en: "Panoramic cliff views and complete privacy on your exclusive floor.",
          de: "Panoramablick auf die Klippen und absolute Privatsphäre auf Ihrer exklusiven Etage.",
          fr: "Vues panoramiques sur les falaises et intimité totale sur votre étage exclusif.",
          ru: "Панорамный вид на скалы и полное уединение на вашем эксклюзивном этаже."
        },
        aboutText1: {
          en: "The Sunset Terrace Floor occupies the entire second level of the homestay. It features private balcony lounge nets and direct staircase entry, meaning you experience the comfort of a villa at half the footprint.",
          de: "Die Sunset Terrace-Etage belegt die gesamte zweite Ebene der Unterkunft. Sie verfügt über private Balkon-Lounge-Netze und einen direkten Treppenzugang, sodass Sie den Komfort einer Villa auf halber Fläche erleben.",
          fr: "L'étage Sunset Terrace occupe l'intégralité du deuxième niveau de notre séjour. Il dispose de filets de détente privés sur le balcon et d'un accès direct par escalier, vous offrant le confort d'une villa sur une surface réduite.",
          ru: "Этаж с террасой на закате занимает весь второй уровень гостевого дома. Он оснащен гамаками на собственном балконе и отдельным входом по лестнице, предлагая комфорт виллы при меньшей площади."
        },
        aboutText2: {
          en: "Enjoy the cool evening breeze and a cup of local cardamom tea while looking out at Varkala's shoreline palm trees.",
          de: "Genießen Sie die kühle Abendbrise und eine Tasse lokalen Kardamomtee, während Sie auf die Palmen an der Küste von Varkala blicken.",
          fr: "Profitez de la brise fraîche de la soirée et d'une tasse de thé à la cardamome locale tout en contemplant les palmiers du littoral de Varkala.",
          ru: "Наслаждайтесь прохладным вечерним бризом и чашечкой местного чая с кардамоном, глядя на прибрежные пальмы Варкалы."
        },
        perfectLocationText: {
          en: "Located on a quiet hillside lane, just minutes away from yoga schools and Ayurvedic massage facilities.",
          de: "In einer ruhigen Hügelgasse gelegen, nur wenige Minuten von Yoga-Schulen und ayurvedischen Massagepraxen entfernt.",
          fr: "Situé dans une ruelle calme à flanc de colline, à quelques minutes des écoles de yoga et des centres de massage ayurvédique.",
          ru: "Расположен в тихом переулке на склоне холма, всего в нескольких минутах от школ йоги и кабинетов аюрведического массажа."
        },
        groupAccommodationText: {
          en: "Perfect for 4 adults or small families. Interconnected room access allows comfortable movements.",
          de: "Perfekt für 4 Erwachsene oder kleine Familien. Zimmer mit Verbindungstür ermöglichen bequeme Abläufe.",
          fr: "Parfait pour 4 adultes ou les petites familles. L'accès aux chambres communicantes permet des déplacements aisés.",
          ru: "Идеально подходит для 4 взрослых или семей с детьми. Смежные комнаты обеспечивают дополнительное удобство."
        },
        checkInTime: "12:00",
        checkOutTime: "11:00",
        checkInOutRules: [
          { en: "Smoking is only permitted on the open terrace balcony.", de: "Rauchen ist nur auf dem offenen Terrassenbalkon gestattet.", fr: "Il est permis de fumer uniquement sur le balcon de la terrasse ouverte.", ru: "Курение разрешено только на открытом балконе террасы." }
        ],
        roomAmenities: [
          { en: "Attached Balcony", de: "Eigener Balkon", fr: "Balcon attenant", ru: "Собственный балкон" },
          { en: "Hot Water System", de: "Warmwassersystem", fr: "Système d'eau chaude", ru: "Система горячего водоснабжения" }
        ],
        idealFor: [
          { en: "Small Families", de: "Kleine Familien", fr: "Petites familles", ru: "Небольшие семьи" }
        ],
        highlights: [
          { icon: "balcony", label: { en: "Terrace Balcony", de: "Terrassenbalkon", fr: "Balcon terrasse", ru: "Балкон-терраса" } }
        ],
        whyGuestsLoveUs: [
          { icon: "chat", title: { en: "Local Hosts", de: "Lokale Gastgeber", fr: "Hôtes locaux", ru: "Местные хозяева" }, desc: { en: "Friendly local insights to help you avoid tourist traps.", de: "Freundliche lokale Einblicke, um Touristenfallen zu vermeiden.", fr: "Conseils locaux avisés pour vous aider à éviter les pièges à touristes.", ru: "Полезные советы от хозяев помогут вам избежать типичных туристических ловушек." } }
        ],
        distances: [
          { place: { en: "Ayurveda center", de: "Ayurveda-Zentrum", fr: "Centre d'Ayurveda", ru: "Аюрведический центр" }, distance: { en: "400 m", de: "400 m", fr: "400 m", ru: "400 м" } }
        ],
        additionalServices: [
          { service: { en: "Bicycle Rental", de: "Fahrradverleih", fr: "Location de vélos", ru: "Прокат велосипедов" }, details: { en: "Geared mountain bikes available at daily rates.", de: "Mountainbikes mit Gangschaltung zu Tagessätzen erhältlich.", fr: "Vélos tout terrain disponibles à des tarifs journaliers.", ru: "Горные велосипеды со скоростями доступны по посуточному тарифу." } }
        ]
      },
      {
        slug: "garden-view-room",
        accommodationType: "room" as const,
        title: { en: "Garden View Room", de: "Gartenblick-Zimmer", fr: "Chambre Vue Jardin", ru: "Номер с видом на сад" },
        price: 3800,
        pricePeriod: { en: "/ night", de: "/ Nacht", fr: "/ nuit", ru: "/ ночь" },
        image: images.villaRoom.url,
        imagePublicId: images.villaRoom.publicId,
        aboutImage: images.aboutInterior.url,
        aboutImagePublicId: images.aboutInterior.publicId,
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        location: { en: "Varkala, Kerala", de: "Varkala, Kerala", fr: "Varkala, Kerala", ru: "Варкала, Керала" },
        shortDescription: {
          en: "Beautifully designed room with all essentials for a relaxing stay.",
          de: "Schön gestaltetes Zimmer mit allen Annehmlichkeiten für einen entspannten Aufenthalt.",
          fr: "Chambre joliment conçue dotée de tout le nécessaire pour un séjour relaxant.",
          ru: "Красиво оформленный номер со всем необходимым для расслабляющего отдыха."
        },
        tagline: {
          en: "Cozy rooms facing tranquil tropical gardens.",
          de: "Gemütliche Zimmer mit Blick auf ruhige tropische Gärten.",
          fr: "Chambres chaleureuses faisant face à des jardins tropicaux tranquilles.",
          ru: "Уютные номера с видом на тихий тропический сад."
        },
        aboutText1: {
          en: "Our Garden View Rooms offer standard premium beds, private ensuite bath with hot water, and a shared patio veranda space. It is highly budget-friendly and designed for solo travelers or couples.",
          de: "Unsere Zimmer mit Gartenblick bieten erstklassige Betten, ein eigenes Bad mit Warmwasser und eine gemeinsame Veranda. Sie sind sehr budgetfreundlich und für Alleinreisende oder Paare konzipiert.",
          fr: "Nos chambres vue jardin proposent des lits de qualité, une salle de bain privée attenante avec eau chaude et une véranda patio partagée. Très économiques, elles sont conçues pour les voyageurs en solo ou les couples.",
          ru: "Наши номера с видом на сад предлагают премиум-кровати, собственную ванную комнату с горячей водой и общую веранду-патио. Это бюджетный и комфортный вариант для соло-путешественников или пар."
        },
        aboutText2: {
          en: "Listen to the birds and enjoy our shared garden hammocks located just outside your window.",
          de: "Lauschen Sie den Vögeln und nutzen Sie unsere Hängematten im Gemeinschaftsgarten direkt vor Ihrem Fenster.",
          fr: "Écoutez le chant des oiseaux et profitez de nos hamacs de jardin partagés situés juste devant votre fenêtre.",
          ru: "Слушайте пение птиц и отдыхайте в гамаках общего сада прямо под вашим окном."
        },
        perfectLocationText: {
          en: "Located in the quiet rear area of our main property, completely isolated from traffic noise.",
          de: "Im ruhigen hinteren Bereich unseres Hauptgrundstücks gelegen, völlig ungestört von Verkehrslärm.",
          fr: "Situé dans la zone arrière calme de notre propriété principale, complètement isolé du bruit de la circulation.",
          ru: "Расположен в тихой задней части нашей территории, полностью изолированной от уличного шума."
        },
        groupAccommodationText: {
          en: "Accommodates up to 2 guests. Extra floor mattress can be requested.",
          de: "Bietet Platz für bis zu 2 Gäste. Eine zusätzliche Bodenmatratze kann angefordert werden.",
          fr: "Accueille jusqu'à 2 personnes. Un matelas de sol supplémentaire peut être demandé.",
          ru: "Размещение до 2 гостей. По запросу может быть предоставлен дополнительный матрас."
        },
        checkInTime: "12:00",
        checkOutTime: "11:00",
        checkInOutRules: [
          { en: "Please switch off AC when leaving the room.", de: "Bitte schalten Sie die Klimaanlage aus, wenn Sie das Zimmer verlassen.", fr: "Veuillez éteindre la climatisation lorsque vous quittez la chambre.", ru: "Пожалуйста, выключайте кондиционер при выходе из номера." }
        ],
        roomAmenities: [
          { en: "Complimentary Water bottle", de: "Kostenlose Flasche Wasser", fr: "Bouteille d'eau gratuite", ru: "Бесплатная бутылка воды" }
        ],
        idealFor: [
          { en: "Solo Travelers", de: "Alleinreisende", fr: "Voyageurs en solo", ru: "Соло-путешественники" }
        ],
        highlights: [
          { icon: "garden", label: { en: "Garden View", de: "Gartenblick", fr: "Vue jardin", ru: "Вид на сад" } }
        ],
        whyGuestsLoveUs: [
          { icon: "star", title: { en: "Super Clean", de: "Supersauber", fr: "Super propre", ru: "Идеальная чистота" }, desc: { en: "Cleanliness verified by exceptional guest feedback.", de: "Sauberkeit durch außergewöhnliches Gästefeedback bestätigt.", fr: "Propreté attestée par les commentaires exceptionnels de nos clients.", ru: "Чистота подтверждена отличными отзывами гостей." } }
        ],
        distances: [
          { place: { en: "Varkala Cliff", de: "Varkala Cliff", fr: "Falaises de Varkala", ru: "Скала Варкала" }, distance: { en: "1 km", de: "1 km", fr: "1 km", ru: "1 км" } }
        ],
        additionalServices: [
          { service: { en: "Scooter Rental", de: "Motorroller-Verleih", fr: "Location de scooter", ru: "Прокат скутеров" }, details: { en: "Scooters available at local daily rates.", de: "Motorroller zu lokalen Tagessätzen verfügbar.", fr: "Scooters disponibles aux tarifs journaliers locaux.", ru: "Скутеры доступны для аренды по местным посуточным тарифам." } }
        ]
      }
    ];

    await AccommodationItem.insertMany(sampleVillas);
    console.log("[migration]: Dynamic accommodation items seeded.");

    // ========================================================
    // 10. NEW: Seed Specific Tour Packages Items
    // ========================================================
    console.log("[migration]: Seeding Package items...");
    const samplePackages = [
      {
        slug: "cliff-beach-sightseeing-tour",
        packageCategory: "varkalaSightseeing" as const,
        title: { en: "Varkala Cliff & Beach Walking Tour", de: "Varkala Cliff & Beach Wandertour", fr: "Visite à Pied des Falaises et de la Plage de Varkala", ru: "Пешеходная экскурсия по скалам и пляжам Варкалы" },
        price: 1500,
        pricePeriod: { en: "/ person", de: "/ Person", fr: "/ personne", ru: "/ человек" },
        image: images.packageVarkala.url,
        imagePublicId: images.packageVarkala.publicId,
        aboutImage: images.aboutInterior.url,
        aboutImagePublicId: images.aboutInterior.publicId,
        duration: { en: "4 Hours", de: "4 Stunden", fr: "4 heures", ru: "4 часа" },
        shortDescription: {
          en: "Explore the scenic Varkala Cliff, black sand beach, and Janardhanaswamy Temple with an English-speaking guide.",
          de: "Erkunden Sie das malerische Varkala Cliff, den schwarzen Sandstrand und den Janardhanaswamy-Tempel mit einem englischsprachigen Guide.",
          fr: "Explorez la falaise pittoresque de Varkala, la plage de sable noir et le temple Janardhanaswamy avec un guide anglophone.",
          ru: "Исследуйте живописную скалу Варкала, пляж с черным песком и храм Джанардханасвами с англоязычным гидом."
        },
        tagline: {
          en: "Discover hidden coves, local mythologies, and spiritual coastal legacy.",
          de: "Entdecken Sie versteckte Buchten, lokale Mythologien und das spirituelle Küstenklima.",
          fr: "Découvrez des criques cachées, les mythologies locales et l'héritage spirituel du littoral.",
          ru: "Откройте для себя скрытые бухты, местные мифы и духовное наследие побережья."
        },
        aboutText: {
          en: "This half-day walking tour leads you through the geological marvel that is Varkala Cliff. Led by local historians, you will visit the 2000-year-old temple, learn about the natural mineral springs, and capture the perfect sunset photos.",
          de: "Diese halbtägige Wandertour führt Sie durch das geologische Wunder des Varkala Cliffs. Geführt von lokalen Historikern besuchen Sie den 2000 Jahre alten Tempel, erfahren mehr über die natürlichen Mineralquellen und schießen perfekte Sonnenuntergangsfotos.",
          fr: "Cette visite à pied d'une demi-journée vous fait découvrir la merveille géologique qu'est la falaise de Varkala. Sous la conduite d'historiens locaux, vous visiterez le temple bimillénaire, en apprendrez plus sur les sources minérales naturelles et prendrez des photos parfaites du coucher de soleil.",
          ru: "Эта полудневная пешеходная экскурсия проведет вас по геологическому чуду — скале Варкала. Под руководством местных гидов вы посетите 2000-летний храм, узнаете о природных минеральных источниках и сделаете отличные фотографии на закате."
        },
        highlights: [
          { icon: "temple", label: { en: "Temple Visit", de: "Tempelbesuch", fr: "Visite de temple", ru: "Посещение храма" } },
          { icon: "camera", label: { en: "Sunset Viewpoints", de: "Sonnenuntergangs-Ausblicke", fr: "Points de vue coucher de soleil", ru: "Видовые точки на закате" } }
        ],
        whyGuestsLoveUs: [
          { icon: "star", title: { en: "Engaging Guides", de: "Engagierte Guides", fr: "Guides passionnants", ru: "Увлекательные гиды" }, desc: { en: "Our guides are certified locals with profound knowledge of mythology.", de: "Unsere Guides sind zertifizierte Einheimische mit fundiertem Wissen über die Mythologie.", fr: "Nos guides sont des locaux certifiés possédant une connaissance approfondie de la mythologie.", ru: "Наши гиды — сертифицированные местные жители с глубоким знанием истории." } }
        ],
        itinerary: [
          { timeOrDay: { en: "03:00 PM", de: "15:00 Uhr", fr: "15h00", ru: "15:00" }, activity: { en: "Meet at Varkala Cliff Helipad", de: "Treffen am Hubschrauberlandeplatz von Varkala Cliff", fr: "Rendez-vous à l'héliport des falaises de Varkala", ru: "Встреча на вертолетной площадке скалы Варкала" }, desc: { en: "Introductory briefing by your tour coordinator.", de: "Einführendes Briefing durch Ihren Tourkoordinator.", fr: "Briefing d'introduction par votre coordinateur de visite.", ru: "Вводный инструктаж от гида." } },
          { timeOrDay: { en: "04:30 PM", de: "16:30 Uhr", fr: "16h30", ru: "16:30" }, activity: { en: "Temple Exploration", de: "Tempelerkundung", fr: "Exploration du temple", ru: "Экскурсия по храму" }, desc: { en: "Visit the ancient Janardhanaswamy temple.", de: "Besuch des alten Janardhanaswamy-Tempels.", fr: "Visite de l'ancien temple Janardhanaswamy.", ru: "Посещение древнего храма Джанардханасвами." } }
        ],
        inclusions: [
          { en: "English-speaking guide", de: "Englischsprachiger Guide", fr: "Guide anglophone", ru: "Англоязычный гид" },
          { en: "Fresh coconut water refreshment", de: "Frisches Kokoswasser zur Erfrischung", fr: "Boisson rafraîchissante à l'eau de coco fraîche", ru: "Освежающий напиток из свежего кокоса" }
        ],
        exclusions: [
          { en: "Camera entry fees if applicable", de: "Gegebenenfalls Kameragebühren", fr: "Frais d'entrée pour appareil photo le cas échéant", ru: "Сборы за съемку на камеру (если применимо)" }
        ]
      }
    ];

    await PackageItem.insertMany(samplePackages);
    console.log("[migration]: Dynamic tour package items seeded.");

    // ========================================================
    // 11. NEW: Seed Specific Yoga Items
    // ========================================================
    console.log("[migration]: Seeding Yoga items...");
    const sampleYogaItems = [
      {
        slug: "7-day-beach-meditation-retreat",
        yogaType: "retreats" as const,
        title: { en: "7-Day Beach Meditation & Yoga Retreat", de: "7-tägiges Strand-Meditations- & Yoga-Retreat", fr: "Retraite de Yoga et Méditation sur la Plage de 7 Jours", ru: "7-дневный йога- и медитационный ретрит на пляже" },
        price: 35000,
        pricePeriod: { en: "/ program", de: "/ Programm", fr: "/ programme", ru: "/ программа" },
        image: images.yogaRetreats.url,
        imagePublicId: images.yogaRetreats.publicId,
        aboutImage: images.aboutInterior.url,
        aboutImagePublicId: images.aboutInterior.publicId,
        duration: { en: "7 Days", de: "7 Tage", fr: "7 jours", ru: "7 дней" },
        shortDescription: {
          en: "Restore internal harmony with sunrise Hatha sessions, organic Ayurvedic meals, and guided sound healing.",
          de: "Stellen Sie die innere Harmonie mit Hatha-Sitzungen bei Sonnenaufgang, biologischen ayurvedischen Mahlzeiten und geführter Klangheilung wieder her.",
          fr: "Restaurez l'harmonie interne grâce à des séances de Hatha au lever du soleil, des repas ayurvédiques biologiques et une thérapie par le son guidée.",
          ru: "Восстановите внутреннюю гармонию с помощью утренних сеансов хатха-йоги, органического аюрведического питания и звуковой терапии."
        },
        tagline: {
          en: "A transformational journey facing the waves of the Arabian Sea.",
          de: "Eine transformative Reise mit Blick auf die Wellen des Arabischen Meeres.",
          fr: "Un voyage transformationnel face aux vagues de la mer d'Arabie.",
          ru: "Трансформационное путешествие лицом к волнам Аравийского моря."
        },
        aboutText: {
          en: "Our flagship 7-Day Retreat is curated to help you disconnect from digital noise. Directed by Acharya Vishnu, the program blends gentle daily physical alignments with breathing practices (Pranayama) and restorative sound baths.",
          de: "Unser Flaggschiff-Retreat von 7 Tagen hilft Ihnen, sich vom digitalen Lärm abzuschalten. Unter der Leitung von Acharya Vishnu verbindet das Programm sanfte tägliche körperliche Übungen mit Atemübungen (Pranayama) und erholsamen Klangbädern.",
          fr: "Notre retraite phare de 7 jours est conçue pour vous aider à vous déconnecter du bruit numérique. Dirigé par l'Acharya Vishnu, le programme associe des étirements physiques quotidiens, des exercices de respiration (Pranayama) et des bains sonores réparateurs.",
          ru: "Наш главный 7-дневный ретрит создан для того, чтобы помочь вам отключиться от цифрового шума. Под руководством ачарьи Вишну программа сочетает в себе мягкие физические упражнения, дыхательные практики (пранаяму) и восстанавливающие звуковые ванны."
        },
        schedule: [
          { time: { en: "06:30 AM", de: "06:30 Uhr", fr: "06h30", ru: "06:30" }, activity: { en: "Sunrise Pranayama & Flow", de: "Pranayama & Flow bei Sonnenaufgang", fr: "Pranayama et Flow au lever du soleil", ru: "Пранаяма и утренний поток" } },
          { time: { en: "08:30 AM", de: "08:30 Uhr", fr: "08h30", ru: "08:30" }, activity: { en: "Organic Vegetarian Breakfast", de: "Bio-vegetarisches Frühstück", fr: "Petit-déjeuner végétarien biologique", ru: "Органический вегетарианский завтрак" } }
        ],
        benefits: [
          { en: "Reduced anxiety and stress levels", de: "Reduzierte Angst- und Stresslevel", fr: "Diminution des niveaux d'anxiété et de stress", ru: "Снижение уровня тревоги и стресса" },
          { en: "Enhanced physical agility", de: "Verbesserte körperliche Beweglichkeit", fr: "Amélioration de la souplesse physique", ru: "Улучшение физической гибкости" }
        ],
        inclusions: [
          { en: "Premium accommodation stay", de: "Unterkunft in Premium-Zimmern", fr: "Séjour en hébergement haut de gamme", ru: "Проживание в номерах премиум-класса" },
          { en: "All organic meals and juices", de: "Alle biologischen Mahlzeiten und Säfte", fr: "Tous les repas et jus biologiques", ru: "Все органическое питание и соки" }
        ]
      }
    ];

    await YogaItem.insertMany(sampleYogaItems);
    console.log("[migration]: Dynamic yoga items seeded.");

    console.log("[migration]: Migration completed successfully! Connection will close.");
    mongoose.connection.close();
  } catch (error: any) {
    console.error(`[migration]: Critical error during migration: ${error.message}`);
    process.exit(1);
  }
};

runMigration();
