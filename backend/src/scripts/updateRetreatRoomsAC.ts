import mongoose from "mongoose";
import dotenv from "dotenv";
import { YogaProgram } from "../models/Yoga";

dotenv.config();

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found in env file.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected successfully.");

  // Find all programs
  const programs = await YogaProgram.find({});
  console.log(`Found ${programs.length} total yoga programs.`);

  let updatedCount = 0;
  for (const prog of programs) {
    if (prog.hostRetreatConfig && prog.hostRetreatConfig.rooms) {
      console.log(`Processing program: ${prog.title?.en || prog._id}`);
      
      const config = prog.hostRetreatConfig;

      // Update Rooms AC
      const rooms = config.rooms;
      if (Array.isArray(rooms)) {
        rooms.forEach((r: any) => {
          r.ac = true;
        });
      }

      // Update Policies
      config.confirmationRule1 = {
        en: "Booking confirmation will be provided only upon receipt of the required advance payment.",
        de: "Die Buchungsbestätigung erfolgt erst nach Erhalt der erforderlichen Anzahlung.",
        fr: "La confirmation de la réservation ne sera fournie qu'après réception de l'acompte requis.",
        ru: "Подтверждение бронирования предоставляется только после получения необходимой предоплаты."
      };
      config.confirmationRule2 = { en: "", de: "", fr: "", ru: "" };
      config.confirmationRule3 = { en: "", de: "", fr: "", ru: "" };

      config.paymentTermsRule1 = {
        en: "The balance amount, if any, must be settled before or upon check-in, as agreed at the time of booking.",
        de: "Der Restbetrag muss vor oder bei dem Check-in beglichen werden, wie bei der Buchung vereinbart.",
        fr: "Le solde, le cas échéant, doit être réglé avant ou lors de l'enregistrement, comme convenu lors de la réservation.",
        ru: "Оставшаяся сумма, если таковая имеется, должна быть выплачена до или во время регистрации, как было согласовано при бронировании."
      };
      config.paymentTermsRule2 = { en: "", de: "", fr: "", ru: "" };
      config.paymentTermsRule3 = { en: "", de: "", fr: "", ru: "" };
      config.paymentTermsRule4 = { en: "", de: "", fr: "", ru: "" };

      config.termsRule1 = {
        en: "The above rates are valid for stays during the month of November.",
        de: "Die oben genannten Preise gelten für Aufenthalte im November.",
        fr: "Les tarifs ci-dessus sont valables pour les séjours durant le mois de novembre.",
        ru: "Вышеуказанные тарифы действительны для проживания в течение ноября."
      };
      config.termsRule2 = {
        en: "All rates are inclusive of applicable GST.",
        de: "Alle Preise verstehen sich inklusive der geltenden GST-Steuer.",
        fr: "Tous les tarifs incluent la taxe GST applicable.",
        ru: "Все тарифы включают применимый налог GST."
      };
      config.termsRule3 = {
        en: "All reservations are subject to room availability at the time of booking.",
        de: "Alle Reservierungen unterliegen der Zimmerverfügbarkeit zum Zeitpunkt der Buchung.",
        fr: "Toutes les réservations sont soumises à la disponibilité des chambres au moment de la réservation.",
        ru: "Все бронирования зависят от наличия свободных номеров на момент бронирования."
      };
      config.termsRule4 = { en: "", de: "", fr: "", ru: "" };
      config.termsRule5 = { en: "", de: "", fr: "", ru: "" };
      config.termsRule6 = { en: "", de: "", fr: "", ru: "" };
      config.termsRule7 = { en: "", de: "", fr: "", ru: "" };

      config.cancel60Days = {
        en: "Cancellations made 30 days or more before the check-in date",
        de: "Stornierungen ab 30 Tage vor dem Anreisedatum",
        fr: "Annulations effectuées 30 jours ou plus avant la date d'arrivée",
        ru: "Отмена бронирования за 30 дней и более до даты заезда"
      };
      config.cancel60DaysDesc = {
        en: "Eligible for a full refund of the advance payment.",
        de: "Anspruch auf eine vollständige Rückerstattung der Anzahlung.",
        fr: "Éligible à un remboursement complet de l'acompte.",
        ru: "Право на полный возврат предоплаты."
      };
      config.cancel30to59 = {
        en: "Cancellations made within 30 days of the check-in date",
        de: "Stornierungen innerhalb von 30 Tagen vor dem Anreisedatum",
        fr: "Annulations effectuées dans les 30 jours précédant la date d'arrivée",
        ru: "Отмена бронирования в течение 30 дней до даты заезда"
      };
      config.cancel30to59Desc = {
        en: "Non-refundable.",
        de: "Nicht erstattungsfähig.",
        fr: "Non remboursable.",
        ru: "Не подлежит возврату."
      };
      config.cancelUnder30 = { en: "", de: "", fr: "", ru: "" };
      config.cancelUnder30Desc = { en: "", de: "", fr: "", ru: "" };
      config.noShow = { en: "", de: "", fr: "", ru: "" };
      config.noShowDesc = { en: "", de: "", fr: "", ru: "" };

      config.amendmentsRule1 = {
        en: "Date changes are subject to availability and management approval.",
        de: "Terminänderungen unterliegen der Verfügbarkeit und der Genehmigung durch das Management.",
        fr: "Les modifications de dates sont soumises à disponibilité et à l'approbation de la direction.",
        ru: "Изменение дат возможно при наличии свободных мест и одобрении руководства."
      };
      config.amendmentsRule2 = { en: "", de: "", fr: "", ru: "" };
      config.amendmentsRule3 = { en: "", de: "", fr: "", ru: "" };

      config.forceMajeureTitle = { en: "", de: "", fr: "", ru: "" };
      config.forceMajeureDesc = { en: "", de: "", fr: "", ru: "" };

      config.footerGreeting = {
        en: "Thank you for choosing Villa Lemon Homestay. We look forward to welcoming you to Varkala and providing you with a comfortable and memorable stay.",
        de: "Vielen Dank, dass Sie sich für das Villa Lemon Homestay entschieden haben. Wir freuen uns darauf, Sie in Varkala begrüßen zu dürfen und Ihnen einen angenehmen Aufenthalt zu bieten.",
        fr: "Merci d'avoir choisi Villa Lemon Homestay. We look forward to welcoming you to Varkala and providing you with a comfortable and memorable stay.",
        ru: "Благодарим вас за выбор Villa Lemon Homestay. Мы с нетерпением ждем возможности приветствовать вас в Варкале и обеспечить вам комфортное и незабываемое пребывание."
      };

      // Experience Section
      config.experienceTitle = {
        en: "5+ Years",
        de: "5+ Jahre",
        fr: "5+ Ans",
        ru: "5+ Лет"
      };
      config.experienceStats = {
        en: "Hosting Global Retreats",
        de: "Ausrichter globaler Retreats",
        fr: "Accueil de retraites mondiales",
        ru: "Организация международных ретритов"
      };
      config.experienceDesc = {
        en: "We have been hosting premium yoga retreats and wellness programs for over 5 years. Our hosts have welcomed teachers and practitioners from Germany, France, the UK, Russia, and all over the world, creating a warm, inclusive community space.",
        de: "Wir veranstalten seit über 5 Jahren erstklassige Yoga-Retreats und Wellness-Programme. Unsere Gastgeber haben Lehrer und Praktizierende aus Deutschland, Frankreich, Großbritannien, Russland und der ganzen Welt willkommen geheißen und so einen warmen, integrativen Gemeinschaftsraum geschaffen.",
        fr: "Nous organisons des retraites de yoga et des programmes de bien-être haut de gamme depuis plus de 5 ans. Nos hôtes ont accueilli des enseignants et des praticiens d'Allemagne, de France, du Royaume-Uni, de Russie et du monde entier, créant ainsi un espace communautaire chaleureux et inclusif.",
        ru: "Мы проводим йога-ретриты премиум-класса и оздоровительные программы уже более 5 лет. Наши хозяева принимали преподавателей и практиков из Германии, Франции, Великобритании, России и со всего мира, создавая теплое, инклюзивное пространство для сообщества."
      };

      // Addons / Curated excursions
      config.addonsTitle = {
        en: "Curated Excursions & Extras",
        de: "Kurierte Ausflüge & Extras",
        fr: "Excursions et Extras sur Mesure",
        ru: "Организованные Экскурсии и Дополнительные Услуги"
      };
      config.addonsIntro = {
        en: "To make your retreat truly unforgettable, we offer curated local packages and excursions for your group.",
        de: "Um Ihr Retreat unvergesslich zu machen, bieten wir kuratierte lokale Pakete und Ausflüge für Ihre Gruppe an.",
        fr: "Pour rendre votre retraite inoubliable, nous proposons des forfaits locaux et des excursions sur mesure pour votre groupe.",
        ru: "Чтобы сделать ваш ретрит незабываемым, мы предлагаем специальные пакеты экскурсий для вашей группы."
      };
      config.addon1Title = {
        en: "Varkala Sightseeing",
        de: "Varkala Besichtigung",
        fr: "Visite de Varkala",
        ru: "Достопримечательности Варкалы"
      };
      config.addon1Desc = {
        en: "Explore the famous Varkala Cliffs, ancient temples, natural springs, and pristine beaches with our guided day trips.",
        de: "Erkunden Sie die berühmten Klippen von Varkala, alte Tempel, natürliche Quellen und unberührte Strände bei unseren geführten Tagesausflügen.",
        fr: "Explorez les célèbres falaises de Varkala, les temples anciens, les sources naturelles et les plages immaculées grâce à nos excursions guidées d'une journée.",
        ru: "Исследуйте знаменитые клифы Варкалы, древние храмы, природные источники и чистейшие пляжи в наших однодневных поездках с гидом."
      };
      config.addon2Title = {
        en: "Backwater & Mangrove Tours",
        de: "Backwater & Mangroven Touren",
        fr: "Tours des Backwaters & Mangroves",
        ru: "Туры по Заводям и Манграм"
      };
      config.addon2Desc = {
        en: "Paddle through tranquil mangrove forests at sunrise or enjoy a relaxing houseboat cruise in the nearby backwaters.",
        de: "Paddeln Sie bei Sonnenaufgang durch ruhige Mangrovenwälder oder genießen Sie eine entspannende Hausbootfahrt in den nahe gelegenen Backwaters.",
        fr: "Naviguez dans les forêts de mangroves paisibles au lever du soleil ou profitez d'une croisière relaxante en péniche dans les backwaters voisins.",
        ru: "Проплывите на каяке по тихим мангровым лесам на рассвете или насладитесь расслабляющим круизом на хаусботе по близлежащим заводям."
      };
      config.addon3Title = {
        en: "Ayurvedic Treatments",
        de: "Ayurvedische Behandlungen",
        fr: "Soins Ayurvédiques",
        ru: "Аюрведические Процедуры"
      };
      config.addon3Desc = {
        en: "Treat your participants to authentic Ayurvedic massages, consultations, and traditional steam bath therapies.",
        de: "Verwöhnen Sie Ihre Teilnehmer mit authentischen ayurvedischen Massagen, Konsultationen und traditionellen Dampfbadtherapien.",
        fr: "Offrez à vos participants des massages ayurvédiques authentiques, des consultations et des thérapies traditionnelles par bain de vapeur.",
        ru: "Порадуйте своих участников аутентичным аюрведическим массажем, консультациями и традиционными паровыми банями."
      };

      // FAQs
      config.faq1Question = {
        en: "Do you provide yoga props and mats?",
        de: "Stellen Sie Yoga-Requisiten und Matten zur Verfügung?",
        fr: "Fournissez-vous des accessoires et des tapis de yoga?",
        ru: "Предоставляете ли вы инвентарь и коврики для йоги?"
      };
      config.faq1Answer = {
        en: "Yes, our rooftop yoga shala is fully equipped with high-quality yoga mats, blocks, and straps, all available free of charge.",
        de: "Ja, unsere Yoga-Shala auf dem Dach ist komplett mit hochwertigen Yogamatten, Blöcken und Gurten ausgestattet, die alle kostenlos zur Verfügung stehen.",
        fr: "Oui, notre shala de yoga sur le toit est entièrement équipé de tapis de yoga, de briques et de sangles de qualité, tous disponibles gratuitement.",
        ru: "Да, наш зал для йоги на крыше полностью оборудован высококачественными ковриками, блоками и ремнями, все предоставляется бесплатно."
      };
      config.faq2Question = {
        en: "Can you cater to specific dietary requirements?",
        de: "Können Sie auf spezielle Ernährungsbedürfnisse eingehen?",
        fr: "Pouvez-vous vous adapter à des régimes alimentaires particuliers?",
        ru: "Можете ли вы учесть особые требования к питанию?"
      };
      config.faq2Answer = {
        en: "Absolutely. Our kitchen staff is trained in preparing vegan, gluten-free, dairy-free, and custom Ayurvedic meals upon request.",
        de: "Absolut. Unsere Küchenmitarbeiter sind geschult auf Anfrage vegane, glutenfreie, milchfreie und maßgeschneiderte ayurvedische Mahlzeiten zuzubereiten.",
        fr: "Absolument. Notre personnel de cuisine est formé pour préparer des repas végétaliens, sans gluten, sans produits laitiers et ayurvédiques sur demande.",
        ru: "Конечно. Наш персонал обучен приготовлению веганских, безглютеновых, безлактозных и индивидуальных аюрведических блюд по запросу."
      };
      config.faq3Question = {
        en: "Do you arrange airport transfers?",
        de: "Organisieren Sie Flughafentransfers?",
        fr: "Organisez-vous les transferts depuis l'aéroport?",
        ru: "Организуете ли вы трансфер из аэропорта?"
      };
      config.faq3Answer = {
        en: "Yes, we can arrange reliable transfers from Trivandrum International Airport (TRV) using Sedans, SUVs, or Tempo Travellers.",
        de: "Ja, wir können zuverlässige Transfers vom Trivandrum International Airport (TRV) mit Limousinen, SUVs oder Tempo-Reisebussen organisieren.",
        fr: "Oui, nous pouvons organiser des transferts fiables depuis l'aéroport de Trivandrum (TRV) en berline, SUV ou Tempo Traveller.",
        ru: "Да, мы можем организовать надежный трансфер из международного аэропорта Тривандрам (TRV) на седанах, внедорожниках или автобусах."
      };
      config.faq4Question = {
        en: "Is there a minimum group size to book?",
        de: "Gibt es eine Mindestgruppengröße für die Buchung?",
        fr: "Y a-t-il une taille minimale de groupe pour réserver?",
        ru: "Есть ли минимальный размер группы для бронирования?"
      };
      config.faq4Answer = {
        en: "We accommodate both small intimate groups and larger retreats of up to 18-20 participants depending on room configurations.",
        de: "Wir bieten Platz für kleine, intime Gruppen sowie für größere Retreats mit bis zu 18–20 Teilnehmern, je nach Zimmerkonfiguration.",
        fr: "Nous accueillons aussi bien de petits groupes intimes que des retraites plus importantes allant jusqu'à 18-20 participants selon la configuration des chambres.",
        ru: "Мы принимаем как небольшие группы, так и крупные ретриты до 18-20 участников в зависимости от конфигурации номеров."
      };

      prog.markModified("hostRetreatConfig");
      await prog.save();
      console.log(`Updated policies, rooms AC, experience, addons, and FAQs for program: ${prog.title?.en || prog._id}`);
      updatedCount++;
    }
  }

  console.log(`Successfully updated ${updatedCount} programs.`);
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
};

run().catch((err) => {
  console.error("Error running script:", err);
  process.exit(1);
});
