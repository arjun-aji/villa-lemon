import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    // Find the ocean-whisper-villa or villa-lemon-phase-1
    let item = await AccommodationItem.findOne({ slug: "ocean-whisper-villa" });
    if (!item) {
      item = await AccommodationItem.findOne({ slug: "villa-lemon-phase-1" });
    }
    if (!item) {
      console.error("Accommodation item not found!");
      process.exit(1);
    }

    console.log("Found stay:", item.title.en);

    // Update details
    item.slug = "villa-lemon-phase-1";
    item.price = 2500;
    item.bedrooms = 2;
    item.bathrooms = 2;
    item.guests = 6;
    item.checkInTime = "12:00 PM";
    item.checkOutTime = "11:00 AM";
    item.mapLink = "https://www.google.com/maps/dir//Villa+Lemon+Homestay+Varkala,+Valiyaveettil+Temple+Road,+Black+beach+road,+Kurakkanni,+Varkala,+Kerala+695141/@8.7649892,76.7221076,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b05efe95ae686e3:0x9c3bbd7f057bf574!2m2!1d76.7047832!2d8.7433198?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D";

    item.title = {
      en: "Villa Lemon Homestay – Phase 1",
      de: "Villa Lemon Homestay – Phase 1",
      fr: "Villa Lemon Homestay – Phase 1",
      ru: "Villa Lemon Homestay – Phase 1"
    };

    item.pricePeriod = {
      en: "/ night",
      de: "/ Nacht",
      fr: "/ nuit",
      ru: "/ ночь"
    };

    item.location = {
      en: "North Cliff, Varkala, Kerala",
      de: "Nord-Klippe, Varkala, Kerala",
      fr: "North Cliff, Varkala, Kerala",
      ru: "Норт Клифф, Варкала, Керала"
    };

    item.tagline = {
      en: "A Peaceful Garden Homestay Near Varkala Cliff",
      de: "Ein ruhiges Garten-Homestay in der Nähe der Varkala-Klippe",
      fr: "Un séjour paisible dans un jardin près de la falaise de Varkala",
      ru: "Спокойный гостевой дом с садом рядом со скалой Варкала"
    };

    item.shortDescription = {
      en: "Peaceful tropical garden homestay located just minutes from Varkala Cliff and Black Beach, offering spacious air-conditioned rooms, private balconies, modern amenities, and warm Kerala hospitality.",
      de: "Ruhige tropische Garten-Gastfamilie, nur wenige Minuten von der Varkala-Klippe und dem Black Beach entfernt, mit geräumigen, klimatisierten Zimmern, privaten Balkonen, modernen Annehmlichkeiten und herzlicher Kerala-Gastfreundschaft.",
      fr: "Séjour chez l'habitant dans un jardin tropical paisible situé à quelques minutes de la falaise de Varkala et de Black Beach, proposant des chambres spacieuses climatisées, des balcons privés, des équipements modernes et une hospitalité chaleureuse du Kerala.",
      ru: "Спокойный гостевой дом в тропическом саду, расположенный всего в нескольких минутах от скалы Варкала и Черного пляжа. К услугам гостей просторные номера с кондиционером, частные балконы, современные удобства и теплое гостеприимство Кералы."
    };

    item.aboutText1 = {
      en: "Experience the perfect blend of comfort, nature, and authentic Kerala hospitality at Villa Lemon Homestay – Phase 1. Located in the peaceful North Cliff area, just minutes from Varkala Cliff and Black Beach, our homestay offers a relaxing escape for couples, families, solo travellers, and small groups. Surrounded by lush tropical gardens and coconut trees, Villa Lemon features spacious air-conditioned rooms, private balconies, a shared kitchen and dining area, and beautifully landscaped outdoor spaces where guests can relax in a hammock or enjoy the fresh coastal breeze.",
      de: "Erleben Sie die perfekte Mischung aus Komfort, Natur und authentischer Kerala-Gastfreundschaft im Villa Lemon Homestay – Phase 1. Im ruhigen Viertel North Cliff, nur wenige Minuten von der Varkala-Klippe und dem Black Beach entfernt, bietet unsere Gastfamilie einen erholsamen Rückzugsort für Paare, Familien, Alleinreisende und kleine Gruppen. Umgeben von üppigen tropischen Gärten und Kokospalmen bietet das Villa Lemon geräumige, klimatisierte Zimmer, private Balkone, eine Gemeinschaftsküche mit Essbereich und wunderschön gestaltete Außenbereiche, in denen die Gäste in einer Hängematte entspannen oder die frische Meeresbrise genießen können.",
      fr: "Découvrez le mélange parfait de confort, de nature et d'hospitalité authentique du Kerala à la Villa Lemon Homestay - Phase 1. Situé dans le quartier paisible de North Cliff, à quelques minutes de la falaise de Varkala et de Black Beach, notre séjour chez l'habitant offre une escapade relaxante pour les couples, les familles, les voyageurs en solo et les petits groupes. Entourée de jardins tropicaux luxuriants et de cocotiers, la Villa Lemon propose des chambres climatisées spacieuses, des balcons privés, une cuisine et un coin repas partagés, ainsi que des espaces extérieurs magnifiquement aménagés où les clients peuvent se détendre dans un hamac ou profiter de la brise fraîche de la côte.",
      ru: "Ощутите идеальное сочетание комфорта, природы и подлинного гостеприимства Кералы в гостевом доме Villa Lemon Homestay – Phase 1. Расположенный в тихом районе Норт-Клифф, всего в нескольких минутах от скалы Варкала и Черного пляжа, наш гостевой дом предлагает расслабляющий отдых для пар, семей, индивидуальных путешественников и небольших групп. Окруженная пышными тропическими садами и кокосовыми пальмами, вилла Lemon располагает просторными номерами с кондиционером, частными балконами, общей кухней и обеденной зоной, а также красиво оформленной открытой площадкой, где гости могут отдохнуть в гамаке или насладиться свежим морским бризом."
    };

    item.aboutText2 = {
      en: "Whether you're visiting Varkala for a beach holiday, yoga retreat, workcation, or family vacation, Villa Lemon provides the comfort and convenience of a home away from home. Guests can choose from private rooms or a fully equipped 2 BHK apartment for short holidays or extended stays. Every room includes an attached bathroom with hot water, comfortable bedding, high-speed Wi-Fi, and thoughtful amenities. The peaceful gardens, shared kitchen, dining area, free parking, airport transfers, and sightseeing assistance make Villa Lemon one of the best affordable accommodations in Varkala.",
      de: "Egal, ob Sie Varkala für einen Strandurlaub, ein Yoga-Retreat, eine Workcation oder einen Familienurlaub besuchen, Villa Lemon bietet den Komfort und die Bequemlichkeit eines Zuhauses in der Ferne. Gäste können zwischen privaten Zimmern oder einem voll ausgestatteten 2-Zimmer-Apartment für kurze Urlaube oder längere Aufenthalte wählen. Jedes Zimmer verfügt über ein angeschlossenes Badezimmer mit heißem Wasser, bequeme Betten, schnelles WLAN und durchdachte Annehmlichkeiten. Die ruhigen Gärten, die Gemeinschaftsküche, der Essbereich, kostenlose Parkplätze, Flughafentransfers und Unterstützung bei Besichtigungen machen das Villa Lemon zu einer der besten erschwinglichen Unterkünfte in Varkala.",
      fr: "Que vous visitiez Varkala pour des vacances à la plage, une retraite de yoga, un séjour de travail ou des vacances en famille, la Villa Lemon offre le confort et la commodité d'un chez-soi. Vous pourrez choisir entre des chambres privées ou un appartement 2 pièces entièrement équipé pour des vacances courtes ou des séjours prolongés. Chaque chambre comprend une salle de bain attenante avec eau chaude, une literie confortable, une connexion Wi-Fi haut débit et des équipements attentionnés. Les jardins paisibles, la cuisine partagée, le coin repas, le parking gratuit, les transferts aéroport et l'aide à la visite font de la Villa Lemon l'un des meilleurs hébergements abordables de Varkala.",
      ru: "Независимо от того, приезжаете ли вы в Варкалу на пляжный отдых, йога-ретрит, для работы или семейного отдыха, Villa Lemon обеспечит уют и удобство домашнего очага. Гости могут выбрать отдельные комнаты или полностью оборудованную двухкомнатную квартиру для короткого отпуска или длительного проживания. В каждом номере есть собственная ванная комната с горячей водой, удобная постель, высокоскоростной Wi-Fi и продуманные удобства. Тихий сад, общая кухня, обеденная зона, бесплатная парковка, трансфер из аэропорта и помощь в организации экскурсий делают Villa Lemon одним из лучших доступных вариантов размещения в Варкале."
    };

    item.perfectLocationText = {
      en: "Located in the peaceful North Cliff area of Varkala, Villa Lemon is just minutes from the famous Varkala Cliff and Black Beach. Guests enjoy easy access to beaches, cafés, restaurants, yoga centres, and popular attractions while staying in a quiet tropical garden setting surrounded by coconut trees.",
      de: "Das Villa Lemon befindet sich im ruhigen Viertel North Cliff in Varkala, nur wenige Minuten von der berühmten Varkala-Klippe und dem Black Beach entfernt. Die Gäste genießen einfachen Zugang zu Stränden, Cafés, Restaurants, Yoga-Zentren und beliebten Sehenswürdigkeiten und wohnen gleichzeitig in einer ruhigen tropischen Gartenanlage, die von Kokospalmen umgeben ist.",
      fr: "Située dans le quartier paisible de North Cliff à Varkala, la Villa Lemon se trouve à quelques minutes de la célèbre falaise de Varkala et de Black Beach. Les clients bénéficient d'un accès facile aux plages, aux cafés, aux restaurants, aux centres de yoga et aux attractions populaires tout en séjournant dans un jardin tropical calme entouré de cocotiers.",
      ru: "Гостевой дом Villa Lemon расположен в тихом районе Норт-Клифф города Варкала, всего в нескольких минутах от знаменитой скалы Варкала и Черного пляжа. Гости могут легко добраться до пляжей, кафе, ресторанов, центров йоги и популярных достопримечательностей, проживая в тихом тропическом саду в окружении кокосовых пальм."
    };

    item.groupAccommodationText = {
      en: "Perfect for couples, families, solo travellers, digital nomads, yoga travellers, and small groups. Accommodation includes private rooms and a fully equipped 2 BHK apartment, making it ideal for both short holidays and long-term stays. Villa Lemon Phase 1 & Phase 2 together can comfortably host yoga retreats, wellness retreats, workshops, teacher training programs, and group accommodation.",
      de: "Perfekt für Paare, Familien, Alleinreisende, digitale Nomaden, Yoga-Reisende und kleine Gruppen. Die Unterkünfte umfassen private Zimmer und ein komplett ausgestattetes 2-Zimmer-Apartment, ideal für kurze Urlaube und Langzeitaufenthalte. Villa Lemon Phase 1 & Phase 2 zusammen können bequem Yoga-Retreats, Wellness-Retreats, Workshops, Lehrerausbildungsprogramme und Gruppenunterkünfte beherbergen.",
      fr: "Parfait pour les couples, les familles, les voyageurs en solo, les nomades numériques, les voyageurs de yoga et les petits groupes. L'hébergement comprend des chambres privées et un appartement de 2 pièces entièrement équipé, ce qui le rend idéal pour les vacances courtes et les séjours de longue durée. Villa Lemon Phase 1 et Phase 2 ensemble peuvent accueillir confortablement des retraites de yoga, des retraites de bien-être, des ateliers, des programmes de formation d'enseignants et des hébergements de groupe.",
      ru: "Идеально подходит для пар, семей, индивидуальных путешественников, цифровых кочевников, любителей йоги и небольших групп. Варианты размещения включают отдельные комнаты и полностью оборудованную двухкомнатную квартиру, что делает ее идеальной как для короткого отпуска, так и для длительного проживания. Вилла Lemon Phase 1 и Phase 2 вместе могут комфортно принимать йога-ретриты, велнес-ретриты, семинары, программы подготовки преподавателей и групповое размещение."
    };

    const enAmenities = [
      "Air Conditioning", "Attached Private Bathroom", "Hot Water (Geyser System)", "Complimentary Wi-Fi Access",
      "Fresh Linen and Towels", "Comfortable Bedding", "Daily Housekeeping (On Request)", "Drinking Water Refill Station",
      "Private Balcony", "Shared Kitchen", "Dining Area", "Garden Access", "Free Parking"
    ];
    item.roomAmenities = enAmenities.map(am => ({
      en: am,
      de: am,
      fr: am,
      ru: am
    }));

    const enIdealFor = [
      "Families", "Couples", "Solo Travellers", "Digital Nomads", "Yoga Travellers", "Long Stays",
      "Yoga Retreats", "Wellness Retreats", "Yoga Teacher Training Programs", "Group Accommodation"
    ];
    item.idealFor = enIdealFor.map(id => ({
      en: id,
      de: id,
      fr: id,
      ru: id
    }));

    item.whyGuestsLoveUs = [
      {
        icon: "trees",
        title: { en: "Peaceful Tropical Garden", de: "Ruhiger tropischer Garten", fr: "Jardin tropical paisible", ru: "Тихий тропический сад" },
        desc: {
          en: "Relax beneath coconut trees in beautifully landscaped gardens with hammocks and peaceful outdoor spaces.",
          de: "Entspannen Sie unter Kokospalmen in wunderschön angelegten Gärten mit Hängematten und ruhigen Außenbereichen.",
          fr: "Détendez-vous sous les cocotiers dans des jardins magnifiquement aménagés dotés de hamacs et d'espaces extérieurs paisibles.",
          ru: "Отдохните под кокосовыми пальмами в красивом ландшафтном саду с гамаками и тихими местами для отдыха на открытом воздухе."
        }
      },
      {
        icon: "mappin",
        title: { en: "Prime Location", de: "Erstklassige Lage", fr: "Emplacement de choix", ru: "Отличное расположение" },
        desc: {
          en: "Just minutes from Varkala Cliff and Black Beach with easy access to cafés, restaurants and yoga centres.",
          de: "Nur wenige Minuten von der Varkala-Klippe und dem Black Beach entfernt, mit einfachem Zugang zu Cafés, Restaurants und Yoga-Zentren.",
          fr: "À seulement quelques minutes de la falaise de Varkala et de Black Beach, avec un accès facile aux cafés, restaurants et centres de yoga.",
          ru: "Всего в нескольких минутах от скалы Варкала и Черного пляжа, с легким доступом к кафе, ресторанам и центрам йоги."
        }
      },
      {
        icon: "bed",
        title: { en: "Comfortable Accommodation", de: "Komfortable Unterkunft", fr: "Hébergement confortable", ru: "Комфортное размещение" },
        desc: {
          en: "Spacious air-conditioned rooms, private balconies, comfortable bedding and attached bathrooms.",
          de: "Geräumige, klimatisierte Zimmer, private Balkone, bequeme Betten und angeschlossene Badezimmer.",
          fr: "Chambres climatisées spacieuses, balcons privés, literie confortable et salles de bain attenantes.",
          ru: "Просторные номера с кондиционером, частными балконами, удобными постелями и собственными ванными комнатами."
        }
      },
      {
        icon: "home",
        title: { en: "Home Away From Home", de: "Ein Zuhause in der Ferne", fr: "Un chez-soi loin de chez soi", ru: "Дом вдали от дома" },
        desc: {
          en: "Shared kitchen, dining area, thoughtful amenities and warm Kerala hospitality for every guest.",
          de: "Gemeinschaftsküche, Essbereich, durchdachte Annehmlichkeiten und herzliche Kerala-Gastfreundschaft für jeden Gast.",
          fr: "Cuisine partagée, coin repas, équipements attentionnés et hospitalité chaleureuse du Kerala pour chaque client.",
          ru: "Общая кухня, обеденная зона, продуманные удобства и теплое гостеприимство Кералы для каждого гостя."
        }
      },
      {
        icon: "wifi",
        title: { en: "Modern Facilities", de: "Moderne Einrichtungen", fr: "Installations modernes", ru: "Современные удобства" },
        desc: {
          en: "Enjoy complimentary high-speed Wi-Fi, free parking, airport transfers and sightseeing assistance.",
          de: "Genießen Sie kostenloses Highspeed-WLAN, kostenfreie Parkplätze, Flughafentransfers und Unterstützung bei Besichtigungen.",
          fr: "Profitez d'une connexion Wi-Fi haut débit gratuite, d'un parking gratuit, de transferts aéroport et d'une assistance pour les visites.",
          ru: "Пользуйтесь бесплатным высокоскоростным Wi-Fi, бесплатной парковкой, трансфером из аэропорта и помощью в организации экскурсий."
        }
      }
    ];

    item.distances = [
      {
        place: { en: "Black Beach", de: "Black Beach", fr: "Black Beach", ru: "Черный пляж" },
        distance: { en: "900 m", de: "900 m", fr: "900 m", ru: "900 м" }
      },
      {
        place: { en: "Varkala Cliff", de: "Varkala Cliff", fr: "Falaises de Varkala", ru: "Скала Варкала" },
        distance: { en: "900 m", de: "900 m", fr: "900 m", ru: "900 м" }
      },
      {
        place: { en: "Varkala Railway Station", de: "Varkala Bahnhof", fr: "Gare de Varkala", ru: "Железнодорожный вокзал Варкалы" },
        distance: { en: "2.5 km", de: "2.5 km", fr: "2.5 km", ru: "2.5 км" }
      },
      {
        place: { en: "Kappil Beach", de: "Kappil Beach", fr: "Plage de Kappil", ru: "Пляж Каппил" },
        distance: { en: "5.5 km", de: "5.5 km", fr: "5.5 km", ru: "5.5 км" }
      }
    ];

    await item.save();
    console.log("Successfully updated stay data in the database!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

run();
