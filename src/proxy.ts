import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames and ignore static assets
  matcher: ["/", "/(en|de|fr|ru)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
