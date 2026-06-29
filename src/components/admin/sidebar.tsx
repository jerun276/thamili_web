"use client";

import { Link, usePathname } from "@/i18n/config";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MapPin,
  Truck,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/admin/products", icon: Package, labelKey: "products" },
  { href: "/admin/orders", icon: ShoppingBag, labelKey: "orders" },
  { href: "/admin/pickup-points", icon: MapPin, labelKey: "pickupPoints" },
  { href: "/admin/delivery-partners", icon: Truck, labelKey: "deliveryPartners" },
  { href: "/admin/notifications", icon: Bell, labelKey: "notifications" },
  { href: "/admin/settings", icon: Settings, labelKey: "settings" },
];

export function AdminSidebar() {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
        {!collapsed && (
          <Image src="/logo.png" alt="Thamili" width={100} height={32} className="h-8 w-auto" unoptimized />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
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
              title={collapsed ? t(item.labelKey) : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
