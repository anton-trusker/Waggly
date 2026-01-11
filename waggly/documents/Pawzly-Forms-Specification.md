# PAWZLY PET HEALTH MANAGEMENT PLATFORM
## Comprehensive Forms Specification Document

**Document Version:** 1.1  
**Last Updated:** December 25, 2025  
**Status:** Complete Specification (Supabase Integrated)  
**Platform:** Pawzly (Pet Health & Wellness Management)

---

## EXECUTIVE SUMMARY

This document provides comprehensive specifications for all forms within the Pawzly pet health management platform. It includes detailed field definitions, data types, validation rules, conditional logic, UX/UI improvements, and design patterns optimized for modern web and mobile applications.

The forms are designed to cover six primary use cases:
1. **Visit Management** - Veterinary appointments and check-ups
2. **Vaccination Records** - Vaccine tracking and reminders
3. **Treatment/Medication** - Medical treatments and dosage tracking
4. **Health Metrics** - Weight, height, and vital signs
5. **Allergies & Sensitivities** - Allergy documentation
6. **Medical Documents** - Invoice, prescription, and record uploads

---

## PART 1: CORE FORM STRUCTURE & PATTERNS

### 1.1 Universal Form Design Principles

#### Responsive Layout Strategy (Crucial)
**Desktop Experience:**
- **Full-Screen Modals:** All "Add" forms must open as full-screen modal overlays (Popups) over the current content (Dashboard or Pet Profile).
- **Behavior:** Backdrop blur (glassmorphism), centered content, "X" close button in top-right.
- **Context:** User never leaves the underlying page context.

**Mobile Experience:**
- **Native-Like Navigation:** Forms should behave like native mobile screens.
- **Layout:** Full-screen edge-to-edge views or full-height bottom sheets.
- **Navigation:** Back button in top-left, sticky "Save" action bar at bottom.
- **Input Handling:** Native date/time pickers, large touch targets (min 44px).

#### Pet Selection Component
All forms begin with a **Pet Selector** (required, except bulk document uploads):
- **Display Type:** Icon-based toggle or dropdown
- **Visual Elements:**
  - Pet avatar/photo (circular thumbnail, 48px)
  - Pet name (primary text)
  - Checkmark badge (selected state)
  - Optional: Breed/species subtitle (secondary text)
  
**States:**
- Single pet: Shows pre-selected pet
- Multiple pets: Shows radio button selection
- No pets: Shows "Add Pet Profile" CTA

#### Date/Time Input Patterns
- **Date Pickers:** Calendar interface with disabled past dates (except for health history)
- **Time Pickers:** 24-hour format with 15-minute intervals
- **Datetime:** Combined date + time picker
- **Mobile:** Native date/time inputs fallback
- **Validation:** Real-time feedback with min/max constraints

#### Location & Address Fields
- **Primary:** Auto-complete address field with Google Places API
- **Fallback:** Manual text inputs (street, city, postal code, country)
- **Validation:** Geocoding verification
- **Display:** Show selected address on embedded Google Map
- **Mobile:** Geolocation detection with confirmation

#### Document Upload Pattern
- **Drag-and-drop** zone with file preview
- **Accepted formats:** PDF, JPG, PNG, DOCX, HEIC
- **Max file size:** 10MB per file, 50MB total per form
- **Max files:** 10 per upload section
- **Progress:** Visual upload progress bar
- **OCR Processing:** Auto-extract details for invoices/prescriptions
- **Document Type Selection:** Dropdown for classification (Invoice, Prescription, Diagnosis, Other)

#### Provider/Clinic Search Pattern
- **Auto-complete search** field with real-time suggestions
- **Sources:** 
  - Saved clinics from user history
  - Google Places veterinary clinics
  - Platform registered providers
- **Display Details:**
  - Clinic name + address
  - Distance from user location
  - Phone number + website
  - Operating hours (if available)
- **Manual Entry:** "Add clinic manually" option if not found

#### Currency & Cost Fields
- **Default:** User's country currency (from location)
- **Selector:** Dropdown with flag icons and currency codes
- **Format:** Thousand separators, 2 decimal places
- **Validation:** Positive numbers only, max €99,999.99

---

### 1.2 Form Submission & Validation

#### Real-Time Validation
- **Required fields:** Red asterisk (*) indicator
- **Field-level validation:** Error message appears below field on blur
- **Form-level validation:** Summary alert before submission
- **Success states:** Green checkmark icon
- **Error states:** Red border + explanatory message

#### Auto-Save Functionality
- **Drafts:** Auto-save every 30 seconds for incomplete forms
- **Storage:** Browser localStorage + backend sync
- **Recovery:** "Resume from draft" option on form re-entry
- **User notification:** "Saving..." and "Saved!" indicators

#### Form State Management
- **Pristine:** No changes made
- **Dirty:** User has made changes
- **Submitting:** Loading state during submission
- **Success:** Confirmation screen with actions
- **Error:** Retry option with error details

---

## PART 2: INDIVIDUAL FORM SPECIFICATIONS

### FORM 1: ADD A NEW VISIT

#### Purpose
Record veterinary visits, check-ups, consultations, and emergency visits.

#### Form Structure

##### Section 1: Visit Selection
**Field:** Visit Type (Required)
- **Type:** Radio button group with icons
- **Options:**
  - 🏥 Routine Check-up (default)
  - 🚨 Emergency Visit
  - 💉 Vaccination (if vaccination-specific)
  - 👨‍⚕️ Specialist Consultation
  - 🧸 Behavioral Consultation
  - 🦷 Dental Cleaning/Check-up
  - 🏥 Surgery/Procedure
  - 🔬 Lab Work/Diagnostic
  - Other (text field)
- **Conditional:** Selection affects available fields below
- **Design:** Icon + label on single line, horizontal layout for desktop, vertical for mobile

**Field:** Visit Urgency (Optional)
- **Type:** Badge selector
- **Options:**
  - 🟢 Routine
  - 🟡 Urgent
  - 🔴 Emergency
- **Visual:** Color-coded badges, single select
- **Default:** Routine
- **Impact:** Affects notification urgency

##### Section 2: Visit Details
**Field:** Pet Selection (Required)
- **Type:** Pet selector component (see 1.1)
- **Validation:** Must have at least one pet profile

