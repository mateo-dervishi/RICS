/**
 * Helper functions for user operations without authentication
 */

import { getUserId } from "./user-context";
import { createBrowserSupabaseClient } from "./supabase/browser";

/**
 * Get current user ID (generates one if doesn't exist)
 */
export async function getCurrentUserId(): Promise<string> {
  return getUserId();
}

/**
 * Get Supabase client and user ID for database operations
 */
export async function getSupabaseWithUserId() {
  const supabase = createBrowserSupabaseClient();
  const userId = getUserId();
  return { supabase, userId };
}

