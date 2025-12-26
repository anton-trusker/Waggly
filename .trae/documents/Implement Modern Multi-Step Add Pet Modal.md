I will implement the "Add Pet" multi-step modal by enhancing the existing wizard flow to match the modern design requirements.

### 1. Database & Schema Updates
- **Create Migration**: Add missing columns to the `pets` table:
  - `height` (DECIMAL)
  - `microchip_implantation_date` (DATE)
- **Update Types**: Update TypeScript definitions in `types/index.ts` to reflect the new schema.

### 2. UI Component Enhancements
- **Refactor `CustomDatePicker`**: Update the component to accept a dynamic `title` prop, making it reusable for both "Date of Birth" and "Implantation Date".
- **Create `ModernSelect`**: specific selection component (replacing the inline implementation) for fields like "Blood Type" and "Registry Provider", ensuring a consistent modern look across the wizard.

### 3. Wizard Step Refactoring
I will restructure the wizard to align with the "Health & Identification" design pattern:
- **Step 2 (Characteristics)**: Focus on core attributes: Breed, Gender, and Date of Birth. Move "Weight" to the next step to group all health metrics together.
- **Step 3 (Health & Identification)**: **(Major Redesign)**
  - Implement the design from `add_pet:_basic_info`.
  - **Health Card**: Weight (with unit toggle), Height (new), Blood Type (new dropdown).
  - **Identification Card**: Microchip ID, Registry Provider (searchable/dropdown), Implantation Date (new), Tag ID.
  - Apply the requested "modern aesthetic" with NativeWind styling.
- **Step 5 (Review)**: Update the review screen to display the newly added fields.

### 4. Integration & Logic
- **State Management**: Update `AddPetWizardScreen` to track `height`, `bloodType`, and `implantationDate`.
- **Supabase Integration**: Update the `handleSubmit` function to persist these new fields to the database.
- **Validation**: Ensure new fields have appropriate validation (e.g., numeric checks for height/weight).

### 5. Verification
- Verify TypeScript compilation to ensure type safety.
- Review component composition to ensure responsive design (Web/Mobile compatibility).
