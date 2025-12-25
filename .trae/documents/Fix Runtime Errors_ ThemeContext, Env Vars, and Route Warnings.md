
# Fix Syntax Error and Runtime Issues

## 1. Fix Syntax Error in `_layout.web.tsx`
The build log shows a syntax error: `Identifier 'Theme' has already been declared`.
Looking at the file `app/_layout.web.tsx`, lines 13-14 show:
```typescript
  Theme,
  Theme,
```
This is a duplicate import. Also, the imports are messy.

**Resolution:**
Clean up imports in `app/_layout.web.tsx`.
- Remove duplicate `Theme`.
- Correctly alias `ThemeProvider` from `@react-navigation/native` to `NavigationThemeProvider`.
- Ensure `ThemeContextProvider` is imported from `@/contexts/ThemeContext`.
- Remove the double fragment and double StatusBar rendering.

## 2. Fix `useThemeContext` Error (Carry over from previous plan)
The error `useThemeContext must be used within a ThemeProvider` persists. The previous plan to wrap `AuthProvider` with `ThemeContextProvider` is still valid and necessary. This needs to be applied to all platform layout files.

## 3. Fix "Too many screens defined" Warning
The warning `Route "onboarding" is extraneous` persists.
**Resolution:**
In `app/_layout.web.tsx` (and other layouts), remove the explicit `<Stack.Screen name="(onboarding)" />` if it's not needed, or ensure the directory structure matches. Given `app/(onboarding)` exists, `expo-router` should handle it. If it's a group, it might not need an explicit screen definition if it's not a direct route but a group of routes. However, usually, groups *can* be screens. The warning might be because `(onboarding)` doesn't have an `index` or `_layout` that exports a component in a way the parent stack expects, or it's being auto-generated and conflicting.
I will check if removing it from the `Stack` screens list resolves the warning, as file-based routing will still pick it up if it's a valid route.

## 4. Fix Env Vars
The logs show `EXPO_PUBLIC_SUPABASE_ANON_KEY` is not set.
**Resolution:**
- Create/Verify `.env` file with `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Instruct user to restart dev server / rebuild.

## Execution Plan
1.  **Fix `app/_layout.web.tsx`**:
    - Remove duplicate `Theme` import.
    - Clean up `ThemeProvider` aliases.
    - Fix the render structure (remove double fragments/StatusBars).
    - Wrap `AuthProvider` with `ThemeContextProvider` (and `NavigationThemeProvider` inside that).
2.  **Refactor `app/_layout.tsx` (Native/iOS)**:
    - Wrap `AuthProvider` with `ThemeContextProvider`.
    - Check/Remove `(onboarding)` screen if causing issues (or ensure it's correct).
3.  **Refactor `app/_layout.native.tsx` (Android)**:
    - Wrap `AuthProvider` with `ThemeContextProvider`.
4.  **Verify `.env`**:
    - Check if `.env` exists and has the key. If not, I can't set it for them but I can warn them.

Let's start with fixing the syntax error in `_layout.web.tsx` as it's blocking the build.
