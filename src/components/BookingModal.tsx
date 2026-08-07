"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useBookingModal } from "@/context/BookingModalContext";
import { API_BASE_URL } from "@/config/api";
import { useParams } from "next/navigation";

const INTERESTS = [
  { id: "Villa Accommodation", label: "Villa Accommodation" },
  { id: "Yoga Retreat", label: "Yoga Retreat" },
  { id: "Sightseeing Tours", label: "Sightseeing Tours" },
  { id: "Ayurveda", label: "Ayurveda" },
  { id: "Airport Transfer", label: "Airport Transfer" },
  { id: "Group Booking", label: "Group Booking" },
  { id: "Customized Package", label: "Customized Package" },
  { id: "Wedding / Events", label: "Wedding / Events" },
];

export default function BookingModal() {
  const { isOpen, closeModal, bookingContext } = useBookingModal();
  const overlayRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

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

  const [staysList, setStaysList] = useState<Array<{ _id: string; title: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closeModal]);

  // Load stays list for dropdown
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/api/accommodations`)
        .then((res) => res.json())
        .then((d) => {
          if (d.data) {
            const list = d.data.map((item: any) => ({
              _id: item._id,
              title: item.title[locale] || item.title["en"] || item.title || "",
            }));
            setStaysList(list);
          }
        })
        .catch((err) => console.warn("[booking modal stays fetch]:", err));
    }
  }, [isOpen, locale]);

  // Set initial context value when modal opens
  useEffect(() => {
    if (isOpen && bookingContext) {
      setFormData((prev) => {
        // Pre-fill interest if matched
        let updatedInterests = [...prev.interestedIn];
        if (bookingContext.toLowerCase().includes("villa") && !updatedInterests.includes("Villa Accommodation")) {
          updatedInterests.push("Villa Accommodation");
        } else if (bookingContext.toLowerCase().includes("yoga") && !updatedInterests.includes("Yoga Retreat")) {
          updatedInterests.push("Yoga Retreat");
        } else if (bookingContext.toLowerCase().includes("retreat") && !updatedInterests.includes("Yoga Retreat")) {
          updatedInterests.push("Yoga Retreat");
        } else if (bookingContext.toLowerCase().includes("package") && !updatedInterests.includes("Customized Package")) {
          updatedInterests.push("Customized Package");
        }

        return {
          ...prev,
          interestedIn: updatedInterests,
          message: prev.message || `Hi, I am interested in details regarding: ${bookingContext}`,
        };
      });
    }
  }, [isOpen, bookingContext]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSuccess(false);
        setError(null);
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
      }, 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interestId: string) => {
    setFormData((prev) => {
      const currentInterests = [...prev.interestedIn];
      if (currentInterests.includes(interestId)) {
        return { ...prev, interestedIn: currentInterests.filter((id) => id !== interestId) };
      } else {
        return { ...prev, interestedIn: [...currentInterests, interestId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      setError("Please agree to the Privacy Policy and Terms.");
      return;
    }
    setLoading(true);
    setError(null);
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
    } catch (err: any) {
      setError(err.message || "Failed to submit enquiry. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.50)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) closeModal();
      }}
    >
      {/* Modal Content Panel */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl bg-white text-[#121212] p-6 sm:p-10 text-left"
        style={{ animation: "bookingSlideUp 0.28s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#121212] mb-1 select-none text-left">
          Send an Enquiry / Book an Appointment
        </h3>
        <div className="w-16 h-[2px] bg-brand-gold mb-8 select-none" />

        {success ? (
          <div className="py-12 px-6 text-center select-none animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#121212] mb-3">Enquiry Submitted Successfully!</h4>
            <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-md mx-auto mb-8">
              Thank you for reaching out. We have logged your request and a copy has been sent to our desk. Our Varkala team will get back to you shortly.
            </p>
            <button
              onClick={closeModal}
              className="px-6 py-3.5 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300"
            >
              Close Window
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
                <label htmlFor="modalFirstName" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  id="modalFirstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="modalLastName" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="modalLastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="modalEmail" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  id="modalEmail"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="modalPhone" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  id="modalPhone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your mobile number"
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="modalWhatsappNumber" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  id="modalWhatsappNumber"
                  autoComplete="tel"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your WhatsApp number"
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="modalCountry" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Country</label>
                <input
                  type="text"
                  name="country"
                  id="modalCountry"
                  autoComplete="country-name"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter your country"
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="modalPlanningDate" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Planning to Visit</label>
                <input
                  type="date"
                  name="planningDate"
                  id="modalPlanningDate"
                  value={formData.planningDate}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                />
              </div>

              <div className="flex items-center pt-8">
                <label htmlFor="modalFlexibleDates" className="flex items-center gap-2.5 text-xs text-gray-600 font-medium select-none cursor-pointer">
                  <input
                    type="checkbox"
                    id="modalFlexibleDates"
                    checked={formData.flexibleDates}
                    onChange={(e) => handleCheckboxChange("flexibleDates", e.target.checked)}
                    className="accent-brand-gold w-4 h-4"
                  />
                  <span>Yes, my dates are flexible</span>
                </label>
              </div>

              <div>
                <label htmlFor="modalAdults" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Number of Adults</label>
                <select
                  name="adults"
                  id="modalAdults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modalChildren" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Number of Children</label>
                <select
                  name="children"
                  id="modalChildren"
                  value={formData.children}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modalDuration" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Duration of Stay</label>
                <select
                  name="duration"
                  id="modalDuration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                >
                  <option value="">Select duration</option>
                  <option value="1-3 nights">1 - 3 Nights</option>
                  <option value="4-7 nights">4 - 7 Nights</option>
                  <option value="1-2 weeks">1 - 2 Weeks</option>
                  <option value="More than 2 weeks">More than 2 Weeks</option>
                </select>
              </div>

              <div>
                <label htmlFor="modalPreferredContact" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Preferred Contact Method</label>
                <select
                  name="preferredContact"
                  id="modalPreferredContact"
                  value={formData.preferredContact}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors select-none"
                >
                  <option value="">Select option</option>
                  <option value="Email">Email Address</option>
                  <option value="WhatsApp">WhatsApp Chat</option>
                  <option value="Phone Call">Direct Phone Call</option>
                </select>
              </div>
            </div>

            {/* Checkboxes list: Interest Areas */}
            <div className="border-t border-gray-100 pt-6">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 block select-none">I&apos;m Interested In (Select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 select-none">
                {INTERESTS.map((interest) => (
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
                <label htmlFor="modalPreferredAccommodation" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Preferred Accommodation (Optional)</label>
                <select
                  name="preferredAccommodation"
                  id="modalPreferredAccommodation"
                  value={formData.preferredAccommodation}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-[#eae6db] focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                >
                  <option value="">No Preference</option>
                  {staysList.map((stay) => (
                    <option key={stay._id} value={stay.title}>{stay.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="modalHowFound" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">How did you find us?</label>
                <select
                  name="howFound"
                  id="modalHowFound"
                  value={formData.howFound}
                  onChange={handleInputChange}
                  className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
                >
                  <option value="">Select option</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Instagram">Instagram Page</option>
                  <option value="Facebook">Facebook Page</option>
                  <option value="Recommendation">Friend / Family</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Message Textarea */}
            <div className="border-t border-gray-100 pt-6">
              <label htmlFor="modalMessage" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block select-none">Message *</label>
              <textarea
                name="message"
                id="modalMessage"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Tell us about your trip, special requests, dietary requirements, airport arrival, questions etc."
                className="w-full text-xs font-semibold px-4.5 py-3.5 border border-gray-200 focus:border-brand-gold focus:outline-none rounded-sm bg-gray-50/50 transition-colors"
              />
            </div>

            {/* Terms agreement checkbox */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-gray-100 pt-6 select-none">
              <label htmlFor="modalAgree" className="flex items-center gap-2.5 text-xs text-gray-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  id="modalAgree"
                  checked={formData.agree}
                  onChange={(e) => handleCheckboxChange("agree", e.target.checked)}
                  required
                  className="accent-brand-gold w-4 h-4 shrink-0"
                />
                <span>
                  I agree to the <span className="underline hover:text-brand-gold transition-colors">Privacy Policy</span> and{" "}
                  <span className="underline hover:text-brand-gold transition-colors">Terms & Conditions</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[10px] rounded-sm transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 select-none w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Send Enquiry</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx global>{`
        @keyframes bookingSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
