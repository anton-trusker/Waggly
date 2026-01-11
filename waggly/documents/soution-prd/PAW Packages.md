<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# now also recommend what UI framework and packages need to use to speed up dev process and also app should be very modern and lite.

Based on Waggli's requirements for a modern, lightweight, and fast development process, here's the comprehensive UI framework and package recommendation:

***

# **WAGGLI - MODERN UI FRAMEWORK \& PACKAGE STACK**

## **Core Recommendation: Shadcn/ui + TailwindCSS + Radix UI**

This combination provides the **perfect balance** of speed, customization, accessibility, and modern aesthetics while keeping the bundle size minimal.

***

## **1. UI COMPONENT LIBRARY**

### **Primary: Shadcn/ui (Highly Recommended)**

**Why Shadcn/ui is Perfect for Waggli:**

✅ **Copy-paste components** - You own the code, no package dependency bloat
✅ **Built on Radix UI** - Accessible by default (ARIA compliant)
✅ **TailwindCSS native** - Consistent styling, easy customization
✅ **TypeScript first** - Full type safety
✅ **Tree-shakeable** - Only bundle what you use
✅ **Modern \& Beautiful** - Pre-designed with excellent UX
✅ **Works across web \& React Native** (via Tamagui fork)
✅ **Active community** - Extensive documentation and examples

**Installation:**

```bash
# Initialize shadcn/ui in your Next.js project
npx shadcn-ui@latest init

# Add components as needed (you own the code!)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add toast
```

**Example Usage:**

```tsx
// packages/ui/src/components/pet-card.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function PetCard({ pet }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={pet.photo} alt={pet.name} />
            <AvatarFallback>{pet.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{pet.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{pet.breed}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Badge variant="secondary">{pet.gender}</Badge>
          <Badge variant="outline">{pet.age} years</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
}
```


### **Mobile Alternative: Tamagui (React Native)**

For mobile apps, use **Tamagui** - it's like Shadcn for React Native:

```bash
npm install tamagui @tamagui/config
```

```tsx
// apps/mobile/src/components/PetCard.tsx
import { Card, H3, Paragraph, Button, XStack, YStack } from 'tamagui';

export function PetCard({ pet }) {
  return (
    <Card elevate size="$4" bordered>
      <Card.Header padded>
        <H3>{pet.name}</H3>
        <Paragraph theme="alt2">{pet.breed}</Paragraph>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button>View Profile</Button>
      </Card.Footer>
    </Card>
  );
}
```


***

## **2. STYLING SOLUTION**

### **TailwindCSS v4 (Beta) - Modern \& Ultra-Fast**

```bash
npm install tailwindcss@next @tailwindcss/typography @tailwindcss/forms @tailwindcss/container-queries
```

**Configuration:**

```ts
// packages/config/tailwind/tailwind.config.ts
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Waggli Brand Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main brand
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Accent
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-cal-sans)', ...fontFamily.sans],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
```


***

## **3. ANIMATION \& MOTION**

### **Framer Motion - Smooth, Production-Ready Animations**

```bash
npm install framer-motion
```

**Example Usage:**

```tsx
// Smooth page transitions
import { motion } from 'framer-motion';

export default function PetProfilePage({ pet }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <PetProfile pet={pet} />
    </motion.div>
  );
}

// Stagger children animation
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
  initial="hidden"
  animate="show"
>
  {pets.map(pet => (
    <motion.div
      key={pet.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <PetCard pet={pet} />
    </motion.div>
  ))}
</motion.div>
```

**Mobile Alternative:** Use `react-native-reanimated` for native performance:

```bash
npx expo install react-native-reanimated
```


***

## **4. FORMS \& VALIDATION**

### **React Hook Form + Zod - Type-Safe Forms**

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Example:**

```tsx
// packages/ui/src/components/pet-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';

const petSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other']),
  breed: z.string().optional(),
  dateOfBirth: z.date(),
  weight: z.number().positive(),
});

type PetFormValues = z.infer<typeof petSchema>;

export function PetForm({ onSubmit }) {
  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: 'dog',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Name</FormLabel>
              <FormControl>
                <Input placeholder="Max" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Pet Profile</Button>
      </form>
    </Form>
  );
}
```


***

## **5. DATA FETCHING \& STATE**

### **TanStack Query v5 (React Query) + Zustand**

```bash
npm install @tanstack/react-query zustand
```

**React Query for server state:**

```tsx
// packages/api/src/hooks/usePets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@waggli/database';

export function usePets(userId: string) {
  return useQuery({
    queryKey: ['pets', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (petData) => {
      const { data, error } = await supabase
        .from('pets')
        .insert(petData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
```

