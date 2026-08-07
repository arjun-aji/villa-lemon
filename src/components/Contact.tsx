"use client";

import React, { useState } from "react";
import { 
  MapPin, Phone, Mail, Clock, ShieldAlert,
  MessageSquare, ChevronRight, CheckCircle2,
  Calendar, Users, Info, Loader2, ArrowRight
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useTranslations } from "next-intl";

interface ContactProps {
  locale: string;
  staysList: Array<{ _id: string; title: string }>;
  contact?: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    receptionHours: string;
    googleMapsLink?: string;
  };
}

export default function Contact({ locale, staysList, contact }: ContactProps) {
  const t = useTranslations("Contact");
  const displayAddress = contact?.address || "Villa Lemon, Kurakkanni, Varkala, Thiruvananthapuram, Kerala, India - 695141";
  const displayPhone = contact?.phone || "+91 73560 85055";
  const displayWhatsapp = contact?.whatsapp || "+91 73560 85055";
  const displayEmail = contact?.email || "hello@villalemon.com";
  const displayReceptionHours = contact?.receptionHours || "Mon - Sun, 7:00 AM - 10:00 PM";
  const displayGoogleMapsLink = contact?.googleMapsLink || "https://maps.google.com/?q=Villa+Lemon+Kurakkanni+Varkala+Kerala";

  // The iframe ONLY works with the proper Google Maps embed format (google.com/maps/embed?pb=...)
  // Short links and share links get blocked by X-Frame-Options. 
  // If the CMS value is a valid embed URL, use it; otherwise fall back to the default embed.
  const DEFAULT_EMBED_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.864704381864!2d76.7118357!3d8.751684399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05efa99c277bfb%3A0xc3b5fa775d7b5f!2sVilla%20Lemon!5e0!3m2!1sen!2sin!4v1716301234567!5m2!1sen!2sin";
  const iframeSrc = displayGoogleMapsLink.includes("google.com/maps/embed")
    ? displayGoogleMapsLink
    : DEFAULT_EMBED_SRC;

  const getCleanNumber = (num: string) => num.replace(/[^0-9]/g, "");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    country: "",
    planningDate: "",
    flexibleDates: false,
    adults: 1,
    children: 0,
    duration: "",
    preferredContact: "",
    interestedIn: [] as string[],
    preferredAccommodation: "",
    howFound: "",
    message: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interests = [
    { id: "Villa Accommodation", label: t("villaAccommodation") },
    { id: "Yoga Retreat", label: t("yogaRetreat") },
    { id: "Sightseeing Tours", label: t("sightseeingTours") },
    { id: "Ayurveda", label: t("ayurveda") },
    { id: "Airport Transfer", label: t("airportTransfer") },
    { id: "Group Booking", label: t("groupBooking") },
    { id: "Customized Package", label: t("customizedPackage") },
    { id: "Wedding / Events", label: t("weddingEvents") },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interestId: string) => {
    setFormData(prev => {
      const currentInterests = [...prev.interestedIn];
      if (currentInterests.includes(interestId)) {
        return { ...prev, interestedIn: currentInterests.filter(id => id !== interestId) };
      } else {
        return { ...prev, interestedIn: [...currentInterests, interestId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate consent
    if (!formData.agree) {
      setError(t("agreeError"));
      setLoading(false);
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        whatsappNumber: formData.whatsappNumber || undefined,
        country: formData.country || undefined,
        planningDate: formData.planningDate || undefined,
        flexibleDates: formData.flexibleDates,
        adults: Number(formData.adults),
        children: Number(formData.children),
        duration: formData.duration || undefined,
        preferredContact: formData.preferredContact || undefined,
        interestedIn: formData.interestedIn.length > 0 ? formData.interestedIn : undefined,
        preferredAccommodation: formData.preferredAccommodation || undefined,
        howFound: formData.howFound || undefined,
      };

      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (!res.ok) {
        throw new Error(d.message || "Something went wrong. Please try again.");
      }

      setSuccess(true);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        whatsappNumber: "",
        country: "",
        planningDate: "",
        flexibleDates: false,
        adults: 1,
        children: 0,
        duration: "",
        preferredContact: "",
        interestedIn: [],
        preferredAccommodation: "",
        howFound: "",
        message: "",
        agree: false,
      });
    } catch (err: any) {
      setError(err.message || t("submitError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="w-full bg-brand-cream text-brand-dark py-20 md:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        
        {/* Header Title Grid */}
        <div className="text-left mb-16 select-text">
          <span className="text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-[0.25em] mb-3 block select-none">
            {t("tagline")}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#121212] tracking-wide leading-tight mb-4">
            {t("title")}
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-gray-500 font-light leading-relaxed font-sans">
            {t("description")}
          </p>
        </div>

        {/* Contact Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Info & Quick Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-8 text-left select-none">
            
            {/* Info Box */}
            <div className="bg-[#1e3a1e]/5 border border-[#eae6db]/80 rounded-md p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-brand-gold/5 blur-xl pointer-events-none" />
              
              <h3 className="font-serif text-lg font-bold text-[#121212] mb-6 flex items-center gap-2">
                <span>{t("tagline")}</span>
                <span className="w-8 h-[1px] bg-brand-gold mt-1.5" />
              </h3>

              <div className="space-y-6 text-xs text-gray-700 select-text">
                <div className="flex gap-3.5">
                  <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">{t("location")}</h4>
                    <p className="leading-relaxed font-light font-sans whitespace-pre-wrap">
                      {displayAddress}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 border-t border-gray-100 pt-5">
                  <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">{t("phone")}</h4>
                    <a href={`tel:${displayPhone.replace(/\s+/g, "")}`} className="hover:text-brand-gold transition-colors font-medium font-sans">{displayPhone}</a>
                  </div>
                </div>

                <div className="flex gap-3.5 border-t border-gray-100 pt-5">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-brand-gold shrink-0 mt-0.5">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-4.577c1.673.993 3.336 1.52 5.188 1.52 5.395 0 9.785-4.39 9.789-9.787.002-2.614-1.012-5.071-2.859-6.918-1.847-1.847-4.305-2.86-6.919-2.86-5.398 0-9.789 4.39-9.793 9.788-.001 1.959.52 3.868 1.514 5.544l-.994 3.629 3.734-.976zM17.47 14.39c-.294-.147-1.737-.857-2.007-.955-.27-.098-.467-.147-.662.147-.196.294-.759.955-.93 1.15-.171.196-.343.22-.637.073-.294-.147-1.243-.458-2.37-1.464-.877-.78-1.47-1.744-1.642-2.038-.171-.294-.018-.453.129-.6.132-.132.294-.343.441-.515.147-.171.196-.294.294-.49.098-.196.05-.367-.025-.515-.074-.147-.662-1.592-.907-2.181-.238-.574-.48-.495-.662-.505-.171-.007-.367-.007-.562-.007-.196 0-.515.073-.784.367-.27.294-1.029 1.005-1.029 2.451 0 1.446 1.053 2.84 1.2 3.036.147.196 2.074 3.168 5.027 4.442.702.303 1.25.485 1.677.62.706.224 1.348.193 1.856.118.566-.084 1.738-.71 1.983-1.396.246-.686.246-1.273.172-1.396-.074-.122-.27-.196-.565-.343z"/>
                  </svg>
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">WhatsApp</h4>
                    <a href={`https://wa.me/${getCleanNumber(displayWhatsapp)}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors font-medium font-sans">{displayWhatsapp}</a>
                  </div>
                </div>

                <div className="flex gap-3.5 border-t border-gray-100 pt-5">
                  <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">{t("email")}</h4>
                    <a href={`mailto:${displayEmail}`} className="hover:text-brand-gold transition-colors font-medium font-sans">{displayEmail}</a>
                  </div>
                </div>

                <div className="flex gap-3.5 border-t border-gray-100 pt-5">
                  <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1">{t("hours")}</h4>
                    <p className="font-medium font-sans whitespace-pre-wrap">{displayReceptionHours}</p>
                  </div>
                </div>
              </div>

              {/* Response Time Badge */}
              <div className="mt-8 bg-brand-gold/10 border border-brand-gold/20 rounded p-4 flex items-start gap-3">
                <Info className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div className="text-left select-text">
                  <span className="text-[10px] font-bold text-[#121212] block">Need Immediate Help?</span>
                  <p className="text-[10px] text-gray-600 font-light mt-0.5 leading-relaxed font-sans">Average response time is <strong className="text-brand-gold font-bold">&lt; 15 minutes</strong> via WhatsApp.</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center text-[9px] font-bold uppercase tracking-wider text-gray-700">
              <a 
                href={`https://wa.me/${getCleanNumber(displayWhatsapp)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-0 sm:gap-1.5 p-2 sm:p-3 border border-[#eae6db] hover:border-emerald-500 bg-white rounded-md transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="hidden sm:block mt-1 contact-btn-text">WhatsApp</span>
              </a>

              <a 
                href={`tel:${displayPhone.replace(/\s+/g, "")}`} 
                className="flex flex-col items-center justify-center gap-0 sm:gap-1.5 p-2 sm:p-3 border border-[#eae6db] hover:border-brand-gold bg-white rounded-md transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-colors shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="hidden sm:block mt-1 contact-btn-text">Call Now</span>
              </a>

              <a 
                href={`mailto:${displayEmail}`} 
                className="flex flex-col items-center justify-center gap-0 sm:gap-1.5 p-2 sm:p-3 border border-[#eae6db] hover:border-brand-gold bg-white rounded-md transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-colors shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="hidden sm:block mt-1 contact-btn-text">Email Us</span>
              </a>

              <a 
                href={displayGoogleMapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-0 sm:gap-1.5 p-2 sm:p-3 border border-[#eae6db] hover:border-brand-gold bg-white rounded-md transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-colors shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="hidden sm:block mt-1 contact-btn-text">Directions</span>
              </a>
            </div>

            {/* Embedded map card */}
            <div className="border border-[#eae6db] rounded-md overflow-hidden aspect-[4/3] relative bg-gray-100 shadow-sm">
              <iframe 
                src={iframeSrc}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-8 bg-white border border-[#eae6db] rounded-md p-6 sm:p-10 shadow-sm">
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-1 select-none text-left">
              {t("sendMessage")}
            </h3>
            <div className="w-16 h-[2px] bg-brand-gold mb-8 select-none" />

            {success ? (
              <div className="py-12 px-6 text-center select-none animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#121212] mb-3">{t("successTitle")}</h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-md mx-auto mb-8">
                  {t("successMessage")}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3.5 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 cursor-pointer"
                >
                  {t("sendMessage")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-left select-text font-sans">
                
                {error && (
                  <div className="bg-red-50 border-l-2 border-red-500 text-red-700 text-xs p-4 rounded-sm flex items-start gap-3 select-none">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form fields layout grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("firstName")} *</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      id="firstName"
                      autoComplete="given-name"
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Enter your first name"
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("lastName")}</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      id="lastName"
                      autoComplete="family-name"
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      placeholder="Enter your last name"
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("emailAddress")} *</label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email"
                      autoComplete="email"
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Enter your email address"
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("phoneNumber")} *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      id="phone"
                      autoComplete="tel"
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Enter your mobile number"
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsappNumber" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("whatsappNumber")}</label>
                    <input 
                      type="tel" 
                      name="whatsappNumber" 
                      id="whatsappNumber"
                      autoComplete="tel"
                      value={formData.whatsappNumber} 
                      onChange={handleInputChange} 
                      placeholder="Enter your WhatsApp number"
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("country")}</label>
                    <input 
                      type="text" 
                      name="country" 
                      id="country"
                      autoComplete="country-name"
                      value={formData.country} 
                      onChange={handleInputChange} 
                      placeholder="Enter your country"
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="planningDate" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("planningDate")}</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        name="planningDate" 
                        id="planningDate"
                        value={formData.planningDate} 
                        onChange={handleInputChange} 
                        className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center pt-8">
                    <label htmlFor="flexibleDates" className="flex items-center gap-2.5 text-xs text-gray-600 font-medium select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="flexibleDates"
                        checked={formData.flexibleDates} 
                        onChange={(e) => handleCheckboxChange("flexibleDates", e.target.checked)} 
                        className="accent-brand-gold w-4 h-4"
                      />
                      <span>{t("flexibleDates")}</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="adults" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("adults")}</label>
                    <select 
                      name="adults" 
                      id="adults"
                      value={formData.adults} 
                      onChange={handleInputChange} 
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="children" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("children")}</label>
                    <select 
                      name="children" 
                      id="children"
                      value={formData.children} 
                      onChange={handleInputChange} 
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="duration" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("duration")}</label>
                    <select 
                      name="duration" 
                      id="duration"
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                    >
                      <option value="">{t("selectOption")}</option>
                      <option value="1-3 nights">1 - 3 Nights</option>
                      <option value="4-7 nights">4 - 7 Nights</option>
                      <option value="1-2 weeks">1 - 2 Weeks</option>
                      <option value="More than 2 weeks">More than 2 Weeks</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredContact" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("contactMethod")}</label>
                    <select 
                      name="preferredContact" 
                      id="preferredContact"
                      value={formData.preferredContact} 
                      onChange={handleInputChange} 
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                    >
                      <option value="">{t("selectMethod")}</option>
                      <option value="Email">{t("emailLabel")}</option>
                      <option value="WhatsApp">{t("whatsapp")}</option>
                      <option value="Phone Call">{t("phoneCall")}</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes list: Interest Areas */}
                <div className="border-t border-gray-100 pt-6">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 block select-none">{t("interestedIn")}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 select-none">
                    {interests.map(interest => (
                      <label key={interest.id} className="flex items-center gap-2 text-xs text-gray-600 font-medium cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.interestedIn.includes(interest.id)} 
                          onChange={() => handleInterestChange(interest.id)} 
                          className="accent-brand-gold w-4 h-4 shrink-0"
                        />
                        <span>{interest.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dropdowns: Accommodation Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-gray-100 pt-6 select-none">
                  <div>
                    <label htmlFor="preferredAccommodation" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t("preferredAccommodation")}</label>
                    <select 
                      name="preferredAccommodation" 
                      id="preferredAccommodation"
                      value={formData.preferredAccommodation} 
                      onChange={handleInputChange} 
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    >
                      <option value="">{t("noneNotSure")}</option>
                      {staysList.map(stay => (
                        <option key={stay._id} value={stay.title}>{stay.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="howFound" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t("howFound")}</label>
                    <select 
                      name="howFound" 
                      id="howFound"
                      value={formData.howFound} 
                      onChange={handleInputChange} 
                      className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                    >
                      <option value="">{t("selectOption")}</option>
                      <option value="Google Search">{t("googleSearch")}</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Recommendation">{t("friendReferral")}</option>
                      <option value="Other">{t("other")}</option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="border-t border-gray-100 pt-6">
                  <label htmlFor="message" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">{t("message")} *</label>
                  <textarea 
                    name="message" 
                    id="message"
                    value={formData.message} 
                    onChange={handleInputChange} 
                    required 
                    rows={4}
                    placeholder=""
                    className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                  />
                </div>

                {/* Terms agreement checkbox */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-gray-100 pt-6 select-none">
                  <label htmlFor="agree" className="flex items-center gap-2.5 text-xs text-gray-600 font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="agree"
                      checked={formData.agree} 
                      onChange={(e) => handleCheckboxChange("agree", e.target.checked)} 
                      required
                      className="accent-brand-gold w-4 h-4 shrink-0"
                    />
                    <span>{t("agreeCheckbox")}</span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 select-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{t("sending")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("sendMessage")}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
