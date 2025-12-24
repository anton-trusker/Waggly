
# Fixing the Supabase Import Error

## The Problem

You're seeing this error:
```
Cannot destructure property 'SupabaseClient' of 'main.default' as it is undefined.
```

This is a common issue with Expo 54 and Metro bundler when importing `@supabase/supabase-js`.

## The Solution

I've updated the following files to fix this issue:

1. **metro.config.js** - Updated to properly resolve the @supabase/supabase-js package
2. **babel.config.js** - Added .mjs and .cjs extensions for better module resolution
3. **package.json** - Added resolution for @supabase/supabase-js
4. **lib/supabase.ts** - Ensured proper import syntax

## Steps to Apply the Fix

### Step 1: Stop the Development Server

Press `Ctrl+C` in your terminal to stop the Expo dev server.

### Step 2: Clear All Caches

Run these commands in order:

```bash
# Clear Metro bundler cache
rm -rf node_modules/.cache

# Clear Expo cache
rm -rf .expo

# Optional: Clear watchman cache (if you have watchman installed)
watchman watch-del-all
```

### Step 3: Reinstall Dependencies

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall everything
npm install
```

### Step 4: Start with Clean Cache

```bash
npx expo start --clear
```

## Alternative: Quick Fix Command

If you want to do everything in one command:

```bash
rm -rf node_modules .expo node_modules/.cache package-lock.json && npm install && npx expo start --clear
```

## If the Problem Persists

### Check 1: Verify Package Installation

```bash
npm list @supabase/supabase-js
```

You should see version `^2.87.1`. If not, reinstall:

```bash
npm install @supabase/supabase-js@^2.87.1 --save
```

### Check 2: Verify Environment Variables

Create a `.env` file in the root directory if it doesn't exist:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tcuftpjqjpmytshoaqxr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjdWZ0cGpxanBteXRzaG9hcXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MDE1ODgsImV4cCI6MjA4MTM3NzU4OH0.sCDNrjlLMwlqPvt0WrVxxs6N6QfvxN6muEOvRGyvK90
```

### Check 3: Node Version

Make sure you're using Node.js 18 or higher:

```bash
node --version
```

If you're on an older version, upgrade Node.js.

### Check 4: Try Different Platforms

Sometimes the issue only affects one platform. Try:

```bash
# Try web first (usually most stable)
npx expo start --web

# Then try iOS
npx expo start --ios

# Then try Android
npx expo start --android
```

## Understanding the Fix

The issue occurs because:

1. **Metro Bundler** (Expo's JavaScript bundler) has trouble with some npm packages that use modern ESM exports
2. **@supabase/supabase-js** uses package.json exports field which Metro doesn't always handle well
3. The fix disables `unstable_enablePackageExports` in Metro config, forcing it to use the traditional `main` field

## What Changed

### metro.config.js
- Set `unstable_enablePackageExports: false` to use traditional module resolution
- Added proper source extensions including `.mjs` and `.cjs`
- Configured proper node_modules resolution

### babel.config.js
- Added `.mjs` and `.cjs` to the list of extensions
- This ensures Babel can transform these files properly

### package.json
- Added `@supabase/supabase-js` to resolutions to ensure consistent version

## Still Having Issues?

If you're still seeing the error after following all these steps:

1. **Check the Expo logs** - Look for any other errors that might give more context
2. **Try a different package manager** - If you're using npm, try yarn or pnpm
3. **Check for conflicting packages** - Run `npm ls` to see if there are any dependency conflicts
4. **Update Expo** - Make sure you're on the latest Expo 54 version: `npm install expo@~54.0.1`

## Success Indicators

You'll know the fix worked when:

1. The app starts without the import error
2. You see "Supabase client initialized: true" in the console
3. The auth context loads without errors
4. You can navigate to the login screen

## Next Steps

Once the app is running:

1. Test the login functionality
2. Check that the database connection works
3. Verify that all Supabase features are working (auth, database, storage)

## Need More Help?

Check the official Supabase documentation for React Native:
https://supabase.com/docs/guides/getting-started/quickstarts/react-native

Or the Expo documentation:
https://docs.expo.dev/
