import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";

dotenv.config();

const notesText = {
  en: `• Check-in: 12:00 PM | Check-out: 11:00 AM.
• Government-issued photo ID is required at check-in.
• Complimentary high-speed Wi-Fi is available throughout the property.
• Free private parking is available for guests.
• Daily housekeeping is included.
• Extra mattresses are available on request (subject to availability).
• Airport transfers and sightseeing tours can be arranged on request.
• Yoga classes and wellness experiences are available on request.
• No smoking inside rooms or indoor areas.
• Quiet hours must be respected to ensure a peaceful stay.
• Pets are allowed only with prior approval (if applicable).
• Early check-in and late check-out are subject to availability.`,
  de: `• Check-in: 12:00 PM | Check-out: 11:00 AM.
• Regierungsamtlicher Lichtbildausweis beim Check-in erforderlich.
• Kostenloses Highspeed-WLAN in der gesamten Unterkunft verfügbar.
• Kostenloser Privatparkplatz für Gäste vorhanden.
• Tägliche Zimmerreinigung inbegriffen.
• Zusätzliche Matratzen auf Anfrage erhältlich (nach Verfügbarkeit).
• Flughafentransfers und Besichtigungstouren auf Anfrage arrangiert.
• Yogastunden und Wellness-Erlebnisse auf Anfrage verfügbar.
• Rauchen im Zimmer oder in Innenbereichen verboten.
• Ruhezeiten müssen für einen friedlichen Aufenthalt eingehalten werden.
• Haustiere nur mit vorheriger Genehmigung erlaubt (falls zutreffend).
• Früher Check-in und später Check-out nach Verfügbarkeit.`,
  fr: `• Enregistrement: 12:00 | Départ: 11:00.
• Une pièce d'identité avec photo émise par le gouvernement est requise à l'enregistrement.
• Connexion Wi-Fi haut débit gratuite disponible dans tout l'établissement.
• Un parking privé gratuit est disponible pour les clients.
• Le ménage quotidien est inclus.
• Des matelas supplémentaires sont disponibles sur demande (sous réserve de disponibilité).
• Des transferts aéroport et des visites guidées peuvent être organisés sur demande.
• Des cours de yoga et des expériences de bien-être sont disponibles sur demande.
• Interdiction de fumer dans les chambres ou les espaces intérieurs.
• Les heures de silence doivent être respectées pour garantir un séjour paisible.
• Animaux autorisés uniquement avec approbation préalable (le cas échéant).
• L'enregistrement anticipé et le départ tardif sont soumis à disponibilité.`,
  ru: `• Заселение: 12:00 | Выезд: 11:00.
• При заселении требуется удостоверение личности с фотографией государственного образца.
• Бесплатный высокоскоростной Wi-Fi предоставляется на всей территории объекта.
• Для гостей доступна бесплатная частная парковка.
• Ежедневная уборка включена в стоимость.
• Дополнительные матрасы предоставляются по запросу (при наличии).
• Трансфер из аэропорта и экскурсии могут быть организованы по запросу.
• Занятия йогой и велнес-программы доступны по запросу.
• Курение в номерах и во внутренних помещениях запрещено.
• Для обеспечения спокойного отдыха необходимо соблюдать часы тишины.
• Размещение с домашними животными допускается только по предварительному согласованию (если применимо).
• Ранний заезд и поздний выезд предоставляются при наличии возможности.`
};

const run = async () => {
  try {
    await connectDB();
    console.log("[update]: Scanning accommodation items...");

    const items = await AccommodationItem.find({});
    console.log(`[update]: Found ${items.length} accommodation items.`);

    let count = 0;
    for (const item of items) {
      item.notes = notesText;
      await item.save();
      console.log(`[update]: Updated important notes for stay: "${item.title.en}" (${item.slug})`);
      count++;
    }

    console.log(`[update]: Completed updating important notes for ${count} stays.`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Update failed:", err);
    process.exit(1);
  }
};

run();
