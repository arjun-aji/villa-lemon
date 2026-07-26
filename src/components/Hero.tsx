"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Calendar } from "lucide-react";
import Navbar from "./Navbar";
import HighlightsBar from "./HighlightsBar";

const WhatsAppIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-brand-cream group-hover:text-[#121212] transition-colors duration-300"
    aria-hidden="true"
  >
    {/* Premium WhatsApp logo silhouette path */}
    <path d="M12.004 2C6.48 2 2.002 6.477 2.002 12c0 1.892.527 3.66 1.442 5.178L2.02 22l5.008-1.309A9.957 9.957 0 0012.004 22c5.523 0 10.002-4.477 10.002-10S17.527 2 12.004 2zm5.795 14.18c-.244.688-1.218 1.25-1.782 1.312-.524.062-1.21.144-3.52-.797-2.952-1.203-4.836-4.184-4.985-4.379-.143-.195-1.196-1.583-1.196-3.02 0-1.437.75-2.144 1.018-2.428.269-.283.587-.354.787-.354.2 0 .401.002.576.01.185.009.435-.072.678.513.25.597.854 2.079.929 2.228.075.15.124.323.025.52-.099.198-.15.32-.299.493-.15.173-.314.385-.449.516-.149.146-.305.305-.13.606.176.3.782 1.285 1.677 2.079.948.843 1.748 1.103 2.048 1.254.3.151.474.126.65-.075.174-.2.748-.868.948-1.168.2-.301.4-.251.674-.15.275.101 1.747.823 2.047.973.3.15.5.226.574.351.074.126.074.729-.17 1.417z" />
  </svg>
);

interface HeroProps {
  data?: {
    tagline?: string;
    headingPart1?: string;
    headingPart2?: string;
    nature?: string;
    description?: string;
    bookStay?: string;
    whatsappBooking?: string;
    imageAlt?: string;
  };
  highlightsData?: {
    premiumVillasTitle?: string;
    premiumVillasSubtitle?: string;
    greatLocationsTitle?: string;
    greatLocationsSubtitle?: string;
    wellnessTitle?: string;
    wellnessSubtitle?: string;
  };
}

export default function Hero({ data, highlightsData }: HeroProps) {
  const t = useTranslations("Hero");
  const shouldReduceMotion = useReducedMotion();

  // Localized string fallbacks
  const tagline = data?.tagline || t("tagline");
  const headingPart1 = data?.headingPart1 || t("headingPart1");
  const headingPart2 = data?.headingPart2 || t("headingPart2");
  const nature = data?.nature || t("nature");
  const description = data?.description || t("description");
  const bookStay = data?.bookStay || t("bookStay");
  const whatsappBooking = data?.whatsappBooking || t("whatsappBooking");

  // Animation variants supporting reduced motion preferences
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: custom * 0.15,
      },
    }),
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-brand-dark"
      aria-label="Welcome to Villa Lemon"
    >
      {/* NAVBAR INTEGRATION */}
      <Navbar />

      {/* BACKGROUND IMAGE WITH TWILIGHT OVERLAYS */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero.png"
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover object-center select-none"
          quality={90}
        />
        <Image
          src="/assets/hero1.png"
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="block md:hidden object-cover object-center select-none"
          quality={90}
        />
        {/* Deep linear gradient for text readability and layout integration */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/40 to-transparent z-10 hidden md:block" />
        <div className="absolute inset-0 bg-black/35 z-10 block md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50 z-10" />
      </div>

      {/* HERO MAIN BODY */}
      <div className="relative z-20 flex-grow flex items-center max-w-7xl mx-auto px-6 md:px-12 w-full pt-28 pb-20 md:pt-32 md:pb-16">
        <div className="max-w-2xl text-left flex flex-col items-start gap-4 md:gap-8">
          
          {/* Tagline */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="hidden md:flex items-center gap-2"
          >
            <div className="w-8 h-[1px] bg-brand-gold" />
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">
              {tagline}
            </span>
          </motion.div>

          {/* Heading (SEO H1) */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-[40px] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7.5xl font-serif font-normal tracking-wide text-brand-cream md:leading-[1.1]"
          >
            {headingPart1} <br />
            {headingPart2} <br className="block md:hidden" />
            <span className="text-brand-gold md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-brand-gold md:to-brand-gold-dark md:font-medium md:italic">
              {nature}
            </span>
          </motion.h1>

          {/* Gold divider line below heading on mobile */}
          <div className="w-24 h-[1px] bg-brand-gold/60 mt-1 mb-2 block md:hidden" />

          {/* Subheading description */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-xs sm:text-sm md:text-base leading-relaxed text-brand-cream/80 max-w-lg font-light tracking-wide font-sans"
          >
            {description}
          </motion.p>

          {/* Call-to-Actions (CTAs) */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col items-stretch gap-3 mt-4 w-full max-w-[280px] md:flex-row md:items-center md:gap-4 md:mt-2 md:max-w-none"
          >
            {/* Primary Booking CTA */}
            <a
              href="#booking"
              className="group relative flex items-center justify-center gap-2.5 px-6 md:px-7 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white md:text-[#121212] font-semibold text-xs md:text-sm tracking-widest uppercase rounded-sm transition-all duration-300 shadow-lg hover:shadow-brand-gold/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold focus:ring-offset-[#121212]"
            >
              <Calendar className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>{t("bookStay")}</span>
            </a>

            {/* Secondary WhatsApp CTA */}
            <a
              href="https://wa.me/155553666" // Placeholder WhatsApp link
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 px-6 md:px-7 py-3.5 border border-white/60 md:border-brand-cream/20 hover:border-brand-gold hover:bg-brand-gold text-white hover:text-[#121212] font-semibold text-xs md:text-sm tracking-widest uppercase rounded-sm transition-all duration-300 backdrop-blur-sm bg-black/25 md:bg-black/10 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-[#121212]"
            >
              <WhatsAppIcon />
              <span>{whatsappBooking}</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* FLOATING HIGHLIGHTS PANEL */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-20 pb-12 md:pb-16 w-full"
      >
        <HighlightsBar data={highlightsData} />
      </motion.div>
    </section>
  );
}
