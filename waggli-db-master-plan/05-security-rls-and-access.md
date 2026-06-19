# 05 - Security, RLS, and Access Model

## Security Principles

- RLS enabled on every table exposed through Supabase APIs.
- No pet health data is public by default.
- Pet owner access derives from `pets.user_id`.
- Co-owner access derives from `co_owners`.
- Provider access derives from explicit grants or bookings.
- Public access goes only through scoped, expiring share tokens.
- Admin access is audited.
- Service-role-only tables have no client RLS policies.

## Roles

### `anon`

Allowed:

- Read public landing/beta content.
- Call public share RPC with a valid token.
- Read public provider directory fields.

Not allowed:

- Direct table access to pet health data.
- Direct document access.

### `authenticated`

Allowed:

- Own profile.
- Own pets.
- Pet child records for owned pets.
- Co-owned pets according to permissions.
- Own notifications, devices, subscriptions.

### `provider`

Allowed:

- Own provider profile and services.
- Bookings/conversations involving their provider account.
- Pet/passport/document access only via explicit `professional_access_grants` or booking-specific grants.

### `admin/support`

Allowed:

- Admin panel access based on `user_roles`.
- Support actions audited in `audit_logs`.

### `service_role`

Allowed:

- OCR worker writes.
- AI job writes.
- Stripe webhook writes.
- Scheduled notification/reminder jobs.
- Mail queue processing.

## RLS Helper Functions

Create helper functions to keep policies consistent:

```sql
public.is_pet_owner(p_pet_id uuid) returns boolean
public.can_read_pet(p_pet_id uuid) returns boolean
public.can_write_pet(p_pet_id uuid, p_permission text default 'write') returns boolean
public.is_admin() returns boolean
public.can_provider_access_pet(p_pet_id uuid, p_scope text) returns boolean
```

These should be `security definer`, carefully written with `search_path = public`, and execute revoked from broad roles unless needed through policies.

## Pet-Owned Table Policy Pattern

For pet-scoped tables like vaccinations, medications, visits, documents, metrics:

```sql
alter table public.vaccinations enable row level security;

create policy vaccinations_read on public.vaccinations
for select using (public.can_read_pet(pet_id));

create policy vaccinations_insert on public.vaccinations
for insert with check (public.can_write_pet(pet_id, 'health_write'));

create policy vaccinations_update on public.vaccinations
for update using (public.can_write_pet(pet_id, 'health_write'))
with check (public.can_write_pet(pet_id, 'health_write'));

create policy vaccinations_delete on public.vaccinations
for delete using (public.is_pet_owner(pet_id));
```

## Profile Policy

Users can read/update own profile.

Admin/support can read limited fields through admin views, not direct broad table exposure unless audited.

## Co-owner Policy

- Owner can invite, update, revoke co-owners.
- Co-owner can view their own membership record.
- Only owner can transfer ownership or delete pet.

## Documents Policy

Documents are sensitive.

- Owner/co-owner read depending on permission.
- Provider read only via grant.
- Public read only through public share RPC or signed storage URL generated server-side.
- Financial fields can be hidden from co-owners/provider links based on scope.

## Public Shares Policy

Direct table access:

- Owner can manage shares for own pet.
- Public cannot select from `public_shares` directly.

Public access:

- `get_public_pet_details(token)` validates token and returns filtered JSON.

Store:

- token hash, not plaintext token.
- expiry.
- revoked state.
- max views.
- scope.

## Provider Access Policy

`professional_access_grants` fields:

- `pet_id`
- `provider_id`
- `granted_by`
- `scope`
- `expires_at`
- `revoked_at`

Provider can read only if:

- grant exists.
- grant not expired/revoked.
- requested table/field is in scope.

Write access should be more restrictive:

- Vets can create verified records only if user granted write permission.
- Provider-written records should include `source = 'provider'`, `provider_id`, and `verification_status`.

## Audit Logging

Audit these events:

- public share viewed.
- public share created/revoked.
- provider access granted/revoked.
- provider accesses document/passport.
- admin reads/updates user/pet/provider.
- account data export/delete.
- AI extraction confirmed into medical record.

## Service-Only Tables

No direct client policies:

- `mail_queue`
- `ai_usage_logs` insert/update internals
- `ocr_jobs` worker fields
- `payment_events`
- webhook event tables

## Privacy/GDPR Tables

Need:

- `user_consents`
- `data_export_requests`
- `deletion_requests`
- `audit_logs`

Account deletion behavior:

- Soft-delete period optional.
- Cascade pet data when legally allowed.
- Preserve anonymized billing/audit records where required.

## Storage Security

Buckets:

- `avatars`: public read, owner write.
- `user-photos`: public read, owner write.
- `pet-photos`: public read, owner/co-owner write.
- `pet-documents`: private; signed URL through server/RPC only.
- `provider-documents`: private.

Never make all documents public just because passport sharing exists.
