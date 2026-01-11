**Waggli Document 7: Admin Panel & End-to-End System Roles**

---

### Admin Panel Full Specification
- Web-only, secure access with multi-factor authentication.
- Role-based segmented dashboard.
- Real-time system health overview.
- Case, user, and content moderation tools.
- Document and business profile verification.
- AI moderation dashboard with override options.
- Financial management (escrow funds, payouts, refunds).
- Integration management (services, clinics, booking systems).
- Platform configuration (languages, currencies, regional settings).
- Public-facing content management.
- Advanced analytics and reporting.
- Admin action audit logs.

---

### Admin Manages
- **Entire Platform Configuration:** Settings, UI labels, localization.
- **User Accounts & Roles:** Suspension, verification, trust scoring.
- **Case Approvals & Moderation:** Medical document checks, fraud detection.
- **Business/Non-Commercial Profiles:** Approval, verification, management.
- **Partners & Sponsors:** Onboarding, promotion, visibility.
- **Community Features:** Group approvals, content moderation.
- **Financial Operations:** Donation flows, escrow management, reporting.
- **Integrations:** Vet systems, booking providers, external tools.
- **AI Moderation System:** Reports, flagged content review, overrides.
- **Content Management:** FAQs, guides, promotional content.

---

### Role Definitions
- **Pet Owner:**
  - Create help requests.
  - Donate to others.
  - Register as a blood donor.
  - Become a verified service provider (optional).

- **Private Individual (Non-Owner):**
  - Donate, join communities, volunteer.
  - Limited help request capabilities.

- **Business:**
  - Verified profiles for clinics, pet stores, groomers.
  - Service listings, bookings, reviews.
  - Community participation.

- **Non-Commercial:**
  - Shelters, volunteers, organizations.
  - Create help requests for animals in care.
  - Community collaboration.

- **Sponsors & Partners:**
  - Public profiles.
  - Financial or service contributions.
  - Promotional visibility.

- **Admin:**
  - Full oversight and system control.
  - Content, user, financial, and integration management.

---

### Role-Based Access & Permissions Matrix
| Action                                | Guest | Pet Owner | Non-Owner | Business | Non-Commercial | Sponsor | Admin |
|---------------------------------------|-------|------------|------------|----------|-----------------|---------|-------|
| Browse Cases                          | ✔     | ✔          | ✔          | ✔        | ✔               | ✔       | ✔     |
| Create Help Request                   | ✖     | ✔          | ✖          | ✖        | ✔               | ✖       | ✔     |
| Donate to Cases                       | ✖     | ✔          | ✔          | ✔        | ✔               | ✔       | ✔     |
| Register as Blood Donor               | ✖     | ✔          | ✖          | ✖        | ✖               | ✖       | ✔     |
| Join Groups & Communities             | ✖     | ✔          | ✔          | ✔        | ✔               | ✔       | ✔     |
| Post Comments & Messages              | ✖     | ✔          | ✔          | ✔        | ✔               | ✔       | ✔     |
| Access Service Marketplace            | ✖     | ✔          | ✔          | ✔        | ✔               | ✔       | ✔     |
| Create Business/Org Profile           | ✖     | ✖          | ✖          | ✔        | ✔               | ✖       | ✔     |
| Offer Services or Bookings            | ✖     | ✔ (if verified) | ✖     | ✔        | ✖               | ✖       | ✔     |
| Become Sponsor/Partner                | ✖     | ✖          | ✖          | ✔        | ✔               | ✔       | ✔     |
| Access Admin Panel                    | ✖     | ✖          | ✖          | ✖        | ✖               | ✖       | ✔     |
| Moderate Content, Cases, & Users      | ✖     | ✖          | ✖          | ✖        | ✖               | ✖       | ✔     |
| Financial Oversight & Escrow Control  | ✖     | ✖          | ✖          | ✖        | ✖               | ✖       | ✔     |
| Manage Technical Integrations         | ✖     | ✖          | ✖          | ✖        | ✖               | ✖       | ✔     |
| AI Moderation Tool Access             | ✖     | ✖          | ✖          | ✖        | ✖               | ✖       | ✔     |
| Platform-Wide Configuration Access    | ✖     | ✖          | ✖          | ✖        | ✖               | ✖       | ✔     |

---

### End-to-End User Journeys for All Roles
- Guest: Browse, register prompts.
- Pet Owner: Full platform participation.
- Donor/Helper: Case discovery, donations, community involvement.
- Blood Donor: Registration, matching, appointments.
- Business/Partner: Profile management, service offerings.
- Non-Commercial: Animal care cases, collaboration.
- Admin: System-wide management and oversight.

### Role Evolution Possibilities
- Pet Owners can evolve into:
  - Verified blood donors.
  - Verified service providers.
  - Community moderators (future feature).
- Business/Non-Commercial roles evolve post-verification.
- Sponsors can upgrade visibility with contributions.

### Audit Trails & Admin Action Logging
- Every critical admin action logged with timestamp and user ID.
- Role changes, approvals, bans, and fund movements tracked.
- AI moderation decisions traceable.

---

*The Waggli admin panel ensures full platform oversight while supporting scalable, transparent, and role-appropriate participation for all user groups.*

