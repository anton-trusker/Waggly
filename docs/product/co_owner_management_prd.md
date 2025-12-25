# Co-Owner Management - Full Product Requirements Document (PRD)

## Document Information
| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Last Updated** | 2025-12-25 |
| **Status** | Draft |
| **Owner** | Pawzly Product Team |

---

## 1. Executive Summary

### 1.1 Purpose
This PRD defines the complete specification for the Co-Owner Management feature in Pawzly, enabling pet owners to invite and manage co-owners who share responsibility for pet care. Co-owners receive controlled access to pet profiles, health records, and care management tools.

### 1.2 Problem Statement
Pet care is often a shared responsibility between family members, partners, roommates, or caregivers. Currently, users cannot:
- Share pet profiles with other registered users
- Delegate specific permissions to different people
- Track who has access to their pet's information
- Manage multiple co-ownership relationships

### 1.3 Solution Overview
A comprehensive co-owner management system that allows:
- **Inviting** new co-owners via email
- **Assigning** specific pets to each co-owner
- **Configuring** granular permission levels
- **Managing** all co-ownership relationships from a central hub
- **Tracking** invitation status and access history

---

## 2. User Personas

### 2.1 Primary Persona: Pet Owner (Inviter)
| Attribute | Details |
|-----------|---------|
| **Description** | Registered Pawzly user who owns/manages pet profiles |
| **Goals** | Share pet care responsibilities, maintain control over data |
| **Pain Points** | Managing multiple caregivers, ensuring everyone has needed info |
| **Key Actions** | Send invitations, assign pets, set permissions, revoke access |

### 2.2 Secondary Persona: Co-Owner (Invitee)
| Attribute | Details |
|-----------|---------|
| **Description** | Person invited to co-manage one or more pets |
| **Goals** | Access pet information, contribute to care |
| **Pain Points** | Limited access to pet data, coordination with owner |
| **Key Actions** | Accept/decline invitations, view pet profiles, add records |

---

## 3. User Stories & Acceptance Criteria

### 3.1 Invitation Stories

#### US-001: Send Co-Owner Invitation
**As a** pet owner,  
**I want to** invite someone to be a co-owner of my pets,  
**So that** they can help manage pet care.

**Acceptance Criteria:**
- [ ] Can enter invitee's email address
- [ ] Can select which pets to share (multi-select)
- [ ] Can set permission level (View Only, Can Edit, Full Access)
- [ ] System validates email format before sending
- [ ] Invitation email is sent with accept/decline link
- [ ] Invitation appears in "Sent Invitations" list
- [ ] Duplicate invitations to same email are blocked

#### US-002: Receive and Accept Invitation
**As a** prospective co-owner,  
**I want to** review and accept co-owner invitations,  
**So that** I can access shared pet profiles.

**Acceptance Criteria:**
- [ ] Email contains clear accept/decline buttons
- [ ] If registered: Invitation appears in "Received Invitations" tab
- [ ] If not registered: Redirected to signup, then invitation links
- [ ] Can view inviter's name and shared pets before accepting
- [ ] Accepting adds pets to my profile with granted permissions
- [ ] Declining removes invitation from both sides

#### US-003: Decline Invitation
**As a** prospective co-owner,  
**I want to** decline an invitation I don't want,  
**So that** I don't receive unwanted access.

**Acceptance Criteria:**
- [ ] Can decline from email link
- [ ] Can decline from in-app "Received Invitations"
- [ ] Owner is notified of declined invitation
- [ ] Declined invitation is removed from both users' views

### 3.2 Management Stories

#### US-004: View Sent Invitations
**As a** pet owner,  
**I want to** see all invitations I've sent,  
**So that** I can track their status.

**Acceptance Criteria:**
- [ ] List shows all sent invitations
- [ ] Each entry displays: recipient email, pets shared, status, date sent
- [ ] Status options: Pending, Accepted, Declined, Expired, Revoked
- [ ] Can filter by status
- [ ] Can sort by date or recipient

#### US-005: Revoke Co-Owner Access
**As a** pet owner,  
**I want to** revoke someone's co-owner access,  
**So that** they can no longer see my pet's information.

**Acceptance Criteria:**
- [ ] Can revoke from "Sent Invitations" or active co-owners list
- [ ] Confirmation dialog before revoking
- [ ] Revoked user immediately loses access to all shared pets
- [ ] Revoked user is notified via email
- [ ] Record of revocation maintained for audit

