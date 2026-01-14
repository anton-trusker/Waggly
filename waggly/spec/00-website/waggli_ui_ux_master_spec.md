# Waggli UI/UX Master Specification
**The "Modern Linear" Design System for Beta Launch**

**Role:** Frontend Architecture & Design Blueprint
**Target Audience:** Senior Frontend Engineers / UI Designers
**Context:** Implements the text from `waggli_content_implementation_guide.md` using the structure of `waggli_website_specification.md`, but elevates the **Visual Quality** to 2026 standards.

---

## 1. Design Philosophy: "Fluid Intelligence"

The interface must feel **alive, liquid, and intelligent**. We move away from static "blocks" to fluid sections that breathe.

### 1.1 The "Nordic Dark" Theme
*   **Background Base:** `#0F172A` (Slate 900) - Deep, rich, blue-black. Not pure black.
*   **Ambient Light:** "Aurora Blurs". Large, animated blobs of Teal (`#10B981`) and Purple (`#7C3AED`) floating behind glass panels.
    *   *Implementation:* `div` with `blur-3xl`, `opacity-20`, `animate-pulse-slow`.
*   **Glassmorphism 3.0:**
    *   **Surface:** `bg-slate-900/40` (High transparency).
    *   **Blur:** `backdrop-blur-xl` (Heavy blur).
    *   **Border:** `border-white/10` (Subtle).
    *   **Highlight:** Top-border gradient `border-t-white/20`.

### 1.2 Animation Physics (Framer Motion)
*   **Entrance:** Soft spring. `type: "spring", stiffness: 260, damping: 20`.
*   **Hover:** "Lift & Glow". `y: -4px`, `shadow-lg`, `border-teal-500/30`.
*   **Scroll:** "Parallax Reveal". Elements shouldn't just fade in; they should unmask or slide up with a stagger.

---

## 2. Component Specifications

### 2.1 The "Floating" Navbar (`Navbar.tsx`)
*   **Concept:** A centralized command pill, detaching from the top after scroll.
*   **Desktop Layout:** [Logo] -- [ Links ] -- [ CTA ] centered in a `max-w-4xl` glass capsule.
*   **Animation:**
    *   *On Scroll:* The navbar shrinks slightly in height and increases blur opacity.
*   **Interaction:** Links use a "highlight pill" background that slides behind the active item (like Vercel headers).

### 2.2 The "Cinematic" Hero (`Hero.tsx`)
*   **Layout:** Split 50/50 Desktop.
*   **Left (Content):**
    *   **H1:** Massive typography (64px+). The words "Digital Passport" use a `bg-clip-text` gradient (Teal -> Purple) that animates horizontally (`animate-text-shimmer`).
    *   **Badge:** "Pill" shape with a glowing border.
*   **Right (Visual):**
    *   **3D Tilt Mockup:** The iPhone screenshot isn't static. Wrap it in `<motion.div>` with `useMotionValue` for mouse-aware 3D tilt (Rotation X/Y follows cursor).
*   **Background:** A "Mesh Gradient" canvas or video loop that is heavily blurred, providing a dynamic "living" backdrop.

### 2.3 The "Bento" Passport Grid (`PassportFeatures.tsx`)
*   **Grid Specs:** CSS Grid with `grid-template-columns: repeat(3, 1fr)`.
*   **Gap:** `gap-6` (24px).
*   **Card Design:** "Spotlight Cards".
    *   *Effect:* As the mouse moves over the grid, a radial gradient glow follows the cursor *across* card boundaries (using a shared mouse position context).
*   **Key Cards:**
    *   **Vaccines (Large):** Contains a micro-chart or completion ring animation.
    *   **Privacy (Small):** Shows a "Lock" icon that animates from open to closed on hover.
    *   **Travel (Wide):** Background Map illustration that pans slowly.

### 2.4 The "Holographic" AI Tabs (`AIFeatures.tsx`)
*   **Layout:** Vertical Tabs (Left) + Interactive Visual (Right).
*   **Tab Interaction:**
    *   Active tab has a "Glowing Left Border" (Teal).
    *   Inactive tabs are `text-slate-400` and `hover:text-white`.
*   **Right Visual Panel:**
    *   **OCR Mode:** Shows a scanning line (`border-b-2 border-teal-400`) moving down a document image.
    *   **Voice Mode:** Shows an audio waveform visualizer (Lottie animation) reacting to simulated sound.
*   **Mobile:** Collapses to a horizontal Swipeable Tab bar.

### 2.5 The "Living" Ecosystem Map (`Ecosystem.tsx`)
*   **Concept:** Instead of a list, use a *connected node graph*.
*   **Visual:** Central Node = "Your Pet". Outer Nodes = Vets, Insurance, etc.
*   **Lines:** SVG lines connecting nodes. Use `pathLength` animation to draw lines when the section scrolls into view.
*   **Hover:** Hovering "Vets" dims all other nodes and pulses the Vet node + connection line.
*   **Roadmap Badge:** A "Tag" component rotated -15deg on the corner of the cards, saying "2026".

### 2.6 The "Persona" Cards (`UserTypes.tsx`)
*   **Layout:** Horizontal Scroll Snap on Mobile, 4-col Grid on Desktop.
*   **Card Style:** "Frosted Glass" with a high-quality photo background (low opacity) that comes into full color on hover.
*   **Typography:** Large serif headers for the Persona Name (e.g., "The Traveler") to differentiate from the tech-heavy rest of the site.

### 2.7 The "Conversion" Dialog (`BetaAccessDialog.tsx`)
*   **Trigger:** Any "Join Waitlist" button.
*   **Animation:** Opens from the center with a spring pop. Background overlay: `backdrop-blur-md bg-black/60`.
*   **Form Design:**
    *   **Inputs:** Minimal, border-bottom only (Material style) OR filled `bg-slate-800` with floating labels.
    *   **Success State:** Confetti explosion (using `canvas-confetti`) upon 200 OK response.

---

## 3. Global CSS & Tailwind Config Requirements
*   Add strict font preferences:
    ```js
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Cal Sans', 'Inter', 'sans-serif'], // For H1 headers
    }
    ```
*   Define custom animation utilities in `tailwind.config.js`:
    *   `animation-blob`: For the background aurora.
    *   `animation-shimmer`: For the text gradients.

---

## 4. Mobile Responsiveness Strategy
*   **"Thumb Zone" Navigation:** On mobile, vital interactions (CTAs) should be in the bottom 30% of the screen.
*   **Ecosystem:** Switch from "Node Graph" to "Carousel Cards".
*   **Typography:** Scale down H1 from `text-7xl` (Desktop) to `text-4xl` (Mobile) to prevent wrapping awkwardness.

This document serves as the **Design Authority**. If there is a conflict between this and the general spec, **this visual direction wins** for the UI implementation.
