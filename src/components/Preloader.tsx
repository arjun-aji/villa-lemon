"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scroll while loading
    document.body.style.overflow = "hidden";

    const handleLoad = () => {
      // Small timeout to show animation
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "";
      }, 1800);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      // Fallback timer if load event doesn't fire
      const fallback = setTimeout(handleLoad, 3000);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallback);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fbf9f6] select-none"
        >
          {/* Logo container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }}
            className="flex flex-col items-center"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Villa Lemon Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Premium Progress Bar */}
            <div className="w-32 h-[1.5px] bg-[#c5a880]/20 mt-6 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut"
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-[#c5a880] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
