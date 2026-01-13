# Permissions Matrix

## Overview

This document defines the complete role-based access control (RBAC) system for Waggly, specifying what actions each user role can perform on each resource.

---

## Permission Levels

| Level | Symbol | Description |
|-------|--------|-------------|
| None | ❌ | No access |
| Read | 👁️ | View only |
| Write | ✏️ | Create and edit |
| Full | ✅ | All operations including delete |
| Admin | 🔑 | System administration |

---

## Resource Permissions Matrix

### User Account Resources

| Resource | Pet Owner | Co-Owner | Service Provider | Vet | Admin |
|----------|:---------:|:--------:|:----------------:|:---:|:-----:|
| Own profile | ✅ | ✅ | ✅ | ✅ | 🔑 |
| Other profiles | ❌ | ❌ | ❌ | ❌ | 👁️ |
| Account settings | ✅ | ✅ | ✅ | ✅ | 🔑 |
| Subscription management | ✅ | ❌ | ✅ | ✅ | 🔑 |
| Delete account | ✅ | ✅ | ✅ | ✅ | 🔑 |

### Pet Resources

| Resource | Pet Owner | Co-Owner (Full) | Co-Owner (Edit) | Co-Owner (View) | Service Provider |
|----------|:---------:|:---------------:|:---------------:|:---------------:|:----------------:|
| Create pet | ✅ | ❌ | ❌ | ❌ | ❌ |
| View pet profile | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| Edit pet basic info | ✅ | ✅ | ✏️ | ❌ | ❌ |
| Add pet photo | ✅ | ✅ | ✏️ | ❌ | ✏️ |
| Delete pet | ✅ | ❌ | ❌ | ❌ | ❌ |
| Archive pet | ✅ | ✅ | ❌ | ❌ | ❌ |

### Health Records

| Resource | Pet Owner | Co-Owner (Full) | Co-Owner (Edit) | Co-Owner (View) | Vet (Shared) |
|----------|:---------:|:---------------:|:---------------:|:---------------:|:------------:|
| View vaccinations | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| Add vaccination | ✅ | ✅ | ✏️ | ❌ | ✏️ |
| Edit vaccination | ✅ | ✅ | ✏️ | ❌ | ❌ |
| Delete vaccination | ✅ | ✅ | ❌ | ❌ | ❌ |
| View treatments | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| Add treatment | ✅ | ✅ | ✏️ | ❌ | ✏️ |
| View visits | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| Add visit | ✅ | ✅ | ✏️ | ❌ | ✏️ |
| View health metrics | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| Add health metric | ✅ | ✅ | ✏️ | ❌ | ❌ |

### Documents

| Resource | Pet Owner | Co-Owner (Full) | Co-Owner (Edit) | Co-Owner (View) |
|----------|:---------:|:---------------:|:---------------:|:---------------:|
| View documents | ✅ | ✅ | ✅ | 👁️ |
| Upload document | ✅ | ✅ | ✏️ | ❌ |
| Download document | ✅ | ✅ | ✅ | 👁️ |
| Delete document | ✅ | ✅ | ❌ | ❌ |

### Sharing & Access Control

| Resource | Pet Owner | Co-Owner (Full) | Co-Owner (Edit) | Co-Owner (View) |
|----------|:---------:|:---------------:|:---------------:|:---------------:|
| View co-owners | ✅ | ✅ | 👁️ | 👁️ |
| Invite co-owner | ✅ | ✅ | ❌ | ❌ |
| Remove co-owner | ✅ | ❌ | ❌ | ❌ |
| Create sharing link | ✅ | ✅ | ❌ | ❌ |
| Revoke sharing link | ✅ | ✅ | ❌ | ❌ |
| View sharing history | ✅ | ✅ | 👁️ | ❌ |

### Social Network

| Resource | Pet Owner | Co-Owner | Service Provider | Admin |
|----------|:---------:|:--------:|:----------------:|:-----:|
| Create post | ✅ | ✅ | ✅ | 🔑 |
| Edit own post | ✅ | ✅ | ✅ | 🔑 |
| Delete own post | ✅ | ✅ | ✅ | 🔑 |
| Delete any post | ❌ | ❌ | ❌ | 🔑 |
| Create group | ✅ | ✅ | ✅ | 🔑 |
| Moderate group | ✅* | ✅* | ✅* | 🔑 |
| Report content | ✅ | ✅ | ✅ | 🔑 |

