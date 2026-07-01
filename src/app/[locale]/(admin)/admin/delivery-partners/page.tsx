import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "@/i18n/config";
import { removeDeliveryPartnerAction } from "@/actions/delivery-partners";

export default async function AdminDeliveryPartnersPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data: partners } = await supabase
    .from("users")
    .select("*")
    .eq("role", "delivery_partner")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("deliveryPartners")}
        </h1>
        <Button asChild>
          <Link href="/admin/delivery-partners/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Joined</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners?.map((partner: any) => (
                  <tr
                    key={partner.id}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {partner.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {partner.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {partner.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(partner.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={async () => { "use server"; await removeDeliveryPartnerAction(partner.id); }}>
                        <Button type="submit" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!partners || partners.length === 0) && (
              <p className="p-8 text-center text-gray-500">No delivery partners found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
