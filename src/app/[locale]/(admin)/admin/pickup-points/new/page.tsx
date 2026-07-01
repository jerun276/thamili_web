"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPickerMap } from "@/components/shared/location-picker-map";
import { createPickupPointAction } from "@/actions/pickup-points";
import { useRouter } from "@/i18n/config";
import { Loader2 } from "lucide-react";

export default function NewPickupPointPage() {
  const router = useRouter();
  const [country, setCountry] = useState<"germany" | "denmark">("germany");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    if (latitude) formData.set("latitude", latitude.toString());
    if (longitude) formData.set("longitude", longitude.toString());

    const result = await createPickupPointAction(formData);
    if (result.success) {
      router.push("/admin/pickup-points");
    } else {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add Pickup Point
      </h1>

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="e.g. Berlin Central" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" required placeholder="e.g. Alexanderplatz 1, Berlin" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value as "germany" | "denmark")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="germany">Germany</option>
                <option value="denmark">Denmark</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Location (click map to set pin)</Label>
              <LocationPickerMap
                country={country}
                latitude={latitude}
                longitude={longitude}
                onLocationChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="latitude" className="text-xs text-gray-500">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={latitude ?? ""}
                    onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Auto-filled from map"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="longitude" className="text-xs text-gray-500">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={longitude ?? ""}
                    onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Auto-filled from map"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_fee">Delivery Fee (€)</Label>
              <Input id="delivery_fee" name="delivery_fee" type="number" step="0.01" required placeholder="e.g. 3.50" />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="active"
                  value="true"
                  defaultChecked
                  className="text-green-600"
                />
                Active
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Pickup Point
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
