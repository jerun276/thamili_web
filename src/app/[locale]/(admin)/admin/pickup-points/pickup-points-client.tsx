"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/config";
import { PickupPointMap } from "@/components/shared/pickup-point-map";
import { useTranslations } from "next-intl";
import type { PickupPoint } from "@/types";

interface PickupPointsClientProps {
  pickupPoints: PickupPoint[];
}

export function PickupPointsClient({ pickupPoints }: PickupPointsClientProps) {
  const t = useTranslations("admin");
  const [countryFilter, setCountryFilter] = useState<"germany" | "denmark">("germany");

  const filtered = pickupPoints.filter((p) => p.country === countryFilter);

  return (
    <div className="mt-6 space-y-6">
      {/* Country Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setCountryFilter("germany")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            countryFilter === "germany" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Germany
        </button>
        <button
          onClick={() => setCountryFilter("denmark")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            countryFilter === "denmark" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Denmark
        </button>
      </div>

      {/* Map */}
      <PickupPointMap
        points={filtered}
        country={countryFilter}
        height="350px"
      />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Address</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("deliveryFee")}</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((point) => (
                  <tr
                    key={point.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{point.name}</td>
                    <td className="px-4 py-3 text-gray-600">{point.address}</td>
                    <td className="px-4 py-3 text-right">€{point.delivery_fee.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={point.active ? "default" : "secondary"}>
                        {point.active ? t("active") : t("inactive")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/pickup-points/${point.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="p-8 text-center text-gray-500">No pickup points in {countryFilter}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
