# Waggli Website Specification + Content Bible
**High-Fidelity Pixel-Perfect Landing Page Strategy**

**Version:** 3.0  
**Date:** January 2026  
**Status:** Engineering & Content Master Standard  
**Reference Project:** `waggli-landing` (`src/i18n/locales/en.json` verified)

---

## 1. Executive Summary

This document is the **single source of truth** for the Waggli landing page. It combines the *Technical Specification* (Tech Stack, Components) with the *Content Bible* (Exact Copywriting) and *Design Context* (Why it looks this way).

**Core Goal:** A seamless, high-performance, animated narrative that converts visitors into Beta users. The page must feel "alive" with `framer-motion` animations, glassmorphism, and deep gradients, matching the premium branding of the App.

---

## 2. Technology Stack (Mandatory)

The project is already initialized with this best-in-class stack. All development must rigorously adhere to it:

*   **Core:** React 18 (`react-dom/client`), Vite (Build Tool), TypeScript.
*   **Styling:** Tailwind CSS (Utility-first).
*   **UI Library:** **Shadcn/UI** (Radix UI primitives).
*   **Animation:** **Framer Motion** (`framer-motion`) for complex entrance, scroll, and micro-interactions.
*   **Icons:** Lucide React (`lucide-react`).
*   **Internationalization:** `react-i18next` (using `en.json` as the base).
*   **Analytics:** PostHog (`posthog-js`).
*   **Backend:** Supabase (for Beta list storage).

---

## 3. Brand & Design System

### 3.1 Visual Identity
*   **Theme:** "Deep Space" Dark Mode with Neon Accents.
*   **Typography:** *Inter* (Google Fonts).
*   **Key Colors (CSS Variables):**
    *   `--background`: `#0F172A` (Deep Slate)
    *   `--primary`: `#10B981` (Waggli Teal)
    *   `--accent`: `#7C3AED` (Waggli Purple)
    *   `--gradient`: `linear-gradient(to right, #10B981, #7C3AED)`

### 3.2 "Pixel Perfect" Design Principles
1.  **Glassmorphism 2.0:** Use `backdrop-blur-md` with `bg-white/5` and subtle borders (`border-white/10`) for cards.
2.  **Aurora Gradients:** Animated, flowing background blobs with `blur-3xl`.
3.  **Scroll Animations:** Every element enters with `y: 20 -> 0`, `opacity: 0 -> 1` spring animation.
4.  **Reactive UI:** Hover effects must change border colors to the Teal/Purple gradient.

---

## 4. Component-by-Component Content Bible

This section maps the exact text from `locales/en.json` to the UI components. **Engineers must use `t('key')` hooks.**

### 4.1 Navbar (`src/components/landing/Navbar.tsx`)
**Context:** Sticky glass header.
*   **Links:** "Pet Passport", "AI Features", "Ecosystem", "Roadmap"
*   **Badge:** `BETA`
*   **CTA Button:** "Request Access" (Gradient Background)

### 4.2 Hero Section (`src/components/landing/Hero.tsx`)
**Design Context:** Split screen. Left = Text, Right = 3D App Mockup. Background = Animated Orbs.
*   **Beta Badge:** "Exclusive Beta | Limited Early Access"
*   **Headline (H1):** "Your Pet's **Digital Passport** in One App"
    *   *Note: "Digital Passport" has a text-gradient.*
*   **Subtitle:** "Be among the first to experience the future of pet care. Waglly creates a comprehensive digital health passport — storing vaccinations, medical records, and documents securely. **Join our exclusive beta and shape the product.**"
*   **CTA Button:** "Join The Beta" (Triggers `BetaAccessDialog`).

### 4.3 Passport Features (`src/components/landing/PassportFeatures.tsx`)
**Design Context:** Bento Grid. Grid of feature cards showcasing the core utility.
*   **Section Header:** "The Solution: **Introducing the Digital Pet Passport**"
*   **Section Description:** "One secure place for everything about your pet's health. Access anytime, share instantly, never forget a thing."
*   **Cards:**
    1.  **Vaccination:** "Never Miss a Vaccination" - "Track all vaccinations with automatic reminders..."
    2.  **Medication:** "Medication Tracking" - "Log all medications with dosages..."
    3.  **Health Records:** "Complete Health Records" - "One timeline with all conditions..."
    4.  **Vet History:** "Vet Visit History" - "Store every visit with diagnoses..."
    5.  **Sharing:** "Instant Sharing with Vets" - "Share your pet's complete passport via QR..."
    6.  **Reminders:** "Smart Reminders" - "Get intelligent alerts..."
    7.  **Documents:** "Document Storage" - "Upload and organize all documents..."
    8.  **Travel:** "Travel Ready" - "Track travel requirements, export permits..."

