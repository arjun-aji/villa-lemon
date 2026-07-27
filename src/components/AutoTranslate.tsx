"use client";
/**
 * AutoTranslate — Client-side automatic translation system.
 *
 * Uses the free Google Translate unofficial API (gtx endpoint) from the browser.
 * Translations are cached in sessionStorage keyed by (locale, text) so subsequent
 * page visits and tab switches are instant.
 *
 * Usage:
 *   <T locale={locale}>{someEnglishText}</T>
 *   <T locale={locale} as="h1" className="...">{title}</T>
 */

import React, { useEffect, useState, useRef, type ElementType, type ReactNode } from "react";

// ─── Cache ──────────────────────────────────────────────────────────────────

const MEM_CACHE = new Map<string, string>();

function cacheKey(text: string, locale: string) {
  return `${locale}::${text}`;
}

function readCache(text: string, locale: string): string | null {
  const k = cacheKey(text, locale);
  if (MEM_CACHE.has(k)) return MEM_CACHE.get(k)!;
  try {
    const stored = sessionStorage.getItem(`vl_t::${k}`);
    if (stored) { MEM_CACHE.set(k, stored); return stored; }
  } catch {}
  return null;
}

function writeCache(text: string, locale: string, translated: string) {
  const k = cacheKey(text, locale);
  MEM_CACHE.set(k, translated);
  try { sessionStorage.setItem(`vl_t::${k}`, translated); } catch {}
}

// ─── Translator ──────────────────────────────────────────────────────────────

// Queue to batch multiple small requests into one API call
const pendingQueue: Array<{
  text: string;
  locale: string;
  resolve: (v: string) => void;
}> = [];
let queueTimer: ReturnType<typeof setTimeout> | null = null;

async function flushQueue() {
  if (pendingQueue.length === 0) return;
  const batch = pendingQueue.splice(0, pendingQueue.length);

  // Group by locale
  const byLocale = new Map<string, typeof batch>();
  for (const item of batch) {
    if (!byLocale.has(item.locale)) byLocale.set(item.locale, []);
    byLocale.get(item.locale)!.push(item);
  }

  for (const [locale, items] of byLocale.entries()) {
    // Join all texts with a separator that Google Translate preserves
    const SEP = "\n||||\n";
    const combined = items.map((i) => i.text).join(SEP);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${locale}&dt=t&q=${encodeURIComponent(combined)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("non-ok");
      const json = await res.json();
      const translated: string = json[0].map((s: any) => s[0]).join("");
      const parts = translated.split(/\s*\|\|\|\|\s*/);
      items.forEach((item, idx) => {
        const result = (parts[idx] || item.text).trim();
        writeCache(item.text, locale, result);
        item.resolve(result);
      });
    } catch {
      // On failure return original text
      items.forEach((item) => item.resolve(item.text));
    }
  }
}

function scheduleFlush() {
  if (queueTimer) clearTimeout(queueTimer);
  queueTimer = setTimeout(flushQueue, 30); // 30ms batching window
}

function translateAsync(text: string, locale: string): Promise<string> {
  if (!text || locale === "en") return Promise.resolve(text);
  const cached = readCache(text, locale);
  if (cached !== null) return Promise.resolve(cached);

  return new Promise((resolve) => {
    pendingQueue.push({ text, locale, resolve });
    scheduleFlush();
  });
}

// ─── <T> Component ───────────────────────────────────────────────────────────

interface TProps {
  children: ReactNode;
  locale: string;
  as?: ElementType;
  className?: string;
  [key: string]: any;
}

export function T({ children, locale, as: Tag = React.Fragment, className, ...rest }: TProps) {
  const originalText = typeof children === "string" ? children : String(children ?? "");
  const [text, setText] = useState(originalText);
  const rendered = useRef(false);

  useEffect(() => {
    if (locale === "en" || !originalText.trim()) return;
    rendered.current = false;

    const cached = readCache(originalText, locale);
    if (cached !== null) {
      setText(cached);
      return;
    }

    translateAsync(originalText, locale).then((result) => {
      if (!rendered.current) {
        setText(result);
      }
    });

    return () => { rendered.current = true; };
  }, [originalText, locale]);

  if (Tag === React.Fragment) {
    return <>{text}</>;
  }

  return (
    <Tag className={className} {...rest}>
      {text}
    </Tag>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAutoTranslate(locale: string) {
  const t = (text: string): string => text; // synchronous fallback (SSR)
  return { t, T: (props: Omit<TProps, "locale"> & { children: ReactNode }) => <T {...props} locale={locale} /> };
}
