# Waggli Brand Guidelines

## Brand Overview

**Brand Name:** Waggli  
**Tagline:** "Happy pets, healthy lives"  
**Domain:** waggli.app  
**Industry:** Pet Health Technology (AI-powered digital pet passport)

---

## Brand Logo Assets

### Primary Icon
![Waggli App Icon](assets/logo-icon.png)

### Full Logo (Light)
![Waggli Full Logo](assets/logo-full.png)

### Full Logo (Dark Mode)
![Waggli Dark Logo](assets/logo-dark.png)

---

## Social Media Branding

### Twitter / X Header
![Twitter Header](assets/social/twitter-header.png)

### LinkedIn Banner
![LinkedIn Banner](assets/social/linkedin-banner.png)

### Open Graph (Link Preview)
![Open Graph Image](assets/social/og-image.png)

---

## Logo Concept

### Primary Logo
**Design Description:**
- Stylized letter "W" incorporating a wagging dog tail motion
- Curved, friendly lines suggesting movement and happiness
- The tail creates a wave/wag pattern from right to left
- Clean, modern, minimal aesthetic

**Icon Variations:**
1. **Full Logo:** Icon + "waggli" wordmark
2. **App Icon:** Icon only (square, for mobile)
3. **Favicon:** Simplified icon (16x16, 32x32)

### Logo Design Prompts
Use these with Figma, Canva, or AI design tools:

```
Primary Logo:
"Modern minimalist logo for Waggli pet health app. 
Stylized happy dog tail wagging motion integrated with letter W. 
Gradient from teal (#10B981) to purple (#7C3AED). 
Clean vector style. Include wordmark 'waggli' in Inter or Poppins font."

App Icon:
"Square app icon for Waggli. Cute stylized paw or happy dog face 
with wagging motion lines. Teal-to-purple gradient background. 
Minimal, works at 1024x1024 down to 48x48."
```

---

## Color Palette

### Primary Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Waggli Teal** | #10B981 | rgb(16, 185, 129) | Primary accent, CTAs |
| **Waggli Purple** | #7C3AED | rgb(124, 58, 237) | Secondary accent |
| **Waggli Gradient** | #10B981 → #7C3AED | - | Logo, highlights |

### Neutral Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Dark** | #0F172A | Dark mode background |
| **Slate 800** | #1E293B | Cards, dark surfaces |
| **Slate 600** | #475569 | Secondary text |
| **Slate 400** | #94A3B8 | Muted text |
| **White** | #FFFFFF | Light background |
| **Gray 50** | #F8FAFC | Light surfaces |

### Semantic Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Success** | #22C55E | Positive actions |
| **Warning** | #F59E0B | Alerts |
| **Error** | #EF4444 | Errors |
| **Info** | #3B82F6 | Information |

---

## Typography

### Primary Font: Inter
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

| Style | Weight | Size | Usage |
|-------|--------|------|-------|
| **Display** | 700 | 48-64px | Hero headlines |
| **Heading 1** | 600 | 32-40px | Page titles |
| **Heading 2** | 600 | 24-28px | Section titles |
| **Heading 3** | 600 | 20px | Card titles |
| **Body** | 400 | 16px | Main text |
| **Small** | 400 | 14px | Captions |
| **Micro** | 500 | 12px | Labels, badges |

### Alternative Font: Poppins (for marketing)
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
```

---

## Logo Usage

### Clear Space
- Minimum padding around logo: 1x height of the icon
- Never stretch, rotate, or distort

### Minimum Sizes
- Full logo: 120px width minimum
- Icon only: 32px minimum
- Favicon: 16px

### Logo on Backgrounds
| Background | Logo Version |
|------------|--------------|
| White/Light | Full color gradient |
| Dark/Black | White version or gradient on dark |
| Colored | White version only |
| Photo | White version with shadow/glow |

---

## App Icon Specifications

### iOS App Icon
- **Size:** 1024x1024px (master)
- **Format:** PNG, no alpha
- **Corners:** Square (iOS rounds automatically)

### Android App Icon
- **Adaptive Icon:** 108x108dp with 72dp safe zone
- **Format:** PNG
- **Background:** Solid or gradient

### Favicon
- **Sizes:** 16x16, 32x32, 180x180 (Apple Touch)
- **Format:** ICO, PNG

---

## UI Components Style

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #10B981, #7C3AED);
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  color: white;
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  border: 2px solid #10B981;
  border-radius: 12px;
  color: #10B981;
}
```

