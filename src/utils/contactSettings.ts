import { API_BASE_URL } from "@/config/api";

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  receptionHours: string;
  googleMapsLink: string;
}

const DEFAULTS: ContactSettings = {
  phone: "+91 73560 85055",
  whatsapp: "+91 73560 85055",
  email: "villalemonhomestay@gmail.com",
  address: "Villa Lemon, Kurakkanni, Varkala, Thiruvananthapuram, Kerala, India - 695141",
  receptionHours: "Mon - Sun, 7:00 AM - 10:00 PM",
  googleMapsLink: "https://maps.google.com/?q=Villa+Lemon+Kurakkanni+Varkala+Kerala",
};

/** Fetch global contact settings from the homepage document in MongoDB. */
export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/homepage`, { cache: "no-store" });
    if (!res.ok) return DEFAULTS;
    const json = await res.json();
    const contact = json?.data?.contact;
    if (!contact) return DEFAULTS;
    return {
      phone: contact.phone || DEFAULTS.phone,
      whatsapp: contact.whatsapp || DEFAULTS.whatsapp,
      email: contact.email || DEFAULTS.email,
      address: contact.address || DEFAULTS.address,
      receptionHours: contact.receptionHours || DEFAULTS.receptionHours,
      googleMapsLink: contact.googleMapsLink || DEFAULTS.googleMapsLink,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Returns a clean wa.me link for a given phone string. */
export function waLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}
