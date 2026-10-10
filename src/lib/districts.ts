/** Splits a comma-separated string into a trimmed list; passes arrays through. */
function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string")
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

/** Normalises legacy district records (string popularPlaces, comma-separated keywords). */
export function normalizeDistrict<T extends Record<string, any>>(district: T): T {
  return {
    ...district,
    seoKeywords: toList(district.seoKeywords),
    popularPlaces: (district.popularPlaces || []).map((place: any) =>
      typeof place === "string"
        ? { name: place, description: "", images: [], keywords: [] }
        : { ...place, keywords: toList(place.keywords) }
    ),
  };
}
