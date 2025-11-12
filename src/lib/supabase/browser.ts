import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const fallbackUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const fallbackKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key";

export function createBrowserSupabaseClient() {
  return createClientComponentClient({
    supabaseUrl: fallbackUrl,
    supabaseKey: fallbackKey
  });
}
