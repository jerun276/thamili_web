import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
  const t = await getTranslations("notifications");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
        {notifications && notifications.length > 0 && (
          <Button variant="ghost" size="sm">
            {t("markAllRead")}
          </Button>
        )}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="mt-6 space-y-3">
          {notifications.map((notif: any) => (
            <Card key={notif.id} className={notif.read ? "opacity-60" : ""}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Bell className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{notif.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notif.body}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t("empty")}</p>
          <p className="text-gray-500">{t("emptySubtitle")}</p>
        </div>
      )}
    </div>
  );
}
