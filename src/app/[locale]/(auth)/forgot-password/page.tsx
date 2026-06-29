"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/config";
import { forgotPasswordAction } from "@/actions/auth";
import { useActionState } from "react";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await forgotPasswordAction(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("resetPassword")}</CardTitle>
        <CardDescription>{t("resetPasswordSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {state?.success ? (
          <div className="text-center">
            <p className="text-sm text-green-600 dark:text-green-400">
              Check your email for a password reset link.
            </p>
            <Button asChild variant="ghost" className="mt-4">
              <Link href="/login">{t("signIn")}</Link>
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="username@thamili.app"
              />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "..." : t("resetPassword")}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <Link href="/login" className="text-green-600 hover:underline">
                {t("signIn")}
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
