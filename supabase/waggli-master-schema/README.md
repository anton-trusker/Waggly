# Waggli Master Schema Blueprint

This folder is the next clean SQL blueprint to implement after reviewing `waggli-db-master-plan/`.

It is intentionally separate from older migrations and earlier schema experiments.

## Files

- `001_foundation.sql` - extensions, helpers, identity, countries/languages/translations/glossary.
- `010_reference_data.sql` - species, breeds, vaccines, schedules, medications, allergens, symptoms, conditions.
- `020_pets_health_documents.sql` - pets, health, documents, OCR, passport, sharing.
- `030_platform_domains.sql` - calendar, notifications, providers, AI, monetization, admin.
- `040_app_compatibility_health_passport.sql` - current app-facing health/passport/sharing tables.
- `800_views.sql` - views and materialized views.
- `900_rls_helpers.sql` - RLS helper functions and policy templates.
- `910_rls_policies.sql` - concrete RLS policy draft for the current and next tables.
- `920_rpcs_and_compatibility.sql` - app RPCs and temporary legacy-name compatibility views.
- `930_storage.sql` - storage buckets and access policies.

Do not apply blindly. Review and convert into ordered Supabase migrations.
