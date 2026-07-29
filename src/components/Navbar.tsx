"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import BookingButton from "./BookingButton";
import { API_BASE_URL } from "@/config/api";

interface SubItem {
  name: string;
  href: string;
  isDynamic?: boolean;
}

interface NavItem {
  name: string;
  href: string;
  children?: SubItem[];
}

const navItems: NavItem[] = [
  { name: "HOME", href: "/" },
  {
    name: "ACCOMMODATIONS",
    href: "/#villas",
    children: [
      { name: "entireVillas", href: "/accommodation/villas" },
      { name: "privateFloors", href: "/accommodation/floors" },
      { name: "individualRooms", href: "/accommodation/rooms" },
    ],
  },
  {
    name: "PACKAGES",
    href: "/#packages",
    children: [
      { name: "varkalaSightseeing", href: "/packages/varkala-sightseeing" },
      { name: "dayTrips", href: "/packages/day-trips" },
      { name: "backwaterExperiences", href: "/packages/backwater-experiences" },
      { name: "adventureActivities", href: "/packages/adventure-activities" },
      { name: "varkalaPackages", href: "/packages/varkala-packages" },
    ],
  },
  {
    name: "YOGATOURS",
    href: "/#yogatours",
    children: [
      { name: "yogaRetreats", href: "/yoga/yoga-retreats" },
      { name: "dailyYogaClasses", href: "/yoga/daily-yoga-classes" },
      { name: "privateYogaSessions", href: "/yoga/private-yoga-sessions" },
      { name: "meetOurTeachers", href: "/yoga/teachers" },
    ],
  },
  { name: "ABOUT", href: "/#about" },
  { name: "GALLERY", href: "/#gallery" },
  { name: "CONTACT", href: "/#contact" },
];

const languages = [
  { code: "EN", name: "English" },
  { code: "DE", name: "Deutsch" },
  { code: "FR", name: "Français" },
  { code: "RU", name: "Русский" },
];

