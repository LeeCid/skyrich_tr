export function safeMap<T, R>(
  input: unknown,
  mapper: (item: T, index: number) => R
): R[] {
  return Array.isArray(input) ? input.map(mapper) : [];
}

export function safeFilter<T>(
  input: unknown,
  predicate: (item: T, index: number) => boolean
): T[] {
  return Array.isArray(input) ? input.filter(predicate) : [];
}

export function safeFind<T>(
  input: unknown,
  predicate: (item: T, index: number) => boolean
): T | undefined {
  return Array.isArray(input) ? input.find(predicate) : undefined;
}
