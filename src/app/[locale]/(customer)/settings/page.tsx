import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Link } from "@/i18n/config";

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      <div className="mt-6 space-y-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{t("language")}</p>
              <p className="text-sm text-gray-500">Choose your preferred language</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/settings"
                locale="en"
                className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700"
              >
                English
              </Link>
              <Link
                href="/settings"
                locale="ta"
                className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700"
              >
                தமிழ்
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{t("theme")}</p>
              <p className="text-sm text-gray-500">Toggle dark or light mode</p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{t("country")}</p>
              <p className="text-sm text-gray-500">Affects pricing and stock display</p>
            </div>
            <p className="text-sm text-gray-500">Set via country selector in navbar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
