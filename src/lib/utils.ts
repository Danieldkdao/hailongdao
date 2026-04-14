import { clsx, type ClassValue } from "clsx";
import { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errorBorder = (error?: FieldError) =>
  error && "border-destructive";

export const formatNumberTruncate = (num: number) => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export const formatDate = (value: Date | null | undefined) => {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
};

export const formatDateOnly = (value: Date | null | undefined) => {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(value);
};