**Field:** Visit Date (Required)
- **Type:** Date picker calendar
- **Constraints:**
  - Min: Pet's date of birth
  - Max: Today (can't schedule past visits, use future dates for scheduled visits)
  - Disabled: Same-day visits if current time > 5 PM
- **Format:** Localized display (DD/MM/YYYY for Europe)
- **Mobile:** Native date input

**Field:** Visit Time (Required for scheduled visits)
- **Type:** Time picker (24-hour format)
- **Intervals:** 15-minute increments
- **Constraints:**
  - Valid clinic hours (show as background pattern)
  - Minimum 15 minutes in future for same-day booking
- **Optional for:** Past/historical visits
- **Mobile:** Native time input

**Field:** Duration (Optional)
- **Type:** Dropdown
- **Options:** 15 min, 30 min, 45 min, 1 hour, 1.5 hours, 2 hours, Unspecified
- **Default:** Unspecified
- **Use:** Helps with calendar blocking

##### Section 3: Provider & Location

**Field:** Veterinary Clinic/Provider (Required)
- **Type:** Auto-complete search + map integration
- **Behavior:**
  - Shows saved recent clinics first
  - Search by clinic name or address
  - Shows 5 suggestions with details (name, address, distance, rating)
  - Click to select and auto-fill address
  - Manual entry option
- **Fields populated automatically:** Address, Phone, Website (if available)
- **Validation:** Google Places API verification

**Field:** Address (Auto-filled, editable)
- **Type:** Address component with autocomplete
- **Sub-fields:**
  - Street address
  - City/Town
  - Postal code
  - Country (dropdown)
  - Specific location notes (e.g., "Building B, Ground floor")
- **Map Display:** Show on embedded Google Map
- **Geolocation:** "Use my location" button for mobile

**Field:** Contact Information (Auto-filled, editable)
- **Type:** Text fields
- **Sub-fields:**
  - Phone number (validated format)
  - Email address (optional)
  - Website URL (optional, with validation)
- **Validation:** Phone should be valid for clinic's country

**Field:** Travel Distance (Read-only, informational)
- **Type:** Calculated from user location to clinic
- **Display:** "X km away" or "X min drive"
- **Calculation:** Google Maps API

##### Section 4: Visit Notes & Observations

**Field:** Reason for Visit (Required for first-time clinics)
- **Type:** Rich text editor
- **Placeholder:** "e.g., Annual check-up, Ear infection, Vaccination due..."
- **Min length:** 5 characters
- **Max length:** 1000 characters
- **Features:**
  - Basic formatting (bold, italic)
  - Bullet points
  - Character counter
- **Pre-suggestions:** Common reasons based on visit type

**Field:** Symptoms/Concerns (Optional)
- **Type:** Multi-select tags + text area
- **Pre-defined tags:**
  - 🤢 Vomiting/Nausea
  - 💧 Diarrhea
  - 🦴 Lameness/Limping
  - 👂 Ear infection
  - 👀 Eye discharge
  - 🫕 Fever/Lethargy
  - 🦷 Dental problems
  - 💤 Loss of appetite
  - 🤧 Coughing/Sneezing
  - Other (custom text)
- **Behavior:** Tags filter additional questions below
- **Conditional:** Selecting tags shows relevant follow-up fields

**Field:** Current Medications (Optional)
- **Type:** Searchable dropdown or "Add medication" component
- **Data Source:** User's saved medications + pharmacy database
- **Display:** Medication name + dosage + frequency
- **Fields:**
  - Medication name (searchable)
  - Dosage (number + unit dropdown: mg, ml, tablet, etc.)
  - Frequency (dropdown: once daily, twice daily, as needed, etc.)
  - Duration (from-to date)
  - "Add another medication" button for multiple drugs
- **Validation:** Medication name required if section opened

**Field:** Special Instructions for Vet (Optional)
- **Type:** Text area
- **Placeholder:** "e.g., Anxious pet, difficult to handle ears, special diet..."
- **Max length:** 500 characters
- **Use:** Helps vet prepare

##### Section 5: Cost & Payment

**Field:** Invoice/Costs (Optional)
- **Type:** Expandable section
- **Sub-fields:**
  - **Total Cost:** Currency selector + number input
  - **Cost Breakdown** (optional):
    - Item/Service (dropdown: Consultation, Lab work, Medications, Procedure, etc.)
    - Amount (number)
    - "Add line item" button
  - **Payment Method:** Dropdown (Cash, Credit Card, Bank Transfer, App Payment)
  - **Insurance Claim:** Toggle + insurance provider dropdown

**Field:** Upload Invoice/Receipt (Optional)
- **Type:** Document upload component
- **Accepts:** PDF, JPG, PNG, DOCX
- **OCR:** Auto-extract provider info, amount, date
- **Field population:** Pre-fill cost field if amount detected

##### Section 6: Diagnostic Results & Recommendations

**Field:** Diagnosis/Assessment (Optional)
- **Type:** Rich text editor
- **Placeholder:** "Diagnosis, observations, assessment..."
- **Max length:** 2000 characters
- **Features:** Formatting tools, lists

**Field:** Vet's Recommendations (Optional)
- **Type:** Rich text editor or checkbox group
- **Options:**
  - ✅ Continue current medication
  - ✅ Increase/decrease medication
  - ✅ Change diet
  - ✅ Rest/activity restriction
  - ✅ Follow-up appointment (shows date picker)
  - ✅ Specialist referral (text field for specialist type)
  - ✅ Lab work needed (checkboxes for lab types)
  - Other (text field)

**Field:** Follow-up Appointment (Optional)
- **Type:** Date picker
- **Constraint:** Must be after current visit date
- **Creates reminder:** Auto-creates calendar event

**Field:** Attach Documents (Optional)
- **Type:** Multi-file upload
- **Document types:**
  - 📋 Lab Results
  - 📝 Discharge Papers
  - 💊 Prescription
  - 📸 X-ray/Imaging
  - Other
- **Max files:** 5
- **OCR Processing:** Extract key data from documents

##### Section 7: Reminders & Follow-up

**Field:** Set Health Reminder (Toggle)
- **Type:** Toggle switch + conditional fields
- **Default:** Off
- **When enabled:**
  - **Reminder Type:** Dropdown
    - Follow-up appointment
    - Medication refill
    - Next check-up due
    - Vaccination due
  - **Reminder Date:** Date picker (auto-suggested based on recommendation)
  - **Reminder Time:** Time picker
  - **Notification Method:** Checkboxes (App notification, Email, SMS)
- **Auto-suggest:** System suggests based on visit type and vet recommendations

**Field:** Share with Other Providers (Optional)
- **Type:** Toggle + email input
- **Behavior:** When enabled, shows "Invite another vet" fields
- **Fields:**
  - Vet/Provider email
  - Access level radio buttons:
    - View only
    - View + comment
  - Add another provider button
- **Notification:** Selected providers receive invitation

---

### FORM 2: ADD VACCINATION

#### Purpose
Record pet vaccinations with tracking and automatic reminders for due dates.

#### Form Structure

##### Section 1: Pet & Basic Info

**Field:** Pet Selection (Required)
- Same as Visit form

**Field:** Vaccine Name (Required)
- **Type:** Searchable dropdown with custom entry
- **Pre-populated options:**
  - Dogs:
    - DHPP (Distemper, Hepatitis, Parvo, Para-influenza)
    - Rabies
    - Bordetella (Kennel cough)
    - Lyme disease
    - Leptospirosis
  - Cats:
    - FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)
    - Rabies
    - FeLV (Feline Leukemia)
    - Bordetella (optional)
  - Other species specific options
  - Custom vaccine entry (text field)
- **Display format:** "Vaccine Name (ABBR)" with tooltip
- **Search behavior:** Filter by pet species first

**Field:** Date Administered (Required)
- **Type:** Date picker
- **Constraints:**
  - Min: Pet's date of birth
  - Max: Today
  - Cannot be future date
- **Format:** Localized (DD/MM/YYYY)
- **Validation:** Real-time check for duplicate vaccines within 30 days

**Field:** Date Administered (Time) (Optional)
- **Type:** Time picker
- **Intervals:** 30-minute increments
- **Use:** For detailed records

##### Section 2: Medical Details

**Field:** Batch/Lot Number (Optional)
- **Type:** Text input
- **Placeholder:** "e.g., A123-BC45"
- **Format:** Accepts alphanumeric, hyphen
- **Validation:** Basic format check
- **Use:** Batch tracking, recalls

**Field:** Manufacturer (Optional)
- **Type:** Searchable dropdown
- **Options:** Merial, Boehringer Ingelheim, Zoetis, Virbac, etc.
- **Custom entry:** Allowed

**Field:** Route of Administration (Optional)
- **Type:** Dropdown
- **Options:**
  - Subcutaneous (under the skin)
  - Intramuscular (muscle injection)
  - Intranasal (nose spray)
  - Oral (mouth)
  - Topical (on skin)
  - Intradermal (skin)
  - Other

**Field:** Administered By (Optional)
- **Type:** Text input or dropdown
- **Options:**
  - Pre-filled: Vet from last visit
  - Searchable: Find previous vet
  - Custom: Manual entry

##### Section 3: Provider & Cost

**Field:** Veterinary Clinic (Required)
- **Type:** Auto-complete clinic search
- Same as Visit form clinic selection
- **Validation:** Required field

**Field:** Total Cost (Optional)
- **Type:** Currency selector + number input
- **Default currency:** User's country
- **Validation:** Positive number, max €10,000

**Field:** Insurance/Payment (Optional)
- **Type:** Toggle + dropdown
- **Options:**
  - Self-paid
  - Insurance claim
  - Sponsor/Charity covered
- **If insurance:** Shows insurance provider dropdown

**Field:** Upload Vaccination Certificate (Optional)
- **Type:** Document upload
- **Formats:** PDF, JPG, PNG, HEIC
- **OCR Processing:** Extract vaccine name, date, lot number, vet signature
- **Max size:** 10MB
- **Purpose:** Physical record backup

##### Section 4: Next Dose & Reminders

**Field:** Vaccination Schedule (Optional but recommended)
- **Type:** Display + editable
- **Behavior:**
  - System shows recommended next dose date based on vaccine type
  - Shows as read-only suggestion or editable field
  - Varies by vaccine and age
  - Examples:
    - DHPP: Booster every 1-3 years
    - Rabies: Every 1-3 years (depends on location law)
    - FeLV: Booster annually or every 2-3 years
- **Display options:**
  - Radio buttons for suggested intervals
  - Custom date picker

