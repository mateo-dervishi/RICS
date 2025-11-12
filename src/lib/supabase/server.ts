import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const fallbackUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const fallbackKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key";

export function createServerSupabaseClient() {
  return createServerComponentClient(
    { cookies },
    {
      supabaseUrl: fallbackUrl,
      supabaseKey: fallbackKey
    }
  );
}
