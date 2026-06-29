"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    price_germany: number;
    price_denmark: number;
    stock_germany: number;
    stock_denmark: number;
    active: boolean;
    image_url: string | null;
    sell_type: string | null;
    unit: string | null;
    pack_size_grams: number | null;
  };
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

export function ProductForm({ mode, product, onSubmit }: ProductFormProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      setError(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setImageUrl(urlData.publicUrl);
    setUploading(false);
  }

  function removeImage() {
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("image_url", imageUrl || "");
    const result = await onSubmit(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/admin/products");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">{t("productName")}</Label>
        <Input id="name" name="name" required defaultValue={product?.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description || ""}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">{t("category")}</Label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category || "fresh"}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="fresh">Fresh</option>
            <option value="frozen">Frozen</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sell_type">Sell Type</Label>
          <select
            id="sell_type"
            name="sell_type"
            defaultValue={product?.sell_type || "loose"}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="loose">Loose</option>
            <option value="pack">Pack</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input id="unit" name="unit" defaultValue={product?.unit || "kg"} placeholder="kg, g, piece" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pack_size_grams">Pack Size (grams)</Label>
          <Input id="pack_size_grams" name="pack_size_grams" type="number" min="0" defaultValue={product?.pack_size_grams || ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price_germany">{t("priceGermany")} (€)</Label>
          <Input id="price_germany" name="price_germany" type="number" step="0.01" min="0" required defaultValue={product?.price_germany} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_denmark">{t("priceDenmark")} (€)</Label>
          <Input id="price_denmark" name="price_denmark" type="number" step="0.01" min="0" required defaultValue={product?.price_denmark} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock_germany">{t("stockGermany")}</Label>
          <Input id="stock_germany" name="stock_germany" type="number" min="0" required defaultValue={product?.stock_germany} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock_denmark">{t("stockDenmark")}</Label>
          <Input id="stock_denmark" name="stock_denmark" type="number" min="0" required defaultValue={product?.stock_denmark} />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Product Image</Label>
        {imageUrl ? (
          <div className="relative inline-block">
            <Image
              src={imageUrl}
              alt="Product"
              width={200}
              height={200}
              className="h-40 w-40 rounded-lg border object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-xs text-gray-500">
              {uploading ? "Uploading..." : "Click to upload"}
            </span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            value="true"
            defaultChecked={product?.active ?? true}
            className="h-4 w-4 rounded border-gray-300"
          />
          Active
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving..." : mode === "create" ? t("addProduct") : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
