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
        fr: "Merci d'avoir choisi Villa Lemon Homestay. Nous nous réjouissons de vous accueillir à Varkala et de vous offrir un séjour confortable et mémorable.",
        ru: "Благодарим вас за выбор Villa Lemon Homestay. Мы с нетерпением ждем возможности приветствовать вас в Варкале и обеспечить вам комфортное и незабываемое пребывание."
      };

      prog.markModified("hostRetreatConfig");
      await prog.save();
      console.log(`Updated policies and rooms AC for program: ${prog.title?.en || prog._id}`);
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
