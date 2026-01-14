# Waggli Content Implementation Guide
**Component-by-Component Text Mapping**

**Version:** 1.0
**Target Project:** `waggli-landing`
**Purpose:** Use this document to populate `en.json` or directly update React components.

---

## 1. `src/components/landing/Navbar.tsx`

| Key | Value |
| :--- | :--- |
| **Brand** | Waggli |
| **Link 1** | Passport |
| **Link 2** | Intelligence |
| **Link 3** | Ecosystem |
| **Link 4** | Roadmap |
| **Badge** | BETA |
| **CTA Button** | Request Access |

---

## 2. `src/components/landing/Hero.tsx`

**Headline**
> "Your Pet's **Digital Passport** in One App"

**Subheadline**
> "Stop searching through paper folders. Waggli uses AI to unify vaccinations, medical history, and government documents into a single, secure timeline. Built for the modern European pet owner."

**Beta Badge**
> "Exclusive Beta • Limited Early Access"

**Primary CTA**
> "Join The Waitlist"

**Microcopy (below button)**
> "Zero-friction setup. Free for early adopters."

---

## 3. `src/components/landing/PassportFeatures.tsx`
*(The "System of Record" - Bento Grid)*

**Section Header**
> "The Digital Passport"
**Section Subhead**
> "One secure system of record. Zero manual entry."

| Feature Card | Title | Description |
| :--- | :--- | :--- |
| **Vaccines** | **Smart Vaccine Tracker** | "Never miss a booster. Autoschedules next visits and tracks batch numbers from uploaded booklets." |
| **Medical** | **Unified Medical History** | "Surgeries, allergies, and treatments in one chronological view. Instantly shareable with any vet, anywhere." |
| **Travel** | **EU Travel Ready** | "Centralize pet ID, microchip data, and rabies milestones for cross-border travel." |
| **Privacy** | **Bank-Grade Privacy** | "Your data is encrypted and stored in Frankfurt. GDPR compliant by design." |
| **Meds** | **Medication Log** | "Track dosages and get smart refill reminders automatically." |
| **Docs** | **Secure Document Vault** | "Insurance policies, ownership papers, and lab results safe in the cloud." |

---

## 4. `src/components/landing/AIFeatures.tsx`
*(The "Intelligence" - Tabs)*

**Section Header**
> "Intelligence Built-In"
**Section Subhead**
> "Our AI doesn't just store data. It understands it."

### Tab 1: OCR (`ocr`)
*   **Title:** "Digitize Records in Seconds"
*   **Description:** "Snap a photo of any invoice, blood test, or vaccination card. Waggli's AI extracts the dates, batch numbers, and vet notes automatically."
*   **Stat:** "< 5 sec processing"

### Tab 2: Assistant (`assistant`)
*   **Title:** "Veterinary Grade Guidance"
*   **Description:** "Worried about a symptom? Chat with Waggli. Trained on verified veterinary literature to give you instant, safe guidance before you rush to the ER."
*   **Stat:** "24/7 Availability"

### Tab 3: Voice (`voice`)
*   **Title:** "Natural Voice Entry"
*   **Description:** "Hands full? Log weight, meals, or behavioral changes just by speaking. Waggli processes natural language into structured health records."
*   **Stat:** "Multi-language Support"

---

## 5. `src/components/landing/Ecosystem.tsx`
*(The "Roadmap" - Sidebar/Tabs)*

**Section Header**
> "The Future of Connected Care"
**Badge**
> "Roadmap 2026"

| Ecosystem Node | Title | Description |
| :--- | :--- | :--- |
| **Vets** | **Veterinary Portal** | "Direct syncing with clinic software. No more email attachments." |
| **Insurance** | **Instant Claims** | "One-tap claim submission. Insurance companies trust our verified data." |
| **Social** | **Pet Network** | "Find playdates, walking groups, and local pet friends." |
| **Services** | **Verified Pros** | "Book groomers and sitters who already know your pet's needs." |

---

## 6. `src/components/landing/UserTypes.tsx`
*(Target Audience - Personas)*

**Section Header**
> "Built for Every Pet Parent"

| Persona | Title | Benefits |
| :--- | :--- | :--- |
| **Owner** | **The Dedicated Owner** | "For those who treat their pets like family. Get peace of mind knowing every health detail is tracked." |
| **Traveler** | **The Globetrotter** | "Cross borders with confidence. Keep all travel docs and requirements in your pocket." |
| **Breeder** | **The Responsible Breeder** | "Hand over digital health records to new owners instantly. No more paper piles." |
| **Senior** | **The Senior Pet Parent** | "Manage complex medication schedules and chronic conditions with ease." |

---

## 7. `src/components/landing/HowItWorks.tsx`
*(Onboarding Flow)*

**Section Header**
> "Get Started in Minutes"

**Step 1**
> **Create Profile:** "Sign up and build your pet's digital identity."

**Step 2**
> **Scan History:** "Upload photos of existing records. AI organizes years of history."

**Step 3**
> **Stay Healthy:** "Get automated reminders. Share access with your vet instantly."

---

## 8. `src/components/landing/FAQ.tsx`
*(Common Questions)*

**Q1: Is Waggli available now?**
> "Yes, we are currently in Exclusive Beta. You can request access to join the waitlist."

**Q2: Is my data secure?**
> "Absolutely. We use bank-grade encryption and store all data in Frankfurt, Germany, strictly adhering to GDPR standards."

**Q3: Does the AI replace my vet?**
> "No. Waggli provides information and triage guidance based on veterinary literature, but it does not replace a physical examination by a professional."

**Q4: Which countries are supported?**
> "We are launching primarily in the Netherlands, Germany, Belgium, and Austria with full language support."

---

## 9. `src/components/landing/BetaAccessDialog.tsx`
*(The Conversion Form)*

**Dialog Title**
> "Join the Waitlist"

**Dialog Description**
> "Be among the first to experience the future of pet care. Rolling out in batches."

**Form Fields**
*   Name
*   Email
*   Pet Name (Optional)
*   Country (Dropdown: NL, DE, BE, AT, Other)

**Submit Button**
> "Request Early Access"

**Success Message**
> "You're on the list! We'll notify you as soon as a spot opens up."

---

## 10. `src/components/landing/Footer.tsx`

**Newsletter**
> "Join the extensive waitlist" (Button: Request Access)

**Copyright**
> "© 2026 Waggli. Crafted for happy pets in Amsterdam."

**Links**
> Privacy Policy • Terms of Service • Support