**Field:** Next Vaccination Due Date (Optional)
- **Type:** Date picker (auto-populated from schedule)
- **Constraint:** Must be after current vaccination date
- **Validation:** Shows warning if date is unusual

**Field:** Set Reminder (Toggle)
- **Type:** Toggle switch + conditional fields
- **Default:** On
- **When enabled:**
  - **Alert Before Due Date:** Radio buttons
    - 1 week before
    - 2 weeks before
    - 1 month before
    - 2 months before
  - **Reminder Method:** Checkboxes
    - App notification
    - Email
    - SMS
  - **Notification recipients:** Multi-select
    - Primary owner
    - Other family members (selected from saved contacts)
    - Veterinarian (vet gets copy of reminder)

**Field:** Vaccination Type (Optional)
- **Type:** Badge/toggle
- **Options:**
  - Core vaccine (essential)
  - Non-core vaccine (optional, lifestyle-dependent)
- **Informational:** Tooltip explaining difference

##### Section 5: Notes & Health Records

**Field:** Reaction/Side Effects (Optional)
- **Type:** Text area + conditional checkboxes
- **Checkboxes:**
  - ☑️ No reaction
  - ☑️ Mild swelling at injection site
  - ☑️ Lethargy/tiredness
  - ☑️ Loss of appetite
  - ☑️ Fever
  - ☑️ Vomiting/diarrhea
  - ☑️ Allergic reaction (severe)
  - Other (text field)
- **If severe selected:** Shows urgent contact vet button
- **Text area:** For detailed description
- **Severity indicator:** Optional scale (Mild/Moderate/Severe)

**Field:** Any Additional Notes (Optional)
- **Type:** Text area
- **Placeholder:** "e.g., Pet was anxious, needed two staff members, vet recommended..."
- **Max length:** 500 characters

---

### FORM 3: ADD TREATMENT/MEDICATION

#### Purpose
Record medications, supplements, treatments, and ongoing therapies with dosage tracking.

#### Form Structure

##### Section 1: Pet & Medication Selection

**Field:** Pet Selection (Required)
- Same as previous forms

**Field:** Medication/Treatment Name (Required)
- **Type:** Searchable dropdown + custom entry
- **Data source:** 
  - Pharmacy/medication database
  - User's previous medications
  - Common pet medications
- **Search by:**
  - Drug name (e.g., "Amoxicillin")
  - Brand name (e.g., "Amoxypen")
  - Active ingredient
  - Condition (e.g., "antibiotic")
- **Display:** "Drug Name (Brand) - Strength"
- **Custom entry:** Full text field for unlisted medications
- **Validation:** Name required, min 2 characters

**Field:** Treatment Type (Required)
- **Type:** Radio button group with icons
- **Options:**
  - 💊 Medication (tablet, capsule, liquid)
  - 💉 Injection (IV, IM, SC, etc.)
  - 🧪 Supplement (vitamin, mineral, herbal)
  - 🌿 Natural remedy
  - 🧴 Topical treatment (ointment, cream, spray)
  - 🦴 Physical therapy
  - 🏥 Procedure/Surgery
  - Other (text field)
- **Conditional:** Selection affects available fields below

##### Section 2: Dosage & Administration

**Field:** Dosage (Required if medication)
- **Type:** Number input + unit dropdown
- **Validation:** Positive number, max 999
- **Units:** Dropdown
  - mg (milligram) - default
  - µg (microgram)
  - ml (milliliter)
  - g (gram)
  - IU (international units)
  - % (percentage)
  - Tablets/capsules (quantity)
  - Drops
  - ml (liquid medication)
  - Other

**Field:** Frequency (Required if medication)
- **Type:** Smart dropdown/radio group
- **Options:**
  - Once daily (OD)
  - Twice daily (BID)
  - Three times daily (TID)
  - Four times daily (QID)
  - Every 4 hours
  - Every 6 hours
  - Every 8 hours
  - Every 12 hours
  - Every 24 hours
  - Every 48 hours
  - Once weekly
  - Twice weekly
  - Three times weekly
  - Once monthly
  - As needed (PRN)
  - Other (text field for custom frequency)
- **Default:** Once daily
- **Conditional:** "As needed" shows additional fields for frequency range

**Field:** Frequency Details (Conditional, if "As needed" selected)
- **Type:** Text field
- **Placeholder:** "e.g., Every 4-6 hours as needed, Up to 3 times daily"

**Field:** Administration Time(s) (Recommended)
- **Type:** Time picker(s) with "+" button for multiple times
- **Behavior:**
  - First time pre-filled based on frequency
  - Each time picker in 30-minute increments
  - Can add up to 4 times daily
  - Shows visual timeline
- **Example:** Twice daily shows 09:00 and 21:00
- **Optional:** Can be skipped for "as needed" medications
- **Mobile:** Shows time picker one at a time

**Field:** Best Time to Give (Optional)
- **Type:** Checkboxes
- **Options:**
  - ☑️ With food
  - ☑️ On empty stomach
  - ☑️ Morning
  - ☑️ Evening
  - ☑️ Before bed
  - ☑️ After exercise
  - ☑️ With water only
  - Custom notes (text field)

##### Section 3: Duration & Schedule

**Field:** Start Date (Required)
- **Type:** Date picker
- **Constraint:** Today or future date
- **Format:** Localized (DD/MM/YYYY)
- **Validation:** Real-time feedback

**Field:** End Date / Duration (Required)
- **Type:** Toggle between two modes
  - **Mode 1: Specific End Date**
    - Date picker
    - Constraint: After start date
    - Label: "Until when"
  - **Mode 2: Duration**
    - Number input + unit dropdown
    - Units: Days, Weeks, Months, Years, Ongoing
    - Calculated end date shows below
- **Validation:** Duration must be positive
- **"Ongoing" option:** Removes end date, good for chronic medications

**Field:** Refill Schedule (Optional)
- **Type:** Toggle + conditional fields
- **When enabled:**
  - Refill every: Number input + unit (Days/Weeks/Months)
  - Quantity per refill: Number input
  - Pharmacy: Dropdown or text input
  - Prescription number: Text field
  - Auto-refill enabled: Toggle

##### Section 4: Dosage & Special Instructions

**Field:** Strength (Auto-populated from medication name or manual)
- **Type:** Text field or read-only display
- **Format:** Shows unit of strength (e.g., "250mg" or "5ml/5mg")
- **Editable:** If user found medication manually

**Field:** Form/Route (Optional but recommended)
- **Type:** Dropdown
- **Options:**
  - Tablet
  - Capsule
  - Liquid/Syrup
  - Suspension
  - Solution
  - Cream/Ointment
  - Spray
  - Patch
  - Injection
  - Suppository
  - Powder
  - Other

**Field:** Administration Instructions (Optional but important)
- **Type:** Text area + rich text editor
- **Placeholder:** "e.g., Give with food to prevent stomach upset. Do not crush tablets. Shake bottle before each use..."
- **Max length:** 1000 characters
- **Pre-suggestions:** Based on drug name (from database)
- **Icons/formatting:** Can add bullet points, emphasis

**Field:** Weight-Based Dosing (Optional, for calculations)
- **Type:** Toggle + fields
- **When enabled:**
  - Pet current weight: Auto-filled from pet profile
  - Dosage per kg: Number input
  - Calculated dose: Auto-calculated and displayed
  - Shows calculation: "X kg × Y mg/kg = Z mg total"

##### Section 5: Provider & Cost

**Field:** Prescribed By (Optional)
- **Type:** Auto-complete search
- **Data:**
  - Previous veterinarians
  - Recent visit clinics
  - Manual entry
- **Display:** Vet name + clinic name
- **Validation:** Name optional but recommended

**Field:** Pharmacy/Provider (Optional)
- **Type:** Auto-complete search + map
- **Same as clinic selection in Visit form**
- **For medications:** Shows nearby pharmacies

**Field:** Cost (Optional)
- **Type:** Currency selector + number input
- **Validation:** Positive number, max €9,999
- **Fields:**
  - Unit price (per dose or per bottle)
  - Quantity
  - Total cost (auto-calculated)

**Field:** Upload Prescription (Optional)
- **Type:** Document upload
- **Formats:** PDF, JPG, PNG
- **OCR:** Extract medication name, dosage, duration
- **Max size:** 10MB

**Field:** Insurance Coverage (Optional)
- **Type:** Toggle + dropdown
- **Options:**
  - Not covered
  - Covered by pet insurance
  - Covered by prescription plan
  - Partial coverage (show %)
- **If covered:** Shows covered amount and out-of-pocket cost

