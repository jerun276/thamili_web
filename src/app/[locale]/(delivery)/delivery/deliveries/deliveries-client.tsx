"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateDeliveryStatusAction } from "@/actions/delivery";
import { MapPin, Phone, Package } from "lucide-react";

interface DeliveriesClientProps {
  deliveries: any[];
}

export function DeliveriesClient({ deliveries }: DeliveriesClientProps) {
  const t = useTranslations("delivery");
  const [activeTab, setActiveTab] = useState<string>("confirmed");

  const tabs = [
    { key: "confirmed", label: t("assigned") },
    { key: "out_for_delivery", label: t("inTransit") },
    { key: "delivered", label: t("delivered") },
  ];

  const filtered = deliveries.filter((d) => d.status === activeTab);

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label} ({deliveries.filter((d) => d.status === tab.key).length})
          </button>
        ))}
      </div>

      {/* Delivery Cards */}
      <div className="mt-4 space-y-4">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No deliveries in this category</p>
        ) : (
          filtered.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))
        )}
      </div>
    </div>
  );
}

function DeliveryCard({ delivery }: { delivery: any }) {
  const t = useTranslations("delivery");
  const [updating, setUpdating] = useState(false);

  const nextStatus =
    delivery.status === "confirmed" ? "out_for_delivery" :
    delivery.status === "out_for_delivery" ? "delivered" : null;

  const nextLabel =
    delivery.status === "confirmed" ? t("startDelivery") :
    delivery.status === "out_for_delivery" ? t("markDelivered") : null;

  async function handleStatusUpdate() {
    if (!nextStatus) return;
    setUpdating(true);
    await updateDeliveryStatusAction(delivery.id, nextStatus);
    setUpdating(false);
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-gray-500">
              Order #{delivery.id.slice(0, 8)}
            </p>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {delivery.users?.name || "Unknown Customer"}
            </p>
          </div>
          <Badge variant={delivery.status === "delivered" ? "default" : "warning"}>
            {delivery.status.replace(/_/g, " ")}
          </Badge>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {delivery.order_items?.length || 0} items
          </span>
          {delivery.delivery_address && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {delivery.delivery_address.slice(0, 30)}...
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {delivery.users?.phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${delivery.users.phone}`}>
                <Phone className="mr-1 h-3 w-3" />
                {t("callCustomer")}
              </a>
            </Button>
          )}
          {nextLabel && (
            <Button
              size="sm"
              onClick={handleStatusUpdate}
              disabled={updating}
              className="ml-auto"
            >
              {updating ? "..." : nextLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
