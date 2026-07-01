"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateOrderStatusAction, assignDeliveryPartnerAction } from "@/actions/orders";
import { useState } from "react";
import type { OrderStatus } from "@/types";

interface AdminOrdersClientProps {
  orders: any[];
  deliveryPartners: { id: string; name: string }[];
}

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "warning",
  confirmed: "default",
  out_for_delivery: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export function AdminOrdersClient({ orders, deliveryPartners }: AdminOrdersClientProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.status === filter);

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          All ({orders.length})
        </FilterButton>
        {STATUS_OPTIONS.map((status) => (
          <FilterButton
            key={status}
            active={filter === status}
            onClick={() => setFilter(status)}
          >
            {status.replace(/_/g, " ")} ({orders.filter((o) => o.status === status).length})
          </FilterButton>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="mt-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Order</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Payment</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    deliveryPartners={deliveryPartners}
                  />
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <p className="p-8 text-center text-gray-500">No orders found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderRow({
  order,
  deliveryPartners,
}: {
  order: any;
  deliveryPartners: { id: string; name: string }[];
}) {
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(newStatus: OrderStatus) {
    setUpdating(true);
    await updateOrderStatusAction(order.id, newStatus);
    setUpdating(false);
  }

  async function handleAssign(partnerId: string) {
    setUpdating(true);
    await assignDeliveryPartnerAction(order.id, partnerId);
    setUpdating(false);
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
      <td className="px-4 py-3">
        <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
        <span className="ml-2 text-xs text-gray-500">
          {order.order_items?.length || 0} items
        </span>
      </td>
      <td className="px-4 py-3">{order.users?.name || "Unknown"}</td>
      <td className="px-4 py-3">
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          disabled={updating || order.status === "cancelled" || order.status === "delivered"}
          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <Badge variant={order.payment_status === "paid" ? "default" : "warning"}>
          {order.payment_status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right font-medium">
        €{order.total_amount?.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-right">
        {order.status === "confirmed" && !order.delivery_schedule?.[0]?.delivery_partner_id && (
          <select
            onChange={(e) => handleAssign(e.target.value)}
            disabled={updating}
            defaultValue=""
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="" disabled>Assign driver</option>
            {deliveryPartners.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
        {order.delivery_schedule?.[0]?.delivery_partner_id && (
          <span className="text-xs text-green-600 font-medium">Assigned</span>
        )}
      </td>
    </tr>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
        active
          ? "bg-green-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}
