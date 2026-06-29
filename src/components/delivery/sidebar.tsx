"use client";

import { Link, usePathname } from "@/i18n/config";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { LayoutDashboard, Truck, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/delivery/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/delivery/deliveries", icon: Truck, labelKey: "deliveries" },
  { href: "/delivery/van-sales", icon: ShoppingBag, labelKey: "vanSales" },
];

export function DeliverySidebar() {
  const t = useTranslations("delivery");
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-56 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4 dark:border-gray-800">
        <Image src="/logo.png" alt="Thamili" width={100} height={32} className="h-8 w-auto" unoptimized />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
