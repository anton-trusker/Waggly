# Pet Passport Tab - Project-Aligned Design System

**Document Version:** 2.0  
**Created:** January 10, 2026  
**Purpose:** Complete UI/UX design guidelines aligned with Pawzly's actual design system

---

## DESIGN SYSTEM OVERVIEW

This document is based on the **actual Tailwind configuration** used in Pawzly's mobile and desktop designs.

### Key Differences from Generic Spec:
- ✅ Uses **actual project colors** (Green primary for mobile, Purple primary for desktop)
- ✅ Uses **actual fonts** (Inter, Plus Jakarta Sans)
- ✅ Uses **actual border radius values** from Tailwind config
- ✅ Matches **existing component patterns** from pet profile
- ✅ Consistent with **current mobile & desktop designs**

---

## COLOR SYSTEM (ACTUAL PROJECT COLORS)

### Mobile Theme (Current Implementation)
```javascript
// From: .trae/Designs/mobile/Pet_profile/pet_prof/pet_profile:_overview_1/code.html
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#10b981",           // Green (Emerald-500)
        "primary-dark": "#059669",    // Darker green
        "background-light": "#f3f4f6", // Gray-100
        "background-dark": "#0f172a",  // Deep slate/black
        "surface-light": "#ffffff",    // White cards
        "surface-dark": "#1e293b",     // Slate-800 for cards
        "surface-darker": "#111827",   // Gray-900 for inputs
        "accent-blue": "#3b82f6",      // Blue-500
        "accent-blue-dark": "#1d4ed8", // Blue-700
        "text-light": "#1f2937",       // Gray-800
        "text-dark": "#e2e8f0",        // Slate-200
        "text-muted-light": "#6b7280", // Gray-500
        "text-muted-dark": "#94a3b8",  // Slate-400
      }
    }
  }
}
```

### Desktop Theme (Current Implementation)
```javascript
// From: .trae/Designs/web/pet_details/pet_details:_overview_tab_1/code.html
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#2C097F",            // Purple (deep purple)
        secondary: "#10B981",          // Green (emerald-500)
        "background-light": "#f6f6f8", // Light gray
        "background-dark": "#151022",  // Dark purple/black
        "card-light": "#FFFFFF",       // White
        "card-dark": "#1E293B",        // Slate-800
        "text-light": "#1F2937",       // Gray-800
        "text-dark": "#E2E8F0",        // Slate-200
        "muted-light": "#6B7280",      // Gray-500
        "muted-dark": "#94A3B8",       // Slate-400
        "border-light": "#E5E7EB",     // Gray-200
        "border-dark": "#334155",      // Slate-700
      }
    }
  }
}
```

### **PASSPORT TAB COLOR STRATEGY**

