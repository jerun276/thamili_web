import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/config";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = ["/(storefront)", "/products", "/categories", "/cart"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const ADMIN_ROUTES = ["/dashboard", "/products", "/orders", "/pickup-points", "/delivery-partners", "/notifications", "/settings"];
const DELIVERY_ROUTES = ["/dashboard", "/deliveries", "/van-sales"];

function getRouteGroup(pathname: string): string | null {
  const pathWithoutLocale = pathname.replace(/^\/(en|ta)/, "");

  if (AUTH_ROUTES.some((r) => pathWithoutLocale.startsWith(r))) return "auth";
  if (pathWithoutLocale.startsWith("/checkout") ||
      pathWithoutLocale.startsWith("/orders") ||
      pathWithoutLocale.startsWith("/profile") ||
      pathWithoutLocale.startsWith("/addresses") ||
      pathWithoutLocale.startsWith("/notifications") ||
      pathWithoutLocale.startsWith("/settings")) return "customer";

  // Check admin routes (prefixed with /admin)
  if (pathWithoutLocale.startsWith("/admin")) return "admin";

  // Check delivery routes (prefixed with /delivery)
  if (pathWithoutLocale.startsWith("/delivery")) return "delivery";

  return "storefront";
}

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const nextResponse = response instanceof NextResponse ? response : NextResponse.next();

  const { user } = await updateSession(request, nextResponse);
  const routeGroup = getRouteGroup(request.nextUrl.pathname);

  if (routeGroup === "auth" && user) {
    const locale = request.nextUrl.pathname.match(/^\/(en|ta)/)?.[1] || "en";
    // Redirect logged-in users away from auth pages
    const { data } = await getUserRole(request, nextResponse);
    const role = data?.role || "customer";
    const redirectPath = role === "admin" ? `/${locale}/admin/dashboard` :
                         role === "delivery_partner" ? `/${locale}/delivery/dashboard` :
                         `/${locale}/products`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (routeGroup === "customer" && !user) {
    const locale = request.nextUrl.pathname.match(/^\/(en|ta)/)?.[1] || "en";
    const redirectUrl = new URL(`/${locale}/login`, request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (routeGroup === "admin") {
    if (!user) {
      const locale = request.nextUrl.pathname.match(/^\/(en|ta)/)?.[1] || "en";
      const redirectUrl = new URL(`/${locale}/login`, request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    const { data } = await getUserRole(request, nextResponse);
    if (data?.role !== "admin") {
      const locale = request.nextUrl.pathname.match(/^\/(en|ta)/)?.[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/products`, request.url));
    }
  }

  if (routeGroup === "delivery") {
    if (!user) {
      const locale = request.nextUrl.pathname.match(/^\/(en|ta)/)?.[1] || "en";
      const redirectUrl = new URL(`/${locale}/login`, request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    const { data } = await getUserRole(request, nextResponse);
    if (data?.role !== "delivery_partner") {
      const locale = request.nextUrl.pathname.match(/^\/(en|ta)/)?.[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/products`, request.url));
    }
  }

  return nextResponse;
}

async function getUserRole(request: NextRequest, response: NextResponse) {
  const { supabase, user } = await updateSession(request, response);
  if (!user) return { data: null };

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return { data };
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|icons|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|woff|woff2|ttf|eot)$).*)"],
};
