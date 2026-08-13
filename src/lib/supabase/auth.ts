"use server";

import { createServerClient } from "@supabase/ssr";
import { getRequest, setCookie, deleteCookie } from "@tanstack/react-start/server";

/**
 * Server-only Supabase client bound to the current request's h3 event.
 * Reads auth cookies from the incoming request and writes Set-Cookie headers
 * on the response via TanStack Start's helpers, so sessions survive SSR +
 * server-function round trips.
 */
export function getSupabaseAuth() {
  const request = getRequest();
  return createServerClient(
    process.env["SUPABASE_URL"] ?? "",
    process.env["SUPABASE_ANON_KEY"] ?? "",
    {
      cookies: {
        getAll() {
          const header = request.headers.get("cookie");
          if (!header) return [];
          return header.split(";").reduce<Array<{ name: string; value: string }>>(
            (acc, part) => {
              const eq = part.indexOf("=");
              if (eq === -1) return acc;
              const name = part.slice(0, eq).trim();
              const value = part.slice(eq + 1).trim();
              if (name) acc.push({ name, value });
              return acc;
            },
            [],
          );
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => setCookie(name, value, options));
        },
      },
    },
  );
}

export function clearAuthCookies() {
  const request = getRequest();
  const header = request.headers.get("cookie") ?? "";
  header.split(";").forEach((part) => {
    const name = part.trim().split("=")[0];
    if (!name) return;
    deleteCookie(name);
  });
}
