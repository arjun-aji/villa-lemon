"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Users, Phone, Mail, MessageSquare, Send, CheckCircle, Loader2 } from "lucide-react";
import { useBookingModal } from "@/context/BookingModalContext";
import { API_BASE_URL } from "@/config/api";

const INTERESTS = [
  "Villa Accommodation",
  "Yoga Retreat",
  "Sightseeing Tours",
  "Ayurveda",
  "Airport Transfer",
  "Group Booking",
  "Customized Package",
  "Wedding / Events",
];

export default function BookingModal() {
  const { isOpen, closeModal, bookingContext } = useBookingModal();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    planningDate: "",
    adults: 1,
    children: 0,
    duration: "",
    interestedIn: [] as string[],
    message: "",
    agree: false,
  });
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

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSuccess(false);
        setError(null);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          planningDate: "",
          adults: 1,
          children: 0,
          duration: "",
          interestedIn: [],
          message: "",
          agree: false,
        });
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (id: string) => {
    setForm(prev => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(id)
        ? prev.interestedIn.filter(i => i !== id)
        : [...prev.interestedIn, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      setError("Please agree to the Privacy Policy and Terms.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          message: form.message || (bookingContext ? `Interested in: ${bookingContext}` : "Booking enquiry"),
          planningDate: form.planningDate || undefined,
          adults: Number(form.adults),
          children: Number(form.children),
          duration: form.duration || undefined,
          interestedIn: form.interestedIn.length > 0 ? form.interestedIn : undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Something went wrong.");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === overlayRef.current) closeModal(); }}
    >
      {/* Modal Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-sm shadow-2xl bg-[#fbf9f6] text-[#121212]"
        style={{ animation: "bookingSlideUp 0.28s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#121212] text-white px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-[9px] text-brand-gold font-bold tracking-[0.25em] uppercase mb-1">Send an Enquiry</p>
            <h2 className="font-serif text-2xl font-normal tracking-wide leading-tight">
              Book Your Stay at Villa Lemon
            </h2>
            {bookingContext && (
              <p className="text-[10px] text-white/60 mt-1 font-sans font-light">
                Re: {bookingContext}
              </p>
            )}
          </div>
          <button
            onClick={closeModal}
            className="ml-4 p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold mt-0.5 shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
              <h3 className="font-serif text-2xl font-normal text-[#121212]">Enquiry Sent!</h3>
              <p className="text-sm text-gray-500 font-sans font-light leading-relaxed max-w-sm mx-auto">
                Thank you! Our team will get back to you within 15 minutes via your preferred contact.
              </p>
              <button
                onClick={closeModal}
                className="mt-4 px-8 py-3 bg-brand-gold text-[#121212] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-brand-gold-dark transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">First Name *</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] placeholder:text-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Name *</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                    className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] placeholder:text-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@email.com"
                    className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] placeholder:text-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] placeholder:text-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              {/* Planning Date + Stay Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Check-in Date
                  </label>
                  <input
                    type="date"
                    name="planningDate"
                    value={form.planningDate}
                    onChange={handleChange}
                    className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Adults
                  </label>
                  <select
                    name="adults"
                    value={form.adults}
                    onChange={handleChange}
                    className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Duration</label>
                  <select
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1-2 nights">1–2 nights</option>
                    <option value="3-5 nights">3–5 nights</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month+">1 month+</option>
                  </select>
                </div>
              </div>

              {/* Interested In */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  I&apos;m Interested In
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-left text-[10px] px-3 py-2 border rounded-sm font-sans font-medium transition-all ${
                        form.interestedIn.includes(interest)
                          ? "border-brand-gold bg-amber-50 text-brand-gold"
                          : "border-[#eae6db] bg-white text-gray-500 hover:border-brand-gold/50"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" /> Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your trip, special requests, dietary needs, airport arrival..."
                  className="border border-[#eae6db] bg-white px-3 py-2.5 rounded-sm text-sm font-sans text-[#121212] placeholder:text-gray-300 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="modal-agree"
                  checked={form.agree}
                  onChange={(e) => setForm(prev => ({ ...prev, agree: e.target.checked }))}
                  className="mt-0.5 h-3.5 w-3.5 accent-brand-gold shrink-0"
                />
                <label htmlFor="modal-agree" className="text-[10px] text-gray-500 font-sans leading-relaxed cursor-pointer select-none">
                  I agree to the{" "}
                  <a href="#" className="underline text-brand-gold">Privacy Policy</a>{" "}
                  and{" "}
                  <a href="#" className="underline text-brand-gold">Terms & Conditions</a>.
                </label>
              </div>

              {error && (
                <p className="text-[11px] text-red-500 font-sans">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#121212] hover:bg-black text-white font-bold text-[10px] uppercase tracking-widest py-4 rounded-sm transition-all duration-300 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Enquiry</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bookingSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}
