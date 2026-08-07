"use client";

import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env["SUPABASE_URL"] ?? "",
      process.env["SUPABASE_ANON_KEY"] ?? "",
    );
  }
  return browserClient;
}

export function isSupabaseConfigured() {
  return Boolean(process.env["SUPABASE_URL"] && process.env["SUPABASE_ANON_KEY"]);
}
