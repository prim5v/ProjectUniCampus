import { twMerge } from "tailwind-merge";

type ClassValue = string | number | null | false | undefined | ClassValue[];

function flatten(input: ClassValue): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.flatMap(flatten);
  return [String(input)];
}

/**
 * Compose Tailwind class names, resolving conflicts intelligently.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(inputs.flatMap(flatten).join(" "));
}