/**
 * Simplified Supabase client that works without authentication
 * Uses a local user ID for data operations
 */

import { createBrowserSupabaseClient } from "./supabase/browser";
import { getUserId } from "./user-context";

export async function getCurrentUserId(): Promise<string> {
  return getUserId();
}

export async function getSupabaseClient() {
  return createBrowserSupabaseClient();
}

// Helper to get user ID for database operations
export function getUserFilter() {
  const userId = getUserId();
  return { user_id: userId };
}

