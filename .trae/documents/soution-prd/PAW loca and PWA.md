<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# now create solution for pwa. and how platform should manage multi country and localisation

Based on Pawzly's requirements for multi-country support, here's a comprehensive solution for PWA implementation and internationalization strategy:

***

# **PAWZLY - PWA \& MULTI-COUNTRY LOCALIZATION SOLUTION**

## **1. PROGRESSIVE WEB APP (PWA) IMPLEMENTATION**

### **Why PWA for Pawzly?**

✅ **App-like experience** - No app store needed
✅ **Push notifications** - Re-engage users
✅ **Offline functionality** - View pet profiles without internet
✅ **Install on home screen** - One tap access
✅ **Auto-updates** - No manual updates required
✅ **SEO friendly** - Unlike native apps
✅ **Cost-effective** - Single codebase for web + PWA

***

### **1.1 Next.js PWA Setup**

**Installation:**

```bash
npm install next-pwa @ducanh2912/next-pwa
```

**Configuration:**

```javascript
// next.config.mjs
import withPWA from '@ducanh2912/next-pwa';

const nextConfig = {
  reactStrictMode: true,
  // ... other config
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:mp3|wav|ogg)$/i,
      handler: 'CacheFirst',
      options: {
        rangeRequests: true,
        cacheName: 'static-audio-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:mp4)$/i,
      handler: 'CacheFirst',
      options: {
        rangeRequests: true,
        cacheName: 'static-video-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.pawzly\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
})(nextConfig);
```


***

### **1.2 Web App Manifest**

```json
// public/manifest.json
{
  "name": "Pawzly - Pet Care & Community",
  "short_name": "Pawzly",
  "description": "Connect with pet services, manage pet health, and join the pet community",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["lifestyle", "social", "utilities"],
  "shortcuts": [
    {
      "name": "My Pets",
      "short_name": "Pets",
      "description": "View your pet profiles",
      "url": "/pets",
      "icons": [{ "src": "/icons/pets-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Find Services",
      "short_name": "Services",
      "description": "Search for pet services",
      "url": "/services",
      "icons": [{ "src": "/icons/services-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Messages",
      "short_name": "Messages",
      "description": "View your messages",
      "url": "/messages",
      "icons": [{ "src": "/icons/messages-96x96.png", "sizes": "96x96" }]
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "media",
          "accept": ["image/*", "video/*"]
        }
      ]
    }
  }
}
```


***

### **1.3 Offline Support Strategy**

**Critical Features Available Offline:**

1. **View pet profiles** (cached)
2. **View vaccination records** (cached)
3. **View booking history** (cached)
4. **Draft new posts** (save locally, sync later)
5. **View saved services** (cached)

**Implementation:**

```typescript
// packages/api/src/offline/sync-manager.ts
import { openDB, DBSchema } from 'idb';

interface PawzlyDB extends DBSchema {
  pets: {
    key: string;
    value: Pet;
    indexes: { 'by-owner': string };
  };
  bookings: {
    key: string;
    value: Booking;
  };
  drafts: {
    key: string;
    value: Draft;
  };
}

const dbPromise = openDB<PawzlyDB>('pawzly-cache', 1, {
  upgrade(db) {
    const petStore = db.createObjectStore('pets', { keyPath: 'id' });
    petStore.createIndex('by-owner', 'owner_id');
    
    db.createObjectStore('bookings', { keyPath: 'id' });
    db.createObjectStore('drafts', { keyPath: 'id' });
  },
});

export async function cachePets(pets: Pet[]) {
  const db = await dbPromise;
  const tx = db.transaction('pets', 'readwrite');
  await Promise.all(pets.map(pet => tx.store.put(pet)));
  await tx.done;
}

export async function getCachedPets(ownerId: string) {
  const db = await dbPromise;
  return db.getAllFromIndex('pets', 'by-owner', ownerId);
}

export async function saveDraft(draft: Draft) {
  const db = await dbPromise;
  await db.put('drafts', draft);
}

export async function syncDrafts() {
  const db = await dbPromise;
  const drafts = await db.getAll('drafts');
  
  for (const draft of drafts) {
    try {
      await uploadDraft(draft);
      await db.delete('drafts', draft.id);
    } catch (error) {
      console.error('Failed to sync draft', draft.id, error);
    }
  }
}
```

