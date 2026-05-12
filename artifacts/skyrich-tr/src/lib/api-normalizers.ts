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
  }

  return [];
}

export function isNonEmptyArray<T>(input: unknown): input is T[] {
  return Array.isArray(input) && input.length > 0;
}
