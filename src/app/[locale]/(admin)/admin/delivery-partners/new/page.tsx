import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function NewDeliveryPartnerPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const username = formData.get("username") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const email = `${username}@thamili.app`;

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return;
    }

    await supabase.from("users").update({
      name,
      username,
      phone,
      role: "delivery_partner",
    }).eq("id", authData.user.id);

    revalidatePath("/admin/delivery-partners");
    redirect("/admin/delivery-partners");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Add Delivery Partner
      </h1>

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="e.g. John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" required placeholder="e.g. johndoe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="e.g. +49 123 456789" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} placeholder="Minimum 6 characters" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Create Partner</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
