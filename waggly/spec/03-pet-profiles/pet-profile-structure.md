# Pet Profile Structure

## Overview

This document defines the complete data model for pet profiles, including all fields, data types, validation rules, and display specifications.

---

## Core Profile Fields

### Identity Fields

| Field | Type | Required | Validation | Display |
|-------|------|----------|------------|---------|
| `id` | UUID | Auto | System generated | Hidden |
| `user_id` | UUID | Auto | Owner reference | Hidden |
| `name` | String | Yes | 1-50 chars | Header |
| `species` | Enum | Yes | Predefined list | Profile badge |
| `breed_id` | UUID | No | Reference to breeds | Profile info |
| `breed_name` | String | Yes | From database or custom | Profile info |
| `secondary_breed_id` | UUID | No | For mixed breeds | Profile info |
| `is_mixed_breed` | Boolean | No | Default: false | Profile badge |
| `gender` | Enum | Yes | male/female | Profile info |

### Life Stage Fields

| Field | Type | Required | Validation | Display |
|-------|------|----------|------------|---------|
| `date_of_birth` | Date | Yes | Past date only | Profile info (as age) |
| `date_of_birth_approximate` | Boolean | No | Default: false | Age disclaimer |
| `is_neutered` | Boolean | No | null/true/false | Profile info |
| `neutered_date` | Date | No | Must be after DOB | Health history |
| `is_deceased` | Boolean | No | Default: false | Status badge |
| `deceased_date` | Date | No | Required if deceased | Memorial |
| `deceased_cause` | Text | No | Optional details | Memorial |

### Appearance Fields

| Field | Type | Required | Validation | Display |
|-------|------|----------|------------|---------|
| `photo_url` | String | No | Valid URL | Avatar |
| `cover_photo_url` | String | No | Valid URL | Profile header |
| `color_primary` | String | No | From color list | Profile info |
| `color_secondary` | String | No | From color list | Profile info |
| `color_pattern` | Enum | No | solid/spotted/striped/etc | Profile info |
| `coat_type` | Enum | No | short/medium/long/hairless | Profile info |
| `distinctive_markings` | Text[] | No | Array of descriptions | Profile info |

### Identification Fields

| Field | Type | Required | Validation | Display |
|-------|------|----------|------------|---------|
| `microchip_number` | String | No | 9-15 digits | ID card |
| `microchip_date` | Date | No | Must be after DOB | ID card |
| `microchip_location` | String | No | Typically neck/shoulder | ID card |
| `tattoo_id` | String | No | Alphanumeric | ID card |
| `registration_number` | String | No | Registry format | ID card |
| `passport_number` | String | No | For EU pet passport | Travel docs |

### Acquisition Fields

| Field | Type | Required | Validation | Display |
|-------|------|----------|------------|---------|
| `acquisition_date` | Date | No | Past date | Profile timeline |
| `acquisition_type` | Enum | No | breeder/shelter/rescue/gift/stray | Profile info |
| `acquisition_location` | String | No | City/Country | Profile info |
| `breeder_name` | String | No | If from breeder | Profile info |
| `shelter_name` | String | No | If from shelter | Profile info |
| `previous_owner_count` | Integer | No | 0+ | Profile info |

---

## Computed Fields

| Field | Calculation | Display |
|-------|-------------|---------|
| `age` | NOW() - date_of_birth | "2 years, 3 months" |
| `age_category` | Based on age + species | "Puppy", "Adult", "Senior" |
| `health_score` | Algorithm (0-100) | Dashboard widget |
| `next_reminder` | Earliest upcoming reminder | Dashboard widget |
| `vaccination_status` | Up to date / Overdue / None | Status badge |

### Age Categories

**Dogs**:
| Age | Category |
|-----|----------|
| 0-1 years | Puppy |
| 1-7 years | Adult |
| 7+ years | Senior |

**Cats**:
| Age | Category |
|-----|----------|
| 0-1 years | Kitten |
| 1-11 years | Adult |
| 11+ years | Senior |

---

## Field Validation Rules

### Name
```typescript
const nameValidation = {
  minLength: 1,
  maxLength: 50,
  pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
  errorMessages: {
    required: "Pet name is required",
    minLength: "Name must be at least 1 character",
    maxLength: "Name cannot exceed 50 characters",
    pattern: "Name can only contain letters, spaces, hyphens, and apostrophes"
  }
};
```

### Microchip Number
```typescript
const microchipValidation = {
  formats: [
    { pattern: /^\d{15}$/, name: "ISO 15-digit" },
    { pattern: /^\d{9}$/, name: "9-digit AVID" },
    { pattern: /^\d{10}$/, name: "10-digit" }
  ],
  errorMessage: "Please enter a valid microchip number (9, 10, or 15 digits)"
};
```

### Date of Birth
```typescript
const dobValidation = {
  maxDate: new Date(), // Cannot be in future
  minDate: new Date(Date.now() - 50 * 365 * 24 * 60 * 60 * 1000), // Max 50 years
  errorMessages: {
    required: "Date of birth is required",
    future: "Date of birth cannot be in the future",
    tooOld: "Date seems incorrect. Please check the year."
  }
};
```

---

## Profile Sections

### Overview Section
- Photo/avatar
- Name and breed
- Age and gender
- Quick stats (weight, health score)
- Quick actions (add vaccine, log visit, etc.)

### Health Section
- Current medications
- Recent vaccinations
- Upcoming reminders
- Health metrics chart

### Documents Section
- Uploaded files
- Linked records
- OCR processed documents

### History Section
- Activity timeline
- All health events chronologically

### Passport Section
- Digital pet passport view
- QR code for sharing
- Travel compliance status

---

## Profile States

| State | Condition | Visual Indicator |
|-------|-----------|------------------|
| Complete | All required fields + photo | Green checkmark |
| Incomplete | Missing required data | Yellow warning |
| Needs Attention | Overdue vaccinations | Red notification |
| Deceased | is_deceased = true | Memorial badge |
| Archived | User archived pet | Gray/dimmed |

---

## API Response Format

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Max",
  "species": "dog",
  "breed": {
    "id": "breed-uuid",
    "name": "Golden Retriever",
    "group": "Sporting"
  },
  "gender": "male",
  "date_of_birth": "2020-05-15",
  "age": {
    "years": 3,
    "months": 8,
    "display": "3 years, 8 months",
    "category": "adult"
  },
  "photo_url": "https://cdn.waggly.app/pets/...",
  "is_neutered": true,
  "microchip_number": "123456789012345",
  "color_primary": "golden",
  "health_score": 92,
  "vaccination_status": "up_to_date",
  "created_at": "2023-06-01T10:30:00Z",
  "updated_at": "2024-01-10T15:45:00Z"
}
```
