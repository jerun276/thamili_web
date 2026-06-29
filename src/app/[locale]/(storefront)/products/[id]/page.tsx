import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Product } from "@/types";
import type { Metadata } from "next";
import { ProductDetailClient } from "./product-detail-client";

interface ProductDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at Thamili`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at Thamili`,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .eq("active", true)
    .neq("id", id)
    .limit(4);

  return (
    <ProductDetailClient
      product={product as Product}
      relatedProducts={(relatedProducts as Product[]) || []}
    />
  );
}