##### Section 6: Reminders & Side Effects

**Field:** Set Reminder (Toggle)
- **Type:** Toggle switch
- **Default:** On if frequency is daily or more
- **Options:**
  - Remind me at administration time: Toggle
  - Also remind 30 minutes before: Toggle
  - Notify caregivers: Multi-select (if family members added to pet profile)
- **Notification methods:** Checkboxes
  - App notification
  - Email
  - SMS
  - Calendar event

**Field:** Potential Side Effects (Optional)
- **Type:** Checkboxes + text area
- **Common side effects:** Pre-populated based on medication
  - ☑️ No side effects
  - ☑️ Drowsiness/lethargy
  - ☑️ Loss of appetite
  - ☑️ Vomiting/diarrhea
  - ☑️ Increased thirst/urination
  - ☑️ Allergic reaction
  - ☑️ Behavioral changes
  - ☑️ Other (text field)
- **Text area:** For detailed observations
- **Severity:** Optional scale (Mild/Moderate/Severe)
- **Vet notification:** Button to contact vet if side effect occurs

**Field:** Contraindications/Interactions (Optional)
- **Type:** Expandable informational section
- **Auto-populated:** Based on medication + other active medications
- **Display:**
  - List of medications/supplements to avoid
  - Foods to avoid
  - Activities to avoid (e.g., "Avoid exposure to sunlight")
  - Alcohol interaction
  - Checkpoint: "I confirm there are no interactions with other medications" (checkbox)

**Field:** Storage Instructions (Optional)
- **Type:** Dropdown or text field
- **Pre-options:**
  - Room temperature
  - Refrigerate (2-8°C)
  - Keep away from sunlight
  - Keep away from moisture
  - Frozen
  - Other (custom text)

##### Section 7: Notes & Medical History

**Field:** Reason for Treatment (Optional but recommended)
- **Type:** Text field or dropdown
- **Placeholder:** "e.g., Urinary tract infection, Pain relief, Anxiety, Seasonal allergies..."
- **Searchable options:** Common conditions
- **Custom entry:** Full text field

**Field:** Condition Being Treated (Optional)
- **Type:** Rich text editor
- **Use:** Document diagnosis, symptoms being addressed
- **Max length:** 500 characters

**Field:** Monitor/Watch For (Optional)
- **Type:** Checkboxes + text area
- **Options:**
  - ☑️ Response to treatment
  - ☑️ Signs of improvement
  - ☑️ Worsening symptoms
  - ☑️ Behavioral changes
  - ☑️ Lab values (if applicable)
  - ☑️ Other (text field)
- **Follow-up note:** Text area describing what to monitor

---

### FORM 4: HEALTH METRICS (Weight, Height, Vital Signs)

#### Purpose
Track pet's physical development, vital signs, and health metrics over time.

#### Form Structure

##### Section 1: Pet & Visit Info

**Field:** Pet Selection (Required)
- Same as previous forms

**Field:** Measurement Date (Required)
- **Type:** Date picker
- **Constraint:** Today or past date
- **Format:** Localized
- **Validation:** Cannot be before pet's birth

**Field:** Measurement Location (Optional)
- **Type:** Dropdown
- **Options:**
  - Home (self-measured)
  - Veterinary clinic
  - Pet grooming facility
  - Pet store
  - Other
- **Use:** Context for accuracy assessment

**Field:** Measured By (Optional)
- **Type:** Text field or dropdown
- **Options:**
  - Self
  - Veterinarian name (searchable)
  - Groomer
  - Family member
  - Professional (text field)

##### Section 2: Physical Measurements

**Field:** Weight (Required)
- **Type:** Number input + unit selector
- **Units:** Radio buttons
  - kg (default)
  - lbs
- **Validation:**
  - Positive number
  - Min: 0.1 kg (100g)
  - Max: 200 kg
  - Warning if drastically different from last recorded weight (±20%)
- **Decimal places:** 1 (e.g., 25.5 kg)
- **Progress indicator:** Shows change from last weight
  - Green if healthy increase for growing pets
  - Red if unexpected loss
  - Blue if stable

**Field:** Body Condition Score (Optional but recommended)
- **Type:** Visual slider + text description
- **Scale:** 1-9 or 1-5 (choose system)
- **Visual representation:**
  - Show silhouettes of pet at each score
  - 1-3: Underweight (ribcage too visible)
  - 4-5: Ideal (ribs palpable, defined waist)
  - 6-9: Overweight to obese (ribs not visible, no waist)
- **Description:** Auto-generated based on score
- **Interactive:** Hover shows text description

**Field:** Length/Height (Optional)
- **Type:** Number input + unit
- **Units:** cm (default) or inches
- **Measurement points:**
  - For dogs/cats: Nose to tail base (typical length)
  - Shoulder height (standing measurement)
- **Validation:** Positive number, reasonable range for species
- **Helpful note:** "Measure from nose to tail base" with diagram

**Field:** Girth/Circumference (Optional, for muscle assessment)
- **Type:** Number input + unit
- **Measurement:** Around chest behind front legs
- **Units:** cm or inches
- **Use:** Track muscle development

**Field:** Height at Shoulder (Optional, for large breeds)
- **Type:** Number input + unit
- **Measurement:** Distance from ground to shoulder blade
- **Use:** Breed standard comparison

##### Section 3: Vital Signs

**Field:** Heart Rate (Optional)
- **Type:** Number input
- **Unit:** beats per minute (bpm)
- **Validation:** 
  - Positive number
  - Reasonable range: 40-250 bpm depending on species/size
  - Warning if outside normal range for pet species
- **Help text:** "Normal range varies by species and size"
- **Reference chart:** Collapsible section with normal ranges
- **Measurement note:** Mention if taken during rest or activity

**Field:** Respiratory Rate (Optional)
- **Type:** Number input
- **Unit:** breaths per minute
- **Validation:** 
  - Positive number
  - Reasonable range: 10-40 bpm for most pets
  - Warning if outside range
- **Help text:** "Count breaths for 15 seconds and multiply by 4"
- **Reference:** Normal ranges by species

**Field:** Body Temperature (Optional)
- **Type:** Number input + unit selector
- **Units:** °C (default) or °F
- **Validation:** 
  - Decimal places: 1 (e.g., 38.5°C)
  - Reasonable range: 35-40°C for most pets
  - Warning if fever (>39°C) or hypothermia (<37.5°C)
  - Conversion between units available
- **Normal range:** 38-39°C for most pets
- **Color indicator:** Green (normal), Yellow (slight fever), Red (high fever)

**Field:** Blood Pressure (Optional)
- **Type:** Two number inputs (systolic/diastolic) + unit
- **Format:** XXX/XX mmHg
- **Validation:**
  - Positive numbers
  - Reasonable range: 100-150 / 60-90 mmHg
  - Warning if hypertension detected
- **Help text:** "Systolic/Diastolic pressure"

**Field:** Pain Assessment (Optional)
- **Type:** Visual pain scale
- **Display:** Numeric scale 1-10 with facial expressions or descriptor words
  - 1: No pain
  - 3: Mild discomfort
  - 5: Moderate pain
  - 7: Severe pain
  - 10: Severe pain, unable to function
- **Observation notes:** Text area for pain description
  - "Limping on right hind leg"
  - "Reluctant to jump"
  - "Vocalizing when touched"

##### Section 4: Body Condition & Appearance

**Field:** Coat Condition (Optional)
- **Type:** Dropdown + optional notes
- **Options:**
  - Excellent (shiny, full, healthy)
  - Good (clean, minor issues)
  - Fair (some matting, dry patches)
  - Poor (matted, dull, significant issues)
- **Notes:** Text field for observations

**Field:** Appetite Level (Optional)
- **Type:** Radio button group
- **Options:**
  - Excellent (eats all offered)
  - Good (eats most)
  - Fair (eats some)
  - Poor (minimal intake)
  - Not eating
- **Additional notes:** Text field for description

**Field:** Hydration Status (Optional)
- **Type:** Radio button group
- **Options:**
  - Well hydrated
  - Slightly dehydrated (skin tent test)
  - Moderately dehydrated
  - Severely dehydrated
- **Help text:** Turgor test explanation with diagram

**Field:** Activity Level (Optional)
- **Type:** Slider or radio group
- **Scale:** 
  - Low (lethargic, minimal movement)
  - Low-Moderate (sleeping most of day)
  - Moderate (normal activity for age)
  - High (playful, energetic)
  - Very High (hyperactive)
