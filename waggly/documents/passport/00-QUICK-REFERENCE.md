# Pet Passport Tab - Quick Implementation Reference (Project-Styled)

**Version:** 2.0 - Project-Aligned  
**Purpose:** Quick reference guide using Waggli's actual design system

---

## 🎨 QUICK COLOR REFERENCE

### Mobile Colors (Green Theme)
```
Primary: #10b981 (Green)
Accent: #3b82f6 (Blue)
Background: #f3f4f6 (Light) / #0f172a (Dark)
Surface: #ffffff (Light) / #1e293b (Dark)
Text: #1f2937 (Light) / #e2e8f0 (Dark)
```

### Desktop Colors (Purple Theme)
```
Primary: #2C097F (Purple)
Secondary: #10B981 (Green)
Background: #f6f6f8 (Light) / #151022 (Dark)
Cards: #FFFFFF (Light) / #1E293B (Dark)
Text: #1F2937 (Light) / #E2E8F0 (Dark)
```

### Health Status (Universal)
```
Excellent: #22c55e  |  Good: #14b8a6  |  Fair: #f97316
Poor: #ef4444  |  Critical: #dc2626
```

---

## 🔤 TYPOGRAPHY

**Fonts:** Inter (body), Plus Jakarta Sans (desktop headers only)

**Sizes:**
- Title: 18px (mobile), 24px (desktop)
- Body: 14px
- Labels: 10px uppercase  
- Mono: SF Mono (microchip IDs)

---

## 📐 SPACING & BORDERS

**Border Radius:**
- Mobile: 24px (widgets), 16px (cards), 12px (buttons)
- Desktop: 16px (widgets), 12px (cards), 8px (buttons)

**Padding:**
- Mobile: 20px (p-5)
- Desktop: 24px (p-6)

---

## 🧩 KEY COMPONENT CLASSES

### Widget Container
**Mobile:**
```html
<div class="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 border border-gray-200 dark:border-slate-700 mb-8 shadow-sm relative overflow-hidden">
  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-blue opacity-50"></div>
  <!-- content -->
</div>
```

**Desktop:**
```html
<div class="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
  <!-- content -->
</div>
```

### Metric Card
**Mobile:**
```html
<div class="flex flex-col items-center p-4 rounded-2xl bg-gray-50 dark:bg-surface-darker border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-primary active:scale-95 transition-all group">
  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20">
    <span class="material-icons-round text-primary text-2xl">icon</span>
  </div>
  <span class="text-xs font-bold">Label</span>
</div>
```

**Desktop:**
```html
<div class="flex flex-col items-center gap-2 p-4 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-slate-800 border border-border-light dark:border-border-dark rounded-xl transition-all group">
  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110">
    <span class="material-icons-round">icon</span>
  </div>
  <span class="text-xs font-medium text-muted-light dark:text-muted-dark">Label</span>
</div>
```

### Primary Button
** Mobile:**
```html
<button class="w-full bg-text-light dark:bg-white text-white dark:text-background-dark font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all">
  Button Text
</button>
```

**Desktop:**
```html
<button class="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-colors">
  Button Text
</button>
```

### Data Field
**Mobile:**
```html
<div>
  <label class="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider mb-1 block pl-1">
    Label
  </label>
  <input class="w-full bg-background-light dark:bg-surface-darker border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/50" />
</div>
```

**Desktop:**
```html
<div class="bg-background-light dark:bg-slate-800/50 p-3 rounded-xl">
  <p class="text-xs text-muted-light dark:text-muted-dark uppercase mb-1">Label</p>
  <p class="font-medium">Value</p>
</div>
```

### List Item / Card
**Mobile:**
```html
<div class="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:border-pink-500/30 transition-colors">
  <div class="flex items-start justify-between mb-3">
    <div class="flex items-start space-x-3">
      <div class="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-pink-500 shadow-sm">
        <span class="material-icons-round">icon</span>
      </div>
      <div>
        <h3 class="font-bold text-sm">Title</h3>
        <p class="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
          <span class="material-icons-round text-[10px] mr-1">calendar_today</span>
          Details
        </p>
      </div>
    </div>
    <button class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
      <span class="material-icons-round">more_vert</span>
    </button>
  </div>
</div>
```

**Desktop:**
```html
<div class="flex items-center gap-3 p-3 bg-background-light dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
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

## 🏷️ STATUS BADGE EXAMPLES

```html
<!-- Current/Active -->
<span class="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md uppercase">
  Active
</span>

<!-- Overdue/Alert -->
<span class="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md uppercase">
  Overdue
</span>

<!-- Due Soon -->
<span class="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-md uppercase">
  Due Soon
</span>
```

---

## 🎭 ICON USAGE

**Library:** [Material Icons Round](https://fonts.google.com/icons)

**Common Icons:**
```
qr_code_2, qr_code_scanner, download, print, share
vaccines, medication, pill, healing
calendar_today, event, schedule
pets, favorite, verified_user
visibility, edit, delete, more_vert
```

**Usage:**
```html
<span class="material-icons-round">icon_name</span>
```

---

## 📱 RESPONSIVE PATTERNS

### Grid Layouts
**Mobile (full width):**
```html
<div class="grid grid-cols-1 gap-4">
  <!-- Single column -->
</div>

<div class="grid grid-cols-2 gap-3">
  <!-- Two columns for metrics -->
</div>
```

**Desktop (multi-column):**
```html  
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Responsive 1 to 3 columns -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Responsive 1 to 2 columns -->
</div>
```

---

## ⚡ QUICK TAILWIND PATTERNS

### Hover Effects
```
hover:bg-gray-100 dark:hover:bg-slate-700
hover:border-primary
hover:scale-110
group-hover:bg-primary/20
```

### Transitions
```
transition-colors
transition-all
active:scale-95
```

### Dark Mode
```
bg-surface-light dark:bg-surface-dark
text-text-light dark:text-text-dark
border-gray-200 dark:border-slate-700
```

### Flex Patterns
```
flex items-center justify-between
flex items-start gap-3
flex-1 (takes remaining space)
space-x-3, space-y-4 (gap between children)
```

---

## 📋 CHECKLIST: Implementing New Passport Widgets

- [ ] Use correct container class (mobile rounded-3xl, desktop rounded-2xl)
- [ ] Add top gradient bar on mobile (`absolute top-0 gradient`)
- [ ] Use Inter font (Plus Jakarta Sans for desktop headers)
- [ ] Mobile primary: #10b981, Desktop primary: #2C097F
- [ ] Include dark mode classes (`dark:`)
- [ ] Material Icons Round for all icons
- [ ] Proper padding (p-5 mobile, p-6 desktop)
- [ ] Border: gray-200/slate-700 for dark mode
- [ ] Hover states and transitions
- [ ] Responsive grid (grid-cols-1 → lg:grid-cols-3)

---

## 🔗 Related Files

- Original widgets spec: `01-widgets-specification.md`
- Database schema: `03-database-schema.md`
- TypeScript models: `05-data-models-typescript.md`
- Implementation guide: `06-implementation-guide.md`
- Full design system: `04-ui-ux-design-PROJECT-ALIGNED.md`

---

**Last Updated:** January 10, 2026  
**Status:** ✅ Ready for implementation with actual project styles
