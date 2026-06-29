export const APP_NAME = "Thamili";
export const APP_DESCRIPTION = "Fresh Fish & Vegetables delivered to your doorstep";

export const ITEMS_PER_PAGE = 20;

export const ORDER_STATUS_FLOW = [
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
] as const;

export const COUNTRIES = [
  { value: "germany", label: "Germany", flag: "🇩🇪" },
  { value: "denmark", label: "Denmark", flag: "🇩🇰" },
] as const;

export const CATEGORIES = [
  { value: "fresh", label: "Fresh" },
  { value: "frozen", label: "Frozen" },
] as const;
