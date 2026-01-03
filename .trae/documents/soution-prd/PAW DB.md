Here is a comprehensive, detailed database structure for the entire PawHelp platform, covering all user roles, features, and business logic.pawhelp\_doc\_7\_admin\_panel\_roles.md+2​

---

# **PawHelp Platform \- Complete Database Schema**

## **Database Architecture Overview**

**Technology Stack**

* Primary: PostgreSQL 15+ (ACID, complex queries, JSON, full-text search)  
* Document Store: MongoDB (flexible schemas for content, logs)  
* Cache: Redis (sessions, real-time, rate limiting)  
* Search: Elasticsearch (full-text, faceted search)  
* Time-Series: InfluxDB (analytics, IoT data)  
* Queue: RabbitMQ / AWS SQS (async jobs)

**Design Principles**

* Normalization to 3NF with denormalization for performance-critical reads  
* Soft deletes with `deleted_at` timestamp  
* Multi-tenancy via organization\_id where applicable  
* Audit trails with created\_at, updated\_at, created\_by, updated\_by  
* JSONB for flexible metadata and translations  
* Partitioning for large tables (transactions, logs) by date  
* Indexing strategy: compound indexes for common query patterns

---

## **1\. Core User & Identity Tables**

## **users**

Primary user accounts for all roles.

sql  
`CREATE TABLE users (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `email VARCHAR(255) UNIQUE NOT NULL,`  
    `email_verified_at TIMESTAMP,`  
    `phone VARCHAR(20),`  
    `phone_verified_at TIMESTAMP,`  
    `password_hash VARCHAR(255), -- bcrypt, nullable if social-only`  
      
    `-- Profile`  
    `first_name VARCHAR(100) NOT NULL,`  
    `last_name VARCHAR(100) NOT NULL,`  
    `display_name VARCHAR(100),`  
    `avatar_url TEXT,`  
    `bio TEXT,`  
    `date_of_birth DATE,`  
    `gender VARCHAR(20), -- male, female, other, prefer_not_to_say`  
      
    `-- Role & Type`  
    `user_type VARCHAR(50) NOT NULL, -- pet_owner, helper, provider, business, ngo, sponsor, admin`  
      
    `-- Location`  
    `country_code CHAR(2) NOT NULL, -- ISO 3166-1`  
    `region VARCHAR(100),`  
    `city VARCHAR(100),`  
    `postal_code VARCHAR(20),`  
    `address_line1 TEXT,`  
    `address_line2 TEXT,`  
    `latitude DECIMAL(10,8),`  
    `longitude DECIMAL(11,8),`  
    `timezone VARCHAR(50) DEFAULT 'UTC',`  
      
    `-- Preferences`  
    `preferred_language CHAR(2) DEFAULT 'en', -- ISO 639-1`  
    `preferred_currency CHAR(3) DEFAULT 'EUR', -- ISO 4217`  
      
    `-- Trust & Verification`  
    `trust_score INT DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),`  
    `is_verified BOOLEAN DEFAULT FALSE,`  
    `verified_at TIMESTAMP,`  
    `background_check_status VARCHAR(20), -- pending, passed, failed, not_required`  
    `background_check_at TIMESTAMP,`  
      
    `-- Status & Compliance`  
    `status VARCHAR(20) DEFAULT 'active', -- active, suspended, banned, pending, deleted`  
    `suspension_reason TEXT,`  
    `suspended_until TIMESTAMP,`  
      
    `-- Engagement`  
    `last_login_at TIMESTAMP,`  
    `login_count INT DEFAULT 0,`  
    `profile_completeness INT DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),`  
      
    `-- Gamification`  
    `xp_points INT DEFAULT 0,`  
    `level INT DEFAULT 1,`  
      
    `-- Privacy`  
    `profile_visibility VARCHAR(20) DEFAULT 'public', -- public, members_only, private`  
    `show_online_status BOOLEAN DEFAULT TRUE,`  
    `allow_messages BOOLEAN DEFAULT TRUE,`  
      
    `-- GDPR & Consent`  
    `gdpr_consent BOOLEAN DEFAULT FALSE,`  
    `gdpr_consent_at TIMESTAMP,`  
    `marketing_consent BOOLEAN DEFAULT FALSE,`  
    `data_processing_consent BOOLEAN DEFAULT TRUE,`  
      
    `-- Metadata`  
    `metadata JSONB, -- flexible for custom fields`  
      
    `-- Audit`  
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP,`  
      
    `-- Indexes`  
    `CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')`  
`);`

`CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_users_phone ON users(phone) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_users_type_status ON users(user_type, status) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_users_location ON users(country_code, city) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_users_trust_score ON users(trust_score DESC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_users_created_at ON users(created_at DESC);`

## **user\_sessions**

Active login sessions for security tracking.

