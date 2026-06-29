import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const t = await getTranslations("admin");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("settings")}
      </h1>

      <div className="mt-6 grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">App Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your application settings, business hours, and delivery fee defaults.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