For the Passport tab, we'll use:
- **Mobile:** Green primary (#10b981) - matches current mobile design
- **Desktop:** Purple primary (#2C097F) with green secondary - matches current desktop
- **Health Status Colors:** Keep as defined (excellent, good, fair, poor)

```css
/* Health Status Colors (Universal) */
--color-health-excellent: #22c55e;  /* Green-500 */
--color-health-good: #14b8a6;       /* Teal-500 */
--color-health-fair: #f97316;       /* Orange-500 */
--color-health-poor: #ef4444;       /* Red-500 */
--color-health-critical: #dc2626;   /* Red-600 */

/* Mobile-First Primary */
--color-primary-mobile: #10b981;    /* Green */
--color-accent-mobile: #3b82f6;     /* Blue */

/* Desktop Primary */
--color-primary-desktop: #2C097F;   /* Purple */
--color-secondary-desktop: #10B981; /* Green */
```

---

## TYPOGRAPHY SYSTEM (ACTUAL PROJECT FONTS)

### Font Families
```javascript
// Mobile
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  display: ['Inter', 'sans-serif'],
}

// Desktop
fontFamily: {
  display: "Plus Jakarta Sans",
  body: ["Inter", "sans-serif"],
}
```

### **PASSPORT TAB TYPOGRAPHY**

```css
/* Headers (Desktop uses Plus Jakarta Sans) */
.passport-title-desktop {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 700;
  font-size: 24px;
}

/* Headers (Mobile uses Inter) */
.passport-title-mobile {
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 18px;
}

/* Body Text (Both use Inter) */
.passport-body {
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
}

/* Data Labels */
.passport-label {
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted-light);
}

/* Data Values */
.passport-value {
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--text-light);
}

/* Monospace (IDs, Microchip) */
.passport-mono {
  font-family: "SF Mono", Monaco, "Courier New", monospace;
  font-weight: 500;
}
```

---

## BORDER RADIUS (ACTUAL PROJECT VALUES)

```javascript
// Mobile
borderRadius: {
  DEFAULT: "0.5rem",    // 8px
  'xl': '1rem',         // 16px
  '2xl': '1.5rem',      // 24px
  '3xl': '2rem',        // 32px
}

// Desktop
borderRadius: {
  DEFAULT: "0.25rem",   // 4px
  lg: "0.5rem",         // 8px
  xl: "0.75rem",        // 12px
  full: "9999px",       // Circle
}
```

### **PASSPORT TAB USAGE**

```css
/* Mobile Widgets */
.passport-widget-mobile {
  border-radius: 1.5rem; /* 24px - rounded-3xl */
}

.passport-card-mobile {
  border-radius: 1rem;   /* 16px - rounded-2xl */
}

.passport-button-mobile {
  border-radius: 0.75rem; /* 12px - rounded-xl */
}

/* Desktop Widgets */
.passport-widget-desktop {
  border-radius: 1rem;    /* 16px - rounded-2xl */
}

.passport-card-desktop {
  border-radius: 0.75rem; /* 12px - rounded-xl */
}

.passport-button-desktop {
  border-radius: 0.5rem;  /* 8px - rounded-lg */
}
```

---

## COMPONENT PATTERNS (FROM ACTUAL DESIGNS)

### 1. Widget Container Pattern

**Mobile (from pet_profile examples):**
```html
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 border border-gray-200 dark:border-slate-700 mb-8 shadow-sm relative overflow-hidden">
  <!-- Top accent gradient -->
  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-blue opacity-50"></div>
  
  <!-- Widget content -->
</div>
```

**Desktop (from pet_details examples):**
```html
<div class="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
  <!-- Widget content -->
</div>
```

### 2. Section Title Pattern

**Mobile:**
```html
<h2 class="text-lg font-bold">Section Title</h2>
```

**Desktop:**
```html
<div class="flex items-center justify-between mb-4">
  <h3 class="text-lg font-bold">Section Title</h3>
  <button class="text-primary text-sm font-medium">Action</button>
</div>
```

### 3. Tab Navigation Pattern

**Mobile (pill style):**
```html
<div class="flex items-center space-x-1 bg-surface-light dark:bg-surface-dark p-1.5 rounded-2xl mb-6 border border-gray-200 dark:border-slate-700 shadow-sm">
  <button class="flex-1 py-2.5 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark rounded-xl transition-colors">
    Overview
  </button>
  <button class="flex-1 py-2.5 text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark rounded-xl transition-colors">
    Health
  </button>
  <button class="flex-1 py-2.5 text-xs font-bold text-white bg-surface-darker dark:bg-slate-700 shadow-md rounded-xl ring-1 ring-black/5 dark:ring-white/10">
    Passport
  </button>
</div>
```

**Desktop (underline style):**
```html
<div class="mt-8 border-b border-border-light dark:border-border-dark flex gap-6 overflow-x-auto">
  <button class="pb-3 border-b-2 border-transparent text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark font-medium px-1 whitespace-nowrap transition-colors">
    Overview
  </button>
  <button class="pb-3 border-b-2 border-transparent text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark font-medium px-1 whitespace-nowrap transition-colors">
    Health
  </button>
  <button class="pb-3 border-b-2 border-primary text-primary font-medium px-1 whitespace-nowrap">
    Passport
  </button>
</div>
```

### 4. Action Button Patterns

**Mobile Primary Button:**
```html
<button class="w-full bg-text-light dark:bg-white text-white dark:text-background-dark font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all">
  Save Document
</button>
```

**Desktop Primary Button:**
```html
<button class="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-colors">
  <span class="material-icons-round text-sm">download</span>
  Download PDF
</button>
```

###5. Metric Card Pattern

**Mobile:**
```html
<div class="group flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-surface-darker border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary active:scale-95 transition-all">
  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
    <span class="material-icons-round text-primary text-2xl">icon</span>
  </div>
  <span class="text-xs font-bold">Label</span>
</div>
```

**Desktop:**
```html
<div class="flex flex-col items-center justify-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all hover:shadow-md group">
  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
    <span class="material-icons-round">icon</span>
  </div>
  <span class="text-xs font-medium text-muted-light dark:text-muted-dark">Label</span>
</div>
```

### 6. Data Row / Info Field Pattern

**Mobile (from documents page):**
```html
<div>
  <label class="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-1 block pl-1">
    Label
  </label>
  <input class="w-full bg-background-light dark:bg-surface-darker border border-gray-200 dark:border-slate-600 text-text-light dark:text-text-dark text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50" />
</div>
```

**Desktop (from key info widget):**
```html
<div class="bg-background-light dark:bg-slate-800/50 p-3 rounded-xl">
  <p class="text-xs text-muted-light dark:text-muted-dark uppercase mb-1">Label</p>
  <p class="font-medium">Value</p>
</div>
```

### 7. Card/List Item Pattern

**Mobile (from documents list):**
```html
<div class="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:border-pink-500/30 transition-colors group">
  <div class="flex items-start justify-between mb-3">
    <div class="flex items-start space-x-3">
      <div class="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-pink-500 shrink-0 shadow-sm">
        <span class="material-icons-round">icon</span>
      </div>
      <div>
        <h3 class="font-bold text-sm text-text-light dark:text-text-dark">Title</h3>
        <p class="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5 flex items-center">
          <span class="material-icons-round text-[10px] mr-1">calendar_today</span>
          Date • Details
        </p>
      </div>
    </div>
    <button class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center text-text-muted-light dark:text-text-muted-dark transition-colors">
      <span class="material-icons-round">more_vert</span>
    </button>
  </div>
</div>
```

**Desktop:**
```html
<div class="flex items-center gap-3 p-3 bg-background-light dark:bg-slate-800/50 rounded-xl group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
  <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
    <span class="material-icons-round">icon</span>
  </div>
  <div class="flex-1">
    <p class="font-semibold text-sm">Title</p>
    <p class="text-xs text-muted-light dark:text-muted-dark">Details</p>
  </div>
  <span class="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded">Badge</span>
</div>
```

---

## PASSPORT TAB COMPLETE IMPLEMENTATION

### Passport Header Widget (Mobile)

```html
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 border border-gray-200 dark:border-slate-700 mb-6 shadow-sm relative overflow-hidden">
  <!-- Top gradient -->
  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-blue opacity-50"></div>
  
  <div class="flex items-center gap-2 mb-4">
    <span class="material-icons-round text-primary text-2xl">qr_code_2</span>
    <h2 class="text-lg font-bold">🛂 Digital Pet Passport</h2>
  </div>
  
  <div class="space-y-2 mb-5">
    <div class="flex items-center justify-between text-sm">
      <span class="text-text-muted-light dark:text-text-muted-dark">Passport ID:</span>
      <span class="font-mono font-semibold text-primary">PP-12345678</span>
    </div>
    <div class="flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
      <span>Generated:</span>
      <span>January 10, 2026</span>
    </div>
  </div>
  
  <!-- Action buttons grid -->
  <div class="grid grid-cols-2 gap-3">
    <button class="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-surface-darker border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary active:scale-95 transition-all group">
      <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
        <span class="material-icons-round text-primary text-2xl">download</span>
      </div>
      <span class="text-xs font-bold">Download PDF</span>
    </button>
    
    <button class="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-surface-darker border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-accent-blue dark:hover:border-accent-blue active:scale-95 transition-all group">
      <div class="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center mb-2 group-hover:bg-accent-blue/20 transition-colors">
        <span class="material-icons-round text-accent-blue text-2xl">print</span>
      </div>
      <span class="text-xs font-bold">Print</span>
    </button>
    
    <button class="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-surface-darker border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 active:scale-95 transition-all group">
      <div class="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 group-hover:bg-purple-500/20 transition-colors">
        <span class="material-icons-round text-purple-500 text-2xl">qr_code_scanner</span>
      </div>
      <span class="text-xs font-bold">Generate QR</span>
    </button>
    
    <button class="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-surface-darker border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 active:scale-95 transition-all group">
      <div class="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 group-hover:bg-orange-500/20 transition-colors">
        <span class="material-icons-round text-orange-500 text-2xl">share</span>
      </div>
      <span class="text-xs font-bold">Share</span>
    </button>
  </div>
</div>
```

### Passport Header Widget (Desktop)

```html
<div class="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark mb-6">
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <span class="material-icons-round text-primary text-2xl">qr_code_2</span>
      </div>
      <div>
        <h2 class="text-xl font-bold text-text-light dark:text-text-dark">Digital Pet Passport</h2>
        <p class="text-sm text-muted-light dark:text-muted-dark">Passport ID: <span class="font-mono text-primary">PP-12345678</span></p>
      </div>
    </div>
    <div class="text-right text-xs text-muted-light dark:text-muted-dark">
      <p>Generated: January 10, 2026</p>
      <p>Last Updated: Today, 09:00 AM</p>
    </div>
  </div>
  
  <!-- Action buttons -->
  <div class="grid grid-cols-4 gap-3">
    <button class="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-colors">
      <span class="material-icons-round text-lg">download</span>
      Download PDF
    </button>
    
    <button class="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
      <span class="material-icons-round text-lg">print</span>
      Print
    </button>
    
    <button class="flex items-center justify-center gap-2 px-4 py-3 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
      <span class="material-icons-round text-lg">qr_code_scanner</span>
      Generate QR
    </button>
    
    <button class="flex items-center justify-center gap-2 px-4 py-3 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">
      <span class="material-icons-round text-lg">share</span>
      Share
    </button>
  </div>
</div>
```

### Pet Identification Widget (Mobile)

```html
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 border border-gray-200 dark:border-slate-700 mb-6 shadow-sm">
  <h3 class="text-lg font-bold mb-4">Pet Identification</h3>
  
  <!-- Photo and basic info -->
  <div class="flex items-start gap-4 mb-5">
    <!-- Photo with health status border -->
    <div class="w-32 h-32 rounded-2xl p-1 bg-gradient-to-tr from-primary to-accent-blue shrink-0">
      <img alt="Pet Photo" class="w-full h-full object-cover rounded-xl" src="pet-photo.jpg"/>
    </div>
    
    <div class="flex-1">
      <h2 class="text-2xl font-bold mb-1">Max</h2>
      <p class="text-sm text-text-muted-light dark:text-text-muted-dark mb-3">
        Golden Retriever • Male ♂ • 5 yrs
      </p>
      
      <div class="flex flex-wrap gap-2">
        <span class="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-3 py-1 rounded-full font-medium">
          Neutered
        </span>
        <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
          Active
        </span>
      </div>
    </div>
  </div>
  
  <!-- Microchip info -->
  <div class="bg-background-light dark:bg-surface-darker p-4 rounded-xl mb-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
          <span class="material-icons-round">qr_code</span>
        </div>
        <div>
          <p class="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">Microchip ID</p>
          <p class="font-mono font-semibold text-base">982000123456789</p>
        </div>
      </div>
      <button class="text-text-muted-light dark:text-text-muted-dark hover:text-primary">
        <span class="material-icons-round">content_copy</span>
      </button>
    </div>
  </div>
  
  <!-- Additional info grid -->
  <div class="grid grid-cols-2 gap-3">
    <div class="bg-background-light dark:bg-surface-darker p-3 rounded-xl">
      <p class="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase mb-1">Date of Birth</p>
      <p class="font-medium text-sm">March 15, 2020</p>
    </div>
    <div class="bg-background-light dark:bg-surface-darker p-3 rounded-xl">
      <p class="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase mb-1">Registration ID</p>
      <p class="font-medium text-sm">AKC-123456</p>
    </div>
  </div>
</div>
```

### Pet Identification Widget (Desktop)

```html
<div class="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark mb-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-bold">Pet Identification</h3>
    <button class="text-primary text-sm font-medium">Edit</button>
  </div>
  
  <div class="flex items-start gap-6 mb-6">
    <!-- Photo -->
    <div class="relative">
      <div class="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-500">
        <img alt="Pet Photo" class="w-full h-full object-cover rounded-full border-4 border-card-light dark:border-card-dark" src="pet-photo.jpg"/>
      </div>
    </div>
    
    <!-- Basic info -->
    <div class="flex-1">
      <h1 class="text-3xl font-bold mb-1">Max</h1>
      <p class="text-muted-light dark:text-muted-dark text-lg mb-3">Golden Retriever</p>
      
      <div class="flex items-center gap-3 text-sm font-medium">
        <span class="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">5 Yrs</span>
        <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1">
          <span class="material-icons-round text-sm">male</span> Male
        </span>
        <span class="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-3 py-1 rounded-full">
          Neutered
        </span>
      </div>
    </div>
  </div>
  
  <!-- Microchip -->
  <div class="bg-background-light dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between mb-4">
    <div class="flex items-center gap-3">
      <div class="bg-blue-500/10 p-2 rounded-lg text-blue-500">
        <span class="material-icons-round text-xl">qr_code</span>
      </div>
      <div>
        <p class="text-xs text-muted-light dark:text-muted-dark uppercase tracking-wider">Microchip ID</p>
        <p class="font-mono font-medium text-lg">982000123456789</p>
      </div>
    </div>
    <button class="text-muted-light dark:text-muted-dark hover:text-primary">
      <span class="material-icons-round">content_copy</span>
    </button>
  </div>
  
  <!-- Grid info -->
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-background-light dark:bg-slate-800/50 p-3 rounded-xl">
      <p class="text-xs text-muted-light dark:text-muted-dark uppercase mb-1">Date of Birth</p>
      <p class="font-medium">March 15, 2020</p>
    </div>
    <div class="bg-background-light dark:bg-slate-800/50 p-3 rounded-xl">
      <p class="text-xs text-muted-light dark:text-muted-dark uppercase mb-1">Registration ID</p>
      <p class="font-medium">AKC-123456</p>
    </div>
    <div class="bg-background-light dark:bg-slate-800/50 p-3 rounded-xl">
      <p class="text-xs text-muted-light dark:text-muted-dark uppercase mb-1">Status</p>
      <p class="font-medium">Active</p>
    </div>
  </div>
</div>
```

---

## VACCINATION TABLE WIDGET

### Mobile Version

```html
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 border border-gray-200 dark:border-slate-700 mb-6 shadow-sm">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-bold">Vaccination History</h3>
    <span class="material-icons-round text-primary">vaccines</span>
  </div>
  
  <!-- Compliance summary -->
  <div class="grid grid-cols-3 gap-2 mb-4">
    <div class="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl text-center">
      <p class="text-2xl font-bold text-green-600 dark:text-green-400">75%</p>
      <p class="text-[10px] text-green-600 dark:text-green-400 font-semibold uppercase">Current</p>
    </div>
    <div class="bg-red-100 dark:bg-red-900/20 p-3 rounded-xl text-center">
      <p class="text-2xl font-bold text-red-600 dark:text-red-400">2</p>
      <p class="text-[10px] text-red-600 dark:text-red-400 font-semibold uppercase">Overdue</p>
    </div>
    <div class="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-xl text-center">
      <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">1</p>
      <p class="text-[10px] text-orange-600 dark:text-orange-400 font-semibold uppercase">Due Soon</p>
    </div>
  </div>
  
  <!-- Vaccination cards -->
  <div class="space-y-3">
    <!-- Current vaccine -->
    <div class="bg-background-light dark:bg-surface-darker p-4 rounded-2xl border-l-4 border-green-500">
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
            <span class="material-icons-round">vaccines</span>
          </div>
          <div>
            <h4 class="font-bold text-sm">Rabies</h4>
            <p class="text-xs text-text-muted-light dark:text-text-muted-dark">(Core)</p>
          </div>
        </div>
        <span class="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md uppercase">
          Current
        </span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs mt-3">
        <div>
          <p class="text-text-muted-light dark:text-text-muted-dark">Given:</p>
          <p class="font-semibold">Mar 15, '23</p>
        </div>
        <div>
          <p class="text-text-muted-light dark:text-text-muted-dark">Next Due:</p>
          <p class="font-semibold">Mar 15, '26</p>
        </div>
      </div>
    </div>
    
    <!-- Overdue vaccine -->
    <div class="bg-background-light dark:bg-surface-darker p-4 rounded-2xl border-l-4 border-red-500">
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
            <span class="material-icons-round">vaccines</span>
          </div>
          <div>
            <h4 class="font-bold text-sm">DHPP</h4>
            <p class="text-xs text-text-muted-light dark:text-text-muted-dark">(Core)</p>
          </div>
        </div>
        <span class="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md uppercase">
          Overdue
        </span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs mt-3">
        <div>
          <p class="text-text-muted-light dark:text-text-muted-dark">Given:</p>
          <p class="font-semibold">Apr 10, '24</p>
        </div>
        <div>
          <p class="text-text-muted-light dark:text-text-muted-dark">Overdue by:</p>
          <p class="font-semibold text-red-500">30 days</p>
        </div>
      </div>
    </div>
  </div>
  
  <button class="w-full mt-4 bg-primary text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all">
    + Add Vaccination
  </button>
</div>
```

### Desktop Version

```html
<div class="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark mb-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-bold">Vaccination History</h3>
    <button class="text-primary text-sm font-medium">See All</button>
  </div>
  
  <!-- Compliance cards -->
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
      <p class="text-3xl font-bold text-green-600 mb-1">75%</p>
      <p class="text-sm text-green-600 font-medium">Compliance</p>
    </div>
    <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
      <p class="text-3xl font-bold text-red-600 mb-1">2</p>
      <p class="text-sm text-red-600 font-medium">Overdue</p>
    </div>
    <div class="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-200 dark:border-orange-900/30">
      <p class="text-3xl font-bold text-orange-600 mb-1">1</p>
      <p class="text-sm text-orange-600 font-medium">Due Soon</p>
    </div>
  </div>
  
  <!-- Table -->
  <div class="space-y-3">
    <div class="flex items-center gap-3 p-3 bg-background-light dark:bg-slate-800/50 rounded-xl border-l-4 border-green-500">
      <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
        <span class="material-icons-round">vaccines</span>
      </div>
      <div class="flex-1">
        <p class="font-semibold text-sm">Rabies</p>
        <p class="text-xs text-muted-light dark:text-muted-dark">Valid until Mar 15, 2026</p>
      </div>
      <span class="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md uppercase">
        Active
      </span>
    </div>
    
    <div class="flex items-center gap-3 p-3 bg-background-light dark:bg-slate-800/50 rounded-xl border-l-4 border-red-500">
      <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
        <span class="material-icons-round">vaccines</span>
      </div>
      <div class="flex-1">
        <p class="font-semibold text-sm">DHPP</p>
        <p class="text-xs text-muted-light dark:text-muted-dark">Overdue by 30 days</p>
      </div>
      <span class="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md uppercase">
        Overdue
      </span>
    </div>
  </div>
</div>
```

---

## HEALTH DASHBOARD WIDGET

### Mobile Version

```html
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 border border-gray-200 dark:border-slate-700 mb-6 shadow-sm">
  <h3 class="text-lg font-bold mb-4">Health Dashboard</h3>
  
  <!-- Overall health score -->
  <div class="bg-gradient-to-r from-primary to-accent-blue rounded-2xl p-5 text-white mb-4">
    <p class="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">Overall Health Score</p>
    <div class="flex items-end gap-3 mb-3">
      <h2 class="text-5xl font-bold">87</h2>
      <span class="text-2xl font-semibold mb-1">/100</span>
    </div>
    <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
      <div class="h-full bg-white rounded-full" style="width: 87%"></div>
    </div>
    <p class="text-sm font-semibold">GOOD</p>
  </div>
  
  <!-- Component scores -->
  <div class="grid grid-cols-3 gap-2 mb-4">
    <div class="bg-background-light dark:bg-surface-darker p-3 rounded-xl text-center">
      <p class="text-xl font-bold text-primary">90</p>
      <p class="text-[9px] text-text-muted-light dark:text-text-muted-dark font-semibold uppercase mt-1">Preventive</p>
    </div>
    <div class="bg-background-light dark:bg-surface-darker p-3 rounded-xl text-center">
      <p class="text-xl font-bold text-accent-blue">75</p>
      <p class="text-[9px] text-text-muted-light dark:text-text-muted-dark font-semibold uppercase mt-1">Vaccines</p>
    </div>
    <div class="bg-background-light dark:bg-surface-darker p-3 rounded-xl text-center">
      <p class="text-xl font-bold text-green-500">80</p>
      <p class="text-[9px] text-text-muted-light dark:text-text-muted-dark font-semibold uppercase mt-1">Weight</p>
    </div>
  </div>
  
  <!-- Risks -->
  <div class="mb-4">
    <h4 class="text-sm font-bold mb-2">Health Risks</h4>
    <div class="space-y-2">
      <div class="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-3 rounded-lg">
        <div class="flex items-start gap-2">
          <span class="text-xl">🟡</span>
          <div class="flex-1">
            <p class="text-xs font-bold text-orange-600 dark:text-orange-400">MEDIUM RISK</p>
            <p class="text-xs text-text-light dark:text-text-dark mt-1">Overweight (8% above ideal)</p>
            <p class="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-1">→ Diet adjustment recommended</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Recommendations -->
  <div>
    <h4 class="text-sm font-bold mb-2">Recommendations</h4>
    <div class="space-y-2">
      <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded-lg">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <p class="text-xs font-bold text-red-600 dark:text-red-400">🔴 URGENT</p>
            <p class="text-xs text-text-light dark:text-text-dark mt-1">Bordetella vaccine overdue</p>
          </div>
          <button class="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold active:scale-95 transition-all">
            Schedule
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Desktop Version

```html
<div class="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark mb-6">
  <h3 class="text-lg font-bold mb-4">Health Dashboard</h3>
  
  <!-- Health score card -->
  <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20 mb-6">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-indigo-100 text-xs font-bold tracking-wider mb-1">OVERALL HEALTH SCORE</p>
        <div class="flex items-end gap-2 mb-2">
          <h2 class="text-5xl font-bold">87</h2>
          <span class="text-2xl font-semibold mb-1">/100</span>
        </div>
        <div class="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-2">
          <div class="h-full bg-white rounded-full" style="width: 87%"></div>
        </div>
        <p class="text-lg font-semibold">GOOD</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-white/20 p-3 rounded-full">
          <span class="material-icons-round text-3xl">verified_user</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Component scores -->
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-background-light dark:bg-slate-800/50 p-4 rounded-xl">
      <p class="text-3xl font-bold text-primary mb-1">90</p>
      <p class="text-sm text-muted-light dark:text-muted-dark">Preventive Care</p>
      <p class="text-xs text-green-600 mt-1">EXCELLENT</p>
    </div>
    <div class="bg-background-light dark:bg-slate-800/50 p-4 rounded-xl">
      <p class="text-3xl font-bold text-blue-600 mb-1">75</p>
      <p class="text-sm text-muted-light dark:text-muted-dark">Vaccination Status</p>
      <p class="text-xs text-blue-600 mt-1">GOOD</p>
    </div>
    <div class="bg-background-light dark:bg-slate-800/50 p-4 rounded-xl">
      <p class="text-3xl font-bold text-green-600 mb-1">80</p>
      <p class="text-sm text-muted-light dark:text-muted-dark">Weight Management</p>
      <p class="text-xs text-green-600 mt-1">GOOD</p>
    </div>
  </div>
  
  <!-- Risks and recommendations -->
  <div class="grid grid-cols-2 gap-6">
    <div>
      <h4 class="font-bold mb-3">Health Risks</h4>
      <div class="space-y-2">
        <div class="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 p-3 rounded-lg">
          <p class="text-xs font-bold text-orange-600 uppercase">🟡 Medium Risk</p>
          <p class="text-sm mt-1">Overweight (8% above ideal)</p>
          <p class="text-xs text-muted-light dark:text-muted-dark mt-1">→ Diet adjustment recommended</p>
        </div>
      </div>
    </div>
    
    <div>
      <h4 class="font-bold mb-3">Recommendations</h4>
      <div class="space-y-2">
        <div class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-3 rounded-lg">
          <p class="text-xs font-bold text-red-600 uppercase">🔴 Urgent</p>
          <p class="text-sm mt-1">Bordetella vaccine overdue</p>
          <button class="mt-2 text-xs bg-red-500 text-white px-3 py-1.5 rounded font-semibold hover:bg-red-600 transition-colors">
            Schedule Vaccination
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## RESPONSIVE BREAKPOINTS

Following Tailwind's responsive classes used in the project:

```javascript
// Mobile-first approach
sm:  640px   // Small tablets
md:  768px   // Tablets  
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
```

**Usage Examples:**

```html
<!-- Single column mobile, 2 columns tablet, 3 columns desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Stack on mobile, side-by-side on desktop -->
<div class="flex flex-col lg:flex-row gap-6">

<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">

<!-- Full width mobile, fixed width desktop -->
<div class="w-full lg:w-64">
```

---

## DARK MODE IMPLEMENTATION

All components must include dark mode classes using the `dark:` prefix:

```html
<!-- Background colors -->
bg-surface-light dark:bg-surface-dark
bg-card-light dark:bg-card-dark

<!-- Text colors -->
text-text-light dark:text-text-dark
text-text-muted-light dark:text-text-muted-dark

<!-- Borders -->
border-gray-200 dark:border-slate-700
border-border-light dark:border-border-dark

<!-- Hover states -->
hover:bg-gray-100 dark:hover:bg-slate-800
```

**Toggle Implementation (from actual code):**

```javascript
const themeToggleBtn = document.getElementById('theme-toggle');
const icon = themeToggleBtn.querySelector('.material-icons-round');

// Check localStorage or system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  icon.textContent = 'light_mode';
} else {
  document.documentElement.classList.remove('dark');
  icon.textContent = 'dark_mode';
}

// Toggle on click
themeToggleBtn.addEventListener('click', () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
    icon.textContent = 'dark_mode';
  } else {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    icon.textContent = 'light_mode';
  }
});
```

---

## IMPLEMENTATION CHECKLIST

When building Passport tab widgets, ensure:

- [ ] Use correct container classes (rounded-3xl mobile, rounded-2xl desktop)
- [ ] Include top gradient on mobile widgets
- [ ] Apply dark mode classes to all elements
- [ ] Use Material Icons Round for all icons
- [ ] Mobile primary color: #10b981, Desktop: #2C097F
- [ ] Proper padding (p-5 mobile, p-6 desktop)
- [ ] Responsive grid layouts (grid-cols-1 → lg:grid-cols-3)
- [ ] Hover and active states with transitions
- [ ] Touch-friendly tap targets (minimum 44px)
- [ ] Consistent font usage (Inter throughout)
- [ ] Border colors: gray-200/slate-700
- [ ] Shadow: shadow-sm on all cards
- [ ] Proper spacing between sections (mb-6, space-y-4)

---

**Document Complete**  
**Last Updated:** January 10, 2026  
**Status:** ✅ Ready for implementation
