# Fix Admin Dashboard API Errors

## Root Cause
The admin dashboard (`app/admin.tsx`) triggers `loadAllData()` on mount before `useAuth()` has finished loading the user/token from SecureStore. All admin endpoints require authentication, so unauthenticated requests return 401/403, which are swallowed by vague error messages.

## Steps
- [ ] Step 1: Fix auth race condition in `frontend/Hope4All/app/admin.tsx`
- [ ] Step 2: Add descriptive HTTP error handling to `frontend/Hope4All/constants/api.ts`
- [ ] Step 3: Verify no other admin-facing files have the same pattern

