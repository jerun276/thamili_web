import { DeliverySidebar } from "@/components/delivery/sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DeliverySidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader role="delivery" />
        <main className="flex-1 bg-gray-50 p-6 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
