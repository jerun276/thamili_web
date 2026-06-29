"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendNotificationAction } from "@/actions/notifications";
import { useActionState } from "react";

export default function AdminNotificationsPage() {
  const t = useTranslations("admin");

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean; sent?: number } | null, formData: FormData) => {
      return await sendNotificationAction(formData);
    },
    null
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("notifications")}
      </h1>

      <Card className="mt-6 max-w-2xl">
        <CardHeader>
          <CardTitle>{t("sendNotification")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
                Notification sent to {state.sent} user(s)
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">{t("notificationTitle")}</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">{t("notificationBody")}</Label>
              <textarea
                id="body"
                name="body"
                rows={3}
                required
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">User ID (leave empty for broadcast)</Label>
              <Input id="userId" name="userId" placeholder="Optional - specific user ID" />
            </div>

            <input type="hidden" name="broadcast" value="true" />

            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Sending..." : t("broadcast")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