#### US-006: Edit Co-Owner Permissions
**As a** pet owner,  
**I want to** change a co-owner's permissions after they've accepted,  
**So that** I can adjust their access level.

**Acceptance Criteria:**
- [ ] Can modify permission level (View/Edit/Full)
- [ ] Can add/remove specific pets from sharing
- [ ] Changes take effect immediately
- [ ] Co-owner is notified of permission changes

#### US-007: View Received Invitations
**As a** potential co-owner,  
**I want to** see all pending invitations,  
**So that** I can decide which to accept.

**Acceptance Criteria:**
- [ ] List shows all pending invitations
- [ ] Each entry shows: inviter name, pets being shared, permission level
- [ ] Can accept or decline each invitation
- [ ] Expired invitations shown separately or hidden

---

## 4. Functional Requirements

### 4.1 Co-Owner Management Hub

**Location:** Settings → Co-Owner Management

**Components:**

| Component | Description |
|-----------|-------------|
| **Tab Navigation** | "Invite New", "Sent Invitations", "Received Invitations" |
| **Invite Panel** | Email input, pet selector, permission picker |
| **Sent List** | Table/cards of all sent invitations with actions |
| **Received List** | Cards of pending invitations with Accept/Decline |

**Invite New Panel Fields:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Email Address | Email input | Yes | Valid email format |
| Pets to Share | Multi-select chips | Yes (min 1) | At least one pet selected |
| Permission Level | Radio/Select | Yes | Default: View Only |
| Custom Message | Textarea | No | Max 500 characters |

**Permission Levels:**

| Level | Permissions |
|-------|-------------|
| **View Only** | View profile, medical records, documents (read-only) |
| **Can Edit** | View Only + add health logs, photos, notes |
| **Full Access** | Can Edit + edit profile, add records, manage appointments |

### 4.2 Invitation System

**Email Invitation Flow:**
```mermaid
sequenceDiagram
    participant Owner as Pet Owner
    participant API as Backend API
    participant Email as Email Service
    participant Invitee as Invitee
    participant App as Pawzly App

    Owner->>API: Send Invitation
    API->>API: Create invitation record
    API->>Email: Send invitation email
    Email->>Invitee: Deliver email
    Invitee->>App: Click Accept Link
    App->>API: Validate invitation token
    API->>API: Check if user exists
    alt User Registered
        API->>App: Redirect to app (invitation accepted)
        App->>Invitee: Show success, pets now visible
    else User Not Registered
        API->>App: Redirect to signup
        App->>Invitee: Complete registration
        App->>API: Create user + accept invitation
    end
    API->>Owner: Send notification (accepted)
```

**Invitation Data Model:**

```typescript
interface Invitation {
  id: string;                    // UUID
  inviter_id: string;           // User ID of pet owner
  invitee_email: string;        // Email of invitee
  invitee_id: string | null;    // User ID if registered
  status: InvitationStatus;
  permission_level: PermissionLevel;
  pet_ids: string[];            // Array of shared pet IDs
  custom_message: string | null;
  token: string;                // Unique secure token
  created_at: Date;
  expires_at: Date;             // 7 days from creation
  accepted_at: Date | null;
  revoked_at: Date | null;
}

type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked';
type PermissionLevel = 'view_only' | 'can_edit' | 'full_access';
```

### 4.3 Co-Owner Relationship

**Active Co-Owner Data Model:**

```typescript
interface CoOwner {
  id: string;                    // UUID
  owner_id: string;             // Original pet owner
  co_owner_id: string;          // The co-owner user
  permission_level: PermissionLevel;
  pet_ids: string[];            // Shared pets
  granted_at: Date;
  last_accessed_at: Date | null;
  is_active: boolean;
}
```

**Permission Matrix:**

| Action | View Only | Can Edit | Full Access |
|--------|-----------|----------|-------------|
| View pet profile | ✅ | ✅ | ✅ |
| View medical records | ✅ | ✅ | ✅ |
| View documents | ✅ | ✅ | ✅ |
| Add photos | ❌ | ✅ | ✅ |
| Add health logs | ❌ | ✅ | ✅ |
| Add notes | ❌ | ✅ | ✅ |
| Edit pet profile | ❌ | ❌ | ✅ |
| Add medical visits | ❌ | ❌ | ✅ |
| Manage appointments | ❌ | ❌ | ✅ |
| Invite other co-owners | ❌ | ❌ | ❌ |
| Delete pet | ❌ | ❌ | ❌ |

