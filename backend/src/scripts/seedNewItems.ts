import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("[seeder]: Database connected successfully.");

    // Fetch existing properties to reuse uploaded Cloudinary image links
    const existingStays = await AccommodationItem.find({});
    if (existingStays.length === 0) {
      console.error("[seeder]: No existing stays found to copy image assets from. Please run migrate first.");
      process.exit(1);
    }

    // Phase 2 or lemon-grove has the terrace/room images typically, let's look for matching keywords
    let terraceImg = existingStays[0].image;
    let terracePublicId = existingStays[0].imagePublicId || "";
    let roomImg = existingStays[0].image;
    let roomPublicId = existingStays[0].imagePublicId || "";
    let aboutImg = existingStays[0].aboutImage;
    let aboutPublicId = existingStays[0].aboutImagePublicId || "";

    // Try to find specific renames / fallbacks if available
    const phase2 = existingStays.find(s => s.slug.includes("phase-2") || s.slug.includes("grove"));
    const phase1 = existingStays.find(s => s.slug.includes("phase-1") || s.slug.includes("whisper"));

    if (phase2) {
      terraceImg = phase2.image;
      terracePublicId = phase2.imagePublicId || "";
      aboutImg = phase2.aboutImage || phase2.image;
      aboutPublicId = phase2.aboutImagePublicId || phase2.imagePublicId || "";
    }
    if (phase1) {
      roomImg = phase1.image;
      roomPublicId = phase1.imagePublicId || "";
    }

    console.log("[seeder]: Reusing image assets:");
    console.log(`- Terrace: ${terraceImg}`);
    console.log(`- Room: ${roomImg}`);

    const newStays = [
      {
        slug: "deluxe-3bhk-private-floor",
        accommodationType: "floor",
        title: {
          en: "Deluxe 3 BHK Private Floor",
          de: "Luxuriöse private 3-Zimmer-Etage",
          fr: "Étage privé de luxe 3 BHK",
          ru: "Роскошный отдельный этаж с 3 спальнями (3 BHK)"
        },
        price: 12500,
        pricePeriod: { en: "/ night", de: "/ Nacht", fr: "/ nuit", ru: "/ ночь" },
        image: terraceImg,
        imagePublicId: terracePublicId,
        aboutImage: aboutImg,
        aboutImagePublicId: aboutPublicId,
        bedrooms: 3,
        bathrooms: 3,
        guests: 9,
        location: { en: "Varkala, Kerala", de: "Varkala, Kerala", fr: "Varkala, Kerala", ru: "Варкала, Керала" },
        shortDescription: {
          en: "Experience the comfort of a home combined with the hospitality of Villa Lemon in our Deluxe 3 BHK Private Floor.",
          de: "Erleben Sie den Komfort eines Zuhauses kombiniert mit der Gastfreundschaft von Villa Lemon auf unserer luxuriösen privaten 3-Zimmer-Etage.",
          fr: "Découvrez le confort d'une maison combiné à l'hospitalité de Villa Lemon dans notre étage privé de luxe 3 BHK.",
          ru: "Оцените домашний комфорт в сочетании с гостеприимством виллы Lemon на нашем роскошном этаже с 3 спальнями."
        },
        tagline: {
          en: "Premium First Floor Accommodation for Families & Groups in Varkala",
          de: "Erstklassige Unterkunft im ersten Stock für Familien und Gruppen in Varkala",
          fr: "Hébergement haut de gamme au premier étage pour familles et groupes à Varkala",
          ru: "Премиальное жилье на втором этаже для семей и групп в Варкале"
        },
        aboutText1: {
          en: "Experience the comfort of a home combined with the hospitality of Villa Lemon in our Deluxe 3 BHK Private Floor at Villa Lemon Phase 2. Located on the first floor, this exclusive accommodation offers three spacious Deluxe Bedrooms, making it the perfect choice for large families, groups of friends, yoga participants, corporate travellers, and long-stay guests. Instead of booking multiple hotel rooms, enjoy the privacy of an entire floor exclusively reserved for your group.",
          de: "Erleben Sie den Komfort eines Zuhauses kombiniert mit der Gastfreundschaft der Villa Lemon auf unserer Deluxe 3 BHK Private Floor in der Villa Lemon Phase 2. Diese exklusive Unterkunft befindet sich im ersten Stock und bietet drei geräumige Deluxe-Schlafzimmer, was sie zur perfekten Wahl für große Familien, Gruppen von Freunden, Yoga-Teilnehmer, Geschäftsreisende und Langzeitgäste macht. Anstatt mehrere Hotelzimmer zu buchen, genießen Sie die Privatsphäre einer gesamten Etage, die exklusiv für Ihre Gruppe reserviert ist.",
          fr: "Découvrez le confort d'une maison combiné à l'hospitalité de Villa Lemon dans notre étage privé Deluxe 3 BHK à Villa Lemon Phase 2. Situé au premier étage, cet hébergement exclusif propose trois chambres Deluxe spacieuses, ce qui en fait le choix idéal pour les familles nombreuses, les groupes d'amis, les participants aux retraites de yoga, les voyageurs d'affaires et les séjours de longue durée. Au lieu de réserver plusieurs chambres d'hôtel, profitez de l'intimité d'un étage entier exclusivement réservé à votre groupe.",
          ru: "Оцените домашний комфорт в сочетании с гостеприимством Villa Lemon на нашем этаже Deluxe 3 BHK Private Floor на вилле Lemon Phase 2. Это эксклюзивное жилье на втором этаже предлагает три просторные спальни Делюкс, что делает его идеальным выбором для больших семей, компаний друзей, участников йога-туров, деловых путешественников и гостей, приезжающих на длительный срок. Вместо бронирования нескольких номеров в отеле наслаждайтесь уединением целого этажа, зарезервированного исключительно для вашей группы."
        },
        aboutText2: {
          en: "With spacious bedrooms, attached bathrooms, a shared dining area, and optional kitchen access, you'll have everything you need for a comfortable and memorable stay in Varkala. Conveniently located just minutes from Varkala Cliff, Black Beach, and Papanasam Beach, Villa Lemon Phase 2 provides a peaceful residential setting while keeping you close to Varkala's beaches, cafés, restaurants, yoga centres, and major attractions.",
          de: "Mit geräumigen Schlafzimmern, angeschlossenen Badezimmern, einem gemeinsamen Essbereich und optionalem Zugang zur Küche haben Sie alles, was Sie für einen komfortablen und unvergesslichen Aufenthalt in Varkala benötigen. Die Villa Lemon Phase 2 genießt eine günstige Lage, nur wenige Minuten von der Varkala-Klippe, dem Black Beach und dem Papanasam Beach entfernt. Sie bietet eine ruhige Wohngegend und hält Sie gleichzeitig in der Nähe der Strände, Cafés, Restaurants, Yoga-Zentren und Hauptattraktionen von Varkala.",
          fr: "Avec des chambres spacieuses, des salles de bains attenantes, un coin repas partagé et un accès optionnel à la cuisine, vous aurez tout ce dont vous avez besoin pour un séjour confortable et mémorable à Varkala. Idéalement située à quelques minutes de la falaise de Varkala, de Black Beach et de la plage de Papanasam, la Villa Lemon Phase 2 offre un cadre résidentiel paisible tout en vous gardant à proximité des plages, cafés, restaurants, centres de yoga et principales attractions de Varkala.",
          ru: "Просторные спальни, собственные ванные комнаты, общая обеденная зона и возможность использования кухни (за дополнительную плату) — у вас будет все необходимое для комфортного и незабываемого отдыха в Варкале. Удобное расположение всего в нескольких минутах от скалы Варкала, Черного пляжа и пляжа Папанасам обеспечивает тишину жилого района, при этом вы остаетесь в непосредственной близости от пляжей, кафе, ресторанов, центров йоги и главных достопримечательностей Варкалы."
        },
        perfectLocationText: {
          en: "Located on a quiet residential setting, just minutes away from Varkala Cliff, Black Beach, and Papanasam Beach.",
          de: "In einer ruhigen Wohngegend gelegen, nur wenige Minuten von der Varkala-Klippe, dem Black Beach und dem Papanasam Beach entfernt.",
          fr: "Situé dans un quartier résidentiel calme, à quelques minutes de la falaise de Varkala, de Black Beach et de la plage de Papanasam.",
          ru: "Расположен в тихом жилом квартале, всего в нескольких минутах от скалы Варкала, Черного пляжа и пляжа Папанасам."
        },
        groupAccommodationText: {
          en: "Perfect for large families, groups, yoga retreats, and long-stay guests. Instead of splitting your family or group into separate rooms, everyone stays together on one exclusive floor.",
          de: "Perfekt für große Familien, Gruppen, Yoga-Retreats und Langzeitgäste. Anstatt Ihre Familie oder Gruppe auf separate Zimmer aufzuteilen, bleiben alle auf einer exklusiven Etage zusammen.",
          fr: "Parfait pour les familles nombreuses, les groupes, les retraites de yoga et les séjours de longue durée. Au lieu de diviser votre famille ou votre groupe dans des chambres séparées, tout le monde séjourne ensemble sur un étage exclusif.",
          ru: "Идеально подходит для больших семей, групп, участников йога-ретритов и гостей на длительный срок. Вместо того чтобы разделять компанию по разным номерам, все живут вместе на одном эксклюзивном этаже."
        },
        checkInTime: "12:00 PM",
        checkOutTime: "11:00 AM",
        checkInOutRules: [
          { en: "No smoking inside the accommodation.", de: "Rauchen in der Unterkunft ist nicht gestattet.", fr: "Interdiction de fumer à l'intérieur de l'hébergement.", ru: "Курение внутри жилых помещений запрещено." },
          { en: "Quiet hours must be respected.", de: "Die Ruhezeiten müssen eingehalten werden.", fr: "Les heures de calme doivent être respectées.", ru: "Необходимо соблюдать тихие часы." },
          { en: "Kitchen available for an additional charge.", de: "Küche gegen Aufpreis verfügbar.", fr: "Cuisine disponible moyennant des frais supplémentaires.", ru: "Кухня предоставляется за дополнительную плату." },
          { en: "Extra mattresses available on request (subject to availability).", de: "Zusätzliche Matratzen auf Anfrage erhältlich (je nach Verfügbarkeit).", fr: "Matelas supplémentaires disponibles sur demande (sous réserve de disponibilité).", ru: "Дополнительные матрасы предоставляются по запросу (при наличии)." }
        ],
        roomAmenities: [
          { en: "Three Deluxe Bedrooms", de: "Drei Deluxe-Schlafzimmer", fr: "Trois chambres de luxe", ru: "Три спальни Делюкс" },
          { en: "King-size or twin-bed configuration", de: "Kingsize- oder Twin-Betten-Konfiguration", fr: "Configuration lit king-size ou lits jumeaux", ru: "Двуспальная кровать (King-size) или две отдельные кровати" },
          { en: "Premium mattresses", de: "Premium-Matratzen", fr: "Matelas de qualité supérieure", ru: "Ортопедические матрасы премиум-класса" },
          { en: "Air conditioning in bedrooms", de: "Klimaanlage in den Schlafzimmern", fr: "Climatisation dans les chambres", ru: "Кондиционер в спальнях" },
          { en: "Attached private bathrooms", de: "Angeschlossene private Badezimmer", fr: "Salles de bain privées attenantes", ru: "Собственные ванные комнаты в каждом номере" },
          { en: "Wardrobe or clothes rack", de: "Kleiderschrank oder Kleiderständer", fr: "Garde-robe ou portant à vêtements", ru: "Шкаф или вешалка для одежды" },
          { en: "Fresh bed linen & daily housekeeping", de: "Frische Bettwäsche & tägliche Reinigung", fr: "Draps frais et ménage quotidien", ru: "Свежее постельное белье и ежедневная уборка" },
          { en: "Western toilets & hot water showers", de: "Westliche WCs & Warmwasserduschen", fr: "Toilettes occidentales et douches chaudes", ru: "Унитазы европейского типа и душ с горячей водой" }
        ],
        idealFor: [
          { en: "Large families", de: "Große Familien", fr: "Familles nombreuses", ru: "Большие семьи" },
          { en: "Groups of friends", de: "Gruppen von Freunden", fr: "Groupes d'amis", ru: "Компании друзей" },
          { en: "Yoga retreats & Wellness groups", de: "Yoga-Retreats & Wellness-Gruppen", fr: "Retraites de yoga et groupes de bien-être", ru: "Йога-ретриты и велнес-группы" },
          { en: "Corporate travellers & Digital nomads", de: "Geschäftsreisende & Digitale Nomaden", fr: "Voyageurs d'affaires et nomades numériques", ru: "Корпоративные клиенты и цифровые кочевники" },
          { en: "Long-stay guests", de: "Langzeitgäste", fr: "Clients de longue durée", ru: "Гости на длительный срок" }
        ],
        highlights: [
          { icon: "home", label: { en: "Entire Floor", de: "Komplette Etage", fr: "Étage entier", ru: "Целый этаж" } },
          { icon: "bed", label: { en: "3 Deluxe Bedrooms", de: "3 Deluxe-Zimmer", fr: "3 Chambres Deluxe", ru: "3 спальни Делюкс" } },
          { icon: "users", label: { en: "Up to 9 Guests", de: "Bis zu 9 Gäste", fr: "Jusqu'à 9 personnes", ru: "До 9 гостей" } },
          { icon: "wifi", label: { en: "Free High-Speed Wi-Fi", de: "Gratis schnelles WLAN", fr: "Wi-Fi haut débit gratuit", ru: "Бесплатный Wi-Fi" } }
        ],
        whyGuestsLoveUs: [
          { icon: "home", title: { en: "Exclusive Privacy", de: "Exklusive Privatsphäre", fr: "Intimité exclusive", ru: "Эксклюзивная приватность" }, desc: { en: "The entire first floor is reserved exclusively for your family or group stay.", de: "Die gesamte erste Etage ist exklusiv für Ihren Familien- oder Gruppenaufenthalt reserviert.", fr: "Le premier étage entier est réservé exclusivement au séjour de votre famille ou de votre groupe.", ru: "Весь второй этаж зарезервирован исключительно для вашей семьи или компании." } },
          { icon: "trees", title: { en: "Spacious Gathering", de: "Geräumiger Treffpunkt", fr: "Espace de rassemblement spacieux", ru: "Простор для общения" }, desc: { en: "A spacious dining area creates the perfect gathering place for meals and relaxing.", de: "Ein geräumiger Essbereich bietet den perfekten Ort für gemeinsame Mahlzeiten und Entspannung.", fr: "Un coin repas spacieux constitue le lieu de rassemblement idéal pour les repas et la détente.", ru: "Просторная столовая зона станет идеальным местом для совместной трапезы и отдыха." } }
        ],
        distances: [
          { place: { en: "Varkala Cliff", de: "Varkala-Klippe", fr: "Falaise de Varkala", ru: "Скала Варкала" }, distance: { en: "Minutes away", de: "Wenige Minuten entfernt", fr: "À quelques minutes", ru: "В нескольких минутах" } },
          { place: { en: "Black Beach", de: "Schwarzer Strand (Black Beach)", fr: "Plage Noire", ru: "Черный пляж" }, distance: { en: "Minutes away", de: "Wenige Minuten entfernt", fr: "À quelques minutes", ru: "В нескольких минутах" } },
          { place: { en: "Papanasam Beach", de: "Papanasam-Strand", fr: "Plage de Papanasam", ru: "Пляж Папанасам" }, distance: { en: "Minutes away", de: "Wenige Minuten entfernt", fr: "À quelques minutes", ru: "В нескольких минутах" } }
        ],
        additionalServices: [
          { service: { en: "Kitchen Access", de: "Küchennutzung", fr: "Accès à la cuisine", ru: "Использование кухни" }, details: { en: "Fully equipped kitchen available for an additional charge.", de: "Voll ausgestattete Küche gegen Aufpreis verfügbar.", fr: "Cuisine entièrement équipée disponible moyennant des frais supplémentaires.", ru: "Полностью оборудованная кухня за дополнительную плату." } },
          { service: { en: "Airport transfers", de: "Flughafentransfer", fr: "Navette aéroport", ru: "Трансфер из аэропорта" }, details: { en: "Available on request to and from Trivandrum Airport.", de: "Auf Anfrage von und zum Flughafen Trivandrum verfügbar.", fr: "Disponible sur demande depuis et vers l'aéroport de Trivandrum.", ru: "Предоставляется по запросу в/из аэропорта Тривандрама." } },
          { service: { en: "Rooftop yoga hall", de: "Yoga-Halle auf dem Dach", fr: "Salle de yoga sur le toit", ru: "Зал для йоги на крыше" }, details: { en: "Yoga hall available on request for retreats and classes.", de: "Yoga-Halle auf Anfrage für Retreats und Kurse verfügbar.", fr: "Salle de yoga disponible sur demande pour les retraites et les cours.", ru: "Зал для йоги предоставляется по запросу для ретритов и занятий." } }
        ],
        gallery: [terraceImg],
        galleryPublicIds: [terracePublicId]
      },
      {
        slug: "deluxe-room-with-balcony",
        accommodationType: "room",
        title: {
          en: "Deluxe Room with Balcony",
          de: "Deluxe-Zimmer mit Balkon",
          fr: "Chambre Deluxe avec Balcon",
          ru: "Номер Делюкс с балконом"
        },
        price: 4500,
        pricePeriod: { en: "/ night", de: "/ Nacht", fr: "/ nuit", ru: "/ ночь" },
        image: roomImg,
        imagePublicId: roomPublicId,
        aboutImage: aboutImg,
        aboutImagePublicId: aboutPublicId,
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        location: { en: "Varkala, Kerala", de: "Varkala, Kerala", fr: "Varkala, Kerala", ru: "Варкала, Керала" },
        shortDescription: {
          en: "Experience comfort, privacy, and warm Kerala hospitality in our Deluxe Room with Balcony at Villa Lemon.",
          de: "Erleben Sie Komfort, Privatsphäre und herzliche Gastfreundschaft aus Kerala in unserem Deluxe-Zimmer mit Balkon in der Villa Lemon.",
          fr: "Découvrez le confort, l'intimité et la chaleureuse hospitalité du Kerala dans notre chambre Deluxe avec balcon à Villa Lemon.",
          ru: "Наслаждайтесь комфортом, уединением и теплым гостеприимством Кералы в нашем номере Делюкс с балконом."
        },
        tagline: {
          en: "Comfortable Stay with a Private Balcony at Villa Lemon",
          de: "Komfortabler Aufenthalt mit privatem Balkon in der Villa Lemon",
          fr: "Séjour confortable avec balcon privé à Villa Lemon",
          ru: "Комфортное проживание с собственным балконом на вилле Lemon"
        },
        aboutText1: {
          en: "Experience comfort, privacy, and warm Kerala hospitality in our Deluxe Room with Balcony at Villa Lemon. Thoughtfully designed for couples, this spacious air-conditioned room offers a relaxing atmosphere, modern amenities, and a private balcony where you can enjoy the peaceful surroundings after a day of exploring Varkala. Located just minutes from Varkala Cliff, Black Beach, and Papanasam Beach, this room is an excellent choice for romantic getaways.",
          de: "Erleben Sie Komfort, Privatsphäre und herzliche Gastfreundschaft aus Kerala in unserem Deluxe-Zimmer mit Balkon in der Villa Lemon. Dieses geräumige, klimatisierte Zimmer wurde sorgfältig für Paare entworfen und bietet eine entspannte Atmosphäre, moderne Annehmlichkeiten und einen privaten Balkon, auf dem Sie die ruhige Umgebung nach einem Tag voller Erkundungen in Varkala genießen können. Nur wenige Minuten von der Varkala-Klippe, dem Black Beach und dem Papanasam Beach entfernt, ist dieses Zimmer eine hervorragende Wahl für einen romantischen Kurzurlaub.",
          fr: "Découvrez le confort, l'intimité et la chaleureuse hospitalité du Kerala dans notre chambre Deluxe avec balcon à Villa Lemon. Soigneusement conçue pour les couples, cette chambre spacieuse climatisée offre une atmosphère relaxante, des équipements modernes et un balcon privé où vous pourrez profiter du calme environnant après une journée passée à explorer Varkala. Située à quelques minutes seulement de la falaise de Varkala, de Black Beach et de la plage de Papanasam, cette chambre est un excellent choix pour les escapades romantiques.",
          ru: "Наслаждайтесь комфортом, уединением и теплым гостеприимством Кералы в нашем номере Делюкс с балконом на вилле Lemon. Этот просторный кондиционированный номер, созданный специально для пар, предлагает расслабляющую атмосферу, современные удобства и собственный балкон, где можно наслаждаться тишиной после дня, проведенного в Варкале. Расположенный всего в нескольких минутах от скалы Варкала, Черного пляжа и пляжа Папанасам, этот номер — отличный выбор для романтического отдыха."
        },
        aboutText2: {
          en: "The room features a comfortable king-size bed or twin beds with quality bedding, ensuring a restful night's sleep. Modern conveniences such as air conditioning, complimentary Wi-Fi, and an attached bathroom with hot water provide everything you need for a pleasant stay. Guests also have access to a spacious shared dining area, while the fully equipped kitchen can be used for an additional charge, making this room suitable for both short holidays and extended stays.",
          de: "Das Zimmer verfügt über ein komfortables Kingsize- oder Twin-Bett mit hochwertiger Bettwäsche, die eine erholsame Nachtruhe garantiert. Moderne Annehmlichkeiten wie Klimaanlage, kostenloses WLAN und ein angeschlossenes Badezimmer mit heißem Wasser bieten alles, was Sie für einen angenehmen Aufenthalt benötigen. Die Gäste haben auch Zugang zu einem geräumigen Gemeinschafts-Essbereich, während die voll ausgestattete Küche gegen eine zusätzliche Gebühr genutzt werden kann, was dieses Zimmer sowohl für Kurzurlaube als auch für längere Aufenthalte geeignet macht.",
          fr: "La chambre dispose d'un lit king-size confortable ou de lits jumeaux avec une literie de qualité, garantissant une nuit de sommeil reposante. Les équipements modernes tels que la climatisation, le Wi-Fi gratuit et une salle de bain attenante avec eau chaude fournissent tout le nécessaire pour un séjour agréable. Les clients ont également accès à un grand coin repas partagé, tandis que la cuisine entièrement équipée peut être utilisée moyennant des frais supplémentaires, ce qui rend cette chambre adaptée aussi bien aux vacances de courte durée qu'aux séjours prolongés.",
          ru: "Номер оборудован удобной двуспальной кроватью (King-size) или двумя отдельными кроватями с качественным бельем, что гарантирует отличный сон. Такие современные удобства, как кондиционер, бесплатный Wi-Fi и собственная ванная комната с горячей водой, обеспечат вам комфортное проживание. Гости также имеют доступ к просторной общей столовой, а полностью оборудованную кухню можно использовать за дополнительную плату, что делает этот номер подходящим как для коротких выходных, так и для длительного отдыха."
        },
        perfectLocationText: {
          en: "Located just minutes from Varkala Cliff, Black Beach, and Papanasam Beach in a peaceful residential neighborhood.",
          de: "Nur wenige Minuten von der Varkala-Klippe, dem Black Beach und dem Papanasam Beach entfernt, in einer ruhigen Wohngegend.",
          fr: "Situé à quelques minutes seulement de la falaise de Varkala, de Black Beach et de la plage de Papanasam, dans un quartier résidentiel paisible.",
          ru: "Расположен всего в нескольких минутах от скалы Варкала, Черного пляжа и пляжа Папанасам в тихом жилом районе."
        },
        groupAccommodationText: {
          en: "The Deluxe Room with Balcony comfortably accommodates two adults. An extra mattress may be available upon request, subject to availability.",
          de: "Das Deluxe-Zimmer mit Balkon bietet bequem Platz für zwei Erwachsene. Eine zusätzliche Matratze kann auf Anfrage zur Verfügung gestellt werden (je nach Verfügbarkeit).",
          fr: "La chambre Deluxe avec balcon accueille confortablement deux adultes. Un matelas supplémentaire peut être fourni sur demande, sous réserve de disponibilité.",
          ru: "Номер Делюкс с балконом с комфортом вмещает двух взрослых. Дополнительный матрас может быть предоставлен по запросу (при наличии)."
        },
        checkInTime: "2:00 PM",
        checkOutTime: "11:00 AM",
        checkInOutRules: [
          { en: "No smoking inside the room.", de: "Rauchen im Zimmer ist nicht gestattet.", fr: "Interdiction de fumer à l'intérieur de la chambre.", ru: "Курение в номере запрещено." },
          { en: "Quiet hours must be respected.", de: "Die Ruhezeiten müssen eingehalten werden.", fr: "Les heures de calme doivent être respectées.", ru: "Необходимо соблюдать тихие часы." },
          { en: "Extra mattress available on request (subject to availability).", de: "Zusätzliche Matratze auf Anfrage erhältlich (je nach Verfügbarkeit).", fr: "Matelas supplémentaire disponible sur demande (sous réserve de disponibilité).", ru: "Дополнительный матрас предоставляется по запросу (при наличии)." }
        ],
        roomAmenities: [
          { en: "Air Conditioning & Private Balcony", de: "Klimaanlage & Eigener Balkon", fr: "Climatisation et balcon privé", ru: "Кондиционер и собственный балкон" },
          { en: "King-Size Bed or Twin Beds", de: "Kingsize- oder Twin-Bett", fr: "Lit king-size ou lits jumeaux", ru: "Двуспальная или раздельные кровати" },
          { en: "Premium Mattress & Fresh Towels", de: "Premium-Matratze & Frische Handtücher", fr: "Matelas de qualité supérieure et serviettes fraîches", ru: "Премиум-матрас и свежие полотенца" },
          { en: "Attached Bathroom with Hot Water", de: "Angeschlossenes Bad mit Warmwasser", fr: "Salle de bain attenante avec eau chaude", ru: "Собственная ванная комната с горячей водой" },
          { en: "Quality Bed Linen & Wardrobe", de: "Hochwertige Bettwäsche & Kleiderschrank", fr: "Literie de qualité et garde-robe", ru: "Качественное постельное белье и шкаф" },
          { en: "Mirror & Power Sockets Near the Bed", de: "Spiegel & Steckdosen in Bettnähe", fr: "Miroir et prises électriques près du lit", ru: "Зеркало и розетки возле кровати" },
          { en: "Shared Dining Area & Kitchen Access (Extra Charge)", de: "Gemeinsamer Essbereich & Küchenzugang (Aufpreis)", fr: "Coin repas partagé et accès cuisine (frais en plus)", ru: "Общая столовая и доступ к кухне (за дополнительную плату)" },
          { en: "Complimentary Drinking Water & Daily Housekeeping", de: "Kostenloses Trinkwasser & Tägliche Reinigung", fr: "Eau potable gratuite et ménage quotidien", ru: "Бесплатная питьевая вода и ежедневная уборка" }
        ],
        idealFor: [
          { en: "Couples & Honeymooners", de: "Paare & Flitterwochen", fr: "Couples et lunes de miel", ru: "Пары и молодожены" },
          { en: "Weekend travellers & Remote workers", de: "Wochenendtouristen & Remote-Arbeiter", fr: "Voyageurs d'un week-end et télétravailleurs", ru: "Туристы выходного дня и удаленные работники" },
          { en: "Long-stay guests & International travellers", de: "Langzeitgäste & Internationale Reisende", fr: "Clients de longue durée et voyageurs internationaux", ru: "Гости на длительный срок и иностранные туристы" }
        ],
        highlights: [
          { icon: "balcony", label: { en: "Private Balcony", de: "Eigener Balkon", fr: "Balcon privé", ru: "Собственный балкон" } },
          { icon: "bed", label: { en: "King-Size Bed", de: "Kingsize-Bett", fr: "Lit king-size", ru: "Большая кровать" } },
          { icon: "wifi", label: { en: "Free High-Speed Wi-Fi", de: "Gratis schnelles WLAN", fr: "Wi-Fi haut débit gratuit", ru: "Бесплатный Wi-Fi" } },
          { icon: "parking", label: { en: "Free Parking", de: "Gratis Parken", fr: "Parking gratuit", ru: "Бесплатная парковка" } }
        ],
        whyGuestsLoveUs: [
          { icon: "coffee", title: { en: "Balcony Experience", de: "Balkon-Erlebnis", fr: "Expérience du balcon", ru: "Отдых на балконе" }, desc: { en: "Start your morning with a cup of coffee or unwind in the evening on your private balcony.", de: "Beginnen Sie Ihren Morgen mit einer Tasse Kaffee oder entspannen Sie sich abends auf Ihrem privaten Balkon.", fr: "Commencez votre matinée avec une tasse de café ou détendez-vous le soir sur votre balcon privé.", ru: "Начните утро с чашечки кофе или расслабьтесь вечером на собственном балконе." } },
          { icon: "star", title: { en: "Peaceful Retreat", de: "Ruhiger Rückzugsort", fr: "Ruhiger Rückzugsort", ru: "Тишина и уют" }, desc: { en: "Nestled in a tranquil neighborhood, completely insulated from traffic noise.", de: "Eingebettet in ein ruhiges Viertel, völlig ungestört von Verkehrslärm.", fr: "Niché dans un quartier tranquille, complètement isolé du bruit de la circulation.", ru: "Расположен в тихом квартале, вдали от шума дорог." } }
        ],
        distances: [
          { place: { en: "Varkala Cliff", de: "Varkala-Klippe", fr: "Falaise de Varkala", ru: "Скала Варкала" }, distance: { en: "Minutes away", de: "Wenige Minuten entfernt", fr: "À quelques minutes", ru: "В нескольких минутах" } },
          { place: { en: "Black Beach", de: "Schwarzer Strand (Black Beach)", fr: "Plage Noire", ru: "Черный пляж" }, distance: { en: "Minutes away", de: "Wenige Minuten entfernt", fr: "À quelques minutes", ru: "В нескольких минутах" } }
        ],
        additionalServices: [
          { service: { en: "Shared Kitchen Access", de: "Gemeinschaftsküche-Nutzung", fr: "Accès à la cuisine commune", ru: "Доступ к общей кухне" }, details: { en: "Available for guest use at an additional charge.", de: "Für Gäste gegen Aufpreis verfügbar.", fr: "Disponible pour les clients moyennant des frais supplémentaires.", ru: "Предоставляется гостям за дополнительную плату." } },
          { service: { en: "Airport transfers & Excursions", de: "Flughafentransfers & Ausflüge", fr: "Transferts aéroport et excursions", ru: "Трансфер из аэропорта и экскурсии" }, details: { en: "Sightseeing tours and airport pick-up available on request.", de: "Sightseeing-Touren und Abholung vom Flughafen auf Anfrage verfügbar.", fr: "Visites touristiques et navette aéroport disponibles sur demande.", ru: "Экскурсии и трансфер предоставляются по запросу." } }
        ],
        gallery: [roomImg],
        galleryPublicIds: [roomPublicId]
      }
    ];

    console.log("[seeder]: Seeding new properties...");
    for (const stay of newStays) {
      const exists = await AccommodationItem.findOne({ slug: stay.slug });
      if (!exists) {
        await AccommodationItem.create(stay);
        console.log(`[seeder]: Created stay ${stay.title.en}`);
      } else {
        console.log(`[seeder]: Stay ${stay.title.en} already exists, skipping.`);
      }
    }
    console.log("[seeder]: Done seeding.");
    process.exit(0);
  } catch (error: any) {
    console.error("[seeder]: Error during seed script execution:", error);
    process.exit(1);
  }
};

run();