- **Observation:** Text area for notes

##### Section 5: Lab Values (if applicable)

**Field:** Lab Test Results (Optional)
- **Type:** Collapsible expandable section with add-on capability
- **Sub-section for each lab test:**
  - **Test Name:** Dropdown
    - Bloodwork (CBC, Chemistry panel, etc.)
    - Urinalysis
    - Thyroid (T4, TSH)
    - Fecal exam
    - Other (custom text)
  - **Result Value:** Number input + unit
  - **Reference Range:** Display normal range (read-only)
  - **Unit:** Dropdown (varies by test)
  - **Result Status:** Auto-determined
    - Green: Normal
    - Yellow: Slightly abnormal
    - Red: Significantly abnormal
  - **Lab/Provider:** Text field
  - **Test Date:** Date picker
  - **Add another test:** Button
- **Upload report option:** Document upload for lab results

##### Section 6: Notes & Context

**Field:** Health Notes (Optional)
- **Type:** Rich text editor
- **Placeholder:** "e.g., Recently switched food, recovering from surgery, noticed increased drinking..."
- **Max length:** 1000 characters
- **Formatting:** Bold, italic, lists

**Field:** Compare to Previous (Optional)
- **Type:** Expandable section showing comparison to last measurement
- **Display:**
  - Previous weight: X kg
  - Current weight: Y kg
  - Change: ±Z kg (±Z%)
  - Weight trend chart (mini graph last 6-12 months)
  - Trend indicator: ↑ ↓ → (up, down, stable)

**Field:** Veterinary Consultation Needed (Optional)
- **Type:** Toggle + reason selector
- **When enabled:**
  - Reason checkboxes:
    - ☑️ Weight gain concern
    - ☑️ Weight loss concern
    - ☑️ Vital signs abnormal
    - ☑️ Behavioral concern
    - ☑️ Other (text)
  - Shows "Contact Vet" CTA button
  - Offers to create visit automatically

---

### FORM 5: ALLERGIES & SENSITIVITIES

#### Purpose
Document pet's allergies, food sensitivities, environmental allergies, and medication reactions.

#### Form Structure

##### Section 1: Pet & Allergy Info

**Field:** Pet Selection (Required)
- Same as previous forms

**Field:** Allergy Type (Required)
- **Type:** Radio button group with icons
- **Options:**
  - 🍖 Food Allergy
  - 🌿 Environmental Allergy
  - 💊 Medication/Drug Allergy
  - 🐝 Insect/Parasite Reaction
  - 📍 Contact/Skin Allergy
  - 🦠 Infection-related Sensitivity
  - Behavioral/Trigger (sensitivity to situations)
  - Other (text field)
- **Conditional:** Selection affects available fields below

##### Section 2: Allergen Details

**Field:** Specific Allergen (Required)
- **Type:** Searchable dropdown + custom entry
- **Behavior:** Options change based on allergy type selected
  
  **If Food Allergy:**
  - Common food allergens:
    - Beef, Chicken, Wheat, Corn, Soy, Dairy, Eggs, Fish, Chicken, Poultry by-products
  - Ingredient allergens:
    - Grain-free proteins
    - Specific proteins
  - Additive allergens:
    - Food coloring, Preservatives, Artificial flavors
  - Search by food name or ingredient
  
  **If Environmental Allergy:**
  - Pollen (grass, ragweed, trees, mold)
  - Dust/dust mites
  - Mold spores
  - Seasonal triggers (spring, fall, year-round)
  - Smoke
  - Perfumes/scents
  - Wool
  - Specific materials
  
  **If Medication/Drug Allergy:**
  - Search by drug name (Penicillin, Amoxicillin, NSAIDs, etc.)
  - Drug class (Antibiotics, NSAIDs, Anesthetics)
  - Specific drug component
  
  **If Insect/Parasite:**
  - Flea saliva (most common)
  - Mites
  - Lice
  - Bee/wasp stings
  - Specific parasites
  
  **If Contact/Skin Allergy:**
  - Materials: Rubber, Plastic, Certain collars
  - Cleansing products
  - Topical medications
  - Specific plants
  - Other contact materials

- **Custom entry:** Full text field for allergens not in list
- **Allow multiple allergens:** "+ Add another allergen" button

##### Section 3: Allergy Severity & Symptoms

**Field:** Severity Level (Required)
- **Type:** Radio button group with visual indicators
- **Options:**
  - 🟡 Mild (minor discomfort, manageable)
  - 🟠 Moderate (significant discomfort, affects quality of life)
  - 🔴 Severe (life-threatening, requires immediate treatment)
  - 🔴 Anaphylaxis (severe allergic reaction, emergency)
- **Color-coded:** Visual indicator changes form styling
- **Validation:** Severe/Anaphylaxis shows urgent warning and emergency contact options

**Field:** Symptoms (Required)
- **Type:** Checkbox group + text area
- **Common symptoms by allergy type:**
  
  **Food Allergy/Sensitivity:**
  - ☑️ Itching/scratching
  - ☑️ Skin rash/hives
  - ☑️ Vomiting/regurgitation
  - ☑️ Diarrhea
  - ☑️ Constipation
  - ☑️ Gas/bloating
  - ☑️ Ear infections/shaking ears
  - ☑️ Paw chewing/licking
  - ☑️ Loss of appetite
  - ☑️ Weight loss
  - ☑️ Behavioral changes
  
  **Environmental Allergy:**
  - ☑️ Itching/scratching
  - ☑️ Excessive licking
  - ☑️ Hair loss/alopecia
  - ☑️ Skin redness/inflammation
  - ☑️ Sneezing/coughing
  - ☑️ Nasal discharge
  - ☑️ Eye discharge/tearing
  - ☑️ Ear infections
  - ☑️ Paw licking/swelling
  
  **Drug Allergy:**
  - ☑️ Skin rash/hives
  - ☑️ Vomiting/diarrhea
  - ☑️ Difficulty breathing/swelling
  - ☑️ Lethargy/collapse
  - ☑️ Fever
  - ☑️ Other (text field)
  
  **Other types:** Similar symptom lists

- **Text area:** For detailed symptom description and timing
- **Symptom onset:** Dropdown
  - Immediate (minutes to hours)
  - Delayed (hours to days)
  - Other (custom text)

**Field:** Reaction Timeline (Optional)
- **Type:** Text area
- **Placeholder:** "e.g., Rash appears within 2 hours of eating chicken, resolves in 24 hours with treatment..."
- **Use:** Document pattern and duration

##### Section 4: Triggers & Avoidance

**Field:** Known Triggers (Optional)
- **Type:** Text area + tagged list
- **Examples:**
  - Specific brands
  - Food ingredients
  - Environmental conditions
  - Seasonal triggers
  - Specific locations
- **Tag creation:** Type trigger and press Enter to add tags
- **Remove tags:** X button on each tag

**Field:** Avoidance Measures (Optional but important)
- **Type:** Checkboxes + text area
- **Options:**
  - ☑️ Avoid food (specific ingredients listed)
  - ☑️ Environmental control (details in notes)
  - ☑️ Medication precautions (drugs to avoid listed)
  - ☑️ Regular grooming/bathing
  - ☑️ Dietary supplements
  - ☑️ Air filtration/humidity control
  - ☑️ Other (text field)

**Field:** Safe Foods/Alternatives (Optional, for food allergies)
- **Type:** Taggable list + search
- **Add safe food:** Text input with "+" button
- **Common safe alternatives:**
  - Novel proteins (venison, duck, rabbit, kangaroo)
  - Limited ingredient diets
  - Hypoallergenic commercial diets
  - Prescription diets
- **Remove:** X button on tags
- **Example:** "Turkey, Potato, Brown Rice, Salmon, Lamb"

##### Section 5: Medical History & Treatment

**Field:** Diagnosed By (Optional)
- **Type:** Text field or veterinarian search
- **Options:**
  - Veterinarian name
  - Clinic name
  - "Self-diagnosed" option
- **Date diagnosed:** Date picker

**Field:** Diagnostic Test (Optional)
- **Type:** Dropdown
- **Options:**
  - Elimination diet trial
  - Intradermal skin test
  - Blood allergy test (RAST)
  - Food challenge test
  - Clinical observation
  - Not formally diagnosed (suspected)
  - Other (text field)
- **Test results:** Document upload or text summary

