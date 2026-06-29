"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/config";
import { loginAction } from "@/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "..." : t("signIn")}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <Link href="/forgot-password" className="text-green-600 hover:underline">
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-green-600 hover:underline">
              {t("signUp")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