**Sync Component:**

```tsx
// apps/web/src/components/offline-sync.tsx
'use client';

import { useEffect, useState } from 'react';
import { syncDrafts } from '@pawzly/api/offline';
import { useToast } from '@/components/ui/use-toast';

export function OfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      toast({
        title: 'Back online!',
        description: 'Syncing your data...',
      });
      
      await syncDrafts();
      
      toast({
        title: 'Synced successfully',
        description: 'All your changes have been saved.',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'You are offline',
        description: 'Your changes will be saved locally.',
        variant: 'warning',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return (
    <div className="fixed bottom-4 right-4">
      {!isOnline && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Offline Mode</p>
          <p className="text-sm">Working offline - changes will sync when online</p>
        </div>
      )}
    </div>
  );
}
```


***

### **1.4 Push Notifications**

**Web Push Setup:**

```typescript
// packages/notifications/src/push-manager.ts
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    return await subscribeUserToPush();
  }
  
  return null;
}

async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    ),
  });

  // Send subscription to backend
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
  });

  return subscription;
}

// Send push notification from backend (Supabase Edge Function)
export async function sendPushNotification(userId: string, payload: any) {
  const { data: subscription } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!subscription) return;

  await webpush.sendNotification(
    subscription.subscription_data,
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: payload.data,
    })
  );
}
```

**Notification Types:**

```typescript
// packages/notifications/src/types.ts
export const NotificationTypes = {
  BOOKING_CONFIRMED: {
    title: 'Booking Confirmed',
    body: 'Your booking for {service} has been confirmed',
    icon: '/icons/booking.png',
  },
  VACCINATION_REMINDER: {
    title: 'Vaccination Due',
    body: '{petName} needs {vaccineName} vaccination',
    icon: '/icons/health.png',
  },
  NEW_MESSAGE: {
    title: 'New Message',
    body: '{senderName} sent you a message',
    icon: '/icons/message.png',
  },
  DONATION_RECEIVED: {
    title: 'Donation Received',
    body: 'You received a donation of {amount}',
    icon: '/icons/donation.png',
  },
};
```


***

### **1.5 Install Prompt**

```tsx
// apps/web/src/components/install-prompt.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after user has visited 3 times
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
      if (visitCount >= 3) {
        setShowPrompt(true);
      }
      localStorage.setItem('visitCount', (visitCount + 1).toString());
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <img src="/icons/icon-72x72.png" alt="Pawzly" className="w-12 h-12" />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Install Pawzly</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add Pawzly to your home screen for quick access and offline features
          </p>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleInstall} size="sm">
              Install
            </Button>
            <Button 
              onClick={() => setShowPrompt(false)} 
              variant="outline" 
              size="sm"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```


***

## **2. MULTI-COUNTRY \& LOCALIZATION STRATEGY**

### **2.1 Supported Countries (MVP)**

**Phase 1 (Launch):**

- 🇩🇪 Germany
- 🇬🇧 United Kingdom
- 🇫🇷 France
- 🇪🇸 Spain
- 🇮🇹 Italy

**Phase 2 (Expansion):**

- 🇳🇱 Netherlands
- 🇵🇱 Poland
- 🇦🇹 Austria
- 🇸🇪 Sweden
- 🇧🇪 Belgium

***

### **2.2 Next.js Internationalized Routing**

**Configuration:**

```typescript
// next.config.mjs
const nextConfig = {
  i18n: {
    locales: ['en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT'],
    defaultLocale: 'en-GB',
    localeDetection: true,
    domains: [
      {
        domain: 'pawzly.com',
        defaultLocale: 'en-GB',
        http: true, // for local dev
      },
      {
        domain: 'pawzly.de',
        defaultLocale: 'de-DE',
        http: true,
      },
      {
        domain: 'pawzly.fr',
        defaultLocale: 'fr-FR',
        http: true,
      },
      {
        domain: 'pawzly.es',
        defaultLocale: 'es-ES',
        http: true,
      },
      {
        domain: 'pawzly.it',
        defaultLocale: 'it-IT',
        http: true,
      },
    ],
  },
};
```

