# 01 - Documentation Review

## What The Platform Is Supposed To Be

The documentation describes Waggli as an AI-first digital pet passport and all-in-one pet care operating system for Europe. The product is not only a health tracker. It is intended to become:

- A digital pet identity and passport system.
- A system of record for pet health across the pet lifetime.
- A document/OCR ingestion platform.
- A reminder and calendar engine for pet care.
- A collaboration layer for families, co-owners, vets, and providers.
- An AI assistant for zero-friction data entry and health guidance.
- A provider ecosystem for vets, groomers, trainers, sitters, walkers, boarding, and insurance.
- A future community/social network.
- A subscription and partnership business.
- An admin-operated, GDPR-aware platform.

## Canonical Documentation Sets

### Current Specs

`documentation/spec/` is the strongest source. It contains current Waggli/Waggli platform specs covering:

- Website and beta program.
- Platform vision and market opportunity.
- Authentication, profiles, roles, onboarding.
- Pet registration, breed data, identification, physical measurements.
- Health records: visits, vaccines, medications, allergies, metrics.
- Digital pet passport, health score, EU travel compliance.
- Documents, OCR, and secure document sharing.
- Calendar, reminders, smart notifications.
- AI assistant, OCR, NLP entry, predictive insights, cost model.
- Social network.
- Sharing and collaboration.
- Monetization.
- Architecture, database, API, security, devops.
- Design system.
- Business and go-to-market.
- Providers and admin panel.

### DB Refactor Docs

`documentation/spec/db-refactor/` is highly important. It identifies the exact structural problem now visible in the app and migrations:

- Duplicate ownership models.
- Redundant owner fields in child tables.
- Inconsistent table naming.
- RLS gaps.
- Missing indexes.
- Missing behavior, lifestyle, genetics, enhanced health, calendar, AI, admin, billing, localization, provider, and notification tables.

### Older Documents

`documentation/documents/` contains valuable older product and implementation details, but many files still use Pawzly, PawHelp, PAW, or mixed terminology. These should be treated as supporting notes, not as canonical naming or architecture.

## Major Contradictions Found

### 1. Brand Name

Current code and many current specs use `Waggli`; the user direction says the new name is `Waggli`; domain is currently `https://www.waggli.app`.

Decision: use **Waggli** as canonical product/company name in new planning docs. Keep `waggli.app` only as the current public domain until domain strategy is decided.

### 2. Architecture Shape

The specs describe a future monorepo with Next.js web, Expo mobile, admin app, landing app, shared packages, and Supabase services. The current active repo is an Expo app with web support and many feature screens. There are sibling projects in the wider workspace, so the product needs a consolidation decision.

Decision: continue current Expo app for MVP, but create an explicit migration path toward the documented monorepo only after DB and domain logic stabilize.

### 3. Database Source Of Truth

The repo has old migrations, v2 migrations, generated schema experiments, and app hooks expecting different table/column names.

Decision: old migrations are historical. The new Supabase should receive a clean canonical schema, not the entire old migration chain.

### 4. Pet Ownership Model

Docs and older generated types use `pets.user_id`; some newer code/hooks use `owner_id`; db-refactor docs discuss redundant ownership fields.

Decision: canonical ownership root is `pets.user_id`. Child records should use `pet_id`; RLS derives ownership through the pet.

### 5. Health Score Formula

Different docs weight health score differently. One health overview uses vaccination 30%, body condition 20%, vet visits 15%, medication 15%, age 10%, breed risks 10%. The passport health score doc/gap analysis uses preventive care 30%, vaccination 25%, weight 20%, data completeness 15%, recent wellness 10%.

Decision: use the passport score for MVP because it is easier to compute reliably from available records and is more passport-oriented. Keep the health overview version as a future advanced score variant.

## MVP Priority From Docs

The docs agree on this MVP critical path:

1. Auth and profiles.
2. Pet profiles and identity.
3. Health records.
4. Digital passport.
5. Documents and storage.
6. Sharing/co-owners.
7. Calendar/reminders.
8. AI/OCR as a high-priority enhancement.
9. Subscriptions once core value is reliable.

## Strategic Read

The docs are ambitious and mostly coherent at the product level. The weakness is implementation governance: many names, many schemas, many historical plans, and no single frozen source of truth. The next improvement should be less about inventing features and more about reducing drift.
