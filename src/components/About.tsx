"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, Variants } from "framer-motion";

interface AboutProps {
  data?: {
    tagline?: string;
    heading?: string;
    paragraph1?: string;
    paragraph2?: string;
    button?: string;
    natureTitle?: string;
    natureDesc?: string;
    luxuryTitle?: string;
    luxuryDesc?: string;
    serviceTitle?: string;
    serviceDesc?: string;
    everyoneTitle?: string;
    everyoneDesc?: string;
    quoteText?: string;
    quoteAuthor?: string;
    statsVillasLabel?: string;
    statsGuestsLabel?: string;
    statsRatingLabel?: string;
    statsLocationLabel?: string;
  };
}

// CUSTOM SVG ICONS FOR FEATURES SECTION

const LeafIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-gold"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
    <path d="M19 2L11 10" />
  </svg>
);

const VillaFrontIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-gold"
  >
    <path d="M3 22h18M6 22V11m12 11V11M10 22V15h4v7" />
    <path d="M4 11h16L12 4 4 11z" />
    <path d="M9 11v4M15 11v4" />
  </svg>
);

const ClocheIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-gold"
  >
    <path d="M2 19h20M12 4a1 1 0 0 1 1 1v1a6 6 0 0 1 6 6v3H5v-3a6 6 0 0 1 6-6V5a1 1 0 0 1 1-1z" />
  </svg>
);

const FamilyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 text-brand-gold"
  >
    <path d="M17 21v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M22 21v-2a3 3 0 0 0-3-3h-1.5" />
    <circle cx="19" cy="8" r="3" />
  </svg>
);

// CUSTOM SVG ICONS FOR STATS SECTION

const HouseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 sm:w-7 sm:h-7 text-brand-gold mb-1.5 sm:mb-3"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const GuestsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 sm:w-7 sm:h-7 text-brand-gold mb-1.5 sm:mb-3"
  >
    <path d="M17 21v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M22 21v-2a3 3 0 0 0-3-3h-1.5" />
    <circle cx="19" cy="8" r="3" />
  </svg>
);

const RatingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 sm:w-7 sm:h-7 text-brand-gold mb-1.5 sm:mb-3"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 sm:w-7 sm:h-7 text-brand-gold mb-1.5 sm:mb-3"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function About({ data }: AboutProps) {
  const t = useTranslations("About");
  const shouldReduceMotion = useReducedMotion();

  // Localized values & overrides
  const tagline = data?.tagline || t("tagline");
  const heading = data?.heading || t("heading");
  const paragraph1 = data?.paragraph1 || t("paragraph1");
  const paragraph2 = data?.paragraph2 || t("paragraph2");
  const button = data?.button || t("button");

  const natureTitle = data?.natureTitle || t("natureTitle");
  const natureDesc = data?.natureDesc || t("natureDesc");
  const luxuryTitle = data?.luxuryTitle || t("luxuryTitle");
  const luxuryDesc = data?.luxuryDesc || t("luxuryDesc");
  const serviceTitle = data?.serviceTitle || t("serviceTitle");
  const serviceDesc = data?.serviceDesc || t("serviceDesc");
  const everyoneTitle = data?.everyoneTitle || t("everyoneTitle");
  const everyoneDesc = data?.everyoneDesc || t("everyoneDesc");

  const quoteText = data?.quoteText || t("quoteText");
  const quoteAuthor = data?.quoteAuthor || t("quoteAuthor");

  const statsVillasLabel = data?.statsVillasLabel || t("statsVillasLabel");
  const statsGuestsLabel = data?.statsGuestsLabel || t("statsGuestsLabel");
  const statsRatingLabel = data?.statsRatingLabel || t("statsRatingLabel");
  const statsLocationLabel = data?.statsLocationLabel || t("statsLocationLabel");

  // Animation variants supporting reduced motion preferences
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
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
      transition: { duration: 1.0, ease: "easeOut", delay: 0.3 },
    },
  };

  const features = [
    {
      icon: <LeafIcon />,
      title: natureTitle,
      desc: natureDesc,
    },
    {
      icon: <VillaFrontIcon />,
      title: luxuryTitle,
      desc: luxuryDesc,
    },
    {
      icon: <ClocheIcon />,
      title: serviceTitle,
      desc: serviceDesc,
    },
    {
      icon: <FamilyIcon />,
      title: everyoneTitle,
      desc: everyoneDesc,
    },
  ];

  const stats = [
    {
      icon: <HouseIcon />,
      val: t("statsVillasVal"),
      label: statsVillasLabel,
    },
    {
      icon: <GuestsIcon />,
      val: t("statsGuestsVal"),
      label: statsGuestsLabel,
    },
    {
      icon: <RatingIcon />,
      val: t("statsRatingVal"),
      label: statsRatingLabel,
    },
    {
      icon: <LocationIcon />,
      val: t("statsLocationVal"),
      label: statsLocationLabel,
    },
  ];

  return (
    <section id="about" className="w-full flex flex-col scroll-mt-24" aria-label="About Villa Lemon">
      
      {/* PART 1: OUR STORY (SCREEN HEIGHT ON DESKTOP) */}
      <div className="w-full bg-brand-cream py-20 md:py-0 md:min-h-screen flex flex-col justify-center text-brand-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: TEXT CONTENT */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Tagline */}
              <motion.div
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="flex items-center gap-2 mb-4"
              >
                <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-brand-gold uppercase">
                  {tagline}
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-serif font-normal text-brand-dark leading-[1.15] tracking-wide mb-6 md:mb-8"
              >
                {heading}
              </motion.h2>

              {/* Paragraph 1 */}
              <motion.p
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="text-sm sm:text-base text-brand-dark/80 font-sans font-light leading-relaxed mb-6 max-w-xl"
              >
                {paragraph1}
              </motion.p>

              {/* Paragraph 2 */}
              <motion.p
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="text-sm sm:text-base text-brand-dark/80 font-sans font-light leading-relaxed mb-8 md:mb-10 max-w-xl"
              >
                {paragraph2}
              </motion.p>

              {/* Discover CTA Button */}
              <motion.div
                custom={4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="w-full sm:w-auto"
              >
                <a
                  href="#villas"
                  id="about-discover-villas-btn"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-brand-gold/60 hover:border-brand-gold bg-transparent hover:bg-brand-gold text-brand-dark hover:text-white font-bold text-xs md:text-sm tracking-[0.18em] uppercase rounded-sm transition-all duration-300 select-none shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <span>{button}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-sans">
                    →
                  </span>
                </a>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: IMAGES VISUAL SHOWCASE */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end w-full mt-4 lg:mt-0">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="relative w-full max-w-[540px] aspect-[1.15/1]"
              >
                {/* Main background image: Sunset landscape */}
                <div className="absolute top-0 left-0 w-[84%] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg select-none">
                  <Image
                    src="/assets/about_sunset.png"
                    alt="Scenic Varkala Kerala Sunset Landscape with Palm Trees"
                    fill
                    sizes="(max-w-768px) 100vw, 50vw"
                    className="object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                    quality={90}
                  />
                </div>

                {/* Foreground overlapping image: Villa terrace interior */}
                <div className="absolute bottom-4 right-0 w-[48%] aspect-[4/3] rounded-2xl overflow-hidden border-[6px] md:border-[8px] border-brand-cream shadow-2xl select-none z-10 transition-transform duration-500 hover:scale-[1.03]">
                  <Image
                    src="/assets/about_interior.png"
                    alt="Cozy Luxury Villa Balcony Interior overlooking nature"
                    fill
                    sizes="(max-w-768px) 50vw, 25vw"
                    className="object-cover"
                    quality={90}
                  />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* PART 2: FEATURES ROW */}
      <div className="w-full bg-brand-cream pb-20 md:pb-28 text-brand-dark border-t border-[#eae6db]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-16 md:pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
            {features.map((feat, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeInUp}
                className="flex flex-col items-center text-center px-4 xl:px-8 relative"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-full border border-brand-gold/30 flex items-center justify-center bg-brand-cream-soft/50 mb-5 transition-colors duration-300 hover:border-brand-gold hover:bg-brand-cream-soft select-none">
                  {feat.icon}
                </div>
                
                {/* Heading */}
                <h3 className="text-lg font-serif font-normal text-brand-dark mb-2.5 tracking-wide">
                  {feat.title}
                </h3>
                
                {/* Description */}
                <p className="text-xs sm:text-sm text-brand-dark/70 font-sans font-light leading-relaxed max-w-[240px]">
                  {feat.desc}
                </p>

                {/* Vertical Divider line for desktop */}
                {index < 3 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-16 bg-[#eae6db]/80" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* PART 3: QUOTE BANNER */}
      <div className="relative w-full h-[320px] md:h-[450px] flex items-center justify-center overflow-hidden bg-brand-dark">
        {/* Background image */}
        <Image
          src="/assets/about_quote_bg.png"
          alt="Scenic dark green Kerala backwaters backdrop"
          fill
          sizes="100vw"
          className="object-cover object-center select-none opacity-60"
          quality={90}
        />
        {/* Deep luxurious dark green vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-brand-dark/65 to-black/55 z-10" />
        <div className="absolute inset-0 bg-emerald-950/20 z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-4xl px-6">
          {/* Quote Symbol with golden lines */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-6 mb-6 w-full max-w-[220px] sm:max-w-[280px] mx-auto"
          >
            <div className="h-[1px] bg-brand-gold/40 flex-grow" />
            <span className="text-brand-gold text-5xl md:text-6.5xl font-serif leading-none select-none font-semibold">
              “
            </span>
            <div className="h-[1px] bg-brand-gold/40 flex-grow" />
          </motion.div>

          {/* Quote text */}
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-2xl md:text-3.5xl lg:text-4xl font-serif font-normal text-white leading-snug tracking-wide mb-6 max-w-3xl"
          >
            {quoteText}
          </motion.h3>

          {/* Quote author */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.5 }}
            className="text-xs sm:text-sm text-brand-gold tracking-[0.2em] font-sans font-medium uppercase"
          >
            {quoteAuthor}
          </motion.p>
        </div>
      </div>

      {/* PART 4: STATS ROW */}
      <div className="w-full bg-brand-cream py-10 sm:py-16 md:py-24 text-brand-dark border-t border-[#eae6db]/25">
        <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
          <div className="grid grid-cols-4 gap-2 sm:gap-6 lg:gap-0">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeInUp}
                className="flex flex-col items-center text-center px-1 sm:px-4 xl:px-8 relative"
              >
                {/* Outlined Icon */}
                {stat.icon}
                
                {/* Statistic Number */}
                <h4 className="text-xl sm:text-3xl md:text-5.5xl lg:text-6xl font-serif font-normal text-brand-dark mb-0.5 sm:mb-1 tracking-tight leading-none">
                  {stat.val}
                </h4>
                
                {/* Label */}
                <p className="text-[9px] sm:text-xs md:text-sm text-brand-dark/75 font-sans font-light tracking-wide mt-1 sm:mt-2">
                  {stat.label}
                </p>

                {/* Vertical Divider line for desktop */}
                {index < 3 && (
                  <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 sm:h-16 bg-[#eae6db]/80" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
