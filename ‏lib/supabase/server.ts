import {
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";

import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },

        set(
          name: string,
          value: string,
          options: CookieOptions
        ) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
            });
          } catch {
            // Server Components cannot always modify cookies.
          }
        },

        remove(
          name: string,
          options: CookieOptions
        ) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
            });
          } catch {
            // Server Components cannot always modify cookies.
          }
        },
      },
    }
  );
}
