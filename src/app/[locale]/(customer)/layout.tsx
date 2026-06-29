import { Navbar } from "@/components/storefront/navbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
    </div>
  );
}
