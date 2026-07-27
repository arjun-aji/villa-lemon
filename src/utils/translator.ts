export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || !targetLang || targetLang === "en") return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 } // Cache the translation for 1 day in Next.js
    });
    if (!res.ok) return text;
    const json = await res.json();
    if (json && json[0]) {
      return json[0].map((item: any) => item[0]).join("") || text;
    }
    return text;
  } catch (err) {
    console.error(`[translation failed] ${text} -> ${targetLang}:`, err);
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
      return targetText;
    }
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
    const rawObj = typeof val.toObject === "function" ? val.toObject() : val;
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
