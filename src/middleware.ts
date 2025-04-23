import { type NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { Session } from "./lib/auth-client";

const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/pricing",
  "/contact",
  "/2fa",
  "/goodbye",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
];
const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Determine locale from URL
  const locale = nextUrl.pathname.startsWith("/fr") ? "fr" : "en";

  // Get the base URL for redirects
  const baseUrl =
    process.env.NEXT_PUBLIC_NODE === "development"
      ? process.env.NEXT_PUBLIC_FRONTEND_URL
      : process.env.NEXT_PUBLIC_FRONTEND_URL_PROD;

  // Use regex to detect URLs that are just a locale; e.g. '/en' or '/fr/'
  const isLocaleOnly = /^\/(?:en|fr)\/?$/.test(nextUrl.pathname);

  // Remove the locale segment so further checks work as intended
  const pathnameWithoutLocale =
    nextUrl.pathname.replace(/^\/(?:en|fr)/, "") || "/";

  const isPublicRoute = publicRoutes.includes(pathnameWithoutLocale);

  // Immediately skip API and static routes
  if (pathnameWithoutLocale.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Get session for all routes
  const { data: session } = await betterFetch<Session>(
    `${
      process.env.NEXT_PUBLIC_NODE === "development"
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : process.env.NEXT_PUBLIC_BACKEND_URL_PROD
    }/api/auth/get-session`,
    {
      baseURL: request.nextUrl.origin,
      headers: { cookie: request.headers.get("cookie") || "" },
    }
  );

  const isLoggedIn = !!session;

  // --- Begin new logic for locale-only path ---
  if (isLocaleOnly || isPublicRoute) {
    if (isLoggedIn) {
      // Authenticated users are not allowed to access just /en or /fr
      const dashboardUrl = new URL(`/dashboard`, baseUrl);
      return NextResponse.redirect(dashboardUrl);
    }
    // Unauthenticated users can access the locale root
    return intlMiddleware(request);
  }

  // For non-root paths:
  // If not logged in and not on a public route, redirect to login.
  if (!isLoggedIn && !isPublicRoute) {
    const signinUrl = new URL(`/signin`, baseUrl);
    signinUrl.searchParams.set(
      "callbackUrl",
      `/${locale}${pathnameWithoutLocale}`
    );
    return NextResponse.redirect(signinUrl);
  }

  // Default: apply internationalization
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