**Field:** Current Treatment Plan (Optional)
- **Type:** Collapsible section with multiple sub-fields
  
  **Treatment items:**
  - **Medication:** Searchable dropdown (names from Form 3)
    - Links to existing medication record if available
  - **Supplement:** Text field or dropdown
  - **Diet/Food:** Searchable
  - **Topical treatment:** Text field (shampoo, cream, spray)
  - **Environmental control:** Text field
  - **Other:** Text field
  
  **For each treatment:**
  - Add button to include in form
  - Remove button to delete
  - Details link to edit dosage/frequency

**Field:** Medications Used During Reaction (Optional)
- **Type:** Medication selector + dosage
- **Checkboxes for emergency medications:**
  - ☑️ Antihistamine (name, dose)
  - ☑️ Corticosteroid (name, dose)
  - ☑️ Epinephrine/EpiPen (if severe)
  - ☑️ Other (text field)
- **Storage notes:** Where emergency meds are stored
- **Expiration reminder:** Auto-set reminder for expiration dates

**Field:** Effectiveness of Treatment (Optional)
- **Type:** Radio button group or slider
- **Options:**
  - ☑️ Excellent (symptoms resolved or significantly improved)
  - ☑️ Good (manageable symptoms)
  - ☑️ Fair (some improvement but ongoing issues)
  - ☑️ Poor (little to no improvement)
  - ☑️ Not yet tried/too new
- **Notes:** Text area for details

##### Section 6: Impact & Management

**Field:** Impact on Quality of Life (Optional)
- **Type:** Slider with description
- **Scale:** 1-10
- **Labels:**
  - 1-3: Minimal impact
  - 4-6: Moderate impact
  - 7-10: Severe impact
- **Description:** Auto-generated based on slider
- **Observation:** Text area for details

**Field:** Seasonal Pattern (Optional, for environmental allergies)
- **Type:** Checkboxes
- **Options:**
  - ☑️ Spring (March-May)
  - ☑️ Summer (June-August)
  - ☑️ Fall (September-November)
  - ☑️ Winter (December-February)
  - ☑️ Year-round
- **Peak months:** Optional text field

**Field:** Emergency Contact Plan (Optional but important if severe)
- **Type:** Collapsible section
- **Fields:**
  - Primary veterinarian: Search + phone number
  - Emergency clinic: Search + phone number
  - Allergy alert: Toggle to show on pet profile
  - Emergency contacts: Multi-add for family members
  - Quick action: "Call vet" button styled prominently if severe allergy

**Field:** Vaccination Considerations (Optional)
- **Type:** Text area
- **Placeholder:** "e.g., Avoid vaccines with egg protein, discuss alternatives with vet..."
- **Checkbox:** "Vet is aware of this allergy" (verification)

##### Section 7: Documentation & Reminders

**Field:** Upload Allergy Documentation (Optional)
- **Type:** Document upload
- **Accepts:** PDF, JPG, PNG
- **Examples:**
  - Allergy test results
  - Elimination diet trial notes
  - Vet diagnosis letter
  - Prescription diet instructions

**Field:** Set Reminder (Toggle)
- **Type:** Toggle + conditional fields
- **When enabled:**
  - Reminder frequency:
    - Before seasonal trigger (for environmental allergies)
    - Before feeding new food (for food allergies)
    - Before medication use (for drug allergies)
  - Notification method: Checkboxes (App, Email, SMS)
  - Reminder content: Option to include treatment plan or medication list

**Field:** Share with Vet (Optional)
- **Type:** Toggle + vet selector
- **When enabled:**
  - Select veterinarian(s)
  - Share: Full record or summary only
  - Notification: Vet receives update
  - Permission: For vet to comment/suggest treatment

---

### FORM 6: MEDICAL DOCUMENTS & RECORDS

#### Purpose
Upload and organize veterinary documents, invoices, prescriptions, and medical records.

#### Form Structure

##### Section 1: Document Classification

**Field:** Document Type (Required)
- **Type:** Icon-based button grid or dropdown
- **Options:**
  - 🏥 Diagnosis/Assessment
  - 💊 Prescription
  - 💰 Invoice/Receipt
  - 📋 Lab Results
  - 📸 Imaging (X-ray, Ultrasound, CT)
  - 📝 Discharge/Medical Report
  - 💉 Vaccination Certificate
  - 📄 Medical History
  - 🧾 Insurance Document
  - 👤 ID/Identification (microchip certificate)
  - Other (text field)
- **Visual:** Icon + label for clarity
- **Selection:** Single or multiple toggle

**Field:** Pet Associated (Optional but recommended)
- **Type:** Pet selector
- **Default:** If one pet, auto-selected
- **Multiple pets:** Show selector
- **Optional:** Leave blank for shared/family documents

**Field:** Document Source (Optional)
- **Type:** Dropdown
- **Options:**
  - General veterinary clinic
  - Specialist/referral clinic
  - Emergency clinic
  - Surgical center
  - Pharmacy
  - Laboratory
  - Pet grooming facility
  - Home care
  - Other (text field)

##### Section 2: Document Upload

**Field:** Upload Document(s) (Required)
- **Type:** Multi-file drag-and-drop upload area
- **Accepts:** PDF, JPG, PNG, HEIC, DOCX, TIF
- **Max per file:** 10MB
- **Max per upload:** 50MB total
- **Max files:** 10 per document type
- **Features:**
  - Drag-and-drop zone
  - Click to browse
  - File preview (thumbnail)
  - Progress indicator
  - Remove individual files
  - Batch upload display

**Field:** Date of Document (Optional)
- **Type:** Date picker
- **Default:** Today
- **Constraint:** Cannot be future date
- **Use:** If date not in document

**Field:** Document Title (Optional but recommended)
- **Type:** Text field
- **Placeholder:** "e.g., Post-surgical discharge, Annual bloodwork, Dental cleaning invoice..."
- **Auto-suggested:** If OCR detects title from document
- **Max length:** 100 characters

##### Section 3: Document Details & OCR

**Field:** OCR Extracted Data (Optional, auto-populated if applicable)
- **Type:** Read-only expandable section
- **For invoices, extracts:**
  - Provider name
  - Date of service
  - Services rendered (list)
  - Total cost
  - Payment method
- **For prescriptions, extracts:**
  - Medication name
  - Dosage
  - Frequency
  - Duration
  - Prescriber name
- **For lab results, extracts:**
  - Test names
  - Results/values
  - Reference ranges
  - Test date
- **User override:** "Edit" button to correct extracted data
- **Confidence score:** Shows % confidence of extraction (70-99%)
- **Unreliable extraction:** Requests manual entry for low confidence

**Field:** Manual Details Entry (Optional)
- **Type:** Context-aware fields based on document type
  
  **For invoices:**
  - Clinic/provider name
  - Total cost
  - Cost breakdown (services, items)
  - Payment date
  - Invoice number
  - Insurance claim status
  
  **For prescriptions:**
  - Medication name
  - Dosage/frequency
  - Quantity
  - Duration
  - Prescriber name
  - Expiration date
  
  **For lab results:**
  - Test type(s)
  - Date of test
  - Test location
  - Key results summary
  - Abnormality flags (if any)
  
  **For diagnosis/reports:**
  - Condition/diagnosis
  - Symptoms
  - Recommendations
  - Follow-up date (if applicable)

##### Section 4: Linked Records

**Field:** Link to Related Records (Optional)
- **Type:** Multi-select checkboxes or search
- **Searchable:** Find related records
- **Options:**
  - Link to visit (if this document from recent visit)
  - Link to medication (if prescription document)
  - Link to treatment
  - Link to allergy/health condition
  - Link to vaccination record
- **Display:** Shows linked records count
- **Remove:** Option to unlink if incorrect

**Field:** Add Notes/Comments (Optional)
- **Type:** Text area
- **Placeholder:** "e.g., Important points from report, follow-up actions needed..."
- **Max length:** 500 characters
- **Tagging:** Can mention @veterinarian or @familymember

##### Section 5: Sharing & Access

**Field:** Document Visibility (Optional)
- **Type:** Radio button group
- **Options:**
  - 🔒 Private (only me, not shared)
  - 👥 Shared with family members (toggle to select)
  - 🏥 Shared with veterinarian(s) (select from saved vets)
  - 🌍 Public (for blog posts, case studies - rare)
- **Conditional:** Selecting "shared" shows selector

**Field:** Share with Veterinarian (Optional)
- **Type:** Multi-select dropdown
- **Data:** 
  - Recent veterinarians
  - All saved veterinarians
  - Search by name or clinic
