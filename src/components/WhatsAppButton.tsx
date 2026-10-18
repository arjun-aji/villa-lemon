"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { API_BASE_URL } from "@/config/api";

const DEFAULT_PHONE = "+91 73560 85055";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_PHONE);
  const [mounted, setMounted] = useState(false);

  // Translations
  const t = useTranslations("WhatsApp");

  useEffect(() => {
    setMounted(true);

    // Fetch dynamic WhatsApp number from homepage settings if available
    let isCancelled = false;
    const fetchContactNumber = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/homepage`, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const contactWhatsapp = json?.data?.contact?.whatsapp;
        if (!isCancelled && contactWhatsapp) {
          setWhatsappNumber(contactWhatsapp);
        }
      } catch {
        // Fall back gracefully to DEFAULT_PHONE
      }
    };

    fetchContactNumber();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Do not render on admin pages or before mount
  if (pathname?.includes("/admin")) {
    return null;
  }

  // Determine context-aware enquiry message based on current route
  let enquiryMessage = t("defaultEnquiry");
  if (pathname?.includes("/accommodation")) {
    enquiryMessage = t("accommodationEnquiry");
  } else if (pathname?.includes("/yoga") || pathname?.includes("/retreats")) {
    enquiryMessage = t("yogaEnquiry");
  } else if (pathname?.includes("/packages")) {
    enquiryMessage = t("packageEnquiry");
  }

  const cleanPhone = (whatsappNumber || DEFAULT_PHONE).replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(enquiryMessage)}`;

  return (
    <aside
      aria-label={t("ariaLabel")}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center select-none"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("ariaLabel")}
        className="group relative flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-full"
      >
        {/* Floating Tooltip Pill (Desktop Hover & Focus) */}
        <div
          role="tooltip"
          className="hidden sm:flex items-center gap-2.5 mr-3 px-4 py-2.5 rounded-full bg-[#141414]/95 backdrop-blur-md border border-brand-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-white text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-3 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
          <span className="text-brand-cream font-medium tracking-wide">
            {t("enquiryTooltip")}
          </span>
          <span className="text-[10px] text-brand-gold/90 uppercase tracking-widest pl-1 border-l border-white/10 font-semibold">
            {t("quickReply")}
          </span>
        </div>

        {/* Circular Floating WhatsApp Button */}
        <div className="relative flex items-center justify-center w-14 h-14 sm:w-[3.75rem] sm:h-[3.75rem] rounded-full bg-gradient-to-tr from-[#128C7E] via-[#20ba59] to-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] group-hover:shadow-[0_14px_45px_rgba(37,211,102,0.7)] group-hover:scale-108 active:scale-95 transition-all duration-300 border border-white/25">
          {/* Subtle radar pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

          {/* Official WhatsApp SVG Silhouette */}
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-current drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12.004 2C6.48 2 2.002 6.477 2.002 12c0 1.892.527 3.66 1.442 5.178L2.02 22l5.008-1.309A9.957 9.957 0 0012.004 22c5.523 0 10.002-4.477 10.002-10S17.527 2 12.004 2zm5.795 14.18c-.244.688-1.218 1.25-1.782 1.312-.524.062-1.21.144-3.52-.797-2.952-1.203-4.836-4.184-4.985-4.379-.143-.195-1.196-1.583-1.196-3.02 0-1.437.75-2.144 1.018-2.428.269-.283.587-.354.787-.354.2 0 .401.002.576.01.185.009.435-.072.678.513.25.597.854 2.079.929 2.228.075.15.124.323.025.52-.099.198-.15.32-.299.493-.15.173-.314.385-.449.516-.149.146-.305.305-.13.606.176.3.782 1.285 1.677 2.079.948.843 1.748 1.103 2.048 1.254.3.151.474.126.65-.075.174-.2.748-.868.948-1.168.2-.301.4-.251.674-.15.275.101 1.747.823 2.047.973.3.15.5.226.574.351.074.126.074.729-.17 1.417z" />
          </svg>

          {/* Active Online Status Badge */}
          <span
            className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#121212] rounded-full shadow-sm"
            title={t("online")}
          />
        </div>
      </a>
    </aside>
  );
}
