# Pet Passport Tab - UI/UX Design Specification

**Document Version:** 1.0  
**Created:** January 10, 2026  
**Purpose:** Complete UI/UX design guidelines for Pet Passport tab

---

## DESIGN PRINCIPLES

### 1. Information Hierarchy
- **Critical First:** Emergency info and health status at top
- **Grouped Logically:** Related information in same widget
- **Scannable:** Clear headings, visual separators, whitespace
- **Actionable:** Clear CTAs for next steps

### 2. Visual Consistency
- Consistent spacing system (8px grid)
- Standard widget padding (24px)
- Unified typography scale
- Cohesive color palette

### 3. Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 1024px
- Flexible layouts
- Touch-friendly targets (min 44px)

---

## COLOR SYSTEM

### Health Status Colors
```css
<!-- Excellent -->
--color-excellent: #22c55e;
--color-excellent-bg: #f0fdf4;
--color-excellent-border: #86efac;

<!-- Good -->
--color-good: #14b8a6;
--color-good-bg: #f0fdfa;
--color-good-border: #5eead4;

<!-- Fair -->
--color-fair: #f97316;
--color-fair-bg: #fef3c7;
--color-fair-border: #fdba74;

<!-- Poor -->
--color-poor: #ef4444;
--color-poor-bg: #fef2f2;
--color-poor-border: #fca5a5;

<!-- Critical -->
--color-critical: #dc2626;
--color-critical-bg: #fef2f2;
--color-critical-border: #f87171;
```

### Priority Colors
```css
--color-urgent: #dc2626;      /* Red */
--color-high: #f97316;         /* Orange */
--color-medium: #eab308;       /* Yellow */
--color-low: #3b82f6;          /* Blue */
```

### Severity Colors (Allergies, Risks
```css
--color-severe: #dc2626;       /* Red */
--color-moderate: #f97316;     /* Orange */
--color-mild: #22c55e;         /* Green */
```

### Base UI Colors
```css
--color-primary: #14b8a6;      /* Teal */
--color-surface: #ffffff;      /* White */
--color-border: #e2e8f0;       /* Light gray */
--color-text-primary: #1a202c; /* Dark gray */
--color-text-secondary: #718096; /* Medium gray */
--color-bg: #f7fafc;           /* Background */
```

---

## TYPOGRAPHY SYSTEM

### Font Family
```css
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-family-mono: "SF Mono", Monaco, "Courier New", monospace;
```

### Font Sizes
```css
--text-xs: 11px;    /* Metadata, timestamps */
--text-sm: 12px;    /* Secondary text, labels */
--text-base: 14px;  /* Body text, data values */
--text-lg: 16px;    /* Important text */
--text-xl: 18px;    /* Section titles */
--text-2xl: 20px;   /* Widget titles */
--text-3xl: 24px;   /* Metric values */
--text-4xl: 32px;   /* Large numbers */
--text-5xl: 48px;   /* Health score */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## SPACING SYSTEM (8px grid)

```css
--space-1: 4px;    /* 0.5 × 8 */
--space-2: 8px;    /* 1 × 8 */
--space-3: 12px;   /* 1.5 × 8 */
--space-4: 16px;   /* 2 × 8 */
--space-5: 20px;   /* 2.5 × 8 */
--space-6: 24px;   /* 3 × 8 */
--space-8: 32px;   /* 4 × 8 */
--space-10: 40px;  /* 5 × 8 */
--space-12: 48px;  /* 6 × 8 */
--space-16: 64px;  /* 8 × 8 */
```

### Usage Guidelines
- **Widget padding:** 24px (--space-6)
- **Section gap:** 20px (--space-5)
- **Card padding:** 16px (--space-4)
- **Element gap:** 8px (--space-2)
- **Inline spacing:** 4px (--space-1)

---

## BORDER RADIUS

```css
--radius-sm: 6px;   /* Small elements */
--radius-base: 8px; /* Buttons, inputs */
--radius-md: 10px;  /* Cards */
--radius-lg: 12px;  /* Widgets */
--radius-xl: 16px;  /* Modals */
--radius-full: 9999px; /* Pills, circles */
```

---

## SHADOWS

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
               0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
/* Default: < 640px (mobile) */

/* Tablet */
@media (min-width: 640px) {
  /* 2-column layouts, larger text */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 3-column layouts, sidebar */
}

/* Large Desktop */
@media (min-width: 1280px) {
  /* Max-width containers, more spacing */
}
```

### Layout Adjustments

**Mobile (<640px)**
- Single column stacking
- Full-width widgets
- Smaller padding (16px)
- Icon-only buttons
- Collapsible sections

**Tablet (640-1024px)**
- 2-column grid for metric cards
- Medium padding (20px)
- Abbreviated labels
- Side-by-side buttons

**Desktop (>1024px)**
- 3-column grid for metric cards
- Full padding (24px)
- Full labels
- Horizontal button rows