- **Notification:** Toggle to notify selected vets
- **Access level:** Read-only view, no editing

**Field:** Share with Family Members (Optional)
- **Type:** Multi-select from family list
- **Display:** Family member names + relationship
- **Add new:** "Invite family member" option
- **Notification:** Toggle to notify selected members

**Field:** Expiration/Archive (Optional)
- **Type:** Toggle + date picker
- **When enabled:**
  - Auto-archive date: Date picker
  - Reminder before archival: Toggle
  - Move to archive instead of delete: Option
- **Use:** Keep active documents front-and-center, archive old records

##### Section 6: Organization & Metadata

**Field:** Document Tags (Optional)
- **Type:** Free-form tagging with suggestions
- **Suggestions:**
  - Common health conditions
  - Body parts (eye, ear, paw, spine)
  - Medication names
  - Seasons/years
- **Add tag:** Type and press Enter
- **Remove tag:** X button
- **Search:** Documents can be filtered by tags

**Field:** Document Confidentiality Level (Optional)
- **Type:** Radio button group
- **Options:**
  - Normal (standard medical record)
  - Sensitive (contains personal info, restrict sharing)
  - Highly confidential (insurance, legal documents)
- **Display:** Badge on document indicating level
- **Impact:** Affects sharing restrictions

**Field:** Document Date Range (Optional)
- **Type:** Date pickers for multi-page documents
- **From date:** Document start date
- **To date:** Document end date
- **Use:** Organize multi-page scans spanning time periods

---

## PART 3: ADVANCED FEATURES & UX IMPROVEMENTS

### 3.0 Time-Saving & Intuitive Input Methods
To minimize friction and data entry time, implement the following patterns:

#### Smart Quick-Fill Actions
- **"Repeat Last Entry":** One-tap button to clone the most recent similar record (e.g., "Repeat last deworming").
- **"One-Tap Templates":** Pre-configured bundles for common tasks (e.g., "Annual Booster" pre-fills Vaccine + Visit + Cost).
- **"Quick Actions":** Dashboard shortcuts that open forms with context (e.g., "Log Weight" from the pet card pre-selects that pet).

#### Intuitive Visual Inputs
- **Body Map Selectors:** Clickable body map for "Symptom Location" or "Injury" (Form 1 & 5).
- **Slider Inputs:** For continuous values like "Pain Level", "Appetite", or "Activity Level" (Form 4).
- **Voice-to-Text:** Dictation support for long "Notes" fields.
- **Smart History:** Dropdowns show "Recently used" items at the top.

### 3.1 Conditional Logic & Smart Fields

#### Medication Interactions
- When user selects a medication in Form 3, system checks against:
  - Existing active medications
  - Known allergies
  - Conditions documented in Form 5
  - Scheduled vaccinations in Form 2
- Display warning banner if interactions detected
- Link to veterinary guidance or recommend contacting vet

#### Appointment Availability
- In Form 1 (Visit), clinic availability shown based on:
  - Selected clinic hours
  - Selected date
  - Real-time availability if clinic integrated with booking system
- Unavailable time slots grayed out

#### Vaccination Schedules
- Form 2 auto-suggests next dose date based on:
  - Vaccine type
  - Pet age
  - Previous vaccination history
  - Legal requirements by location
- Example: Rabies booster every 3 years after initial series

#### Weight-Based Calculations
- Form 4 auto-calculates if:
  - Pet weight entered in profile
  - Dosage is weight-based
  - Displays: "X kg × Y mg/kg = Z mg dose"

### 3.2 Data Visualization & Analytics

#### Health Timeline Dashboard
- Chronological view of all health events
- Visual indicators for each entry type:
  - 🏥 Visit (blue dot)
  - 💉 Vaccination (green dot)
  - 💊 Medication (orange dot)
  - 📊 Health metric (purple dot)
  - 📄 Document (gray dot)
- Hover for quick info, click to expand
- Filter by type, date range, or condition

#### Weight Trend Chart
- Form 4 data visualized as line chart
- X-axis: Time (months/years)
- Y-axis: Weight (kg)
- Color-coded zones:
  - Green: Healthy range for breed
  - Yellow: Slightly overweight
  - Red: Overweight/underweight
- Target weight indicator
- Trend analysis: Gaining/losing/stable

#### Vaccination Schedule View
- Calendar showing vaccination due dates
- Color coding:
  - Green: Completed
  - Yellow: Due within 30 days
  - Red: Overdue
- Notification badges for upcoming
- One-click reschedule or add to vet visit

### 3.3 Mobile Optimization

#### Form Adaptation for Mobile
- **Stacked layout:** Forms display in single column
- **Larger touch targets:** 44px minimum for buttons/inputs
- **Native inputs:** Use device date/time pickers
- **Reduced form fields:** Group related fields in expandable sections
- **Progress indicator:** Show step X of Y for multi-section forms
- **Sticky CTA:** Save/Submit button remains visible at bottom
- **Keyboard optimization:** Correct keyboard type for each input (number, email, tel, text)

#### Mobile-Specific Features
- **Geolocation:** Auto-detect location for clinic selection
- **Camera upload:** Direct document scan via device camera
- **Voice input:** Speak notes instead of typing
- **Biometric auth:** Fingerprint/face for sensitive records
- **Offline mode:** Auto-save drafts locally, sync when online

### 3.4 Accessibility Standards (WCAG 2.1 AA)

#### Color & Contrast
- All text has minimum 4.5:1 contrast ratio
- Don't rely on color alone (use icons/text labels)
- Status indicators use multiple cues (color + icon + text)

#### Form Accessibility
- All inputs have associated labels (HTML `<label>` tags)
- Error messages clearly linked to fields
- Required fields marked with `aria-required="true"`
- Form instructions available to screen readers
- Tab order is logical and predictable
- Focus indicators are visible (2px outline minimum)

#### Keyboard Navigation
- All interactive elements reachable via keyboard
- Tab through form fields sequentially
- Spacebar/Enter to toggle checkboxes
- Arrow keys for radio buttons/sliders
- Escape to close modals
- Skip links to jump to main content

#### Screen Reader Support
- Form landmarks: `<form>`, `<fieldset>`, `<legend>`
- Descriptive button labels ("Save Record" not "Submit")
- Error announcements in real-time
- Success confirmation after submission
- Dynamic content updates announced via `aria-live`
- Images have descriptive alt text

### 3.5 Data Security & Privacy

#### Field Encryption
- Sensitive fields encrypted in transit (HTTPS/TLS)
- Financial data (costs) encrypted at rest
- Medical data follows GDPR/HIPAA standards
- User can request data export in standardized format

#### Permission Controls
- Role-based access (Owner, Guardian, Veterinarian, Emergency Contact)
- Fine-grained sharing settings per document
- Audit log tracks who accessed what data
- User can revoke access anytime

#### Data Retention
- Auto-archive old records (configurable)
- User control over deletion (soft delete initially)
- Backup and recovery options
- Right to be forgotten (GDPR compliance)

---

## PART 4: IMPLEMENTATION GUIDELINES

### 4.1 Frontend Stack Recommendation

**Framework:** React 18 + Next.js 14
**Form Library:** React Hook Form + Zod validation
**UI Components:** Shadcn/ui + TailwindCSS
**Date/Time:** date-fns
**Maps:** Google Maps API + react-google-maps
**Document Upload:** Uploadthing
**Image Processing:** Sharp + browser APIs
**Notifications:** React Hot Toast
**State Management:** Zustand for client state, TanStack Query for server state

### 4.2 Backend Considerations (Supabase Integration)

**Primary Data Store:** **Supabase (PostgreSQL)**
All form data must be stored in and retrieved from Supabase. The application should act as a view layer over the Supabase database.

**Database Schema Requirements (Supabase Tables):**
- **`pets`**: (UUID PK, user_id FK, species, breed, dob, microchip, image_url)
- **`visits`**: (UUID PK, pet_id FK, date, time, clinic_name, clinic_place_id, notes, cost, urgency)
- **`vaccinations`**: (UUID PK, pet_id FK, vaccine_name, date_administered, next_due_date, batch_number)
- **`medications`**: (UUID PK, pet_id FK, name, dosage, frequency, start_date, end_date, is_active)
- **`health_metrics`**: (UUID PK, pet_id FK, weight, height, temperature, recorded_at)
- **`allergies`**: (UUID PK, pet_id FK, allergen, severity, reaction_details)
- **`documents`**: (UUID PK, pet_id FK, type, storage_path, ocr_data, created_at)