sql  
`CREATE TABLE user_sessions (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
    `token_hash VARCHAR(255) UNIQUE NOT NULL, -- JWT token hash`  
    `refresh_token_hash VARCHAR(255),`  
      
    `device_type VARCHAR(50), -- web, ios, android`  
    `device_name VARCHAR(100),`  
    `browser VARCHAR(100),`  
    `ip_address INET,`  
    `user_agent TEXT,`  
      
    `location_city VARCHAR(100),`  
    `location_country CHAR(2),`  
      
    `last_activity_at TIMESTAMP DEFAULT NOW(),`  
    `expires_at TIMESTAMP NOT NULL,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_sessions_user ON user_sessions(user_id, last_activity_at DESC);`  
`CREATE INDEX idx_sessions_token ON user_sessions(token_hash);`  
`CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);`

## **social\_accounts**

Linked OAuth providers.

sql  
`CREATE TABLE social_accounts (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
    `provider VARCHAR(50) NOT NULL, -- google, facebook, apple, vk, ok`  
    `provider_user_id VARCHAR(255) NOT NULL,`  
    `access_token TEXT,`  
    `refresh_token TEXT,`  
    `expires_at TIMESTAMP,`  
      
    `profile_data JSONB, -- raw profile from provider`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
      
    `UNIQUE(provider, provider_user_id)`  
`);`

`CREATE INDEX idx_social_user ON social_accounts(user_id);`

## **user\_verifications**

Identity and document verification records.

sql  
`CREATE TABLE user_verifications (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
    `verification_type VARCHAR(50) NOT NULL, -- identity, address, business, license, insurance, background_check`  
      
    `status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, expired`  
      
    `-- Documents`  
    `document_type VARCHAR(50), -- passport, national_id, drivers_license, business_reg, etc.`  
    `document_number VARCHAR(100),`  
    `document_front_url TEXT,`  
    `document_back_url TEXT,`  
    `selfie_url TEXT,`  
      
    `-- Business Verification`  
    `business_name VARCHAR(255),`  
    `business_registration_number VARCHAR(100),`  
    `vat_number VARCHAR(50),`  
      
    `-- License Verification (for providers)`  
    `license_type VARCHAR(100),`  
    `license_number VARCHAR(100),`  
    `license_issuer VARCHAR(255),`  
    `license_expiry_date DATE,`  
    `license_document_url TEXT,`  
      
    `-- Review`  
    `reviewed_by UUID REFERENCES users(id),`  
    `reviewed_at TIMESTAMP,`  
    `rejection_reason TEXT,`  
    `admin_notes TEXT,`  
      
    `expires_at TIMESTAMP,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_verifications_user ON user_verifications(user_id, verification_type);`  
`CREATE INDEX idx_verifications_status ON user_verifications(status, created_at);`

## **user\_settings**

Granular user preferences.

sql  
`CREATE TABLE user_settings (`  
    `user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,`  
      
    `-- Notification Preferences`  
    `notify_email_bookings BOOLEAN DEFAULT TRUE,`  
    `notify_email_cases BOOLEAN DEFAULT TRUE,`  
    `notify_email_messages BOOLEAN DEFAULT TRUE,`  
    `notify_email_community BOOLEAN DEFAULT TRUE,`  
    `notify_email_marketing BOOLEAN DEFAULT FALSE,`  
      
    `notify_push_bookings BOOLEAN DEFAULT TRUE,`  
    `notify_push_cases BOOLEAN DEFAULT TRUE,`  
    `notify_push_messages BOOLEAN DEFAULT TRUE,`  
    `notify_push_community BOOLEAN DEFAULT FALSE,`  
      
    `notify_sms_bookings BOOLEAN DEFAULT FALSE,`  
    `notify_sms_cases BOOLEAN DEFAULT FALSE,`  
    `notify_sms_critical BOOLEAN DEFAULT TRUE,`  
      
    `email_digest_frequency VARCHAR(20) DEFAULT 'instant', -- instant, daily, weekly, never`  
      
    `-- Privacy`  
    `show_email BOOLEAN DEFAULT FALSE,`  
    `show_phone BOOLEAN DEFAULT FALSE,`  
    `show_location_city BOOLEAN DEFAULT TRUE,`  
    `show_location_full BOOLEAN DEFAULT FALSE,`  
      
    `-- Security`  
    `two_factor_enabled BOOLEAN DEFAULT FALSE,`  
    `two_factor_method VARCHAR(20), -- sms, app, email`  
    `two_factor_secret VARCHAR(255),`  
    `backup_codes TEXT[], -- array of one-time codes`  
      
    `-- Accessibility`  
    `high_contrast_mode BOOLEAN DEFAULT FALSE,`  
    `text_size VARCHAR(20) DEFAULT 'medium', -- small, medium, large, xlarge`  
      
    `-- Other`  
    `quiet_hours_start TIME,`  
    `quiet_hours_end TIME,`  
      
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

---

## **2\. Organizations & Teams**

## **organizations**

Businesses, shelters, clinics.

sql  
`CREATE TABLE organizations (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `owner_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `-- Basic Info`  
    `legal_name VARCHAR(255) NOT NULL,`  
    `display_name VARCHAR(255) NOT NULL,`  
    `slug VARCHAR(255) UNIQUE NOT NULL,`  
    `organization_type VARCHAR(50) NOT NULL, -- business, ngo, vet_clinic, shelter, grooming, training, boarding, pet_store`  
      
    `logo_url TEXT,`  
    `cover_photo_url TEXT,`  
    `description TEXT,`  
    `mission_statement TEXT,`  
      
    `-- Contact`  
    `email VARCHAR(255),`  
    `phone VARCHAR(20),`  
    `website TEXT,`  
    `social_media JSONB, -- {facebook, instagram, twitter, etc.}`  
      
    `-- Legal`  
    `business_registration_number VARCHAR(100),`  
    `vat_number VARCHAR(50),`  
    `tax_id VARCHAR(50),`  
      
    `-- Verification`  
    `is_verified BOOLEAN DEFAULT FALSE,`  
    `verified_at TIMESTAMP,`  
    `verification_documents JSONB,`  
      
    `-- Settings`  
    `languages_supported CHAR(2)[], -- array of language codes`  
    `accepts_online_booking BOOLEAN DEFAULT TRUE,`  
    `instant_booking_enabled BOOLEAN DEFAULT FALSE,`  
      
    `-- Metadata`  
    `metadata JSONB,`  
      
    `status VARCHAR(20) DEFAULT 'active',`  
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP`  
`);`

`CREATE INDEX idx_orgs_owner ON organizations(owner_user_id);`  
`CREATE INDEX idx_orgs_slug ON organizations(slug) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_orgs_type ON organizations(organization_type, status);`

## **organization\_locations**

Physical locations for orgs.

sql  
`CREATE TABLE organization_locations (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,`  
      
    `name VARCHAR(255),`  
    `address_line1 TEXT NOT NULL,`  
    `address_line2 TEXT,`  
    `city VARCHAR(100) NOT NULL,`  
    `region VARCHAR(100),`  
    `postal_code VARCHAR(20),`  
    `country_code CHAR(2) NOT NULL,`  
      
    `latitude DECIMAL(10,8),`  
    `longitude DECIMAL(11,8),`  
      
    `phone VARCHAR(20),`  
    `email VARCHAR(255),`  
      
    `-- Hours`  
    `hours_of_operation JSONB, -- {monday: {open: "09:00", close: "18:00"}, ...}`  
    `timezone VARCHAR(50),`  
      
    `is_primary BOOLEAN DEFAULT FALSE,`  
    `status VARCHAR(20) DEFAULT 'active',`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_org_locations_org ON organization_locations(organization_id);`  
`CREATE INDEX idx_org_locations_coords ON organization_locations(latitude, longitude);`

## **organization\_members**

Team members and roles.

sql  
`CREATE TABLE organization_members (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
      
    `role VARCHAR(50) NOT NULL, -- owner, manager, scheduler, provider, finance, volunteer_coordinator, vet, tech`  
    `permissions JSONB, -- granular permissions override`  
      
    `title VARCHAR(100), -- job title`  
    `bio TEXT,`  
    `specializations TEXT[],`  
      
    `-- Availability (for providers)`  
    `availability_schedule JSONB,`  
      
    `-- Status`  
    `status VARCHAR(20) DEFAULT 'active', -- active, inactive, invited`  
    `invited_at TIMESTAMP,`  
    `joined_at TIMESTAMP,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
      
    `UNIQUE(organization_id, user_id)`  
`);`

`CREATE INDEX idx_org_members_org ON organization_members(organization_id, status);`  
`CREATE INDEX idx_org_members_user ON organization_members(user_id);`

---

## **3\. Pets & Digital Passport**

## **pets**

Pet profiles.

sql  
`CREATE TABLE pets (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
    `organization_id UUID REFERENCES organizations(id), -- if owned by shelter/rescue`  
      
    `-- Basic Info`  
    `name VARCHAR(100) NOT NULL,`  
    `species VARCHAR(50) NOT NULL, -- dog, cat, bird, rabbit, etc.`  
    `breed VARCHAR(100),`  
    `mixed_breed BOOLEAN DEFAULT FALSE,`  
      
    `gender VARCHAR(20), -- male, female, unknown`  
    `date_of_birth DATE,`  
    `age_years INT,`  
    `age_months INT,`  
      
    `weight DECIMAL(6,2),`  
    `weight_unit VARCHAR(10) DEFAULT 'kg', -- kg, lbs`  
      
    `color VARCHAR(50),`  
    `markings TEXT,`  
      
    `-- Identification`  
    `microchip_id VARCHAR(50),`  
    `registration_number VARCHAR(50),`  
      
    `-- Health`  
    `spayed_neutered BOOLEAN,`  
    `spayed_neutered_date DATE,`  
    `allergies TEXT[],`  
    `medical_conditions TEXT[],`  
    `current_medications TEXT[],`  
    `special_needs TEXT,`  
      
    `-- Behavior`  
    `temperament TEXT[],`  
    `good_with_children BOOLEAN,`  
    `good_with_dogs BOOLEAN,`  
    `good_with_cats BOOLEAN,`  
    `training_level VARCHAR(50), -- none, basic, advanced`  
    `behavioral_notes TEXT,`  
      
    `-- Emergency`  
    `emergency_contact_name VARCHAR(100),`  
    `emergency_contact_phone VARCHAR(20),`  
    `emergency_contact_relation VARCHAR(50),`  
    `preferred_vet_clinic VARCHAR(255),`  
    `preferred_vet_phone VARCHAR(20),`  
      
    `-- Media`  
    `primary_photo_url TEXT,`  
    `photos JSONB, -- array of photo URLs`  
      
    `-- Status`  
    `status VARCHAR(20) DEFAULT 'active', -- active, deceased, rehomed, lost, archived`  
      
    `-- Metadata`  
    `metadata JSONB,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP`  
`);`

`CREATE INDEX idx_pets_owner ON pets(owner_user_id) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_pets_org ON pets(organization_id) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_pets_microchip ON pets(microchip_id) WHERE microchip_id IS NOT NULL;`  
`CREATE INDEX idx_pets_species ON pets(species, status);`

## **pet\_health\_records**

Medical history and Digital Passport entries.

sql  
`CREATE TABLE pet_health_records (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,`  
      
    `record_type VARCHAR(50) NOT NULL, -- vaccination, diagnosis, treatment, surgery, lab_result, checkup, medication, allergy`  
    `record_date DATE NOT NULL,`  
      
    `-- General`  
    `title VARCHAR(255),`  
    `description TEXT,`  
    `notes TEXT,`  
      
    `-- Vaccination`  
    `vaccine_name VARCHAR(100),`  
    `vaccine_batch VARCHAR(50),`  
    `next_due_date DATE,`  
      
    `-- Diagnosis & Treatment`  
    `diagnosis_code VARCHAR(20), -- ICD-10 if applicable`  
    `diagnosis_name VARCHAR(255),`  
    `treatment_plan TEXT,`  
    `prescribed_medication TEXT,`  
    `dosage VARCHAR(100),`  
      
    `-- Provider`  
    `veterinarian_name VARCHAR(255),`  
    `clinic_name VARCHAR(255),`  
    `clinic_id UUID REFERENCES organizations(id),`  
      
    `-- Documents & Verification`  
    `document_urls TEXT[],`  
    `verified_by_clinic BOOLEAN DEFAULT FALSE,`  
    `verified_at TIMESTAMP,`  
      
    `-- Cost`  
    `cost DECIMAL(10,2),`  
    `currency CHAR(3),`  
      
    `-- Reminders`  
    `reminder_date DATE,`  
    `reminder_sent BOOLEAN DEFAULT FALSE,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `created_by UUID REFERENCES users(id)`  
`);`

`CREATE INDEX idx_health_records_pet ON pet_health_records(pet_id, record_date DESC);`  
`CREATE INDEX idx_health_records_type ON pet_health_records(record_type, record_date);`  
`CREATE INDEX idx_health_records_reminders ON pet_health_records(reminder_date) WHERE reminder_sent = FALSE;`

## **pet\_documents**

Attached files for Digital Passport.

sql  
`CREATE TABLE pet_documents (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,`  
      
    `document_type VARCHAR(50) NOT NULL, -- medical_record, vaccination_cert, insurance, registration, photo, xray, lab_result, invoice`  
      
    `file_name VARCHAR(255) NOT NULL,`  
    `file_url TEXT NOT NULL,`  
    `file_size INT, -- bytes`  
    `mime_type VARCHAR(100),`  
      
    `title VARCHAR(255),`  
    `description TEXT,`  
    `document_date DATE,`  
      
    `-- OCR & Extraction`  
    `ocr_text TEXT,`  
    `extracted_data JSONB,`  
      
    `-- Verification`  
    `verified_by_admin BOOLEAN DEFAULT FALSE,`  
    `verified_at TIMESTAMP,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `created_by UUID REFERENCES users(id)`  
`);`

`CREATE INDEX idx_pet_docs_pet ON pet_documents(pet_id, created_at DESC);`  
`CREATE INDEX idx_pet_docs_type ON pet_documents(document_type);`

---

## **4\. Cases & Fundraising**

## **cases**

Help requests for animals.

sql  
`CREATE TABLE cases (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `creator_user_id UUID NOT NULL REFERENCES users(id),`  
    `creator_org_id UUID REFERENCES organizations(id), -- if created by NGO`  
    `pet_id UUID REFERENCES pets(id),`  
      
    `-- Case Info`  
    `title VARCHAR(255) NOT NULL,`  
    `slug VARCHAR(255) UNIQUE NOT NULL,`  
    `description TEXT NOT NULL,`  
    `case_type VARCHAR(50) NOT NULL, -- medical_financial, blood_donation, physical_help, foster, adoption`  
      
    `urgency VARCHAR(20) DEFAULT 'normal', -- emergency, urgent, normal`  
      
    `-- Location`  
    `country_code CHAR(2) NOT NULL,`  
    `city VARCHAR(100),`  
    `region VARCHAR(100),`  
    `latitude DECIMAL(10,8),`  
    `longitude DECIMAL(11,8),`  
    `show_exact_location BOOLEAN DEFAULT FALSE,`  
      
    `-- Fundraising`  
    `fundraising_goal DECIMAL(10,2),`  
    `currency CHAR(3) DEFAULT 'EUR',`  
    `amount_raised DECIMAL(10,2) DEFAULT 0,`  
    `donor_count INT DEFAULT 0,`  
    `cost_breakdown JSONB, -- [{item: "Surgery", cost: 5000}, ...]`  
      
    `-- Media`  
    `primary_photo_url TEXT,`  
    `photos TEXT[],`  
    `video_url TEXT,`  
      
    `-- Medical Documentation`  
    `medical_documents TEXT[],`  
    `medical_verified BOOLEAN DEFAULT FALSE,`  
    `verified_by_clinic_id UUID REFERENCES organizations(id),`  
    `verified_at TIMESTAMP,`  
      
    `-- Status & Lifecycle`  
    `status VARCHAR(20) DEFAULT 'draft', -- draft, pending_review, active, funded, completed, rejected, cancelled`  
      
    `published_at TIMESTAMP,`  
    `funded_at TIMESTAMP, -- when goal reached`  
    `completed_at TIMESTAMP,`  
    `closed_at TIMESTAMP,`  
      
    `rejection_reason TEXT,`  
    `completion_outcome TEXT, -- final update on outcome`  
      
    `-- Engagement`  
    `view_count INT DEFAULT 0,`  
    `share_count INT DEFAULT 0,`  
    `bookmark_count INT DEFAULT 0,`  
      
    `-- Settings`  
    `allow_donations_after_goal BOOLEAN DEFAULT TRUE,`  
    `allow_comments BOOLEAN DEFAULT TRUE,`  
    `contact_visibility VARCHAR(20) DEFAULT 'private', -- public, verified_only, private`  
      
    `-- Metadata`  
    `tags TEXT[],`  
    `metadata JSONB,`  
      
    `-- Audit`  
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP,`  
      
    `reviewed_by UUID REFERENCES users(id),`  
    `reviewed_at TIMESTAMP`  
`);`

`CREATE INDEX idx_cases_creator ON cases(creator_user_id) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_cases_pet ON cases(pet_id) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_cases_status ON cases(status, urgency, published_at DESC);`  
`CREATE INDEX idx_cases_location ON cases(country_code, city) WHERE status = 'active';`  
`CREATE INDEX idx_cases_slug ON cases(slug) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_cases_fundraising ON cases(status, amount_raised, fundraising_goal) WHERE status = 'active';`  
`CREATE INDEX idx_cases_coords ON cases(latitude, longitude) WHERE status = 'active' AND latitude IS NOT NULL;`

## **case\_updates**

Posted updates from case owners.

sql  
`CREATE TABLE case_updates (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,`  
      
    `title VARCHAR(255),`  
    `content TEXT NOT NULL,`  
    `photos TEXT[],`  
    `video_url TEXT,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `created_by UUID NOT NULL REFERENCES users(id)`  
`);`

`CREATE INDEX idx_case_updates_case ON case_updates(case_id, created_at DESC);`

## **donations**

Individual donation transactions.

sql  
`CREATE TABLE donations (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,`  
    `donor_user_id UUID REFERENCES users(id), -- NULL if guest`  
      
    `-- Donor Info (if not logged in)`  
    `donor_name VARCHAR(255),`  
    `donor_email VARCHAR(255),`  
    `is_anonymous BOOLEAN DEFAULT FALSE,`  
      
    `-- Donation`  
    `amount DECIMAL(10,2) NOT NULL,`  
    `currency CHAR(3) NOT NULL,`  
    `amount_in_base_currency DECIMAL(10,2), -- EUR equivalent for reporting`  
      
    `platform_tip DECIMAL(10,2) DEFAULT 0, -- optional tip to platform`  
      
    `message TEXT, -- message to case owner`  
    `message_public BOOLEAN DEFAULT TRUE,`  
      
    `-- Payment`  
    `payment_method VARCHAR(50), -- card, paypal, sepa, etc.`  
    `payment_gateway VARCHAR(50), -- stripe, paypal`  
    `gateway_transaction_id VARCHAR(255),`  
    `gateway_fee DECIMAL(10,2),`  
      
    `status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded`  
      
    `processed_at TIMESTAMP,`  
    `refunded_at TIMESTAMP,`  
    `refund_reason TEXT,`  
      
    `-- Receipt`  
    `receipt_sent BOOLEAN DEFAULT FALSE,`  
    `receipt_url TEXT,`  
      
    `-- Metadata`  
    `ip_address INET,`  
    `user_agent TEXT,`  
    `metadata JSONB,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_donations_case ON donations(case_id, created_at DESC);`  
`CREATE INDEX idx_donations_donor ON donations(donor_user_id) WHERE donor_user_id IS NOT NULL;`  
`CREATE INDEX idx_donations_status ON donations(status, created_at);`  
`CREATE INDEX idx_donations_gateway_id ON donations(gateway_transaction_id);`

## **case\_comments**

Public support messages.

sql  
`CREATE TABLE case_comments (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,`  
    `user_id UUID NOT NULL REFERENCES users(id),`  
    `parent_comment_id UUID REFERENCES case_comments(id), -- for replies`  
      
    `content TEXT NOT NULL,`  
      
    `is_flagged BOOLEAN DEFAULT FALSE,`  
    `flagged_reason TEXT,`  
    `is_hidden BOOLEAN DEFAULT FALSE,`  
      
    `like_count INT DEFAULT 0,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP`  
`);`

`CREATE INDEX idx_case_comments_case ON case_comments(case_id, created_at DESC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_case_comments_user ON case_comments(user_id);`  
`CREATE INDEX idx_case_comments_parent ON case_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;`

---

## **5\. Services & Bookings**

## **service\_categories**

Hierarchical service taxonomy.

sql  
`CREATE TABLE service_categories (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `parent_id UUID REFERENCES service_categories(id),`  
      
    `name VARCHAR(100) NOT NULL,`  
    `slug VARCHAR(100) UNIQUE NOT NULL,`  
    `description TEXT,`  
    `icon VARCHAR(50),`  
      
    `display_order INT DEFAULT 0,`  
    `is_active BOOLEAN DEFAULT TRUE,`  
      
    `translations JSONB, -- {en: {name, description}, es: {...}}`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_categories_parent ON service_categories(parent_id, display_order);`  
`CREATE INDEX idx_categories_slug ON service_categories(slug) WHERE is_active = TRUE;`

## **services**

Service offerings by providers/orgs.

sql  
`CREATE TABLE services (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `provider_user_id UUID REFERENCES users(id), -- individual provider`  
    `provider_org_id UUID REFERENCES organizations(id), -- business`  
    `category_id UUID NOT NULL REFERENCES service_categories(id),`  
      
    `-- Service Info`  
    `title VARCHAR(255) NOT NULL,`  
    `slug VARCHAR(255) NOT NULL,`  
    `description TEXT,`  
      
    `-- Pricing`  
    `pricing_model VARCHAR(50) NOT NULL, -- fixed, per_hour, per_day, per_session, package`  
    `base_price DECIMAL(10,2) NOT NULL,`  
    `currency CHAR(3) DEFAULT 'EUR',`  
      
    `duration_minutes INT,`  
      
    `-- Packages`  
    `package_sessions INT, -- if pricing_model = package`  
    `package_price DECIMAL(10,2),`  
    `package_validity_days INT,`  
      
    `-- Add-ons`  
    `add_ons JSONB, -- [{name: "Extra pet", price: 10}, ...]`  
      
    `-- Location`  
    `service_location_type VARCHAR(50) NOT NULL, -- at_provider, at_client, mobile, online`  
    `address_line1 TEXT,`  
    `city VARCHAR(100),`  
    `region VARCHAR(100),`  
    `country_code CHAR(2),`  
    `latitude DECIMAL(10,8),`  
    `longitude DECIMAL(11,8),`  
    `service_radius_km INT, -- for mobile services`  
      
    `-- Requirements & Restrictions`  
    `pet_species VARCHAR(50)[], -- [dog, cat, etc.]`  
    `pet_size VARCHAR(50)[], -- [small, medium, large]`  
    `pet_age_min_months INT,`  
    `pet_age_max_months INT,`  
    `max_pets_per_booking INT DEFAULT 1,`  
      
    `-- Policies`  
    `cancellation_policy TEXT,`  
    `cancellation_fee_hours INT,`  
    `cancellation_fee_percent INT,`  
    `requires_deposit BOOLEAN DEFAULT FALSE,`  
    `deposit_percent INT,`  
      
    `-- Booking`  
    `instant_booking_enabled BOOLEAN DEFAULT FALSE,`  
    `min_notice_hours INT DEFAULT 24,`  
    `max_advance_days INT DEFAULT 90,`  
      
    `-- Media`  
    `photos TEXT[],`  
    `video_url TEXT,`  
      
    `-- Status & Visibility`  
    `status VARCHAR(20) DEFAULT 'draft', -- draft, active, inactive, suspended`  
    `is_featured BOOLEAN DEFAULT FALSE,`  
      
    `-- Stats`  
    `booking_count INT DEFAULT 0,`  
    `view_count INT DEFAULT 0,`  
    `average_rating DECIMAL(3,2),`  
    `review_count INT DEFAULT 0,`  
      
    `-- SEO`  
    `seo_title VARCHAR(255),`  
    `seo_description TEXT,`  
    `seo_keywords TEXT[],`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP,`  
      
    `CONSTRAINT valid_provider CHECK (`  
        `(provider_user_id IS NOT NULL AND provider_org_id IS NULL) OR`  
        `(provider_user_id IS NULL AND provider_org_id IS NOT NULL)`  
    `)`  
`);`

`CREATE INDEX idx_services_provider_user ON services(provider_user_id) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_services_provider_org ON services(provider_org_id) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_services_category ON services(category_id, status);`  
`CREATE INDEX idx_services_slug ON services(provider_user_id, slug) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_services_location ON services(country_code, city, status);`  
`CREATE INDEX idx_services_coords ON services(latitude, longitude) WHERE status = 'active';`  
`CREATE INDEX idx_services_rating ON services(average_rating DESC, review_count DESC) WHERE status = 'active';`

## **service\_availability**

Provider availability schedules.

sql  
`CREATE TABLE service_availability (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `service_id UUID REFERENCES services(id) ON DELETE CASCADE,`  
    `provider_user_id UUID REFERENCES users(id),`  
    `org_member_id UUID REFERENCES organization_members(id),`  
      
    `-- Recurring Schedule`  
    `day_of_week INT, -- 0=Sunday, 6=Saturday`  
    `start_time TIME,`  
    `end_time TIME,`  
      
    `-- Specific Date Override`  
    `specific_date DATE,`  
    `is_available BOOLEAN DEFAULT TRUE,`  
      
    `-- Metadata`  
    `notes TEXT,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
      
    `CONSTRAINT valid_assignment CHECK (`  
        `(provider_user_id IS NOT NULL AND org_member_id IS NULL) OR`  
        `(provider_user_id IS NULL AND org_member_id IS NOT NULL)`  
    `)`  
`);`

`CREATE INDEX idx_availability_service ON service_availability(service_id, day_of_week);`  
`CREATE INDEX idx_availability_provider ON service_availability(provider_user_id, specific_date);`  
`CREATE INDEX idx_availability_date ON service_availability(specific_date) WHERE specific_date IS NOT NULL;`

## **bookings**

Service appointments/reservations.

sql  
`CREATE TABLE bookings (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `booking_number VARCHAR(20) UNIQUE NOT NULL, -- human-readable reference`  
      
    `service_id UUID NOT NULL REFERENCES services(id),`  
    `client_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `provider_user_id UUID REFERENCES users(id),`  
    `provider_org_id UUID REFERENCES organizations(id),`  
    `assigned_member_id UUID REFERENCES organization_members(id),`  
      
    `-- Pets`  
    `pet_ids UUID[], -- array of pet IDs`  
      
    `-- Schedule`  
    `booking_date DATE NOT NULL,`  
    `start_time TIME NOT NULL,`  
    `end_time TIME NOT NULL,`  
    `duration_minutes INT NOT NULL,`  
    `timezone VARCHAR(50),`  
      
    `-- Location`  
    `service_location_type VARCHAR(50) NOT NULL,`  
    `location_address TEXT,`  
    `location_city VARCHAR(100),`  
    `location_latitude DECIMAL(10,8),`  
    `location_longitude DECIMAL(11,8),`  
      
    `-- Pricing`  
    `base_price DECIMAL(10,2) NOT NULL,`  
    `add_ons_price DECIMAL(10,2) DEFAULT 0,`  
    `total_price DECIMAL(10,2) NOT NULL,`  
    `currency CHAR(3) NOT NULL,`  
      
    `platform_commission DECIMAL(10,2),`  
    `platform_commission_percent INT DEFAULT 18,`  
      
    `deposit_amount DECIMAL(10,2) DEFAULT 0,`  
    `deposit_paid BOOLEAN DEFAULT FALSE,`  
      
    `-- Payment`  
    `payment_status VARCHAR(20) DEFAULT 'pending', -- pending, authorized, captured, released, refunded`  
    `payment_method VARCHAR(50),`  
    `payment_gateway VARCHAR(50),`  
    `gateway_transaction_id VARCHAR(255),`  
    `paid_at TIMESTAMP,`  
      
    `-- Booking Lifecycle`  
    `status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled, no_show, disputed`  
      
    `confirmed_at TIMESTAMP,`  
    `started_at TIMESTAMP, -- check-in`  
    `completed_at TIMESTAMP, -- check-out`  
    `cancelled_at TIMESTAMP,`  
      
    `cancellation_reason TEXT,`  
    `cancelled_by UUID REFERENCES users(id),`  
    `cancellation_fee DECIMAL(10,2) DEFAULT 0,`  
      
    `-- Service Delivery`  
    `check_in_latitude DECIMAL(10,8),`  
    `check_in_longitude DECIMAL(11,8),`  
    `check_out_latitude DECIMAL(10,8),`  
    `check_out_longitude DECIMAL(11,8),`  
      
    `service_notes TEXT, -- provider notes during service`  
    `service_photos TEXT[],`  
    `tracking_data JSONB, -- GPS route for walks, etc.`  
      
    `-- Client Info`  
    `special_instructions TEXT,`  
    `client_phone VARCHAR(20),`  
    `client_email VARCHAR(255),`  
      
    `-- Review`  
    `reviewed_by_client BOOLEAN DEFAULT FALSE,`  
    `reviewed_by_provider BOOLEAN DEFAULT FALSE,`  
      
    `-- Dispute`  
    `is_disputed BOOLEAN DEFAULT FALSE,`  
    `dispute_id UUID REFERENCES disputes(id),`  
      
    `-- Notifications`  
    `reminder_sent_24h BOOLEAN DEFAULT FALSE,`  
    `reminder_sent_2h BOOLEAN DEFAULT FALSE,`  
      
    `-- Metadata`  
    `metadata JSONB,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_bookings_client ON bookings(client_user_id, booking_date DESC);`  
`CREATE INDEX idx_bookings_provider_user ON bookings(provider_user_id, booking_date DESC);`  
`CREATE INDEX idx_bookings_provider_org ON bookings(provider_org_id, booking_date DESC);`  
`CREATE INDEX idx_bookings_service ON bookings(service_id, booking_date DESC);`  
`CREATE INDEX idx_bookings_status ON bookings(status, booking_date);`  
`CREATE INDEX idx_bookings_date ON bookings(booking_date, start_time) WHERE status IN ('confirmed', 'in_progress');`  
`CREATE INDEX idx_bookings_payment ON bookings(payment_status, status);`

## **booking\_modifications**

Change history for bookings.

sql  
`CREATE TABLE booking_modifications (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,`  
      
    `modification_type VARCHAR(50) NOT NULL, -- date_change, time_change, cancellation, price_adjustment`  
    `requested_by UUID NOT NULL REFERENCES users(id),`  
      
    `old_values JSONB,`  
    `new_values JSONB,`  
    `reason TEXT,`  
      
    `status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected`  
    `approved_by UUID REFERENCES users(id),`  
    `approved_at TIMESTAMP,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_booking_mods_booking ON booking_modifications(booking_id, created_at DESC);`

---

## **6\. Reviews & Ratings**

## **reviews**

User reviews for services/providers.

sql  
`CREATE TABLE reviews (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
      
    `-- Reviewed Entity`  
    `booking_id UUID REFERENCES bookings(id),`  
    `service_id UUID REFERENCES services(id),`  
    `provider_user_id UUID REFERENCES users(id),`  
    `provider_org_id UUID REFERENCES organizations(id),`  
      
    `-- Reviewer`  
    `reviewer_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `-- Rating`  
    `overall_rating INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),`  
      
    `communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),`  
    `quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),`  
    `punctuality_rating INT CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),`  
    `value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),`  
      
    `-- Review Content`  
    `title VARCHAR(255),`  
    `content TEXT,`  
    `photos TEXT[],`  
      
    `would_recommend BOOLEAN,`  
      
    `-- Provider Response`  
    `provider_response TEXT,`  
    `provider_responded_at TIMESTAMP,`  
      
    `-- Moderation`  
    `is_verified_booking BOOLEAN DEFAULT FALSE,`  
    `is_flagged BOOLEAN DEFAULT FALSE,`  
    `is_hidden BOOLEAN DEFAULT FALSE,`  
    `flagged_reason TEXT,`  
      
    `-- Engagement`  
    `helpful_count INT DEFAULT 0,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP`  
`);`

`CREATE INDEX idx_reviews_provider_user ON reviews(provider_user_id, created_at DESC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_reviews_provider_org ON reviews(provider_org_id, created_at DESC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_reviews_service ON reviews(service_id, created_at DESC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_user_id);`  
`CREATE INDEX idx_reviews_booking ON reviews(booking_id);`  
`CREATE INDEX idx_reviews_rating ON reviews(overall_rating DESC, created_at DESC) WHERE is_hidden = FALSE;`

---

## **7\. Blood Donation Network**

## **blood\_donors**

Pet blood donor registry.

sql  
`CREATE TABLE blood_donors (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,`  
    `owner_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `-- Eligibility`  
    `blood_type VARCHAR(20),`  
    `weight_kg DECIMAL(5,2) NOT NULL,`  
    `last_donation_date DATE,`  
    `next_eligible_date DATE,`  
      
    `-- Health`  
    `health_status VARCHAR(50) DEFAULT 'healthy', -- healthy, temporarily_ineligible, permanently_ineligible`  
    `health_check_date DATE,`  
    `health_certificate_url TEXT,`  
    `vaccination_up_to_date BOOLEAN DEFAULT TRUE,`  
      
    `-- Availability`  
    `is_available BOOLEAN DEFAULT TRUE,`  
    `availability_frequency VARCHAR(50), -- once, occasionally, regularly`  
    `available_days INT[], -- array of weekdays`  
    `preferred_time VARCHAR(50),`  
    `travel_radius_km INT DEFAULT 20,`  
      
    `notification_preferences VARCHAR(50) DEFAULT 'all', -- all, urgent_only, none`  
      
    `-- Contact`  
    `emergency_phone VARCHAR(20),`  
      
    `-- Verification`  
    `is_verified BOOLEAN DEFAULT FALSE,`  
    `verified_at TIMESTAMP,`  
    `verified_by UUID REFERENCES users(id),`  
      
    `-- Stats`  
    `total_donations INT DEFAULT 0,`  
    `lives_saved INT DEFAULT 0,`  
      
    `status VARCHAR(20) DEFAULT 'active', -- active, inactive, cooldown, ineligible`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_blood_donors_pet ON blood_donors(pet_id);`  
`CREATE INDEX idx_blood_donors_owner ON blood_donors(owner_user_id);`  
`CREATE INDEX idx_blood_donors_eligibility ON blood_donors(is_available, status, next_eligible_date);`

## **blood\_donation\_requests**

Requests for blood donors.

sql  
`CREATE TABLE blood_donation_requests (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `requester_user_id UUID NOT NULL REFERENCES users(id),`  
    `pet_in_need_id UUID NOT NULL REFERENCES pets(id),`  
    `case_id UUID REFERENCES cases(id),`  
      
    `urgency VARCHAR(20) NOT NULL, -- emergency, urgent, scheduled`  
    `species VARCHAR(50) NOT NULL,`  
    `blood_type_needed VARCHAR(20),`  
    `blood_amount_ml INT,`  
      
    `-- Location`  
    `clinic_name VARCHAR(255) NOT NULL,`  
    `clinic_address TEXT NOT NULL,`  
    `clinic_city VARCHAR(100) NOT NULL,`  
    `clinic_phone VARCHAR(20),`  
    `latitude DECIMAL(10,8),`  
    `longitude DECIMAL(11,8),`  
      
    `-- Schedule`  
    `preferred_date DATE,`  
    `preferred_time TIME,`  
      
    `-- Medical`  
    `medical_reason TEXT,`  
    `vet_recommendation_url TEXT,`  
      
    `-- Matching`  
    `matched_donor_id UUID REFERENCES blood_donors(id),`  
    `matched_at TIMESTAMP,`  
      
    `status VARCHAR(20) DEFAULT 'pending', -- pending, matched, scheduled, completed, cancelled`  
      
    `completed_at TIMESTAMP,`  
    `completion_notes TEXT,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_blood_requests_requester ON blood_donation_requests(requester_user_id);`  
`CREATE INDEX idx_blood_requests_pet ON blood_donation_requests(pet_in_need_id);`  
`CREATE INDEX idx_blood_requests_status ON blood_donation_requests(status, urgency, created_at DESC);`  
`CREATE INDEX idx_blood_requests_donor ON blood_donation_requests(matched_donor_id) WHERE matched_donor_id IS NOT NULL;`

## **blood\_donations\_log**

Completed donation records.

sql  
`CREATE TABLE blood_donations_log (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `request_id UUID NOT NULL REFERENCES blood_donation_requests(id),`  
    `donor_id UUID NOT NULL REFERENCES blood_donors(id),`  
    `donor_pet_id UUID NOT NULL REFERENCES pets(id),`  
    `recipient_pet_id UUID NOT NULL REFERENCES pets(id),`  
      
    `donation_date DATE NOT NULL,`  
    `blood_amount_ml INT,`  
      
    `clinic_name VARCHAR(255),`  
    `veterinarian_name VARCHAR(255),`  
      
    `donation_successful BOOLEAN DEFAULT TRUE,`  
    `complications TEXT,`  
      
    `notes TEXT,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_donations_log_donor ON blood_donations_log(donor_id, donation_date DESC);`  
`CREATE INDEX idx_donations_log_request ON blood_donations_log(request_id);`

---

## **8\. Community Features**

## **forum\_categories**

sql  
`CREATE TABLE forum_categories (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `parent_id UUID REFERENCES forum_categories(id),`  
      
    `name VARCHAR(100) NOT NULL,`  
    `slug VARCHAR(100) UNIQUE NOT NULL,`  
    `description TEXT,`  
    `icon VARCHAR(50),`  
      
    `display_order INT DEFAULT 0,`  
    `is_active BOOLEAN DEFAULT TRUE,`  
      
    `post_count INT DEFAULT 0,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_forum_cats_parent ON forum_categories(parent_id, display_order);`

## **forum\_posts**

sql  
`CREATE TABLE forum_posts (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `category_id UUID NOT NULL REFERENCES forum_categories(id),`  
    `author_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `post_type VARCHAR(50) DEFAULT 'discussion', -- question, discussion, advice, experience`  
      
    `title VARCHAR(255) NOT NULL,`  
    `slug VARCHAR(255) NOT NULL,`  
    `content TEXT NOT NULL,`  
      
    `tags TEXT[],`  
      
    `-- Question-specific`  
    `is_answered BOOLEAN DEFAULT FALSE,`  
    `best_answer_id UUID REFERENCES forum_replies(id),`  
      
    `-- Engagement`  
    `view_count INT DEFAULT 0,`  
    `like_count INT DEFAULT 0,`  
    `reply_count INT DEFAULT 0,`  
      
    `-- Moderation`  
    `is_pinned BOOLEAN DEFAULT FALSE,`  
    `is_locked BOOLEAN DEFAULT FALSE,`  
    `is_flagged BOOLEAN DEFAULT FALSE,`  
    `is_hidden BOOLEAN DEFAULT FALSE,`  
      
    `last_activity_at TIMESTAMP DEFAULT NOW(),`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP`  
`);`

`CREATE INDEX idx_forum_posts_category ON forum_posts(category_id, last_activity_at DESC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_forum_posts_author ON forum_posts(author_user_id);`  
`CREATE INDEX idx_forum_posts_slug ON forum_posts(slug) WHERE deleted_at IS NULL;`

## **forum\_replies**

sql  
`CREATE TABLE forum_replies (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,`  
    `author_user_id UUID NOT NULL REFERENCES users(id),`  
    `parent_reply_id UUID REFERENCES forum_replies(id),`  
      
    `content TEXT NOT NULL,`  
      
    `is_best_answer BOOLEAN DEFAULT FALSE,`  
    `helpful_count INT DEFAULT 0,`  
      
    `is_flagged BOOLEAN DEFAULT FALSE,`  
    `is_hidden BOOLEAN DEFAULT FALSE,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP`  
`);`

`CREATE INDEX idx_forum_replies_post ON forum_replies(post_id, created_at ASC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_forum_replies_author ON forum_replies(author_user_id);`  
`CREATE INDEX idx_forum_replies_parent ON forum_replies(parent_reply_id) WHERE parent_reply_id IS NOT NULL;`

## **groups**

sql  
`CREATE TABLE groups (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `creator_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `name VARCHAR(255) NOT NULL,`  
    `slug VARCHAR(255) UNIQUE NOT NULL,`  
    `description TEXT,`  
      
    `group_type VARCHAR(50), -- location, breed, interest, support, professional`  
      
    `privacy VARCHAR(20) DEFAULT 'public', -- public, private, secret`  
      
    `cover_photo_url TEXT,`  
    `group_photo_url TEXT,`  
      
    `member_count INT DEFAULT 1,`  
      
    `rules TEXT,`  
      
    `is_active BOOLEAN DEFAULT TRUE,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_groups_creator ON groups(creator_user_id);`  
`CREATE INDEX idx_groups_slug ON groups(slug) WHERE is_active = TRUE;`  
`CREATE INDEX idx_groups_type ON groups(group_type, is_active);`

## **group\_members**

sql  
`CREATE TABLE group_members (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
      
    `role VARCHAR(50) DEFAULT 'member', -- admin, moderator, member`  
      
    `status VARCHAR(20) DEFAULT 'active', -- pending, active, banned`  
      
    `joined_at TIMESTAMP DEFAULT NOW(),`  
      
    `UNIQUE(group_id, user_id)`  
`);`

`CREATE INDEX idx_group_members_group ON group_members(group_id, status);`  
`CREATE INDEX idx_group_members_user ON group_members(user_id, status);`

## **group\_posts**

sql  
`CREATE TABLE group_posts (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,`  
    `author_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `content TEXT NOT NULL,`  
    `photos TEXT[],`  
    `video_url TEXT,`  
      
    `is_pinned BOOLEAN DEFAULT FALSE,`  
    `is_flagged BOOLEAN DEFAULT FALSE,`  
    `is_hidden BOOLEAN DEFAULT FALSE,`  
      
    `like_count INT DEFAULT 0,`  
    `comment_count INT DEFAULT 0,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `deleted_at TIMESTAMP`  
`);`

`CREATE INDEX idx_group_posts_group ON group_posts(group_id, created_at DESC) WHERE deleted_at IS NULL;`  
`CREATE INDEX idx_group_posts_author ON group_posts(author_user_id);`

## **events**

sql  
`CREATE TABLE events (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `organizer_user_id UUID REFERENCES users(id),`  
    `organizer_org_id UUID REFERENCES organizations(id),`  
    `group_id UUID REFERENCES groups(id),`  
      
    `title VARCHAR(255) NOT NULL,`  
    `slug VARCHAR(255) UNIQUE NOT NULL,`  
    `description TEXT,`  
      
    `event_type VARCHAR(50), -- adoption_drive, fundraiser, meetup, workshop, charity_walk, clinic`  
      
    `-- Schedule`  
    `event_date DATE NOT NULL,`  
    `start_time TIME NOT NULL,`  
    `end_time TIME,`  
    `timezone VARCHAR(50),`  
      
    `-- Location`  
    `location_type VARCHAR(50), -- physical, online, tbd`  
    `venue_name VARCHAR(255),`  
    `address TEXT,`  
    `city VARCHAR(100),`  
    `country_code CHAR(2),`  
    `latitude DECIMAL(10,8),`  
    `longitude DECIMAL(11,8),`  
    `online_meeting_url TEXT,`  
      
    `-- Registration`  
    `capacity INT,`  
    `registration_required BOOLEAN DEFAULT FALSE,`  
    `registration_fee DECIMAL(10,2) DEFAULT 0,`  
    `currency CHAR(3),`  
      
    `attendee_count INT DEFAULT 0,`  
      
    `-- Media`  
    `cover_photo_url TEXT,`  
    `photos TEXT[],`  
      
    `-- Settings`  
    `privacy VARCHAR(20) DEFAULT 'public', -- public, group_only, invite_only`  
    `allow_comments BOOLEAN DEFAULT TRUE,`  
      
    `status VARCHAR(20) DEFAULT 'active', -- draft, active, cancelled, completed`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_events_organizer_user ON events(organizer_user_id);`  
`CREATE INDEX idx_events_organizer_org ON events(organizer_org_id);`  
`CREATE INDEX idx_events_group ON events(group_id);`  
`CREATE INDEX idx_events_date ON events(event_date, status);`  
`CREATE INDEX idx_events_slug ON events(slug);`

## **event\_attendees**

sql  
`CREATE TABLE event_attendees (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
      
    `rsvp_status VARCHAR(20) NOT NULL, -- interested, going, not_going`  
      
    `checked_in BOOLEAN DEFAULT FALSE,`  
    `checked_in_at TIMESTAMP,`  
      
    `payment_status VARCHAR(20) DEFAULT 'not_required', -- not_required, pending, paid`  
    `payment_amount DECIMAL(10,2),`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
      
    `UNIQUE(event_id, user_id)`  
`);`

`CREATE INDEX idx_event_attendees_event ON event_attendees(event_id, rsvp_status);`  
`CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);`

---

## **9\. Messaging**

## **conversations**

sql  
`CREATE TABLE conversations (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
      
    `conversation_type VARCHAR(50) DEFAULT 'direct', -- direct, group, support`  
      
    `-- Context`  
    `booking_id UUID REFERENCES bookings(id),`  
    `case_id UUID REFERENCES cases(id),`  
      
    `last_message_at TIMESTAMP DEFAULT NOW(),`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);`

## **conversation\_participants**

sql  
`CREATE TABLE conversation_participants (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
      
    `last_read_at TIMESTAMP,`  
    `unread_count INT DEFAULT 0,`  
      
    `is_archived BOOLEAN DEFAULT FALSE,`  
    `is_muted BOOLEAN DEFAULT FALSE,`  
      
    `joined_at TIMESTAMP DEFAULT NOW(),`  
      
    `UNIQUE(conversation_id, user_id)`  
`);`

`CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id, last_read_at DESC);`  
`CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);`

## **messages**

sql  
`CREATE TABLE messages (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,`  
    `sender_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `message_type VARCHAR(50) DEFAULT 'text', -- text, image, file, location, system`  
      
    `content TEXT,`  
      
    `-- Attachments`  
    `attachment_urls TEXT[],`  
    `attachment_types TEXT[],`  
      
    `-- Location`  
    `location_latitude DECIMAL(10,8),`  
    `location_longitude DECIMAL(11,8),`  
    `location_name VARCHAR(255),`  
      
    `-- Metadata`  
    `metadata JSONB, -- for rich cards, booking refs, etc.`  
      
    `-- Status`  
    `is_read BOOLEAN DEFAULT FALSE,`  
    `read_at TIMESTAMP,`  
      
    `is_flagged BOOLEAN DEFAULT FALSE,`  
    `is_deleted BOOLEAN DEFAULT FALSE,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);`  
`CREATE INDEX idx_messages_sender ON messages(sender_user_id);`  
`CREATE INDEX idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = FALSE;`

---

## **10\. Payments & Transactions**

## **transactions**

sql  
`CREATE TABLE transactions (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `transaction_number VARCHAR(50) UNIQUE NOT NULL,`  
      
    `user_id UUID REFERENCES users(id),`  
      
    `-- Transaction Type`  
    `transaction_type VARCHAR(50) NOT NULL, -- donation, booking_payment, booking_refund, payout, deposit, credit`  
      
    `-- Related Entities`  
    `donation_id UUID REFERENCES donations(id),`  
    `booking_id UUID REFERENCES bookings(id),`  
    `case_id UUID REFERENCES cases(id),`  
      
    `-- Amounts`  
    `amount DECIMAL(10,2) NOT NULL,`  
    `currency CHAR(3) NOT NULL,`  
    `amount_in_base_currency DECIMAL(10,2), -- EUR`  
      
    `platform_fee DECIMAL(10,2) DEFAULT 0,`  
    `gateway_fee DECIMAL(10,2) DEFAULT 0,`  
    `net_amount DECIMAL(10,2),`  
      
    `-- Payment Gateway`  
    `payment_method VARCHAR(50), -- card, paypal, sepa, bank_transfer, etc.`  
    `payment_gateway VARCHAR(50), -- stripe, paypal, adyen`  
    `gateway_transaction_id VARCHAR(255),`  
    `gateway_response JSONB,`  
      
    `-- Card Info (tokenized)`  
    `card_last4 VARCHAR(4),`  
    `card_brand VARCHAR(50),`  
      
    `-- Status`  
    `status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed, refunded, disputed`  
      
    `processed_at TIMESTAMP,`  
    `failed_at TIMESTAMP,`  
    `failure_reason TEXT,`  
      
    `refunded_at TIMESTAMP,`  
    `refund_amount DECIMAL(10,2),`  
    `refund_reason TEXT,`  
      
    `-- Metadata`  
    `ip_address INET,`  
    `user_agent TEXT,`  
    `metadata JSONB,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);`  
`CREATE INDEX idx_transactions_type ON transactions(transaction_type, status, created_at DESC);`  
`CREATE INDEX idx_transactions_donation ON transactions(donation_id) WHERE donation_id IS NOT NULL;`  
`CREATE INDEX idx_transactions_booking ON transactions(booking_id) WHERE booking_id IS NOT NULL;`  
`CREATE INDEX idx_transactions_gateway_id ON transactions(gateway_transaction_id);`  
`CREATE INDEX idx_transactions_status ON transactions(status, created_at DESC);`

## **escrow\_accounts**

Funds held for bookings.

sql  
`CREATE TABLE escrow_accounts (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,`  
    `case_id UUID UNIQUE REFERENCES cases(id) ON DELETE CASCADE,`  
      
    `amount_held DECIMAL(10,2) NOT NULL,`  
    `currency CHAR(3) NOT NULL,`  
      
    `status VARCHAR(20) DEFAULT 'held', -- held, released, refunded, disputed`  
      
    `held_at TIMESTAMP DEFAULT NOW(),`  
    `released_at TIMESTAMP,`  
    `released_to_user_id UUID REFERENCES users(id),`  
      
    `refunded_at TIMESTAMP,`  
      
    `dispute_id UUID REFERENCES disputes(id),`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_escrow_booking ON escrow_accounts(booking_id);`  
`CREATE INDEX idx_escrow_case ON escrow_accounts(case_id);`  
`CREATE INDEX idx_escrow_status ON escrow_accounts(status);`

## **payouts**

Provider payouts.

sql  
`CREATE TABLE payouts (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `payout_number VARCHAR(50) UNIQUE NOT NULL,`  
      
    `payee_user_id UUID REFERENCES users(id),`  
    `payee_org_id UUID REFERENCES organizations(id),`  
      
    `amount DECIMAL(10,2) NOT NULL,`  
    `currency CHAR(3) NOT NULL,`  
      
    `payout_method VARCHAR(50), -- bank_transfer, paypal`  
    `bank_account_last4 VARCHAR(4),`  
      
    `status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed`  
      
    `scheduled_at TIMESTAMP,`  
    `processed_at TIMESTAMP,`  
    `completed_at TIMESTAMP,`  
      
    `failure_reason TEXT,`  
      
    `-- Included Transactions`  
    `transaction_ids UUID[],`  
    `booking_ids UUID[],`  
      
    `gateway_payout_id VARCHAR(255),`  
      
    `metadata JSONB,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_payouts_user ON payouts(payee_user_id, created_at DESC);`  
`CREATE INDEX idx_payouts_org ON payouts(payee_org_id, created_at DESC);`  
`CREATE INDEX idx_payouts_status ON payouts(status, scheduled_at);`

## **payment\_methods**

Saved payment cards/accounts.

sql  
`CREATE TABLE payment_methods (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
      
    `payment_type VARCHAR(50) NOT NULL, -- card, paypal, sepa, bank_account`  
      
    `-- Card`  
    `card_brand VARCHAR(50),`  
    `card_last4 VARCHAR(4),`  
    `card_exp_month INT,`  
    `card_exp_year INT,`  
    `card_fingerprint VARCHAR(255), -- for deduplication`  
      
    `-- Bank`  
    `bank_name VARCHAR(255),`  
    `bank_account_last4 VARCHAR(4),`  
      
    `-- Gateway Tokens`  
    `gateway VARCHAR(50), -- stripe, paypal`  
    `gateway_payment_method_id VARCHAR(255), -- tokenized ID`  
    `gateway_customer_id VARCHAR(255),`  
      
    `is_default BOOLEAN DEFAULT FALSE,`  
      
    `status VARCHAR(20) DEFAULT 'active', -- active, expired, failed`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_payment_methods_user ON payment_methods(user_id, is_default DESC);`  
`CREATE INDEX idx_payment_methods_gateway ON payment_methods(gateway, gateway_payment_method_id);`

---

## **11\. Disputes & Moderation**

## **disputes**

sql  
`CREATE TABLE disputes (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `dispute_number VARCHAR(50) UNIQUE NOT NULL,`  
      
    `booking_id UUID REFERENCES bookings(id),`  
    `case_id UUID REFERENCES cases(id),`  
    `transaction_id UUID REFERENCES transactions(id),`  
      
    `filed_by_user_id UUID NOT NULL REFERENCES users(id),`  
    `filed_against_user_id UUID REFERENCES users(id),`  
      
    `dispute_type VARCHAR(50) NOT NULL, -- service_not_provided, service_quality, payment_issue, fraud, harassment`  
      
    `description TEXT NOT NULL,`  
    `evidence_urls TEXT[],`  
      
    `desired_outcome VARCHAR(50), -- full_refund, partial_refund, service_redo, other`  
    `desired_outcome_details TEXT,`  
      
    `-- Lifecycle`  
    `status VARCHAR(20) DEFAULT 'open', -- open, under_review, mediation, resolved, closed`  
      
    `assigned_to_admin UUID REFERENCES users(id),`  
      
    `resolution_notes TEXT,`  
    `resolution_action VARCHAR(50), -- refund_issued, credit_issued, no_action, account_suspended`  
    `refund_amount DECIMAL(10,2),`  
      
    `opened_at TIMESTAMP DEFAULT NOW(),`  
    `reviewed_at TIMESTAMP,`  
    `resolved_at TIMESTAMP,`  
    `closed_at TIMESTAMP,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_disputes_booking ON disputes(booking_id);`  
`CREATE INDEX idx_disputes_case ON disputes(case_id);`  
`CREATE INDEX idx_disputes_filed_by ON disputes(filed_by_user_id);`  
`CREATE INDEX idx_disputes_status ON disputes(status, opened_at DESC);`  
`CREATE INDEX idx_disputes_assigned ON disputes(assigned_to_admin) WHERE status IN ('open', 'under_review');`

## **reports**

User-generated content reports.

sql  
`CREATE TABLE reports (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
      
    `reporter_user_id UUID NOT NULL REFERENCES users(id),`  
      
    `-- Reported Entity`  
    `reported_entity_type VARCHAR(50) NOT NULL, -- user, case, post, comment, message, review, service`  
    `reported_entity_id UUID NOT NULL,`  
    `reported_user_id UUID REFERENCES users(id),`  
      
    `report_reason VARCHAR(50) NOT NULL, -- spam, harassment, inappropriate, scam, fraud, violence, other`  
    `description TEXT,`  
    `evidence_urls TEXT[],`  
      
    `status VARCHAR(20) DEFAULT 'pending', -- pending, under_review, resolved, dismissed`  
      
    `reviewed_by UUID REFERENCES users(id),`  
    `reviewed_at TIMESTAMP,`  
    `action_taken VARCHAR(50), -- content_removed, user_warned, user_suspended, no_action`  
    `admin_notes TEXT,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_reports_reporter ON reports(reporter_user_id);`  
`CREATE INDEX idx_reports_reported_user ON reports(reported_user_id);`  
`CREATE INDEX idx_reports_entity ON reports(reported_entity_type, reported_entity_id);`  
`CREATE INDEX idx_reports_status ON reports(status, created_at DESC);`

---

## **12\. Notifications**

## **notifications**

sql  
`CREATE TABLE notifications (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
      
    `notification_type VARCHAR(50) NOT NULL, -- booking_request, booking_confirmed, case_update, donation_received, message_received, review_received, etc.`  
      
    `title VARCHAR(255) NOT NULL,`  
    `body TEXT,`  
      
    `-- Related Entity`  
    `entity_type VARCHAR(50), -- booking, case, message, etc.`  
    `entity_id UUID,`  
      
    `action_url TEXT,`  
      
    `-- Delivery`  
    `is_read BOOLEAN DEFAULT FALSE,`  
    `read_at TIMESTAMP,`  
      
    `channels VARCHAR(20)[], -- [email, push, sms]`  
    `email_sent BOOLEAN DEFAULT FALSE,`  
    `push_sent BOOLEAN DEFAULT FALSE,`  
    `sms_sent BOOLEAN DEFAULT FALSE,`  
      
    `metadata JSONB,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);`  
`CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;`  
`CREATE INDEX idx_notifications_type ON notifications(notification_type, created_at DESC);`

---

## **13\. Content & Education**

## **articles**

sql  
`CREATE TABLE articles (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
      
    `category VARCHAR(50) NOT NULL, -- pet_health, nutrition, training, grooming, adoption, etc.`  
      
    `title VARCHAR(255) NOT NULL,`  
    `slug VARCHAR(255) UNIQUE NOT NULL,`  
    `excerpt TEXT,`  
    `content TEXT NOT NULL,`  
      
    `featured_image_url TEXT,`  
      
    `author_user_id UUID REFERENCES users(id),`  
    `author_name VARCHAR(255),`  
    `author_bio TEXT,`  
      
    `tags TEXT[],`  
      
    `read_time_minutes INT,`  
      
    `view_count INT DEFAULT 0,`  
    `like_count INT DEFAULT 0,`  
      
    `is_featured BOOLEAN DEFAULT FALSE,`  
    `is_published BOOLEAN DEFAULT FALSE,`  
    `published_at TIMESTAMP,`  
      
    `seo_title VARCHAR(255),`  
    `seo_description TEXT,`  
      
    `translations JSONB, -- {es: {title, excerpt, content}, fr: {...}}`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_articles_category ON articles(category, published_at DESC) WHERE is_published = TRUE;`  
`CREATE INDEX idx_articles_slug ON articles(slug);`  
`CREATE INDEX idx_articles_featured ON articles(is_featured, published_at DESC) WHERE is_featured = TRUE AND is_published = TRUE;`

---

## **14\. Gamification & Achievements**

## **badges**

sql  
`CREATE TABLE badges (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
      
    `name VARCHAR(100) UNIQUE NOT NULL,`  
    `slug VARCHAR(100) UNIQUE NOT NULL,`  
    `description TEXT,`  
      
    `badge_type VARCHAR(50), -- donation, booking, community, provider, achievement`  
      
    `icon_url TEXT,`  
      
    `criteria JSONB, -- {donations: 10, cases_helped: 5}`  
      
    `is_active BOOLEAN DEFAULT TRUE,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_badges_type ON badges(badge_type);`

## **user\_badges**

sql  
`CREATE TABLE user_badges (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,`  
    `badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,`  
      
    `earned_at TIMESTAMP DEFAULT NOW(),`  
      
    `UNIQUE(user_id, badge_id)`  
`);`

`CREATE INDEX idx_user_badges_user ON user_badges(user_id, earned_at DESC);`

---

## **15\. System & Admin Tables**

## **admin\_users**

sql  
`CREATE TABLE admin_users (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
      
    `email VARCHAR(255) UNIQUE NOT NULL,`  
    `password_hash VARCHAR(255) NOT NULL,`  
      
    `name VARCHAR(255) NOT NULL,`  
      
    `role VARCHAR(50) NOT NULL, -- super_admin, platform_manager, moderator, support, finance, analyst`  
      
    `permissions JSONB, -- granular permissions`  
      
    `two_factor_enabled BOOLEAN DEFAULT FALSE,`  
    `two_factor_secret VARCHAR(255),`  
      
    `status VARCHAR(20) DEFAULT 'active',`  
      
    `last_login_at TIMESTAMP,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW()`  
`);`

`CREATE INDEX idx_admin_users_email ON admin_users(email);`

## **audit\_logs**

sql  
`CREATE TABLE audit_logs (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
      
    `actor_type VARCHAR(50), -- user, admin, system`  
    `actor_id UUID,`  
      
    `action VARCHAR(100) NOT NULL, -- create, update, delete, login, etc.`  
      
    `entity_type VARCHAR(50) NOT NULL, -- user, case, booking, etc.`  
    `entity_id UUID,`  
      
    `changes JSONB, -- {field: {old: x, new: y}}`  
      
    `ip_address INET,`  
    `user_agent TEXT,`  
      
    `created_at TIMESTAMP DEFAULT NOW()`  
`) PARTITION BY RANGE (created_at);`

`CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);`  
`CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);`  
`CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);`

*`-- Partitions by month for performance`*  
*`-- CREATE TABLE audit_logs_2025_10 PARTITION OF audit_logs FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');`*

## **system\_settings**

sql  
`CREATE TABLE system_settings (`  
    `key VARCHAR(100) PRIMARY KEY,`  
    `value JSONB NOT NULL,`  
    `data_type VARCHAR(50), -- string, number, boolean, json`  
    `description TEXT,`  
    `is_public BOOLEAN DEFAULT FALSE,`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
    `updated_by UUID REFERENCES admin_users(id)`  
`);`

---

## **16\. Supporting Tables**

## **countries**

sql  
`CREATE TABLE countries (`  
    `code CHAR(2) PRIMARY KEY, -- ISO 3166-1`  
    `name VARCHAR(100) NOT NULL,`  
    `native_name VARCHAR(100),`  
    `region VARCHAR(50),`  
    `currency CHAR(3),`  
    `phone_code VARCHAR(10),`  
    `vat_rate DECIMAL(5,2),`  
    `is_active BOOLEAN DEFAULT TRUE,`  
    `translations JSONB`  
`);`

## **currencies**

sql  
`CREATE TABLE currencies (`  
    `code CHAR(3) PRIMARY KEY, -- ISO 4217`  
    `name VARCHAR(100) NOT NULL,`  
    `symbol VARCHAR(10),`  
    `decimal_places INT DEFAULT 2,`  
    `exchange_rate_to_eur DECIMAL(10,6) DEFAULT 1.0,`  
    `last_updated TIMESTAMP DEFAULT NOW(),`  
    `is_active BOOLEAN DEFAULT TRUE`  
`);`

## **translations**

sql  
`CREATE TABLE translations (`  
    `id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`  
    `language_code CHAR(2) NOT NULL,`  
    `translation_key VARCHAR(255) NOT NULL,`  
    `translation_value TEXT NOT NULL,`  
    `context TEXT,`  
      
    `created_at TIMESTAMP DEFAULT NOW(),`  
    `updated_at TIMESTAMP DEFAULT NOW(),`  
      
    `UNIQUE(language_code, translation_key)`  
`);`

`CREATE INDEX idx_translations_lang_key ON translations(language_code, translation_key);`

---

This comprehensive database schema covers all core functionality for the PawHelp platform, including users, pets, cases, services, bookings, payments, community, messaging, and admin operations with proper indexing, constraints, and audit trails for a production-grade, scalable system.advice-and-recomend-what-improve-in-my-new-startup.md+2​

