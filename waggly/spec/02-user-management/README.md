# 02 - User Management

This section specifies all aspects of user accounts, authentication, roles, permissions, and profile management within the Waggly platform.

---

## Documents in This Section

| Document | Description |
|----------|-------------|
| [user-roles-prd.md](./user-roles-prd.md) | Complete PRD for all user roles and personas |
| [authentication-spec.md](./authentication-spec.md) | Authentication methods, flows, security |
| [onboarding-flow.md](./onboarding-flow.md) | New user onboarding journey |
| [permissions-matrix.md](./permissions-matrix.md) | Role-based access control specification |
| [profile-management.md](./profile-management.md) | User settings and preferences |
| [database-schema.sql](./database-schema.sql) | User-related database tables |

---

## User Roles Overview

| Role | Description | Access Level |
|------|-------------|--------------|
| **Pet Owner** | Primary account holder | Full access to owned pets |
| **Co-Owner** | Invited family member/partner | Delegated access based on permissions |
| **Service Provider** | Pet sitter, walker, groomer | Limited access to shared pet profiles |
| **Veterinarian** | Licensed vet professional | Read access for patient care |
| **Platform Admin** | Waggly staff | System management |

---

## Key Metrics

- **Target Signup Conversion**: 40% of app downloads
- **Onboarding Completion**: 85%+ within first session
- **Co-Owner Invitation Rate**: 30% of users invite at least 1 co-owner
