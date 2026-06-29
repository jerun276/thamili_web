import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/product-card";
import { getTranslations } from "next-intl/server";
import type { Product } from "@/types";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const t = await getTranslations("products");
  const params = await searchParams;

  const supabase = await createClient();
  let query = supabase.from("products").select("*").eq("active", true);

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  switch (params.sort) {
    case "price_asc":
      query = query.order("price_germany", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_germany", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const page = parseInt(params.page || "1");
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data: products, error } = await query;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <FilterLink href="/products" label={t("allCategories")} active={!params.category || params.category === "all"} />
        <FilterLink href="/products?category=fresh" label={t("fresh")} active={params.category === "fresh"} />
        <FilterLink href="/products?category=frozen" label={t("frozen")} active={params.category === "frozen"} />
      </div>

      {/* Product Grid */}
      {products && products.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {error ? "Failed to load products. Please check your Supabase connection." : "No products found."}
          </p>
        </div>
      )}
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-green-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {label}
    </a>
  );
}
