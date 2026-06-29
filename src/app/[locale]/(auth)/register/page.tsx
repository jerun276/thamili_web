"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/config";
import { registerAction } from "@/actions/auth";
import { useActionState } from "react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await registerAction(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("registerTitle")}</CardTitle>
        <CardDescription>{t("registerSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" name="name" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input id="username" name="username" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" name="password" type="password" required minLength={6} />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "..." : t("signUp")}
          </Button>

          <div className="text-center text-sm text-gray-500">
            {t("hasAccount")}{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              {t("signIn")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
