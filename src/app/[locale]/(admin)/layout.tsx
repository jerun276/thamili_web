import { AdminSidebar } from "@/components/admin/sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader role="admin" />
        <main className="flex-1 bg-gray-50 p-6 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
