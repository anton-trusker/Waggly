
# Troubleshooting Supabase Import Error

If you're seeing the error: `Cannot destructure property 'SupabaseClient' of 'main.default' as it is undefined`, follow these steps:

## Solution 1: Clear Cache and Reinstall

1. Stop the Expo dev server
2. Clear the Metro bundler cache:
   ```bash
   npx expo start --clear
   ```

3. If that doesn't work, try a full clean:
   ```bash
   # Remove node_modules and cache
   rm -rf node_modules
   rm -rf .expo
   rm -rf node_modules/.cache
   
   # Reinstall dependencies
   npm install
   
   # Start with cleared cache
   npx expo start --clear
   ```

## Solution 2: Check Node Modules

Make sure `@supabase/supabase-js` is properly installed:

```bash
npm list @supabase/supabase-js
```

If it's not installed or shows errors, reinstall it:

```bash
npm install @supabase/supabase-js@^2.87.1
```

## Solution 3: Environment Variables

Make sure you have a `.env` file in the root of your project with:

```
EXPO_PUBLIC_SUPABASE_URL=https://tcuftpjqjpmytshoaqxr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Solution 4: Metro Config

The metro.config.js has been updated to properly handle the @supabase/supabase-js package. Make sure you restart the dev server after any config changes.

## Solution 5: Check Package Manager

If you're using yarn or pnpm instead of npm, you might need to:

**For Yarn:**
```bash
yarn install --force
yarn start --clear
```

**For pnpm:**
```bash
pnpm install --force
pnpm start --clear
```

## Solution 6: Expo SDK Version

Make sure you're using compatible versions. This app is built for Expo SDK 54. Check your expo version:

```bash
npx expo --version
```

If needed, upgrade:
```bash
npm install expo@~54.0.1
```

## Still Having Issues?

1. Check that you're running Node.js version 18 or higher
2. Try running on a different platform (iOS/Android/Web) to isolate the issue
3. Check the Expo logs for more detailed error messages
4. Make sure all peer dependencies are installed correctly

## Quick Fix Command

Run this complete reset:

```bash
rm -rf node_modules .expo node_modules/.cache package-lock.json && npm install && npx expo start --clear
```
