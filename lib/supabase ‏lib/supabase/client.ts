import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://dkfmhjgdqokxwcmlrwdv.supabase.co",
    "sb_publishable_kKXiaiPOHk-2QqzBbRT1tQ_xiqhdAxg"
  );
}
