I will refactor the codebase in 4 distinct phases to improve organization, reduce duplication, and enhance code quality.

## Phase 1: Architecture & Housekeeping (The Foundation)
1.  **Consolidate Supabase Integration**:
    *   Delete `app/integrations/` folder.
    *   Ensure `lib/supabase.ts` is the single source of truth for the Supabase client.
    *   Update all imports to point to `lib/supabase`.
2.  **Unify Storage Logic**:
    *   Merge `lib/storage.ts` and `lib/storage-user.ts` into a single `lib/storage.ts` service.
    *   Create a generic `uploadImage(bucket, path, uri, previousUrl)` function to handle both User and Pet photo uploads with proper error handling and old file deletion.
3.  **Organize Components**:
    *   Create `components/ui/` for generic UI elements (Buttons, Inputs, Cards).
    *   Create `components/features/` for domain-specific components (`features/pets/`, `features/calendar/`).
    *   Move existing components into these new folders and update imports.
4.  **Clean Up Types**:
    *   Split `types/index.ts` into `types/db.ts` (Database definitions) and `types/ui.ts` (UI props/interfaces).

## Phase 2: Component Refactoring (The UI)
1.  **Create Generic Searchable Select**:
    *   Refactor `CountrySelect` and `LanguageSelect` into a single generic `<SearchableSelect />` component in `components/ui/`.
    *   Pass data (countries/languages) as props.
2.  **Standardize Form Components**:
    *   Refactor `<DateInput />` to be more robust and strictly typed.
    *   Create a standard `<FormField />` wrapper for consistent labels and error messages.
3.  **Refactor Screens**:
    *   Update `app/(auth)/onboarding.tsx` and `app/(tabs)/profile/edit.tsx` to use the new generic components.

## Phase 3: Logic & Hooks (The Brains)
1.  **Refine Data Hooks**:
    *   Review `useProfile`, `usePets`, etc.
    *   Ensure consistent return signature: `{ data, loading, error, refetch, upsert, delete }`.
    *   Fix any remaining RLS "select after mutation" issues pattern-wide.
2.  **Strict Typing**:
    *   Ensure all hooks use the generated Supabase types from `types/db.ts` instead of manual type definitions or `any`.

## Phase 4: Styling & Consistency (The Look)
1.  **Theme System**:
    *   Move `styles/commonStyles.ts` to `constants/theme.ts`.
    *   Define strict tokens for Spacing, Colors, and Typography.
2.  **Apply Theme**:
    *   Update `components/ui/` elements to consume `constants/theme.ts` tokens.

I will start with Phase 1 immediately upon approval.