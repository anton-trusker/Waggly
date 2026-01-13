# Breed Data Specification

## Overview

This document specifies the breed database structure, supported species, and breed-specific features.

---

## Supported Species

| Species | Breeds | Status | Health Features |
|---------|--------|--------|-----------------|
| Dogs | 400+ | Full | Breed-specific risks |
| Cats | 70+ | Full | Breed-specific risks |
| Rabbits | 50+ | Partial | Basic tracking |
| Birds | 20+ | Planned | Basic tracking |
| Other | Custom | Partial | Basic tracking |

---

## Breed Database Schema

```sql
CREATE TABLE breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'rabbit', 'bird', 'other')),
  name TEXT NOT NULL,
  name_local JSONB, -- {"nl": "Duitse Herder", "de": "Deutscher Schäferhund"}
  alternate_names TEXT[],
  group_name TEXT, -- "Sporting", "Herding", etc.
  origin_country TEXT,
  size_category TEXT CHECK (size_category IN ('toy', 'small', 'medium', 'large', 'giant')),
  weight_min_kg DECIMAL(5,2),
  weight_max_kg DECIMAL(5,2),
  height_min_cm DECIMAL(5,2),
  height_max_cm DECIMAL(5,2),
  life_expectancy_min INTEGER,
  life_expectancy_max INTEGER,
  temperament TEXT[],
  coat_types TEXT[],
  colors TEXT[],
  description TEXT,
  image_url TEXT,
  fci_number INTEGER, -- FCI breed number
  akc_recognized BOOLEAN DEFAULT false,
  kc_recognized BOOLEAN DEFAULT false,
  popularity_rank INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_breeds_species ON breeds(species);
CREATE INDEX idx_breeds_name ON breeds(name);
CREATE INDEX idx_breeds_group ON breeds(group_name);
```

---

## Dog Breeds (Sample)

### Breed Groups (FCI Classification)

| Group | Description | Examples |
|-------|-------------|----------|
| 1 | Sheepdogs and Cattledogs | German Shepherd, Border Collie |
| 2 | Pinscher, Schnauzer, Molossian | Doberman, Rottweiler, Boxer |
| 3 | Terriers | Bull Terrier, Yorkshire Terrier |
| 4 | Dachshunds | Standard, Miniature, Kaninchen |
| 5 | Spitz and Primitive | Akita, Shiba Inu, Husky |
| 6 | Scent Hounds | Beagle, Basset Hound |
| 7 | Pointing Dogs | German Pointer, Weimaraner |
| 8 | Retrievers, Flushers, Water Dogs | Labrador, Golden Retriever |
| 9 | Companion and Toy Dogs | Poodle, Bichon, Chihuahua |
| 10 | Sighthounds | Greyhound, Whippet |

### Popular Breeds (EU)

| Rank | Breed | Size | Life Span |
|------|-------|------|-----------|
| 1 | French Bulldog | Small | 10-12 years |
| 2 | Labrador Retriever | Large | 10-14 years |
| 3 | German Shepherd | Large | 9-13 years |
| 4 | Golden Retriever | Large | 10-12 years |
| 5 | Beagle | Medium | 12-15 years |
| 6 | Poodle | Varies | 12-15 years |
| 7 | Dachshund | Small | 12-16 years |
| 8 | Border Collie | Medium | 12-15 years |
| 9 | Cavalier King Charles | Small | 9-14 years |
| 10 | Jack Russell Terrier | Small | 13-16 years |

---

## Cat Breeds (Sample)

### Cat Breed Categories

| Category | Description | Examples |
|----------|-------------|----------|
| Natural | Naturally occurring breeds | Siamese, Persian |
| Crossbreed | Created from other breeds | Ragdoll, Savannah |
| Mutation | Developed from genetic mutations | Scottish Fold, Sphynx |

### Popular Cat Breeds (EU)

| Rank | Breed | Size | Life Span |
|------|-------|------|-----------|
| 1 | European Shorthair | Medium | 15-20 years |
| 2 | Maine Coon | Large | 12-15 years |
| 3 | British Shorthair | Medium | 12-17 years |
| 4 | Persian | Medium | 12-17 years |
| 5 | Ragdoll | Large | 12-15 years |
| 6 | Siamese | Medium | 12-20 years |
| 7 | Bengal | Medium | 12-16 years |
| 8 | Norwegian Forest Cat | Large | 14-16 years |
| 9 | Birman | Medium | 12-16 years |
| 10 | Sphynx | Medium | 13-15 years |

---

## Breed-Specific Health Risks

```sql
CREATE TABLE breed_health_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breed_id UUID REFERENCES breeds(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high', 'very_high')),
  prevalence_percentage DECIMAL(5,2),
  typical_onset_age INTEGER, -- in months
  description TEXT,
  prevention_notes TEXT,
  screening_recommended BOOLEAN DEFAULT false,
  sources TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Example Health Risks

| Breed | Condition | Risk Level | Onset Age |
|-------|-----------|------------|-----------|
| German Shepherd | Hip Dysplasia | High | 6-12 months |
| French Bulldog | BOAS | Very High | Birth |
| Cavalier King Charles | Mitral Valve Disease | Very High | 5 years |
| Labrador Retriever | Elbow Dysplasia | Moderate | 6-12 months |
| Dachshund | IVDD | High | 3-7 years |
| Golden Retriever | Cancer | High | 8+ years |
| Maine Coon | HCM | Moderate | 3+ years |
| Persian | PKD | High | 3-10 years |

---

## Breed Autocomplete API

### Request
```
GET /api/v1/breeds/search
?species=dog
&query=golden
&limit=10
```

### Response
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Golden Retriever",
      "species": "dog",
      "group": "Retrievers, Flushing Dogs, Water Dogs",
      "size": "large",
      "popularity_rank": 4,
      "image_url": "https://..."
    },
    {
      "id": "uuid",
      "name": "Goldendoodle",
      "species": "dog",
      "group": "Hybrid",
      "size": "medium",
      "popularity_rank": 25,
      "image_url": "https://..."
    }
  ],
  "total": 2,
  "include_mixed": true
}
```

---

## Mixed Breed Handling

### Options
1. **"Mixed Breed"** - Generic option
2. **"[Breed] Mix"** - Known primary breed
3. **Primary + Secondary Breed** - Two known breeds
4. **DNA Test Results** - Breed percentage breakdown

### DNA Integration (Future)

```typescript
interface DNABreedResult {
  breed_id: string;
  breed_name: string;
  percentage: number;
}

interface DNATestResult {
  provider: 'embark' | 'wisdom_panel' | 'dna_my_dog' | 'other';
  test_date: Date;
  breeds: DNABreedResult[];
  health_markers?: HealthMarker[];
}
```
