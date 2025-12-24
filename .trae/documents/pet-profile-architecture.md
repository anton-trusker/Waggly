## 1. Architecture design

```mermaid
graph TD
  A[User Browser] --> B[React Frontend Application]
  B --> C[Supabase SDK]
  C --> D[Supabase Auth]
  C --> E[Supabase Database]
  C --> F[Supabase Storage]
  
  subgraph "Frontend Layer"
      B
  end
  
  subgraph "Service Layer (Provided by Supabase)"
      D
      E
      F
  end
```

## 2. Technology Description
- Frontend: React@18 + tailwindcss@3 + vite
- Initialization Tool: vite-init
- Backend: Supabase (PostgreSQL, Auth, Storage)
- Key Dependencies: 
  - @supabase/supabase-js@2
  - react-hook-form@7
  - date-fns@2
  - react-dropzone@14
  - react-image-gallery@1
  - lucide-react@0

## 3. Route definitions
| Route | Purpose |
|-------|---------|
| /pets | Pet list overview, quick access to all pets |
| /pets/:id | Pet Profile Dashboard, main pet information view |
| /pets/:id/health | Health Passport, complete medical history |
| /pets/:id/health/wizard | Health Wizard, guided health record creation |
| /pets/:id/documents | Document Gallery, uploaded files and certificates |
| /pets/:id/photos | Photo Memories, pet photo gallery |
| /pets/:id/calendar | Medical Calendar, upcoming events and reminders |

## 4. API definitions

### 4.1 Pet Management APIs

**Get Pet Profile**
```
GET /api/pets/:id
```

Response:
```json
{
  "id": "uuid",
  "name": "string",
  "species": "string",
  "breed": "string",
  "gender": "string",
  "birth_date": "date",
  "weight": "number",
  "microchip_number": "string",
  "profile_photo_url": "string",
  "owner_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Update Pet Profile**
```
PUT /api/pets/:id
```

Request:
```json
{
  "name": "string",
  "weight": "number",
  "profile_photo_url": "string"
}
```

### 4.2 Health Record APIs

**Create Health Record**
```
POST /api/pets/:id/health-records
```

Request:
```json
{
  "type": "vaccination|treatment|checkup|emergency",
  "subtype": "string",
  "name": "string",
  "description": "string",
  "date_administered": "date",
  "next_due_date": "date",
  "veterinarian": "string",
  "clinic_name": "string",
  "cost": "number",
  "notes": "string",
  "document_urls": ["string"]
}
```

**Get Health Records**
```
GET /api/pets/:id/health-records?type=vaccination&limit=10
```

Response:
```json
{
  "records": [
    {
      "id": "uuid",
      "type": "string",
      "name": "string",
      "date_administered": "date",
      "next_due_date": "date",
      "status": "valid|expired|upcoming",
      "document_urls": ["string"]
    }
  ],
  "total": "number"
}
```

### 4.3 Document Management APIs

**Upload Document**
```
POST /api/documents/upload
```

Request:
```multipart/form-data
file: File
pet_id: uuid
category: passport|certificate|prescription|lab_result|other
```

Response:
```json
{
  "document_id": "uuid",
  "url": "string",
  "thumbnail_url": "string",
  "category": "string",
  "uploaded_at": "timestamp"
}
```

## 5. Server architecture diagram

```mermaid
graph TD
  A[Client / Frontend] --> B[API Layer]
  B --> C[Business Logic Layer]
  C --> D[Data Access Layer]
  D --> E[(Supabase Database)]
  C --> F[Supabase Storage]
  
  subgraph "Server-Side Services"
      B
      C
      D
  end
  
  subgraph "Supabase Services"
      E
      F
  end
```

## 6. Data model

### 6.1 Data model definition

```mermaid
erDiagram
  USERS ||--o{ PETS : owns
  PETS ||--o{ HEALTH_RECORDS : has
  PETS ||--o{ DOCUMENTS : has
  PETS ||--o{ PHOTOS : has
  HEALTH_RECORDS ||--o{ DOCUMENTS : references
  USERS ||--o{ REMINDERS : creates
  
  USERS {
    uuid id PK
    string email UK
    string name
    timestamp created_at
    timestamp updated_at
  }
  
  PETS {
    uuid id PK
    uuid owner_id FK
    string name
    string species
    string breed
    string gender
    date birth_date
    decimal weight
    string microchip_number
    string profile_photo_url
    timestamp created_at
    timestamp updated_at
  }
  
  HEALTH_RECORDS {
    uuid id PK
    uuid pet_id FK
    string type
    string subtype
    string name
    text description
    date date_administered
    date next_due_date
    string veterinarian
    string clinic_name
    decimal cost
    text notes
    json document_urls
    timestamp created_at
    timestamp updated_at
  }
  
  DOCUMENTS {
    uuid id PK
    uuid pet_id FK
    uuid health_record_id FK
    string category
    string original_name
    string file_url
    string thumbnail_url
    integer file_size
    string mime_type
    timestamp created_at
  }
  
  PHOTOS {
    uuid id PK
    uuid pet_id FK
    string file_url
    string thumbnail_url
    date photo_date
    string event_tag
    text description
    timestamp created_at
  }
  
  REMINDERS {
    uuid id PK
    uuid user_id FK
    uuid pet_id FK
    string type
    string title
    text description
    datetime reminder_date
    boolean is_completed
    timestamp created_at
  }
```

### 6.2 Data Definition Language

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON users TO anon;
GRANT ALL ON users TO authenticated;
```

**Pets Table**
```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unknown')),
  birth_date DATE,
  weight DECIMAL(5,2),
  microchip_number VARCHAR(50),
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_species ON pets