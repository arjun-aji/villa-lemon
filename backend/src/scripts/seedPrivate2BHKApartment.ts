import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";

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

    console.log("🗑️  Cleaning existing apartment if it exists...");
    await AccommodationItem.deleteMany({ slug: "private-2bhk-apartment-villa-lemon-garden" });

    console.log("🌿 Creating Private 2 BHK Apartment | Villa Lemon Garden...");
    const stay = new AccommodationItem({
      accommodationType: "floor",
      slug: "private-2bhk-apartment-villa-lemon-garden",
      price: 7000,
      pricePeriod: local("/ night"),
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      aboutImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      bedrooms: 2,
      bathrooms: 2,
      guests: 6,
      location: local("Varkala, Kerala"),
      
      title: local("Private 2 BHK Apartment | Villa Lemon Garden"),
      tagline: local("Your Private Garden Apartment in Varkala"),
      shortDescription: local(
        "Stay in a fully private 2 BHK apartment featuring two spacious bedrooms, a private living room, dining area, fully equipped kitchen, free Wi-Fi, and peaceful garden surroundings near Varkala Cliff."
      ),
      aboutText1: local(
        "Enjoy the comfort, privacy, and convenience of your own holiday home at Villa Lemon Garden. This fully private 2 BHK apartment is surrounded by lush greenery and offers an ideal stay for families, couples travelling together, small groups, and long-stay guests."
      ),
      aboutText2: local(
        "The apartment features two spacious air-conditioned bedrooms, two attached bathrooms, a comfortable private living room, dining area, fully equipped kitchen, complimentary high-speed Wi-Fi, and peaceful garden surroundings. Located just minutes from Varkala's beaches and attractions, it provides the perfect blend of comfort, flexibility, and Kerala hospitality."
      ),
      perfectLocationText: local(
        "Located in a peaceful residential neighbourhood just a short drive from Varkala Cliff, Black Beach, Papanasam Beach, Janardhanaswamy Temple, Sivagiri Ashram, Kappil Beach, Mangrove Kayaking, and Jatayu Earth Center."
      ),
      groupAccommodationText: local(
        "Comfortably accommodates up to 6 adults. Extra mattresses are available on request, subject to availability."
      ),

      roomAmenities: [
        local("Two Spacious Bedrooms"),
        local("Air Conditioning"),
        local("King-Size Beds"),
        local("Twin Bed Option"),
        local("Premium Mattresses"),
        local("Two Attached Bathrooms"),
        local("Hot Water Showers"),
        local("Private Living Room"),
        local("Private Dining Area"),
        local("Fully Equipped Private Kitchen"),
        local("Cooking Utensils"),
        local("Dining Essentials"),
        local("Free High-Speed Wi-Fi"),
        local("Complimentary Drinking Water"),
        local("Free Parking"),
        local("Daily Housekeeping"),
      ],

      idealFor: [
        local("Families"),
        local("Couples Travelling Together"),
        local("Small Groups"),
        local("Long Stays"),
        local("Digital Nomads"),
        local("Self-Catering Holidays"),
        local("Guests Seeking Extra Privacy"),
      ],

      whyGuestsLoveUs: [
        {
          icon: "home",
          title: local("Entire Private Apartment"),
          desc: local("Enjoy complete privacy with exclusive access to your own fully furnished 2 BHK apartment."),
        },
        {
          icon: "chef-hat",
          title: local("Fully Equipped Kitchen"),
          desc: local("Cook your own meals with a private kitchen equipped for comfortable self-catering stays."),
        },
        {
          icon: "trees",
          title: local("Peaceful Garden Setting"),
          desc: local("Relax in lush tropical surroundings away from the busy tourist areas."),
        },
        {
          icon: "users",
          title: local("Perfect for Families & Groups"),
          desc: local("Spacious accommodation designed for families, friends, and extended stays."),
        },
        {
          icon: "wifi",
          title: local("Free High-Speed Wi-Fi"),
          desc: local("Stay connected with complimentary internet access throughout the apartment."),
        },
      ],

      distances: [
        { place: local("Varkala Cliff"), distance: local("2 km") },
        { place: local("Black Beach"), distance: local("900 m") },
        { place: local("Papanasam Beach"), distance: local("2.5 km") },
        { place: local("Janardhanaswamy Temple"), distance: local("2.3 km") },
        { place: local("Sivagiri Ashram"), distance: local("4 km") },
        { place: local("Kappil Beach"), distance: local("8 km") },
        { place: local("Mangrove Kayaking"), distance: local("10 km") },
        { place: local("Jatayu Earth Center"), distance: local("38 km") },
      ],

      highlights: [
        { icon: "home", label: local("Entire Private Apartment") },
        { icon: "bed", label: local("2 Spacious Bedrooms") },
        { icon: "sofa", label: local("Private Living Room") },
        { icon: "utensils", label: local("Private Dining Area") },
        { icon: "chef-hat", label: local("Fully Equipped Kitchen") },
        { icon: "trees", label: local("Garden Surroundings") },
        { icon: "wifi", label: local("Free High-Speed Wi-Fi") },
        { icon: "parking", label: local("Free Parking") },
      ],

      checkInTime: "12:00",
      checkOutTime: "11:00",
      checkInOutRules: [
        local("Check-in from 12:00 PM"),
        local("Check-out before 11:00 AM"),
        local("No smoking inside the apartment"),
        local("Quiet hours must be respected"),
        local("Please keep the kitchen and shared facilities clean after use"),
        local("Extra mattresses available on request"),
      ],

      additionalServices: [
        { service: local("Airport Transfer"), details: local("Available on request at additional charges.") },
        { service: local("Yoga Classes"), details: local("Private and group yoga sessions can be arranged on request.") },
        { service: local("Sightseeing Tours"), details: local("Local sightseeing tours and curated Varkala experiences can be arranged.") },
        { service: local("Local Travel Assistance"), details: local("Transport arrangements, local recommendations, and travel guidance are available throughout your stay.") },
        { service: local("Laundry Service"), details: local("Laundry service available at additional charges.") },
      ],

      mapLink: "",
      metaTitle: local("Private 2 BHK Apartment | Villa Lemon Garden"),
      metaDescription: local("Stay in a fully private 2 BHK garden apartment featuring a private kitchen, living room, dining area, and two bedrooms near Varkala Cliff."),
    });

    await stay.save();
    console.log(`✅ Accommodation saved successfully with ID: ${stay._id}`);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

run();