---

## 5. Database Schema

### 5.1 Tables

#### `co_owner_invitations`
```sql
CREATE TABLE co_owner_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES auth.users(id) NOT NULL,
  invitee_email TEXT NOT NULL,
  invitee_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'revoked')),
  permission_level TEXT NOT NULL DEFAULT 'view_only'
    CHECK (permission_level IN ('view_only', 'can_edit', 'full_access')),
  pet_ids UUID[] NOT NULL,
  custom_message TEXT,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_invitations_inviter ON co_owner_invitations(inviter_id);
CREATE INDEX idx_invitations_invitee ON co_owner_invitations(invitee_email);
CREATE INDEX idx_invitations_token ON co_owner_invitations(token);
CREATE INDEX idx_invitations_status ON co_owner_invitations(status);
```

#### `co_owners`
```sql
CREATE TABLE co_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  co_owner_id UUID REFERENCES auth.users(id) NOT NULL,
  invitation_id UUID REFERENCES co_owner_invitations(id),
  permission_level TEXT NOT NULL DEFAULT 'view_only'
    CHECK (permission_level IN ('view_only', 'can_edit', 'full_access')),
  is_active BOOLEAN DEFAULT true,
  granted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_accessed_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  
  UNIQUE(owner_id, co_owner_id)
);

CREATE INDEX idx_co_owners_owner ON co_owners(owner_id);
CREATE INDEX idx_co_owners_co_owner ON co_owners(co_owner_id);
```

#### `co_owner_pets` (Junction Table)
```sql
CREATE TABLE co_owner_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  co_owner_relationship_id UUID REFERENCES co_owners(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(co_owner_relationship_id, pet_id)
);

CREATE INDEX idx_co_owner_pets_relationship ON co_owner_pets(co_owner_relationship_id);
CREATE INDEX idx_co_owner_pets_pet ON co_owner_pets(pet_id);
```

### 5.2 Row Level Security (RLS)

```sql
-- Invitations: Owner can see all their sent invitations
CREATE POLICY "Users can view their sent invitations" 
  ON co_owner_invitations FOR SELECT
  USING (inviter_id = auth.uid());

-- Invitations: Invitee can see invitations addressed to their email
CREATE POLICY "Users can view their received invitations"
  ON co_owner_invitations FOR SELECT
  USING (
    invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR invitee_id = auth.uid()
  );

-- Co-owners: Owner can manage their co-owner relationships
CREATE POLICY "Owners can manage their co-owners"
  ON co_owners FOR ALL
  USING (owner_id = auth.uid());

-- Co-owners: Co-owner can view their relationships
CREATE POLICY "Co-owners can view their access"
  ON co_owners FOR SELECT
  USING (co_owner_id = auth.uid());
```

---

## 6. API Endpoints

### 6.1 Invitation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/invitations` | POST | Create new invitation |
| `/invitations` | GET | List all invitations (sent + received) |
| `/invitations/sent` | GET | List sent invitations |
| `/invitations/received` | GET | List received invitations |
| `/invitations/:id` | GET | Get invitation details |
| `/invitations/:id/accept` | POST | Accept invitation |
| `/invitations/:id/decline` | POST | Decline invitation |
| `/invitations/:id/revoke` | POST | Revoke sent invitation |
| `/invitations/:id/resend` | POST | Resend invitation email |

### 6.2 Co-Owner Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/co-owners` | GET | List all co-owners (as owner or co-owner) |
| `/co-owners/:id` | GET | Get co-owner relationship details |
| `/co-owners/:id` | PATCH | Update permissions/pets |
| `/co-owners/:id` | DELETE | Remove co-owner access |
| `/co-owners/:id/pets` | GET | List shared pets for co-owner |
| `/co-owners/:id/pets` | PUT | Update shared pets list |

### 6.3 Request/Response Examples

**Create Invitation:**
```json
// POST /invitations
{
  "email": "jane.doe@example.com",
  "pet_ids": ["uuid-pet-1", "uuid-pet-2"],
  "permission_level": "can_edit",
  "message": "Please help me manage Buddy and Max!"
}

// Response 201
{
  "id": "uuid-invitation",
  "status": "pending",
  "expires_at": "2025-01-01T00:00:00Z"
}
```