*Only for groups they created/admin

---

## Co-Owner Permission Presets

### View Only
Best for: Extended family, curious relatives

| Capability | Allowed |
|------------|---------|
| View pet profiles | ✅ |
| View health records | ✅ |
| View documents | ✅ |
| Receive notifications | ✅ |
| Add or edit anything | ❌ |

### Edit Health
Best for: Active caregivers, pet sitters

| Capability | Allowed |
|------------|---------|
| All View Only permissions | ✅ |
| Add health records | ✅ |
| Edit health records | ✅ |
| Upload documents | ✅ |
| Add photos | ✅ |

### Full Access
Best for: Partners, spouses, primary co-caregivers

| Capability | Allowed |
|------------|---------|
| All Edit Health permissions | ✅ |
| Invite other co-owners | ✅ |
| Create sharing links | ✅ |
| Manage pet settings | ✅ |
| Delete records | ✅ |
| Delete pet | ❌ |

---

## Permission Inheritance

```
Pet Owner (100% permissions)
    │
    ├── Co-Owner Full Access (90%)
    │       │
    │       └── Co-Owner Edit Health (60%)
    │               │
    │               └── Co-Owner View Only (30%)
    │
    └── Temporary Share Link
            │
            ├── Emergency Access (emergency info only)
            ├── Vet Access (full health read)
            └── Sitter Access (care info + notes)
```

---

## API Permission Enforcement

### Supabase RLS Policies

```sql
-- Pet access policy
CREATE POLICY "pet_access_policy" ON pets
FOR ALL USING (
  -- Owner has full access
  auth.uid() = user_id
  OR
  -- Co-owners based on permission level
  EXISTS (
    SELECT 1 FROM co_owners
    WHERE co_owners.pet_id = pets.id
    AND co_owners.user_id = auth.uid()
    AND co_owners.status = 'accepted'
  )
);

-- Health records write policy
CREATE POLICY "health_records_write_policy" ON vaccinations
FOR INSERT WITH CHECK (
  -- Owner can always insert
  EXISTS (
    SELECT 1 FROM pets
    WHERE pets.id = vaccinations.pet_id
    AND pets.user_id = auth.uid()
  )
  OR
  -- Co-owners with edit or full permission
  EXISTS (
    SELECT 1 FROM co_owners
    WHERE co_owners.pet_id = vaccinations.pet_id
    AND co_owners.user_id = auth.uid()
    AND co_owners.permission_level IN ('edit', 'full')
    AND co_owners.status = 'accepted'
  )
);
```

### Permission Check Function

```typescript
type Permission = 'view' | 'edit' | 'full' | 'admin';

async function checkPermission(
  userId: string,
  petId: string,
  requiredLevel: Permission
): Promise<boolean> {
  // Check if owner
  const { data: pet } = await supabase
    .from('pets')
    .select('user_id')
    .eq('id', petId)
    .single();
  
  if (pet?.user_id === userId) return true;
  
  // Check co-owner permissions
  const { data: coOwner } = await supabase
    .from('co_owners')
    .select('permission_level')
    .eq('pet_id', petId)
    .eq('user_id', userId)
    .eq('status', 'accepted')
    .single();
  
  const levels: Permission[] = ['view', 'edit', 'full', 'admin'];
  const requiredIndex = levels.indexOf(requiredLevel);
  const actualIndex = levels.indexOf(coOwner?.permission_level || 'view');
  
  return actualIndex >= requiredIndex;
}
```

---

## Audit Trail

All permission-related actions are logged:

| Event | Data Logged |
|-------|-------------|
| Permission granted | Grantor, grantee, permission level, pet |
| Permission revoked | Revoker, revokee, previous level, pet |
| Access attempt | User, resource, action, allowed/denied |
| Sharing link created | Creator, link ID, permissions, expiry |
| Sharing link accessed | Link ID, accessor IP, timestamp |
