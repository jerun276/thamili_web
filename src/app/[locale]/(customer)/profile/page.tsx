import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {profile?.name || "User"}
              </p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" defaultValue={profile?.name || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" defaultValue={profile?.phone || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" defaultValue={profile?.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input id="username" defaultValue={profile?.username || ""} disabled />
            </div>

            <Button type="submit">{t("editProfile")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
