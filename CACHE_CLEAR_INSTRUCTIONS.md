
# Cache Clear Instructions

If you're experiencing issues with the app, follow these steps to clear all caches:

## Step 1: Stop the development server
Press `Ctrl+C` in the terminal where Expo is running.

## Step 2: Clear Metro bundler cache
```bash
npx expo start --clear
```

## Step 3: Clear npm cache (if needed)
```bash
npm cache clean --force
```

## Step 4: Remove node_modules and reinstall
```bash
rm -rf node_modules
npm install
```

## Step 5: Clear watchman cache (macOS/Linux only)
```bash
watchman watch-del-all
```

## Step 6: Clear iOS build cache (iOS only)
```bash
cd ios
rm -rf build
rm -rf Pods
pod install
cd ..
```

## Step 7: Clear Android build cache (Android only)
```bash
cd android
./gradlew clean
cd ..
```

## Step 8: Start fresh
```bash
npx expo start --clear
```

## Common Issues Fixed by Cache Clearing

- Worklets serialization errors
- Module resolution errors
- Stale build artifacts
- Babel transformation issues
- Metro bundler conflicts

## Quick Fix (Most Common)
For most issues, this is usually sufficient:
```bash
npx expo start --clear
```

If that doesn't work, try:
```bash
rm -rf node_modules
npm install
npx expo start --clear
```
