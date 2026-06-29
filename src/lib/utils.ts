import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, country: "germany" | "denmark"): string {
  const locale = country === "germany" ? "de-DE" : "da-DK";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export function formatDate(date: string, locale: string = "en"): string {
  return new Intl.DateTimeFormat(locale === "ta" ? "ta-IN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getProductPrice(
  product: { price_germany: number; price_denmark: number },
  country: "germany" | "denmark"
): number {
  return country === "germany" ? product.price_germany : product.price_denmark;
}

export function getProductStock(
  product: { stock_germany: number; stock_denmark: number },
  country: "germany" | "denmark"
): number {
  return country === "germany" ? product.stock_germany : product.stock_denmark;
}