**Zustand for client state:**

```tsx
// packages/ui/src/stores/useMapStore.ts
import { create } from 'zustand';

interface MapStore {
  center: { lat: number; lng: number };
  zoom: number;
  filters: MapFilters;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  updateFilters: (filters: Partial<MapFilters>) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  center: { lat: 52.52, lng: 13.405 }, // Berlin
  zoom: 12,
  filters: { placeTypes: ['all'], petTypes: ['dog'] },
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  updateFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
}));
```


***

## **6. ICONS**

### **Lucide React - Modern, Lightweight Icons**

```bash
npm install lucide-react
```

**Usage:**

```tsx
import { Dog, Cat, Heart, MapPin, Calendar, Bell } from 'lucide-react';

<Button>
  <Heart className="mr-2 h-4 w-4" />
  Save Pet
</Button>
```

**Icon count:** 1000+ icons
**Bundle size:** ~20KB (tree-shakeable)
**Alternative for mobile:** `@expo/vector-icons`

***

## **7. MAPS \& LOCATION**

### **Google Maps Integration**

```bash
npm install @react-google-maps/api
npm install @googlemaps/js-api-loader
```

**Example:**

```tsx
// packages/ui/src/components/pet-map.tsx
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

const libraries = ['places', 'geometry'];

export function PetFriendlyMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      zoom={12}
      center={{ lat: 52.52, lng: 13.405 }}
      mapContainerClassName="h-screen w-full"
      options={{
        disableDefaultUI: false,
        clickableIcons: true,
        styles: mapStyles, // Custom styling
      }}
    >
      {places.map(place => (
        <Marker
          key={place.id}
          position={{ lat: place.latitude, lng: place.longitude }}
          onClick={() => setSelected(place)}
        />
      ))}
    </GoogleMap>
  );
}
```

**Mobile:** Use `react-native-maps` (pre-installed with Expo)

***

## **8. IMAGE HANDLING**

### **Next.js Image + Uploadthing + Sharp**

```bash
npm install uploadthing sharp
npm install @uploadthing/react
```

**File Upload:**

```tsx
// Upload component with progress
import { UploadButton, UploadDropzone } from '@uploadthing/react';

export function PetPhotoUpload({ onUploadComplete }) {
  return (
    <UploadDropzone
      endpoint="petImageUploader"
      onClientUploadComplete={(res) => {
        onUploadComplete(res[0].url);
      }}
      appearance={{
        button: 'ut-uploading:cursor-not-allowed bg-primary',
        container: 'border-2 border-dashed border-gray-300 rounded-lg',
      }}
    />
  );
}
```

**Image Optimization:**

```tsx
import Image from 'next/image';

<Image
  src={pet.photo}
  alt={pet.name}
  width={400}
  height={400}
  className="rounded-lg object-cover"
  placeholder="blur"
  blurDataURL={pet.blurHash} // Generate with Sharp
/>
```


***

## **9. DATE \& TIME**

### **date-fns - Lightweight (2KB) Date Library**

```bash
npm install date-fns
```

**Usage:**

```tsx
import { format, formatDistance, isPast, addDays } from 'date-fns';
import { de, fr, es } from 'date-fns/locale';

// Format dates
format(new Date(), 'PPP', { locale: de }); // "27. Oktober 2025"

// Relative time
formatDistance(petRecord.nextDueDate, new Date(), { addSuffix: true });
// "in 5 days"

// Check if vaccine is overdue
isPast(petRecord.nextDueDate);
```

**Alternative:** `dayjs` (also 2KB)

***

## **10. REAL-TIME FEATURES**

### **Supabase Realtime + Socket.io (if needed)**

```tsx
// packages/api/src/hooks/useRealtimeMessages.ts
import { useEffect } from 'react';
import { supabase } from '@waggli/database';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtimeMessages(conversationId: string) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);
}
```


***

## **11. NOTIFICATIONS**

### **React Hot Toast - Beautiful Notifications**

```bash
npm install react-hot-toast
```

**Usage:**

```tsx
import toast, { Toaster } from 'react-hot-toast';

// Success
toast.success('Pet profile created!', {
  icon: '🐾',
  duration: 4000,
});

// Error
toast.error('Failed to save changes');

// Loading
const savePromise = savePetProfile(data);
toast.promise(savePromise, {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
});

// Add to root layout
<Toaster position="top-right" />
```


***

## **12. TABLES \& DATA DISPLAY**

### **TanStack Table v8 - Headless Table Library**

```bash
npm install @tanstack/react-table
```

**Example:**

```tsx
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

export function PetsTable({ data }) {
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'species', header: 'Species' },
    { accessorKey: 'age', header: 'Age' },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```


