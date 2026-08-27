import { createBrowserClient } from "@supabase/ssr";

// Used inside client components ("use client"). Safe to expose —
// relies on Row Level Security to restrict what each user can see.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
