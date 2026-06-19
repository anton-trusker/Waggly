# Waggli Database Improvement Plan

This folder defines the canonical database design for Waggli before creating tables in the new Supabase project.

Use this as the source of truth before applying any migration to Supabase.

## Documents

1. `01-platform-data-model.md` - platform domains and final entity map
2. `02-canonical-tables.md` - proposed improved tables by domain
3. `03-security-rls-model.md` - ownership, co-owner access, public sharing, admin/provider access
4. `04-migration-strategy.md` - clean build order and compatibility rules
5. `05-app-compatibility-gaps.md` - current app query mismatches to fix before production

## Core decision

The improved schema uses `pets.user_id` as the single ownership root. Child tables derive access through `pet_id`, not duplicated `owner_id` columns. This matches the main architecture documentation and avoids the redundant ownership problem called out in the DB refactor docs.
