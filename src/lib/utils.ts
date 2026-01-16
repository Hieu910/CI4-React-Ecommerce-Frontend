import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Variant } from "@/data/mockData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const groupVariantsByColor = (
  variants: Variant[]
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