---

## COMPONENT PATTERNS

### Widget Container
```css
.passport-widget {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-5);
  box-shadow: var(--shadow-sm);
}
```

### Widget Title
```css
.widget-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-4);
}
```

### Data Row (Label-Value Pair)
```css
.data-row {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.data-label {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.data-value {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  color: var(--color-text-primary);
}
```

### Metric Card
```css
.metric-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  text-align: center;
}

.metric-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.metric-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Status Badge
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.status-current {
  background: var(--color-excellent-bg);
  color: var(--color-excellent);
  border: 1px solid var(--color-excellent-border);
}

.status-overdue {
  background: var(--color-poor-bg);
  color: var(--color-poor);
  border: 1px solid var(--color-poor-border);
}
```

### Table Styles
```css
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-align: left;
  padding: var(--space-3);
  border-bottom: 2px solid var(--color-border);
}

.data-table td {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  padding: var(--space-4) var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.data-table tr:hover {
  background: var(--color-bg);
}
```

---

## INTERACTION STATES

### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #0d9488; /* Darker teal */
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
}
```

### Links
```css
.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: color 0.2s;
}

.link:hover {
  color: #0d9488;
  text-decoration: underline;
}
```

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## ANIMATIONS

### Smooth Transitions
```css
.transition-base {
  transition: all 0.2s ease-in-out;
}

.transition-colors {
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
```

### Progress Bar Fill
```css
@keyframes fill {
  from {
    width: 0;
  }
  to {
    width: var(--fill-percentage);
  }
}

.progress-fill {
  animation: fill 1s ease-out forwards;
}
```

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

---

## ACCESSIBILITY

### WCAG 2.1 AAA Compliance

**Color Contrast**
- Text on background: 7:1 (AAA)
- Large text: 4.5:1 (AA)
- UI components: 3:1

**Touch Targets**
- Minimum: 44px × 44px
- Spacing: 8px minimum between targets

**Keyboard Navigation**
- Tab order: Logical flow
- Focus indicators: 2px solid, offset 2px
- Skip links: Available

**Screen Readers**
- Semantic HTML: `<article>`, `<section>`, `<header>`
- ARIA labels: All interactive elements
- Alt text: All images
- Live regions: Dynamic content

### Example ARIA Implementation
```html
<article role="region" aria-label="Pet Vaccination History">
  <h2 id="vaccination-title">Vaccination History</h2>
  <table aria-labelledby="vaccination-title">
    <thead>
      <tr>
        <th scope="col">Vaccine Name</th>
        <th scope="col">Date Given</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Rabies</td>
        <td>March 15, 2023</td>
        <td>
          <span class="status-current" role="status" aria-label="Current">
            ✓ Current
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</article>
```

---

## PRINT STYLES

```css
@media print {
  /* Hide interactive elements */
  .btn, .link, .action-buttons {
    display: none;
  }
  
  /* Remove shadows and borders */
  .passport-widget {
    box-shadow: none;
    border: none;
    page-break-inside: avoid;
  }
  
  /* Black and white */
  * {
    color: #000 !important;
    background: #fff !important;
  }
  
  /* Page breaks */
  .widget-title {
    page-break-after: avoid;
  }
  
  table {
    page-break-inside: avoid;
  }
}
```

---

## DARK MODE SUPPORT

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #1a202c;
    --color-border: #2d3748;
    --color-text-primary: #f7fafc;
    --color-text-secondary: #a0aec0;
    --color-bg: #171923;
  }
  
  /* Adjust health colors for dark mode */
  --color-excellent-bg: rgba(34, 197, 94, 0.1);
  --color-good-bg: rgba(20, 184, 166, 0.1);
  --color-fair-bg: rgba(249, 115, 22, 0.1);
  --color-poor-bg: rgba(239, 68, 68, 0.1);
}
```

---

## LOADING STATES

### Skeleton Loaders
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### Spinners
```css
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## ERROR STATES

### Inline Errors
```css
.error-message {
  color: var(--color-poor);
  font-size: var(--text-sm);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.error-icon {
  color: var(--color-poor);
}
```

### Alert Banners
```css
.alert {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.alert-error {
  background: var(--color-poor-bg);
  border-left: 4px solid var(--color-poor);
}

.alert-warning {
  background: var(--color-fair-bg);
  border-left: 4px solid var(--color-fair);
}

.alert-success {
  background: var(--color-excellent-bg);
  border-left: 4px solid var(--color-excellent);
}
```

---

## MOBILE-SPECIFIC PATTERNS

### Bottom Sheet (Mobile Actions)
```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-top-left-radius: var(--radius-xl);
  border-top-right-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-xl);
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

.bottom-sheet.open {
  transform: translateY(0);
}
```

### Swipe Gestures
- Left swipe: Archive/delete
- Right swipe: Edit/view details
- Pull down: Refresh
