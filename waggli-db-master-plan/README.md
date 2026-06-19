# Waggli Database Master Plan

This folder is the detailed database blueprint for the new Waggli Supabase project.

It is based on:

- Current app table/bucket/RPC usage.
- Existing generated `types/db.ts` schema snapshot.
- All existing migration history and db-refactor notes.
- Product specifications for pet profiles, passport, health, documents, OCR, calendar, sharing, AI, providers, monetization, admin, localization, and social.

## Goal

Build a clean Supabase/PostgreSQL model that supports the full Waggli platform with:

- Strong links between tables.
- Good performance and indexed foreign keys.
- RLS-first security.
- Clear ownership logic.
- Views and materialized views for dashboards/passports/search.
- Rich reference data and glossaries for translations, breeds, vaccines, medicines, countries, symptoms, allergens, and legal/compliance concepts.

## Documents

1. `01-current-db-audit.md` - current schema/app mismatch and what to retire.
2. `02-canonical-data-model.md` - final table groups, columns, relationships, and logic.
3. `03-views-functions-performance.md` - views, materialized views, RPCs, triggers, indexes, and performance strategy.
4. `04-reference-data-and-glossaries.md` - detailed reference data, translation glossary, countries, breeds, vaccines, medicines.
5. `05-security-rls-and-access.md` - RLS and access model.
6. `06-migration-and-validation-plan.md` - safe implementation order.

## Core Decisions

- Canonical pet owner column: `pets.user_id`.
- Child records use `pet_id`; ownership is derived through `pets` and `co_owners`.
- Canonical sharing table: `public_shares`.
- Canonical weight table: `weight_logs`.
- Canonical documents table: `documents` plus `document_links` and OCR tables.
- Do not apply old migration history directly to the new Supabase project.
