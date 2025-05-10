import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { authClient, Session } from "./lib/auth-client";
import { cookies, headers } from "next/headers";

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

  // Use regex to detect URLs that are just a locale; e.g. '/en' or '/fr/'
  const isLocaleOnly = /^\/(?:en|fr)\/?$/.test(nextUrl.pathname);
  // Check if current path (without locale) is a public route

  // Remove the locale segment so further checks work as intended
  const pathnameWithoutLocale =
    nextUrl.pathname.replace(/^\/(?:en|fr)/, "") || "/";

  const isPublicRoute = publicRoutes.includes(pathnameWithoutLocale);

  // Immediately skip API and static routes
  if (pathnameWithoutLocale.startsWith("/_next")) {
    return NextResponse.next();
  }

  const header = await headers();
  const cookie = await cookies();

  // Get session for all routes
  const { data: session } = await betterFetch<Session>(
    `${
      process.env.NEXT_PUBLIC_NODE === "development"
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : process.env.NEXT_PUBLIC_BACKEND_URL_PROD
    }/api/auth/get-session`,
    {
      headers: header,
      credentials: "include",
    }
  );

  // const { data: session } = await authClient.getSession({
  //   fetchOptions: {
  //     headers: header,
  //     cookie: cookie,
  //   },
  // });

  const isLoggedIn = !!session;

  // --- Begin new logic for locale-only path ---
  if (isLocaleOnly || isPublicRoute) {
    if (isLoggedIn) {
      // Authenticated users are not allowed to access just /en or /fr
      const dashboardUrl = `/${locale}/dashboard`;
      return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
    }
    // Unauthenticated users can access the locale root
    return intlMiddleware(request);
  }
  // --- End new logic for locale-only path ---

  // For non-root paths:
  // If not logged in and not on a public route, redirect to login.
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(
      new URL(
        `/signin?callbackUrl=${encodeURIComponent(pathnameWithoutLocale)}`,
        nextUrl
      )
    );
  }

  // Default: apply internationalization
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
