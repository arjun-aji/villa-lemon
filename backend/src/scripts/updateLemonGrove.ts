import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    // Find the lemon-grove-villa or villa-lemon-phase-2
    let item = await AccommodationItem.findOne({ slug: "lemon-grove-villa" });
    if (!item) {
      item = await AccommodationItem.findOne({ slug: "villa-lemon-phase-2" });
    }
    if (!item) {
      console.error("Accommodation item not found!");
      process.exit(1);
    }

    console.log("Found stay:", item.title.en);

    // Update details
    item.slug = "villa-lemon-phase-2";
    item.price = 2500;
    item.bedrooms = 6;
    item.bathrooms = 6;
    item.guests = 18;
    item.checkInTime = "12:00 PM";
    item.checkOutTime = "11:00 AM";
    item.mapLink = "https://www.google.com/maps/dir//Villa+Lemon+Homestay+Varkala,+Valiyaveettil+Temple+Road,+Black+beach+road,+Kurakkanni,+Varkala,+Kerala+695141/@8.7649892,76.7221076,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b05efe95ae686e3:0x9c3bbd7f057bf574!2m2!1d76.7047832!2d8.7433198?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D";

    item.title = {
      en: "Villa Lemon – Phase 2",
      de: "Villa Lemon – Phase 2",
      fr: "Villa Lemon – Phase 2",
      ru: "Villa Lemon – Phase 2"
    };

    item.pricePeriod = {
      en: "/ night",
      de: "/ Nacht",
      fr: "/ nuit",
      ru: "/ ночь"
    };

    item.location = {
      en: "Varkala, Kerala",
      de: "Varkala, Kerala",
      fr: "Varkala, Kerala",
      ru: "Варкала, Керала"
    };

    item.tagline = {
      en: "Spacious 6-Room Homestay in Varkala for Families, Groups & Long Stays",
      de: "Geräumige 6-Zimmer-Gastfamilie in Varkala für Familien, Gruppen und lange Aufenthalte",
      fr: "Séjour chez l'habitant spacieux de 6 chambres à Varkala pour les familles, les groupes et les longs séjours",
      ru: "Просторный гостевой дом на 6 комнат в Варкале для семей, групп и длительного проживания"
    };

    item.shortDescription = {
      en: "Modern two-storey homestay with 6 spacious air-conditioned rooms, shared kitchen and dining areas, ideal for families, groups, yoga retreats, workcations, and long stays in Varkala.",
      de: "Moderne zweistöckige Gastfamilie mit 6 geräumigen, klimatisierten Zimmern, Gemeinschaftsküche und Essbereichen, ideal für Familien, Gruppen, Yoga-Retreats, Workcations und lange Aufenthalte in Varkala.",
      fr: "Séjour chez l'habitant moderne sur deux étages avec 6 chambres spacieuses climatisées, cuisine et coin repas partagés, idéal pour les familles, les groupes, les retraites de yoga, les séjours de travail et les longs séjours à Varkala.",
      ru: "Современный двухэтажный гостевой дом с 6 просторными номерами с кондиционером, общей кухней и обеденной зоной. Идеально подходит для семей, групп, йога-ретритов, работы и длительного проживания в Варкале."
    };

    item.aboutText1 = {
      en: "Welcome to Villa Lemon – Phase 2, a spacious two-storey homestay in Varkala offering comfortable and affordable accommodation for families, groups, yoga retreats, and long-stay travellers. Located in a peaceful neighbourhood just a short distance from Varkala Cliff and Black Beach, our property combines modern amenities with warm Kerala hospitality. The property features six well-appointed air-conditioned guest rooms spread across two floors, designed to provide comfort and privacy for every guest.",
      de: "Willkommen im Villa Lemon – Phase 2, einer geräumigen zweistöckigen Gastfamilie in Varkala, die komfortable und erschwingliche Unterkünfte für Familien, Gruppen, Yoga-Retreats und Langzeitreisende bietet. In einer ruhigen Gegend, nur eine kurze Fahrt von der Varkala-Klippe und dem Black Beach entfernt, verbindet unser Anwesen moderne Annehmlichkeiten mit herzlicher Kerala-Gastfreundschaft. Die Unterkunft verfügt über sechs gut ausgestattete, klimatisierte Gästezimmer auf zwei Etagen, die jedem Gast Komfort und Privatsphäre bieten.",
      fr: "Bienvenue à la Villa Lemon - Phase 2, un séjour chez l'habitant spacieux sur deux étages à Varkala proposant un hébergement confortable et abordable pour les familles, les groupes, les retraites de yoga et les voyageurs de longue durée. Situé dans un quartier paisible à une courte distance de la falaise de Varkala et de Black Beach, notre propriété allie des équipements modernes à l'hospitalité chaleureuse du Kerala. La propriété dispose de six chambres climatisées bien aménagées réparties sur deux étages, conçues pour offrir confort et intimité à chaque client.",
      ru: "Добро пожаловать в гостевой дом Villa Lemon – Phase 2, просторный двухэтажный гостевой дом в Варкале, предлагающий комфортное и доступное жилье для семей, групп, участников йога-ретритов и гостей, приезжающих на длительный срок. Расположенный в тихом районе, в нескольких минутах езды от скалы Варкала и Черного пляжа, наш дом сочетает в себе современные удобства и теплое гостеприимство Кералы. В гостевом доме шесть хорошо оборудованных номеров с кондиционером, расположенных на двух этажах, спроектированных так, чтобы обеспечить комфорт и уединение для каждого гостя."
    };

    item.aboutText2 = {
      en: "The ground floor offers three Standard Rooms with a shared dining area, while the first floor features three Deluxe Rooms with access to a shared kitchen and dining area. Guests can book individual rooms, an entire floor, or the whole property, making Villa Lemon – Phase 2 an excellent choice for families and larger groups. Every room includes comfortable bedding, attached bathrooms with hot water, air conditioning, complimentary high-speed Wi-Fi, free parking, airport transfers, sightseeing tours, and easy access to Varkala's beaches and attractions.",
      de: "Das Erdgeschoss bietet drei Standardzimmer mit gemeinsamem Essbereich, während das Obergeschoss drei Deluxe-Zimmer mit Zugang zu einer Gemeinschaftsküche und einem Essbereich bietet. Gäste können einzelne Zimmer, eine komplette Etage oder das gesamte Anwesen buchen, was Villa Lemon – Phase 2 zu einer hervorragenden Wahl für Familien und größere Gruppen macht. Jedes Zimmer verfügt über bequeme Betten, ein eigenes Bad mit heißem Wasser, Klimaanlage, kostenloses Highspeed-WLAN, kostenfreie Parkplätze, Flughafentransfers, Besichtigungstouren und einfachen Zugang zu den Stränden und Sehenswürdigkeiten von Varkala.",
      fr: "Le rez-de-chaussée propose trois chambres Standard avec un coin repas partagé, tandis que le premier étage dispose de trois chambres Deluxe avec accès à une cuisine et un coin repas partagés. Les clients peuvent réserver des chambres individuelles, un étage entier ou l'ensemble de la propriété, ce qui fait de la Villa Lemon - Phase 2 un excellent choix pour les familles et les groupes plus importants. Chaque chambre comprend une literie confortable, des salles de bains attenantes avec eau chaude, la climatisation, une connexion Wi-Fi haut débit gratuite, un parking gratuit, des transferts aéroport, des visites touristiques et un accès facile aux plages et attractions de Varkala.",
      ru: "На первом этаже расположены три стандартных номера с общей обеденной зоной, а на втором этаже — три номера люкс с доступом к общей кухне и обеденной зоне. Гости могут забронировать отдельные номера, целый этаж или весь гостевой дом целиком, что делает Villa Lemon – Phase 2 отличным выбором для семей и больших групп. В каждом номере есть удобные постели, собственные ванные комнаты с горячей водой, кондиционер, бесплатный высокоскоростной Wi-Fi, бесплатная парковка, трансфер из аэропорта, экскурсии и легкий доступ к пляжам и достопримечательностям Варкалы."
    };

    item.perfectLocationText = {
      en: "Located in a peaceful residential neighbourhood in Varkala, Villa Lemon – Phase 2 is just a short drive from Varkala Cliff and Black Beach. Guests enjoy easy access to beaches, cafés, restaurants, temples, and major attractions while relaxing in a quiet and comfortable environment.",
      de: "In einer ruhigen Wohngegend in Varkala gelegen, ist das Villa Lemon – Phase 2 nur eine kurze Fahrt von der Varkala-Klippe und dem Black Beach entfernt. Die Gäste genießen einfachen Zugang zu Stränden, Cafés, Restaurants, Tempeln und den wichtigsten Sehenswürdigkeiten, während sie sich in einer ruhigen und komfortablen Umgebung entspannen.",
      fr: "Située dans un quartier résidentiel paisible de Varkala, la Villa Lemon - Phase 2 se trouve à une courte distance en voiture de la falaise de Varkala et de Black Beach. Les clients bénéficient d'un accès facile aux plages, aux cafés, aux restaurants, aux temples et aux principales attractions tout en se détendant dans un environnement calme et confortable.",
      ru: "Расположенная в тихом жилом районе Варкалы, вилла Lemon – Phase 2 находится всего в нескольких минутах езды от скалы Варкала и Черного пляжа. Гости могут легко добраться до пляжей, кафе, ресторанов, храмов и основных достопримечательностей, отдыхая в тихой и комфортной обстановке."
    };

    item.groupAccommodationText = {
      en: "Villa Lemon – Phase 2 is ideal for families, groups, yoga retreats, wellness programs, workcations, and long-term travellers. Guests can choose to book individual rooms, an entire floor, or the complete six-room property, making it suitable for both small families and larger groups.",
      de: "Villa Lemon – Phase 2 ist ideal für Familien, Gruppen, Yoga-Retreats, Wellness-Programme, Workcations und Langzeitreisende. Gäste können wählen, ob sie einzelne Zimmer, eine komplette Etage oder das gesamte Anwesen mit sechs Zimmern buchen möchten, sodass es sowohl für kleine Familien als auch für größere Gruppen geeignet ist.",
      fr: "La Villa Lemon - Phase 2 est idéale pour les familles, les groupes, les retraites de yoga, les programmes de bien-être, les séjours de travail et les voyageurs de longue durée. Les clients peuvent choisir de réserver des chambres individuelles, un étage entier ou l'ensemble de la propriété de six chambres, ce qui la rend adaptée aux petites familles comme aux groupes plus importants.",
      ru: "Вилла Lemon – Phase 2 идеально подходит для семей, групп, йога-ретритов, велнес-программ, работы и длительного проживания. Гости могут забронировать отдельные номера, целый этаж или все шестикомнатное здание целиком, что делает его удобным как для небольших семей, так и для больших групп."
    };

    const enAmenities = [
      "Air Conditioning", "Attached Private Bathroom", "Hot Water", "Complimentary High-Speed Wi-Fi",
      "Comfortable Bedding", "Shared Kitchen", "Shared Dining Area", "Free Parking", "Airport Transfers", "Sightseeing Tours"
    ];
    item.roomAmenities = enAmenities.map(am => ({
      en: am,
      de: am,
      fr: am,
      ru: am
    }));

    const enIdealFor = [
      "Families", "Groups", "Yoga Retreats", "Wellness Retreats", "Long Stays", "Workcations", "Solo Travellers", "Digital Nomads"
    ];
    item.idealFor = enIdealFor.map(id => ({
      en: id,
      de: id,
      fr: id,
      ru: id
    }));

    item.whyGuestsLoveUs = [
      {
        icon: "home",
        title: { en: "Spacious Two-Storey Stay", de: "Geräumige zweistöckige Unterkunft", fr: "Hébergement spacieux sur deux étages", ru: "Просторный двухэтажный дом" },
        desc: {
          en: "Enjoy six spacious air-conditioned guest rooms across two comfortable floors designed for families and groups.",
          de: "Genießen Sie sechs geräumige, klimatisierte Gästezimmer auf zwei komfortablen Etagen, ideal für Familien und Gruppen.",
          fr: "Profitez de six chambres climatisées spacieuses réparties sur deux étages confortables conçus pour les familles et les groupes.",
          ru: "К услугам гостей шесть просторных номеров с кондиционером на двух комфортабельных этажах, спроектированных для семей и групп."
        }
      },
      {
        icon: "bed",
        title: { en: "Flexible Accommodation", de: "Flexible Unterkunft", fr: "Hébergement flexible", ru: "Гибкие варианты размещения" },
        desc: {
          en: "Book an individual room, an entire floor, or the complete property depending on your travel needs.",
          de: "Buchen Sie ein einzelnes Zimmer, eine komplette Etage oder das gesamte Anwesen, ganz nach Ihren Reisebedürfnissen.",
          fr: "Réservez une chambre individuelle, un étage entier ou la propriété complète en fonction de vos besoins de voyage.",
          ru: "Забронируйте отдельный номер, целый этаж или все здание целиком в зависимости от ваших потребностей."
        }
      },
      {
        icon: "users",
        title: { en: "Perfect for Groups", de: "Perfekt für Gruppen", fr: "Parfait pour les groupes", ru: "Идеально для групп" },
        desc: {
          en: "Ideal for families, yoga retreats, group vacations, workcations, and long-term stays in Varkala.",
          de: "Ideal für Familien, Yoga-Retreats, Gruppenurlaube, Workcations und Langzeitaufenthalte in Varkala.",
          fr: "Idéal pour les familles, les retraites de yoga, les vacances de groupe, les séjours de travail et les longs séjours à Varkala.",
          ru: "Идеально подходит для семей, йога-ретритов, группового отдыха, работы и длительного проживания в Варкале."
        }
      },
      {
        icon: "wifi",
        title: { en: "Modern Comforts", de: "Moderner Komfort", fr: "Confort moderne", ru: "Современный комфорт" },
        desc: {
          en: "Every room features air conditioning, hot water, comfortable beds, complimentary Wi-Fi, and attached bathrooms.",
          de: "Jedes Zimmer verfügt über Klimaanlage, warmes Wasser, bequeme Betten, kostenloses WLAN und ein eigenes Bad.",
          fr: "Chaque chambre dispose de la climatisation, d'eau chaude, de l'accès Wi-Fi gratuit, de lits confortables et d'une salle de bain attenante.",
          ru: "В каждом номере есть кондиционер, горячая вода, удобные кровати, бесплатный Wi-Fi и собственная ванная комната."
        }
      },
      {
        icon: "mappin",
        title: { en: "Excellent Location", de: "Hervorragende Lage", fr: "Excellent emplacement", ru: "Отличное расположение" },
        desc: {
          en: "Stay close to Varkala Cliff, Black Beach, cafés, restaurants, and major attractions while enjoying a peaceful neighbourhood.",
          de: "Bleiben Sie in der Nähe der Varkala-Klippe, des Black Beach, von Cafés, Restaurants und den wichtigsten Sehenswürdigkeiten, während Sie eine ruhige Nachbarschaft genießen.",
          fr: "Séjournez à proximité de la falaise de Varkala, de Black Beach, des cafés, des restaurants et des principales attractions tout en profitant d'un quartier paisible.",
          ru: "Остановитесь неподалеку от скалы Варкала, Черного пляжа, кафе, ресторанов и основных достопримечательностей, проживая при этом в тихом районе."
        }
      }
    ];

    item.distances = [
      {
        place: { en: "Varkala Cliff", de: "Varkala Cliff", fr: "Falaises de Varkala", ru: "Скала Варкала" },
        distance: { en: "Short Drive", de: "Kurze Autofahrt", fr: "Courte distance en voiture", ru: "В нескольких минутах езды" }
      },
      {
        place: { en: "Black Beach", de: "Black Beach", fr: "Black Beach", ru: "Черный пляж" },
        distance: { en: "Short Drive", de: "Kurze Autofahrt", fr: "Courte distance en voiture", ru: "В нескольких минутах езды" }
      },
      {
        place: { en: "Cafés & Restaurants", de: "Cafés & Restaurants", fr: "Cafés & Restaurants", ru: "Кафе и рестораны" },
        distance: { en: "Nearby", de: "In der Nähe", fr: "À proximité", ru: "Рядом" }
      },
      {
        place: { en: "Local Attractions", de: "Sehenswürdigkeiten", fr: "Attractions locales", ru: "Местные достопримечательности" },
        distance: { en: "Nearby", de: "In der Nähe", fr: "À proximité", ru: "Рядом" }
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
