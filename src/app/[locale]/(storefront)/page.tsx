import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/config";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Fish, Truck, Shield, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/product-card";
import type { Product } from "@/types";

export default async function HomePage() {
  const t = await getTranslations("home");
  const supabase = await createClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src="/assets/fish-with-veg.png"
            alt="Fresh fish and vegetables"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center bg-gradient-to-r from-white/95 via-white/80 to-transparent px-8 py-16 sm:px-12 lg:py-20">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Fresh Fish &<br />
                <span className="text-green-700">Vegetables</span>
              </h1>
              <p className="mt-6 text-base text-gray-600">
                Handpicked quality. Delivered fresh to<br />
                your doorstep in Germany and Denmark.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="rounded-full bg-green-700 px-8 hover:bg-green-800 text-white">
                  <Link href="/products">
                    Shop All Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-green-700" />
                  Fresh & Quality
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-green-700" />
                  Fast Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-green-700" />
                  Secure Payment
                </span>
              </div>
            </div>
            <div className="hidden lg:block lg:min-h-[400px]" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("shopByCategory")}
          </h2>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/products">
              View All Categories
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link href="/products?category=fresh">
            <div className="group relative flex h-44 items-start overflow-hidden rounded-2xl transition-shadow hover:shadow-lg">
              <Image
                src="/assets/vegitables.jpg"
                alt="Fresh vegetables"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="relative z-10 flex h-full flex-col justify-between bg-gradient-to-r from-white/90 via-white/70 to-transparent p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Fresh</h3>
                    <p className="text-sm text-gray-600">Fresh vegetables and greens</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link href="/products?category=frozen">
            <div className="group relative flex h-44 items-start overflow-hidden rounded-2xl transition-shadow hover:shadow-lg">
              <Image
                src="/assets/fishes.jpg"
                alt="Frozen fish and seafood"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="relative z-10 flex h-full flex-col justify-between bg-gradient-to-r from-white/90 via-white/70 to-transparent p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <Fish className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Frozen</h3>
                    <p className="text-sm text-gray-600">Frozen fish and seafood</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("featuredProducts")}
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(featuredProducts as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            No products available yet.
          </p>
        )}
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-100 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-800">100% Fresh</p>
                <p className="text-xs text-gray-500">Quality you can trust</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-800">Fast Delivery</p>
                <p className="text-xs text-gray-500">Quick & reliable</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-800">Secure Payment</p>
                <p className="text-xs text-gray-500">Safe & protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-800">Easy Returns</p>
                <p className="text-xs text-gray-500">Hassle free returns</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
