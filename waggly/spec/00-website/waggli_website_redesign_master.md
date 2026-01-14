# Waggli Website Redesign Master Specification
**The "Linear-Grade" Pixel Perfect Standard**

**Version:** 1.0 (Redesign Master)  
**Date:** January 13, 2026  
**Status:** Engineering Blueprint  
**Reference:** `BRAND_GUIDELINES.md` + 2026 SaaS Trends

---

## 1. Design Vision: "The Linear of Pet Health"

The goal is to move beyond a "nice startup page" to a **world-class, award-winning digital experience**. We are adopting the **"Linear Style"** aesthetic: hyper-minimalist, dark-mode first, precision-engineered interactions, and deep, glowing gradients.

**Core Design Pillars:**
1.  **Deep Space Dark:** The site is native dark mode (`#0F172A`). It is not black; it is a rich, deep slate that feels premium and easy on the eyes.
2.  **Aurora Glows:** Backgrounds are not static. They breathe with subtle, moving blobs of "Waggli Teal" (`#10B981`) and "Waggli Purple" (`#7C3AED`) heavily blurred (`blur-3xl`) to create depth without noise.
3.  **Glassmorphism 3.0:** Cards are not just transparent. They use `backdrop-filter: blur(12px)`, `bg-white/5`, and a 1px border of `white/10` that lights up on hover (gradient border reveal).
4.  **Micro-Interaction Density:** Nothing is static. Buttons have a subtle inner glow. Links have animated underlines. Cards lift and scale (`scale-[1.02]`) with strict spring physics (`type: "spring", stiffness: 400, damping: 30`).

---

## 2. Tech Stack Mandate (Strict)

*   **Framework:** React 18 + Vite (or Next.js for high-impact SEO).
*   **Styling:** Tailwind CSS (Utility-first).
*   **Animation:** **Framer Motion** (Mandatory for all view transitions).
*   **Icons:** Lucide React (Stroke width: 1.5px for elegance).
*   **Fonts:** `Inter` (Variable weight), with tight tracking (`-0.02em`) for headers to give that modern "tech" look.

---

## 3. UI/UX & Component Specification

### 3.1 Global Navigation (The "Command Center")
**Style:** Sticky, floating pill shape (not full width).
*   **Appearance:** A centered, floating capsule with glassmorphism (`bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full`).
*   **Items:** Logo (Left), Links (Center), CTA (Right).
*   **Interaction:** Links glow on hover. The "Request Access" button uses a **"Shimmering Border"** effect.

### 3.2 Hero Section (The "Hook")
**Concept:** "The Portal".
*   **Background:** An animated "Northern Lights" mesh gradient of Teal/Purple moving slowly behind the text.
*   **Typography:** Massive H1 (72px+). "Your Pet's **[Digital Passport]**". The bracketed text uses a background-clip gradient that animates horizontally.
*   **Visual:** A **3D Tilt-Effect iPhone**. As the user moves their mouse, the phone tilts slightly (`perspective: 1000px`, `rotateX/Y`).
*   **Social Proof:** A "stacked avatar" row of 3 users + "Trusted by 500+ Early Access Users", fading in below the CTA.

### 3.3 The "Bento Grid" Features (Passport)
**Concept:** "Everything in its place."
*   **Layout:** A strict 3-column / 2-row grid of cards.
*   **Card Style:** Dark glass cards.
*   **Hover Effect:** **"Spotlight Effect"**. A radial gradient follows the mouse cursor *inside* the card border, revealing the edge (using `framer-motion` `useMotionTemplate`).
*   **Content:**
    *   *Large Tile (2x2):* "Vaccination Tracker" showing a live-animated timeline.
    *   *Tall Tile:* "Vet History" showing a scrolling list of visits.
    *   *Small Tiles:* Icons for Mediation, Documents, Travel.

### 3.4 AI Features (The "Magic")
**Concept:** "Interactive Demo".
*   **UX:** A horizontal tab bar ("OCR", "Assistant", "Voice").
*   **Interaction:** Clicking "OCR" doesn't just switch text. It plays a **Lottie Animation** or video loop of a document being scanned and data popping out.
*   **Transition:** Smooth `layoutId` transitions in Framer Motion so the active tab pill glides to the new selection.

### 3.5 Ecosystem (The "Constellation")
**Concept:** "Connected Nodes".
*   **Visual:** An interactive SVG map. A central "Pet" node is connected by pulsing lines to "Vets", "Insurance", "Walkers".
*   **Interaction:** Hovering a node (e.g., "Vets") dims the others and highlights the connection line in bright Teal.
*   **Mobile:** Converts to a horizontal swipeable carousel of cards.

### 3.6 Testimonials & Trust (The "Wall of Love")
**Concept:** "Infinite Scroll".
*   **Layout:** Two rows of testimonials scrolling in opposite directions (Marquee effect).
*   **Style:** Minimal cards with user avatar, name, and a verified checkmark.

### 3.7 Footer (The "Map")
**Style:** Clean, 4-column layout.
*   **Details:** Big "Waggli" logo watermark in the background (`opacity-5`).
*   **Input:** "Subscribe to updates" field with an arrow button that animates in only when the user types.

---

## 4. Animation Bible (Framer Motion)

Every engineer must adhere to these physics:

*   **Entrance:** `initial={{ opacity: 0, y: 20 }}` `animate={{ opacity: 1, y: 0 }}` `transition={{ duration: 0.5, ease: "easeOut" }}`.
*   **Hover (Cards):** `whileHover={{ y: -5, scale: 1.01 }}`.
*   **Tap (Buttons):** `whileTap={{ scale: 0.95 }}`.
*   **Stagger:** List items must stagger in (`staggerChildren: 0.1`).

---

## 5. Content Mapping (from `en.json`)

*   **Hero H1:** "Your Pet's Digital Passport in One App"
*   **Hero Sub:** "Be among the first to experience the future of pet care..."
*   **CTA:** "Join The Beta"
*   (Refer to `waggli_website_specification.md` v3.0 for the full text bible).

---

## 6. Implementation Steps for Redesign

1.  **Foundation:** Set up `Tailwind Config` with the exact `BRAND_GUIDELINES.md` colors (`#10B981`, `#0F172A`).
2.  **Typography**: Implement `Inter` with custom letter-spacing utility classes (`tracking-tight`).
3.  **Component Library**: Build the "Glass Card" and "Spotlight Card" primitives first.
4.  **Section Build**: Assemble Hero, Bento Grid, and Ecosystem using the primitives.
5.  **Polish:** Apply Framer Motion entrance animations to *everything*.

---

**This document represents the target state: A stunning, animated, award-winning interface that defines Waggli as the leader in AI Pet Health.**