**Accept Invitation:**
```json
// POST /invitations/:id/accept
{}

// Response 200
{
  "co_owner_id": "uuid-co-owner-relationship",
  "pets": [
    { "id": "uuid-pet-1", "name": "Buddy" },
    { "id": "uuid-pet-2", "name": "Max" }
  ]
}
```

---

## 7. UI/UX Specifications

### 7.1 Navigation

**Entry Points:**
- Settings → "Co-Owner Management" menu item
- Pet Profile → "Share" button (links to sharing hub)
- Notification badge when new invitations received

### 7.2 Co-Owner Management Hub

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← Co-Owner Management                           [?]    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────────────┐ ┌─────────────────┐  │
│  │ Invite   │ │ Sent Invitations │ │ Received        │  │
│  │ New      │ │ (3)              │ │ (1)             │  │
│  └──────────┘ └──────────────────┘ └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Content area based on selected tab]                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Invite New Tab:**
```
┌─────────────────────────────────────────────────────────┐
│  Invite a Co-Owner                                      │
│                                                         │
│  Email Address *                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ jane.doe@example.com                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Select Pets to Share *                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐            │
│  │ 🐕 Buddy  │ │ 🐱 Whiskers│ │ 🐰 Fluffy  │           │
│  │   [✓]     │ │   [✓]     │ │   [ ]     │            │
│  └───────────┘ └───────────┘ └───────────┘            │
│                                                         │
│  Permission Level *                                     │
│  ○ View Only - Can view all pet information            │
│  ● Can Edit - Can add photos, logs, and notes          │
│  ○ Full Access - Can edit profile and add records      │
│                                                         │
│  Personal Message (Optional)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Hey! Can you help me track Buddy's meds?        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                          [ Cancel ] [ Send Invitation ] │
└─────────────────────────────────────────────────────────┘
```

**Sent Invitations Tab:**
```
┌─────────────────────────────────────────────────────────┐
│  Sent Invitations                                       │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐
│  │ 👤 jane.doe@example.com           [Pending]     ⋮  │
│  │    🐕 Buddy, 🐱 Whiskers · Can Edit                │
│  │    Sent Dec 20, 2025 · Expires Jan 3, 2026         │
│  └─────────────────────────────────────────────────────┘
│  ┌─────────────────────────────────────────────────────┐
│  │ 👤 john.smith@example.com         [Accepted] ✓  ⋮  │
│  │    🐕 Buddy · View Only                            │
│  │    Accepted Dec 18, 2025                           │
│  └─────────────────────────────────────────────────────┘
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Received Invitations Tab:**
```
┌─────────────────────────────────────────────────────────┐
│  Received Invitations                                   │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐
│  │ 👤 Mike Wilson invites you                         │
│  │                                                     │
│  │    Pets: 🐕 Rocky                                   │
│  │    Permission: Full Access                          │
│  │    "Can you help manage Rocky while I'm away?"     │
│  │                                                     │
│  │    Expires in 5 days                                │
│  │                                                     │
│  │            [ Decline ]  [ Accept Invitation ]       │
│  └─────────────────────────────────────────────────────┘
│                                                         │
│  No more pending invitations                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Component Styling

**Status Pills:**
| Status | Background | Text Color |
|--------|------------|------------|
| Pending | `warning-100` | `warning-700` |
| Accepted | `success-100` | `success-700` |
| Declined | `neutral-100` | `neutral-700` |
| Expired | `neutral-100` | `neutral-500` |
| Revoked | `error-100` | `error-700` |

**Pet Chips:**
```tsx
// Selected state
<Chip 
  selected={true}
  icon={petEmoji}
  label={petName}
  borderColor="primary.500"
  backgroundColor="primary.50"
/>

// Unselected state
<Chip 
  selected={false}
  icon={petEmoji}
  label={petName}
  borderColor="border.primary"
  backgroundColor="background.secondary"
/>
```

---

## 8. Email Templates

### 8.1 Invitation Email

**Subject:** `[Pawzly] {inviter_name} invited you to co-manage {pet_names}`

**Body:**
```html
Hello,

{inviter_name} has invited you to help manage their pet(s) on Pawzly!

Pets being shared:
- {pet_list_with_photos}

Your access level: {permission_level_description}

{custom_message_if_present}

[Accept Invitation]  [Decline]

This invitation expires on {expiry_date}.

---
Pawzly - Your Pet Care Companion
```

### 8.2 Acceptance Notification

**Subject:** `[Pawzly] {invitee_name} accepted your co-owner invitation`

