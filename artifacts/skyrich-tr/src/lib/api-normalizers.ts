export function normalizeArrayResponse<T>(input: unknown): T[] {
  if (Array.isArray(input)) return input;

  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;

    if (Array.isArray(obj.value)) return obj.value as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.results)) return obj.results as T[];
    if (Array.isArray(obj.batteries)) return obj.batteries as T[];
    if (Array.isArray(obj.products)) return obj.products as T[];
    if (Array.isArray(obj.banners)) return obj.banners as T[];
    if (Array.isArray(obj.popups)) return obj.popups as T[];
    if (Array.isArray(obj.vehicleCompatibility)) return obj.vehicleCompatibility as T[];
    if (Array.isArray(obj.records)) return obj.records as T[];
  }

  return [];
}

export function isNonEmptyArray<T>(input: unknown): input is T[] {
  return Array.isArray(input) && input.length > 0;
}

export function asArray<T>(input: unknown): T[] {
  return Array.isArray(input) ? input : [];
}

export function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter((item): item is string => typeof item === "string");
}
