"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react";

interface FooterProps {
  contact?: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
}

export default function Footer({ contact }: FooterProps) {
  const locale = useLocale();

  const phoneVal = contact?.phone || "+91 73560 85055";
  const emailVal = contact?.email || "villalemonhomestay@gmail.com";
  const addressVal = contact?.address || "Villa Lemon, Kurakkanni, Varkala, Thiruvananthapuram, Kerala, India - 695141";

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#0a0a0a] text-white border-t border-white/5 relative z-10">
      {/* Main Footer Links & Info Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-left">
        {/* Brand Column */}
        <div className="flex flex-col space-y-3">
          <span className="font-serif text-xl tracking-[0.1em] text-brand-gold select-none">
            VILLA LEMON
          </span>
          <p className="text-[10px] tracking-wider text-brand-gold/70 font-semibold uppercase leading-none">
            Stay • Relax • Rejuvenate
          </p>
          <p className="text-xs text-white/50 leading-relaxed font-light select-text max-w-sm pt-1">
            An elegant wellness homestay nestled in Varkala, Kerala. We provide premium stays, personalized tour programs, and dedicated yoga retreats for a wholesome rejuvenating experience.
          </p>
        </div>

        {/* Site Navigation Links - Arranged in a 3x2 Grid */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-white/10 pb-2 select-none">
            Quick Navigation
          </h4>
          <nav className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-white/60">
            <Link href={`/${locale}`} className="hover:text-brand-gold transition-colors w-fit">HOME</Link>
            <Link href={`/${locale}#about`} className="hover:text-brand-gold transition-colors w-fit">ABOUT</Link>
            <Link href={`/${locale}#villas`} className="hover:text-brand-gold transition-colors w-fit">ACCOMMODATIONS</Link>
            <Link href={`/${locale}#packages`} className="hover:text-brand-gold transition-colors w-fit">PACKAGES</Link>
            <Link href={`/${locale}#yogatours`} className="hover:text-brand-gold transition-colors w-fit">YOGA TOURS</Link>
            <Link href={`/${locale}#contact`} className="hover:text-brand-gold transition-colors w-fit">CONTACT</Link>
          </nav>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col space-y-4 select-text">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-b border-white/10 pb-2 select-none">
            Contact Information
          </h4>
          <div className="flex flex-col space-y-3 text-xs text-white/60">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <span className="leading-relaxed font-light">{addressVal}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-gold shrink-0" />
              <a href={`tel:${phoneVal.replace(/\s+/g, "")}`} className="hover:text-brand-gold transition-colors font-light">
                {phoneVal}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <a href={`mailto:${emailVal}`} className="hover:text-brand-gold transition-colors font-light break-all">
                {emailVal}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright section */}
      <div className="w-full bg-[#070707] py-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/40 tracking-wider font-light select-none">
            &copy; {new Date().getFullYear()} VILLA LEMON. All rights reserved.
          </p>

          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 text-[9px] font-bold text-white/50 hover:text-brand-gold tracking-widest uppercase transition-all duration-300 border border-white/10 hover:border-brand-gold/30 rounded-full px-3 py-1.5 select-none cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3 text-brand-gold" />
          </button>
        </div>
      </div>
    </footer>
  );
}