**Data Access Strategy:**
- **Dropdown Options:** Fetch dynamic options (e.g., Breeds, Vaccine Names) from Supabase lookup tables (`ref_vaccines`, `ref_medications`) to ensure consistency with the comprehensive CSV data.
- **Real-Time Sync:** Use Supabase Subscriptions to update the Dashboard/Timeline instantly when a form is submitted.
- **Storage:** Upload documents/images to Supabase Storage buckets (`pet-documents`, `pet-avatars`).
- **Security:** Implement Row Level Security (RLS) policies to ensure users only access their own pets' data.

### 4.3 Third-Party Integrations

**Google Maps & Places API:**
- Clinic/pharmacy address autocomplete
- Geolocation for "near me" searches
- Distance calculations
- Map display

**OCR & Document Processing:**
- Tesseract.js for client-side OCR
- Cloud Vision API for better accuracy
- Layout analysis for form extraction

**Calendar Integration:**
- Google Calendar API for appointment sync
- iCal format for reminders
- Notification webhooks

**Email Service:**
- SendGrid or Mailgun for reminder emails
- Templated notifications
- Unsubscribe management

---

## PART 5: VALIDATION RULES REFERENCE

### 5.1 Universal Validation Rules

| Field Type | Min | Max | Format | Required |
|-----------|-----|-----|--------|----------|
| Text (name) | 2 | 100 | Alpha + spaces | Yes |
| Text (notes) | 5 | 2000 | Any | No |
| Date | - | Today | YYYY-MM-DD | Yes* |
| Time | - | - | HH:MM (24h) | No |
| Number (weight) | 0.1 | 200 | Decimal (1 place) | Yes* |
| Number (cost) | 0 | 99999.99 | Currency format | No |
| Phone | 7 | 20 | E.164 format | No |
| Email | 5 | 254 | RFC 5322 | No |
| URL | 10 | 2048 | Valid URL | No |
| Dropdown | - | - | From predefined list | Yes* |

*Required only in specific forms

### 5.2 Form-Specific Validations

**Visit Form:**
- Visit date ≤ today
- Time within clinic hours (if available)
- Provider/clinic required if recording cost
- Diagnosis field not empty if marked "completed"

**Vaccination Form:**
- Date ≤ today
- Vaccine name from approved list or custom
- Next due date > current date
- Batch number format if provided (alphanumeric)

**Medication Form:**
- Dosage positive and reasonable (mg, ml, tablets)
- Frequency matches pattern (e.g., "twice daily")
- End date ≥ start date
- Duration positive if specified
- No medication duplicates within 24 hours

**Health Metrics Form:**
- Weight: Min 0.1 kg, Max 200 kg, within ±20% of last recorded
- Temperature: 35-40.5°C (normal 38-39°C)
- Heart rate: 40-250 bpm (typical 60-140)
- Body score: 1-9 or 1-5 depending on system

**Allergies Form:**
- Allergen name required
- Severity required
- At least one symptom selected
- Date diagnosed ≤ today

**Documents Form:**
- Document type required
- File size < 10MB (< 50MB total)
- Accepted file format
- Document date ≤ today
- Must be readable image/PDF quality

---

## PART 6: USER EXPERIENCE FLOW DIAGRAMS

### Visit Form User Journey
```
START
  ↓
Select Visit Type
  ↓
Select Pet
  ↓
Enter Date/Time
  ↓
Search for Clinic
  ↓
Enter Reason for Visit
  ↓
(Optional) Enter Cost
  ↓
(Optional) Upload Invoice
  ↓
(Optional) Add Health Observations
  ↓
(Optional) Upload Documents
  ↓
(Optional) Set Reminder
  ↓
Review & Save
  ↓
Confirmation & Next Steps
  ↓
END
```

### Success States & Post-Submission Actions

**After Form Submission:**
1. **Confirmation Screen** (2-3 seconds)
   - Success message with pet name
   - Summary of what was saved
   - Next recommended actions (e.g., "Set reminder for follow-up")

2. **Automatic Actions**
   - Create calendar event if appointment scheduled
   - Send reminder notification if configured
   - Notify veterinarian if document shared
   - Update health timeline
   - Calculate medication due dates

3. **Next Step Options**
   - View record in health timeline
   - Add another record
   - Share with veterinarian
   - Return to pet profile
   - Return to dashboard

---

## PART 7: DESIGN SYSTEM INTEGRATION

### Color Palette for Forms

**Status Indicators:**
- ✅ Success: #10B981 (Emerald Green)
- ⚠️ Warning: #F59E0B (Amber)
- ❌ Error: #EF4444 (Red)
- ℹ️ Info: #3B82F6 (Blue)
- ⏰ Reminder: #8B5CF6 (Purple)

**Severity Badges:**
- 🟢 Routine/Normal: #10B981
- 🟡 Urgent/Caution: #FBBF24
- 🔴 Emergency/Severe: #EF4444

### Icons & Visual Elements

- ✅ Checkmark: Field complete
- ⚠️ Warning: Field needs attention
- ℹ️ Info: Help tooltip
- 📎 Attachment: Document uploaded
- 📅 Calendar: Date selected
- ⏰ Clock: Time selected
- 🗑️ Trash: Delete option
- ✏️ Pencil: Edit option
- 👁️ Eye: View option
- 🔒 Lock: Private/secure
- 🔓 Unlock: Shared

### Typography

**Form Labels:** 12px, Font-weight: 500, Color: #374151 (gray-700)
**Required Indicator:** Red asterisk (*), aligned right of label
**Helper Text:** 12px, Font-weight: 400, Color: #6B7280 (gray-500)
**Error Text:** 12px, Font-weight: 400, Color: #EF4444 (red)
**Placeholder Text:** 14px, Color: #D1D5DB (gray-300)

---
## APPENDIX A: DOCUMENT ANALYSIS & STANDARDIZATION

### A.1 Analysis of Existing Documentation
This specification consolidates requirements from the following source documents found in the project repository:
1.  **`pet-management-enhancement-prd.md`**: Provided high-level feature requirements (Pet Profile, Dashboard, Calendar) but lacked detailed field specifications for medical forms. This spec fills that gap.
2.  **`pet_vaccinations_complete.csv` & `pet_medicines_comprehensive.csv`**: Analyzed for data structure. The "Vaccine Name" and "Medication Name" dropdowns in this spec are designed to consume this rich dataset directly from Supabase.
3.  **`Pawzly-Forms-Specification.md` (Previous Draft)**: Served as the base, refined to include Supabase integration and responsive layout strategies.

### A.2 Standardization Decisions
To ensure consistency across the platform, the following standards have been enforced in this specification:
-   **Terminology:** Standardized on **"Visit"** (instead of "Appointment" or "Check-up") as the parent entity for all vet interactions.
-   **Date/Time:** Unified on `YYYY-MM-DD` and 24h `HH:MM` formats for storage (Supabase `timestamptz`), with localized display.
-   **Pet Selection:** Enforced a consistent "Pet Selector" component at the top of every form to support multi-pet households.
-   **Address/Location:** Standardized on a single "Google Places Autocomplete" component pattern for both Clinics and Pharmacies to avoid data fragmentation.
-   **Responsive Behavior:** Strict separation of Desktop (Modal) vs Mobile (Native) behaviors to resolve previous UI inconsistencies.

---

## CONCLUSION

This comprehensive forms specification document provides:

1. **Complete Form Definitions:** 6 core forms covering all pet health management needs
2. **Detailed Field Specifications:** Data types, validation, constraints, and UI patterns
3. **UX/UI Best Practices:** Accessibility, mobile optimization, conditional logic
4. **Implementation Guidance:** Tech stack recommendations, backend considerations
5. **Design Integration:** Color system, icons, typography
6. **Validation Reference:** Complete validation rules for all fields

### Next Steps for Development:

1. **UI Mockups:** Create Figma prototypes based on specifications
2. **Component Library:** Develop reusable form components
3. **Backend Schema:** Implement database tables per specifications
4. **API Development:** Build REST endpoints per implementation guidelines
5. **Testing Plan:** Create test cases for validation and conditional logic
6. **Accessibility Audit:** Ensure WCAG 2.1 AA compliance
7. **User Testing:** Validate forms with actual pet owners
8. **Documentation:** Create user guides and vet integration docs

---

**Document Status:** ✅ Complete  
**Version:** 1.0  
**Last Updated:** December 2025  
**Maintained By:** Pawzly Product Team