**URL Structure:**

```
// Option 1: Subdomain (Recommended for SEO)
https://pawzly.de/pets/123
https://pawzly.fr/pets/123

// Option 2: Path-based (Easier setup)
https://pawzly.com/de/pets/123
https://pawzly.com/fr/pets/123

// Option 3: Hybrid (Best UX)
https://pawzly.de/pets/123  (German users)
https://pawzly.com/en/pets/123 (Other countries)
```


***

### **2.3 Translation Management with next-intl**

**Installation:**

```bash
npm install next-intl
```

**Setup:**

```typescript
// packages/i18n/src/config.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// List of supported locales
export const locales = ['en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
```

**Translation File Structure:**

```
packages/i18n/
├── locales/
│   ├── en-GB.json
│   ├── de-DE.json
│   ├── fr-FR.json
│   ├── es-ES.json
│   └── it-IT.json
└── src/
    └── config.ts
```

**Translation Keys Structure:**

```json
// packages/i18n/locales/en-GB.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading..."
  },
  "navigation": {
    "home": "Home",
    "pets": "My Pets",
    "services": "Services",
    "messages": "Messages",
    "profile": "Profile"
  },
  "pets": {
    "title": "My Pets",
    "addPet": "Add Pet",
    "noPets": "You don't have any pets yet",
    "species": {
      "dog": "Dog",
      "cat": "Cat",
      "bird": "Bird",
      "rabbit": "Rabbit"
    },
    "profile": {
      "basicInfo": "Basic Information",
      "healthRecords": "Health Records",
      "vaccinations": "Vaccinations",
      "medications": "Medications"
    }
  },
  "bookings": {
    "title": "My Bookings",
    "upcoming": "Upcoming",
    "past": "Past",
    "cancelled": "Cancelled",
    "confirmBooking": "Confirm Booking",
    "bookingDetails": "Booking Details"
  },
  "validation": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "passwordTooShort": "Password must be at least 8 characters",
    "passwordMismatch": "Passwords do not match"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "network": "Network error. Please check your connection.",
    "unauthorized": "You are not authorized to perform this action."
  }
}
```

**Usage in Components:**

```tsx
// apps/web/src/app/[locale]/pets/page.tsx
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function PetsPage() {
  const t = useTranslations('pets');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <Button>{t('addPet')}</Button>
      
      {pets.length === 0 && (
        <p>{t('noPets')}</p>
      )}
    </div>
  );
}
```

**With Interpolation:**

```json
{
  "welcome": "Welcome back, {name}!",
  "petAge": "{name} is {years, plural, =1 {1 year} other {# years}} old"
}
```

```tsx
const t = useTranslations('common');

<h1>{t('welcome', { name: user.name })}</h1>
<p>{t('petAge', { name: 'Max', years: 3 })}</p>
```


***

### **2.4 Date, Time \& Number Formatting**

```tsx
import { useFormatter } from 'next-intl';

function PetProfile({ pet }) {
  const format = useFormatter();
  
  return (
    <div>
      {/* Date formatting */}
      <p>Birthday: {format.dateTime(pet.dateOfBirth, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</p>
      
      {/* Relative time */}
      <p>Created: {format.relativeTime(pet.createdAt)}</p>
      
      {/* Number formatting */}
      <p>Weight: {format.number(pet.weight, {
        style: 'unit',
        unit: 'kilogram',
      })}</p>
      
      {/* Currency */}
      <p>Adoption Fee: {format.number(150, {
        style: 'currency',
        currency: 'EUR',
      })}</p>
    </div>
  );
}
```

**Output by Locale:**

```
en-GB: "Birthday: 15 March 2022"
de-DE: "Geburtstag: 15. März 2022"
fr-FR: "Anniversaire: 15 mars 2022"

en-GB: "Weight: 25 kg"
de-DE: "Gewicht: 25 kg"

en-GB: "€150.00"
de-DE: "150,00 €"
fr-FR: "150,00 €"
```


***

### **2.5 Currency Handling**

**Database Schema:**

