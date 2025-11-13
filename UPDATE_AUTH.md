# Authentication Removal - Update Guide

All pages need to be updated to replace:
- `supabase.auth.getUser()` → `getSupabaseWithUserId()` from `@/lib/user-helpers`
- Remove auth checks
- Use `useUser()` hook for user profile data

Key changes:
1. Import `useUser` from `@/lib/user-context`
2. Import `getSupabaseWithUserId` from `@/lib/user-helpers`
3. Replace `const { data: { user } } = await supabase.auth.getUser()` with `const { supabase, userId } = await getSupabaseWithUserId()`
4. Replace `user.id` with `userId` in database queries
5. Remove `if (!user) return;` checks

