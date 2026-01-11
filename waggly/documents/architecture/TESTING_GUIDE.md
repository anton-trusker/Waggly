
# Comprehensive Testing Guide for Waggli

## Pre-Testing Setup

1. **Clear all caches:**
   ```bash
   npx expo start --clear
   ```

2. **Ensure environment variables are set:**
   - Check that `.env` file exists with Supabase credentials
   - Verify `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set

3. **Verify database is set up:**
   - Check `DATABASE_SETUP_COMPLETE.md` for confirmation
   - Ensure all tables exist in Supabase

## Testing Checklist

### 1. Authentication Flow
- [ ] **Sign Up**
  - Navigate to signup screen
  - Enter email and password
  - Verify email confirmation message appears
  - Check email for verification link
  - Click verification link
  
- [ ] **Sign In**
  - Enter credentials
  - Verify successful login
  - Check that user is redirected to home screen
  
- [ ] **Forgot Password**
  - Click "Forgot Password"
  - Enter email
  - Check email for reset link
  - Verify password can be reset

- [ ] **Sign Out**
  - Navigate to profile screen
  - Click sign out
  - Verify redirect to login screen

### 2. Home Screen
- [ ] **Empty State (No Pets)**
  - Verify welcome message displays
  - Check "Add Pet" button is visible
  - Verify illustration loads
  
- [ ] **With Pets**
  - Verify user greeting displays correctly
  - Check pet avatars appear in horizontal scroll
  - Verify notification badge shows if there are notifications
  - Test navigation to pet detail screen
  - Check all cards are clickable

### 3. Pet Management
- [ ] **Add Pet**
  - Click "Add Pet" button
  - Fill in all required fields:
    - Name
    - Species (dog/cat/other)
    - Breed
    - Gender
    - Date of birth
    - Size
    - Weight
    - Color
  - Add photo (optional)
  - Submit form
  - Verify pet appears in list
  
- [ ] **View Pet Details**
  - Click on a pet
  - Verify all sections display:
    - Overview
    - Health information
    - Vaccinations
    - Treatments
    - Food details
    - Care notes
    - Weight history
  
- [ ] **Edit Pet**
  - Click edit button
  - Modify pet information
  - Save changes
  - Verify changes are reflected
  
- [ ] **Delete Pet**
  - Click delete button
  - Confirm deletion
  - Verify pet is removed from list

### 4. Vaccinations
- [ ] **Add Vaccination**
  - Navigate to pet detail
  - Click "Add Vaccination"
  - Fill in:
    - Vaccine name
    - Category (core/non-core)
    - Date given
    - Next due date
    - Dose number
    - Administering vet
    - Notes
  - Submit form
  - Verify vaccination appears in list
  
- [ ] **View Vaccination Status**
  - Check status badges:
    - Up to date (green)
    - Due soon (yellow)
    - Overdue (red)
  - Verify dates are calculated correctly
  
- [ ] **Edit Vaccination**
  - Click on vaccination
  - Modify details
  - Save changes
  - Verify updates appear
  
- [ ] **Delete Vaccination**
  - Click delete button
  - Confirm deletion
  - Verify vaccination is removed

### 5. Treatments & Medications
- [ ] **Add Treatment**
  - Navigate to pet detail
  - Click "Add Treatment"
  - Fill in:
    - Treatment name
    - Category (preventive/acute/chronic)
    - Start date
    - End date (optional)
    - Dosage
    - Frequency
    - Time of day
    - Vet
    - Notes
  - Submit form
  - Verify treatment appears in list
  
- [ ] **View Active Treatments**
  - Check active treatments are displayed
  - Verify treatment reminders show
  - Check "when pills need to be administered" displays
  
- [ ] **Mark Treatment as Complete**
  - Set end date
  - Verify treatment moves to past treatments
  
- [ ] **Edit Treatment**
  - Modify treatment details
  - Save changes
  - Verify updates appear
  
- [ ] **Delete Treatment**
  - Click delete button
  - Confirm deletion
  - Verify treatment is removed

### 6. Health Records
- [ ] **Add Allergy**
  - Navigate to health section
  - Add allergy with:
    - Type (food/environment/medication)
    - Allergen
    - Reaction description
    - Severity level
    - Notes
  - Verify allergy appears in list
  
- [ ] **Add Veterinarian**
  - Add vet with:
    - Clinic name
    - Vet name
    - Address
    - Phone
    - Email
    - Website
  - Verify vet appears in list
  
- [ ] **Add Weight Entry**
  - Navigate to weight section
  - Add entry with:
    - Date
    - Weight (kg)
    - Notes
  - Verify entry appears in chronological list
  
- [ ] **View Medical History**
  - Check medical history summary displays
  - Verify all entries are visible

### 7. Notifications
- [ ] **View Notifications**
  - Navigate to notifications screen
  - Verify unread notifications appear first
  - Check notification badges display correctly
  
- [ ] **Notification Types**
  - Verify vaccination reminders appear
  - Check treatment reminders display
  - Verify vet appointment reminders show
  
- [ ] **Mark as Read**
  - Click on notification
  - Verify it moves to "Read" section
  - Check badge count updates
  
- [ ] **Notification Status**
  - Check "Due Soon" badge for upcoming items
  - Verify "Overdue" badge for past due items
  - Confirm dates are formatted correctly

### 8. Profile & Settings
- [ ] **View Profile**
  - Navigate to profile screen
  - Verify user email displays
  - Check all settings are accessible
  
- [ ] **Update Profile**
  - Modify profile information
  - Save changes
  - Verify updates persist
  
- [ ] **Sign Out**
  - Click sign out button
  - Verify redirect to login screen
  - Confirm session is cleared

### 9. Navigation
- [ ] **Tab Bar (Android/Web)**
  - Test all 5 tabs:
    - Home
    - Calendar
    - Services
    - Community
    - Settings
  - Verify active tab is highlighted
  - Check smooth transitions
  
- [ ] **Native Tabs (iOS)**
  - Test all tabs
  - Verify iOS-specific styling
  - Check tab icons display correctly
  
- [ ] **Back Navigation**
  - Test back button on all screens
  - Verify navigation stack works correctly
  - Check no navigation loops exist

### 10. UI/UX
- [ ] **Light Mode**
  - Switch to light mode
  - Verify all colors are readable
  - Check contrast is sufficient
  
- [ ] **Dark Mode**
  - Switch to dark mode
  - Verify all colors are readable
  - Check contrast is sufficient
  
- [ ] **Animations**
  - Check tab bar animations
  - Verify smooth transitions
  - Test scroll animations
  
- [ ] **Loading States**
  - Verify loading indicators appear
  - Check skeleton screens (if any)
  - Confirm data loads correctly
  
- [ ] **Error States**
  - Test with no internet connection
  - Verify error messages display
  - Check retry functionality
  
- [ ] **Empty States**
  - Verify empty state messages
  - Check illustrations display
  - Confirm call-to-action buttons work

### 11. Data Persistence
- [ ] **Session Persistence**
  - Close and reopen app
  - Verify user stays logged in
  - Check data persists
  
- [ ] **Offline Behavior**
  - Disconnect internet
  - Verify cached data displays
  - Check error handling
  
- [ ] **Data Sync**
  - Make changes on one device
  - Verify changes appear on another device
  - Check real-time updates (if applicable)

### 12. Performance
- [ ] **Load Times**
  - Measure initial app load time
  - Check screen transition speed
  - Verify data fetching is fast
  
- [ ] **Memory Usage**
  - Monitor memory consumption
  - Check for memory leaks
  - Verify app doesn't crash
  
- [ ] **Smooth Scrolling**
  - Test long lists
  - Verify smooth scrolling
  - Check no lag or stuttering

## Platform-Specific Testing

### iOS
- [ ] Test on iPhone (various sizes)
- [ ] Test on iPad
- [ ] Verify native tabs work correctly
- [ ] Check SF Symbols display properly
- [ ] Test haptic feedback
- [ ] Verify safe area insets

### Android
- [ ] Test on various Android versions
- [ ] Verify Material icons display
- [ ] Check edge-to-edge display
- [ ] Test back button behavior
- [ ] Verify notification permissions

### Web
- [ ] Test in Chrome
- [ ] Test in Safari
- [ ] Test in Firefox
- [ ] Verify responsive design
- [ ] Check keyboard navigation

## Bug Reporting Template

When you find a bug, report it with:

```
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [...]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Platform:**
- Device: [iPhone 14, Pixel 7, etc.]
- OS: [iOS 17, Android 14, etc.]
- App Version: [1.0.0]

**Screenshots/Videos:**
[Attach if applicable]

**Console Logs:**
[Paste relevant logs]
```

## Success Criteria

The app is ready for production when:
- ✅ All authentication flows work correctly
- ✅ All CRUD operations function properly
- ✅ No console errors or warnings
- ✅ Smooth animations and transitions
- ✅ Proper error handling
- ✅ Data persists correctly
- ✅ Works on all target platforms
- ✅ Passes all accessibility checks
- ✅ Performance is acceptable
- ✅ UI matches design specifications