### 4.4 AI Features (`src/components/landing/AIFeatures.tsx`)
**Design Context:** Interactive Tabs. Clicking a tab changes the main view.
*   **Header:** "AI-Powered Intelligence: **How AI Transforms Pet Care**"
*   **Tabs:**
    1.  **OCR (`ScanText`):**
        *   **Title:** "Smart Document OCR"
        *   **Tagline:** "From paper chaos to organized records in seconds"
        *   **Stat:** "< 5 sec" (Average processing time)
        *   **Use Cases:** Vaccination Records, Lab Results, Prescriptions.
    2.  **Assistant (`MessageSquareText`):**
        *   **Title:** "AI Health Assistant"
        *   **Tagline:** "Expert veterinary guidance, available 24/7"
        *   **Stat:** "24/7" (Always available)
        *   **Use Cases:** Symptom Assessment, Care Guidance, Emergency Support.
    3.  **Voice (`Mic`):**
        *   **Title:** "Voice Data Entry"
        *   **Tagline:** "Speak naturally, let AI handle the rest"
        *   **Stat:** "10+" (Languages supported)
    4.  **Predictive (`Sparkles`):**
        *   **Title:** "Predictive Health Insights"
        *   **Tagline:** "Stay ahead of health issues before they become problems"
    5.  **Location (`MapPinned`):**
        *   **Title:** "Smart Location Services"
        *   **Tagline:** "Find the best care options wherever you are"

### 4.5 Ecosystem (`src/components/landing/Ecosystem.tsx`)
**Design Context:** Sidebar Navigation (Vertical Tabs).
*   **Header:** "Complete Ecosystem: **Everything Your Pet Needs**"
*   **Badge:** "Coming 2026" (Important expectation setting).
*   **Categories:**
    1.  **Social:** "Pet Social Network" - "Connect with pet owners worldwide..."
    2.  **Services:** "Pet Services Hub" - "Find trusted pet care professionals..."
    3.  **Health:** "Health Tracking" - "Monitor your pet's health with smart integrations..."
    4.  **Donations:** "Donations & Support" - "A transparent, verified system..."
    5.  **Blood Bank:** "Blood Donor Network" - "Life-saving pet blood donation..."
    6.  **Marketplace:** "Shop"
    7.  **Adoption:** "Connect loving homes with pets..."
    8.  **Insurance:** "Comprehensive pet insurance..."

### 4.6 User Types (`src/components/landing/UserTypes.tsx`)
**Design Context:** Large Bento Grid cards for specific personas.
*   **Header:** "Built For Everyone: **One Platform, Endless Possibilities**"
*   **Personas:**
    1.  **Pet Owners:** "Complete pet care management."
    2.  **Donors & Helpers:** "Make a real difference."
    3.  **Shelters:** "Professional-grade tools."
    4.  **Service Providers:** "Grow your business."
    5.  **Veterinary Pros:** "Modern practice tools."
    6.  **Pet Businesses:** "E-commerce made easy."

### 4.7 How It Works (`src/i18n/locales/en.json`)
*   **Title:** "How It Works"
*   **Steps:**
    1.  **Create Your Account:** Sign up & choose role.
    2.  **Add Your Pets:** Create profiles & passports.
    3.  **Connect & Help:** Donate or volunteer.
    4.  **Access Full Ecosystem:** Book services & shop.

### 4.8 FAQ Section (`src/components/landing/FAQ.tsx`)
*   **Questions:**
    *   "What is Waglly's Digital Pet Passport?"
    *   "Is my pet's data secure?" (Answer emphasizes Bank-level encryption & GDPR).
    *   "How does QR code sharing work?"
    *   "Is Waglly available now?" (Answer: Web Beta now, Apps coming soon).

---

## 5. Implementation Strategy

### 5.1 Asset Requirements
*   **Hero Image:** High-res 3D render of iPhone showing the Dashboard (file: `src/assets/app-mockup.png`).
*   **Social Images:** OG Image for Twitter/LinkedIn sharing.
*   **Favicon:** Animated/Static SVG of the logo.

### 5.2 Responsive Breakpoints
*   **Mobile (<640px):** Stacked layouts. Ecosystem tabs become horizontal scroll. Navbar collapses to Hamburger.
*   **Tablet (640px - 1024px):** 2-column grids.
*   **Desktop (>1024px):** Full 4-column Bento grids. Glassmorphism enabled.

### 5.3 SEO Metadata
*   **Title:** `Waggli | The All-in-One Digital Pet Passport & AI Health Assistant`
*   **Description:** `Securely store vaccination records, get instant AI health advice, and connect with the best pet care ecosystem. Join the exclusive Beta today.`
*   **Keywords:** `pet passport`, `dog health app`, `cat vaccination tracker`, `AI vet`, `pet records app`.

---

**This specification defines the exact "Pixel Perfect" standard for the Waggli Landing Page.**
