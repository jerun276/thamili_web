import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditProductClient } from "./edit-client";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return <EditProductClient product={product} />;
}
