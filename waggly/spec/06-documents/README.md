# 06 - Documents

This section specifies document upload, storage, OCR processing, and organization features.

---

## Documents in This Section

| Document | Description |
|----------|-------------|
| [documents-prd.md](./documents-prd.md) | Document management PRD |
| [document-types.md](./document-types.md) | Supported document categories |
| [storage-spec.md](./storage-spec.md) | Supabase Storage configuration |
| [database-schema.sql](./database-schema.sql) | Documents tables |

---

## Supported Document Types

| Type | Extensions | Max Size | OCR |
|------|------------|----------|-----|
| Vaccine Certificate | PDF, JPG, PNG | 10MB | Yes |
| Medical Report | PDF, JPG, PNG | 20MB | Yes |
| Prescription | PDF, JPG, PNG | 10MB | Yes |
| Lab Results | PDF, JPG, PNG | 20MB | Yes |
| Invoice/Receipt | PDF, JPG, PNG | 10MB | Yes |
| Pet Photo | JPG, PNG, HEIC | 10MB | No |
| Insurance Document | PDF | 20MB | No |
| Registration | PDF, JPG, PNG | 10MB | Yes |
| Other | PDF, JPG, PNG | 20MB | No |

---

## Key Features

- **Automatic Organization**: Documents sorted by type
- **OCR Integration**: Extract data from scanned documents
- **Record Linking**: Attach documents to health records
- **Secure Storage**: Encrypted, GDPR-compliant
- **Sharing**: Include in shared profiles
