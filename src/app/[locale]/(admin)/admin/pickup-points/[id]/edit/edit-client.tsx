"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPickerMap } from "@/components/shared/location-picker-map";
import { updatePickupPointAction } from "@/actions/pickup-points";
import { useRouter } from "@/i18n/config";
import { Loader2 } from "lucide-react";

interface EditPickupPointClientProps {
  point: any;
}

export function EditPickupPointClient({ point }: EditPickupPointClientProps) {
  const router = useRouter();
  const [country, setCountry] = useState<"germany" | "denmark">(point.country);
  const [latitude, setLatitude] = useState<number | null>(point.latitude);
  const [longitude, setLongitude] = useState<number | null>(point.longitude);
  const [active, setActive] = useState(point.active);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    if (latitude) formData.set("latitude", latitude.toString());
    if (longitude) formData.set("longitude", longitude.toString());
    formData.set("active", active ? "true" : "false");

    const result = await updatePickupPointAction(point.id, formData);
    if (result.success) {
      router.push("/admin/pickup-points");
    } else {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Edit Pickup Point
      </h1>

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={point.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={point.address} required />
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
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_fee">Delivery Fee (€)</Label>
              <Input id="delivery_fee" name="delivery_fee" type="number" step="0.01" defaultValue={point.delivery_fee} required />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="text-green-600"
                />
                Active
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
