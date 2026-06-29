"use client";

import { useCartStore } from "@/store/cart-store";
import { COUNTRIES } from "@/utils/constants";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Country } from "@/types";

export function CountrySelector() {
  const country = useCartStore((s) => s.country);
  const setCountry = useCartStore((s) => s.setCountry);
  const currentCountry = COUNTRIES.find((c) => c.value === country);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="inline-flex items-center gap-1.5">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">{currentCountry?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {COUNTRIES.map((c) => (
          <DropdownMenuItem
            key={c.value}
            onClick={() => setCountry(c.value as Country)}
            className="flex items-center gap-2"
          >
            <span className="inline-block w-6 text-xs font-semibold">{c.flag}</span>
            <span>{c.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
