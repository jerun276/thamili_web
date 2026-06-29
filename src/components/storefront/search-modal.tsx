"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, getProductPrice } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price_germany: number;
  price_denmark: number;
  image_url: string | null;
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const country = useCartStore((s) => s.country);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("id, name, category, price_germany, price_denmark, image_url")
        .eq("active", true)
        .ilike("name", `%${query}%`)
        .limit(8);

      setResults(data || []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(productId: string) {
    onClose();
    router.push(`/products/${productId}`);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {query.length >= 2 && (
          <div className="mt-4 max-h-80 overflow-y-auto">
            {loading ? (
              <p className="py-4 text-center text-sm text-gray-500">Searching...</p>
            ) : results.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => handleSelect(product.id)}
                      className="flex w-full items-center gap-3 px-2 py-3 text-left hover:bg-gray-50 rounded-lg"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg text-gray-300">
                            🐟
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs capitalize text-gray-500">{product.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(
                          country === "germany" ? product.price_germany : product.price_denmark,
                          country
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">No products found</p>
            )}
          </div>
        )}

        {query.length < 2 && (
          <p className="mt-3 text-center text-xs text-gray-400">Type at least 2 characters to search</p>
        )}
      </div>
    </div>
  );
}