```sql
-- Store prices in cents/smallest unit
CREATE TABLE services (
  id UUID PRIMARY KEY,
  base_price_cents INTEGER NOT NULL, -- Store in cents
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  -- Regional pricing
  regional_prices JSONB DEFAULT '{}'::jsonb,
  -- Example: {"GB": 5000, "DE": 4500, "FR": 4800}
);
```

**Currency Conversion:**

```typescript
// packages/utils/src/currency.ts
const EXCHANGE_RATES = {
  EUR: 1.0,
  GBP: 0.86,
  USD: 1.09,
  CHF: 0.97,
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];
  return Math.round((amount / fromRate) * toRate);
}

export function formatPrice(
  cents: number,
  currency: string,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

// Usage
formatPrice(4500, 'EUR', 'de-DE'); // "45,00 €"
formatPrice(4500, 'GBP', 'en-GB'); // "£45.00"
```

**Regional Pricing Component:**

```tsx
import { useLocale } from 'next-intl';
import { useCurrency } from '@/hooks/useCurrency';

function ServicePrice({ service }) {
  const locale = useLocale();
  const { currency, convertPrice, formatPrice } = useCurrency();
  
  // Get regional price or convert from base price
  const priceInLocalCurrency = service.regional_prices[locale.split('-')[1]] ||
    convertPrice(service.base_price_cents, 'EUR', currency);
  
  return (
    <div className="text-2xl font-bold">
      {formatPrice(priceInLocalCurrency)}
    </div>
  );
}
```


***

### **2.6 Translation Workflow**

#### **Option 1: Manual Translation (Recommended for MVP)**

**Process:**

1. Developers add English keys
2. Export to JSON/CSV
3. Send to translators
4. Import translated files

**Tools:**

- Google Sheets for collaborative translation
- CSV import/export

***

#### **Option 2: Translation Management System (Scale)**

**Use Lokalise (Recommended):**

```bash
npm install @lokalise/node-api
```

**Features:**

- ✅ Web-based translation interface
- ✅ Automatic translation (DeepL integration)
- ✅ Translation memory
- ✅ Collaboration features
- ✅ CI/CD integration

**Pricing:**

- FREE for 1 user, 1 project, 1000 keys
- Pro: \$120/month for unlimited

**Alternative:** Crowdin (similar pricing)

***

#### **Option 3: Automated Translation (Budget Option)**

```typescript
// scripts/translate.ts
import * as deepl from 'deepl-node';
import fs from 'fs';

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

async function translateLocale(sourceLocale: string, targetLocale: string) {
  const sourceFile = `./locales/${sourceLocale}.json`;
  const targetFile = `./locales/${targetLocale}.json`;
  
  const source = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
  const target = {};
  
  async function translateObject(obj: any, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      
      if (typeof value === 'string') {
        const translation = await translator.translateText(
          value,
          sourceLocale,
          targetLocale
        );
        set(target, currentPath, translation.text);
      } else if (typeof value === 'object') {
        await translateObject(value, currentPath);
      }
    }
  }
  
  await translateObject(source);
  fs.writeFileSync(targetFile, JSON.stringify(target, null, 2));
}

// Run: node scripts/translate.ts en-GB de-DE
```

**Cost:** ~\$10 for 500,000 characters (entire app translation)

***

### **2.7 RTL Support (Future: Arabic, Hebrew)**

```typescript
// apps/web/src/app/layout.tsx
export default function RootLayout({ children, params: { locale } }) {
  const direction = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  
  return (
    <html lang={locale} dir={direction}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* TailwindCSS RTL support */
@layer utilities {
  [dir='rtl'] .ms-4 {
    margin-inline-start: 1rem;
  }
  
  [dir='ltr'] .ms-4 {
    margin-left: 1rem;
  }
}
```


***

### **2.8 Content Delivery Strategy**

**Geo-Routing with Cloudflare:**

```javascript
// Cloudflare Worker
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const country = request.headers.get('CF-IPCountry');
  const localeMap = {
    'DE': 'de-DE',
    'FR': 'fr-FR',
    'ES': 'es-ES',
    'IT': 'it-IT',
    'GB': 'en-GB',
  };
  
  const locale = localeMap[country] || 'en-GB';
  const url = new URL(request.url);
  
  // Redirect to localized subdomain
  if (!url.hostname.includes(locale.split('-')[0])) {
    url.hostname = `${locale.split('-')[0]}.pawzly.com`;
    return Response.redirect(url.toString(), 302);
  }
  
  return fetch(request);
}
```


