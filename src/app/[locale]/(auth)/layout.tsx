import Image from "next/image";
import { Link } from "@/i18n/config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Image
        src="/assets/login-bg.jpg"
        alt=""
        fill
        className="object-cover blur-sm"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/20" />
      <Link href="/" className="absolute left-6 top-6 z-10 rounded-lg bg-white/90 px-3 py-2 shadow-md backdrop-blur-sm">
        <Image src="/logo.png" alt="Thamili" width={140} height={46} className="h-9 w-auto" style={{ width: "auto" }} unoptimized />
      </Link>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
