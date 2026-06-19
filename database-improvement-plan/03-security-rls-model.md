# 03 - Security and RLS Model

## Roles

- `anon`: public pages only, via validated share tokens and read-only public assets.
- `authenticated`: normal pet owners and co-owners.
- `service_role`: backend jobs, OCR, AI processing, scheduled reminders.
- `admin`: platform operations, support, moderation.
- `provider`: verified service providers with scoped client access.

## Ownership Policy

Pet owner access:

```sql
exists (
  select 1 from public.pets p
  where p.id = <table>.pet_id
  and p.user_id = auth.uid()
)
```

Co-owner access:

```sql
exists (
  select 1 from public.co_owners c
  where c.pet_id = <table>.pet_id
  and c.user_id = auth.uid()
  and c.status = 'accepted'
  and c.permissions ? 'read'
)
```

## Write Permissions

- Owners can create/update/delete all pet-scoped records.
- Co-owners can write only when their permissions allow it.
- Providers can write only through explicit professional access grants or booking/client relationships.
- Public share links are read-only and must be token/expiry scoped.

## Public Sharing

`public_shares` should store:

- `token_hash`, never plain token after creation
- `pet_id`
- `created_by`
- `share_type`: passport, medical_summary, document, provider_view
- `scope`: JSON permissions
- `expires_at`
- `revoked_at`
- `max_views`
- `view_count`

All access writes to `share_access_logs`.

## Sensitive Tables

These should have no direct client policies:

- `mail_queue`
- `ai_usage_logs` write side
- `ocr_jobs` worker fields
- admin billing webhook internals

## Storage Policy

Buckets:

- `avatars`: public read, user-owned write
- `user-photos`: public read, user-owned write
- `pet-photos`: public read, owner/co-owner write
- `pet-documents`: private, owner/co-owner/provider-grant read
- `provider-documents`: private, provider/admin read

## Security Hardening

- RLS enabled on every public table.
- All foreign keys indexed.
- `SECURITY DEFINER` functions must revoke broad public execute unless intentionally public.
- Public RPCs must validate token, expiry, status, and scope internally.
- Use audit logs for admin/provider actions and public share reads.
