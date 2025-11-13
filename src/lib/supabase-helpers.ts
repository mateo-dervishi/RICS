/**
 * Simplified Supabase helpers that work without authentication
 * All database operations use a generated user ID stored in localStorage
 */

import { getUserId } from "./user-context";
import { createBrowserSupabaseClient } from "./supabase/browser";

/**
 * Get Supabase client and user ID for database operations
 * Falls back gracefully if Supabase is not configured
 */
export async function getSupabaseWithUserId() {
  const supabase = createBrowserSupabaseClient();
  const userId = getUserId();
  return { supabase, userId };
}

/**
 * Execute a database operation with error handling
 * Returns null if Supabase is not available
 */
export async function executeDbOperation<T>(
  operation: (supabase: any, userId: string) => Promise<T>
): Promise<T | null> {
  try {
    const { supabase, userId } = await getSupabaseWithUserId();
    return await operation(supabase, userId);
  } catch (error) {
    console.log("Database operation failed (Supabase may not be configured):", error);
    return null;
  }
}

