"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#121212] text-[#fbf9f6] select-none">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/60 font-sans">
          Loading...
        </span>
      </div>
    </div>
  );
}