***

### **2.9 Localized Content Management**

**Database Schema for Multi-Language Content:**

```sql
-- Translatable content table
CREATE TABLE pet_place_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_place_id UUID REFERENCES pet_places(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pet_place_id, locale)
);

-- Query with fallback
SELECT 
  p.*,
  COALESCE(pt.name, p.name) as localized_name,
  COALESCE(pt.description, p.description) as localized_description
FROM pet_places p
LEFT JOIN pet_place_translations pt 
  ON p.id = pt.pet_place_id 
  AND pt.locale = 'de-DE'
WHERE p.status = 'active';
```


***

### **2.10 Legal Compliance per Country**

**GDPR Compliance (EU-wide):**

- Cookie consent banner
- Data export functionality
- Right to be forgotten
- Data processing agreements

**Country-Specific:**

```typescript
// packages/compliance/src/country-requirements.ts
export const CountryCompliance = {
  'DE': {
    requiresCookieConsent: true,
    requiresAgeVerification: 16,
    requiresBusinessLicense: true,
    vatRate: 0.19,
    dataResidency: 'EU',
  },
  'FR': {
    requiresCookieConsent: true,
    requiresAgeVerification: 15,
    requiresBusinessLicense: true,
    vatRate: 0.20,
    dataResidency: 'EU',
  },
  'GB': {
    requiresCookieConsent: true,
    requiresAgeVerification: 13,
    requiresBusinessLicense: false,
    vatRate: 0.20,
    dataResidency: 'UK',
  },
};
```


***

## **3. LOCALIZATION TESTING STRATEGY**

```typescript
// __tests__/i18n/translations.test.ts
import enGB from '@/i18n/locales/en-GB.json';
import deDE from '@/i18n/locales/de-DE.json';
import frFR from '@/i18n/locales/fr-FR.json';

describe('Translation Completeness', () => {
  const getAllKeys = (obj: any, prefix = ''): string[] => {
    let keys: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object') {
        keys = keys.concat(getAllKeys(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  };

  const enKeys = getAllKeys(enGB);

  it('should have all keys in German', () => {
    const deKeys = getAllKeys(deDE);
    expect(deKeys.sort()).toEqual(enKeys.sort());
  });

  it('should have all keys in French', () => {
    const frKeys = getAllKeys(frFR);
    expect(frKeys.sort()).toEqual(enKeys.sort());
  });

  it('should not have empty translations', () => {
    const checkEmpty = (obj: any): string[] => {
      const empty: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value.trim() === '') {
          empty.push(key);
        } else if (typeof value === 'object') {
          empty.push(...checkEmpty(value));
        }
      }
      return empty;
    };

    expect(checkEmpty(deDE)).toEqual([]);
    expect(checkEmpty(frFR)).toEqual([]);
  });
});
```


***

## **4. MONITORING \& ANALYTICS BY COUNTRY**

```typescript
// Track user locale in PostHog
posthog.identify(user.id, {
  locale: user.locale,
  country: user.country,
  language: user.language,
  currency: user.currency,
});

// Custom event properties
posthog.capture('service_booked', {
  service_id: booking.service_id,
  locale: user.locale,
  country: user.country,
  price_currency: booking.currency,
});
```


***

## **COMPLETE IMPLEMENTATION SUMMARY**

### **PWA Features:**

✅ Offline support (IndexedDB caching)
✅ Install prompt
✅ Push notifications
✅ Background sync
✅ App shortcuts
✅ Share target API

### **Localization:**

✅ 5 languages (en, de, fr, es, it)
✅ next-intl for translations
✅ Regional domains (pawzly.de, pawzly.fr)
✅ Currency conversion
✅ Date/time/number formatting
✅ Localized content storage
✅ Automatic translation with DeepL

### **Cost:**

- PWA: FREE (included in Next.js)
- Translations: \$10-50 (DeepL API)
- Domains: \$30/year (5 domains)
- **Total: ~\$40-80 for MVP**

This gives Pawzly a native app-like experience on web with full multi-country support! 🌍🐾