### 8.3 Decline Notification

**Subject:** `[Pawzly] {invitee_email} declined your co-owner invitation`

### 8.4 Revocation Notification

**Subject:** `[Pawzly] Your access to {pet_names} has been revoked`

---

## 9. Edge Cases & Error Handling

### 9.1 Edge Cases

| Scenario | Handling |
|----------|----------|
| Invitee already a co-owner | Show error: "This person is already a co-owner" |
| Self-invitation | Block: "You cannot invite yourself" |
| Pet deleted after invitation | Remove pet from invitation, notify if no pets left |
| Invitee deletes account | Remove from co-owners, clean up relationships |
| Owner deletes account | Cascade delete all invitations and relationships |
| Expired invitation | Show as expired, allow resend |
| Email delivery failed | Retry 3x, then mark as failed with retry option |

### 9.2 Error Messages

| Error Code | Message |
|------------|---------|
| `INVALID_EMAIL` | "Please enter a valid email address" |
| `NO_PETS_SELECTED` | "Please select at least one pet to share" |
| `ALREADY_CO_OWNER` | "This person is already a co-owner of the selected pets" |
| `INVITATION_EXPIRED` | "This invitation has expired. Please ask for a new one." |
| `INVITATION_REVOKED` | "This invitation is no longer valid." |
| `CANNOT_INVITE_SELF` | "You cannot invite yourself as a co-owner" |
| `RATE_LIMITED` | "Too many invitations sent. Please try again later." |

---

## 10. Analytics & Tracking

### 10.1 Events to Track

| Event | Properties |
|-------|------------|
| `invitation_sent` | `permission_level`, `pet_count`, `has_message` |
| `invitation_accepted` | `time_to_accept`, `inviter_id` |
| `invitation_declined` | `time_to_decline`, `inviter_id` |
| `invitation_expired` | `inviter_id`, `pet_count` |
| `co_owner_removed` | `relationship_duration`, `removal_type` |
| `permission_changed` | `old_level`, `new_level` |
| `co_owner_hub_viewed` | `tab_opened` |

### 10.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Invitation acceptance rate | >60% | Accepted / Sent |
| Time to accept | <24 hours | Median time |
| Active co-owner relationships | Growing | Monthly count |
| Co-owner engagement | >50% | Co-owners who log in weekly |
| Permission upgrades | 10% | Users who increase permissions |

---

## 11. Implementation Phases

### Phase 1: Core Invitation System (Week 1-2)
- [ ] Database schema creation
- [ ] Invitation creation API
- [ ] Email sending integration
- [ ] Accept/Decline endpoints
- [ ] Basic UI for Co-Owner Hub

### Phase 2: Management Features (Week 3-4)
- [ ] Sent/Received invitation lists
- [ ] Revoke functionality
- [ ] Permission editing
- [ ] Pet assignment changes
- [ ] Expiration handling

### Phase 3: Integration & Polish (Week 5)
- [ ] Settings menu integration
- [ ] Notification system
- [ ] Email templates
- [ ] Error handling
- [ ] Analytics integration

### Phase 4: Testing & Launch (Week 6)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Bug fixes
- [ ] Production deployment

---

## 12. Dependencies

### 12.1 Technical Dependencies
- Email service (SendGrid/Resend)
- Push notification service
- Supabase Auth
- Existing user profile system
- Existing pet management system

### 12.2 Team Dependencies
- Backend: API development
- Frontend: React Native UI
- Design: Component specs
- QA: Test plans

---

## 13. Open Questions

1. **Invitation limit**: Should we limit invitations per day/month?
2. **Co-owner limit per pet**: Maximum number of co-owners?
3. **Transfer ownership**: Can a co-owner become the primary owner?
4. **Activity feed**: Should co-owners see each others' activities?
5. **Offline access**: How should shared pets work offline?

---

## 14. Appendix

### 14.1 Glossary

| Term | Definition |
|------|------------|
| **Pet Owner** | The user who created/owns the pet profile |
| **Co-Owner** | A user granted shared access to a pet |
| **Invitation** | A pending request to become a co-owner |
| **Permission Level** | The access rights granted to a co-owner |

### 14.2 Related Documents

- [Sharing Features PRD](./sharing_features_prd.md) - Parent document
- [Design System](../../constants/designSystem.ts) - UI specifications
- [Database Schema](../../supabase/migrations/) - Schema reference

---

**Document End**
