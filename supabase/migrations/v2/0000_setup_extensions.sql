-- Enable standard UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full text search and trigram similarity (essential for search)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable cryptographic functions (good practice for security)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable vector support if we plan AI features later (optional but good to have)
-- CREATE EXTENSION IF NOT EXISTS "vector"; 
