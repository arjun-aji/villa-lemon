"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#121212] select-none animate-[fadeIn_0.3s_ease-out_300ms_both]">
      <div className="flex flex-col items-center gap-4">
        {/* Elegant gold spinner */}
        <div className="w-12 h-12 border-2 border-[#c5a880]/20 border-t-[#c5a880] rounded-full animate-spin" />
        <span className="text-[10px] font-sans font-light tracking-[0.25em] text-[#c5a880] uppercase">
          Loading...
        </span>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
