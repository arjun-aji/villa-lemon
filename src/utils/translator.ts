// In-memory cache: key = `${locale}:${text}`
const translationCache = new Map<string, string>();

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || !targetLang || targetLang === "en") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
    // Use no-store so Next.js does NOT cache this fetch across locales —
    // our own in-memory cache handles deduplication within a process.
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return text;
    const json = await res.json();
    if (json && json[0]) {
      const translated = json[0].map((item: any) => item[0]).join("") || text;
      translationCache.set(cacheKey, translated);
      return translated;
    }
    return text;
  } catch (err) {
    console.error(`[translation failed] "${trimmed}" -> ${targetLang}:`, err);
    return text;
  }
}

export function isLocalizedText(val: any): boolean {
  return (
    val !== null &&
    typeof val === "object" &&
    "en" in val &&
    !Array.isArray(val)
  );
}

export async function localizeValue(val: any, locale: string): Promise<any> {
  if (val === null || val === undefined) {
    return val;
  }

  if (isLocalizedText(val)) {
    const targetText = val[locale] || "";
    if (typeof targetText === "string" && targetText.trim()) {
      // Already has a localized value saved — use it directly
      return targetText;
    }
    // Fall back: translate from English
    const enText = val.en || "";
    if (typeof enText === "string" && enText.trim()) {
      return await translateText(enText, locale);
    }
    return "";
  }

  if (Array.isArray(val)) {
    return await Promise.all(val.map((item) => localizeValue(item, locale)));
  }

  if (typeof val === "object") {
    // If it's a Mongo Document or similar that has a toJSON or toObject, call it
    const rawObj = typeof (val as any).toObject === "function" ? (val as any).toObject() : val;
    const result: any = {};
    for (const key of Object.keys(rawObj)) {
      result[key] = await localizeValue(rawObj[key], locale);
    }
    return result;
  }

  return val;
}

export async function localizeObject<T>(obj: T, locale: string): Promise<T> {
  if (!obj) return obj;
  return await localizeValue(obj, locale);
}
