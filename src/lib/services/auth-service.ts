import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAuth, clearAuthCookies } from "@/lib/supabase/auth";

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUp = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => credentialsSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAuth();
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return {
      user: result.user
        ? { id: result.user.id, email: result.user.email ?? "" }
        : null,
      requiresEmailConfirmation: !result.session,
    };
  });

export const signIn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => credentialsSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAuth();
    const { data: result, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return {
      user: { id: result.user.id, email: result.user.email ?? "" },
    };
  });

export const signOut = createServerFn({ method: "POST" })
  .validator((data: undefined) => data)
  .handler(async () => {
    const supabase = getSupabaseAuth();
    await supabase.auth.signOut();
    clearAuthCookies();
    return { ok: true };
  });

export const getSession = createServerFn({ method: "GET" })
  .validator((data: undefined) => data)
  .handler(async () => {
    const supabase = getSupabaseAuth();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return { user: null };
    return { user: { id: user.id, email: user.email ?? "" } };
  });