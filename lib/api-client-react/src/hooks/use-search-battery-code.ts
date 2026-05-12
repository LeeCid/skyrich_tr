import { useQuery } from "@tanstack/react-query";
import { customFetch } from "../custom-fetch";

export interface SearchBatteryCodeResult {
  battery: {
    id: number;
    modelCode: string;
    name: string;
    description: string | null;
    voltage: number | null;
    capacity: number | null;
    cca: number | null;
    type: string;
    technology: string;
    dimensions: string | null;
    weight: number | null;
    imageUrl: string | null;
    applications: string | null;
    active: boolean;
    featured: boolean;
    sortOrder: number;
    createdAt: string;
  };
}

export const searchBatteryCodeUrl = (code: string) => {
  return `/api/finder/search-code?code=${encodeURIComponent(code)}`;
};

export const searchBatteryCode = async (
  code: string,
  options?: RequestInit
): Promise<SearchBatteryCodeResult[]> => {
  return customFetch<SearchBatteryCodeResult[]>(searchBatteryCodeUrl(code), {
    ...options,
    method: "GET",
  });
};

export const useSearchBatteryCode = (
  code: string,
  options?: {
    enabled?: boolean;
    query?: {
      enabled?: boolean;
    };
  }
) => {
  const { enabled = !!code, query: queryOptions } = options ?? {};

  const queryKey = [`/api/finder/search-code`, code] as const;

  const queryFn = async () => {
    return searchBatteryCode(code);
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled && (queryOptions?.enabled !== false),
  });
};

export const getSearchBatteryCodeQueryKey = (code: string) => {
  return [`/api/finder/search-code`, code] as const;
};
