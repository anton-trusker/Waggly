# Improve Add Forms with Full Details and Address Support

I will upgrade the "Add" forms to comprehensive, full-screen modals matching the provided designs (dark/light mode compatible) and ensuring all requested fields are present, including detailed address support.

## 1. Shared Components
-   **`AddressFormSection`**: A reusable component for "Provider & Location" sections.
    -   **Search**: "Search for a clinic or provider" (Google Maps/Places style mock).
    -   **Fields**: Clinic Name, Street Address, City, State/Province, Zip/Postal Code, Country.
    -   **Functionality**: Allow manual entry or auto-fill from search.

## 2. Refactor Modals (Detailed Field Specs)

### A. Vaccination Form (`VaccinationFormModal.tsx`)
-   **Header**: "Add Vaccination"
-   **Who is this for?**: Horizontal Pet Selector with avatar and name.
-   **Vaccine Details**:
    -   `Vaccine Name` (Text Input)
    -   `Date Administered` (Date Picker)
-   **Medical Info**:
    -   `Batch Number` (Text Input, Optional)
    -   `Set Reminder` (Toggle Switch) -> If ON: show `Next Due Date` (Date Picker)
-   **Provider & Costs**:
    -   **Button**: "Link Clinic Account (Auto-fill vet details instantly)" (Visual only for now)
    -   `Vet Name / Clinic` (Text Input / Search)
    -   **Address Fields** (Collapsible or inline): Street, City, State, Zip.
    -   `Currency` (Dropdown: USD, EUR, GBP, etc.)
    -   `Total Cost` (Numeric Input)
    -   `Notes` (Text Area: "Any side effects or observations?")
-   **Attachments**: "Attach Record Image" (Upload Box).

### B. Treatment Form (`TreatmentFormModal.tsx`)
-   **Header**: "Add Treatment"
-   **Who is this for?**: Pet Selector.
-   **Treatment Details**:
    -   `Treatment Type` (Dropdown/Pills: Medication, Therapy, Surgery, Other)
    -   `Treatment Name` (Text Input: "e.g., Flea & Tick Prevention")
    -   `Date Administered` (Date Picker)
    -   `Frequency / Duration` (Text Input: "e.g., Daily for 7 days")
-   **Provider & Costs**:
    -   `Vet Name / Clinic` + **Full Address Fields**
    -   `Total Cost` + `Currency`
-   **Reminder**: Toggle + Date.
-   **Notes & Attachments**.

### C. Visit Form (`VisitFormModal.tsx`)
-   **Header**: "Add a New Visit"
-   **Who is this for?**: Pet Selector + "Add Pet" button.
-   **Visit Details**:
    -   `Visit Type` (Dropdown: Vet Check-up, Grooming, Training, Emergency)
    -   `Duration` (Dropdown/Text: 30m, 1h, etc.)
    -   `Date` + `Time`
-   **Provider & Location**:
    -   `Vet Name / Clinic` (Search)
    -   **Full Address Fields**: Address, City, State, Zip, Country.
    -   `Phone Number` (Tel Input)
-   **Notes & Attachments**.

### D. Allergy Form (`AllergyModal.tsx` - New Design)
-   **Header**: "Add Allergy"
-   **Who is this for?**: Pet Selector.
-   **Details**:
    -   `Allergy Name` (Text Input)
    -   `Severity` (Selection: Mild [Green], Moderate [Orange], Severe [Red])
    -   `Reaction` (Text Input)
    -   `Notes` (Text Area)

### E. Weight Form (`WeightModal.tsx` - New Design)
-   **Header**: "Log Weight"
-   **Who is this for?**: Pet Selector.
-   **Details**:
    -   `Weight` (Numeric) + `Unit` (Toggle: kg / lbs)
    -   `Date` (Date Picker) + `Time` (Time Picker)
    -   `Notes` (Text Area)

## 3. Integration
-   Update `app/web/pets/[id]/overview.tsx` (and other dashboards) to use these new modals.
-   Ensure all data is correctly mapped to Supabase inserts/updates.

## 4. Verification
-   Verify all modals open in full-screen/centered layout.
-   Verify all fields (especially new Address fields) are accessible and save correctly.
-   Check responsiveness on Mobile vs Desktop.
