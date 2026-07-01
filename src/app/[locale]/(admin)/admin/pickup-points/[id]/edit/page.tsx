import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditPickupPointClient } from "./edit-client";

interface EditPickupPointPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPickupPointPage({ params }: EditPickupPointPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: point } = await supabase
    .from("pickup_points")
    .select("*")
    .eq("id", id)
    .single();

  if (!point) notFound();

  return <EditPickupPointClient point={point} />;
}
