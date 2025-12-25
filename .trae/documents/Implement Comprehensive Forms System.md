I have analyzed the current codebase (`components/desktop/modals/*`, `lib/supabase.ts`, `types/db.ts`) and formulated a detailed plan to implement the finalized forms specification.

### **Implementation Plan: Comprehensive Form System**

#### **Phase 1: Foundation & Shared Components**
1.  **Database Schema Alignment**:
    *   Review `types/db.ts` and alias `medical_visits` to `visits` for consistency.
    *   Ensure all tables (`allergies`, `documents`, `health_metrics`) have the required columns from the spec.
2.  **Create Reusable Components Library** (`components/desktop/modals/shared/`):
    *   **`PetSelector.tsx`**: Extract the pet selection logic (avatars, active state) from `VaccinationFormModal` to a shared component.
    *   **`UniversalDatePicker.tsx`**: Create a wrapper that uses `TextInput` (YYYY-MM-DD) for now but is ready for a proper date picker library, ensuring cross-platform compatibility.
    *   **`SmartAddressInput.tsx`**: Enhance `AddressFormSection` to support "Google Places" style behavior (even if mocking the API call initially) and standardized output.
    *   **`RichTextInput.tsx`**: A styled multiline text input for "Notes" and "Diagnosis" fields.

#### **Phase 2: Core Forms Implementation**
We will implement the forms in priority order, ensuring each connects directly to Supabase.

**1. Visit Form (`VisitFormModal.tsx`)**
*   **Target Table:** `medical_visits`
*   **Features:**
    *   Visit Type Selector (Routine, Emergency, Specialist).
    *   Clinic Search (using `SmartAddressInput`).
    *   Reason & Symptoms (Tag selector).
    *   Cost & Currency.
*   **UX:** "Repeat Last Visit" button to clone previous clinic details.

**2. Vaccination Form (`VaccinationFormModal.tsx`)**
*   **Target Table:** `vaccinations`
*   **Refactor:**
    *   Replace hardcoded inputs with `PetSelector` and `UniversalDatePicker`.
    *   Fetch "Vaccine Names" from a new Supabase lookup table (or hardcoded list based on CSV for now).
    *   Add "Next Due Date" calculator logic.

**3. Treatment/Medication Form (`TreatmentFormModal.tsx`)**
*   **Target Table:** `medications` (and `treatments`)
*   **Features:**
    *   Medication Search (Autocomplete from CSV data).
    *   Dosage & Frequency smart inputs (e.g., "2x Daily").
    *   Active/Completed toggle.

**4. Health Metrics Form (`HealthMetricsModal.tsx`)**
*   **Target Table:** `health_metrics` (new table needed? or use `weight_entries` + new columns).
*   **Features:**
    *   Weight (kg/lbs toggle), Temperature, Heart Rate.
    *   Visual "Body Condition Score" slider.

#### **Phase 3: Integration & Polish**
1.  **Dashboard Integration**:
    *   Update `QuickActionsGrid` to trigger these new modals.
    *   Ensure modals open in "Full Screen" mode with backdrop blur (using `BlurView`).
2.  **Data Sync**:
    *   Implement `onSuccess` callbacks to trigger data refetching in the parent Dashboard/Profile.

#### **Next Step**
I will begin with **Phase 1: Foundation & Shared Components**, creating the `PetSelector` and updating `types/db.ts`.