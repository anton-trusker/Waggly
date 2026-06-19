# Waggli Canonical Schema

This folder is the clean database source of truth for the new Supabase project.

It intentionally replaces the old migration history, which contains incompatible schema generations.

## Apply Order

1. `001_extensions.sql`
2. `010_identity.sql`
3. `020_reference_data.sql`
4. `030_pets.sql`
5. `040_sharing.sql`
6. `050_documents_ocr.sql`
7. `060_health.sql`
8. `070_passport_travel.sql`
9. `080_calendar_notifications.sql`
10. `090_providers.sql`
11. `100_ai.sql`
12. `110_monetization.sql`
13. `120_admin_ops.sql`
14. `900_rls_template.sql`
15. `910_functions.sql`
16. `920_storage.sql`
17. `930_seed_reference.sql`

## Rules

- Canonical pet ownership is `pets.user_id`.
- Pet child tables use `pet_id`; access is derived through `pets` and `co_owners`.
- Avoid duplicate legacy names; use compatibility views only during app migration.
- Every FK must have an index.
- Every exposed table must have RLS before production.