### Cards
```css
.card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.card-dark {
  background: #1E293B;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Input Fields
```css
.input {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
}

.input:focus {
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
```

---

## Photography Style

### Pet Photos
- Natural, candid moments
- Warm, soft lighting
- Happy, healthy-looking pets
- Diverse pet types (dogs, cats, rabbits, etc.)
- Real environments (homes, parks, vet visits)

### Avoid
- Stock-looking staged photos
- Sad or sick-looking animals
- Overly edited/filtered images
- Cluttered backgrounds

---

## Iconography

### Style
- Line icons (2px stroke)
- Rounded corners
- Consistent 24x24px base grid
- Use Lucide React or Feather Icons

### Custom Icons Needed
- Pet paw (filled + outline)
- Wagging tail
- Pet passport/ID
- Health records
- Vaccination syringe
- Calendar/reminder
- Share/collaboration

---

## Voice & Tone

### Brand Personality
- **Friendly:** Approachable, warm, caring
- **Trustworthy:** Reliable, professional, secure
- **Modern:** Tech-savvy, innovative, smart
- **Playful:** Fun but not silly, energetic

### Writing Guidelines
| Do | Don't |
|----|-------|
| "Your pet's health, simplified" | "A solution for pet health management" |
| "Track Max's vaccinations" | "Track your pet's vaccinations" |
| "Get started in 2 minutes" | "Quick and easy onboarding" |
| "Join 10,000+ pet parents" | "Join our community" |

---

## Brand Assets Needed

### Logo Files (to create)
- [ ] waggli-logo-primary.svg
- [ ] waggli-logo-white.svg
- [ ] waggli-logo-dark.svg
- [ ] waggli-icon-1024.png
- [ ] waggli-icon-512.png
- [ ] waggli-icon-192.png
- [ ] waggli-icon-48.png
- [ ] waggli-favicon.ico

### Social Media
- [ ] Facebook cover (1200x630)
- [ ] Instagram profile (400x400)
- [ ] Twitter header (1500x500)
- [ ] LinkedIn banner (1584x396)

### Marketing
- [ ] App Store screenshots (iPhone, iPad)
- [ ] Play Store feature graphic
- [ ] Open Graph image (1200x630)
- [ ] Email header template

---

## CSS Variables (for implementation)

```css
:root {
  /* Primary */
  --waggli-teal: #10B981;
  --waggli-purple: #7C3AED;
  --waggli-gradient: linear-gradient(135deg, #10B981, #7C3AED);
  
  /* Neutral */
  --waggli-dark: #0F172A;
  --waggli-slate-800: #1E293B;
  --waggli-slate-600: #475569;
  --waggli-slate-400: #94A3B8;
  --waggli-white: #FFFFFF;
  --waggli-gray-50: #F8FAFC;
  
  /* Semantic */
  --waggli-success: #22C55E;
  --waggli-warning: #F59E0B;
  --waggli-error: #EF4444;
  --waggli-info: #3B82F6;
  
  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

---

## Quick Reference

**Colors to remember:**
- Teal: `#10B981`
- Purple: `#7C3AED`
- Dark: `#0F172A`

**Font:** Inter (Google Fonts)

**Border radius:** 12-16px for most elements

**Tagline:** "Happy pets, healthy lives"

---

**Document Version:** 1.0  
**Last Updated:** January 11, 2026  
**Brand:** Waggli (waggli.app)
