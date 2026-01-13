# 03 - Pet Profiles

This section specifies all aspects of pet profile creation, management, identification, and multi-pet support within the Waggly platform.

---

## Documents in This Section

| Document | Description |
|----------|-------------|
| [pet-registration-prd.md](./pet-registration-prd.md) | Complete PRD for 4-step pet registration wizard |
| [pet-profile-structure.md](./pet-profile-structure.md) | All profile fields, data types, validation |
| [identification.md](./identification.md) | Microchip, tattoo, registration numbers |
| [breed-data.md](./breed-data.md) | Breed databases for dogs, cats, other pets |
| [physical-measurements.md](./physical-measurements.md) | Weight, height, body condition tracking |
| [multi-pet-management.md](./multi-pet-management.md) | Managing multiple pets per household |
| [pet-card-specification.md](./pet-card-specification.md) | Digital pet cards and QR codes |
| [database-schema.sql](./database-schema.sql) | Pet-related database tables |

---

## Pet Profile Overview

A pet profile is the core entity in Waggly, containing:
- **Basic Information**: Name, species, breed, age, gender
- **Identification**: Microchip, tattoo, registration
- **Physical Attributes**: Weight, measurements, appearance
- **Health Records**: Linked vaccinations, treatments, visits
- **Documents**: Attached files, certificates, photos
- **Sharing**: Co-owners, sharing links

---

## Supported Pet Types

| Type | Status | Breed Database |
|------|--------|----------------|
| Dogs | ✅ Full support | 400+ breeds |
| Cats | ✅ Full support | 70+ breeds |
| Rabbits | ✅ Supported | 50+ breeds |
| Birds | 🔄 Coming soon | - |
| Hamsters | 🔄 Coming soon | - |
| Fish | 🔄 Coming soon | - |
| Reptiles | 🔄 Coming soon | - |
| Other | ✅ Custom entry | - |
