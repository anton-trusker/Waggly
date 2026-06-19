# 04 - Migration Strategy

## Principle

Do not apply the old 88 migration files to the new Supabase project. They contain conflicting schema generations and legacy naming. Build a clean canonical schema from these documents instead.

## Recommended Build Order

1. Extensions and helper functions
2. Profiles, roles, user roles
3. Reference data: species, breeds, vaccines, medications, countries, languages
4. Pets and pet profile extension tables
5. Sharing/co-owner tables
6. Documents and OCR tables
7. Health records
8. Passport and travel compliance
9. Calendar/reminders/notifications
10. Providers and bookings
11. AI tables
12. Monetization tables
13. Admin/ops tables
14. RLS policies and RPCs
15. Storage buckets and storage policies
16. Seed reference data
17. Generate TypeScript types
18. Update app hooks to match canonical names

## Migration Files To Create

- `supabase/canonical-schema/001_extensions.sql`
- `supabase/canonical-schema/010_identity.sql`
- `supabase/canonical-schema/020_reference_data.sql`
- `supabase/canonical-schema/030_pets.sql`
- `supabase/canonical-schema/040_sharing.sql`
- `supabase/canonical-schema/050_documents_ocr.sql`
- `supabase/canonical-schema/060_health.sql`
- `supabase/canonical-schema/070_passport_travel.sql`
- `supabase/canonical-schema/080_calendar_notifications.sql`
- `supabase/canonical-schema/090_providers.sql`
- `supabase/canonical-schema/100_ai.sql`
- `supabase/canonical-schema/110_monetization.sql`
- `supabase/canonical-schema/120_admin_ops.sql`
- `supabase/canonical-schema/900_rls.sql`
- `supabase/canonical-schema/910_functions.sql`
- `supabase/canonical-schema/920_storage.sql`
- `supabase/canonical-schema/930_seed_reference.sql`

## Validation Gates

Before applying to production-like data:

- Schema linter has no critical errors.
- Every FK has an index.
- Every client table has RLS.
- App can complete golden path: signup, create pet, upload photo, add vaccine, add visit, add medication, share passport.
- Generated `types/db.ts` matches app usage.
- No app hook queries retired names without a view/alias.

## Important Supabase Note

The `claude` CLI was not available in this terminal, so the MCP server was not added here. Run this in a normal terminal:

```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=fbeldieclcltyuqvomjx"
claude /mcp
npx skills add supabase/agent-skills
```
