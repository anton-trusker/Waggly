**PawHelp Document 4: Mobile App Specification — UI/UX, Screens & Flows**

---

### Mobile Vision & Design Principles
- Intuitive, user-friendly mobile experience.
- Accessibility-first approach.
- Pet-centric, community-focused UI.
- Seamless onboarding for all user roles.
- Optimized for low-bandwidth and mobile data conditions.

### Technical Stack
- React Native with Expo.
- TypeScript for strict typing.
- Redux Toolkit for state management.
- React Navigation v6.
- Axios for API communication.
- Formik & Yup for forms and validation.
- React Native Paper for consistent UI components.
- React Native Reanimated for animations.
- React Native Maps for location-based features.

---

### Full User Experience Description
- Unified experience for:
  - Pet Owners
  - Donors/Helpers
  - Blood Donors
  - Service Providers (via verified profiles)
  - Community Members
- Personalized home screens based on role.
- AI-driven suggestions and content curation.
- Responsive design across devices.
- Support for dynamic text sizes and accessibility settings.

---

### UI System
- **Colors:**
  - Primary: #0080FF (Blue)
  - Secondary: #FF9F7A (Peach/Coral)
  - Background: #FFFFFF (White)
  - Error: #FF3B30 (Red)
  - Success: #34C759 (Green)
- **Typography:**
  - SF Pro Text (iOS)
  - Roboto (Android)
- **Iconography:**
  - PawHelp custom icon set.
  - Outline and filled styles for inactive/active states.
- **Spacing & Layout:**
  - Base 4px grid system.
  - Rounded corners, soft shadows.

---

### Screen-by-Screen Breakdown
- **Onboarding & Registration**
  - Welcome screen with value proposition.
  - Email or social login.
  - Language selection.
  - Email verification (code input).
- **Homepage & Discovery**
  - Hero area with personalized greeting.
  - Featured cases & urgent help requests.
  - Action buttons: Donate, Give Hope.
  - Types of Help section.
  - Heroes Nearby showcase.
- **Case Creation Flow**
  - Help type selection (Seeking help / Become donor).
  - Pet information (Type, gender, age, breed).
  - Photo & document uploads.
  - Fundraising amount & case description.
  - Contact information & visibility settings.
  - Review & publish.
- **Donation Flow**
  - Case summary.
  - Donation amount selection (preset/custom).
  - Payment method selection.
  - Donor information (optional anonymity).
  - Confirmation & success screen.
- **Blood Donor Registration**
  - Pet eligibility screening.
  - Health status checklist.
  - Veterinary history upload.
  - Availability & location settings.
- **Community & Messaging**
  - Groups directory & join requests.
  - Group chats & private messaging.
  - Community badges & achievements.
- **Partner/Service Discovery & Booking**
  - Search & filter providers.
  - Service listings with reviews.
  - Direct booking integration.
- **Profile & Account Management**
  - Profile details & avatar.
  - Active cases & donations.
  - Settings: notifications, language, currency.

---

### Context Texts & Localization
- Dynamic content based on language preference.
- AI-assisted translation for user-generated content.
- Clear prompts & tooltips throughout all screens.
- Regional adaptations for terminology & imagery.

---

### End-to-End Flows by Role
- Specific navigation & screen access based on role.
- Role evolution handled within the app (e.g., Pet Owner to Donor).
- Guest flow with prompts to register.

---

### Offline Capabilities & Error Handling
- Cached cases & search results.
- Offline case draft creation.
- Queued donations for processing when online.
- Connection status indicators.

---

### Accessibility & Responsiveness
- WCAG AA compliance.
- Dynamic text scaling.
- Minimum touch target sizes.
- Screen reader compatibility.
- RTL language support.

---

### Push Notifications & Engagement Triggers
- Case updates & donation confirmations.
- New urgent cases in region.
- Community interactions & messages.
- Blood donor match alerts.

---

*The PawHelp mobile app delivers a comprehensive, role-aware experience that prioritizes accessibility, usability, and community-driven action.*

