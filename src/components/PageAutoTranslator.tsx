"use client";
/**
 * PageAutoTranslator — Automatically translates all visible text on the page
 * when locale ≠ "en". Works like Weglot/Linguise: it walks the DOM and replaces
 * text nodes, batching them into as few Google Translate API calls as possible.
 *
 * Usage: Wrap a page section:
 *   <PageAutoTranslator locale={locale}>
 *     {children}
 *   </PageAutoTranslator>
 */
import { useEffect, useRef, type ReactNode } from "react";

// ─── In-memory + sessionStorage cache ────────────────────────────────────────
const MEM: Map<string, string> = new Map();
const SS_PREFIX = "vl_pt::";

function readCache(text: string, lang: string) {
  const k = `${lang}:${text}`;
  if (MEM.has(k)) return MEM.get(k)!;
  try {
    const v = sessionStorage.getItem(SS_PREFIX + k);
    if (v) { MEM.set(k, v); return v; }
  } catch {}
  return null;
}

function writeCache(text: string, lang: string, translated: string) {
  const k = `${lang}:${text}`;
  MEM.set(k, translated);
  try { sessionStorage.setItem(SS_PREFIX + k, translated); } catch {}
}

// ─── Batch translator ─────────────────────────────────────────────────────────
const SEP = " ✦✦✦ "; // unique separator unlikely to appear in real text

async function translateBatch(texts: string[], lang: string): Promise<string[]> {
  if (!texts.length || lang === "en") return texts;

  // Split into chunks of max 30 items (URL length safety)
  const chunks: string[][] = [];
  for (let i = 0; i < texts.length; i += 25) {
    chunks.push(texts.slice(i, i + 25));
  }

  const results: string[] = [];
  for (const chunk of chunks) {
    const combined = chunk.join(SEP);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(combined)}`;
      const res = await fetch(url);
      if (!res.ok) { results.push(...chunk); continue; }
      const json = await res.json();
      const full: string = json[0].map((s: any) => s[0]).join("");
      // Split on the separator (Google may add spaces around it)
      const parts = full.split(/\s*✦✦✦\s*/);
      chunk.forEach((orig, i) => {
        results.push((parts[i] ?? orig).trim());
      });
    } catch {
      results.push(...chunk);
    }
  }
  return results;
}

// ─── DOM walker ───────────────────────────────────────────────────────────────

// Tags whose text should NOT be translated (code, scripts, etc.)
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "INPUT", "TEXTAREA", "SELECT"]);

function collectTextNodes(root: Element): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        // Skip attribute-only parents (img alt etc handled separately)
        const text = (node.nodeValue || "").trim();
        if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
        // Skip numbers-only
        if (/^[\d₹$€£.,\s+%/-]+$/.test(text)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  let node;
  while ((node = walker.nextNode())) nodes.push(node as Text);
  return nodes;
}

async function translateDOM(root: Element, lang: string) {
  if (lang === "en") return;

  const textNodes = collectTextNodes(root);
  if (!textNodes.length) return;

  const uncached: { node: Text; text: string }[] = [];
  const toApply: { node: Text; translated: string }[] = [];

  for (const node of textNodes) {
    const text = (node.nodeValue || "").trim();
    const cached = readCache(text, lang);
    if (cached !== null) {
      toApply.push({ node, translated: cached });
    } else {
      uncached.push({ node, text });
    }
  }

  // Apply cached first
  for (const { node, translated } of toApply) {
    node.nodeValue = translated;
  }

  if (uncached.length === 0) return;

  // Translate uncached in batch
  const texts = uncached.map((u) => u.text);
  const translated = await translateBatch(texts, lang);

  for (let i = 0; i < uncached.length; i++) {
    const { node, text } = uncached[i];
    const result = translated[i] ?? text;
    writeCache(text, lang, result);
    node.nodeValue = result;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PageAutoTranslatorProps {
  locale: string;
  children: ReactNode;
  className?: string;
}

export default function PageAutoTranslator({ locale, children, className }: PageAutoTranslatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (locale === "en" || !ref.current || done.current) return;
    done.current = true;
    translateDOM(ref.current, locale);
  }, [locale]);

  return (
    <div ref={ref} className={className} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
