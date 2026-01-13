# User Roles - Product Requirements Document

## Overview

This document defines all user roles within the Waggly platform, including their personas, permissions, user journeys, and feature access.

---

## 1. Pet Owner (Primary User)

### Persona

| Attribute | Details |
|-----------|---------|
| **Name** | Sarah, 34 |
| **Location** | Amsterdam, Netherlands |
| **Pets** | 2 dogs (Golden Retriever, Labrador) |
| **Tech Savvy** | High - uses apps for everything |
| **Pet Attitude** | Considers pets as family members |
| **Pain Points** | Scattered records, missed appointments, no emergency info |

### User Stories

```gherkin
Feature: Pet Owner Core Functionality

Scenario: Register new account
  As a pet owner
  I want to create an account with email or social login
  So that I can start tracking my pet's health

Scenario: Add first pet
  As a pet owner
  I want to add my pet through a simple wizard
  So that I can create their digital health passport

Scenario: Log vaccination
  As a pet owner
  I want to record my pet's vaccination
  So that I have a complete immunization history

Scenario: Invite co-owner
  As a pet owner
  I want to invite my partner to co-manage our pets
  So that we can both update and view health records

Scenario: Share with vet
  As a pet owner
  I want to share my pet's passport with the vet before an appointment
  So that they have complete health history

Scenario: Emergency QR access
  As a pet owner
  I want anyone who finds my lost pet to scan a QR tag
  So that they can contact me and access emergency health info
```

### Feature Access

| Feature | Access Level |
|---------|--------------|
| Create/edit own profile | Full |
| Add/manage pets | Full |
| Log health records | Full |
| Upload documents | Full |
| Invite co-owners | Full |
| Create sharing links | Full |
| Manage subscriptions | Full |
| Access AI features | Based on subscription |
| Social network posting | Full |

---

## 2. Co-Owner

### Persona

| Attribute | Details |
|-----------|---------|
| **Name** | Michael, 36 |
| **Relationship** | Sarah's partner |
| **Role** | Secondary caregiver |
| **Needs** | View and update pet health when Sarah is unavailable |

### User Stories

```gherkin
Feature: Co-Owner Functionality

Scenario: Accept invitation
  As a co-owner invitee
  I want to accept a co-owner invitation via email link
  So that I can access shared pet profiles

Scenario: View pet health
  As a co-owner
  I want to view all health records for shared pets
  So that I can stay informed about their health

Scenario: Log vet visit
  As a co-owner with edit permissions
  I want to log a vet visit
  So that health records stay current even when the owner is away

Scenario: Receive notifications
  As a co-owner
  I want to receive reminder notifications
  So that I can help ensure pets get timely care
```

### Permission Levels

| Permission | View Only | Edit Health | Full Access |
|------------|:---------:|:-----------:|:-----------:|
| View pet profile | ✅ | ✅ | ✅ |
| View health records | ✅ | ✅ | ✅ |
| Add health records | ❌ | ✅ | ✅ |
| Edit health records | ❌ | ✅ | ✅ |
| Upload documents | ❌ | ✅ | ✅ |
| Create sharing links | ❌ | ❌ | ✅ |
| Invite other co-owners | ❌ | ❌ | ✅ |
| Delete pet | ❌ | ❌ | ❌ |

---

## 3. Service Provider (Future - Phase 5)

### Persona

| Attribute | Details |
|-----------|---------|
| **Name** | Lisa, 28 |
| **Profession** | Professional dog walker |
| **Business** | Solo operation, 15 regular clients |
| **Needs** | Care instructions, emergency contacts, scheduling |

### User Stories

```gherkin
Feature: Service Provider Functionality

Scenario: View shared pet info
  As a pet sitter
  I want to view care instructions and emergency contacts
  So that I can provide proper care during the owner's absence

Scenario: Log activity
  As a dog walker
  I want to log walk details (duration, distance, notes)
  So that owners can see what happened during the walk

Scenario: Access emergency info
  As a pet sitter
  I want immediate access to vet contacts and allergies
  So that I can respond quickly to emergencies
```

### Feature Access

| Feature | Access Level |
|---------|--------------|
| View assigned pet profiles | Time-limited |
| View care instructions | Read-only |
| Log activities/notes | Write |
| View full health history | Based on owner settings |
| Upload photos | Write |
| Access emergency contacts | Read-only |

---

## 4. Veterinarian (Future - Phase 4)

### Persona

| Attribute | Details |
|-----------|---------|
| **Name** | Dr. van den Berg |
| **Specialty** | Small animal general practice |
| **Clinic** | AniCura Amsterdam |
| **Needs** | Patient history before appointments, streamlined records |

### User Stories

```gherkin
Feature: Veterinarian Functionality

Scenario: Access patient history
  As a veterinarian
  I want to view a pet's complete health history before an appointment
  So that I can provide informed care

Scenario: Update vaccination record
  As a veterinarian
  I want to add vaccination records directly to the pet's passport
  So that records are immediately available to the owner

Scenario: Send prescription digitally
  As a veterinarian
  I want to send prescriptions through the app
  So that owners have a permanent digital record
```

### Feature Access

| Feature | Access Level |
|---------|--------------|
| View patient profiles | When shared by owner |
| View full health history | When shared by owner |
| Add medical records | With owner approval |
| Add prescriptions | Direct write |
| Send messages to owners | Direct |
| Access analytics (B2B) | Clinic subscription |

---

## 5. Platform Administrator

### Persona

| Attribute | Details |
|-----------|---------|
| **Name** | Waggly Support Team |
| **Role** | Platform operations |
| **Responsibilities** | User support, content moderation, system health |

### User Stories

```gherkin
Feature: Admin Functionality

Scenario: Handle support ticket
  As a platform admin
  I want to view user issues and respond to tickets
  So that users get timely support

Scenario: Moderate content
  As a content moderator
  I want to review flagged social posts
  So that the community stays safe and welcoming

Scenario: Monitor system health
  As a platform admin
  I want to view system metrics and alerts
  So that I can ensure platform reliability
```

### Feature Access

| Feature | Access Level |
|---------|--------------|
| User account management | Full |
| Content moderation | Full |
| System configuration | Role-based |
| Analytics dashboard | Full |
| Support ticket management | Full |
| Subscription management | Full |

---

## Acceptance Criteria

### User Registration
- [ ] Users can register with email/password
- [ ] Users can register with Google OAuth
- [ ] Users can register with Apple Sign-In
- [ ] Email verification is required
- [ ] Password meets security requirements (8+ chars, mixed case, number)

### Role Assignment
- [ ] New users default to Pet Owner role
- [ ] Co-owners are invited by email
- [ ] Service providers register through separate flow
- [ ] Veterinarians require verification process
- [ ] Admins are assigned by existing admins only

### Permission Enforcement
- [ ] All API endpoints validate user permissions
- [ ] Row Level Security (RLS) enforces data access
- [ ] Permission changes take effect immediately
- [ ] Audit logs capture permission-related actions
