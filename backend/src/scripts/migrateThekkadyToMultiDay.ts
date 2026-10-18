import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { PackageItem } from "../models/PackageItem";
import { ILocalizedText } from "../types";

dotenv.config();

function loc(enText: string): ILocalizedText {
  return {
    en: enText,
    de: enText,
    fr: enText,
    ru: enText,
  };
}

function cleanTime(str: string): string {
  // Strip "Day 1 – ", "Day 1 - ", "Copy time label", etc.
  return str
    .replace(/^day\s*\d+\s*[-–]\s*/i, "")
    .replace(/copy\s+time\s+label/gi, "")
    .trim();
}

function cleanText(str: string): string {
  return str
    .replace(/copy\s+description/gi, "")
    .replace(/copy\s+activity/gi, "")
    .trim();
}

function cleanLocalized(lText: ILocalizedText | undefined, isTime = false): ILocalizedText {
  const en = isTime ? cleanTime(lText?.en || "") : cleanText(lText?.en || "");
  const de = isTime ? cleanTime(lText?.de || en) : cleanText(lText?.de || en);
  const fr = isTime ? cleanTime(lText?.fr || en) : cleanText(lText?.fr || en);
  const ru = isTime ? cleanTime(lText?.ru || en) : cleanText(lText?.ru || en);
  return { en, de, fr, ru };
}

async function run() {
  await connectDB();

  console.log("=== Migrating Thekkady packages to Multi-Day Itinerary ===");

  // 1. Migrate the newly added CMS item: 'thekkady-tour-package-2-nights-3-days-copy-package-name'
  const item2N3D = await PackageItem.findOne({ slug: "thekkady-tour-package-2-nights-3-days-copy-package-name" });
  if (item2N3D) {
    console.log(`Found 2N/3D package: "${item2N3D.title.en}" (${item2N3D.slug})`);

    // Combine all steps from morning and evening
    const allRawSteps = [
      ...(item2N3D.itinerary || []),
      ...(item2N3D.itineraryEvening || [])
    ];

    const day1Steps: any[] = [];
    const day2Steps: any[] = [];
    const day3Steps: any[] = [];

    allRawSteps.forEach(s => {
      const timeStr = s.timeOrDay?.en || "";
      const cleaned = {
        timeOrDay: cleanLocalized(s.timeOrDay, true),
        activity: cleanLocalized(s.activity, false),
        desc: cleanLocalized(s.desc, false),
      };

      if (/day\s*1/i.test(timeStr)) {
        day1Steps.push(cleaned);
      } else if (/day\s*2/i.test(timeStr)) {
        day2Steps.push(cleaned);
      } else if (/day\s*3/i.test(timeStr)) {
        day3Steps.push(cleaned);
      } else {
        // Fallback: if day not explicitly prefixed
        day1Steps.push(cleaned);
      }
    });

    item2N3D.hasMultipleDays = true;
    item2N3D.itineraryDays = [
      {
        dayTitle: loc("Day 1: Arrival & Kumily Exploration"),
        dayDescription: loc("Scenic drive from Varkala into the high ranges, hotel check-in, Kumily town walk, and evening cultural show."),
        steps: day1Steps
      },
      {
        dayTitle: loc("Day 2: Periyar Boating, Spice Plantations & Sightseeing"),
        dayDescription: loc("Early morning Periyar Lake wildlife boating safari, elephant junction, spice garden tour, viewpoint visit, and Kumily market."),
        steps: day2Steps
      },
      {
        dayTitle: loc("Day 3: Breakfast, Checkout & Return to Varkala"),
        dayDescription: loc("Morning breakfast, hotel checkout, and comfortable scenic return drive back to Villa Lemon, Varkala."),
        steps: day3Steps
      }
    ];

    await item2N3D.save();
    console.log(`Successfully converted 2N/3D package! Days: ${item2N3D.itineraryDays.length}`);
    item2N3D.itineraryDays.forEach((d, i) => {
      console.log(`  Day ${i + 1} (${d.dayTitle?.en}): ${d.steps.length} steps`);
      d.steps.forEach((st, si) => console.log(`    [${si + 1}] ${st.timeOrDay?.en} - ${st.activity?.en}`));
    });
  } else {
    console.warn("Item 'thekkady-tour-package-2-nights-3-days-copy-package-name' not found!");
  }

  // 2. Migrate the 1N/2D item: 'thekkady-tour-package-from-varkala-1-night-2-days'
  const item1N2D = await PackageItem.findOne({ slug: "thekkady-tour-package-from-varkala-1-night-2-days" });
  if (item1N2D) {
    console.log(`\nFound 1N/2D package: "${item1N2D.title.en}" (${item1N2D.slug})`);

    const allRawSteps = [
      ...(item1N2D.itinerary || []),
      ...(item1N2D.itineraryEvening || [])
    ];

    const day1Steps: any[] = [];
    const day2Steps: any[] = [];

    allRawSteps.forEach(s => {
      const timeStr = s.timeOrDay?.en || "";
      const cleaned = {
        timeOrDay: cleanLocalized(s.timeOrDay, true),
        activity: cleanLocalized(s.activity, false),
        desc: cleanLocalized(s.desc, false),
      };

      if (/day\s*2/i.test(timeStr)) {
        day2Steps.push(cleaned);
      } else {
        day1Steps.push(cleaned);
      }
    });

    item1N2D.hasMultipleDays = true;
    item1N2D.itineraryDays = [
      {
        dayTitle: loc("Day 1: Departure, Tea Heritage & Spice Plantations"),
        dayDescription: loc("Scenic drive from Varkala into the high ranges, tea factory visit, spice garden tour, and overnight stay in Kumily/Thekkady."),
        steps: day1Steps
      },
      {
        dayTitle: loc("Day 2: Periyar Wildlife Boating & Return to Varkala"),
        dayDescription: loc("Morning breakfast, Periyar Lake wildlife boating safari, spice plantation walk, and evening return drop-off at Villa Lemon."),
        steps: day2Steps
      }
    ];

    await item1N2D.save();
    console.log(`Successfully converted 1N/2D package! Days: ${item1N2D.itineraryDays.length}`);
    item1N2D.itineraryDays.forEach((d, i) => {
      console.log(`  Day ${i + 1} (${d.dayTitle?.en}): ${d.steps.length} steps`);
      d.steps.forEach((st, si) => console.log(`    [${si + 1}] ${st.timeOrDay?.en} - ${st.activity?.en}`));
    });
  }

  process.exit(0);
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
