"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const t = useTranslations("Navbar"); // Use standard translations or custom ones if available

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("villa_lemon_admin_token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Save token and user details to localStorage
      localStorage.setItem("villa_lemon_admin_token", data.token);
      localStorage.setItem("villa_lemon_admin_user", JSON.stringify(data.data.user));

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-brand-dark px-6 select-none relative overflow-hidden">
      {/* Decorative luxury abstract circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-brand-dark-soft border border-brand-gold/15 rounded-sm p-8 md:p-10 shadow-2xl relative z-10">
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex items-center justify-center w-14 h-14 border border-brand-gold/30 rounded-sm overflow-hidden bg-brand-dark mb-4">
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand-gold"
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
          <h1 className="font-serif text-2xl tracking-[0.15em] text-brand-cream uppercase leading-none">
            VILLA LEMON
          </h1>
          <p className="text-[9px] tracking-[0.3em] text-brand-gold font-sans font-medium uppercase mt-2">
            CMS Portal Gate
          </p>
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {error && (
          <div className="flex items-center gap-3 bg-red-950/30 border border-red-900/50 rounded-sm p-4 mb-6 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-brand-cream/60 uppercase">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-brand-gold/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@villalemon.com"
                className="w-full bg-brand-dark/50 border border-brand-cream/10 rounded-sm py-3.5 pl-10 pr-4 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 transition-all duration-300"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-brand-cream/60 uppercase">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-brand-gold/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-dark/50 border border-brand-cream/10 rounded-sm py-3.5 pl-10 pr-4 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 transition-all duration-300"
              />
            </div>
          </div>

          {/* Submit/Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative flex items-center justify-center gap-2.5 px-6 py-4 bg-brand-gold hover:bg-brand-gold-dark text-[#121212] disabled:bg-brand-gold/60 font-bold text-xs tracking-widest uppercase rounded-sm transition-all duration-300 shadow-lg hover:shadow-brand-gold/10 mt-2 focus:outline-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
