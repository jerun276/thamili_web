"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/config";
import Image from "next/image";
import { ShoppingCart, Menu, X, User, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SearchModal } from "./search-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCartStore } from "@/store/cart-store";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((s) => s.getItemCount());
  const country = useCartStore((s) => s.country);
  const setCountry = useCartStore((s) => s.setCountry);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single()
          .then(({ data: userData }) => {
            setUserRole(userData?.role || "customer");
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data: userData }) => {
            setUserRole(userData?.role || "customer");
          });
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    router.push("/login");
  }

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-green-700 text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            </svg>
            <span>Freshness delivered to your doorstep in Germany and Denmark</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setCountry("germany")}
              className={`flex items-center gap-1 text-xs font-medium transition-opacity ${country === "germany" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
            >
              <span className="inline-block w-5 h-3.5 bg-black relative overflow-hidden rounded-sm">
                <span className="absolute inset-x-0 top-0 h-1/3 bg-black" />
                <span className="absolute inset-x-0 top-1/3 h-1/3 bg-red-600" />
                <span className="absolute inset-x-0 bottom-0 h-1/3 bg-yellow-400" />
              </span>
              Germany
            </button>
            <button
              onClick={() => setCountry("denmark")}
              className={`flex items-center gap-1 text-xs font-medium transition-opacity ${country === "denmark" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
            >
              <span className="inline-block w-5 h-3.5 bg-red-600 relative overflow-hidden rounded-sm">
                <span className="absolute left-[28%] top-0 bottom-0 w-[12%] bg-white" />
                <span className="absolute top-[35%] left-0 right-0 h-[12%] bg-white" style={{ height: '30%', top: '35%' }} />
              </span>
              DENMARK
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Thamili" width={120} height={40} className="h-9 w-auto" priority unoptimized />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  pathname === link.href
                    ? "text-green-600"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label={t("cart")}>
                <ShoppingCart className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "delivery_partner" && (
                    <DropdownMenuItem asChild>
                      <Link href="/delivery/dashboard">Delivery Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t("orders")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t("profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">{t("settings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : mounted ? (
              <Link href="/login" className="hidden md:block">
                <Button variant="outline" size="sm">
                  {t("login")}
                </Button>
              </Link>
            ) : null}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden dark:border-gray-800 dark:bg-gray-950">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  {userRole === "admin" && (
                    <Link href="/admin/dashboard" className="text-sm font-medium text-green-600" onClick={() => setMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  {userRole === "delivery_partner" && (
                    <Link href="/delivery/dashboard" className="text-sm font-medium text-green-600" onClick={() => setMobileMenuOpen(false)}>
                      Delivery Dashboard
                    </Link>
                  )}
                  <Link href="/orders" className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                    {t("orders")}
                  </Link>
                  <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                    {t("profile")}
                  </Link>
                  <button
                    className="text-left text-sm font-medium text-red-600 hover:text-red-700"
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-green-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                  {t("login")}
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
