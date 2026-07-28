"use client";

import React, { useState } from "react";
import { Mail, Trash2, Calendar, Users, Phone, ArrowUpRight, MessageSquare, Clock, Globe, X, User } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface EnquiryData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  whatsappNumber?: string;
  country?: string;
  planningDate?: string;
  flexibleDates?: boolean;
  adults?: number;
  children?: number;
  duration?: string;
  preferredContact?: string;
  interestedIn?: string[];
  preferredAccommodation?: string;
  howFound?: string;
  createdAt: string;
}

interface EnquiriesTabProps {
  enquiries: EnquiryData[];
  token: string | null;
  onRefresh: () => void;
}

export default function EnquiriesTab({ enquiries, token, onRefresh }: EnquiriesTabProps) {
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry(null);
        }
        onRefresh();
      } else {
        alert("Failed to delete enquiry.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  const getCleanWhatsAppLink = (num: string) => {
    const cleaned = num.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleaned}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 text-[#121212] select-text">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h3 className="font-serif text-lg font-semibold text-gray-800">Enquiries & Contact Messages</h3>
          <p className="text-xs text-gray-500 mt-1">
            Review stay bookings, yoga program requests, and general messages submitted by visitors.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[9px] px-3.5 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
        >
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Messages List Column */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
          <h4 className="font-serif font-bold text-sm text-gray-800 mb-4 text-left uppercase tracking-wider">Inbox ({enquiries.length})</h4>
          
          {enquiries.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-gray-200 rounded bg-gray-50">
              <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-light text-xs">No enquiries received yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`border text-left p-4 rounded-sm transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    selectedEnquiry?._id === enq._id
                      ? "border-brand-gold bg-[#c5a880]/5 shadow-sm"
                      : "border-gray-200 hover:border-[#c5a880]/40 bg-gray-50/30 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h5 className="font-semibold text-xs text-gray-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{enq.name}</span>
                      </h5>
                      <span className="text-[9px] text-gray-400 font-sans block mt-1">
                        {formatDate(enq.createdAt)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(enq._id);
                      }}
                      disabled={deletingId === enq._id}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 font-light line-clamp-2 mt-3 leading-relaxed font-sans">
                    {enq.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    {enq.preferredAccommodation && (
                      <span className="bg-amber-50 text-brand-gold px-2 py-0.5 rounded-sm">
                        🏡 {enq.preferredAccommodation}
                      </span>
                    )}
                    {enq.planningDate && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-sm">
                        📅 {enq.planningDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Detail Panel */}
        <div className="lg:col-span-5 select-text">
          {selectedEnquiry ? (
            <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm text-left relative animate-fade-in">
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-[#121212] select-none"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif font-bold text-sm text-gray-800 mb-6 uppercase tracking-wider select-none">Enquiry Details</h4>

              <div className="space-y-5 text-xs text-gray-700">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Sender Name</span>
                  <p className="font-semibold text-gray-900 text-sm">{selectedEnquiry.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Email Address</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-brand-gold font-medium hover:underline flex items-center gap-1">
                      <span>{selectedEnquiry.email}</span>
                      <ArrowUpRight className="w-3 h-3 shrink-0" />
                    </a>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Phone / Mobile</span>
                    <p className="font-medium text-gray-900">{selectedEnquiry.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">WhatsApp</span>
                    <p className="font-medium text-gray-900">{selectedEnquiry.whatsappNumber || "Not provided"}</p>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Country</span>
                    <p className="font-medium text-gray-900">{selectedEnquiry.country || "Not provided"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Planning to Visit</span>
                    <p className="font-medium text-gray-900">
                      {selectedEnquiry.planningDate || "Not specified"}
                      {selectedEnquiry.flexibleDates ? " (Flexible)" : ""}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Duration of Stay</span>
                    <p className="font-medium text-gray-900">{selectedEnquiry.duration || "Not specified"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Guests</span>
                    <p className="font-medium text-gray-900">Adults: {selectedEnquiry.adults || 1} | Children: {selectedEnquiry.children || 0}</p>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Preferred Contact</span>
                    <p className="font-medium text-gray-900">{selectedEnquiry.preferredContact || "No preference"}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5 select-none">Preferred Accommodation</span>
                  <p className="font-medium text-brand-gold font-serif">{selectedEnquiry.preferredAccommodation || "No preference"}</p>
                </div>

                {selectedEnquiry.interestedIn && selectedEnquiry.interestedIn.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 select-none">Interested In</span>
                    <div className="flex flex-wrap gap-1.5 select-none">
                      {selectedEnquiry.interestedIn.map((interest, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 bg-gray-50/50 p-4 rounded">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 select-none">Message Body</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-sans whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>

                {/* Reply Actions */}
                <div className="border-t border-gray-100 pt-6 flex flex-col gap-3 select-none">
                  {/* Whatsapp Button */}
                  <a
                    href={getCleanWhatsAppLink(selectedEnquiry.whatsappNumber || selectedEnquiry.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[10px] py-3.5 rounded-sm transition-colors text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  {/* Mail button */}
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="flex items-center justify-center gap-2 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[10px] py-3.5 rounded-sm transition-all duration-300 text-center"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 border-dashed rounded-md py-32 px-6 text-center text-gray-400 select-none">
              <Mail className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-xs font-light">Select a message from the inbox list to read details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
