
# Fix Runtime Errors & Warnings

## 1. Fix `useThemeContext` Error
The error occurs because `NavigationThemeProvider` calls `useAppTheme()` but might be rendered outside of `ThemeContextProvider` in some codepaths, or the provider nesting was incorrect in `RootLayout`.

**Resolution:**
Move `ThemeContextProvider` to the very top level in `RootLayout` (and platform equivalents) so it wraps everything, including `AuthProvider`.

**Files to modify:**
- `app/_layout.tsx` (Default/iOS)
- `app/_layout.web.tsx` (Web)
- `app/_layout.native.tsx` (Android)

**Implementation:**
```tsx
// Example for app/_layout.tsx
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContextProvider> {/* Move this up */}
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeContextProvider>
    </GestureHandlerRootView>
  );
}
```

## 2. Fix "Too many screens defined" Warning
The warning `Route "onboarding" is extraneous` means there is a `Stack.Screen name="(onboarding)"` defined in the layout, but the file `app/(onboarding)/_layout.tsx` or `index.tsx` might not be exporting a valid component that matches what the router expects, or the route is being auto-generated and conflicting with the explicit stack screen.

**Resolution:**
Remove the explicit `<Stack.Screen name="(onboarding)" />` if it's already being handled by file-based routing, or ensure the name matches exactly the folder structure. Since `(onboarding)` is a group, it should be recognized. The warning often appears if the directory exists but the route is not properly registered or if there's a typo. I will verify if `(onboarding)` needs to be in the stack or if it can be auto-discovered.

**Action:**
- Verify `app/(onboarding)/_layout.tsx` exists and exports a valid component.
- If it works without the explicit `Stack.Screen`, remove it to silence the warning.

## 3. Fix "EXPO_PUBLIC_SUPABASE_ANON_KEY: Not set"
The logs show `EXPO_PUBLIC_SUPABASE_ANON_KEY` is not set. This is critical for Supabase auth to work.

**Resolution:**
- Check `.env.local` or `.env` file.
- Ensure the key starts with `EXPO_PUBLIC_`.
- Restart the development server with `npx expo start --clear` to load new env vars.

## 4. Fix `useTranslation` Warning (Already addressed)
We already imported `i18n` config in root layouts, so this should be resolved.

## Plan Summary
1. **Refactor RootLayouts**: Wrap `AuthProvider` with `ThemeContextProvider` in all 3 layout files.
2. **Fix Env Var**: Verify `.env` file content and restart server.
3. **Clean up Routes**: Check `(onboarding)` route configuration.