export default function Navbar({ absoluteOnly = false }: { absoluteOnly?: boolean }) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [itemsList, setItemsList] = useState<NavItem[]>(navItems);

  // Dynamically load categories for Accommodations, Packages, and Yoga
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const [resAcc, resPkg, resYoga] = await Promise.all([
          fetch(`${API_BASE_URL}/api/accommodations`),
          fetch(`${API_BASE_URL}/api/packages`),
          fetch(`${API_BASE_URL}/api/yoga/programs`)
        ]);

        const updatedItems = JSON.parse(JSON.stringify(navItems));

        if (resAcc.ok) {
          const accData = await resAcc.json();
          if (accData?.data) {
            const accChildren = accData.data.map((cat: any) => ({
              name: cat.title[locale] || cat.title.en,
              href: `/accommodation/${cat.type}`,
              isDynamic: true
            }));
            const accIndex = updatedItems.findIndex((i: any) => i.name === "ACCOMMODATIONS");
            if (accIndex !== -1 && accChildren.length > 0) {
              updatedItems[accIndex].children = accChildren;
            }
          }
        }

        if (resPkg.ok) {
          const pkgData = await resPkg.json();
          if (pkgData?.data) {
            const pkgChildren = pkgData.data.map((cat: any) => ({
              name: cat.title[locale] || cat.title.en,
              href: `/packages/${cat.category}`,
              isDynamic: true
            }));
            const pkgIndex = updatedItems.findIndex((i: any) => i.name === "PACKAGES");
            if (pkgIndex !== -1 && pkgChildren.length > 0) {
              updatedItems[pkgIndex].children = pkgChildren;
            }
          }
        }

        if (resYoga.ok) {
          const yogaData = await resYoga.json();
          if (yogaData?.data) {
            const yogaChildren = yogaData.data.map((cat: any) => {
              let rawHref = cat.href || "";
              let formattedHref = rawHref;
              if (rawHref && !rawHref.startsWith("/") && !rawHref.startsWith("http")) {
                formattedHref = "/" + rawHref;
              }
              return {
                name: cat.title[locale] || cat.title.en,
                href: formattedHref,
                isDynamic: true
              };
            });
            
            // Append "Meet Our Teachers"
            yogaChildren.push({
              name: "meetOurTeachers",
              href: "/yoga/teachers",
              isDynamic: false
            });

            const yogaIndex = updatedItems.findIndex((i: any) => i.name === "YOGATOURS");
            if (yogaIndex !== -1 && yogaChildren.length > 0) {
              updatedItems[yogaIndex].children = yogaChildren;
            }
          }
        }

        setItemsList(updatedItems);
      } catch (err) {
        console.warn("[navbar fetch]: Failed to load dynamic menu items", err);
      }
    };

    fetchNavbarData();
  }, [locale]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("HOME");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const currentLang = locale.toUpperCase();

  // Monitor scroll for transition effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation listener (Close mobile menu on ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsLangDropdownOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = () => {
      setOpenDropdown(null);
      setIsLangDropdownOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Synchronize active nav item with URL pathname, hash, and scroll position
  useEffect(() => {
    const syncFromUrl = () => {
      if (pathname.startsWith("/accommodation")) {
        setActiveItem("ACCOMMODATIONS");
      } else if (pathname.startsWith("/packages")) {
        setActiveItem("PACKAGES");
      } else if (pathname.startsWith("/yoga") || pathname.startsWith("/retreats")) {
        setActiveItem("YOGATOURS");
      } else {
        const hash = window.location.hash;
        if (hash === "#villas") setActiveItem("ACCOMMODATIONS");
        else if (hash === "#packages") setActiveItem("PACKAGES");
        else if (hash === "#yogatours") setActiveItem("YOGATOURS");
        else if (hash === "#about") setActiveItem("ABOUT");
        else if (hash === "#gallery") setActiveItem("GALLERY");
        else if (hash === "#contact") setActiveItem("CONTACT");
        else setActiveItem("HOME");
      }
    };

    syncFromUrl();

    // Scroll spy on the homepage using precise section offsets
    const isHomepage = pathname === "/" || pathname === "" || pathname === `/${locale}`;
    let scrollAnimationFrame: number;

    const handleScrollSpy = () => {
      if (scrollAnimationFrame) {
        window.cancelAnimationFrame(scrollAnimationFrame);
      }
      
      scrollAnimationFrame = window.requestAnimationFrame(() => {
        const sectionIds = ["home", "villas", "packages", "yogatours", "about"];
        const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
        
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        let activeSection = "HOME";
        
        for (const section of sections) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const id = section.id;
            if (id === "home") activeSection = "HOME";
            else if (id === "villas") activeSection = "ACCOMMODATIONS";
            else if (id === "packages") activeSection = "PACKAGES";
            else if (id === "yogatours") activeSection = "YOGATOURS";
            else if (id === "about") activeSection = "ABOUT";
          }
        }
        
        setActiveItem(activeSection);
      });
    };

    if (isHomepage && typeof window !== "undefined") {
      window.addEventListener("scroll", handleScrollSpy);
      // Run once on load/mount
      handleScrollSpy();
    }

    window.addEventListener("hashchange", syncFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      if (isHomepage && typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScrollSpy);
        if (scrollAnimationFrame) {
          window.cancelAnimationFrame(scrollAnimationFrame);
        }
      }
    };
  }, [pathname, locale]);

  return (
    <header
      className={`${absoluteOnly ? "absolute" : "fixed"} top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "py-4 border-b border-brand-gold/10 bg-brand-cream/50 backdrop-blur-md shadow-sm"
          : "py-6 bg-transparent"
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between transition-opacity duration-300 ${
        isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-brand-gold rounded-sm"
          onClick={() => setActiveItem("HOME")}
        >
          <div className="relative flex items-center justify-center w-10 h-10 border border-brand-gold/30 rounded-sm overflow-hidden bg-[#121212]/40 transition-colors duration-300 group-hover:border-brand-gold">
            <svg
              width="26"
              height="26"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand-gold transition-transform duration-500 group-hover:scale-105"
            >
              <path
                d="M20 5L6 16V33H34V16L20 5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 12C20 12 15 18 15 22C15 24.7614 17.2386 27 20 27C22.7614 27 25 24.7614 25 22C25 18 20 12 20 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 12V27"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col select-none">
            <span className={`font-serif text-lg md:text-xl font-medium tracking-[0.15em] group-hover:text-brand-gold transition-colors duration-300 leading-none ${
              isScrolled ? "text-brand-dark" : "text-brand-cream"
            }`}>
              VILLA LEMON
            </span>
            <span className="text-[7px] md:text-[8px] tracking-[0.3em] text-brand-gold font-sans font-medium mt-1 uppercase">
              {t("stayRelax")}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV ITEMS */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {itemsList.map((item) => (
            <div key={item.name} className="relative flex items-center gap-0.5 group/menu">
              <Link
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`relative text-[11px] xl:text-xs font-medium tracking-[0.2em] transition-colors duration-300 py-2 focus:outline-none focus:text-brand-gold ${
                  isScrolled
                    ? "text-brand-dark/80 hover:text-brand-dark"
                    : "text-brand-cream/80 hover:text-brand-cream"
                }`}
              >
                {t(item.name)}
                {/* Underline indicators */}
                {activeItem === item.name && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* Sub-menu trigger (down arrow) */}
              {item.children && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === item.name ? null : item.name);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`p-1.5 focus:outline-none transition-colors duration-300 ${
                    isScrolled ? "text-brand-dark hover:text-brand-gold" : "text-brand-cream hover:text-brand-gold"
                  }`}
                  aria-label={`Toggle ${item.name} sub-menu`}
                >
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      openDropdown === item.name ? "rotate-180 text-brand-gold" : ""
                    }`}
                  />
                </button>
              )}

              {/* Sub-menu Dropdown List */}
              <AnimatePresence>
                {item.children && openDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-brand-dark border border-brand-gold/20 rounded-sm shadow-xl z-50 overflow-hidden flex flex-col py-2"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => {
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-brand-cream/80 hover:text-brand-gold hover:bg-brand-gold/5 transition-colors duration-200 uppercase"
                      >
                        {child.isDynamic ? child.name : t(child.name)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* LANGUAGE & BOOKING CONTROLS */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Custom Language Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLangDropdownOpen(!isLangDropdownOpen);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold tracking-widest focus:outline-none border px-3 py-1.5 rounded-sm transition-all duration-300 ${
                isScrolled
                  ? "text-brand-dark/80 hover:text-brand-dark border-brand-dark/20 hover:border-brand-gold/50 bg-white/20"
                  : "text-brand-cream/80 hover:text-brand-cream border-brand-cream/20 hover:border-brand-gold/50 bg-[#121212]/20"
              }`}
              aria-label={t("selectLanguage")}
              aria-expanded={isLangDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              <span>{currentLang}</span>
              <ChevronDown
                className={`w-3 h-3 text-brand-gold/60 transition-transform duration-300 ${isLangDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-32 bg-brand-dark border border-brand-gold/20 rounded-sm shadow-xl z-50 overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        router.replace(pathname, { locale: lang.code.toLowerCase() });
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium tracking-wider hover:bg-brand-gold/10 transition-colors duration-200 ${currentLang === lang.code
                          ? "text-brand-gold bg-brand-gold/5"
                          : "text-brand-cream/80"
                        }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Custom Language Dropdown for Mobile */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLangDropdownOpen(!isLangDropdownOpen);
              }}
              className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-widest focus:outline-none border px-2 py-1.5 rounded-sm transition-all duration-300 ${
                isScrolled
                  ? "text-brand-dark/80 hover:text-brand-dark border-brand-dark/20 hover:border-brand-gold/50 bg-white/20"
                  : "text-brand-cream/80 hover:text-brand-cream border-brand-cream/20 hover:border-brand-gold/50 bg-[#121212]/20"
              }`}
              aria-label={t("selectLanguage")}
              aria-expanded={isLangDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              <span>{currentLang}</span>
              <ChevronDown
                className={`w-2.5 h-2.5 text-brand-gold/60 transition-transform duration-300 ${isLangDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-32 bg-brand-dark border border-brand-gold/20 rounded-sm shadow-xl z-50 overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        router.replace(pathname, { locale: lang.code.toLowerCase() });
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium tracking-wider hover:bg-brand-gold/10 transition-colors duration-200 ${currentLang === lang.code
                          ? "text-brand-gold bg-brand-gold/5"
                          : "text-brand-cream/80"
                        }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 hover:text-brand-gold focus:outline-none rounded-sm transition-colors duration-300 ${
              isScrolled ? "text-brand-dark" : "text-brand-cream"
            }`}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[1.5]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-white/50 backdrop-blur-md border-l border-brand-gold/20 z-50 p-8 flex flex-col justify-between lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col gap-8">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-brand-dark/10">
                  <span className="font-serif text-md tracking-[0.1em] text-brand-gold font-medium">
                    {t("menu")}
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-brand-dark hover:text-brand-gold focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-4">
                  {itemsList.map((item) => (
                    <div key={item.name} className="flex flex-col w-full">
                      <div className="flex items-center justify-between w-full py-1">
                        <Link
                          href={item.href}
                          onClick={() => {
                            setActiveItem(item.name);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`text-sm font-semibold tracking-[0.2em] transition-colors duration-300 focus:outline-none ${activeItem === item.name
                              ? "text-brand-gold border-l-2 border-brand-gold pl-3"
                              : "text-brand-dark/80 hover:text-brand-gold pl-0"
                            }`}
                        >
                          {t(item.name)}
                        </Link>
                        {item.children && (
                          <button
                            onClick={() => {
                              setOpenMobileDropdown(
                                openMobileDropdown === item.name ? null : item.name
                              );
                            }}
                            className="p-2 focus:outline-none text-brand-dark hover:text-brand-gold"
                            aria-label={`Toggle ${item.name} mobile sub-menu`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                openMobileDropdown === item.name ? "rotate-180 text-brand-gold" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Mobile children submenu */}
                      {item.children && openMobileDropdown === item.name && (
                        <div className="flex flex-col pl-4 mt-2 border-l border-brand-gold/25 gap-3.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                              }}
                              className="text-[10px] font-semibold tracking-[0.15em] text-brand-dark/70 hover:text-brand-gold transition-colors duration-200 uppercase py-1"
                            >
                              {child.isDynamic ? child.name : t(child.name)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Booking Button */}
                <div className="pt-2">
                  <BookingButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center bg-brand-gold hover:bg-brand-gold-dark text-white font-sans font-bold text-xs tracking-widest uppercase rounded-[3px] py-3.5 transition-all duration-300 shadow-md focus:outline-none focus:ring-1 focus:ring-brand-gold w-full text-center"
                    context="Mobile Navbar Menu"
                  >
                    {t("bookNow")}
                  </BookingButton>
                </div>
              </div>

              {/* Footer inside drawer */}
              <div className="flex flex-col gap-4 border-t border-brand-dark/10 pt-6 mt-8">
                {/* Language toggle inside drawer */}
                <div className="flex items-center gap-3 pb-2 select-none">
                  <span className="text-[9px] tracking-widest text-brand-dark/50 uppercase font-sans">
                    Language:
                  </span>
                  <div className="flex gap-1.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          router.replace(pathname, { locale: lang.code.toLowerCase() });
                        }}
                        className={`px-2 py-0.5 text-[9px] font-semibold tracking-wider rounded-sm transition-all duration-300 ${currentLang === lang.code
                            ? "text-brand-gold border border-brand-gold bg-brand-gold/10"
                            : "text-brand-dark/70 border border-brand-dark/20 hover:border-brand-gold/45 hover:text-brand-dark hover:bg-brand-dark/5"
                          }`}
                      >
                        {lang.code}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-[9px] tracking-widest text-brand-gold font-sans uppercase">
                  Villa Lemon
                </span>
                <span className="text-[10px] text-brand-dark/60 leading-relaxed font-sans">
                  {t("stayRelax")}
                  <br />
                  info@villalemon.com
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
