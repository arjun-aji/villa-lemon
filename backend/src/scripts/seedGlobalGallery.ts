import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import GalleryItem from "../models/GalleryItem";

dotenv.config();

const local = (text: string) => ({
  en: text,
  de: text,
  fr: text,
  ru: text,
});

const initialImages = [
  // Villa & Accommodation
  {
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    category: "villa-accommodation",
    caption: local("Villa Lemon Garden and Exterior View"),
    displayOrder: 0,
  },
  {
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    category: "villa-accommodation",
    caption: local("Deluxe air-conditioned bedroom with premium linen"),
    displayOrder: 1,
  },
  {
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    category: "villa-accommodation",
    caption: local("Lounge and common living spaces at Villa Lemon"),
    displayOrder: 2,
  },

  // Yoga & Wellness
  {
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    category: "yoga-wellness",
    caption: local("Outdoor morning yoga class on our private rooftop deck"),
    displayOrder: 0,
  },
  {
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    category: "yoga-wellness",
    caption: local("Sunset meditation overlooking the Arabian Sea"),
    displayOrder: 1,
  },

  // Experiences & Tours
  {
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    category: "experiences-tours",
    caption: local("Guided sunrise kayaking through Kerala backwaters"),
    displayOrder: 0,
  },
  {
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80",
    category: "experiences-tours",
    caption: local("Exploring the historic Varkala Cliff and beaches"),
    displayOrder: 1,
  },

  // Food & Dining
  {
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    category: "food-dining",
    caption: local("Authentic, freshly prepared Kerala vegetarian cuisine"),
    displayOrder: 0,
  },
  {
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    category: "food-dining",
    caption: local("Fresh fruit wellness bowls served for breakfast"),
    displayOrder: 1,
  },

  // Nature & Surroundings
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    category: "nature-surroundings",
    caption: local("Stunning golden hour view from Varkala Beach"),
    displayOrder: 0,
  },
  {
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    category: "nature-surroundings",
    caption: local("Lush tropical palm groves surrounding the property"),
    displayOrder: 1,
  },

  // Events & Culture
  {
    image: "https://images.unsplash.com/photo-1608976722756-3c054044a86b?auto=format&fit=crop&w=1200&q=80",
    category: "events-culture",
    caption: local("Traditional Kathakali cultural dance performance"),
    displayOrder: 0,
  },
  {
    image: "https://images.unsplash.com/photo-1561542320-9a18cd340469?auto=format&fit=crop&w=1200&q=80",
    category: "events-culture",
    caption: local("Centuries-old festival rituals at local temples"),
    displayOrder: 1,
  },
];

const run = async () => {
  try {
    await connectDB();
    console.log("🗑️  Cleaning existing gallery items...");
    await GalleryItem.deleteMany({});

    console.log("🌿 Seeding new global gallery items...");
    await GalleryItem.insertMany(initialImages);

    console.log("✅ Gallery successfully seeded!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

run();
