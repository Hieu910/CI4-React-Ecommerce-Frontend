import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Variant } from "@/data/mockData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const groupVariantsByColor = (
  variants: Variant[],
): { [key: string]: Variant[] } => {
  if (!variants || !Array.isArray(variants)) return {};

  return variants.reduce((acc, variant) => {
    const color = variant.color;

    if (!acc[color]) {
      acc[color] = [];
    }

    acc[color].push(variant);
    return acc;
  }, {});
};

export const shouldRetry = (error: any): boolean => {
  // Retry on timeout
  if (error.code === "ECONNABORTED") return true;

  // Retry on network errors
  if (!error.response) return true;

  // Retry on 5xx server errors
  if (error.response?.status >= 500) return true;

  return false;
};