***

## **13. CHARTS \& ANALYTICS**

### **Recharts - Simple, Composable Charts**

```bash
npm install recharts
```

**Example:**

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function DonationChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```


***

## **14. INTERNATIONALIZATION (i18n)**

### **next-intl - Type-Safe i18n for Next.js**

```bash
npm install next-intl
```

**Setup:**

```tsx
// packages/i18n/src/config.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}.json`)).default,
}));

// Usage
import { useTranslations } from 'next-intl';

export function PetCard() {
  const t = useTranslations('pets');
  
  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description', { name: pet.name })}</p>
    </div>
  );
}
```


***

## **15. ACCESSIBILITY**

### **Built-in with Radix UI + Additional Tools**

```bash
npm install @radix-ui/react-accessible-icon
npm install @radix-ui/react-visually-hidden
npm install focus-trap-react
```


***

## **16. COMPLETE PACKAGE.JSON**

```json
{
  "name": "@waggli/ui",
  "version": "0.1.0",
  "dependencies": {
    // Core UI
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    
    // Radix UI (Shadcn base)
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-slot": "^1.0.2",
    
    // Styling
    "tailwindcss": "^4.0.0-alpha.30",
    "@tailwindcss/typography": "^0.5.10",
    "@tailwindcss/forms": "^0.5.7",
    "tailwind-merge": "^2.2.0",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0",
    
    // Animation
    "framer-motion": "^11.0.0",
    
    // Forms & Validation
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    
    // State Management
    "@tanstack/react-query": "^5.20.0",
    "zustand": "^4.5.0",
    
    // Icons
    "lucide-react": "^0.330.0",
    
    // Utils
    "date-fns": "^3.3.0",
    "react-hot-toast": "^2.4.1",
    
    // Maps
    "@react-google-maps/api": "^2.19.3",
    "@googlemaps/js-api-loader": "^1.16.6",
    
    // Images
    "uploadthing": "^6.2.0",
    "@uploadthing/react": "^6.2.0",
    "sharp": "^0.33.2",
    
    // Tables
    "@tanstack/react-table": "^8.12.0",
    
    // Charts
    "recharts": "^2.12.0",
    
    // i18n
    "next-intl": "^3.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "typescript": "^5.3.3",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```


***

## **17. PERFORMANCE OPTIMIZATIONS**

### **Code Splitting \& Lazy Loading**

```tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const ChatBox = dynamic(() => import('./ChatBox'), {
  ssr: false,
});
```


### **Image Optimization**

```tsx
// Blur placeholders for smooth loading
import { getPlaiceholder } from 'plaiceholder';

export async function getStaticProps() {
  const { base64, img } = await getPlaiceholder('/pet.jpg');
  
  return {
    props: {
      imageProps: {
        ...img,
        blurDataURL: base64,
      },
    },
  };
}
```


### **Bundle Analysis**

```bash
npm install @next/bundle-analyzer
```


***

## **18. ESTIMATED BUNDLE SIZES**

| Package | Minified + Gzipped |
| :-- | :-- |
| Shadcn/ui components | ~15-25KB (per component) |
| TailwindCSS | ~10-20KB (purged) |
| Framer Motion | ~30KB |
| React Hook Form | ~8KB |
| Zod | ~12KB |
| React Query | ~13KB |
| Zustand | ~1KB |
| Lucide Icons | ~20KB (tree-shakeable) |
| date-fns | ~2KB (per function) |
| **Total Core** | **~110-140KB** |

**Result:** Ultra-lightweight modern app with excellent UX!

***

## **FINAL RECOMMENDED STACK SUMMARY**

```typescript
// Core Foundation
✅ Shadcn/ui + Radix UI    // Beautiful, accessible components
✅ TailwindCSS v4          // Modern, fast styling
✅ Framer Motion           // Smooth animations
✅ TypeScript              // Type safety

// Forms & Data
✅ React Hook Form + Zod   // Type-safe forms
✅ React Query v5          // Server state
✅ Zustand                 // Client state

// Visuals
✅ Lucide React            // Modern icons
✅ Next.js Image           // Optimized images
✅ Uploadthing             // File uploads
✅ Recharts                // Analytics charts

// Maps & Location
✅ Google Maps API         // Mapping
✅ react-google-maps/api   // React integration

// Utils
✅ date-fns                // Date handling
✅ react-hot-toast         // Notifications
✅ next-intl               // i18n
✅ TanStack Table          // Data tables

// Mobile
✅ Tamagui                 // React Native UI
✅ Expo                    // Mobile framework
```

This stack gives you **speed, modern aesthetics, excellent DX, and minimal bundle size** - perfect for Waggli! 🐾

