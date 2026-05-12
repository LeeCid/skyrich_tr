/**
 * Display label mappers for Turkish localization
 * 
 * These functions convert internal English values to Turkish display labels
 * while keeping internal database/API values unchanged.
 */

/**
 * Maps battery type to Turkish display label
 */
export function productTypeLabel(value: string | null | undefined): string {
  if (!value) return "Doğrulanacak";
  
  const typeMap: Record<string, string> = {
    "Motorcycle": "Motosiklet / Powersport",
    "ATV": "ATV",
    "UTV": "UTV",
    "JetSki": "Jet-Ski",
    "Snowmobile": "Kar Motoru",
    "Personal Watercraft": "Kişisel Su Aracı",
  };
  
  return typeMap[value] || value;
}

/**
 * Maps battery technology to Turkish display label
 */
export function technologyLabel(value: string | null | undefined): string {
  if (!value) return "Doğrulanacak";
  
  const techMap: Record<string, string> = {
    "Lithium": "Lityum",
    "Li-ion": "Lityum İyon",
    "LiFePO4": "Lityum Demir Fosfat",
    "LFP": "LFP",
    "Lead Acid": "Kurşun Asit",
    "AGM": "AGM",
    "Gel": "Jel",
  };
  
  return techMap[value] || value;
}

/**
 * Maps source status to Turkish display label
 */
export function sourceStatusLabel(value: string | null | undefined): string {
  if (!value) return "Doğrulanacak";
  
  const statusMap: Record<string, string> = {
    "official_high": "Resmi Kaynak",
    "official_partial": "Kısmi Resmi Kaynak",
    "official_conflict": "Resmi Kaynak Varyantı",
    "official_family_conflict": "Aile Kaynağı / Doğrulama Gerekli",
    "secondary_verified_manual_review": "İkincil Kaynak / Manuel Doğrulama",
    "official_partial_secondary_specs": "Kısmi Resmi + İkincil Kaynak",
    "missing": "Doğrulanacak",
  };
  
  return statusMap[value] || value;
}

/**
 * Maps confidence level to Turkish display label
 */
export function confidenceLabel(value: string | null | undefined): string {
  if (!value) return "Doğrulanacak";
  
  const confidenceMap: Record<string, string> = {
    "high": "Yüksek",
    "medium": "Orta",
    "low": "Düşük",
    "manual_review": "Manuel Doğrulama Gerekli",
    "unknown": "Doğrulanacak",
  };
  
  return confidenceMap[value] || value;
}

/**
 * Maps source type to Turkish display label
 */
export function sourceTypeLabel(value: string | null | undefined): string {
  if (!value) return "Doğrulanacak";
  
  const typeMap: Record<string, string> = {
    "official_skyrich": "Resmi Skyrich Kaynağı",
    "official_oem": "Resmi OEM Kaynağı",
    "dealer_secondary": "Bayi / İkincil Kaynak",
    "marketplace_secondary": "Pazaryeri / İkincil Kaynak",
    "manual": "Manuel Veri",
    "unknown": "Doğrulanacak",
  };
  
  return typeMap[value] || value;
}

/**
 * Formats spec value with unit, handling null/undefined cases
 * Never renders "DoğrulanacakV", "DoğrulanacakAh", "-V", "-Ah"
 */
export function formatSpec(value: number | null | undefined, unit?: string): string {
  if (value == null || value === 0 || value === undefined) {
    return "Doğrulanacak";
  }
  return unit ? `${value}${unit}` : value.toString();
}

/**
 * Formats charge current with proper Turkish label
 */
export function formatChargeCurrent(value: string | null | undefined): string {
  if (!value) return "Doğrulanacak";
  return value;
}
